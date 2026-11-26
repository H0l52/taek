import { expect, test } from '@playwright/test';
import { hasExamples } from './helpers';

test.describe('tutorials @smoke', () => {
  test('a technique shows its name, Korean, key points, steps and mistakes', async ({ page }) => {
    await page.goto('kicks/front-kick/');
    await expect(page.getByRole('heading', { level: 1, name: 'Front kick' })).toBeVisible();
    await expect(page.getByText('Ap chagi')).toBeVisible();
    await expect(page.getByText('앞차기')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Key points' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Steps' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Common mistakes' })).toBeVisible();
  });

  test('a poomsae shows its grade, floor line, moves and meaning', async ({ page }) => {
    await page.goto('patterns/koryo/');
    await expect(page.getByRole('heading', { level: 1, name: 'Koryo' })).toBeVisible();
    await expect(page.getByText('1st Dan', { exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: /Koryo: floor line/ })).toBeVisible();
    await expect(page.getByRole('definition').filter({ hasText: '30' })).toBeVisible();
    await expect(page.getByText(/Goryeo dynasty/)).toBeVisible();
  });
});

test.describe('media', () => {
  test.skip(!hasExamples, 'Needs the example fixtures (INCLUDE_EXAMPLES=true)');

  test('repository video plays inline with a poster, captions and slow motion', async ({ page }) => {
    await page.goto('kicks/example-file-video/');
    const video = page.getByLabel('Example demonstration clip');
    await expect(video).toHaveAttribute('playsinline', '');
    await expect(video).toHaveAttribute('preload', 'metadata');
    await expect(video).toHaveAttribute('poster', /\.webp$/);
    const src = await video.locator('source').getAttribute('src');
    expect(src).toMatch(/\.mp4$/);
    const res = await page.request.get(src!);
    expect(res.ok()).toBe(true);

    const speed = page.getByRole('group', { name: 'Playback speed' });
    await speed.getByRole('button', { name: '¼×' }).click();
    await expect(speed.getByRole('button', { name: '¼×' })).toHaveAttribute('aria-pressed', 'true');
    await expect(speed.getByRole('button', { name: '1×' })).toHaveAttribute('aria-pressed', 'false');
    expect(await video.evaluate((v: HTMLVideoElement) => v.playbackRate)).toBe(0.25);
  });

  test('photos have alt text', async ({ page }) => {
    await page.goto('kicks/example-file-video/');
    await expect(page.getByRole('img', { name: /stands? in for a stance|standing in for a stance/ })).toBeVisible();
  });

  test('YouTube loads nothing until tapped, then embeds the no-cookie player', async ({ page }) => {
    const youtubeRequests: string[] = [];
    await page.route(/^https:\/\/([a-z0-9-]+\.)*(youtube(-nocookie)?\.com|ytimg\.com|googlevideo\.com)\//, (route) => {
      youtubeRequests.push(route.request().url());
      return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' });
    });
    await page.goto('strikes/example-youtube/');
    await expect(page.getByRole('button', { name: 'Play video: Example YouTube video' })).toBeVisible();
    await expect(page.locator('iframe')).toHaveCount(0);
    expect(youtubeRequests).toEqual([]);

    await page.getByRole('button', { name: 'Play video: Example YouTube video' }).click();
    const frame = page.getByTitle('Example YouTube video');
    await expect(frame).toHaveAttribute('src', /^https:\/\/www\.youtube-nocookie\.com\/embed\/aqz-KE-bpKQ\?/);
    await expect(frame).toHaveAttribute('src', /playsinline=1/);
    await expect(frame).toHaveAttribute('src', /start=5/);
    await expect(page.getByRole('link', { name: 'Open in YouTube' })).toHaveAttribute('href', /watch\?v=aqz-KE-bpKQ/);
  });
});
