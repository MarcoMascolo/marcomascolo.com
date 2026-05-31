# marcomascolo

Personal site. Hand-coded HTML + CSS. No build tool. Served by GitHub Pages.

---

## How to open the site

### Quick preview (right now, while local server is running)
```
open http://localhost:8765
```
The local preview server is running in the background. If it dies, restart with the command below.

### Restart the preview server
```bash
cd "/Users/marcomascolo/Downloads/[PERSONAL]Planning/my website"
python3 -m http.server 8765
# then open http://localhost:8765 in any browser
```
Use any port number you want (e.g. `8000`, `4000`). Press Ctrl-C to stop.

### Don't want a server? Open the file directly
```bash
open index.html
```
This works for the home page but some absolute paths (`/assets/...`) may break. **The local server is the right way to preview.**

### After deploying to GitHub Pages
Live at: `https://marcomascolo.github.io/` (once you push and enable Pages).

---

## File structure

```
my-website/
├── index.html               # home — manifesto, intro, Alabama quote, contact
├── me.html                  # mission — Kardashev scale, 3-step plan
├── beliefs.html             # 7 hypotheses (accordion: one open at a time)
├── random-blogging.html     # 12 scraped Framer posts, with timeline at top
├── pics.html                # 6 photos, 2-column grid, natural aspect
├── 404.html                 # not-found page
├── style.css                # all styles, one file
├── README.md                # this file
└── assets/
    ├── banner.jpg           # main banner (lime grainy, 142 KB)
    ├── profile.jpg          # avatar (1042×1042)
    ├── photos/              # 6 photos shown on /pics
    ├── posts/               # 11 images used in blog posts
    ├── backups/             # alternate banner attempts (preserved, not used)
    └── _unused/             # orphan Framer images (not referenced anywhere)
```

---

## How to deploy to GitHub Pages

1. Create an empty repo on GitHub named `marcomascolo.github.io` (the name MUST match this pattern for Pages to auto-serve at the user-page URL).
2. Set git identity (one time):
   ```bash
   git config user.name "Marco Mascolo"
   git config user.email "marco.mascolo.job@gmail.com"
   ```
3. Commit and push:
   ```bash
   git add . && git commit -m "initial: marcomascolo.com v1"
   git remote add origin git@github.com:marcomascolo/marcomascolo.github.io.git
   git push -u origin main
   ```
4. In GitHub: repo settings → Pages → source: `main` branch, root folder.
5. Live in ~60 seconds at `https://marcomascolo.github.io/`.

To use a custom domain (e.g. `marcomascolo.com`):
- Add a `CNAME` file in the repo root with just the domain on one line
- Point DNS A records at `185.199.108.153, .109.153, .110.153, .111.153`

---

## How to update content

### Add a new blog post
1. Open `random-blogging.html`
2. Add a new `<article class="post" id="post-slug">…</article>` block at the top
3. Add a `<code>DATE</code> <a href="#post-slug">Title</a>` entry to the `.timeline` line
4. Drop 0-2 images into `assets/posts/` and reference them in the post

### Add a new belief (HP)
1. Open `beliefs.html`
2. Copy an existing `<details class="hp" name="hp" id="HP-XX-NNN">…</details>` block
3. Update the ID, claim, hypothesis, and first-principles sections
4. Place at the top (newest first)

### Update `/me` or `/`
Just edit the HTML directly.

### Swap the banner
Drop a new image at `assets/banner.jpg` (any aspect, but ~6.6:1 is what fits the design). The glitch matrices on every page automatically sample from it.

### Add a new photo to `/pics`
1. Drop into `assets/photos/`
2. Open `pics.html`, add a `<li><figure><img src="/assets/photos/your.jpg"><figcaption>caption</figcaption></figure></li>` block

---

## Design tokens

```
Background:  #ffffff  crystal white
Text:        #111111  near-black
Muted text:  #666
Orange:      #ff3a1f  (Alabama quote only)
Rule lines:  #e6e6e6
Font body:   Palatino (system font, antirez aesthetic)
Font mono:   Inconsolata / system mono
Column:      800px (antirez's exact width)
```

---

## Things that are intentional, not bugs

- No analytics. Self-first stance, no third-party tracking.
- No comments. Email instead (`marco.mascolo.job@gmail.com`).
- No JS frameworks. Hand-coded HTML survives every front-end churn cycle.
- Cache-busting `?v=2` on banner.jpg and style.css. Bump to `?v=3` if you change either.
- HTML uses absolute paths (`/assets/...`) — works on GitHub Pages, breaks on `file://`. Use the local server.
