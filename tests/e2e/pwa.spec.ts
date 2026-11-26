import { expect, test } from '@playwright/test';

test.describe('home screen app @smoke', () => {
  test('manifest is valid and scoped to the base path', async ({ page, request, baseURL }) => {
    await page.goto('./');
    const href = await page.locator('link[rel="manifest"]').getAttribute('href');
    const res = await request.get(new URL(href!, page.url()).href);
    expect(res.ok()).toBe(true);
    const manifest = await res.json();
    const base = new URL(baseURL!).pathname;
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe(base);
    expect(manifest.scope).toBe(base);
    expect(manifest.short_name).toBe('Taek');
    const purposes = manifest.icons.map((i: { purpose: string }) => i.purpose);
    expect(purposes).toContain('maskable');
    for (const icon of manifest.icons) {
      const iconRes = await request.get(new URL(icon.src, page.url()).href);
      expect(iconRes.ok(), icon.src).toBe(true);
      expect(iconRes.headers()['content-type']).toContain('image/png');
    }
  });

  test('head has the iOS home screen tags', async ({ page, request }) => {
    await page.goto('./');
    const touchIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
    expect((await request.get(new URL(touchIcon!, page.url()).href)).ok()).toBe(true);
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /viewport-fit=cover/);
    await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute('content', 'Taek');
    await expect(page.locator('meta[name="mobile-web-app-capable"]')).toHaveAttribute('content', 'yes');
    await expect(page.locator('meta[name="apple-mobile-web-app-status-bar-style"]')).toHaveCount(1);
    await expect(page.locator('meta[name="theme-color"]')).toHaveCount(2);
  });

  test('install hint shows once on iPhone Safari and stays dismissed', async ({ page, isMobile }) => {
    await page.goto('./');
    const hint = page.getByRole('complementary', { name: 'Keep Taek on your Home Screen' });
    if (!isMobile) {
      await expect(hint).toBeHidden();
      return;
    }
    await expect(hint).toBeVisible();
    await hint.getByRole('button', { name: 'Dismiss' }).click();
    await expect(hint).toBeHidden();
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: 'Taek' })).toBeVisible();
    await expect(hint).toBeHidden();
  });
});
