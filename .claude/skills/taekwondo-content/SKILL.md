---
name: taekwondo-content
description: Add or edit a taekwondo tutorial (kick, block, strike, self defence or pattern) in this repo, including its text, images and file or YouTube video. Use when the user asks to add, write, update or reorder a tutorial or its media.
---

# Taekwondo tutorial content

Tutorials are Markdown files in `src/content/<section>/<slug>.md`, where `<section>` is one
of `kicks`, `blocks`, `strikes`, `self-defence`, `patterns`. The schema is in
`src/content/config.ts`; the frontmatter fields and media rules are in `CLAUDE.md`
("Content model", "Video rules"). Read both first.

## Steps

1. Confirm the section, the English name and the Korean name. If the syllabus (ITF or
   WT/Kukkiwon) is not yet recorded in `PRODUCT.md`, ask; never invent Korean terms,
   move counts or pattern meanings. Mark anything unverified with `TODO(verify)` and tell
   the user.
2. Pick the slug: lowercase, hyphenated English name (`turning-kick`).
3. Set `order` so the list reads in teaching order; renumber neighbours if needed.
4. Write the body for a learner on a phone:
   - One short intro paragraph (what it is, when it is used).
   - `## Steps` as a numbered list, one movement per step, under ~20 words each.
   - Key points and common mistakes go in frontmatter, not repeated in the body.
   - British English. Second person, present tense ("Pivot on the ball of your foot").
5. Media:
   - Images beside the file in `./images/`, with real `alt` text describing body position.
   - Repository video in `./video/`: H.264 MP4, < 8 MB, faststart, with a poster image.
     If the user supplies a large file, compress it
     (`ffmpeg -i in.mov -vf scale=-2:720 -c:v libx264 -crf 26 -preset slow -an -movflags +faststart out.mp4`)
     and keep audio only if there is speech (then add captions `.vtt`).
   - YouTube: store the 11-character video ID in `video.youtube` (strip URLs), plus
     optional `start` seconds.
6. Verify: `npm run check && npm run build`, then `npm run test:e2e`. Open the page at an
   iPhone viewport (use the `webapp-testing` skill) and check the video plays inline.
