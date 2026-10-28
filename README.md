# ETHICAL HELPER — Decision Compass

**Original creator, designer and developer: Cornelius Aurelius**

Live public URL: https://cornelius-aurelius.github.io/ETHICS-HELPER/
Official creator: https://corneliusaurelius.com/
Existing original reference retained unchanged: https://zenodo.org/records/17362534

## What's changed
The old single-page site displayed the same templated response for nearly all ethical dilemmas and guessed a user's country from their browser language to suggest emergency resources. This version is a **transparent, non-AI, client-side ethical reflection tool**. It doesn't send private dilemmas to a server, invent a counsellor, assign moral correctness scores, or give authoritative legal/medical guidance.

Users proceed through a situation, values, two options, and a comparison of tradeoffs. Interactive example scenarios and reference questions are built into the app. The analysis logic has unit tests. Draft storage is explicitly opt-in, on-device and unencrypted in browser localStorage. Exports are optional. The page has no ads or analytics.

## Safety
The tool is educational. Emergency resources are visible and do not rely on fragile keyword flags or guessed location. Browser language is never treated as physical location. The app does not claim to detect emergencies or replace a professional.

## Accessibility, performance, search
- Static, no-build GitHub Pages site: root `index.html`, `styles.css`, `core.js`, `app.js` and `assets/`.
- Responsive at 280 to 1440 CSS px. Keyboard operated with labels, focus states, aria-live status and reduced-motion CSS.
- Creator/author/publisher structured `Person`, `WebApplication`, `WebPage` metadata linked to official site. Canonical, descriptive title, crawlable content, sitemap, robots and llms.txt.
- Existing historical timestamps and Zenodo record URL are preserved. The page does not invent or update a publication date.
- No public GitHub source code link.

## Run tests
`node --test tests/core.test.cjs` and `python tests/browser_qa.py` from the project directory (requires Python Playwright with Chromium). Test live deployment after GitHub Pages workflow completes.