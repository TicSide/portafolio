/**
 * Pestañas accesibles (patrón ARIA tabs): clic, flechas, Inicio y Fin.
 * Sin JavaScript se ven todos los paneles uno debajo del otro.
 */
export function initTabs(): void {
  for (const root of document.querySelectorAll<HTMLElement>('[data-tabs]')) {
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = [...root.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
    if (tabs.length === 0) continue;
    root.classList.add('is-enhanced');

    const select = (index: number, focus = false) => {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i]?.classList.toggle('is-active', active);
        if (panels[i]) panels[i].hidden = !active;
      });
      if (focus) tabs[index]?.focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', (event) => {
        const keys: Record<string, number> = {
          ArrowRight: (i + 1) % tabs.length,
          ArrowDown: (i + 1) % tabs.length,
          ArrowLeft: (i - 1 + tabs.length) % tabs.length,
          ArrowUp: (i - 1 + tabs.length) % tabs.length,
          Home: 0,
          End: tabs.length - 1,
        };
        const next = keys[event.key];
        if (next === undefined) return;
        event.preventDefault();
        select(next, true);
      });
    });
    select(0);
  }
}
