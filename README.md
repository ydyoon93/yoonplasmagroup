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
