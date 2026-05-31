---
title: Personal Manifesto page + cross-site tweaks
type: brainstorm
status: draft
date: 2026-05-31
source: voice-dictated; raw transcript at /PERSONAL MANIFESTO TRANSCRIPT
---

# Personal Manifesto + Site Tweaks

## What We're Building

A new **Personal Manifesto** page sourced from the dictated transcript, plus a small batch of edits to existing pages (`index`, `me`, `beliefs`, `pics`). The manifesto carries the long-form "why" — software-for-hardware as a primitive form of biology, the path from hardware acceleration → biological engineering → interstellar travel. Existing pages get trimmed and re-pointed so the manifesto becomes the anchor and the rest of the site stays light.

## Why This Approach

- The Me page already states the *plan* (steps 1-2-3). The Manifesto page is the *worldview* underneath it — they complement, not duplicate.
- Editing in place (rather than rebuilding) preserves the hand-coded GitHub-Pages aesthetic Marco values.
- Hiding draft content (test pics, weak beliefs, subscription UI) cleans the surface without deleting anything — easy to restore.
- Footer placement for the Manifesto link matches Marco's stated intent ("manifesto should be at the bottom, always there").

## Key Decisions

### New: Personal Manifesto page
- **File:** `manifesto.html` (new), single long-form page following the structure of `me.html` (continuous prose with `<h2>` section breaks — not collapsibles like Beliefs).
- **Source:** the raw transcript at `/PERSONAL MANIFESTO TRANSCRIPT`, cleaned and structured into prose sections. Section spine:
  1. Engineering as primitive biology
  2. Custom manufacturing at scale (eliminating GD&T as a constraint)
  3. Hardware as living, self-maintaining ecosystem
  4. Biology = observability + deliverability + scalability
  5. Editing the body within a lifetime (not generations)
  6. Intelligence as emergence
  7. Are we colonies or singletons?
  8. Why hardware first — 100-1000x leverage → engineers become inventors again
- **Tone:** keep Marco's voice — first-person, declarative, lightly raw. No corporate polish.
- **Discoverability:** linked from the **footer** of every page (decision: footer only — keep top nav at 5 items).

### Index (home)
- Remove the avatar image (`<img class="avatar">` line 40 of `index.html`).
- Keep the Alabama quote.
- Add a **Spotify link** to "I'm in a Hurry (And Don't Know Why)" by Alabama right under the quote-source line.

### Me page
- Add a closing line / pull-quote: **"Engineers should become inventors again."**
- Otherwise content is fine — the three-step plan stays.

### Beliefs page
- Remove the **Confidence** row from every `<dl>` inside `.hp-body`. The structure becomes Claim → Mechanism → Would refute → From first principles. (Marco said the confidence point "doesn't still fit" — reads as performative.)
- Everything else stays.

### Pics page
- **No change.** Stays as is.

### Blog page (`random-blogging.html`)
- Hide all 9 `DRAFT` posts (Harmonic Gears, Teleoperated, HANOMI, Aging, Non-Newtonian, Nanobots, Bio interface, Things to build, Fly) and the corresponding entries in the timeline header.
- Keep the 3 real/dated posts visible: **1st Love** (Jun 2024), **NASA Insight** (Random), **Random** (May 2024).
- Hidden = commented out in source so they're easy to restore when ready to publish. Page intro line stays.

### Subscription
- Skipped — no subscription UI exists in the current repo.

### Footer (all pages)
- Add a **Manifesto** link to the footer link row: `Hanomi · S-Hawk · LinkedIn · X · Manifesto · email`.
- Change the meta line from `© 2026 marco mascolo · made in san francisco · hand-coded HTML on GitHub Pages` to `© 2026 marco mascolo · MADE IN ITALY · BUILDING IN SAN FRANCISCO`. All caps, same `<span class="sep">·</span>` spacer pattern as the existing footer link row.

## Out of Scope (for this brainstorm)

- Capitalizing first letters in specific places — instruction was unclear in the transcript; if there's a specific page/section, address as a follow-up.
- A floating "+" button in the bottom-right — unclear what action it triggers. Defer until intent is concrete.
- Embedding a Spotify playlist as a hero element on the front page — unclear which playlist and where exactly; the simpler "song link under the Alabama quote" handles the spirit of the request.

## Open Questions

*(none — all resolved)*

## Resolved Questions

1. **Manifesto nav placement** → Footer only.
2. **Pics page** → No change. The original "hide" instruction was about the blog page, not pics.
3. **Subscription** → Skip; no subscription UI exists.
4. **Manifesto shape** → Single long-form page with `<h2>` sections, matching the Me page style.

## Next

After resolving the open questions, run `/ce:plan` to generate the implementation plan (file diffs, copy decisions, manifesto.html scaffold).
