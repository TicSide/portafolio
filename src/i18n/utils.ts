export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const htmlLang: Record<Locale, string> = { es: 'es-PE', en: 'en' };

/** Segmento de URL de la sección de proyectos en cada idioma. */
export const projectSegment: Record<Locale, string> = { es: 'proyectos', en: 'projects' };

export function isLocale(value: string | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? '');
}

export function homePath(locale: Locale): string {
  return `/${locale}/`;
}

export function projectPath(locale: Locale, slug: string): string {
  return `/${locale}/${projectSegment[locale]}/${slug}/`;
}

/** Devuelve la misma página en otro idioma (para el selector y hreflang). */
export function alternatePath(pathname: string, target: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  if (!isLocale(parts[0])) return homePath(target);
  const source = parts[0];
  parts[0] = target;
  if (parts[1] === projectSegment[source]) parts[1] = projectSegment[target];
  return `/${parts.join('/')}/`;
}

const PENDING = /\[(POR CONFIRMAR|TO CONFIRM)(?::\s*([^\]]*))?\]/g;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escapa el texto y envuelve los marcadores "[POR CONFIRMAR: …]" en <mark>. */
export function renderPending(text: string): string {
  return escapeHtml(text).replace(PENDING, (match) => `<mark class="pending">${match}</mark>`);
}

export function findPending(text: string): string[] {
  return [...text.matchAll(PENDING)].map((m) => m[0]);
}

export function formatMonth(iso: string, locale: Locale): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(htmlLang[locale], { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
}
