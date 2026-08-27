from __future__ import annotations

import io
import os
import re
import urllib.parse
from typing import Any

import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pypdf import PdfReader

app = FastAPI(title="Jankar India Government Retrieval API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

USER_AGENT = "JankarIndiaHackathon/0.1 (+government-information-retrieval)"
REQUEST_TIMEOUT = 12
MAX_SOURCES = 5
MAX_SOURCE_CHARS = 14000
OLLAMA_URL = os.getenv("OLLAMA_URL", "").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")

GOV_DOMAIN_RE = re.compile(r"(^|\.)(gov\.in|nic\.in)$", re.I)

CENTRAL_HINTS = {
    "railway": "Ministry of Railways",
    "income tax": "Income Tax Department",
    "passport": "Ministry of External Affairs",
    "national highway": "Ministry of Road Transport and Highways / NHAI",
    "epfo": "Employees' Provident Fund Organisation",
    "aadhaar": "Unique Identification Authority of India",
}

STATE_NAMES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry",
]


class AskRequest(BaseModel):
    question: str = Field(min_length=5, max_length=1200)
    subject_location: str | None = Field(default=None, max_length=200)


class SourceOut(BaseModel):
    title: str
    organization: str
    domain: str
    url: str
    government_level: str | None = None


class AskResponse(BaseModel):
    found: bool
    answer: str
    key_points: list[str]
    subject_location: str | None
    jurisdiction: str
    authority: str
    routing_reason: str
    confidence: str
    sources: list[SourceOut]
    structured_data: list[dict[str, Any]] | None = None
    rti_portal_url: str | None = None
    rti_portal_label: str | None = None


def _host(url: str) -> str:
    return urllib.parse.urlparse(url).netloc.lower().split(":")[0]


def is_verified_government_url(url: str) -> bool:
    host = _host(url)
    return bool(host and GOV_DOMAIN_RE.search(host))


def clean_search_redirect(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    if "duckduckgo.com" in parsed.netloc and parsed.path.startswith("/l/"):
        qs = urllib.parse.parse_qs(parsed.query)
        if "uddg" in qs:
            return urllib.parse.unquote(qs["uddg"][0])
    return url


def search_government_web(query: str) -> list[dict[str, str]]:
    search_q = f"{query} (site:gov.in OR site:nic.in)"
    url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(search_q)
    r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    out: list[dict[str, str]] = []
    seen: set[str] = set()
    for item in soup.select(".result"):
        a = item.select_one(".result__a")
        if not a:
            continue
        href = clean_search_redirect(a.get("href") or "")
        if not href.startswith("http") or not is_verified_government_url(href):
            continue
        if href in seen:
            continue
        seen.add(href)
        snippet_el = item.select_one(".result__snippet")
        out.append({
            "title": a.get_text(" ", strip=True),
            "url": href,
            "snippet": snippet_el.get_text(" ", strip=True) if snippet_el else "",
        })
        if len(out) >= MAX_SOURCES:
            break
    return out


def extract_pdf_text(content: bytes) -> str:
    reader = PdfReader(io.BytesIO(content))
    pages: list[str] = []
    for page in reader.pages[:25]:
        try:
            pages.append(page.extract_text() or "")
        except Exception:
            continue
    return "\n".join(pages)[:MAX_SOURCE_CHARS]


def fetch_source_text(url: str) -> str:
    r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT)
    r.raise_for_status()
    ctype = (r.headers.get("content-type") or "").lower()
    if "pdf" in ctype or url.lower().split("?")[0].endswith(".pdf"):
        return extract_pdf_text(r.content)
    soup = BeautifulSoup(r.text, "html.parser")
    for tag in soup(["script", "style", "noscript", "svg", "nav", "footer"]):
        tag.decompose()
    return re.sub(r"\s+", " ", soup.get_text(" ", strip=True))[:MAX_SOURCE_CHARS]


def infer_subject_location(question: str, explicit: str | None) -> str | None:
    if explicit and explicit.strip():
        return explicit.strip()
    q = question.lower()
    for state in sorted(STATE_NAMES, key=len, reverse=True):
        if state.lower() in q:
            return state
    return None


def infer_route(question: str, location: str | None, results: list[dict[str, str]]) -> tuple[str, str, str, str]:
    q = question.lower()
    for hint, authority in CENTRAL_HINTS.items():
        if hint in q:
            return "CENTRAL", authority, f"The subject '{hint}' is ordinarily handled by a Central Government authority.", "High"

    title_blob = " ".join(x.get("title", "") for x in results).lower()
    if any(k in q for k in ["municipal", "municipality", "corporation", "panchayat", "ward"]):
        authority = "Relevant Local Public Authority"
        return "LOCAL", authority, "The question appears to concern a municipal, panchayat or other local-body function.", "Medium"

    if location:
        authority = f"Relevant public authority for {location}"
        return "STATE", authority, f"The requested subject is associated with {location}; the retrieved official sources should be used to confirm the exact department.", "Medium"

    if any(s.lower() in title_blob for s in STATE_NAMES):
        return "STATE", "Relevant State Government Public Authority", "The retrieved official-source titles indicate a State Government context.", "Medium"

    return "UNKNOWN", "Relevant Public Authority", "The exact authority cannot be determined confidently from the question and retrieved source metadata alone.", "Low"


def organization_from_domain(domain: str) -> str:
    return domain


def ask_ollama(question: str, context: str) -> tuple[str, list[str]] | None:
    if not OLLAMA_URL:
        return None
    system = (
        "You are Jankar India. Answer ONLY from the supplied official Indian government-source context. "
        "Do not use model memory. If the evidence is insufficient, explicitly say what is missing. "
        "Do not invent figures, departments, dates or legal conclusions. Keep the answer citizen-friendly."
    )
    prompt = f"{system}\n\nQUESTION:\n{question}\n\nVERIFIED GOVERNMENT CONTEXT:\n{context}\n\nReturn a concise detailed answer followed by 2-5 key points."
    try:
        r = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
            timeout=45,
        )
        r.raise_for_status()
        text = (r.json().get("response") or "").strip()
        if not text:
            return None
        lines = [x.strip(" •-\t") for x in text.splitlines() if x.strip()]
        return text, lines[:5]
    except Exception:
        return None


def deterministic_answer(question: str, results: list[dict[str, str]], contexts: list[str]) -> tuple[str, list[str]]:
    snippets = [r.get("snippet", "") for r in results if r.get("snippet")]
    evidence = " ".join(snippets).strip()
    if not evidence:
        evidence = " ".join(c[:800] for c in contexts if c).strip()
    if not evidence:
        return (
            "Verified government sources were identified, but Jankar could not extract enough readable information to answer the question safely.",
            ["The source links are still provided for verification.", "You may refine the question or request the missing records through RTI."],
        )
    answer = (
        "Jankar found current official government sources relevant to your question. "
        "The extracted government-source evidence is summarised below without adding information from non-government websites or model memory: "
        + evidence[:1800]
    )
    return answer, [x["title"] for x in results[:4]]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/ask-jankar", response_model=AskResponse)
def ask_jankar(req: AskRequest) -> AskResponse:
    location = infer_subject_location(req.question, req.subject_location)
    try:
        results = search_government_web(req.question)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Government-source discovery unavailable: {exc}") from exc

    if not results:
        jurisdiction, authority, reason, confidence = infer_route(req.question, location, [])
        return AskResponse(
            found=False,
            answer="Verified government information could not be found for this question in the live government-source search.",
            key_points=["Jankar did not use non-government sources to fill the gap.", "You can refine the query or proceed to RTI for records that are not publicly available."],
            subject_location=location,
            jurisdiction=jurisdiction,
            authority=authority,
            routing_reason=reason,
            confidence=confidence,
            sources=[],
            structured_data=None,
            rti_portal_url="https://rtionline.gov.in/" if jurisdiction == "CENTRAL" else None,
            rti_portal_label="Central RTI Online" if jurisdiction == "CENTRAL" else None,
        )

    contexts: list[str] = []
    verified_sources: list[SourceOut] = []
    for result in results:
        url = result["url"]
        if not is_verified_government_url(url):
            continue
        try:
            text = fetch_source_text(url)
        except Exception:
            text = ""
        contexts.append(text)
        domain = _host(url)
        verified_sources.append(SourceOut(
            title=result["title"],
            organization=organization_from_domain(domain),
            domain=domain,
            url=url,
            government_level=None,
        ))

    context_blob = "\n\n".join(
        f"SOURCE {i+1}: {results[i]['title']}\nURL: {results[i]['url']}\nTEXT: {contexts[i]}"
        for i in range(min(len(results), len(contexts)))
    )[:45000]

    ollama = ask_ollama(req.question, context_blob)
    if ollama:
        answer, points = ollama
    else:
        answer, points = deterministic_answer(req.question, results, contexts)

    jurisdiction, authority, reason, confidence = infer_route(req.question, location, results)
    return AskResponse(
        found=bool(verified_sources),
        answer=answer,
        key_points=points,
        subject_location=location,
        jurisdiction=jurisdiction,
        authority=authority,
        routing_reason=reason,
        confidence=confidence,
        sources=verified_sources,
        structured_data=None,
        rti_portal_url="https://rtionline.gov.in/" if jurisdiction == "CENTRAL" else None,
        rti_portal_label="Central RTI Online" if jurisdiction == "CENTRAL" else None,
    )
