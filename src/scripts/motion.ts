/**
 * Coreografía de movimiento con GSAP (ScrollTrigger + SplitText) y Lenis.
 * Todo vive dentro de gsap.matchMedia: con prefers-reduced-motion no se crea
 * ninguna animación y el contenido se muestra completo y estático.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import type Lenis from 'lenis';
import type { Surface } from './glass';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

function onReady(): void {
  root.classList.add('motion-ready');
}

/** Intro: contador y nombre. Devuelve una promesa que resuelve al terminar. */
function playIntro(onReveal: () => void): Promise<void> {
  const intro = document.querySelector<HTMLElement>('.intro');
  if (!intro || !root.classList.contains('js-intro')) {
    intro?.remove();
    onReveal();
    return Promise.resolve();
  }
  const count = intro.querySelector<HTMLElement>('.intro__count');
  const bar = intro.querySelector<HTMLElement>('.intro__bar');
  const name = intro.querySelector<HTMLElement>('.intro__name span');
  const state = { value: 0 };
  return new Promise((resolve) => {
    gsap
      .timeline({
        onComplete: () => {
          intro.remove();
          root.classList.remove('js-intro');
          resolve();
        },
      })
      .from(name, { yPercent: 110, duration: 0.9, ease: 'expo.out' }, 0)
      .to(state, {
        value: 100,
        duration: 1.25,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (count) count.textContent = String(Math.round(state.value)).padStart(3, '0');
        },
      }, 0)
      .to(bar, { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0)
      .to(name, { yPercent: -110, duration: 0.6, ease: 'expo.in' }, 1.3)
      .add(onReveal, 1.5)
      .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, 1.45);
  });
}

function heroEntrance(): void {
  // En móvil el titular ya está en su sitio (ver global.css): sin entrada.
  if (!matchMedia('(min-width: 64rem)').matches) return;
  const chars = gsap.utils.toArray<HTMLElement>('.hero__char');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo(chars, { yPercent: 115, y: 0, rotate: 6 }, { yPercent: 0, y: 0, rotate: 0, duration: 1.3, stagger: 0.045 }, 0)
    .fromTo('.hero [data-hero-fade]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.35);
}

function heroScroll(surfaces: Map<HTMLCanvasElement, Surface>): void {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;
  const canvas = hero.querySelector<HTMLCanvasElement>('canvas[data-glass]');
  gsap.to('.hero__name', {
    yPercent: -18,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    // La superficie se crea al acercarse a la pantalla: se busca en cada cambio.
    onUpdate: (self) => (canvas ? surfaces.get(canvas) : undefined)?.setScroll(self.progress),
  });

  if (!finePointer) return;
  const name = document.querySelector<HTMLElement>('.hero__name');
  if (!name || !once(name)) return;
  const rotY = gsap.quickTo(name, 'rotationY', { duration: 1.2, ease: 'power3.out' });
  const rotX = gsap.quickTo(name, 'rotationX', { duration: 1.2, ease: 'power3.out' });
  on(hero, 'pointermove', (event) => {
    const x = event.clientX / innerWidth - 0.5;
    const y = event.clientY / innerHeight - 0.5;
    rotY(x * 7);
    rotX(-y * 5);
  });
  on(hero, 'pointerleave', () => {
    rotY(0);
    rotX(0);
  });
}

function marquee(): void {
  for (const el of document.querySelectorAll<HTMLElement>('.marquee')) {
    const track = el.querySelector<HTMLElement>('.marquee__track');
    if (!track) continue;
    // La marquesina de motion va en sentido contrario y algo más rápido.
    const reverse = el.classList.contains('marquee--motion');
    const loop = reverse
      ? gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 30, ease: 'none', repeat: -1 })
      : gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' });
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = self.getVelocity();
        loop.timeScale(1 + Math.min(Math.abs(v) / 400, 5) * (v < 0 ? -1 : 1));
        skewTo(gsap.utils.clamp(-8, 8, v / -300));
      },
    });
    const settle = () => {
      gsap.to(loop, { timeScale: 1, duration: 0.6 });
      skewTo(0);
    };
    ScrollTrigger.addEventListener('scrollEnd', settle);
    run.signal.addEventListener('abort', () => ScrollTrigger.removeEventListener('scrollEnd', settle));
  }
}

function themes(): void {
  for (const section of document.querySelectorAll<HTMLElement>('[data-theme-section]')) {
    const theme = section.dataset.themeSection ?? 'dark';
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) root.dataset.theme = theme;
      },
    });
  }
}

/** Titular que entra por líneas al llegar al 85 % de la pantalla. */
function splitOne(el: HTMLElement): void {
  SplitText.create(el, {
    type: 'lines,words',
    mask: 'lines',
    autoSplit: true,
    onSplit(self) {
      gsap.set(el, { visibility: 'visible' });
      return gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    },
  });
}

function reveals(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    const kind = el.dataset.reveal;
    gsap.set(el, { visibility: 'visible' });
    if (kind === 'image') {
      const img = el.querySelector('img');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      tl.fromTo(el, { clipPath: 'inset(18% 10% 18% 10% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.4, ease: 'expo.out', clearProps: 'clipPath' });
      if (img) {
        // La imagen tiene una transición CSS de hover sobre transform: se apaga
        // mientras GSAP la anima y se limpia al final para que el hover vuelva.
        img.style.transition = 'none';
        tl.from(
          img,
          {
            scale: 1.25,
            duration: 1.6,
            ease: 'expo.out',
            clearProps: 'transform',
            onComplete: () => {
              img.style.transition = '';
            },
          },
          0,
        );
      }
      continue;
    }
    if (kind === 'stagger') {
      gsap.from(el.children, {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
      continue;
    }
    gsap.from(el, {
      y: 40,
      autoAlpha: 0,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  }
}

function counters(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-count]')) {
    const target = Number(el.dataset.count);
    const plain = el.dataset.plain === 'true';
    const sep = el.dataset.sep ?? ',';
    const format = { format: (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep) };
    const state = { value: 0 };
    gsap.to(state, {
      value: target,
      duration: 1.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        const n = Math.round(state.value);
        el.textContent = plain ? String(n) : format.format(n);
      },
    });
  }
}

/**
 * Las palabras pasan del color secundario al principal con el scroll. Se usa
 * una clase y no la opacidad: los dos colores cumplen el contraste AA en
 * cualquier punto del recorrido, y siguen al tema claro u oscuro.
 */
function wordsScrub(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-words]')) {
    SplitText.create(el, {
      type: 'words',
      wordsClass: 'word',
      aria: 'none',
      onSplit(self) {
        const words = self.words as HTMLElement[];
        let lit = -1;
        return ScrollTrigger.create({
          trigger: el,
          start: 'top 75%',
          end: 'bottom 45%',
          onUpdate: ({ progress }) => {
            const count = Math.round(progress * words.length);
            if (count === lit) return;
            lit = count;
            words.forEach((word, i) => word.classList.toggle('is-lit', i < count));
          },
        });
      },
    });
  }
}

function parallax(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-parallax]')) {
    const amount = Number(el.dataset.parallax) || 10;
    gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  }
}

/** DenunciaYa: las pantallas se apilan mientras la sección queda fija. */
function screensStack(): void {
  const section = document.querySelector<HTMLElement>('.screens--pinned');
  if (!section) return;
  const stage = section.querySelector<HTMLElement>('.screens__stage');
  const cards = gsap.utils.toArray<HTMLElement>('.screens__card', section);
  const items = gsap.utils.toArray<HTMLElement>('.screens__item', section);
  if (!stage || cards.length < 2) return;
  const setActive = (index: number) => items.forEach((item, i) => item.classList.toggle('is-active', i === index));
  setActive(0);
  gsap.set(cards.slice(1), { yPercent: 115, autoAlpha: 1 });
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: () => `+=${innerHeight * (cards.length - 1) * 0.9}`,
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => setActive(Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)))),
    },
  });
  cards.forEach((card, i) => {
    if (i === 0) return;
    tl.to(card, { yPercent: 0, duration: 1 }, i - 1);
    tl.to(cards[i - 1] ?? card, { scale: 0.9, autoAlpha: 0.35, yPercent: -6, duration: 1 }, i - 1);
  });
}

/** Capas de arquitectura: se separan y una petición dorada las atraviesa. */
function isoLayers(): void {
  for (const iso of document.querySelectorAll<HTMLElement>('.iso')) {
    const stack = iso.querySelector<HTMLElement>('.iso__stack');
    const packet = iso.querySelector<HTMLElement>('.iso__packet');
    if (!stack) continue;
    const state = { gap: 10 };
    const tl = gsap.timeline({ scrollTrigger: { trigger: iso, start: 'top 80%', end: 'bottom 30%', scrub: 0.8 } });
    tl.to(state, {
      gap: 70,
      ease: 'power2.out',
      onUpdate: () => stack.style.setProperty('--gap', `${state.gap}px`),
    });
    if (packet) {
      gsap.fromTo(
        packet,
        { z: 300, autoAlpha: 0 },
        { z: -20, autoAlpha: 1, duration: 2.4, ease: 'power2.inOut', repeat: -1, repeatDelay: 0.6 },
      );
    }
  }
}

/** Yupachayña: tira de imágenes horizontal ligada al scroll vertical. */
function filmstrip(): void {
  const film = document.querySelector<HTMLElement>('.film--pinned');
  const track = film?.querySelector<HTMLElement>('.film__track');
  if (!film || !track) return;
  const distance = () => track.scrollWidth - innerWidth;
  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: film,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });
  for (const img of track.querySelectorAll<HTMLElement>('.film__media img')) {
    gsap.fromTo(
      img,
      { xPercent: -6 },
      {
        xPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      },
    );
  }
  // El foco del teclado dentro de la tira lleva el scroll hasta esa imagen.
  on(track, 'focusin', (event) => {
    const frame = (event.target as HTMLElement).closest<HTMLElement>('.film__frame');
    const st = tween.scrollTrigger;
    if (!frame || !st) return;
    const progress = Math.min(1, Math.max(0, (frame.offsetLeft - innerWidth * 0.2) / distance()));
    window.scrollTo({ top: st.start + (st.end - st.start) * progress });
  });
}

function journeyLine(): void {
  const fill = document.querySelector<HTMLElement>('.journey__fill');
  const journey = document.querySelector<HTMLElement>('.journey');
  if (!fill || !journey) return;
  gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: journey, start: 'top 70%', end: 'bottom 60%', scrub: true } });
}

/** Año grande y fijo de la trayectoria: cambia con la etapa que cruza el centro. */
function journeyYear(): void {
  const display = document.querySelector<HTMLElement>('[data-journey-year]');
  const box = display?.parentElement;
  if (!display || !box) return;
  let current = display.textContent ?? '';
  const show = (step: HTMLElement, direction: number) => {
    const year = step.dataset.year ?? current;
    box.dataset.state = step.dataset.state ?? '';
    if (year === current) return;
    current = year;
    gsap.killTweensOf(display);
    gsap
      .timeline()
      .to(display, { yPercent: -105 * direction, duration: 0.22, ease: 'power2.in' })
      .add(() => {
        display.textContent = year;
      })
      .fromTo(display, { yPercent: 105 * direction }, { yPercent: 0, duration: 0.5, ease: 'expo.out' });
  };
  for (const step of gsap.utils.toArray<HTMLElement>('.step')) {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) show(step, self.direction);
      },
    });
  }
}

function iconsDraw(): void {
  for (const group of document.querySelectorAll<HTMLElement>('[data-draw]')) {
    const icons = group.querySelectorAll<HTMLElement>('.orbit__icon, .tech__icon');
    gsap.from(icons, {
      scale: 0,
      rotate: -90,
      duration: 0.9,
      ease: 'back.out(1.6)',
      stagger: { each: 0.035, from: 'random' },
      scrollTrigger: { trigger: group, start: 'top 80%', once: true },
    });
  }
}

/** Motion: el video destacado crece desde 86 % mientras entra en pantalla. */
function featuredReel(): void {
  const el = document.querySelector<HTMLElement>('.motion__featured .reel__media');
  if (!el) return;
  gsap.fromTo(
    el,
    { scale: 0.86, rotate: -1.5 },
    { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 25%', scrub: 0.6 } },
  );
}

/** Diseño: cada tarjeta entra girada y se endereza; luego flota con el scroll. */
function designCards(): void {
  gsap.utils.toArray<HTMLElement>('.design-card').forEach((card, i) => {
    const media = card.querySelector<HTMLElement>('.design-card__media');
    if (!media) return;
    gsap.from(media, {
      y: 90,
      rotate: i % 2 ? 4 : -4,
      autoAlpha: 0,
      duration: 1.3,
      ease: 'expo.out',
      scrollTrigger: { trigger: card, start: 'top 88%', once: true },
    });
    gsap.fromTo(
      card,
      { y: i % 2 ? 50 : 20 },
      { y: i % 2 ? -50 : -20, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}

/** Equipos: la franja de color de cada tarjeta y su número entran al llegar. */
function orgCards(): void {
  for (const org of document.querySelectorAll<HTMLElement>('.org')) {
    const index = org.querySelector('.org__index');
    const chips = org.querySelectorAll('.chip--accent');
    const tl = gsap.timeline({ scrollTrigger: { trigger: org, start: 'top 80%', once: true } });
    if (index) tl.from(index, { xPercent: -60, autoAlpha: 0, duration: 0.8, ease: 'expo.out' }, 0);
    if (chips.length) tl.from(chips, { y: 16, autoAlpha: 0, scale: 0.8, duration: 0.6, ease: 'back.out(2)', stagger: 0.05 }, 0.2);
  }
}

/** Los orbes de color de la sección de motion siguen al cursor con retraso. */
function blobsFollow(): void {
  const section = document.querySelector<HTMLElement>('.motion');
  const glow = section?.querySelector<HTMLElement>('.motion__glow');
  if (!section || !glow || !finePointer || !once(section)) return;
  const x = gsap.quickTo(glow, 'x', { duration: 2.2, ease: 'power3.out' });
  const y = gsap.quickTo(glow, 'y', { duration: 2.2, ease: 'power3.out' });
  on(section, 'pointermove', (event) => {
    x((event.clientX / innerWidth - 0.5) * 120);
    y((event.clientY / innerHeight - 0.5) * 80);
  });
}

function contactTitle(): void {
  const title = document.querySelector<HTMLElement>('.contact__title');
  if (!title || !finePointer || !once(title)) return;
  const chars = gsap.utils.toArray<HTMLElement>('.contact__char', title);
  const section = title.closest<HTMLElement>('.contact');
  on(section, 'pointermove', (event) => {
    for (const char of chars) {
      const rect = char.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const d = Math.hypot(dx, dy);
      const w = gsap.utils.mapRange(0, 380, 800, 420, Math.min(d, 380));
      char.style.fontWeight = String(Math.round(w));
    }
  });
  on(section, 'pointerleave', () => {
    for (const char of chars) char.style.fontWeight = '';
  });
}

function magnetic(): void {
  if (!finePointer) return;
  for (const el of document.querySelectorAll<HTMLElement>('[data-magnetic]')) {
    if (!once(el)) continue;
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    on(el, 'pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      x((event.clientX - rect.left - rect.width / 2) * 0.3);
      y((event.clientY - rect.top - rect.height / 2) * 0.4);
    });
    on(el, 'pointerleave', () => {
      x(0);
      y(0);
    });
  }
}

function tilt(): void {
  if (!finePointer) return;
  for (const el of document.querySelectorAll<HTMLElement>('[data-tilt]')) {
    if (!once(el)) continue;
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    on(el, 'pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      ry(((event.clientX - rect.left) / rect.width - 0.5) * 6);
      rx(-((event.clientY - rect.top) / rect.height - 0.5) * 6);
    });
    on(el, 'pointerleave', () => {
      rx(0);
      ry(0);
    });
  }
}

let lenis: Lenis | undefined;

/** Desplazamiento suave con rueda de ratón. Lenis solo se descarga con puntero fino. */
function smoothScroll(): void {
  if (!finePointer || lenis) return;
  void import('lenis').then(({ default: LenisClass }) => {
    if (lenis) return;
    const instance = new LenisClass({ lerp: 0.11, wheelMultiplier: 0.95, anchors: { offset: -80 } });
    instance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => instance.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis = instance;
  });
}

/**
 * Cada ejecución del bloque de matchMedia tiene su propio AbortController: al
 * revertirse (cambio de consulta o de idioma) se quitan todas sus escuchas.
 */
let run = new AbortController();
function on<K extends keyof HTMLElementEventMap>(
  target: HTMLElement | null | undefined,
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
): void {
  target?.addEventListener(type, listener, { signal: run.signal });
}

/** Evita registrar dos veces la misma escucha dentro de una misma ejecución. */
let bound = new WeakSet<Element>();
function once(el: Element): boolean {
  if (bound.has(el)) return false;
  bound.add(el);
  return true;
}

/** Cede el hilo principal entre tareas para que ninguna lo bloquee mucho. */
function yieldToMain(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (scheduler?.yield) return scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

let mm: gsap.MatchMedia | undefined;

/** Lenis, si está activo (para recolocar el scroll al cambiar de idioma). */
export function getLenis(): Lenis | undefined {
  return lenis;
}

/** Revierte todas las animaciones y quita sus escuchas. El DOM vuelve al HTML original. */
export function stopMotion(): void {
  mm?.revert();
  mm = undefined;
}

/** Arranca el movimiento. La promesa resuelve cuando todo está creado y medido. */
export function initMotion(surfaces: Map<HTMLCanvasElement, Surface>): Promise<void> {
  stopMotion();
  let ready: () => void = () => {};
  const done = new Promise<void>((resolve) => {
    ready = resolve;
  });
  mm = gsap.matchMedia();
  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 64rem)',
    },
    (context) => {
      const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean };
      run = new AbortController();
      bound = new WeakSet();
      if (!motion) {
        root.classList.remove('js-motion', 'js-intro');
        document.querySelector('.intro')?.remove();
        onReady();
        ready();
        return;
      }
      // Primero lo que se ve al cargar: scroll, temas, hero e intro.
      smoothScroll();
      themes();
      heroScroll(surfaces);
      void playIntro(heroEntrance);

      // El resto, en tareas cortas: cada una queda registrada en este
      // contexto y se revierte si cambia la condición de la consulta.
      const tasks: Array<() => void> = [
        ...[...document.querySelectorAll<HTMLElement>('[data-split]')].map((el) => () => splitOne(el)),
        reveals,
        counters,
        wordsScrub,
        parallax,
        marquee,
        isoLayers,
        journeyLine,
        iconsDraw,
        contactTitle,
        featuredReel,
        designCards,
        orgCards,
        blobsFollow,
        magnetic,
        tilt,
        ...(desktop ? [screensStack, filmstrip, journeyYear] : []),
      ];
      let cancelled = false;
      void (async () => {
        for (const task of tasks) {
          await yieldToMain();
          if (cancelled) return;
          try {
            context.add(task);
          } catch (error) {
            console.error(error);
          }
        }
        // Los pines se crean al final; ordenar por posición hace que los
        // disparadores de más abajo cuenten el espacio que añaden. Un solo
        // cálculo de posiciones, ya con las fuentes cargadas.
        await document.fonts.ready;
        if (cancelled) return;
        context.add(() => {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        });
        onReady();
        ready();
      })();
      const controller = run;
      return () => {
        cancelled = true;
        controller.abort();
      };
    },
  );
  return done;
}
