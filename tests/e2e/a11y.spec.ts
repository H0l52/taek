import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { hasExamples } from './helpers';

const pages = [
  { name: 'home', path: './' },
  { name: 'section', path: 'patterns/' },
  { name: 'technique', path: 'kicks/front-kick/' },
  { name: 'poomsae', path: 'patterns/koryo/' },
  { name: 'vocab', path: 'vocab/' },
  ...(hasExamples
    ? [
        { name: 'file video', path: 'kicks/example-file-video/' },
        { name: 'youtube', path: 'strikes/example-youtube/' },
      ]
    : []),
];

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`accessibility (${scheme})`, () => {
    test.use({ colorScheme: scheme });
    for (const { name, path } of pages) {
      test(`${name} has no serious or critical violations`, async ({ page }) => {
        await page.goto(path);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
        expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
      });
    }
  });
}
