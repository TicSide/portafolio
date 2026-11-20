/**
 * Cambio de idioma sin recargar la página.
 *
 * Las dos versiones de cada página tienen la misma estructura (las pruebas lo
 * exigen), así que en lugar de navegar se descarga la otra versión y se copia
 * su texto sobre el DOM actual, nodo por nodo. Los elementos siguen siendo los
 * mismos: no se pierden las escuchas, los lienzos WebGL ni la posición de
 * lectura. Donde la estructura no coincide se reemplazan solo los hijos de ese
 * elemento. Si algo falla, se navega de la forma normal.
 */

export interface LangHooks {
  /** Antes de tocar el DOM: revertir animaciones que lo modifican (SplitText…). */
  before: () => void;
  /** Después del cambio: volver a crear animaciones y datos dinámicos. */
  after: () => Promise<void> | void;
  /** Recoloca el scroll (con Lenis si está activo). */
  scrollTo: (y: number) => void;
}

/** Atributos con texto que cambia entre idiomas. Las clases y el estado (aria-expanded, inert…) no se tocan. */
const ATTRS = ['alt', 'title', 'aria-label', 'aria-description', 'placeholder', 'href', 'hreflang', 'lang', 'datetime', 'content', 'style', 'srcset', 'sizes'];

/** Zonas del body que se sincronizan. El resto (intro, cursor, barra de progreso) no depende del idioma. */
const REGIONS = ['.skip', '.site-header', '#menu', 'main', 'body > footer'];

const cache = new Map<string, Promise<Document>>();

function load(url: string): Promise<Document> {
  let doc = cache.get(url);
  if (!doc) {
    doc = fetch(url, { credentials: 'same-origin' }).then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return new DOMParser().parseFromString(await res.text(), 'text/html');
    });
    doc.catch(() => cache.delete(url));
    cache.set(url, doc);
  }
  return doc;
}

/** Lienzos y scripts no se comparan: los lienzos pueden haberse quitado si no hay WebGL. */
function comparable(node: ChildNode): boolean {
  if (node.nodeType === Node.COMMENT_NODE) return false;
  if (node.nodeType !== Node.ELEMENT_NODE) return true;
  const tag = (node as Element).tagName;
  return tag !== 'CANVAS' && tag !== 'SCRIPT';
}

function syncAttributes(live: Element, next: Element): void {
  for (const name of ATTRS) {
    const value = next.getAttribute(name);
    // Si la versión nueva no lo trae se deja como está: puede venir del JS (estilos en línea, por ejemplo).
    if (value !== null && live.getAttribute(name) !== value) live.setAttribute(name, value);
  }
  for (const { name, value } of next.attributes) {
    if (name.startsWith('data-') && live.getAttribute(name) !== value) live.setAttribute(name, value);
  }
}

function sameShape(a: ChildNode[], b: ChildNode[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((node, i) => node.nodeType === b[i].nodeType && (node.nodeType !== Node.ELEMENT_NODE || (node as Element).tagName === (b[i] as Element).tagName));
}

function sync(live: Element, next: Element): void {
  if (live.hasAttribute('data-clock') || live.tagName === 'VIDEO' || live.tagName === 'svg') return;
  syncAttributes(live, next);
  const a = [...live.childNodes].filter(comparable);
  const b = [...next.childNodes].filter(comparable);
  if (!sameShape(a, b)) {
    // La estructura cambia (por ejemplo, un titular partido en palabras): se reemplazan los hijos.
    for (const node of a) node.remove();
    const canvas = live.querySelector(':scope > canvas');
    const canvasFirst = next.firstElementChild?.tagName === 'CANVAS';
    for (const node of b) {
      const copy = document.importNode(node, true);
      if (canvas && !canvasFirst) live.insertBefore(copy, canvas);
      else live.append(copy);
    }
    return;
  }
  a.forEach((node, i) => {
    if (node.nodeType === Node.ELEMENT_NODE) sync(node as Element, b[i] as Element);
    else if (node.nodeValue !== b[i].nodeValue) node.nodeValue = b[i].nodeValue;
  });
}

function syncHead(next: Document): void {
  document.title = next.title;
  const selectors = ['meta[name="description"]', 'link[rel="canonical"]', 'meta[property^="og:"]', 'meta[name^="twitter:"]'];
  for (const selector of selectors) {
    const live = document.head.querySelectorAll(selector);
    const fresh = next.head.querySelectorAll(selector);
    live.forEach((el, i) => {
      if (fresh[i]) syncAttributes(el, fresh[i]);
    });
  }
  const alternates = next.head.querySelectorAll('link[rel="alternate"][hreflang]');
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el, i) => {
    if (alternates[i]) syncAttributes(el, alternates[i]);
  });
}

/** Elemento visible arriba de la pantalla y su distancia al borde, para volver al mismo punto. */
function anchor(): { el: Element; top: number } | undefined {
  const main = document.querySelector('main');
  if (!main) return undefined;
  let el = document.elementFromPoint(innerWidth / 2, Math.min(160, innerHeight / 3));
  while (el && el !== main && !el.id && el.parentElement !== main) el = el.parentElement;
  if (!el || el === main || !main.contains(el)) return undefined;
  return { el, top: el.getBoundingClientRect().top };
}

export function initLangSwitch(hooks: LangHooks): void {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let busy = false;
  let currentPath = location.pathname;

  const fade = (out: boolean): Promise<void> => {
    root.classList.toggle('is-switching', out);
    return reduced ? Promise.resolve() : new Promise((resolve) => setTimeout(resolve, 180));
  };

  async function switchTo(url: URL, push: boolean): Promise<void> {
    if (busy) return;
    busy = true;
    try {
      const [next] = await Promise.all([load(url.pathname), fade(true)]);
      const mark = anchor();
      hooks.before();
      for (const selector of REGIONS) {
        const live = document.querySelector(selector);
        const fresh = next.querySelector(selector);
        if (live && fresh) sync(live, fresh);
      }
      root.lang = next.documentElement.lang;
      syncHead(next);
      if (push) history.pushState({ lang: root.lang }, '', url.pathname + location.hash);
      currentPath = location.pathname;
      await hooks.after();
      if (mark?.el.isConnected) hooks.scrollTo(scrollY + mark.el.getBoundingClientRect().top - mark.top);
      await fade(false);
    } catch {
      location.href = url.href;
    } finally {
      busy = false;
    }
  }

  const link = () => document.querySelector<HTMLAnchorElement>('a.lang');
  const prefetch = () => {
    const a = link();
    if (a) void load(new URL(a.href).pathname).catch(() => {});
  };

  document.addEventListener('click', (event) => {
    const a = (event.target as Element | null)?.closest<HTMLAnchorElement>('a.lang');
    if (!a || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    void switchTo(new URL(a.href), true);
  });
  link()?.addEventListener('pointerenter', prefetch);
  link()?.addEventListener('focus', prefetch);

  // Atrás y adelante entre idiomas: solo si cambió la ruta (los saltos a #anclas no cuentan).
  addEventListener('popstate', () => {
    if (location.pathname !== currentPath) void switchTo(new URL(location.href), false);
  });
}
