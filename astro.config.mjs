// @ts-check
import { defineConfig } from 'astro/config';

// SITE and BASE_PATH come from the environment so the same build works for production
// (https://<user>.github.io/taek/) and PR previews (/taek/pr-preview/pr-<n>/).
const base = process.env.BASE_PATH ?? '/taek/';

export default defineConfig({
  site: process.env.SITE ?? 'https://h0l52.github.io',
  base: base.endsWith('/') ? base : `${base}/`,
  trailingSlash: 'always',
  output: 'static',
  // 'assets' rather than '_astro': GitHub Pages' Jekyll step drops underscore folders,
  // and a PR preview can deploy before the root .nojekyll exists.
  build: { format: 'directory', assets: 'assets' },
  prefetch: false,
  devToolbar: { enabled: false },
  vite: {
    build: {
      // Video and captions are always separate files (never inlined as data: URIs), so the
      // service worker can skip them and iOS can stream them with range requests.
      assetsInlineLimit: (file) => (/\.(mp4|m4v|webm|mov|vtt)$/.test(file) ? false : undefined),
    },
  },
});
