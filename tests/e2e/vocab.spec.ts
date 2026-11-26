import { expect, test } from '@playwright/test';

test.describe('Korean terms @smoke', () => {
  test('home links to the terms page', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('region', { name: 'Study' }).getByRole('link', { name: /Korean terms/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Korean terms' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Counting' })).toBeVisible();
  });

  test('test-yourself hides meanings until a word is tapped', async ({ page }) => {
    await page.goto('vocab/');
    const counting = page.getByRole('region', { name: 'Counting' });
    await expect(counting.getByText('One', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Test yourself' }).click();
    await expect(page.getByRole('button', { name: 'Show all' })).toHaveAttribute('aria-pressed', 'true');
    await expect(counting.getByText('One', { exact: true })).toBeHidden();

    await counting.getByText('Hana', { exact: true }).click();
    await expect(counting.getByText('One', { exact: true })).toBeVisible();
    await expect(counting.getByText('Two', { exact: true })).toBeHidden();
  });
});
