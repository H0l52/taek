export const SECTIONS = [
  { slug: 'kicks', title: 'Kicks', korean: 'Chagi', hangul: '차기', short: 'Kicks' },
  { slug: 'blocks', title: 'Blocks', korean: 'Makki', hangul: '막기', short: 'Blocks' },
  { slug: 'strikes', title: 'Strikes', korean: 'Jireugi & Chigi', hangul: '지르기 · 치기', short: 'Strikes' },
  { slug: 'self-defence', title: 'Self defences', korean: 'Hosinsul', hangul: '호신술', short: 'Defence' },
  { slug: 'patterns', title: 'Patterns', korean: 'Poomsae', hangul: '품새', short: 'Patterns' },
] as const;

export type Section = (typeof SECTIONS)[number];
export type SectionSlug = Section['slug'];

export function getSection(slug: string): Section {
  const section = SECTIONS.find((s) => s.slug === slug);
  if (!section) throw new Error(`Unknown section "${slug}"`);
  return section;
}
