import { expect, test } from '@playwright/test';
import { SECTIONS, tabBar } from './helpers';

test.describe('navigation @smoke', () => {
  test('home lists all five sections in order', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { level: 1, name: 'Taek' })).toBeVisible();
    const links = page.getByRole('region', { name: 'Sections' }).getByRole('link');
    await expect(links).toHaveText(SECTIONS.map((s) => new RegExp(`^\\s*${s.title}`)));
  });

  test('home puts the black belt poomsae first, in dan order', async ({ page }) => {
    await page.goto('./');
    const dan = page.getByRole('region', { name: 'Black belt poomsae' });
    await expect(dan.getByRole('link').first()).toContainText('Koryo');
    await expect(dan.getByRole('link').first()).toContainText('1st Dan');
  });

  test('tab bar reaches every section and marks the current one', async ({ page }) => {
    await page.goto('./');
    for (const section of SECTIONS) {
      await tabBar(page).getByRole('link', { name: section.tab }).click();
      await expect(page).toHaveURL(new RegExp(`/${section.slug}/$`));
      await expect(page.getByRole('heading', { level: 1, name: section.title })).toBeVisible();
      await expect(tabBar(page).getByRole('link', { name: section.tab })).toHaveAttribute('aria-current', 'page');
    }
  });

  test('every non-root page has an in-app back link', async ({ page }) => {
    await page.goto('patterns/');
    await page.getByRole('link', { name: /Koryo/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Koryo' })).toBeVisible();
    await page.getByRole('link', { name: 'Patterns', exact: true }).first().click();
    await expect(page).toHaveURL(/\/patterns\/$/);
    await page.getByRole('link', { name: 'Taek', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Taek' })).toBeVisible();
  });

  test('patterns list dan grades before geup grades, each in order', async ({ page }) => {
    await page.goto('patterns/');
    const groups = page.getByRole('heading', { level: 2 });
    await expect(groups).toHaveText(['Dan grades', 'Geup grades']);
    const dan = page.getByRole('region', { name: 'Dan grades' }).getByRole('link');
    await expect(dan.nth(0)).toHaveText(/^\s*Koryo/);
    await expect(dan.nth(1)).toHaveText(/^\s*Keumgang/);
    await expect(dan.nth(2)).toHaveText(/^\s*Taebaek/);
    const geup = page.getByRole('region', { name: 'Geup grades' }).getByRole('link');
    await expect(geup.nth(0)).toHaveText(/^\s*Taegeuk 1(?!\d)/);
    await expect(geup.nth(1)).toHaveText(/^\s*Taegeuk 2(?!\d)/);
  });

  test('techniques are listed in their order field', async ({ page }) => {
    await page.goto('kicks/');
    const links = page.getByRole('region', { name: 'Kicks' }).getByRole('link');
    await expect(links.nth(0)).toHaveText(/^\s*Front kick/);
    await expect(links.nth(1)).toHaveText(/^\s*Turning kick/);
    await expect(links.nth(2)).toHaveText(/^\s*Side kick/);
  });
});

// Not @smoke: on GitHub Pages a preview's misses get the site-root 404 page.
test('unknown pages show the 404 page', async ({ page }) => {
  const response = await page.goto('no-such-page/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});
