/**
 * Piezas de motion: fragmento en bucle al pasar el cursor (o al entrar en
 * pantalla en táctil) y video completo con sonido en un <dialog>.
 * Los videos se piden solo cuando hacen falta: preload="none" y src diferido.
 */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

function loopOf(card: HTMLElement): HTMLVideoElement | null {
  return card.querySelector<HTMLVideoElement>('.reel__loop');
}

function start(card: HTMLElement): void {
  const video = loopOf(card);
  if (!video) return;
  if (!video.src && video.dataset.src) video.src = video.dataset.src;
  card.classList.add('is-playing');
  void video.play().catch(() => card.classList.remove('is-playing'));
}

function stop(card: HTMLElement): void {
  const video = loopOf(card);
  card.classList.remove('is-playing');
  video?.pause();
}

function previews(cards: HTMLElement[]): void {
  if (reduced) return;
  if (fine) {
    for (const card of cards) {
      card.addEventListener('pointerenter', () => start(card));
      card.addEventListener('pointerleave', () => stop(card));
      card.addEventListener('focus', () => start(card));
      card.addEventListener('blur', () => stop(card));
    }
    return;
  }
  // Táctil: se reproduce el que está en el centro de la pantalla.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const card = entry.target as HTMLElement;
        if (entry.isIntersecting) start(card);
        else stop(card);
      }
    },
    { rootMargin: '-30% 0px -30% 0px' },
  );
  for (const card of cards) observer.observe(card);
}

function player(cards: HTMLElement[]): void {
  const dialog = document.querySelector<HTMLDialogElement>('.player');
  const video = dialog?.querySelector<HTMLVideoElement>('.player__video');
  const title = dialog?.querySelector<HTMLElement>('.player__title');
  if (!dialog || !video || !title) return;
  let opener: HTMLElement | null = null;

  const close = () => {
    video.pause();
    video.removeAttribute('src');
    video.load();
    if (dialog.open) dialog.close();
  };

  for (const card of cards) {
    card.addEventListener('click', () => {
      const slug = card.dataset.reel;
      if (!slug) return;
      opener = card;
      stop(card);
      title.textContent = card.dataset.title ?? '';
      dialog.classList.toggle('player--vertical', card.dataset.vertical === 'true');
      video.poster = `/motion/${slug}.webp`;
      video.src = `/motion/${slug}.mp4`;
      dialog.showModal();
      void video.play().catch(() => undefined);
    });
  }
  dialog.querySelector('[data-player-close]')?.addEventListener('click', close);
  // Clic en el fondo, fuera de la caja del video.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener('close', () => {
    video.pause();
    video.removeAttribute('src');
    opener?.focus();
  });
}

export function initReels(): void {
  const cards = [...document.querySelectorAll<HTMLElement>('[data-reel]')];
  if (cards.length === 0) return;
  previews(cards);
  player(cards);
}
