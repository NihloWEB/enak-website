# EN/AK — Inhalte bearbeiten & veröffentlichen

Die Seite wird mit **Eleventy (11ty)** gebaut: **Inhalte** liegen getrennt vom
Design in **`src/_data/*.json`** (zweisprachig EN/DE), die **Templates** in `src/`.
Beim `git push` baut **Vercel** automatisch (`npx @11ty/eleventy` → `_site/`).

Es gibt **zwei Wege** zu bearbeiten — wähle, was dir passt.

---

## Weg 1 — Pages CMS (Web-Oberfläche, empfohlen)

Bearbeiten im Browser, ohne Code, mit beschrifteten Feldern.

**Einmalig einrichten:**
1. Gehe auf **<https://app.pagescms.org>** → **Sign in with GitHub**.
2. Pages CMS für das Repo **`NihloWEB/aether-website`** autorisieren.
3. Das Projekt erscheint mit allen Inhaltsgruppen (Global, Home, Overview, Tech,
   Showcase, About, Contact) — die Struktur kommt aus **`.pages.yml`**.

**Bearbeiten:**
- Gruppe öffnen → Felder ändern (jeder Text hat **EN** und **DE**).
- **Save** → Pages CMS committet nach GitHub → Vercel deployt automatisch (~30 s).

---

## Weg 2 — Direkt in den Dateien (für Entwickler)

1. Inhalte liegen in **`src/_data/`** als JSON. Lokal bearbeiten:
   ```bash
   # einmalig
   npm install
   # Dev-Server mit Live-Reload (oder start.command doppelklicken)
   npm run dev        # → http://localhost:8080
   ```
2. Datei ändern, speichern → Browser lädt neu.
3. Veröffentlichen:
   ```bash
   git add -A && git commit -m "Inhalte aktualisiert" && git push
   ```

---

## Wo liegt welcher Inhalt?

| Datei | Inhalt |
|------|--------|
| `src/_data/site.json` | Markenname, Navigation, Kontakt-Link, Footer (global) |
| `src/_data/home.json` | Startseite: Hero, Manifest, Capabilities, Showcase-Leiste, Stats, Prozess, CTA |
| `src/_data/overview.json` | Seite **Überblick** |
| `src/_data/tech.json` | Seite **Technik** |
| `src/_data/showcase.json` | Seite **Showcase** (Projekte) |
| `src/_data/about.json` | Seite **Über uns** (Werte, Team, Meilensteine) |
| `src/_data/contact.json` | Seite **Kontakt** (Formular-Labels, Infos) |

**Zweisprachig:** Jeder Text ist ein Objekt mit `en` und `de`, z. B.
```json
"title": { "en": "Selected worlds.", "de": "Ausgewählte Welten." }
```

---

## Häufige Aufgaben

**Projekt hinzufügen** → in `showcase.json` einen Eintrag in `tiles` kopieren
(`angle` = Musterwinkel, `title`, `tag`, `meta`). Für die Startseiten-Leiste
ebenso in `home.json` → `showcase.tiles`. *(In Pages CMS: „+" in der Liste.)*

**Texte/Übersetzungen** → jeweiliges `en`/`de`-Feld ändern.

**Navigation/Markenname** → `site.json` (`nav`, `brand`, `footer`).

**Echte Bilder** → Dateien nach `assets/img/` legen; im Template die
`tile__media`-Fläche durch ein `<img>` ersetzen (Design bleibt CSS-basiert, bis
echte Bilder da sind).

**Design/Farben** → unverändert in `css/base/tokens.css` (Tokens). Templates in
`src/`, gemeinsames Layout in `src/_includes/base.njk`.

---

## Neue Unterseite (Entwickler)

1. `src/pages/<name>.njk` anlegen (Front-Matter `layout: base.njk` + Inhalt).
2. `src/_data/<name>.json` mit den Texten anlegen.
3. In `site.json` → `nav` einen Eintrag mit `url: "/pages/<name>/"` ergänzen.
4. Optional in `.pages.yml` eine Gruppe ergänzen, damit es im CMS editierbar ist.

---

## Sicherheit (CSP) — beim Einbinden externer Inhalte

Auf Vercel sendet die Seite eine strenge **Content-Security-Policy** (in
`vercel.json`). Externe Quellen (YouTube, Google Fonts, Analytics, fremde Bilder)
werden geblockt, bis du sie dort freigibst. Details + Beispiele stehen weiterhin in
`vercel.json`; nach dem Deploy auf <https://securityheaders.com> prüfbar.

> Architektur & Technik im Detail: siehe `CLAUDE.md`.
