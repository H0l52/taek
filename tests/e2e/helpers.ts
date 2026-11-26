import type { Page } from '@playwright/test';

export const SECTIONS = [
  { slug: 'kicks', title: 'Kicks', tab: 'Kicks' },
  { slug: 'blocks', title: 'Blocks', tab: 'Blocks' },
  { slug: 'strikes', title: 'Strikes', tab: 'Strikes' },
  { slug: 'self-defence', title: 'Self defences', tab: 'Defence' },
  { slug: 'patterns', title: 'Patterns', tab: 'Patterns' },
] as const;

/** Example fixtures (src/examples) are only present in the CI test build. */
export const hasExamples = process.env.INCLUDE_EXAMPLES === 'true';
/** The service worker is only registered when built with PUBLIC_ENABLE_SW=true. */
export const hasServiceWorker = process.env.PUBLIC_ENABLE_SW === 'true';

export function tabBar(page: Page) {
  return page.getByRole('navigation', { name: 'Sections' });
}
