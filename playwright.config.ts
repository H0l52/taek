import { defineConfig, devices } from '@playwright/test';

/**
 * Integration tests run against the built site (`npm run build` first), served by
 * scripts/serve.mjs under the real base path, the way GitHub Pages serves it. Set PREVIEW_URL to run against a deployed
 * site instead (CI does this for PR previews with `--grep @smoke`).
 *
 * The iPhone project uses WebKit, like Safari. Where WebKit isn't installed, set
 * PW_IPHONE_BROWSER=chromium to emulate the iPhone viewport and user agent in Chromium.
 */
const previewUrl = process.env.PREVIEW_URL;
const port = 4321;
const basePath = process.env.BASE_PATH ?? '/taek/';
const baseURL = previewUrl ?? `http://127.0.0.1:${port}${basePath}`;
const iphoneBrowser = (process.env.PW_IPHONE_BROWSER ?? 'webkit') as 'webkit' | 'chromium';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: baseURL.endsWith('/') ? baseURL : `${baseURL}/`,
    trace: 'off',
  },
  projects: [
    { name: 'iphone', use: { ...devices['iPhone 15'], browserName: iphoneBrowser } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  ...(previewUrl
    ? {}
    : {
        webServer: {
          command: `node scripts/serve.mjs`,
          url: `http://127.0.0.1:${port}${basePath}`,
          env: { BASE_PATH: basePath, PORT: String(port) },
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
      }),
});
