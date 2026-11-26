// Minimal static server for dist/ that behaves like GitHub Pages: the site lives under
// BASE_PATH, directories serve index.html, "/dir" redirects to "/dir/", misses get 404.html.
// Used by the Playwright tests; no dependencies.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const base = (process.env.BASE_PATH ?? '/taek/').replace(/\/?$/, '/');
const port = Number(process.env.PORT ?? 4321);
const host = process.env.HOST ?? '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.webm': 'video/webm',
  '.vtt': 'text/vtt; charset=utf-8',
};

async function file(path) {
  try {
    const s = await stat(path);
    return s.isFile() ? path : null;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);
  if (!pathname.startsWith(base)) {
    res.writeHead(302, { Location: base }).end();
    return;
  }
  const rel = normalize(pathname.slice(base.length)).replace(/^(\.\.[/\\])+/, '');
  const target = join(root, rel);
  let found = await file(target);
  if (!found && !pathname.endsWith('/') && (await file(join(target, 'index.html')))) {
    res.writeHead(301, { Location: `${pathname}/${url.search}` }).end();
    return;
  }
  if (!found && pathname.endsWith('/')) found = await file(join(target, 'index.html'));
  const status = found ? 200 : 404;
  found ??= join(root, '404.html');
  const body = await readFile(found);
  const type = TYPES[extname(found)] ?? 'application/octet-stream';

  // Byte ranges, so Safari can stream video as it does from GitHub Pages.
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
  if (status === 200 && range) {
    const start = range[1] ? Number(range[1]) : body.length - Number(range[2]);
    const end = range[1] && range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
    res.writeHead(206, {
      'Content-Type': type,
      'Content-Range': `bytes ${start}-${end}/${body.length}`,
      'Content-Length': end - start + 1,
      'Accept-Ranges': 'bytes',
    });
    res.end(body.subarray(start, end + 1));
    return;
  }
  res.writeHead(status, { 'Content-Type': type, 'Content-Length': body.length, 'Accept-Ranges': 'bytes' });
  res.end(req.method === 'HEAD' ? undefined : body);
}).listen(port, host, () => {
  console.log(`Serving dist/ at http://${host}:${port}${base}`);
});
