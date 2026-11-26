import { expect, test } from '@playwright/test';

test('no broken internal links or assets @smoke', async ({ page, request, baseURL }) => {
  test.skip(test.info().project.name !== 'desktop', 'One crawl is enough');
  test.setTimeout(120_000);
  const base = new URL(baseURL!);
  const seen = new Set<string>();
  const queue = [base.href];
  const broken: string[] = [];

  while (queue.length) {
    const url = queue.shift()!;
    if (seen.has(url)) continue;
    seen.add(url);
    const response = await page.goto(url);
    if (!response || response.status() >= 400) {
      broken.push(`${url} → ${response?.status()}`);
      continue;
    }
    const refs = await page
      .locator('a[href], link[href], img[src], source[src], track[src], video[poster]')
      .evaluateAll((els) =>
        els.flatMap((el) => [el.getAttribute('href'), el.getAttribute('src'), el.getAttribute('poster')].filter(Boolean)),
      );
    for (const ref of refs as string[]) {
      const target = new URL(ref, url);
      target.hash = '';
      if (target.origin !== base.origin || !target.pathname.startsWith(base.pathname)) continue;
      if (seen.has(target.href)) continue;
      if (target.pathname.endsWith('/')) {
        queue.push(target.href);
      } else {
        seen.add(target.href);
        const res = await request.get(target.href);
        if (!res.ok()) broken.push(`${target.href} → ${res.status()} (from ${url})`);
      }
    }
  }
  expect(broken).toEqual([]);
  expect(seen.size).toBeGreaterThan(20);
});
