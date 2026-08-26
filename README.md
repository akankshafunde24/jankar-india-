# Jankar India

Citizen-first government information and RTI assistance hackathon prototype.

> **Citizens shouldn't need to understand government machinery to get information from it.**

## Public demo

RawGitHack development URL:
`https://raw.githack.com/akankshafunde24/jankar-india-/main/index.html`

RawGitHack controls this hostname and intentionally shows a short HTML confirmation/interstitial for security. A custom subdomain such as `jankar-india.raw.githack.com` cannot be configured by this repository.

Clean GitHub Pages target URL after one-time Pages activation:
`https://akankshafunde24.github.io/jankar-india-/`

## Redesigned citizen journey

- Ask Jankar works before login.
- Government/public information is shown before RTI is suggested.
- Subject location is detected from the question and kept separate from the citizen's current location.
- Central / State / Local routing is explained with “Why this authority?”.
- Verified official State RTI links are provided when configured, including the Arunachal Pradesh RTI information route.
- Detailed public-information results can be saved as PDF or visualised only when the user asks.
- RTI drafting happens only when more information is needed.
- RTI drafts use a clean Right to Information Act, 2005 application structure; AI notices stay outside the request text.
- Nothing is submitted automatically.
- My RTIs contains multiple demo statuses and response-document viewing.
- Response documents open in the “Did you actually get your answer?” experience with summary, document Q&A, missing-information review and optional visualisation.
- “Explore Data” is no longer a top-level feature.
- “RTI Guide” is now **Know About RTI**.
- Demo citizen name: **Tasmayee**.
- Logout is available from the user menu.
- CPIO Copilot remains future scope only.

## Trust rules

- Government sources only for factual public-information retrieval.
- No verified source → no factual claim.
- Current location is optional and never decides jurisdiction by itself.
- Synthetic response/demo content is labelled.
- No real RTI or appeal is submitted by the public static prototype.

## Demo login

Demo OTP: `246810`

No SMS is sent.

## Test status

- Previous FastAPI/backend scenario suite: **20/20 passed**.
- Redesigned client regression suite: **15/15 passed**.

See `TEST_REPORT.md` for the detailed QA matrix.

## Deployment

The public version is intentionally static so it can remain zero-cost. The repository includes a GitHub Pages workflow at `.github/workflows/pages.yml`.

To obtain the clean direct URL without RawGitHack's interstitial, enable GitHub Pages once in:

**Repository → Settings → Pages → Build and deployment → GitHub Actions**

The local/full architecture can later attach the open-source Ollama + government-only RAG pipeline without changing the citizen journey.
