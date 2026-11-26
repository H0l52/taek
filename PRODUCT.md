# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Installable web app (PWA) used primarily from an iPhone Home Screen in standalone mode; it
must also work as an ordinary website in any modern browser.

## Stack

Astro (static output) with content collections, plain CSS with custom properties,
TypeScript strict, Playwright for integration tests. Hosted on GitHub Pages from the
`gh-pages` branch with per-PR previews. Decided in `CLAUDE.md`.

## Users

One person: the owner, a Kukkiwon (World Taekwondo) black belt working up through the dan
grades. They use it on their own iPhone to revise technique and poomsae: before and after
training, in the dojang between drills, and when preparing for a dan grading. They already
know the fundamentals; what they need is fast recall of detail, the Korean terminology, and
slowed-down video of movement.

## Product Purpose

A personal reference of Kukkiwon taekwondo technique, organised into five sections in this
fixed order: Kicks, Blocks, Strikes, Self defences, Patterns (poomsae). Each tutorial can
combine text, images and video (a file in the repository or a YouTube video). Success: the
owner can open the app from the Home Screen and be watching or reading the technique they
want within a couple of taps, including offline for pages they have opened before.

## Positioning

Not a public syllabus site and not a course: a private, curated notebook in app form,
weighted to the dan grades the owner is studying, holding their own notes and chosen
videos alongside the official terminology.

## Operating Context

- Often used one-handed, standing, in a training hall with variable lighting; sometimes
  with sweaty hands or at arm's length while copying a movement.
- Video is watched repeatedly and slowly; pausing and slow motion matter more than
  autoplay.
- Connectivity in a dojang can be poor; previously visited pages should still open.

## Capabilities and Constraints

- Syllabus: **Kukkiwon**. Patterns are the Taegeuk poomsae (Il Jang to Pal Jang, geup
  grades) and the black-belt poomsae (Koryo, Keumgang, Taebaek, Pyongwon, Sipjin, Jitae,
  Cheonkwon, Hansoo, Ilyeo, dan grades).
- Grading: tutorials are tagged by Kukkiwon grade, geup (10th to 1st) or dan (1st to 9th).
  Dan grades are the priority: lists put dan material first.
- Geup-to-Taegeuk mapping varies by club; the mapping in the seed content is a common
  convention and the owner may change it.
- Terminology: English name first, then romanised Korean, then Hangul where known.
- Media: the owner may add their own photos and videos, or reference external YouTube
  videos. No other third-party content or scripts.
- Static hosting only (GitHub Pages): no accounts, no server, no analytics.

## Brand Commitments

None. No club name, logo or colours to follow. The app name is "Taek".

## Evidence on Hand

- Seed tutorial text, Korean names, move counts and pattern meanings were drafted from
  general published Kukkiwon references and need the owner's check. No step-by-step
  poomsae sequences have been written; the owner adds those.
- No photos or videos yet. Do not fabricate demonstration media or attribute videos to
  channels without a real link from the owner.

## Product Principles

1. The technique is the content: video, diagram and steps lead; interface chrome recedes.
2. Dan first: the owner's current grade material is never more than one tap from home.
3. Recall at a glance: names, Korean terms and key points readable at arm's length.
4. Works in the dojang: offline after first visit, large targets, inline slow-motion video.
5. Accurate over complete: an honest gap beats invented detail.

## Accessibility & Inclusion

WCAG 2.2 AA in light and dark appearance; respect text-size scaling, reduced motion, and
captions for any video with speech.
