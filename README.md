# Taek

Kukkiwon taekwondo tutorials (kicks, blocks, strikes, self defences and poomsae) as an
installable iPhone web app, hosted on GitHub Pages. Project rules for Claude: `CLAUDE.md`.
Product context: `PRODUCT.md`.

## Develop

```bash
npm ci
npm run dev          # http://localhost:4321/taek/
npm run check        # types + content schema
npm run build
npm run test:e2e     # Playwright, needs: npx playwright install chromium webkit
```

Add a tutorial by adding a Markdown file to `src/content/<section>/` (ask Claude to use the
`taekwondo-content` skill).

## One-time GitHub setup

1. **Settings → Pages → Build and deployment**: Source **Deploy from a branch**, branch
   **gh-pages**, folder **/ (root)**. The branch appears after the first deploy or PR preview.
2. **Settings → Actions → General → Workflow permissions**: **Read and write permissions**
   (the deploy and preview workflows push to `gh-pages` and comment on PRs).
3. Merge to `main` to deploy to `https://<user>.github.io/taek/`. Each PR gets a preview at
   `https://<user>.github.io/taek/pr-preview/pr-<n>/`, linked in a PR comment.

## One-time Impeccable setup (on your computer)

The Impeccable skill is committed in `.claude/skills/impeccable`; its engine binary
downloads (checksum-verified) the first time it runs. In Claude Code, in this folder:

1. Run `/impeccable hooks on` to wire the design detector into Claude Code
   (it writes `.claude/settings.local.json`, which stays on your machine).
   Alternatively run `npx impeccable install --providers=claude --scope=project` and accept the hook.
2. Restart Claude Code, then `/impeccable` to see the commands. `PRODUCT.md` is already
   written; run `/impeccable document` to record the visual system in `DESIGN.md`.

## Install on iPhone

Open the site in Safari → Share → **Add to Home Screen**.
