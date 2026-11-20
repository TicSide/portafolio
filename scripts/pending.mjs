// Lista los datos "[POR CONFIRMAR]" que quedan en el contenido y la configuración.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const PENDING = /\[POR CONFIRMAR(?::\s*[^\]]*)?\]/g;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(ts|astro|json)$/.test(entry.name)) yield path;
  }
}

let total = 0;
for await (const file of walk('src')) {
  if (file.endsWith('.en.ts') || file.includes('i18n')) continue;
  const text = await readFile(file, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    for (const match of line.matchAll(PENDING)) {
      total += 1;
      console.log(`${file}:${index + 1}  ${match[0]}`);
    }
  });
}
console.log(`\n${total} dato(s) por confirmar.`);
