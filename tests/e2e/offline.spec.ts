import { expect, test } from '@playwright/test';
import { hasServiceWorker } from './helpers';

test.describe('offline', () => {
  test.skip(!hasServiceWorker, 'Service worker only exists in builds with PUBLIC_ENABLE_SW=true');
  test.skip(({ browserName }) => browserName !== 'chromium', 'Offline emulation with service workers is reliable in Chromium');

  test('the app shell and a visited tutorial open offline', async ({ page, context }) => {
    await page.goto('./');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.goto('patterns/koryo/');
    await expect(page.getByRole('heading', { level: 1, name: 'Koryo' })).toBeVisible();
    // Wait until the visited page is in the cache.
    await expect
      .poll(() => page.evaluate(async () => !!(await caches.match(location.href))), { timeout: 10_000 })
      .toBe(true);

    await context.setOffline(true);
    await page.goto('./');
    await expect(page.getByRole('heading', { level: 1, name: 'Taek' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Sections' })).toBeVisible();
    await page.goto('patterns/koryo/');
    await expect(page.getByRole('heading', { level: 1, name: 'Koryo' })).toBeVisible();
    await context.setOffline(false);
  });
});
