# Taek — Taekwondo tutorials (iPhone home-screen web app)

A static, installable web app (PWA) that teaches taekwondo technique. It is hosted on
GitHub Pages and is designed first for an iPhone that has added it to the Home Screen
(Safari → Share → **Add to Home Screen**). It must also work as an ordinary website.

## Product

Five top-level sections, always in this order:

| Section | Slug | Content |
|---|---|---|
| Kicks | `kicks` | e.g. front kick, turning kick, side kick |
| Blocks | `blocks` | e.g. low block, middle block, rising block |
| Strikes | `strikes` | punches, knife-hand, back-fist, elbow |
| Self defences | `self-defence` | releases, escapes, counters |
| Patterns | `patterns` | forms (poomsae / tul), one entry per pattern |

Each tutorial can contain any mix of **text**, **images** and **video**. Video is either a
file committed to this repository or a YouTube video.

Language: British English in UI copy and content ("defence", "colour"). Korean terms are
shown alongside English with romanisation (and Hangul where known).

Open question to confirm with the owner before writing content: ITF (tul) or WT/Kukkiwon
(poomsae/taegeuk) syllabus, and the grading/belt order to use. Do not guess; ask.

## Stack (decided)

- **Astro** (static output, no SSR) with **content collections** for tutorials. Ships
  zero JS by default; add small islands only where interaction needs it (video facade,
  install hint). No UI framework unless a component genuinely needs one.
- Plain CSS with custom properties (design tokens) in `src/styles/tokens.css`. No
  Tailwind, no CSS-in-JS.
- **TypeScript** strict mode.
- **Playwright** (`@playwright/test`) for integration/E2E tests, plus `@axe-core/playwright`
  for accessibility.
- Node: current active LTS, pinned in `.nvmrc` and `package.json#engines`.
- Package manager: npm with a committed `package-lock.json`; CI uses `npm ci`.

Pin exact dependency versions; do not add a dependency for something a few lines of code
can do.

## Repository layout (target)

```
src/
  content/
    config.ts               # zod schemas for each collection
    kicks/*.md              # one file per technique
    blocks/*.md
    strikes/*.md
    self-defence/*.md
    patterns/*.md
  components/               # VideoPlayer, YouTubeEmbed, StepList, InstallHint, TabBar ...
  layouts/
  pages/
    index.astro             # home: five sections
    [section]/index.astro   # list of tutorials in a section
    [section]/[slug].astro  # a tutorial
  styles/tokens.css
public/
  manifest.webmanifest
  icons/                    # apple-touch-icon 180x180, 192, 512, maskable 512
  sw.js                     # service worker (see PWA rules)
media/                      # source images/video before optimisation (if needed)
tests/e2e/*.spec.ts
.github/workflows/
PRODUCT.md                  # product context, written by /impeccable init
DESIGN.md                   # visual system, written by /impeccable document
```

## Content model

Each tutorial is a Markdown file; the body holds the prose and step-by-step instructions.
Frontmatter (validated by zod in `src/content/config.ts`; build must fail on bad data):

```yaml
title: Turning kick
korean: Dollyeo chagi          # romanised
hangul: 돌려차기                # optional
order: 3                       # sort order within the section
level: beginner                # beginner | intermediate | advanced (or belt, once confirmed)
summary: One sentence shown on the list card.
hero:                          # optional image
  src: ./images/turning-kick.jpg
  alt: Describe the body position, not "photo of kick"
video:                         # optional; exactly one of file | youtube
  file: ./video/turning-kick.mp4
  poster: ./images/turning-kick-poster.jpg
  # or
  youtube: dQw4w9WgXcQ          # video ID only, never a full URL
  start: 12                     # optional seconds
keyPoints: [ "Pivot on the ball of the standing foot", "Chamber the knee" ]
commonMistakes: [ "Leaning back", "Kicking with the toes" ]
# patterns only:
moves: 19
meaning: Short description of the pattern's meaning
```

Rules:
- Every image needs meaningful `alt` text; video needs a poster and, where there is speech,
  captions (`.vtt`).
- Images go through Astro's `<Image>` / `astro:assets` (responsive, AVIF/WebP).
- Use relative paths next to the Markdown file for content media.

## Video rules

- **Repository video:** H.264 MP4 (+ optional HEVC/WebM), short clips, target < 8 MB each,
  ~720p, faststart (`ffmpeg -movflags +faststart`). GitHub blocks files > 100 MB and Pages
  sites are capped at ~1 GB, so keep clips short. Do not use Git LFS (Pages does not serve
  LFS objects from a branch deploy).
- Always `playsinline` and `preload="metadata"`; looping demonstration clips are
  `muted loop playsinline` (iOS only autoplays muted, inline video). Provide visible
  controls and a way to slow down (`playbackRate` 0.5×/0.25×) — slow motion is the main
  learning aid.
- **YouTube:** use a click-to-load facade (poster + play button) that swaps in a
  `https://www.youtube-nocookie.com/embed/<id>?playsinline=1` iframe. Never load YouTube on
  page load. Show a fallback link when offline.

## iPhone / PWA rules

- `manifest.webmanifest`: `display: "standalone"`, `start_url` and `scope` relative to the
  deploy base path, `theme_color`, `background_color`, 192/512 and maskable icons.
- `<head>` must include: `apple-touch-icon` (180×180, no transparency),
  `<meta name="apple-mobile-web-app-title">`, `<meta name="mobile-web-app-capable" content="yes">`,
  `apple-mobile-web-app-status-bar-style`, `theme-color` (light and dark), and
  `viewport` with `viewport-fit=cover`.
- Respect safe areas with `env(safe-area-inset-*)`; nothing under the notch/Dynamic Island
  or home indicator.
- Navigation: bottom tab bar with the five sections (iOS convention for 2–5 top-level
  sections), 44×44 pt minimum targets. In standalone mode there is no browser back button,
  so every non-root page needs an in-app back link. Do not break the edge-swipe gesture.
- iOS never shows an install prompt. Show a dismissible, once-only "Add to Home Screen"
  hint on iOS Safari when not already standalone (`navigator.standalone` /
  `matchMedia('(display-mode: standalone)')`). Remember dismissal in `localStorage`
  (wrapped in try/catch).
- Support Dark Mode (`prefers-color-scheme`), Dynamic Type-like scaling (rem-based type,
  no fixed px font sizes), and `prefers-reduced-motion`.
- Service worker: cache the app shell and visited pages/images (stale-while-revalidate).
  **Never precache video**; iOS caps PWA storage and evicts it. Bump the cache version on
  each deploy (inject the commit SHA at build). Register the service worker only on the
  production deploy, not on PR previews (their scopes would overlap production).

## Design

Clean, calm, instructional — the technique is the hero, the interface recedes. This is
an "Operate/Read" surface in Impeccable's terms: precision and restraint over decoration.

- Use the **impeccable** skill for all UI work. First run `/impeccable init` (writes
  `PRODUCT.md`), then after the first screens exist `/impeccable document` (writes
  `DESIGN.md`). Read both before changing UI.
- Before any UI edit, Impeccable's `reference/craft-floor.md` applies. Before shipping a
  screen: `/impeccable critique <screen>` then `/impeccable polish <screen>`;
  `/impeccable audit` for accessibility/performance; `/impeccable adapt` for iPhone sizes.
- Also check UI against the **web-design-guidelines** skill.
- Avoid generic AI looks: no purple gradients, no card-in-card, no icon tile above every
  heading, no grey text on coloured backgrounds. Restrained palette with one accent.
  Belt colours may be used as meaningful accents for levels, nothing more.
- Do not use militaristic or nationalist emblems as decoration.
- Contrast ≥ WCAG 2.2 AA in both light and dark.

## Commands (once scaffolded)

```bash
npm ci                 # install
npm run dev            # dev server
npm run check          # astro check + tsc (content schema + types)
npm run build          # static build to dist/
npm run preview        # serve dist/ locally
npm run test:e2e       # Playwright against the built site
```

Always run `npm run check`, `npm run build` and `npm run test:e2e` before committing.

## Base path

The site is served from `https://<user>.github.io/taek/` and previews from
`https://<user>.github.io/taek/pr-preview/pr-<n>/`. `astro.config.mjs` reads `SITE` and
`BASE_PATH` from the environment (default `/taek/`). Never hard-code `/` in links or asset
URLs: use `import.meta.env.BASE_URL` (and Astro's asset pipeline). The manifest and
service-worker scope must also follow the base path. Tests must exercise a non-root base.

## CI/CD (GitHub Actions + GitHub Pages)

Pages source: **Deploy from a branch → `gh-pages` / root** (required for PR previews).

1. `ci.yml` — on every push and pull request: `npm ci` → `npm run check` → `npm run build`
   → Playwright tests (projects: WebKit "iPhone 15" emulation + desktop Chromium) against
   `npm run preview` → axe accessibility checks → upload the Playwright report as an
   artifact on failure.
2. `deploy.yml` — on push to `main` after CI passes: build with `BASE_PATH=/taek/` and
   publish `dist/` to `gh-pages` with `JamesIves/github-pages-deploy-action`, using
   `clean-exclude: pr-preview/` so previews survive.
3. `preview.yml` — on `pull_request` (opened/synchronize/reopened/closed): build with
   `BASE_PATH=/taek/pr-preview/pr-<n>/` and deploy with `rossjrw/pr-preview-action`
   (it comments the preview URL on the PR and removes the preview on close). Then run the
   Playwright smoke suite against the live preview URL.
   Preview jobs need `contents: write` and `pull-requests: write`; skip for PRs from forks.
4. Optional design gate: `npx impeccable detect --github dist/` to annotate design-slop
   findings on the PR.

Pin third-party actions to a full commit SHA. Use `concurrency` groups so deploys don't
race. Never commit secrets; none are needed (the default `GITHUB_TOKEN` suffices).

## Testing expectations

Playwright specs in `tests/e2e/` must cover at least:
- Home lists all five sections; each section page lists its tutorials in `order`.
- A tutorial renders title, Korean name, text, images (with alt) and its video:
  file video has `playsinline` and a poster; YouTube facade loads the iframe only on tap.
- Tab bar navigation and in-app back links work at the iPhone viewport.
- Manifest is reachable, valid JSON, and icons resolve; `apple-touch-icon` resolves.
- No broken internal links (crawl from home under the base path).
- axe: no serious/critical violations on home, a section, and a tutorial, in light and dark.
- Offline: after one visit, the app shell and a visited tutorial load offline (production
  build only).

Use role/label-based locators (`getByRole`, `getByLabel`), not CSS selectors.

## Skills in this repo (`.claude/skills/`)

| Skill | Use it for |
|---|---|
| `impeccable` | All design work: `init`, `shape`, `critique`, `audit`, `polish`, `adapt`, `typeset`, `layout`, `harden`… |
| `web-design-guidelines` | Rule-based UI/a11y review of changed files (`file:line` findings) |
| `webapp-testing` | Driving the running site with Playwright to debug and screenshot |
| `find-skills` | Finding further skills on skills.sh when a new need comes up |
| `taekwondo-content` | Adding or editing a tutorial (frontmatter, media, checks) |

Impeccable sub-agents live in `.claude/agents/`. Provenance and update steps for vendored
skills are in `.claude/skills/README.md`. Vet any new third-party skill (source, installs,
licence, contents) before adding it, and record it in that README.

## Working rules

- Small, focused commits. Develop on a feature branch; `main` deploys to production.
- Content and code changes go through a PR so a preview is built.
- Don't add analytics, tracking, or third-party scripts other than the YouTube facade.
- Keep pages light: target < 100 KB JS total, Lighthouse performance ≥ 95 on mobile.
