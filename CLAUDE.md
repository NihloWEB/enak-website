# CLAUDE.md — EN/AK Project Worksheet

Guidance for Claude Code (and humans) working in this repository.

---

## 1. What this project is

**EN/AK** is a futuristic **creative-studio** site (landing page + 5 subpages):
heavy on motion, scroll effects and **liquid glass**, in an **Apple-like
monochrome** aesthetic. Brand / copy / projects are **placeholders**.

- **Build:** **Eleventy (11ty)** static-site generator. Content is separated from
  design and rendered into static HTML at build time.
- **Front-end:** vanilla **CSS + ES-module JS**, no client framework, no runtime deps.
- **Language:** bilingual **EN / DE** (client-side toggle; both strings rendered into
  `data-en` / `data-de`, swapped by `js/core/i18n.js`).
- **Content editing:** Git-based CMS (**Pages CMS**) editing `src/_data/*.json`.
- **Hosting:** **Vercel** (auto-build on push), custom domain **en-ak.com** (DNS at IONOS —
  see §9). Type: **Lineal** variable font (SIL OFL).

### Locked-in decisions
| Choice | Value |
|--------|-------|
| Concept | Creative studio |
| Visual mood | Apple-like monochrome + liquid glass |
| Navigation | Overview · Tech · Showcase · About · Contact |
| Language | Bilingual EN / DE |
| Build | Eleventy → `_site/` |
| CMS | Pages CMS (`.pages.yml`), GitHub-backed |
| Host | Vercel (`buildCommand: npx @11ty/eleventy`, `outputDirectory: _site`) |
| Domain | `en-ak.com` (production) + `www.en-ak.com` (redirects to it); DNS stays at IONOS registrar |
| Brand | **EN/AK** (placeholder — edit in `src/_data/site.json`) |

---

## 2. How to run

```bash
npm install      # once
npm run dev      # Eleventy + live reload → http://localhost:8080
npm run build    # build into _site/
```
Or double-click `start.command`. **`_site/` is generated** (git-ignored) — never
edit it by hand.

---

## 3. Folder structure

```
aether/
├── src/                      # Eleventy input
│   ├── _data/                # CONTENT (editable, bilingual JSON)
│   │   ├── site.json         #   global: brand, nav, contact, footer
│   │   ├── home.json         #   landing page
│   │   └── overview/tech/showcase/about/contact.json
│   ├── _includes/
│   │   └── base.njk          # layout: head, bg-field, nav, menu, footer
│   ├── index.njk             # home template (permalink /)
│   └── pages/                # subpage templates → /pages/<name>/
├── css/                      # design system (passed through unchanged)
│   ├── base/ components/ sections/  + main.css (the only linked stylesheet)
├── js/                       # behaviour (passed through unchanged)
│   ├── core/ effects/ components/  + main.js (the only module entry)
├── assets/fonts/lineal/      # Lineal woff2/woff + OFL.txt
├── _site/                    # BUILD OUTPUT (git-ignored, Vercel serves this)
├── .pages.yml                # Pages CMS schema (field definitions)
├── eleventy.config.js        # build config (input src, passthrough css/js/assets)
├── vercel.json               # build + security headers
└── EDITING.md / README.md / CLAUDE.md
```

**Key idea:** `css/`, `js/`, `assets/` are **copied verbatim** by Eleventy
(`addPassthroughCopy`). The design/animation code is identical to a plain static
site — Eleventy only assembles the HTML from templates + data.

---

## 4. Content model

Every page has a data file in `src/_data/`. Templates read it and render the same
HTML as before, emitting **both languages** into `data-en` / `data-de`.

- A translatable string is an object: `{ "en": "...", "de": "..." }`.
- Lists (projects, stats, steps, chips, nav) are arrays of objects.
- Links carry their own `url`.
- The visible (server-rendered) text uses the **English** value; `i18n.js` swaps to
  the chosen language on load. Because the copy is in the HTML, **SEO is preserved**.

Example (`home.json` → rendered by `src/index.njk`):
```json
"cta": { "title": { "en": "Let's build…", "de": "Bauen wir…" } }
```
```njk
<h2 data-en="{{ home.cta.title.en }}" data-de="{{ home.cta.title.de }}">{{ home.cta.title.en }}</h2>
```

Cross-page reuse: subpage stats reference `home.stats` (single source of truth).

---

## 5. CMS (Pages CMS)

`.pages.yml` describes every editable field (labels, types, bilingual objects,
lists). Editors use <https://app.pagescms.org> (GitHub login) → saving commits to
the repo → Vercel rebuilds. To expose **new** content in the CMS, add it to both the
data file/template **and** `.pages.yml`. Validate the YAML after edits (it uses
anchors `&bi` / `&bil` for the EN/DE field pairs).

---

## 6. Design system (`css/base/tokens.css`)

All design decisions are CSS custom properties on `:root` — re-skin by editing
tokens, never hard-code values. Palette: `--bg-0` (near-black), `--ink` (near-white)
+ opacity steps, `--line` hairlines, `--glow` (the only hint of color, for sheen).
**Liquid glass** = `.glass` (`css/components/glass.css`): backdrop-filter, 1px
specular `::before`, pointer-sheen `::after`. Glass is reserved for nav, the CTA
band, discipline visuals and the contact panels; content grids use an **editorial
hairline** style (`.card`, `.stat`, `.step`, `.member`).

---

## 7. Animation system

Native scroll is kept (so `position: sticky` works); one shared self-throttling rAF
loop (`js/core/scroll-engine.js`) feeds scrubbed effects.

| Effect | Module | Hook |
|--------|--------|------|
| Entrance reveal | `effects/reveal.js` | `data-reveal[="fade\|left\|right\|scale\|blur"]`, group `data-reveal-group="90"` |
| Parallax | `effects/parallax.js` | `data-parallax="0.18"` |
| Variable-weight hero | `effects/hero.js` | `data-hero` |
| Word-by-word manifesto | `effects/text-reveal.js` | `data-text-reveal` + `data-words-en/de` |
| Pinned horizontal rail | `effects/horizontal.js` | `data-horizontal` |
| Custom cursor (reticle) | `components/cursor.js` | auto; replaces system cursor, exact tracking, aperture on hover |
| Magnetic buttons | `components/magnetic.js` | `data-magnetic="0.4"` |
| Tilt + sheen | `components/tilt.js` | `data-tilt="6"` |
| Selector ("selections") | `components/selector.js` | `data-selector` + `.segmented` |
| Counters | `components/counters.js` | `data-count="120" data-suffix="+"` |
| Nav condense + menu | `components/nav.js` | `data-nav`, `data-menu`, `data-burger` |

**Accessibility:** every effect respects `prefers-reduced-motion`; reveals only
apply under `html.js` (no-JS fallback shows everything); the custom cursor is
disabled on touch / reduced-motion.

---

## 8. Common edits → see `EDITING.md`

Add a project, change copy, rename the brand, add a page, re-skin — all documented
in `EDITING.md` (CMS or direct-file workflow).

---

## 9. Deploy & security

- **Vercel** builds on every push (`vercel.json`). Output `_site/`, clean URLs.
- **Security headers** in `vercel.json`: CSP (with a sha256 hash for the inline boot
  script), HSTS, X-Frame-Options, Permissions-Policy, COOP. Adding external
  resources (CDN/fonts/embeds) requires extending the CSP — see `EDITING.md` §CSP.
- If you change the inline `<head>` script in `base.njk`, recompute its CSP hash:
  `printf "%s" "SCRIPT" | openssl dgst -sha256 -binary | openssl base64`.
- **Custom domain:** `en-ak.com` (production) + `www.en-ak.com` (Vercel 308 redirect to it) are
  live, both with valid Vercel-issued SSL. DNS stays at **IONOS** (not delegated to Vercel)
  because the domain also runs iCloud Mail (MX/SPF/DKIM records) — only an `A` record (`@`)
  and a `CNAME` (`www`) point at Vercel there. **Never touch the MX/TXT/DKIM records** when
  editing DNS for this domain.
- **IONOS gotcha:** IONOS' own "Domain-Weiterleitung" (forwarding) feature can silently
  override manually-set A/CNAME records and has no delete button in its UI. If the domain
  stops resolving to Vercel, check `Details → Verwendungsart` isn't set to "Weiterleitung" —
  removing it may require IONOS live support chat.

---

## 10. Credits

Typeface **Lineal** © Velvetyne Type Foundry (Frank Adebiaye, Anton Moglia, Ariel
Martín Pérez) — SIL Open Font License 1.1 (`assets/fonts/lineal/OFL.txt`), credited
in the footer.
