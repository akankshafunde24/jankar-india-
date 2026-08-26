# Jankar India

AI-assisted citizen information and RTI hackathon prototype.

## Public demo
The zero-cost static demo is published from this public repository and can be rendered directly through a static GitHub CDN.

Direct demo URL:
`https://raw.githack.com/akankshafunde24/jankar-india-/main/index.html`

GitHub Pages target URL (after Pages workflow/settings activation):
`https://akankshafunde24.github.io/jankar-india-/`

- Demo OTP: `246810`
- No real RTI is submitted
- All simulated/synthetic information is clearly labelled
- Factual source links are restricted to the Government Source Registry
- Central / State / Local routing is demonstrated
- CPIO Copilot is future scope only

## Test status
The FastAPI source build was validated against 20 API scenarios before publication, including authentication, source validation, Central/State/Local routing, RTI approval gates, response analysis and appeal assistance. See `TEST_REPORT.md`.

The public build implements the citizen demo flow entirely in-browser so it requires no paid backend hosting.

## Deployment
A GitHub Pages workflow is included at `.github/workflows/pages.yml`. If GitHub Pages is not already enabled for this repository, enable Pages/GitHub Actions once in repository settings or manually run the workflow.
