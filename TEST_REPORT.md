# Jankar India — Pre-Deployment Test Report

Date: 26 August 2026

## Backend/API scenario suite

20/20 scenarios passed using FastAPI TestClient.

| # | Scenario | Result |
|---|---|---|
| 1 | Health endpoint | PASS |
| 2 | Landing page renders Jankar branding | PASS |
| 3 | Invalid mobile number rejected | PASS |
| 4 | Valid demo OTP request | PASS |
| 5 | Wrong OTP rejected | PASS |
| 6 | Demo OTP accepted | PASS |
| 7 | Government Source Registry exposes verified sources only | PASS |
| 8 | Indian Railways query with Pune subject location routes CENTRAL | PASS |
| 9 | Municipal Corporation query routes LOCAL | PASS |
| 10 | Maharashtra State road query routes STATE | PASS |
| 11 | Unclear query requests clarification | PASS |
| 12 | Railway demo information is labelled synthetic and avoids unnecessary RTI | PASS |
| 13 | Missing public information recommends RTI path | PASS |
| 14 | RTI draft blocked for UNKNOWN jurisdiction | PASS |
| 15 | AI-assisted draft declares user approval requirement | PASS |
| 16 | Submission is blocked without explicit approval | PASS |
| 17 | Approved submission is clearly marked DEMO and not sent to government | PASS |
| 18 | Sample response is classified PARTIALLY_ANSWERED and visualization is synthetic | PASS |
| 19 | Appeal draft requires citizen approval | PASS |
| 20 | Too-short/insufficient question is rejected | PASS |

## Public static build checks

- JavaScript syntax validation passed for all four deployed client chunks (`app1.js`–`app4.js`).
- Responsive CSS includes desktop, tablet and mobile breakpoints.
- Government-source links are limited to the configured official-source registry.
- Demo OTP is `246810`; no SMS is sent.
- Public static build uses deterministic safe browser logic so no paid backend or AI API is required.
- No real RTI or appeal is submitted.
- Synthetic response/data is visibly labelled.

## Browser automation note

Automated browser execution from the build sandbox was blocked by the environment's local-navigation policy, so full Playwright UI automation could not be completed there. API/business-flow testing and JavaScript syntax validation passed before publication.

## Scope disclosure

The hosted static build is the zero-cost public hackathon demo. The separate local FastAPI source build can use Ollama when run on a machine where Ollama is installed. CPIO Copilot remains future scope only.
