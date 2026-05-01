# Yoon Plasma Group Website — Design Spec

**Date:** 2026-05-01
**Owner:** Young Dae Yoon (UCLA Department of Physics & Astronomy)
**Domain:** yoonplasmagroup.com
**Repo (planned):** `github.com/<account>/yoonplasmagroup`

## 1. Goal

Build a simple, fast, frequently-editable website for the Yoon Plasma Group at UCLA. Inspired in feel by [osiris-code.github.io](https://osiris-code.github.io/) (clean, scholarly, minimal) and in tab structure by the existing yoonplasmagroup.com (Research, Team, Publications, Press, Contact), but explicitly easier to edit than the current site so that publications, news, and team updates can be made routinely without friction.

The site is the public face of the group: prospective students, collaborators, journalists, and grant reviewers should be able to find what the group works on, who is in it, what they've published, and how to reach them — within a few seconds of landing.

## 2. Non-goals

Things explicitly out of scope for v1, kept out so the project stays shippable:

- No CMS / browser-based admin UI. All edits are made through Markdown files and git.
- No comment system, newsletter, search, or analytics dashboard.
- No automatic arXiv / ORCID / Google Scholar import. Publications are entered manually.
- No PDF rendering or annotation; PDFs are static files behind links.
- No dark mode, no internationalization, no animations beyond default link-hover.
- No interactive simulations, plots, or WebGL on the site.

Each is purely additive later; none are designed-out architecturally.

## 3. Architecture

### 3.1 Stack

- **Generator:** Jekyll. Reason: zero-config build on GitHub Pages, lots of academic-site precedent, the closest match to the osiris-code aesthetic without fighting the framework.
- **Hosting:** GitHub Pages, native Jekyll build (no GitHub Actions). Push to `main` triggers an automatic rebuild and publish in ~30 seconds.
- **Domain:** Custom domain `yoonplasmagroup.com` via a `CNAME` file in the repo plus DNS records at the registrar pointing at GitHub Pages.
- **Plugins:** Restricted to the [GitHub Pages whitelist](https://pages.github.com/versions/). If we ever need an off-list plugin, the migration path is "switch to GitHub Actions building Jekyll" — same output, ~20 lines of YAML; not anticipated.
- **JavaScript:** Effectively zero. The only client-side JS is a small (~10 line) snippet that randomizes which hero image is shown on each homepage load.

### 3.2 Tradeoffs accepted

- *Manual publication entries.* Auto-import is convenient but every importer has reliability and formatting issues; manual entry is fast given the rate of new papers.
- *Whitelisted plugins only.* Limits what we can do, but covers everything in this spec.
- *No CMS.* All editors must be comfortable with git or the GitHub web editor. Acceptable because the user prefers this workflow.

## 4. Information Architecture

### 4.1 Top navigation

Five tabs, in this order, plus a brand link returning to the homepage:

1. (Brand: "Yoon Plasma Group") → `/`
2. Research → `/research/`
3. Team → `/team/`
4. Publications → `/publications/`
5. Press → `/press/`
6. Contact → `/contact/`

### 4.2 Pages

| Page | URL | Content source | Notes |
|---|---|---|---|
| Home | `/` | `index.md` + `_includes/hero.html`, `_includes/news-snippet.html` | Photo-hero with rotating image, About blurb, latest 5 news items, link to news archive |
| Research | `/research/` | `research.md` | Free-form Markdown describing research themes, with embedded figures |
| Team | `/team/` | `team.md` (template) renders the `_team` collection | Two sections on one page: "Current" and "Alumni", filtered by `role` |
| Publications | `/publications/` | `publications.md` (template) renders the `_publications` collection | Reverse chronological, grouped by year, each year a heading |
| Press | `/press/` | `press.md` (template) renders the `_press` collection | Reverse chronological list of media coverage / outlets |
| News archive | `/news/` | `news.md` (template) renders the `_news` collection | Reverse chronological full archive; not in top nav, linked from homepage |
| Contact | `/contact/` | `contact.md` | Email, office (Knudsen Hall room TBD), lab, mailing address. Optional embedded map; not required for v1. |

### 4.3 News on the homepage

News is the most-frequently-edited content type. It surfaces on the homepage (latest 5 entries) and has its own archive at `/news/`. It is not promoted to a top-nav tab to avoid visual clutter for the 90% of visitors who only need the latest items.

### 4.4 Team grouping

Team has two visual sections rendered on one page (not separate tabs): "Current Members" (PI, Postdocs, Grad Students, Undergrads) and "Alumni". The split is driven by the `role` front-matter field on each `_team/*.md` entry. Within "Current", entries are ordered: PI first, then Postdocs, then Grad Students, then Undergrads, alphabetical within each rank.

## 5. Content Data Model

All content is Markdown with YAML front matter. Lists of records (publications, team, news, press) are Jekyll **collections** — one Markdown file per record — rather than a single mega-YAML data file. Tradeoff: more files, but each entry is self-contained, easier to diff in git, and supports optional rich body content (abstract, figure, notes).

### 5.1 Repository layout

```
yoonplasmagroup/
  _config.yml                 # Jekyll config: site title, nav order, collections config
  Gemfile                     # Ruby deps for local preview
  CNAME                       # contains: yoonplasmagroup.com
  README.md                   # editing instructions for future contributors

  index.md                    # Homepage
  research.md                 # Research page
  team.md                     # Team page (renders _team)
  publications.md             # Publications page (renders _publications)
  press.md                    # Press page (renders _press)
  news.md                     # News archive (renders _news)
  contact.md                  # Contact page

  _team/                      # one file per team member
    1-young-dae-yoon.md
    2-jane-doe.md
    ...
  _publications/              # one file per paper
    2026-yoon-prl-reconnection.md
    2025-doe-yoon-apj-whistlers.md
    ...
  _news/                      # one file per news item
    2026-04-15-prl-paper.md
    2026-03-01-new-students.md
    ...
  _press/                     # one file per press item
    2025-quanta-magazine.md
    ...

  _layouts/                   # HTML templates (default, page, home)
    default.html
    page.html
    home.html
  _includes/                  # reusable HTML fragments
    nav.html
    footer.html
    hero.html                 # rotating-image hero, used on homepage only
    news-snippet.html         # latest-N news for homepage
  _sass/                      # SCSS partials
  assets/
    css/main.scss             # imports _sass/* and produces site CSS
    js/hero-rotate.js         # ~10-line random hero image picker
    hero/                     # rotating hero images — drop new files here
      reconnection-sim.jpg
      tokamak-cutaway.jpg
      ...
    team/                     # headshots, named to match team file slugs
      young-dae-yoon.jpg
      ...
    images/                   # other figures used in Research, etc.
    pdfs/                     # optional self-hosted paper PDFs

  docs/superpowers/specs/     # this spec and any future ones
```

### 5.2 Front matter schemas

**`_publications/<slug>.md`:**
```yaml
---
title: "Theory of magnetic reconnection in collisionless plasmas"
authors: "Y. D. Yoon, J. Doe, J. Smith"
journal: "Physical Review Letters"
volume: "133"
pages: "215001"
year: 2026
date: 2026-04-15        # used for sorting; required
doi: "10.1103/PhysRevLett.133.215001"     # optional
arxiv: "2604.12345"                        # optional
link: "https://..."                        # optional, if no DOI/arxiv. (Named `link`, not `url`, because Jekyll auto-populates `url` on every collection item with a permalink.)
pdf: "/assets/pdfs/yoon-2026-prl.pdf"     # optional, self-hosted PDF
featured: false                            # optional, true = highlight
---
```
Body content is optional. If present, it can be a Markdown abstract, a figure, or a "selected paper" note that the template can show on hover or in a featured-paper homepage block (v2).

**`_team/<order>-<slug>.md`:**
```yaml
---
name: "Young Dae Yoon"
role: "PI"              # PI | Postdoc | Grad | Undergrad | Alumni
title: "Assistant Professor"
photo: "/assets/team/young-dae-yoon.jpg"
email: "yoon@physics.ucla.edu"
website: "https://..."     # optional
scholar: "https://..."     # optional Google Scholar
github: "..."              # optional
order: 1                   # used for sorting within role
---
Optional Markdown bio.
```

The numeric prefix in the filename (`1-`, `2-`) is a convenience for ordering files in editors; the actual sort uses the `order` field.

**`_news/<YYYY-MM-DD>-<slug>.md`:**
```yaml
---
date: 2026-04-15        # required, used for ordering
title: "Paper accepted in Physical Review Letters"
link: "/publications/#2026-yoon-prl-reconnection"   # optional, internal or external
---
Optional Markdown body for longer news posts. Most entries will have no body.
```

**`_press/<YYYY-MM-DD>-<slug>.md`:**
```yaml
---
date: 2025-09-12
outlet: "Quanta Magazine"
title: "How plasma physics explains the universe's invisible threads"
link: "https://www.quantamagazine.org/..."
---
Optional Markdown context (e.g., quote pulled from the article).
```

### 5.3 Editing workflow examples

- *New publication:* duplicate the most recent `_publications/*.md`, edit front matter, commit, push. Site rebuilds; entry appears under its year on `/publications/`.
- *New team member:* create `_team/<order>-<slug>.md`, drop a headshot in `assets/team/`, push. Appears on `/team/` under the appropriate role.
- *News item:* create `_news/YYYY-MM-DD-slug.md`. Appears at the top of the homepage news snippet and at the top of `/news/` automatically.
- *Hero image swap:* drop a `.jpg` or `.webp` in `assets/hero/`. Picked into the rotation automatically — no code change.
- *Edit prose pages (Research, Contact):* edit the Markdown directly.

For all of the above, "push" can be done via the GitHub web editor (no local clone needed) or locally with `bundle exec jekyll serve` for a preview.

## 6. Visual Design

### 6.1 Color tokens

- `--ink` `#003B5C` — top nav background, primary headings
- `--brand` `#2774AE` — links, brand accents (UCLA Bruin blue)
- `--gold` `#FFD100` — used sparingly: 2px underline beneath section headings, focal highlights
- `--bg` `#f8f7f4` — page background (warm off-white)
- `--surface` `#ffffff` — content cards
- `--text` `#1f2937` — body copy
- `--muted` `#64748b` — meta text (dates, journal names, captions)
- `--rule` `#e5e7eb` — borders, dividers

Gold is a focal accent only, never a fill or background, to keep the site from looking like a UCLA Athletics page.

### 6.2 Typography

- Body: `Inter`, 16px, line-height 1.6, with system-sans fallback (`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`).
- Headings: `Inter` 600/700 weight. Sans throughout — no serif headings in v1.
- Monospace: system mono.

### 6.3 Layout primitives

- Max content width ~960px (single-column reading width). Hero may be wider.
- Section spacing: ~24px above/below.
- Generous whitespace; no boxed cards on routine content (publications, news entries) — just dotted/solid rules between rows.

### 6.4 Homepage (Photo-Hero)

- Hero band, 320px tall on desktop, 200px on mobile.
- Rotating background image from `assets/hero/`. Selection is randomized per page load via `assets/js/hero-rotate.js`.
- Overlaid text: "Yoon Plasma Group" (h1), tagline below ("Theoretical and numerical studies of laboratory, astrophysical, space, and fusion plasmas"), and a small caption in the upper-right corner naming the image (e.g., "Magnetic reconnection simulation, 2025"). Caption is read from a per-image manifest entry (see 6.5).
- Below the hero: two-column "About the Group" + "Latest News" snippet. Each news entry renders as `date · title`, with the title linked to its `link:` front-matter URL if one is set (otherwise unlinked text). A "More →" link below the snippet points to `/news/`.
- Fallback: if `assets/hero/manifest.yml` is empty or missing, the hero renders a flat `--ink` → `--brand` gradient with no caption. This is the default during initial build before real images are added.

### 6.5 Hero image manifest

Hero captions are decoupled from filenames so files can be renamed. `assets/hero/manifest.yml`:

```yaml
- file: reconnection-sim.jpg
  caption: "Magnetic reconnection simulation, 2025"
- file: tokamak-cutaway.jpg
  caption: "Tokamak cutaway visualization, 2024"
```

`hero-rotate.js` reads this manifest (compiled into the page at build time as a JSON literal) and picks a `{file, caption}` pair at random.

### 6.6 Other pages

- Simple title bar (no hero image).
- Standard `default.html` layout: nav, page title, content, footer.
- No animations beyond default link-hover color shift.

### 6.7 Responsive

- Desktop ≥ 768px: nav as a horizontal bar.
- Mobile < 768px: nav collapses to a hamburger; hero shrinks to 200px; team grid becomes single column.

## 7. Build, Deploy, and Operations

### 7.1 Local development

- One-time setup: install Ruby (preinstalled on macOS) and `bundle install` (which installs Jekyll and the `github-pages` gem set, locking versions to what GitHub Pages itself uses).
- Live preview: `bundle exec jekyll serve` → `http://localhost:4000`. Hot-reload on file save.
- Optional: skip local preview and rely on the GitHub Pages preview after pushing to a branch.

### 7.2 Production deploy

- `main` branch is the live site.
- GitHub Pages is configured (one-time, in repo settings) to build from `main`, root.
- Each push to `main` triggers a rebuild; the new site is live in ~30 seconds.

### 7.3 DNS migration (cutover plan)

This is the only part with risk to the live site, so it's done last and reversibly.

1. Build the new site and verify it at `<account>.github.io/yoonplasmagroup`.
2. Add `CNAME` file containing `yoonplasmagroup.com` to the repo and set "Custom Domain" in GitHub Pages settings to the same.
3. At the DNS registrar for yoonplasmagroup.com, add four `A` records pointing the apex domain at GitHub Pages IPs (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and a `www` `CNAME` to `<account>.github.io`.
4. Wait for DNS propagation (typically minutes; up to 48h in worst case). GitHub auto-provisions a Let's Encrypt SSL cert ~10 min after DNS resolves.
5. Verify the site loads on `https://yoonplasmagroup.com` and `https://www.yoonplasmagroup.com`.
6. Rollback (if needed): revert DNS records to the previous host. Site is unchanged on GitHub.

### 7.4 Repo permissions (parking lot)

Whether the repo lives under the user's personal GitHub account or under a `yoonplasmagroup` org affects only who can push directly. Decision is parked; default is personal account, easy to transfer to an org later without breaking links.

## 8. Implementation Plan (high level)

The detailed step-by-step plan will be produced by the writing-plans skill after this spec is approved. At a high level, the build proceeds in roughly this order:

1. Initialize Jekyll site skeleton; configure collections in `_config.yml`.
2. Build base templates (`default.html`, `page.html`), nav, footer, and the visual system (CSS tokens, type, layout primitives).
3. Build per-page templates (home, team, publications, press, news, contact).
4. Add hero rotation (manifest + small JS).
5. Seed initial content: PI bio, ~3 representative publications, a few news items, draft Research and Press pages.
6. Set up GitHub repo, push, verify build at `<account>.github.io/yoonplasmagroup`.
7. DNS cutover to yoonplasmagroup.com.

## 9. Open Questions / Parking Lot

Items that are not blocking the build but should be revisited:

- **Office address details** for the Contact page (Knudsen Hall room number, mailing address) — supplied by user when the page is built.
- **First batch of hero images** — placeholder gradient is acceptable until at least one real science image is provided.
- **Initial publication list** — user to supply or paste from existing site / Google Scholar.
- **Repo location** — personal account vs. `yoonplasmagroup` GitHub org. Default to personal; can transfer later.
- **Future: featured paper on the homepage.** Front-matter `featured: true` is reserved for this; not rendered in v1.
- **Future: search, analytics, dark mode, code/software tab.** All purely additive.
