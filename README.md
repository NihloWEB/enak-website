# EN/AK — Creative Studio Website

A futuristic, monochrome, **liquid-glass** site with Apple-style scroll motion.
Built with **Eleventy (11ty)** — content lives in editable data files and is
rendered into static HTML. Vanilla CSS/JS, **no client framework**, bilingual
**EN/DE**, editable via a **Git-based CMS** (Pages CMS).

> Brand, copy and projects are **placeholders**. See `CLAUDE.md` for the full
> worksheet and `EDITING.md` for how to edit content.

## Develop

```bash
npm install        # once
npm run dev        # Eleventy dev server + live reload → http://localhost:8080
npm run build      # build static site into _site/
```

Or double-click **`start.command`** (installs deps on first run, then serves).

## Edit content

Content is in **`src/_data/*.json`** (bilingual). Two ways to edit:

1. **Pages CMS** (web UI, no code): <https://app.pagescms.org> → sign in with
   GitHub → open this repo → edit fields → Save (commits + auto-deploys).
2. **Directly**: edit the JSON in `src/_data/`, `npm run dev` to preview, push.

See **`EDITING.md`** for details.

## Deploy (Vercel)

Configured in `vercel.json` (`buildCommand: npx @11ty/eleventy`,
`outputDirectory: _site`) — **every push to `main` auto-deploys**. Security
headers (CSP, HSTS, …) are applied there too.

## Structure

```
src/
  _data/        # editable content (site + per page), bilingual JSON
  _includes/    # base.njk layout (head, nav, menu, footer)
  index.njk     # home
  pages/        # overview · tech · showcase · about · contact
css/  js/  assets/   # design, scripts, fonts — passed through unchanged
.pages.yml      # Pages CMS schema   ·   eleventy.config.js   ·   vercel.json
```

## Credits

Typeface **Lineal** by Velvetyne Type Foundry — SIL Open Font License 1.1
(`assets/fonts/lineal/OFL.txt`).
