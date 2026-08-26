# Jankar India — Regression Test Report

Date: 27 August 2026

## Previously validated backend/API suite

20/20 FastAPI scenarios passed before the first public deployment, covering authentication, source validation, Central/State/Local routing, RTI approval gates, response analysis and appeal assistance.

## Redesigned public client regression suite

15/15 focused regression scenarios passed against the redesigned client logic using a Node VM test harness.

| # | Scenario | Result |
|---|---|---|
| 1 | Landing page renders the question-first CTA | PASS |
| 2 | Arunachal Pradesh is extracted as RTI subject location from the query | PASS |
| 3 | Indian Railways query remains CENTRAL even when Pune is mentioned | PASS |
| 4 | Arunachal Pradesh subject routes to STATE | PASS |
| 5 | Municipal Corporation request routes LOCAL | PASS |
| 6 | Central Railway expenditure query returns detailed public-information data | PASS |
| 7 | Missing Arunachal public detail produces an information-gap flow instead of a fabricated answer | PASS |
| 8 | RTI draft uses “Right to Information Act, 2005” | PASS |
| 9 | AI/internal formatting notices are absent from the RTI application body | PASS |
| 10 | Demo applicant name is Tasmayee | PASS |
| 11 | My RTIs displays multiple statuses | PASS |
| 12 | Response document experience includes summary, missing-information check and on-demand visualisation | PASS |
| 13 | “Know about RTI” page includes what RTI is and why it exists | PASS |
| 14 | Explore Data is absent from primary navigation | PASS |
| 15 | Logout is available for authenticated users | PASS |

## Additional implementation checks

- Ask Jankar is available before login; login is deferred until personal/save/submission/tracking actions.
- Current location remains optional and separate from RTI subject location.
- Subject location is detected from the user's question first and remains editable.
- Authority routing is automatic for recognised subjects; the citizen is shown why the authority was selected.
- Arunachal Pradesh State routing includes a verified official government RTI information link when applicable.
- The prominent “Open official source” CTA was removed; official sources are displayed as contextual evidence rows instead.
- Visualisation is no longer a standalone navigation destination; it appears only after public information is found or an RTI response document is opened.
- Information found through Ask Jankar can be rendered as a printable report using the browser's Save as PDF flow.
- RTI response documents can be opened from My RTIs when a response is available.
- The response-understanding experience asks “Did you actually get your answer?” and offers summary, document Q&A, missing-information review and on-demand visualisation.
- “Live government submission” wording was removed. The current public build explicitly records demo submissions only.
- No RTI or appeal is automatically submitted.
- The public static demo remains zero-cost and does not require a paid AI or backend API.

## Government-source verification note

The preconfigured railway capital-outlay example uses Government of India Union Budget Statement 16 values/categories. The client preserves Actual/Revised/Budget labels so differently classified figures are not silently presented as equivalent actual expenditure.

## Browser automation limitation

The execution sandbox cannot navigate to the public CDN host, so full remote-browser automation was not available. JavaScript syntax checks and focused business-flow regression tests passed before publication.

## Scope disclosure

The hosted static build demonstrates the citizen experience with deterministic, source-controlled logic so it can remain fully free. The local architecture can later attach the open-source Ollama/RAG layer. CPIO Copilot remains future scope only.
