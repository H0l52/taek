import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SECTIONS } from './lib/sections';

// Example tutorials (src/examples/) exercise every media type in the integration tests.
// They are only built when INCLUDE_EXAMPLES=true, never on the production deploy.
const includeExamples = process.env.INCLUDE_EXAMPLES === 'true';

const grade = z
  .object({
    kind: z.enum(['geup', 'dan']),
    level: z.number().int().min(1),
  })
  .strict()
  .refine((g) => g.level <= (g.kind === 'dan' ? 9 : 10), {
    message: 'Dan grades run 1–9, geup grades 10–1',
  });

const alt = z.string().min(8, 'Write alt text that describes the body position');

const schema = ({ image }: SchemaContext) => {
  const picture = z
    .object({ src: image(), alt, caption: z.string().optional() })
    .strict();

  const fileVideo = z
    .object({
      file: z.string().regex(/^\.\/.+\.(mp4|m4v|webm)$/, 'Relative path to an .mp4/.m4v/.webm file'),
      poster: image(),
      captions: z.string().regex(/^\.\/.+\.vtt$/).optional(),
      /** Demonstration clips loop silently by default. */
      loop: z.boolean().default(true),
      /** Set true when the clip has speech or useful sound (then add captions). */
      audio: z.boolean().default(false),
      title: z.string().optional(),
    })
    .strict();

  const youtubeVideo = z
    .object({
      youtube: z.string().regex(/^[A-Za-z0-9_-]{11}$/, 'YouTube video ID only (11 characters), not a URL'),
      start: z.number().int().min(0).optional(),
      title: z.string().optional(),
      poster: image().optional(),
    })
    .strict();

  return z
    .object({
      title: z.string().min(2),
      korean: z.string().min(2),
      hangul: z.string().optional(),
      order: z.number().int().min(0),
      grade: grade.optional(),
      summary: z.string().min(10).max(160),
      hero: picture.optional(),
      images: z.array(picture).default([]),
      video: z.union([fileVideo, youtubeVideo]).optional(),
      keyPoints: z.array(z.string()).default([]),
      commonMistakes: z.array(z.string()).default([]),
      // Patterns only (enforced below).
      family: z.enum(['taegeuk', 'black-belt']).optional(),
      moves: z.number().int().min(1).optional(),
      meaning: z.string().optional(),
      line: z.enum(['wang', 'sa', 'san', 'gong', 'il', 'sip', 'jitae', 'cheonkwon']).optional(),
    })
    .strict();
};

function collectionFor(slug: string) {
  return defineCollection({
    loader: glob({
      base: './src',
      pattern: [`content/${slug}/*.md`, ...(includeExamples ? [`examples/${slug}/*.md`] : [])],
      generateId: ({ entry }) => entry.split('/').pop()!.replace(/\.md$/, ''),
    }),
    schema:
      slug === 'patterns'
        ? (ctx: SchemaContext) =>
            schema(ctx).refine((d) => d.grade && d.family && d.moves && d.meaning, {
              message: 'Patterns need grade, family, moves and meaning',
            })
        : schema,
  });
}

export const collections = Object.fromEntries(
  SECTIONS.map((s) => [s.slug, collectionFor(s.slug)]),
) as Record<(typeof SECTIONS)[number]['slug'], ReturnType<typeof collectionFor>>;
