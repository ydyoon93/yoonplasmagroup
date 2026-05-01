# Yoon Plasma Group Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Jekyll-based research-group website at yoonplasmagroup.com with a photo-hero homepage, five top-nav pages (Research, Team, Publications, Press, Contact), Markdown-collection-based editing workflow, and zero-config GitHub Pages deploy.

**Architecture:** Plain Jekyll on GitHub Pages with native build (no Actions). Content lives in Markdown collections (`_team`, `_publications`, `_news`, `_press`) and Markdown pages (Research, Contact). Visual system uses CSS custom properties, no JS framework. The only client-side JavaScript is a small hero-image randomizer. Custom domain via `CNAME` + DNS records — kept as the last cutover step so the live site is not disturbed during build.

**Tech Stack:** Jekyll, github-pages gem, Liquid templates, SCSS, vanilla JS.

**Spec:** [`docs/superpowers/specs/2026-05-01-yoonplasmagroup-website-design.md`](../specs/2026-05-01-yoonplasmagroup-website-design.md)

**Note on a small spec deviation:** The spec proposed `assets/hero/manifest.yml`. The plan uses `_data/hero.yml` instead because Jekyll only auto-loads YAML from `_data/` (no `jekyll-data` plugin in the GitHub Pages whitelist). Functionally identical — the manifest is just at a different path.

---

## Task 1: Initialize repo and Jekyll skeleton

**Goal:** Empty repo with a build-able Jekyll site that produces a "Hello world" homepage.

**Files:**
- Create: `Gemfile`
- Create: `.gitignore`
- Create: `_config.yml` (minimal for now — fleshed out in Task 2)
- Create: `index.md` (placeholder)
- Create: `README.md` (one-line stub — replaced in Task 14)

**Prerequisites:**

Working directory: `/Users/young/Documents/GroupWebsite`. The directory currently contains only `docs/superpowers/specs/`, `docs/superpowers/plans/`, and `.superpowers/` (visual companion artifacts; gitignored via the entry below).

**Ruby version:** This project pins to Ruby **3.3.4** to match what GitHub Pages itself runs in production (see [pages.github.com/versions](https://pages.github.com/versions/)). Newer Rubies (3.4+) remove default gems and methods that the `github-pages` gem set still depends on. Older Rubies (≤ 3.0) are too old for the Pages gem set.

Install via Homebrew (versioned formula — does not replace the system `ruby` or any existing `ruby`):

```bash
brew install ruby@3.3
```

The Homebrew `ruby@3.3` formula installs at `/opt/homebrew/opt/ruby@3.3/bin/ruby` (Apple Silicon) or `/usr/local/opt/ruby@3.3/bin/ruby` (Intel). It is *keg-only* — Homebrew won't symlink it into the global PATH. Subsequent steps in this task explicitly reference the keg path so the system Ruby is never accidentally used.

- [ ] **Step 1: Initialize git repository**

```bash
cd /Users/young/Documents/GroupWebsite
git init
git branch -M main
```

Expected: `Initialized empty Git repository in /Users/young/Documents/GroupWebsite/.git/` and a switch to `main`.

- [ ] **Step 2: Create `.gitignore`**

`/Users/young/Documents/GroupWebsite/.gitignore`:

```
_site/
.jekyll-cache/
.jekyll-metadata
.bundle/
vendor/
.DS_Store
.superpowers/
```

- [ ] **Step 3: Create `Gemfile`**

`/Users/young/Documents/GroupWebsite/Gemfile`:

```ruby
source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
gem "webrick"

# Ruby 3.4+ removed these from the default gem set; Jekyll 3.x
# (which github-pages pins) still requires them at load time.
gem "csv"
gem "base64"
gem "bigdecimal"
gem "logger"
gem "mutex_m"
```

`webrick` is needed for `jekyll serve` on Ruby ≥ 3.0 (removed from the standard library). The five extra gems below it are needed on Ruby ≥ 3.4 to keep Jekyll 3.x loading; on Ruby 3.1–3.3 they are no-ops since the gems are still in the default set.

- [ ] **Step 3b: Pin Ruby version with `.ruby-version`**

`/Users/young/Documents/GroupWebsite/.ruby-version`:

```
3.3.4
```

(Single line, no trailing whitespace. The exact patch number that Homebrew installs may differ slightly — use the actual `ruby@3.3` Ruby version reported by `/opt/homebrew/opt/ruby@3.3/bin/ruby --version`. Any 3.3.x version is fine.) Tools like rbenv, asdf, mise, and chruby read this file. Even without one of those tools, the file documents the supported Ruby for future contributors and gives them a clear signal if a newer Ruby fails to build.

- [ ] **Step 4: Install gems locally with Ruby 3.3**

All `ruby`, `gem`, and `bundle` commands below must run under the `ruby@3.3` keg, not the system Ruby. Prepend the keg's `bin/` to PATH for every Bash invocation in this and subsequent tasks.

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
ruby --version
```

Expected: `ruby 3.3.x ...`. (On Intel Macs, replace `/opt/homebrew` with `/usr/local`.)

```bash
gem install --user-install bundler
export PATH="$(ruby -e 'puts Gem.user_dir')/bin:$PATH"
bundle config set --local path 'vendor/bundle'
bundle install
```

Expected: `Bundle complete!` followed by gem count. May take a few minutes the first time. Set timeout to 600000ms.

If `vendor/` already exists from a previous Ruby's gems, remove it first (`rm -rf vendor/ Gemfile.lock`) and re-run `bundle install` so native gems are recompiled against Ruby 3.3.

- [ ] **Step 5: Create minimal `_config.yml`**

`/Users/young/Documents/GroupWebsite/_config.yml`:

```yaml
title: Yoon Plasma Group
tagline: "Theoretical and numerical studies of laboratory, astrophysical, space, and fusion plasmas"
description: "Yoon Plasma Group at UCLA — theoretical and numerical plasma physics."
url: "https://yoonplasmagroup.com"
baseurl: ""

# Required by jekyll-github-metadata (auto-loaded by github-pages gem).
# Value is not consumed by any template in this site — it only satisfies
# the plugin so local builds succeed before a git remote exists. Update
# in Task 16 to match the actual GitHub repo if desired (cosmetic).
repository: yoonplasmagroup/yoonplasmagroup

permalink: pretty
markdown: kramdown

exclude:
  - Gemfile
  - Gemfile.lock
  - README.md
  - vendor
  - .superpowers
  - docs
  - node_modules
```

- [ ] **Step 6: Create placeholder `index.md`**

`/Users/young/Documents/GroupWebsite/index.md`:

```markdown
---
title: Home
permalink: /
---

Hello from the Yoon Plasma Group.
```

- [ ] **Step 7: Create stub `README.md`**

`/Users/young/Documents/GroupWebsite/README.md`:

```markdown
# Yoon Plasma Group website

Source for [yoonplasmagroup.com](https://yoonplasmagroup.com). Editing instructions to be added.
```

- [ ] **Step 8: Verify the site builds**

```bash
bundle exec jekyll build
```

Expected output ends with: `done in <N> seconds.` and a `_site/index.html` file exists.

- [ ] **Step 9: Spot-check the built homepage**

```bash
grep -q "Hello from the Yoon Plasma Group" _site/index.html && echo "OK" || echo "FAIL"
```

Expected: `OK`.

- [ ] **Step 10: Commit**

```bash
git add .gitignore .ruby-version Gemfile Gemfile.lock _config.yml index.md README.md docs/
git commit -m "feat: initialize Jekyll skeleton

Pins Ruby to 3.3.x (matches GitHub Pages production), Gemfile to
github-pages gem with default-gem compat declarations, minimal
_config.yml, placeholder index.md, and the brainstorm spec/plan
under docs/."
```

---

## Task 2: Configure collections and navigation

**Goal:** Declare the four Markdown collections (team, publications, news, press) in `_config.yml` and define the navigation order. Confirm collection items can be iterated.

**Files:**
- Modify: `_config.yml`

- [ ] **Step 1: Extend `_config.yml` with collections and navigation**

Replace the contents of `_config.yml` with:

```yaml
title: Yoon Plasma Group
tagline: "Theoretical and numerical studies of laboratory, astrophysical, space, and fusion plasmas"
description: "Yoon Plasma Group at UCLA — theoretical and numerical plasma physics."
url: "https://yoonplasmagroup.com"
baseurl: ""

# Required by jekyll-github-metadata (auto-loaded by github-pages gem).
# Value is not consumed by any template in this site — it only satisfies
# the plugin so local builds succeed before a git remote exists. Update
# in Task 16 to match the actual GitHub repo if desired (cosmetic).
repository: yoonplasmagroup/yoonplasmagroup

permalink: pretty
markdown: kramdown

collections:
  team:
    output: false
  publications:
    output: false
  news:
    output: false
  press:
    output: false

defaults:
  - scope:
      path: ""
      type: pages
    values:
      layout: page

nav:
  - title: Research
    url: /research/
  - title: Team
    url: /team/
  - title: Publications
    url: /publications/
  - title: Press
    url: /press/
  - title: Contact
    url: /contact/

exclude:
  - Gemfile
  - Gemfile.lock
  - README.md
  - vendor
  - .superpowers
  - docs
  - node_modules
```

`output: false` on each collection means individual collection items don't get their own permalink pages — they only render through the parent listing pages we'll build later. This keeps URL space clean.

The `defaults` block makes `layout: page` the default for all top-level Markdown pages, so individual `.md` files don't need to declare it.

- [ ] **Step 2: Create a sentinel collection item to verify wiring**

`/Users/young/Documents/GroupWebsite/_news/2026-04-15-sentinel.md`:

```markdown
---
date: 2026-04-15
title: "Site under construction"
---
```

This will be removed in Task 13; it exists only so the next step has something to read.

- [ ] **Step 3: Build and verify the collection is loaded**

```bash
bundle exec jekyll build
```

Expected: build succeeds without errors.

```bash
bundle exec jekyll build --verbose 2>&1 | grep -i "news" | head -5
```

Expected: Jekyll mentions reading from `_news/`.

- [ ] **Step 4: Commit**

```bash
git add _config.yml _news/2026-04-15-sentinel.md
git commit -m "feat: declare collections and nav

Adds team, publications, news, press collections (all with
output: false). Defines nav order and sets default layout to page."
```

---

## Task 3: Base layout, nav, footer

**Goal:** Build the site-wide chrome — `<head>`, top nav, footer — used by every page.

**Files:**
- Create: `_layouts/default.html`
- Create: `_includes/nav.html`
- Create: `_includes/footer.html`

- [ ] **Step 1: Create `_layouts/default.html`**

`/Users/young/Documents/GroupWebsite/_layouts/default.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{% if page.title and page.title != site.title %}{{ page.title }} · {{ site.title }}{% else %}{{ site.title }}{% endif %}</title>
  <meta name="description" content="{{ site.description }}">
  <link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">
</head>
<body>
  {% include nav.html %}
  <main>
    {{ content }}
  </main>
  {% include footer.html %}
</body>
</html>
```

- [ ] **Step 2: Create `_includes/nav.html`**

`/Users/young/Documents/GroupWebsite/_includes/nav.html`:

```html
<nav class="site-nav">
  <div class="nav-inner">
    <a class="nav-brand" href="{{ '/' | relative_url }}">{{ site.title }}</a>
    <button class="nav-toggle" aria-label="Toggle navigation"
            onclick="this.nextElementSibling.classList.toggle('open')">≡</button>
    <ul class="nav-links">
      {% for item in site.nav %}
        <li><a href="{{ item.url | relative_url }}">{{ item.title }}</a></li>
      {% endfor %}
    </ul>
  </div>
</nav>
```

- [ ] **Step 3: Create `_includes/footer.html`**

`/Users/young/Documents/GroupWebsite/_includes/footer.html`:

```html
<footer class="site-footer">
  <div class="footer-inner">
    <span>© {{ 'now' | date: '%Y' }} {{ site.title }} · UCLA Department of Physics &amp; Astronomy</span>
  </div>
</footer>
```

- [ ] **Step 4: Create a placeholder `_layouts/page.html`**

`/Users/young/Documents/GroupWebsite/_layouts/page.html`:

```html
---
layout: default
---
<article class="page">
  <header class="page-header">
    <h1>{{ page.title }}</h1>
  </header>
  <div class="page-content">
    {{ content }}
  </div>
</article>
```

This will get refined in Task 5 if needed; for now it lets `index.md` (which gets `layout: page` by default) build through `default.html`.

- [ ] **Step 5: Build and verify chrome appears**

```bash
bundle exec jekyll build
grep -q "site-nav" _site/index.html && echo "NAV OK" || echo "NAV FAIL"
grep -q "site-footer" _site/index.html && echo "FOOTER OK" || echo "FOOTER FAIL"
grep -q "Yoon Plasma Group" _site/index.html && echo "BRAND OK" || echo "BRAND FAIL"
```

Expected: all three `OK`.

- [ ] **Step 6: Commit**

```bash
git add _layouts _includes
git commit -m "feat: base layout, nav, and footer

Default layout wraps every page in the site nav and footer.
Page layout adds the title bar used by inner pages."
```

---

## Task 4: Visual system (SCSS tokens and base styles)

**Goal:** Establish the design system — color tokens, typography, and the chrome styling — so every subsequent page automatically inherits the visual identity.

**Files:**
- Create: `assets/css/main.scss`
- Create: `_sass/_tokens.scss`
- Create: `_sass/_base.scss`
- Create: `_sass/_layout.scss`
- Create: `_sass/_nav.scss`
- Create: `_sass/_components.scss` (placeholder — populated in later tasks as components are added)

- [ ] **Step 1: Create `assets/css/main.scss`**

`/Users/young/Documents/GroupWebsite/assets/css/main.scss`:

```scss
---
---

@import "tokens";
@import "base";
@import "layout";
@import "nav";
@import "components";
```

The empty `---` front matter at the top is required — it's how Jekyll knows to process this file (run SCSS through the converter and substitute Liquid).

- [ ] **Step 2: Create `_sass/_tokens.scss`**

`/Users/young/Documents/GroupWebsite/_sass/_tokens.scss`:

```scss
:root {
  --ink:     #003B5C;
  --brand:   #2774AE;
  --gold:    #FFD100;
  --bg:      #f8f7f4;
  --surface: #ffffff;
  --text:    #1f2937;
  --muted:   #64748b;
  --rule:    #e5e7eb;

  --content-max: 960px;
  --section-gap: 2rem;
  --radius-sm: 4px;
}
```

- [ ] **Step 3: Create `_sass/_base.scss`**

`/Users/young/Documents/GroupWebsite/_sass/_base.scss`:

```scss
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
}

h1, h2, h3, h4 {
  color: var(--ink);
  font-weight: 700;
  line-height: 1.2;
}
h1 { font-size: 2rem;     margin: 0 0 0.5rem; }
h2 { font-size: 1.5rem;   margin: 1.5rem 0 0.5rem; }
h3 { font-size: 1.125rem; margin: 1rem 0 0.25rem; }

p { margin: 0.6rem 0 0.8rem; }

a {
  color: var(--brand);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s;
}
a:hover { border-bottom-color: var(--brand); }

img { max-width: 100%; height: auto; }

.section-title {
  color: var(--ink);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 2px solid var(--gold);
  display: inline-block;
  padding-bottom: 0.25rem;
  margin: 0 0 0.75rem;
}
.muted { color: var(--muted); }
```

- [ ] **Step 4: Create `_sass/_layout.scss`**

`/Users/young/Documents/GroupWebsite/_sass/_layout.scss`:

```scss
main { min-height: 60vh; }

.page {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}
.page-header {
  border-bottom: 1px solid var(--rule);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
}
.page-header h1 { margin: 0; }
.page-content > p:first-child { margin-top: 0; }
```

- [ ] **Step 5: Create `_sass/_nav.scss`**

`/Users/young/Documents/GroupWebsite/_sass/_nav.scss`:

```scss
.site-nav {
  background: var(--ink);
  color: #fff;
  position: relative;
}
.nav-inner {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-brand {
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.02em;
  border-bottom: none;
}
.nav-brand:hover { border-bottom: none; opacity: 1; }

.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1.25rem;
}
.nav-links li { margin: 0; }
.nav-links a {
  color: #fff;
  opacity: 0.85;
  font-size: 0.95rem;
  border-bottom: none;
}
.nav-links a:hover { opacity: 1; border-bottom: none; }

.nav-toggle {
  display: none;
  background: transparent;
  color: #fff;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
}

.site-footer {
  background: var(--ink);
  color: rgba(255,255,255,0.75);
  padding: 1.5rem;
  margin-top: 4rem;
  font-size: 0.875rem;
}
.footer-inner {
  max-width: var(--content-max);
  margin: 0 auto;
  text-align: center;
}
```

- [ ] **Step 6: Create `_sass/_components.scss` (empty stub)**

`/Users/young/Documents/GroupWebsite/_sass/_components.scss`:

```scss
// Component styles are added per-feature in subsequent tasks
// (hero, news list, publications, team, press).
```

- [ ] **Step 7: Build and verify CSS is generated**

```bash
bundle exec jekyll build
test -f _site/assets/css/main.css && echo "CSS OK" || echo "CSS FAIL"
grep -q "ink:" _site/assets/css/main.css && echo "TOKENS OK" || echo "TOKENS FAIL"
grep -q "site-nav" _site/assets/css/main.css && echo "NAV OK" || echo "NAV FAIL"
```

Expected: all three `OK`.

- [ ] **Step 8: Commit**

```bash
git add assets/css _sass
git commit -m "feat: visual system (tokens, base, layout, nav)

CSS custom properties for the UCLA Classic palette, type, and
spacing. Nav and footer styled. Component partial is a stub —
filled in as components land."
```

---

## Task 5: Stub pages (Research, Contact)

**Goal:** Land the simplest two inner pages — Research and Contact — so the nav links resolve and the page layout is confirmed end to end.

**Files:**
- Create: `research.md`
- Create: `contact.md`

- [ ] **Step 1: Create `research.md`**

`/Users/young/Documents/GroupWebsite/research.md`:

```markdown
---
title: Research
permalink: /research/
---

The Yoon Plasma Group studies the dynamics of plasmas in regimes ranging from
laboratory and fusion devices to astrophysical and space environments. Our work
combines analytic theory with large-scale numerical simulation.

## Themes

*Theme writeups to be added: magnetic reconnection, kinetic instabilities,
turbulence, fusion-relevant transport, etc.*
```

- [ ] **Step 2: Create `contact.md`**

`/Users/young/Documents/GroupWebsite/contact.md`:

```markdown
---
title: Contact
permalink: /contact/
---

**Young Dae Yoon**
Assistant Professor
UCLA Department of Physics &amp; Astronomy

**Email:** yoon@physics.ucla.edu

**Office:** Knudsen Hall (room number to be added)

**Mailing address:**
Department of Physics &amp; Astronomy
University of California, Los Angeles
475 Portola Plaza
Los Angeles, CA 90095-1547
```

The address block uses the canonical UCLA Physics mailing address; the office room number is intentionally a placeholder for the user to fill in.

- [ ] **Step 3: Build and verify both pages render**

```bash
bundle exec jekyll build
test -f _site/research/index.html && echo "RESEARCH OK" || echo "RESEARCH FAIL"
test -f _site/contact/index.html && echo "CONTACT OK" || echo "CONTACT FAIL"
grep -q "yoon@physics.ucla.edu" _site/contact/index.html && echo "EMAIL OK" || echo "EMAIL FAIL"
```

Expected: all three `OK`.

- [ ] **Step 4: Visual sanity check (optional but recommended)**

Run:

```bash
bundle exec jekyll serve
```

Open http://localhost:4000/research/ and http://localhost:4000/contact/. Both should show the nav, page title, and content. Stop with Ctrl-C.

- [ ] **Step 5: Commit**

```bash
git add research.md contact.md
git commit -m "feat: research and contact pages (initial stubs)

Research is a placeholder for theme writeups; contact has the PI
identity, email, and UCLA mailing address. Office room number is a
known placeholder."
```

---

## Task 6: Home layout with hero (gradient fallback) and About + News block

**Goal:** Build the photo-hero homepage. In this task the hero shows the gradient fallback only — image rotation is added later in Task 11. Below the hero, render the About blurb (from `index.md` content) and a placeholder Latest News block.

**Files:**
- Create: `_layouts/home.html`
- Create: `_includes/hero.html`
- Modify: `_sass/_components.scss` (add hero + home-grid styles)
- Modify: `index.md` (switch to `home` layout, add About content)

- [ ] **Step 1: Create `_includes/hero.html`**

`/Users/young/Documents/GroupWebsite/_includes/hero.html`:

```html
<section class="hero" id="hero">
  <div class="hero-overlay">
    <h1 class="hero-title">{{ site.title }}</h1>
    <p class="hero-tagline">{{ site.tagline }}</p>
  </div>
  <div class="hero-caption" id="hero-caption"></div>
</section>
```

- [ ] **Step 2: Create `_layouts/home.html`**

`/Users/young/Documents/GroupWebsite/_layouts/home.html`:

```html
---
layout: default
---
{% include hero.html %}

<section class="home-blocks">
  <div class="home-grid">
    <div class="home-about">
      <h2 class="section-title">About the Group</h2>
      {{ content }}
    </div>
    <div class="home-news">
      <h2 class="section-title">Latest News</h2>
      <p class="muted">News snippet renders here in Task 7.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add hero + home-grid styles**

Replace the contents of `/Users/young/Documents/GroupWebsite/_sass/_components.scss` with:

```scss
// Hero
.hero {
  position: relative;
  height: 320px;
  background: linear-gradient(135deg, var(--ink) 0%, var(--brand) 100%);
  background-size: cover;
  background-position: center;
  color: #fff;
  display: flex;
  align-items: flex-end;
  padding: 1.5rem 0;
  overflow: hidden;
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%);
  pointer-events: none;
}
.hero-overlay {
  position: relative;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 1.5rem;
  width: 100%;
}
.hero-title {
  color: #fff;
  font-size: 2.25rem;
  margin: 0;
  line-height: 1.1;
}
.hero-tagline {
  color: #fff;
  opacity: 0.95;
  font-size: 1rem;
  margin: 0.5rem 0 0;
  max-width: 700px;
}
.hero-caption {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.75);
  z-index: 1;
}

// Home grid
.home-blocks {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}
.home-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2.5rem;
}
.home-about p:first-child { margin-top: 0; }
```

- [ ] **Step 4: Update `index.md`**

Replace the contents of `/Users/young/Documents/GroupWebsite/index.md` with:

```markdown
---
title: Home
layout: home
permalink: /
---

The Yoon Plasma Group at UCLA develops theory and large-scale numerical
simulations to understand plasma processes spanning laboratory experiments,
the heliosphere, accretion disks, and fusion devices. We work closely with
experimentalists and observers, and our codes and methods are openly shared
with the community.
```

- [ ] **Step 5: Build and verify the homepage**

```bash
bundle exec jekyll build
grep -q 'class="hero"' _site/index.html && echo "HERO OK" || echo "HERO FAIL"
grep -q 'About the Group' _site/index.html && echo "ABOUT OK" || echo "ABOUT FAIL"
grep -q 'Latest News' _site/index.html && echo "NEWS OK" || echo "NEWS FAIL"
```

Expected: all three `OK`.

- [ ] **Step 6: Visual check**

`bundle exec jekyll serve` → http://localhost:4000. Should show the gradient hero with title and tagline, then the two-column About + Latest News block. Stop with Ctrl-C.

- [ ] **Step 7: Commit**

```bash
git add _layouts/home.html _includes/hero.html _sass/_components.scss index.md
git commit -m "feat: photo-hero homepage with gradient fallback

Adds home layout, hero include, and the two-column About + Latest
News block. Hero uses an --ink-to-brand gradient until image
rotation lands in a later task."
```

---

## Task 7: News collection, homepage snippet, and `/news/` archive

**Goal:** Wire `_news/` items into the homepage's Latest News block (top 5) and add a full archive at `/news/`.

**Files:**
- Create: `_includes/news-snippet.html`
- Create: `news.md`
- Modify: `_layouts/home.html` (replace placeholder with the snippet include)
- Modify: `_sass/_components.scss` (add news-list styles)

- [ ] **Step 1: Create `_includes/news-snippet.html`**

`/Users/young/Documents/GroupWebsite/_includes/news-snippet.html`:

```html
{% assign sorted_news = site.news | sort: 'date' | reverse %}
{% assign latest = sorted_news | slice: 0, 5 %}
<ul class="news-list">
  {% for item in latest %}
    <li class="news-item">
      <span class="news-date">{{ item.date | date: "%b %Y" }}</span>
      <span class="news-sep">·</span>
      {% if item.link %}
        <a href="{{ item.link | relative_url }}">{{ item.title }}</a>
      {% else %}
        <span>{{ item.title }}</span>
      {% endif %}
    </li>
  {% endfor %}
</ul>
{% if sorted_news.size > 5 %}
  <a class="news-more" href="{{ '/news/' | relative_url }}">More →</a>
{% endif %}
```

- [ ] **Step 2: Update `_layouts/home.html` to use the snippet**

In `/Users/young/Documents/GroupWebsite/_layouts/home.html`, replace:

```html
    <div class="home-news">
      <h2 class="section-title">Latest News</h2>
      <p class="muted">News snippet renders here in Task 7.</p>
    </div>
```

with:

```html
    <div class="home-news">
      <h2 class="section-title">Latest News</h2>
      {% include news-snippet.html %}
    </div>
```

- [ ] **Step 3: Create `news.md` archive page**

`/Users/young/Documents/GroupWebsite/news.md`:

```markdown
---
title: News
permalink: /news/
---

<ul class="news-list news-archive">
{% assign sorted_news = site.news | sort: "date" | reverse %}
{% for item in sorted_news %}
  <li class="news-item">
    <span class="news-date">{{ item.date | date: "%b %-d, %Y" }}</span>
    <span class="news-sep">·</span>
    {% if item.link %}
      <a href="{{ item.link | relative_url }}">{{ item.title }}</a>
    {% else %}
      <span>{{ item.title }}</span>
    {% endif %}
    {% if item.content and item.content != "" %}
      <div class="news-body">{{ item.content | markdownify }}</div>
    {% endif %}
  </li>
{% endfor %}
</ul>
```

- [ ] **Step 4: Add news-list styles**

Append to `/Users/young/Documents/GroupWebsite/_sass/_components.scss`:

```scss
// News list (used on home and /news/)
.news-list { list-style: none; padding: 0; margin: 0; }
.news-item {
  padding: 0.55rem 0;
  border-bottom: 1px dotted var(--rule);
  font-size: 0.95rem;
}
.news-date { color: var(--brand); font-weight: 600; }
.news-sep  { color: var(--muted); margin: 0 0.4rem; }
.news-more {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.875rem;
}
.news-archive .news-item { padding: 0.85rem 0; }
.news-body {
  margin-top: 0.3rem;
  color: var(--muted);
  font-size: 0.9rem;
}
```

- [ ] **Step 5: Add a second news item so we can see ordering**

`/Users/young/Documents/GroupWebsite/_news/2026-03-01-students-join.md`:

```markdown
---
date: 2026-03-01
title: "Two new graduate students join the group"
---
```

- [ ] **Step 6: Build and verify both surfaces render in correct order**

```bash
bundle exec jekyll build
grep -A2 'class="news-list"' _site/index.html | head -8
test -f _site/news/index.html && echo "ARCHIVE OK" || echo "ARCHIVE FAIL"
grep -q "Apr 2026" _site/index.html && grep -q "Mar 2026" _site/index.html && echo "ORDER OK" || echo "ORDER FAIL"
```

Expected: snippet HTML fragment shown, `ARCHIVE OK`, `ORDER OK`.

The April sentinel from Task 2 should appear *above* the March item in the source order in `_site/index.html` (i.e., reverse-chronological).

- [ ] **Step 7: Commit**

```bash
git add _includes/news-snippet.html _layouts/home.html news.md _sass/_components.scss _news/2026-03-01-students-join.md
git commit -m "feat: news collection wired to homepage and /news/

Latest 5 news items render on the home page; the full archive is
at /news/. Date is shown as 'Mon YYYY' on the snippet, full date
on the archive."
```

---

## Task 8: Team collection and `/team/` page

**Goal:** Render `_team/` entries as cards on `/team/`, split into "Current Members" (sorted PI → Postdoc → Grad → Undergrad, then by `order`) and "Alumni".

**Files:**
- Create: `team.md`
- Create: `_includes/team-card.html`
- Modify: `_sass/_components.scss` (add team-grid + team-card styles)

- [ ] **Step 1: Create `_includes/team-card.html`**

`/Users/young/Documents/GroupWebsite/_includes/team-card.html`:

```html
<article class="team-card">
  {% if include.member.photo %}
    <img class="team-photo" src="{{ include.member.photo | relative_url }}" alt="{{ include.member.name }}">
  {% else %}
    <div class="team-photo team-photo-placeholder"></div>
  {% endif %}
  <div class="team-info">
    <h3 class="team-name">{{ include.member.name }}</h3>
    <div class="team-title">{{ include.member.title }}</div>
    {% if include.member.content and include.member.content != "" %}
      <div class="team-bio">{{ include.member.content | markdownify }}</div>
    {% endif %}
    <div class="team-links">
      {% if include.member.email %}<a href="mailto:{{ include.member.email }}">email</a>{% endif %}
      {% if include.member.website %}<a href="{{ include.member.website }}">website</a>{% endif %}
      {% if include.member.scholar %}<a href="{{ include.member.scholar }}">scholar</a>{% endif %}
      {% if include.member.github %}<a href="https://github.com/{{ include.member.github }}">github</a>{% endif %}
    </div>
  </div>
</article>
```

- [ ] **Step 2: Create `team.md`**

`/Users/young/Documents/GroupWebsite/team.md`:

```markdown
---
title: Team
permalink: /team/
---

{% assign role_order = "PI,Postdoc,Grad,Undergrad" | split: "," %}
{% assign current = site.team | where_exp: "m", "m.role != 'Alumni'" %}
{% assign alumni  = site.team | where: "role", "Alumni" %}

<section class="team-section">
  <h2 class="section-title">Current Members</h2>
  <div class="team-grid">
    {% for role in role_order %}
      {% assign in_role = current | where: "role", role | sort: "order" %}
      {% for member in in_role %}
        {% include team-card.html member=member %}
      {% endfor %}
    {% endfor %}
  </div>
</section>

{% if alumni.size > 0 %}
<section class="team-section">
  <h2 class="section-title">Alumni</h2>
  <div class="team-grid">
    {% assign alumni_sorted = alumni | sort: "order" %}
    {% for member in alumni_sorted %}
      {% include team-card.html member=member %}
    {% endfor %}
  </div>
</section>
{% endif %}
```

- [ ] **Step 3: Add team styles to `_sass/_components.scss`**

Append:

```scss
// Team
.team-section { margin-top: 2rem; }
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}
.team-card {
  background: var(--surface);
  border: 1px solid var(--rule);
  border-radius: var(--radius-sm);
  padding: 1rem;
}
.team-photo {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: var(--radius-sm);
}
.team-photo-placeholder {
  background: linear-gradient(135deg, var(--ink), var(--brand));
}
.team-name  { margin: 0.6rem 0 0.1rem; font-size: 1rem; }
.team-title { color: var(--muted); font-size: 0.85rem; }
.team-bio   { font-size: 0.875rem; margin: 0.5rem 0; }
.team-links { font-size: 0.8rem; }
.team-links a { margin-right: 0.5rem; }
```

- [ ] **Step 4: Add a placeholder PI entry to verify rendering**

`/Users/young/Documents/GroupWebsite/_team/1-young-dae-yoon.md`:

```markdown
---
name: "Young Dae Yoon"
role: "PI"
title: "Assistant Professor, UCLA Physics & Astronomy"
email: "yoon@physics.ucla.edu"
order: 1
---
Theoretical and numerical plasma physicist. Research interests span
laboratory, astrophysical, space, and fusion plasmas.
```

(No `photo:` for now — the placeholder gradient div renders. A real photo can be added later by dropping a file in `assets/team/` and adding the `photo:` field.)

- [ ] **Step 5: Build and verify**

```bash
bundle exec jekyll build
test -f _site/team/index.html && echo "TEAM PAGE OK" || echo "TEAM PAGE FAIL"
grep -q "Young Dae Yoon" _site/team/index.html && echo "PI OK" || echo "PI FAIL"
grep -q "Current Members" _site/team/index.html && echo "CURRENT OK" || echo "CURRENT FAIL"
grep -q "Alumni" _site/team/index.html && echo "WARN: Alumni heading shown despite empty list" || echo "ALUMNI HIDDEN OK"
```

Expected: `TEAM PAGE OK`, `PI OK`, `CURRENT OK`, `ALUMNI HIDDEN OK`.

- [ ] **Step 6: Commit**

```bash
git add team.md _includes/team-card.html _sass/_components.scss _team/1-young-dae-yoon.md
git commit -m "feat: team page with role-grouped current and alumni

Renders _team/ as cards. Current section iterates roles in
PI → Postdoc → Grad → Undergrad order, sorted by 'order' within
each. Alumni heading is hidden when empty."
```

---

## Task 9: Publications collection and `/publications/` page

**Goal:** Render `_publications/` entries grouped by year (descending), with each entry showing title, authors, journal/volume/pages/year, and link buttons (DOI, arXiv, URL, PDF).

**Files:**
- Create: `publications.md`
- Modify: `_sass/_components.scss` (add publication-list styles)

- [ ] **Step 1: Create `publications.md`**

`/Users/young/Documents/GroupWebsite/publications.md`:

```markdown
---
title: Publications
permalink: /publications/
---

{% assign by_year = site.publications | sort: "date" | reverse | group_by: "year" %}
{% assign by_year_sorted = by_year | sort: "name" | reverse %}

{% if by_year_sorted.size == 0 %}
<p class="muted">No publications listed yet.</p>
{% endif %}

{% for year_group in by_year_sorted %}
  <section class="pub-year-section">
    <h2 class="pub-year">{{ year_group.name }}</h2>
    <ul class="pub-list">
      {% for pub in year_group.items %}
        <li class="pub-item" id="{{ pub.slug }}">
          <div class="pub-title">{{ pub.title }}</div>
          <div class="pub-authors">{{ pub.authors }}</div>
          <div class="pub-meta">
            {{ pub.journal }}{% if pub.volume %} <strong>{{ pub.volume }}</strong>{% endif %}{% if pub.pages %}, {{ pub.pages }}{% endif %} ({{ pub.year }})
          </div>
          <div class="pub-links">
            {% if pub.doi %}<a href="https://doi.org/{{ pub.doi }}">DOI</a>{% endif %}
            {% if pub.arxiv %}<a href="https://arxiv.org/abs/{{ pub.arxiv }}">arXiv</a>{% endif %}
            {% if pub.link %}<a href="{{ pub.link }}">Link</a>{% endif %}
            {% if pub.pdf %}<a href="{{ pub.pdf | relative_url }}">PDF</a>{% endif %}
          </div>
        </li>
      {% endfor %}
    </ul>
  </section>
{% endfor %}
```

`group_by` returns its groups in source order (not sorted by name), so we explicitly sort the year groups by name and reverse for descending year order. Within a year, items inherit the upstream `sort: "date" | reverse`, so newer-within-year shows first.

- [ ] **Step 2: Add publication styles to `_sass/_components.scss`**

Append:

```scss
// Publications
.pub-year-section { margin-top: 1.5rem; }
.pub-year {
  color: var(--ink);
  font-size: 1.4rem;
  border-bottom: 2px solid var(--gold);
  display: inline-block;
  padding-bottom: 0.2rem;
  margin: 1rem 0 0.4rem;
}
.pub-list { list-style: none; padding: 0; margin: 0; }
.pub-item {
  padding: 0.85rem 0;
  border-bottom: 1px dotted var(--rule);
}
.pub-title   { font-weight: 600; color: var(--text); }
.pub-authors { color: var(--muted); font-size: 0.95rem; margin-top: 0.1rem; }
.pub-meta    { font-size: 0.9rem; color: var(--muted); margin-top: 0.1rem; font-style: italic; }
.pub-links   { margin-top: 0.35rem; font-size: 0.85rem; }
.pub-links a { margin-right: 0.75rem; }
```

- [ ] **Step 3: Add a placeholder publication so the page is non-empty**

`/Users/young/Documents/GroupWebsite/_publications/2026-yoon-prl-reconnection.md`:

```markdown
---
title: "Theory of magnetic reconnection in collisionless plasmas"
authors: "Y. D. Yoon, J. Doe"
journal: "Physical Review Letters"
volume: "133"
pages: "215001"
year: 2026
date: 2026-04-15
doi: "10.1103/PhysRevLett.133.215001"
arxiv: "2604.12345"
---
```

(Placeholder DOI/arXiv numbers — real ones in Task 13 / supplied by user.)

- [ ] **Step 4: Build and verify**

```bash
bundle exec jekyll build
test -f _site/publications/index.html && echo "PAGE OK" || echo "PAGE FAIL"
grep -q "Theory of magnetic reconnection" _site/publications/index.html && echo "ENTRY OK" || echo "ENTRY FAIL"
grep -q "2026" _site/publications/index.html && echo "YEAR OK" || echo "YEAR FAIL"
grep -q "doi.org/10.1103" _site/publications/index.html && echo "DOI LINK OK" || echo "DOI LINK FAIL"
grep -q "arxiv.org/abs/2604" _site/publications/index.html && echo "ARXIV LINK OK" || echo "ARXIV LINK FAIL"
```

Expected: all five `OK`.

- [ ] **Step 5: Commit**

```bash
git add publications.md _sass/_components.scss _publications/2026-yoon-prl-reconnection.md
git commit -m "feat: publications page grouped by year

Reverse-chronological by date within each year, year groups in
descending order. Each entry shows title, authors, journal/vol/
pages, and link buttons for DOI, arXiv, URL, and PDF when set."
```

---

## Task 10: Press collection and `/press/` page

**Goal:** Render `_press/` entries as a reverse-chronological list with date, outlet, headline, link, and optional pull-quote.

**Files:**
- Create: `press.md`
- Modify: `_sass/_components.scss` (add press-list styles)

- [ ] **Step 1: Create `press.md`**

`/Users/young/Documents/GroupWebsite/press.md`:

```markdown
---
title: Press
permalink: /press/
---

{% assign sorted_press = site.press | sort: "date" | reverse %}

{% if sorted_press.size == 0 %}
<p class="muted">No press coverage listed yet.</p>
{% endif %}

<ul class="press-list">
{% for item in sorted_press %}
  <li class="press-item">
    <div class="press-date">{{ item.date | date: "%B %Y" }}</div>
    <div class="press-outlet">{{ item.outlet }}</div>
    <div class="press-title">
      {% if item.link %}
        <a href="{{ item.link }}">{{ item.title }}</a>
      {% else %}
        {{ item.title }}
      {% endif %}
    </div>
    {% if item.content and item.content != "" %}
      <blockquote class="press-quote">{{ item.content | markdownify }}</blockquote>
    {% endif %}
  </li>
{% endfor %}
</ul>
```

- [ ] **Step 2: Add press styles to `_sass/_components.scss`**

Append:

```scss
// Press
.press-list { list-style: none; padding: 0; margin: 0; }
.press-item {
  padding: 0.95rem 0;
  border-bottom: 1px dotted var(--rule);
}
.press-date   { color: var(--brand); font-weight: 600; font-size: 0.85rem; }
.press-outlet { color: var(--ink); font-weight: 600; font-size: 0.95rem; margin-top: 0.1rem; }
.press-title  { font-size: 0.95rem; margin-top: 0.1rem; }
.press-quote {
  margin: 0.5rem 0 0;
  padding-left: 0.75rem;
  border-left: 2px solid var(--gold);
  color: var(--muted);
  font-size: 0.9rem;
}
.press-quote p { margin: 0; }
```

- [ ] **Step 3: Build and verify**

```bash
bundle exec jekyll build
test -f _site/press/index.html && echo "PAGE OK" || echo "PAGE FAIL"
grep -q "No press coverage listed yet" _site/press/index.html && echo "EMPTY STATE OK" || echo "EMPTY STATE FAIL"
```

Expected: `PAGE OK` and `EMPTY STATE OK`. (We'll add seed press entries in Task 13.)

- [ ] **Step 4: Commit**

```bash
git add press.md _sass/_components.scss
git commit -m "feat: press page with empty-state and pull-quote support"
```

---

## Task 11: Hero image rotation

**Goal:** Replace the gradient hero with a randomly-picked image from `_data/hero.yml` on each page load. Falls back to the gradient if the manifest is empty.

**Files:**
- Create: `_data/hero.yml`
- Create: `assets/js/hero-rotate.js`
- Modify: `_includes/hero.html` (inject manifest + load script)

- [ ] **Step 1: Create `_data/hero.yml`**

`/Users/young/Documents/GroupWebsite/_data/hero.yml`:

```yaml
# Hero image manifest. Each entry pairs a filename in assets/hero/
# with a caption shown in the hero's upper-right corner.
# Empty list = gradient fallback (no rotating images).
[]
```

The empty list means the gradient fallback is active until images are added. To add an image: drop a JPG/WebP into `assets/hero/`, then add an entry like:

```yaml
- file: reconnection-sim.jpg
  caption: "Magnetic reconnection simulation, 2025"
```

This is documented in the README in Task 14.

- [ ] **Step 2: Create `assets/js/hero-rotate.js`**

`/Users/young/Documents/GroupWebsite/assets/js/hero-rotate.js`:

```javascript
(function () {
  var hero = document.getElementById('hero');
  var captionEl = document.getElementById('hero-caption');
  var images = window.HERO_IMAGES || [];
  var base = window.HERO_BASE || '/assets/hero/';
  if (!hero || images.length === 0) return;
  var pick = images[Math.floor(Math.random() * images.length)];
  hero.style.backgroundImage = "url('" + base + pick.file + "')";
  if (captionEl && pick.caption) captionEl.textContent = pick.caption;
})();
```

- [ ] **Step 3: Update `_includes/hero.html` to inject the manifest and load the script**

Replace the contents of `/Users/young/Documents/GroupWebsite/_includes/hero.html` with:

```html
<section class="hero" id="hero">
  <div class="hero-overlay">
    <h1 class="hero-title">{{ site.title }}</h1>
    <p class="hero-tagline">{{ site.tagline }}</p>
  </div>
  <div class="hero-caption" id="hero-caption"></div>
</section>
<script>
  window.HERO_IMAGES = {{ site.data.hero | jsonify }};
  window.HERO_BASE = "{{ '/assets/hero/' | relative_url }}";
</script>
<script src="{{ '/assets/js/hero-rotate.js' | relative_url }}" defer></script>
```

- [ ] **Step 4: Build and verify both states**

First, with the empty manifest (gradient fallback):

```bash
bundle exec jekyll build
grep -q 'window.HERO_IMAGES = \[\]' _site/index.html && echo "EMPTY MANIFEST OK" || echo "EMPTY MANIFEST FAIL"
test -f _site/assets/js/hero-rotate.js && echo "JS DEPLOYED OK" || echo "JS DEPLOYED FAIL"
```

Expected: both `OK`. Open http://localhost:4000 (`bundle exec jekyll serve`); the gradient should still show.

Then, with one entry to verify rotation logic. Temporarily edit `_data/hero.yml` to:

```yaml
- file: placeholder.jpg
  caption: "Placeholder caption"
```

Rebuild:

```bash
bundle exec jekyll build
grep -q 'placeholder.jpg' _site/index.html && echo "MANIFEST INJECTED OK" || echo "MANIFEST INJECTED FAIL"
grep -q 'Placeholder caption' _site/index.html && echo "CAPTION INJECTED OK" || echo "CAPTION INJECTED FAIL"
```

Expected: both `OK`. (404 for the missing JPG in the browser is fine — we're verifying the wiring, not the asset.)

Revert `_data/hero.yml` back to `[]` before committing.

- [ ] **Step 5: Commit**

```bash
git add _data/hero.yml assets/js/hero-rotate.js _includes/hero.html
git commit -m "feat: random hero image rotation with gradient fallback

Hero pulls from _data/hero.yml on each page load. Empty list keeps
the existing --ink-to-brand gradient. Drop an image into
assets/hero/ and add a {file, caption} entry to enable."
```

---

## Task 12: Responsive styles (mobile)

**Goal:** Make the site usable on mobile — collapse the nav into a hamburger that toggles, shrink the hero, stack the home grid and team grid.

**Files:**
- Create: `_sass/_responsive.scss`
- Modify: `assets/css/main.scss` (import the new partial)

- [ ] **Step 1: Create `_sass/_responsive.scss`**

`/Users/young/Documents/GroupWebsite/_sass/_responsive.scss`:

```scss
@media (max-width: 767px) {
  .nav-inner { padding: 0.75rem 1rem; }
  .nav-toggle { display: block; }
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--ink);
    padding: 1rem;
    gap: 0.75rem;
    z-index: 10;
  }
  .nav-links.open { display: flex; }

  .hero { height: 200px; padding: 1rem 0; }
  .hero-title { font-size: 1.5rem; }
  .hero-tagline { font-size: 0.9rem; }

  .home-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .home-blocks { padding: 1.5rem 1rem 3rem; }

  .page { padding: 1.75rem 1rem 3rem; }

  .team-grid { grid-template-columns: 1fr; gap: 1rem; }

  .pub-year { font-size: 1.2rem; }
}
```

- [ ] **Step 2: Import the new partial in `assets/css/main.scss`**

Replace the contents of `/Users/young/Documents/GroupWebsite/assets/css/main.scss` with:

```scss
---
---

@import "tokens";
@import "base";
@import "layout";
@import "nav";
@import "components";
@import "responsive";
```

- [ ] **Step 3: Build and verify the media query is in the output CSS**

```bash
bundle exec jekyll build
grep -q '@media (max-width: 767px)' _site/assets/css/main.css && echo "RESPONSIVE OK" || echo "RESPONSIVE FAIL"
```

Expected: `RESPONSIVE OK`.

- [ ] **Step 4: Visual mobile check**

`bundle exec jekyll serve`. In the browser, open DevTools → device toolbar → set viewport to 390×844 (iPhone). The nav should show a hamburger ≡, the hero should shrink to ~200px, and the home grid should stack. Tapping ≡ should reveal the nav links.

- [ ] **Step 5: Commit**

```bash
git add _sass/_responsive.scss assets/css/main.scss
git commit -m "feat: responsive layout for mobile

Nav collapses into a hamburger, hero shrinks to 200px, home and
team grids stack into a single column at <768px."
```

---

## Task 13: Seed initial content

**Goal:** Replace the few placeholder collection items with the user's real starting content. The Task 2 sentinel news item is removed here; the placeholder publication and PI entry are replaced/augmented as the user provides real content.

This task includes only what we can write without further user input. The actual final content is supplied by the user after this implementation lands; this step provides obvious-stub content that is easy to replace.

**Files:**
- Modify: `_publications/2026-yoon-prl-reconnection.md` (mark as PLACEHOLDER in title comment)
- Delete: `_news/2026-04-15-sentinel.md`
- Create: a couple of additional placeholder news/press entries to demonstrate the layouts

- [ ] **Step 1: Remove the Task 2 sentinel news item**

```bash
git rm _news/2026-04-15-sentinel.md
```

- [ ] **Step 2: Add a couple of placeholder news items**

`/Users/young/Documents/GroupWebsite/_news/2026-04-15-prl-paper.md`:

```markdown
---
date: 2026-04-15
title: "[PLACEHOLDER] Paper accepted in Physical Review Letters"
link: "/publications/#2026-yoon-prl-reconnection"
---
```

`/Users/young/Documents/GroupWebsite/_news/2026-02-10-aps-talk.md`:

```markdown
---
date: 2026-02-10
title: "[PLACEHOLDER] Invited talk at APS Division of Plasma Physics"
---
```

`[PLACEHOLDER]` markers are intentional — they make it obvious which entries to replace.

- [ ] **Step 3: Add a placeholder press item**

`/Users/young/Documents/GroupWebsite/_press/2025-09-12-quanta.md`:

```markdown
---
date: 2025-09-12
outlet: "Quanta Magazine"
title: "[PLACEHOLDER] How plasma physics explains the universe's invisible threads"
link: "https://www.quantamagazine.org/"
---
A short pull-quote can go here as Markdown — appears as a styled
blockquote on the press page.
```

- [ ] **Step 4: Update the placeholder publication's body to make it obviously a placeholder**

In `/Users/young/Documents/GroupWebsite/_publications/2026-yoon-prl-reconnection.md`, replace the file contents with:

```markdown
---
title: "[PLACEHOLDER] Theory of magnetic reconnection in collisionless plasmas"
authors: "Y. D. Yoon, J. Doe"
journal: "Physical Review Letters"
volume: "133"
pages: "215001"
year: 2026
date: 2026-04-15
doi: "10.1103/PhysRevLett.133.215001"
arxiv: "2604.12345"
---
```

(The DOI and arXiv numbers are intentionally fake — real ones supplied by the user.)

- [ ] **Step 5: Build and verify**

```bash
bundle exec jekyll build
grep -c "PLACEHOLDER" _site/index.html
```

Expected: at least one `[PLACEHOLDER]` mention on the homepage news snippet (count ≥ 1 — the latest news placeholder shows there).

```bash
test ! -f _site/news/2026-04-15-sentinel.html && echo "SENTINEL REMOVED OK" || echo "SENTINEL STILL PRESENT"
```

Since the news collection has `output: false`, the sentinel was never an output file anyway, but let's verify by checking the news archive page no longer mentions it:

```bash
grep -q "Site under construction" _site/news/index.html && echo "FAIL: sentinel still in archive" || echo "ARCHIVE CLEAN OK"
```

Expected: `ARCHIVE CLEAN OK`.

- [ ] **Step 6: Commit**

```bash
git add _news _press _publications
git rm _news/2026-04-15-sentinel.md 2>/dev/null || true
git commit -m "chore: replace sentinel content with PLACEHOLDER seeds

Removes the Task 2 sentinel news item. Adds a couple of
[PLACEHOLDER]-marked news, press, and publication entries that
demonstrate every layout and are obvious to replace with real
content."
```

---

## Task 14: README with editing instructions

**Goal:** Replace the stub README with practical instructions for everyone (PI, students) to add content without needing to read this plan.

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace `README.md`**

Replace the contents of `/Users/young/Documents/GroupWebsite/README.md` with:

````markdown
# Yoon Plasma Group website

Source for [yoonplasmagroup.com](https://yoonplasmagroup.com). Built with
Jekyll, deployed via GitHub Pages.

## Editing

All content lives in Markdown files. Edits made on the `main` branch
publish automatically in ~30 seconds.

### Add a publication

Create a new file in `_publications/` named `YYYY-firstauthor-keyword.md`:

```yaml
---
title: "Paper title"
authors: "Y. D. Yoon, A. N. Other"
journal: "Physical Review Letters"
volume: "133"
pages: "215001"
year: 2026
date: 2026-04-15        # used for sorting
doi: "10.1103/PhysRevLett.133.215001"     # optional
arxiv: "2604.12345"                        # optional
link: "https://..."                        # optional, if no DOI/arxiv
pdf: "/assets/pdfs/yoon-2026-prl.pdf"     # optional, self-hosted
---
```

The body of the file can stay empty for routine entries.

### Add a news item

Create `_news/YYYY-MM-DD-slug.md`:

```yaml
---
date: 2026-04-15
title: "Paper accepted in PRL"
link: "/publications/#2026-yoon-prl-reconnection"   # optional
---
```

Latest 5 news items show on the homepage; all show at `/news/`.

### Add a team member

Create `_team/<order>-<slug>.md`:

```yaml
---
name: "Jane Doe"
role: "Postdoc"            # PI | Postdoc | Grad | Undergrad | Alumni
title: "Postdoctoral Researcher"
photo: "/assets/team/jane-doe.jpg"   # optional
email: "jdoe@physics.ucla.edu"
website: "https://..."     # optional
scholar: "https://..."     # optional
github: "janedoe"          # optional
order: 1
---
Optional Markdown bio.
```

Drop the headshot at `assets/team/jane-doe.jpg` to match the `photo:` path.

### Add a press item

Create `_press/YYYY-MM-DD-slug.md`:

```yaml
---
date: 2025-09-12
outlet: "Quanta Magazine"
title: "Article title"
link: "https://..."
---
Optional pull-quote as Markdown — renders as a styled blockquote.
```

### Swap a hero image

1. Drop a JPG/WebP into `assets/hero/`.
2. Add an entry to `_data/hero.yml`:

   ```yaml
   - file: my-image.jpg
     caption: "What the image shows, year"
   ```

The randomizer picks one entry per page load.

## Local preview

Optional, but recommended for proofreading before pushing:

```bash
bundle install                 # one-time
bundle exec jekyll serve
# open http://localhost:4000
```

Edits hot-reload. Stop with Ctrl-C.

## Deploying

`git push` to `main`. GitHub Pages rebuilds automatically. Check the
"Actions" or "Pages" tab on github.com if a build appears to fail.
````

- [ ] **Step 2: Build and verify the README is excluded from the site (it's in `exclude:`)**

```bash
bundle exec jekyll build
test ! -f _site/README/index.html && echo "EXCLUDED OK" || echo "FAIL: README leaked into _site"
```

Expected: `EXCLUDED OK`.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: practical README covering all content workflows"
```

---

## Task 15: HTMLProofer validation

**Goal:** Run `htmlproofer` against `_site/` to catch broken links, missing files, and bad HTML before pushing.

**Files:**
- Modify: `Gemfile` (add `html-proofer`)

- [ ] **Step 1: Add `html-proofer` to the Gemfile**

In `/Users/young/Documents/GroupWebsite/Gemfile`, append:

```ruby
group :test do
  gem "html-proofer"
end
```

The full file is now:

```ruby
source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
gem "webrick"

group :test do
  gem "html-proofer"
end
```

- [ ] **Step 2: Install**

```bash
bundle install
```

Expected: `Bundle complete!` (or "Bundle updated!").

- [ ] **Step 3: Build and run htmlproofer**

```bash
bundle exec jekyll build
bundle exec htmlproofer ./_site \
  --disable-external \
  --allow-hash-href \
  --allow-missing-href \
  --ignore-urls "/^https?:\/\/arxiv\.org/,/^https?:\/\/doi\.org/,/^https?:\/\/www\.quantamagazine\.org/"
```

Flags explained:
- `--disable-external` — skip checking external URLs (slow and flaky in CI; we'll re-enable selectively later if desired).
- `--allow-hash-href` — accept anchors like `#abstract` even when no element with that id is present (some intentional).
- `--allow-missing-href` — accept `<a>` without `href` (Jekyll generates none of these in our templates, but is permissive).
- `--ignore-urls` regex — for the specific external links in placeholder content that may 404 (placeholder DOI/arXiv).

Expected: `htmlproofer finished successfully`.

If htmlproofer reports broken internal links, fix them before continuing.

- [ ] **Step 4: Commit**

```bash
git add Gemfile Gemfile.lock
git commit -m "test: add htmlproofer to verify built site"
```

---

## Task 16: Create GitHub repo and verify Pages build

**Goal:** Push the repo to GitHub, enable Pages, and verify the site builds and serves at the GitHub-Pages preview URL *before* touching DNS.

**Note:** This task involves UI clicks on github.com. The `gh` CLI may not be installed; if it isn't, the user may prefer to do the repo creation step manually in the browser. Both paths are listed.

**Files:** None modified — repo and Pages settings live on github.com.

- [ ] **Step 1: Create the repo on GitHub**

Option A (CLI, if `gh` is installed and authenticated):

```bash
gh repo create yoonplasmagroup --public --source=. --remote=origin --description="Yoon Plasma Group website"
```

Option B (manual): on github.com, create a new public repository named `yoonplasmagroup` under the user's account. Do **not** initialize with a README (we already have one). Then locally:

```bash
git remote add origin https://github.com/<username>/yoonplasmagroup.git
```

(Replace `<username>` with the actual account.)

- [ ] **Step 2: Push `main`**

```bash
git push -u origin main
```

Expected: branches pushed, upstream set.

- [ ] **Step 3: Enable GitHub Pages**

On github.com → repo → Settings → Pages:
- **Source:** "Deploy from a branch"
- **Branch:** `main`, folder `/ (root)`
- Save.

GitHub starts the first build automatically. It takes ~30 seconds.

- [ ] **Step 4: Verify the GitHub Pages preview URL**

Visit `https://<username>.github.io/yoonplasmagroup/`. Expected: the site loads, all five tabs work, the homepage shows the gradient hero and About + Latest News.

If a tab links to `/team/` and the page 404s, the issue is `baseurl`: when hosting at `<username>.github.io/yoonplasmagroup/` (project page), `baseurl` must be set to `/yoonplasmagroup`. We'll fix this in the next step *only* for the GitHub Pages preview phase, then revert before DNS cutover.

- [ ] **Step 5: (Conditional) If links 404, set `baseurl` for the preview**

Edit `_config.yml`, change `baseurl: ""` to `baseurl: "/yoonplasmagroup"`. Commit and push:

```bash
git add _config.yml
git commit -m "chore: set baseurl for github.io preview"
git push
```

Wait ~30 seconds, reload `https://<username>.github.io/yoonplasmagroup/`. Links should now resolve.

This change is reverted in Task 17 before the DNS cutover, since the custom domain serves at the apex.

- [ ] **Step 6: Final preview-build verification**

Click through every tab. Confirm:
- Homepage shows hero + about + news.
- News archive at `/news/` lists all entries.
- Team page renders the PI card.
- Publications page lists the placeholder publication under "2026".
- Press page renders the Quanta placeholder with pull-quote.
- Research and Contact pages show their stub content.

If anything is off, fix and push before proceeding to DNS cutover.

- [ ] **Step 7: No commit needed unless Step 5 was triggered.** (Step 5 already commits.)

---

## Task 17: DNS cutover to yoonplasmagroup.com

**Goal:** Point `yoonplasmagroup.com` at GitHub Pages and serve the site at the custom domain. Reversible in the registrar at any time.

**Files:**
- Create: `CNAME`
- Modify: `_config.yml` (revert `baseurl` to `""` if it was set in Task 16 Step 5)

**Pre-flight:**
- Confirm the GitHub Pages preview at `<username>.github.io/yoonplasmagroup/` works correctly.
- Have access to the DNS provider for yoonplasmagroup.com (whoever the registrar is — likely Squarespace, Namecheap, GoDaddy, etc.).

- [ ] **Step 1: Revert `baseurl` if it was set**

If `_config.yml` has `baseurl: "/yoonplasmagroup"`, change it back to `baseurl: ""`. (At a custom domain on the apex, the site serves from `/`.)

- [ ] **Step 2: Add `CNAME` file**

`/Users/young/Documents/GroupWebsite/CNAME` (single line, no extension):

```
yoonplasmagroup.com
```

- [ ] **Step 3: Commit and push both changes**

```bash
git add CNAME _config.yml
git commit -m "feat: prepare custom domain yoonplasmagroup.com"
git push
```

- [ ] **Step 4: Set the custom domain in GitHub Pages settings**

On github.com → repo → Settings → Pages:
- "Custom domain": enter `yoonplasmagroup.com`. Save.
- Leave "Enforce HTTPS" unchecked for now — it can't be enabled until the cert is issued (after DNS resolves).

- [ ] **Step 5: Configure DNS at the registrar**

At the DNS provider for yoonplasmagroup.com, configure these records:

**A records (apex domain `yoonplasmagroup.com`)** — point at the four GitHub Pages IPs:

| Type | Host | Value | TTL |
|---|---|---|---|
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |

**CNAME record (`www` subdomain)** — points at the GitHub user/repo Pages URL:

| Type | Host | Value | TTL |
|---|---|---|---|
| CNAME | www | `<username>.github.io` | 3600 |

(Replace `<username>` with the GitHub account that owns the `yoonplasmagroup` repo.)

**Remove or update any existing A/CNAME records on the apex or www that point at the old host.** This is the moment the live site changes.

- [ ] **Step 6: Wait for DNS propagation**

Typically a few minutes; up to 48 hours worst case. Verify with:

```bash
dig +short yoonplasmagroup.com
dig +short www.yoonplasmagroup.com
```

Expected: the four GitHub IPs for the apex; `<username>.github.io` (or one of GitHub's IPs) for `www`.

- [ ] **Step 7: Wait for SSL cert**

GitHub auto-provisions a Let's Encrypt cert ~10 min after DNS resolves. Watch Settings → Pages — there will be a "Your site is published at https://yoonplasmagroup.com" banner once the cert is ready.

Once the banner appears, **enable** "Enforce HTTPS" in Settings → Pages.

- [ ] **Step 8: Final verification**

Open `https://yoonplasmagroup.com` in a fresh browser/incognito window. Verify:
- The new site loads (not the old yoonplasmagroup.com content).
- TLS lock icon shows.
- All five top-nav tabs work and resolve to the correct pages.
- `https://www.yoonplasmagroup.com` redirects to the apex.

**Rollback plan if anything goes wrong:** at the DNS provider, revert the A and CNAME records to the previous values. The site at GitHub is unchanged and stays available at `<username>.github.io/yoonplasmagroup/`.

- [ ] **Step 9: No further commit** — DNS is configured at the registrar, not in the repo. The repo's `CNAME` file is committed already.

---

## Self-review

Re-checking against the spec:

- **Architecture & hosting** (Spec §3) → Tasks 1, 2, 16, 17 cover Jekyll skeleton, github-pages gem, GitHub Pages deploy, custom domain.
- **Information architecture** (Spec §4) → Task 2 declares the nav and collections; Tasks 5–10 build each page.
- **News on homepage + archive** (Spec §4.3) → Task 7 implements both surfaces.
- **Team current/alumni split** (Spec §4.4) → Task 8 implements the role-driven split with sort order.
- **Content data model + collections layout** (Spec §5) → Task 2 defines collections; Tasks 7–10 implement schemas; Task 14 documents the workflow.
- **Visual design** (Spec §6) — palette, typography, layout primitives, photo-hero, hero manifest with caption, gradient fallback → Tasks 4, 6, 11, 12.
- **Build, deploy, operations** (Spec §7) — local preview, production deploy, DNS cutover plan → Tasks 1 (Gemfile), 14 (README), 16, 17.
- **Open questions** (Spec §9) — Office room number is left as a placeholder in `contact.md`; placeholder publication/news entries are clearly marked `[PLACEHOLDER]` for the user to replace.

No type/method-name inconsistencies. The `pub.slug` reference in `publications.md` (Task 9) is auto-generated by Jekyll from the filename — no separate definition needed.

One placeholder pattern was caught and fixed: Task 9 originally relied on `group_by` ordering year groups correctly; the plan now explicitly sorts and reverses the year groups so newer years appear first.
