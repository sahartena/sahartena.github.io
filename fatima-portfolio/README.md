# Fatima Elsheikh — Executive Portfolio

A single-page, production-ready portfolio for a PMP®-certified ERP Delivery Lead.
Semantic HTML5 + modern CSS + vanilla JavaScript. **No frameworks, no build step** —
open `index.html` and it works.

## Run locally

```bash
cd fatima-portfolio
python3 serve.py 8741        # dev server with caching disabled
# open http://127.0.0.1:8741/
```

`serve.py` is preferred over `python3 -m http.server` because it sends
`Cache-Control: no-store`, so edits always show on refresh. Opening
`index.html` directly from the file system also works.

## Deploy

The site is fully static — deploy the folder as-is:

- **GitHub Pages**: push the folder to a repo, enable Pages on the root.
- **Netlify / Vercel**: drag-and-drop the folder or point the project at it.
  No build command, publish directory = the folder itself.

After deploying, uncomment and fill in the canonical + `og:url` tags in
`<head>` (they ship commented out so a placeholder domain can never leak to
search engines), and make `og:image` an **absolute** URL (Open Graph requires
one), e.g. `https://your-domain/assets/og-cover.png`.

## Files

| File | Purpose |
|---|---|
| `index.html` | All content and structure (single page, anchor navigation) |
| `styles.css` | All design tokens and styling (CSS custom properties in `:root`) |
| `main.js` | Menu, smooth scrolling, scroll reveals, KPI counters, scrollspy, case-study accordions, timeline scrub |
| `assets/cv.pdf` | Fatima's CV (served by the "Download CV" button) |
| `assets/og-cover.png` | 1200×630 social-share card (regenerate after content changes) |
| `serve.py` | No-cache dev server |

## Replacing the placeholders

Everything that needs real data is marked with an HTML comment containing
`TODO`. List them all:

```bash
grep -rn "TODO" index.html
```

What each one is:

| Where | What to replace |
|---|---|
| `<head>` canonical + `og:url` (commented out) + `og:image` | Final production domain |
| Hero tagline (and `og:description`) | Positioning statement — confirm wording with Fatima |
| Hero metrics | `[25]+ ERP projects delivered` and `$[12]M+ budgets managed` — confirm real figures with Fatima (8+ years and 4 countries are from the CV) |
| Case-study stat chips & Result paragraphs | Quantified outcomes (`[95]% UAT pass rate`, etc.) — all bracketed numbers are illustrative until confirmed |
| Case-study Challenge paragraphs | Confirm/expand engagement details |
| Competencies → Platforms & Tools | Confirm the exact toolset (`Jira · MS Project · Product Backlogs`) |
| Timeline certification nodes | Actual PMP® and Odoo certification years |
| Credentials section | Real PMP® credential ID (`[PMP-0000000]`) |
| Testimonials | Three real quotes with names and titles |
| Leadership Profile portrait | Replace the SVG monogram placeholder with `<img src="assets/portrait.jpg" alt="Portrait of Fatima Elsheikh">` (drop the photo into `assets/`) |

Convention: visible placeholder values are wrapped in `[square brackets]` so
nothing invented can be mistaken for a verified fact.

### Swapping the CV

Replace `assets/cv.pdf` with the new file — the download button needs no change
(it downloads as `Fatima-Elsheikh-CV.pdf`).

### Regenerating the social card

With the local server running:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --screenshot=assets/og-cover.png --window-size=1200,630 --hide-scrollbars \
  "http://127.0.0.1:8741/"
```

## Design system (for future edits)

All tokens live in `:root` in `styles.css`:

- **Colors**: midnight navy `--navy-900: #0D1320`, warm off-white
  `--paper: #F7F4ED`, gold accent `--gold: #C6A35A` (dark surfaces) with a
  darker bronze step `--bronze: #7E611C` for WCAG AA contrast on light surfaces.
- **Type**: Fraunces (display serif, 500/600) + Inter (body, 400/500/600) via
  Google Fonts.
- **Motif**: the abstract Gantt-chart / critical-path SVGs in the hero,
  the dark bands, and the section dividers.

## Accessibility & behavior notes

- All animation (reveals, counters, smooth scroll, timeline scrub) is disabled
  under `prefers-reduced-motion` — guarded in both CSS and JS.
- The page is fully readable with JavaScript disabled; case-study bodies are
  force-expanded via a `<noscript>` style.
- Keyboard: skip link, visible focus rings, accordion buttons with
  `aria-expanded`, focus moves to the target section after anchor navigation.
