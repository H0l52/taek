/** Join a path onto the deploy base. Never hard-code "/" links: previews live under a sub-path. */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const clean = path.replace(/^\/+/, '');
  return `${base}${clean}`;
}
