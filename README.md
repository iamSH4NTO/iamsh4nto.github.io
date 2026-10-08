# iamSH4NTO — GitHub Profile Site

A personal developer profile site built with vanilla HTML, CSS, and modern JavaScript.
Designed with a dark GitHub-app-inspired shell and violet accents.

## Architecture & Data Loading
- Fetches live profile, repository stats, and heatmap contributions client-side via GitHub APIs.
- Uses Promise.allSettled with independent offline fallback to assets/data/fallback.json.
- Implements a 6-hour client-side cache in localStorage (skf-site-cache-v1) for fast loads.
- Zero build step, zero frameworks, no external libraries, and fully dark-themed.

## Local Preview
1. Run a local web server: `python3 -m http.server 8899`
2. Open `http://localhost:8899` in your web browser.
3. Search and filter repositories live, toggle tabs, or test responsive viewports.
