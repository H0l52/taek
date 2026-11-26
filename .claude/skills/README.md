# Vendored skills

Skills here are committed so every session (local, cloud, CI) gets the same versions.
They were chosen by following the `find-skills` vetting rules (reputable source, high
install count on skills.sh, licence, contents reviewed) on 2026-11-26.

| Skill | Source | Commit | Licence |
|---|---|---|---|
| `impeccable` (+ `../agents/impeccable-*.md`) | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) `.claude/skills/impeccable` | `2fc5e1459efbbf06d92c7306517c286bf12490cf` | Apache-2.0 |
| `find-skills` | [vercel-labs/skills](https://github.com/vercel-labs/skills) `skills/find-skills` | `57217cf86ba38148a57af9e90d14a4c049558330` | MIT |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) `skills/web-design-guidelines` | `5a37a6329fbad3666c3207392a6a7c0110e92efb` | MIT |
| `webapp-testing` | [anthropics/skills](https://github.com/anthropics/skills) `skills/webapp-testing` | `e4bb5d960d87126ff3b3a8af1a104b7db67560ba` | Apache-2.0 |
| `taekwondo-content` | this repo | — | — |

## Impeccable notes

- The launcher `impeccable/scripts/impeccable` downloads a checksum-verified engine binary
  on first run (into the skill's `scripts/` dir or `~/.impeccable`). Those files are
  git-ignored.
- Impeccable's optional design-detector hooks (SessionStart / PostToolUse on Edit|Write /
  Stop) are **not** enabled. To opt in, copy the `hooks` block from
  `pbakaus/impeccable/.claude/settings.json` into `.claude/settings.json`, or run
  `npx impeccable install --providers=claude --scope=project` and accept the hook.

## Updating

Easiest: `npx impeccable update` for Impeccable, and
`npx skills add <owner/repo> --skill <name> -a claude-code` for the others (`-a claude-code`
keeps files in `.claude/skills/`). Or re-copy the folder from the source repo at a new
commit. Review the diff, then update the commit column above.

## Considered, not added

- PWA skills on skills.sh (`davila7/.../progressive-web-app`, `jwynia/.../pwa-development`,
  `sebastiaanwouters/.../pwa`): low install counts or framework-specific (React/Next).
  The iPhone/PWA rules this project needs are written directly in `CLAUDE.md`.
- `anthropics/skills` `frontend-design`: Impeccable is a maintained superset of it.
