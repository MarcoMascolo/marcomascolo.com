---
title: Personal Manifesto page + cross-site tweaks
type: feat
status: active
date: 2026-05-31
origin: docs/brainstorms/2026-05-31-personal-manifesto-and-site-tweaks-brainstorm.md
---

# Personal Manifesto + Site Tweaks

## Overview

Ship one new page (`manifesto.html`, long-form philosophical statement sourced from the dictated transcript) and execute a coordinated batch of edits across the existing five pages plus 404. The manifesto becomes the anchor for Marco's worldview ("software-for-hardware as a primitive form of biology → custom manufacturing → biology engineering → interstellar travel"); the surrounding edits trim drafts, sharpen the home page, and refresh the footer across the whole site.

The brainstorm at `docs/brainstorms/2026-05-31-personal-manifesto-and-site-tweaks-brainstorm.md` is the origin doc — all decisions below were resolved there. Where this plan adds detail (file paths, line anchors, manifesto prose, exact strings), it carries forward the brainstorm intent without contradicting it.

## Scope

**In scope:**
1. New `manifesto.html` page (long-form, Me-style)
2. `index.html` — remove avatar, add Spotify link under Alabama quote
3. `me.html` — add closing pull-quote
4. `beliefs.html` — remove every `Confidence` row from every hypothesis
5. `random-blogging.html` — hide 9 DRAFT posts (comment out, easy to restore)
6. Footer sweep across **all 6 HTML pages** (`index`, `me`, `beliefs`, `pics`, `random-blogging`, `404`, plus new `manifesto`):
   - Add Manifesto link to footer link row
   - Rewrite meta line: `© 2026 marco mascolo · MADE IN ITALY · BUILDING IN SAN FRANCISCO`

**Out of scope (deferred):**
- `pics.html` — no change (brainstorm resolution)
- Floating "+" button bottom-right (intent unclear)
- Spotify embed/playlist on home page (the simple link handles the spirit)
- Adding Manifesto to top nav (footer-only per decision)
- Pruning the now-unused `.avatar` CSS rule (dead but harmless on a personal site)

## File-by-File Changes

### 1. NEW: `manifesto.html`

**Pattern:** Clone the structure of `me.html` (long-form prose with `<h2>` section breaks; no `<details>` collapsibles). Includes the standard glitches `<div>` block, `.intro` header with nav, divider, main content, and footer.

**Head:**
- `<title>Personal Manifesto — Marco Mascolo</title>`
- `<meta name="description" content="Engineering is a primitive form of biology. The path: faster hardware → custom manufacturing → engineerable biology → interstellar travel.">`
- `<link rel="canonical" href="https://marcomascolo.github.io/manifesto.html">`
- og:title, og:description match
- All other head tags identical to `me.html` lines 11-19

**Body shell:**
- `.skip-link` → `.glitches` (full 36-glitch block) → `<main id="main">`
- `<header class="intro">` with `<h1 class="name">Personal Manifesto</h1>` and nav (Home / Me / Beliefs / Blog / Pics — no Manifesto in top nav per decision; Manifesto link goes in the footer)
- `<hr class="divider">`

**Manifesto prose (8 sections, ~700-900 words total):**

```html
<p><strong>Engineering is a primitive form of biology.</strong> We do not understand biology yet, so we work with what we can. Software and hardware are separate today because we are not good enough yet. They will not stay separate.</p>

<p>What follows is the trajectory I see, the work I want to do inside it, and why I am starting where I am starting.</p>

<hr class="divider">

<h2>1. From design to growth</h2>

<p>Right now, hardware iterates in months and software iterates in minutes. The bridge is shortening that gap until designing a part feels like writing a function. Engineers move up to systems work. GD&T persists as long as we are bound to subtractive and additive manufacturing — but only that long.</p>

<p>The endgame is not faster CAD. The endgame is going from a 3D model to a 3D object using biology. Seed to glass. The manufacturing process becomes a living process, and the things we build start to grow.</p>

<h2>2. Custom manufacturing without the cage of GD&T</h2>

<p>Today, to build a small thing you need a bigger thing. 3D printers, CNC machines, injection molds — all larger than the part they produce. This is counterintuitive: nature does not work this way. Nature grows.</p>

<p>When manufacturing can hit nominal dimensions every time, GD&T stops being a constraint and becomes a relic of the manufacturing era we left behind. That is custom manufacturing at scale.</p>

<h2>3. Hardware as a living ecosystem</h2>

<p>A human hand does not need maintenance. A robotic hand does. The difference is that a human hand is a living system, not a structure — continuous self-repair, distributed sensing, no central scheduler.</p>

<p>We cannot replicate this in machines because we have barely built anything based on swarm intelligence. The next layer of hardware is hardware that is its own ecosystem.</p>

<h2>4. Biology's three problems: observability, deliverability, scalability</h2>

<p><strong>Observability.</strong> You cannot see what is happening inside your body at any given moment. We take snapshots and infer the rest.</p>

<p><strong>Deliverability.</strong> We know the location of a tumor very accurately. We have no way to tell the immune system "go to X, Y, Z." So instead we bombard with x-rays and radiation, which is just constructive interference plus collateral damage.</p>

<p><strong>Scalability.</strong> Biology research is bound to human labor. This is addressable right now, without any new breakthroughs. It is one of the things I want to work on.</p>

<h2>5. Editing the body within a lifetime</h2>

<p>The interesting part is not controlling evolution across generations. It is editing yourself within a finite timeline. I want to climb a wall — change my skin to stick. I want to take a long-haul flight — change my metabolism for the duration.</p>

<p>Getting there means first understanding how other organisms work and then translating that knowledge back to humans. When that loop closes, humans get an exponential evolution curve they have never had before.</p>

<h2>6. Intelligence as emergence</h2>

<p>Intelligence is not a human specialty. It is what emerges when enough complexity is connected. The current artificial-neural-network architecture may need exponentially more connections than biology to produce something we would recognize as real intelligence — but we are getting close. Scarily close.</p>

<h2>7. Colonies and singletons</h2>

<p>If you can connect units and form a collective intelligence, then a question opens up: is a human body a colony of organisms, or a single organism? My gut says colony. I have more questions than answers here, and I am watching the field carefully.</p>

<h2>8. Why hardware first</h2>

<p>The ultimate goal is to enable humanity to engineer biology so that we can survive interstellar travel. I want to go to far-away galaxies. I will not make that trip in this lifetime, and not with this body.</p>

<p>Hardware is the crucial first step. If I make hardware 100-1000x faster to design, everyone benefits — and I free decades of my own life, and of every engineer's life, for the biology work that comes after.</p>

<p><strong>Engineers should become inventors again.</strong></p>

<hr class="divider">

<p>Last meaningful edit: 31 May 2026.</p>
```

**Footer:** uses the new footer pattern (see §6 below).

**Voice notes for /ce:work:** Keep first-person, declarative, slightly raw. Do not over-polish — Marco's prose has rhythm and small idiosyncrasies that should survive. Bold only the section thesis lines and the closing inventor line.

---

### 2. `index.html` — remove avatar, add Spotify link

**Remove** (currently line 40):
```html
<img class="avatar" src="/assets/profile.jpg" alt="Marco Mascolo">
```

**Add** (immediately after the existing quote-source `<p>`, currently line 75):
```html
<p class="quote-spotify"><a href="https://open.spotify.com/track/[TBD]" target="_blank" rel="noopener">listen on Spotify ↗</a></p>
```

**TBD:** the actual Spotify track URL for Alabama's "I'm in a Hurry (And Don't Know Why)" needs to be filled in. `/ce:work` should prompt for this or fetch it. Suggested placement: small text, centered (matching `.quote-source` alignment), maybe 0.5rem above the next divider.

**CSS:** add a small rule to `style.css` for `.quote-spotify` — same centered alignment as `.quote-source`, slightly muted color (e.g., `opacity: 0.7`), small font size. Estimated 4-5 lines of CSS.

---

### 3. `me.html` — add closing pull-quote

**Insert** a new `<p>` immediately before the closing `<hr class="divider">` (currently line 96), or replace the "Last meaningful edit" block's preceding context. Specifically, after the "Why this order" final paragraph (line 94):

```html
<hr class="divider">

<p class="pullquote"><strong>Engineers should become inventors again.</strong></p>

<hr class="divider">

<p>Last meaningful edit: 31 May 2026.</p>
```

(Also bumps the "Last meaningful edit" date from 25 May to 31 May since the file is being touched.)

**CSS:** add `.pullquote` if not present — centered, larger font (~1.4rem), looser line-height. ~5 lines.

---

### 4. `beliefs.html` — drop the Confidence row

In every `<dl>` inside `.hp-body`, remove the two adjacent lines:
```html
<dt>Confidence</dt>
<dd>[content]</dd>
```

**Affected hypothesis blocks (7 total):**
- HP-HW-001 (lines ~71-72)
- HP-HW-002 (lines ~104-105)
- HP-ORG-001 (lines ~137-138)
- HP-ORG-002 (lines ~170-171)
- HP-SPACE-001 (lines ~203-204)
- HP-BIO-001 (lines ~235-236)
- HP-TASTE-001 (lines ~268-269)

(Line numbers approximate — `/ce:work` should grep for `<dt>Confidence</dt>` to find all of them safely.)

**Verify after:** `grep -c "Confidence" beliefs.html` → expect 0.

Nothing else on Beliefs changes. Mechanism, Would refute, and "From first principles" stay.

---

### 5. `random-blogging.html` — hide 9 DRAFT posts

**Strategy:** wrap each draft `<article>` in HTML comments so they're trivially restorable. Same for their entries in the `.timeline` `<p>` block.

**Hide these 9 articles** (by id):
- `post-harmonic-gears`
- `post-teleoperated`
- `post-hanomi`
- `post-aging`
- `post-non-newtonian`
- `post-nanobots`
- `post-true-human`
- `post-things-to-build`
- `post-fly`

**Keep visible (3):**
- `post-first-love` (Jun 2024)
- `post-nasa` (Random)
- `post-random` (May 2024)

**Hide pattern (per article):**
```html
<!--
<article class="post" id="post-harmonic-gears">
  ...
</article>
-->
```

**Timeline header:** in the `<p class="timeline">` block (lines ~52-66), comment out the 9 DRAFT entries (everything from `<code>DRAFT</code> <a href="#post-harmonic-gears">...</a> ·` through `<code>DRAFT</code> <a href="#post-fly">Fly</a> ·`) but leave the three dated entries (`1st Love`, `NASA Insight`, `Random`) and the leading `<strong>timeline</strong> ·`.

Result after hiding — visible timeline reads:
```
timeline · JUN 2024 1st Love · RANDOM NASA Insight · MAY 2024 Random
```

---

### 6. Footer sweep — ALL 6 EXISTING + 1 NEW HTML files

**Apply to:** `index.html`, `me.html`, `beliefs.html`, `pics.html`, `random-blogging.html`, `404.html`, `manifesto.html` (new).

**Change A — link row.** Add Manifesto link between X and email:

Replace:
```html
<p class="site-footer-links">
  <a href="https://hanomi.ai">Hanomi</a><span class="sep">·</span>
  <a href="https://s-hawk.com">S-Hawk</a><span class="sep">·</span>
  <a href="https://www.linkedin.com/in/marco-mascolo/">LinkedIn</a><span class="sep">·</span>
  <a href="https://x.com/_marco_masc">X</a><span class="sep">·</span>
  <a href="mailto:marco.mascolo.job@gmail.com">marco.mascolo.job@gmail.com</a>
</p>
```

With:
```html
<p class="site-footer-links">
  <a href="https://hanomi.ai">Hanomi</a><span class="sep">·</span>
  <a href="https://s-hawk.com">S-Hawk</a><span class="sep">·</span>
  <a href="https://www.linkedin.com/in/marco-mascolo/">LinkedIn</a><span class="sep">·</span>
  <a href="https://x.com/_marco_masc">X</a><span class="sep">·</span>
  <a href="/manifesto.html">Manifesto</a><span class="sep">·</span>
  <a href="mailto:marco.mascolo.job@gmail.com">marco.mascolo.job@gmail.com</a>
</p>
```

**Change B — meta line.** Replace:
```html
<p class="site-footer-meta">
  &copy; 2026 marco mascolo<span class="sep">·</span>made in san francisco<span class="sep">·</span>hand-coded HTML on GitHub Pages
</p>
```

With:
```html
<p class="site-footer-meta">
  &copy; 2026 marco mascolo<span class="sep">·</span>MADE IN ITALY<span class="sep">·</span>BUILDING IN SAN FRANCISCO
</p>
```

**Verify after sweep:**
- `grep -c "hand-coded HTML" *.html` → expect 0
- `grep -c "MADE IN ITALY" *.html` → expect 7 (six existing + new manifesto)
- `grep -c "manifesto.html" *.html` → expect 7 (footer link in all of them)

## Implementation Order (recommended)

To keep file-state pristine and easy to verify:

1. **Beliefs** — `Confidence` row removal (simple grep-and-delete; verifiable with grep count).
2. **Blog** — comment out 9 articles + 9 timeline entries.
3. **Index** — remove avatar img; add Spotify link (use TBD placeholder if URL unresolved).
4. **Me** — add pullquote + bump date.
5. **Manifesto** — create new file from template, paste prose.
6. **Footer sweep** — all 7 files in one batch (Manifesto link + meta line). Easiest to do last when all files exist.
7. **CSS** — add `.quote-spotify` and `.pullquote` rules; bump cachebuster `?v=7` → `?v=8` in every `<link rel="stylesheet">` reference (8 occurrences across 7 files).

## Acceptance Criteria

**Manifesto page:**
- [ ] `manifesto.html` exists at repo root
- [ ] 8 `<h2>` section headings present, in the order specified
- [ ] Closes with bolded "Engineers should become inventors again."
- [ ] Renders correctly via local server (`python3 -m http.server`) at `http://localhost:8000/manifesto.html`
- [ ] Reachable from the footer of every other page

**Index:**
- [ ] No `<img class="avatar">` present
- [ ] Spotify link present beneath the Alabama quote (URL resolved or marked TBD with a visible comment)
- [ ] Alabama quote text unchanged

**Me:**
- [ ] New pullquote present near the bottom: "Engineers should become inventors again."
- [ ] "Last meaningful edit" date updated to 31 May 2026

**Beliefs:**
- [ ] `grep -c "Confidence" beliefs.html` → 0
- [ ] All 7 hypothesis blocks still render correctly with the remaining 3 `<dt>/<dd>` pairs (Claim, Mechanism, Would refute)
- [ ] "From first principles" sections untouched

**Blog:**
- [ ] 3 articles visible: 1st Love, NASA Insight, Random
- [ ] 9 articles wrapped in HTML comments and not visible
- [ ] Timeline header shows only the 3 dated entries
- [ ] All hidden content recoverable by removing the HTML comments (no information lost)

**Pics:**
- [ ] No change. File identical to current except for footer sweep.

**404:**
- [ ] No change beyond the footer sweep.

**Footer (all 7 pages):**
- [ ] Manifesto link appears in `.site-footer-links` between X and email
- [ ] Meta line reads exactly: `© 2026 marco mascolo · MADE IN ITALY · BUILDING IN SAN FRANCISCO` (rendered)
- [ ] `<span class="sep">·</span>` used as separator (matches existing pattern)
- [ ] No occurrences of "hand-coded HTML" or "made in san francisco" remain anywhere in the repo

**CSS:**
- [ ] `.quote-spotify` and `.pullquote` rules added
- [ ] Cachebuster bumped from `?v=7` to `?v=8` everywhere

**Visual verification:**
- [ ] Local server started; all 7 pages loaded in browser; no broken links in footer; no CSS regressions

## Open / TBD Items

1. **Spotify URL** for Alabama "I'm in a Hurry (And Don't Know Why)" — needs to be supplied by Marco or fetched at implementation time. Plan uses `[TBD]` placeholder.
2. **Manifesto prose review** — the prose draft above is structured from the transcript. Marco should review for voice/accuracy before implementation. Edits at the prose level are cheap and expected.

## Risks & Mitigations

- **Risk:** Manifesto prose drifts from Marco's voice into generic prose. **Mitigation:** keep the small idiosyncrasies, declarative cadence, and slight rawness; do not smooth them into corporate copy. Have Marco scan once before publishing.
- **Risk:** Cachebuster bump missed somewhere → stale CSS on a page. **Mitigation:** the acceptance criteria explicitly checks all `?v=7` → `?v=8` references.
- **Risk:** Hidden blog articles silently lose information if someone "cleans up" the HTML comments later. **Mitigation:** add a single comment near the top of the blog page explaining the hide pattern: `<!-- Drafts below are hidden via HTML comments. Uncomment when ready to publish. -->`.

## Sources & References

### Origin

- **Brainstorm:** [docs/brainstorms/2026-05-31-personal-manifesto-and-site-tweaks-brainstorm.md](../brainstorms/2026-05-31-personal-manifesto-and-site-tweaks-brainstorm.md). Key decisions carried forward: (1) manifesto in footer only, not top nav; (2) Me-style long-form, not Beliefs-style collapsibles; (3) pics no change — original "hide" instruction was about the blog page; (4) skip subscription, none exists; (5) footer meta line all-caps "MADE IN ITALY · BUILDING IN SAN FRANCISCO".

### Source content

- **Manifesto raw transcript:** `/PERSONAL MANIFESTO TRANSCRIPT` (project root)

### Internal references

- `me.html` — structural template for `manifesto.html`
- `style.css:71` — `.avatar` (becomes dead after index edit)
- `style.css:142-165` — `.quote` / `.quote-source` (pattern for `.quote-spotify`)
- `style.css:184-191` — `.site-footer-meta` and `.sep` (used by footer sweep)

### Related prior work

- `[website] eye/docs/plans/2026-04-09-feat-refine-manifesto-copy-plan.md` — earlier S-Hawk manifesto copy work. Not part of this repo, but useful tonal reference for "manifesto voice."
