import type { APIRoute } from 'astro';
import { url } from '../lib/paths';

// The service worker is generated at build time so it knows the deploy base path and a
// cache version that changes on every deploy (the commit SHA in CI).
export const GET: APIRoute = () => {
  const version = import.meta.env.PUBLIC_BUILD_ID || 'dev';
  const body = `/* Taek service worker, build ${version} */
const CACHE = 'taek-${version}';
const SCOPE = ${JSON.stringify(url())};
const SHELL = [SCOPE, SCOPE + 'manifest.webmanifest', SCOPE + 'icons/apple-touch-icon.png', SCOPE + 'icons/icon-192.png'];
const NO_CACHE = /\\.(mp4|m4v|webm|mov)(\\?|$)/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(SHELL);
      // Cache the home page's own assets so the shell renders offline.
      const html = await (await cache.match(SCOPE)).text();
      const assets = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
        .map((m) => new URL(m[1], self.location.href))
        .filter((u) => u.origin === self.location.origin && u.pathname.startsWith(SCOPE) && !NO_CACHE.test(u.pathname))
        .map((u) => u.href);
      await Promise.all(assets.map((a) => cache.add(a).catch(() => {})));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('taek-') && k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

// Pages report what they loaded before the worker took control, so the first visit counts.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'cache-urls') {
    event.waitUntil(
      caches.open(CACHE).then((cache) =>
        Promise.all(
          event.data.urls
            .filter((u) => typeof u === 'string' && !NO_CACHE.test(u))
            .map((u) => cache.match(u).then((hit) => hit || cache.add(u).catch(() => {}))),
        ),
      ),
    );
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const reqUrl = new URL(request.url);
  if (request.method !== 'GET' || reqUrl.origin !== self.location.origin || !reqUrl.pathname.startsWith(SCOPE)) return;
  // Never cache video: iOS caps storage for home-screen apps, and range requests break.
  if (request.destination === 'video' || request.destination === 'track' || request.headers.has('range') || NO_CACHE.test(reqUrl.pathname)) return;

  // Stale-while-revalidate for pages and assets.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
      const network = fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') cache.put(request, response.clone());
          return response;
        })
        .catch(() => undefined);
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      const response = await network;
      if (response) return response;
      if (request.mode === 'navigate') {
        const fallback = await cache.match(SCOPE);
        if (fallback) return fallback;
      }
      return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    })(),
  );
});
`;
  return new Response(body, { headers: { 'Content-Type': 'text/javascript' } });
};
