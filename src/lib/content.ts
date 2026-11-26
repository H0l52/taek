import { getCollection, type CollectionEntry } from 'astro:content';
import { SECTIONS, type SectionSlug } from './sections';

export type Tutorial = CollectionEntry<SectionSlug>;
export type Grade = NonNullable<Tutorial['data']['grade']>;

export async function getTutorials(section: SectionSlug): Promise<Tutorial[]> {
  const entries = (await getCollection(section)) as Tutorial[];
  return entries.sort(compareTutorials);
}

export async function getAllTutorials() {
  return Promise.all(
    SECTIONS.map(async (section) => ({ section, tutorials: await getTutorials(section.slug) })),
  );
}

/** Dan before geup before ungraded; dan ascending (1st → 9th), geup in learning order (10th → 1st). */
function gradeRank(g: Grade | undefined): number {
  if (!g) return 100;
  return g.kind === 'dan' ? g.level : 20 + (10 - g.level);
}

export function compareTutorials(a: Tutorial, b: Tutorial): number {
  return gradeRank(a.data.grade) - gradeRank(b.data.grade) || a.data.order - b.data.order;
}

export type Group = { id: 'dan' | 'geup' | 'other'; title: string; tutorials: Tutorial[] };

export function groupTutorials(tutorials: Tutorial[]): Group[] {
  const groups: Group[] = [
    { id: 'dan', title: 'Dan grades', tutorials: [] },
    { id: 'geup', title: 'Geup grades', tutorials: [] },
    { id: 'other', title: 'Fundamentals', tutorials: [] },
  ];
  for (const t of tutorials) {
    const id = t.data.grade?.kind ?? 'other';
    groups.find((g) => g.id === id)!.tutorials.push(t);
  }
  return groups.filter((g) => g.tutorials.length > 0);
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]!);
}

export function gradeLabel(g: Grade): string {
  return `${ordinal(g.level)} ${g.kind === 'dan' ? 'Dan' : 'Geup'}`;
}

// Repository video and captions live next to the Markdown file. Vite emits them as hashed
// assets; this map turns "src/content/kicks/video/x.mp4" into its built URL.
const mediaUrls = import.meta.glob<string>('/src/{content,examples}/**/*.{mp4,m4v,webm,vtt}', {
  query: '?url',
  import: 'default',
  eager: true,
});

export function resolveMedia(entry: Tutorial, relative: string): string {
  const dir = (entry.filePath ?? '').split('/').slice(0, -1);
  for (const part of relative.split('/')) {
    if (part === '.' || part === '') continue;
    if (part === '..') dir.pop();
    else dir.push(part);
  }
  const key = `/${dir.join('/')}`;
  const found = mediaUrls[key];
  if (!found) throw new Error(`Media file not found: ${key} (referenced by ${entry.filePath})`);
  return found;
}
