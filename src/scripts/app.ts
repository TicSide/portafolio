/**
 * Punto de entrada del cliente. Todo es mejora progresiva: sin JavaScript el
 * sitio se lee completo, con el fondo en degradado CSS.
 */
import 'lenis/dist/lenis.css';
import { initSurfaces } from './glass';
import { initReels } from './reels';
import { initTabs } from './tabs';
import { initLangSwitch } from './lang';

const root = document.documentElement;

/** Correo armado en el navegador para que no figure en el HTML. */
function email(): void {
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[data-email-user]')) {
    const { emailUser, emailDomain } = link.dataset;
    if (emailUser && emailDomain) link.href = `mailto:${emailUser}@${emailDomain}`;
  }
}

/** Hora local de Lima, en el formato del idioma de la página. */
function tickClock(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-clock]');
  if (els.length === 0) return;
  const now = new Intl.DateTimeFormat(root.lang || 'es-PE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' }).format(new Date());
  for (const el of els) el.textContent = now;
}

/** Actualiza la hora cada 20 segundos. */
function clock(): void {
  tickClock();
  setInterval(tickClock, 20_000);
}

/** Menú de pantalla completa en móvil. */
function menu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const panel = document.getElementById('menu');
  if (!toggle || !panel) return;
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    panel.toggleAttribute('inert', !open);
    if (open) panel.querySelector<HTMLElement>('a')?.focus();
  };
  setOpen(false);
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
}

/** Cursor propio: anillo que sigue al puntero y se agranda sobre enlaces. */
function cursor(): void {
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = document.querySelector<HTMLElement>('.cursor');
  if (!fine || reduced || !el) return;
  const label = el.querySelector<HTMLElement>('.cursor__label');
  root.classList.add('has-cursor');
  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let cx = x;
  let cy = y;
  addEventListener('pointermove', (event) => {
    x = event.clientX;
    y = event.clientY;
  });
  const loop = () => {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  addEventListener('pointerover', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]');
    const text = target?.dataset.cursor;
    el.classList.toggle('is-label', Boolean(text));
    el.classList.toggle('is-link', Boolean(target) && !text);
    if (label) label.textContent = text ?? '';
  });
  document.addEventListener('pointerleave', () => el.classList.remove('is-link', 'is-label'));
}

/** Índice del caso de estudio: marca la sección visible. */
function toc(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('.toc a')];
  if (links.length === 0) return;
  const map = new Map(links.map((a) => [a.hash.slice(1), a]));
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const a of links) a.classList.remove('is-active');
        map.get(entry.target.id)?.classList.add('is-active');
      }
    },
    { rootMargin: '-35% 0px -55% 0px' },
  );
  for (const id of map.keys()) {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  }
}

email();
clock();
menu();
cursor();
toc();
initReels();
initTabs();
const surfaces = initSurfaces();

// GSAP, Lenis y las animaciones van en su propio archivo y se piden después
// del primer pintado: el contenido no espera por ellos.
let motion: typeof import('./motion') | undefined;
const loadMotion = () => {
  import('./motion')
    .then((module) => {
      motion = module;
      void module.initMotion(surfaces);
    })
    .catch(() => {
      // Sin animaciones el contenido sigue visible (ver los respaldos de global.css).
      root.classList.remove('js-motion', 'js-intro');
      document.querySelector('.intro')?.remove();
    });
};
requestAnimationFrame(() => setTimeout(loadMotion, 0));

// Cambio de idioma sin recargar: se revierten las animaciones, se copia el
// texto de la otra versión y se vuelven a crear.
initLangSwitch({
  before: () => motion?.stopMotion(),
  after: async () => {
    email();
    tickClock();
    if (motion) await motion.initMotion(surfaces);
  },
  scrollTo: (y) => {
    const lenis = motion?.getLenis();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else scrollTo({ top: y, behavior: 'instant' });
  },
});
