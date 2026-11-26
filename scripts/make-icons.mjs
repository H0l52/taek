// Renders public/icons/icon.svg to the PNG sizes iOS and the web manifest need.
// Run: node scripts/make-icons.mjs  (uses Playwright's Chromium)
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const svg = await readFile(new URL('../public/icons/icon.svg', import.meta.url), 'utf8');
const out = (name) => new URL(`../public/icons/${name}`, import.meta.url).pathname;

// iOS ignores transparency and rounds corners itself, so the touch icon is full-bleed.
const fullBleed = svg.replace('rx="112"', 'rx="0"');
// Maskable icons keep the mark inside the central 80% safe zone.
const maskable = fullBleed.replace('<g ', '<g transform="translate(51.2 51.2) scale(0.8)" ');

const jobs = [
  { name: 'apple-touch-icon.png', size: 180, svg: fullBleed },
  { name: 'icon-192.png', size: 192, svg },
  { name: 'icon-512.png', size: 512, svg },
  { name: 'icon-maskable-512.png', size: 512, svg: maskable },
];

const browser = await chromium.launch();
for (const job of jobs) {
  const page = await browser.newPage({ viewport: { width: job.size, height: job.size } });
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{width:${job.size}px;height:${job.size}px;display:block}</style>${job.svg}`,
  );
  await page.screenshot({ path: out(job.name), omitBackground: job.name !== 'apple-touch-icon.png' });
  await page.close();
}
await browser.close();
console.log('Icons written to public/icons/');
