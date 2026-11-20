// Valida los enlaces del sitio generado en dist/.
// Internos: el archivo y el ancla deben existir. Externos: se consulta la URL
// (usa --offline para omitirlos). Un externo sin respuesta se informa, no falla.
import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const offline = process.argv.includes('--offline');

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

const exists = (path) => access(path).then(() => true, () => false);
const pages = new Map();
for await (const file of htmlFiles(DIST)) pages.set(file, await readFile(file, 'utf8'));

const errors = [];
const external = new Map();
let internalCount = 0;

for (const [file, html] of pages) {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, raw] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const href = raw.replace(/&amp;/g, '&');
    if (/^(mailto:|tel:|data:)/.test(href)) continue;
    if (/^https?:\/\//.test(href)) {
      if (!external.has(href)) external.set(href, file);
      continue;
    }
    internalCount += 1;
    const [path, hash] = href.split('#');
    if (!path) {
      if (hash && !ids.has(hash)) errors.push(`${file}: ancla #${hash} no existe`);
      continue;
    }
    const target = join(DIST, path.endsWith('/') ? `${path}index.html` : path);
    if (!(await exists(target))) {
      errors.push(`${file}: ${href} no existe`);
    } else if (hash && target.endsWith('.html')) {
      const targetHtml = pages.get(target) ?? (await readFile(target, 'utf8'));
      if (!targetHtml.includes(`id="${hash}"`)) errors.push(`${file}: ${href} apunta a un ancla que no existe`);
    }
  }
  if (/target="_blank"(?![^>]*rel="[^"]*noopener)/.test(html)) errors.push(`${file}: target=_blank sin rel=noopener`);
}

console.log(`Enlaces internos revisados: ${internalCount}`);

const siteHost = (() => {
  const match = [...pages.values()].join('').match(/rel="canonical" href="(https?:\/\/[^/"]+)/);
  return match ? match[1] : null;
})();

const unverified = [];
if (!offline) {
  const targets = [...external.keys()].filter((url) => !siteHost || !url.startsWith(siteHost)).filter((url) => !url.startsWith('https://schema.org'));
  await Promise.all(
    targets.map(async (url) => {
      try {
        const response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(12000), headers: { 'User-Agent': 'Mozilla/5.0 (link-check)' } });
        if (response.status === 404 || response.status === 410) errors.push(`${external.get(url)}: ${url} responde ${response.status}`);
        else if (!response.ok) unverified.push(`${url} (HTTP ${response.status})`);
      } catch (error) {
        unverified.push(`${url} (${error.cause?.code ?? error.name})`);
      }
    }),
  );
  console.log(`Enlaces externos revisados: ${targets.length}`);
}

if (unverified.length) {
  console.log(`\nNo se pudieron verificar (${unverified.length}):`);
  for (const item of unverified) console.log(`  - ${item}`);
}
if (errors.length) {
  console.error(`\nEnlaces rotos (${errors.length}):`);
  for (const item of errors) console.error(`  - ${item}`);
  process.exit(1);
}
console.log('\nSin enlaces rotos.');
