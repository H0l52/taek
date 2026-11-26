import type { APIRoute } from 'astro';
import { url } from '../lib/paths';

export const GET: APIRoute = () => {
  const manifest = {
    id: url(),
    name: 'Taek — Kukkiwon taekwondo',
    short_name: 'Taek',
    description: 'Kukkiwon taekwondo technique and poomsae, in your pocket.',
    lang: 'en-GB',
    start_url: url(),
    scope: url(),
    display: 'standalone',
    orientation: 'any',
    theme_color: '#f5f2ec',
    background_color: '#f5f2ec',
    icons: [
      { src: url('icons/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: url('icons/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: url('icons/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
};
