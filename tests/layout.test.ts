import { describe, expect, it } from 'vitest';
import { displayWidth, fitStyle, fitWordsStyle } from '../src/lib/fit';
import { fitWidths } from '../src/lib/images';
import { home } from '../src/content';

describe('titulares ajustados al ancho', () => {
  it('mide más ancho un texto más largo', () => {
    expect(displayWidth('DenunciaYa')).toBeGreaterThan(displayWidth('Stack'));
  });

  it('se acerca al ancho medido en el navegador (Bricolage Grotesque 800, tracking -0.045em)', () => {
    // Medidas tomadas con Chrome sobre la fuente real: 4.663 em y 2.348 em.
    expect(displayWidth('DenunciaYa')).toBeGreaterThanOrEqual(4.663);
    expect(displayWidth('DenunciaYa')).toBeLessThan(4.663 * 1.04);
    expect(displayWidth('Stack')).toBeCloseTo(2.348, 1);
  });

  it('usa la palabra más ancha para los titulares que se parten', () => {
    const style = fitWordsStyle('Proyectos en equipo y motion graphics');
    expect(style).toBe(`--fit: ${displayWidth('Proyectos')}`);
  });

  it('da un ancho a cada titular de sección de ambas portadas', () => {
    for (const content of Object.values(home)) {
      for (const title of [content.more.title, content.orgs.title, content.design.title, content.motion.title, content.stack.title, content.journey.title, content.github.title, content.contact.title]) {
        expect(fitStyle(title)).toMatch(/^--fit: \d+(\.\d+)?$/);
      }
    }
  });
});

describe('anchos de imagen', () => {
  const image = (width: number) => ({ src: '', width, height: width, format: 'jpg' as const });

  it('no pide anchos mayores que el original', () => {
    expect(fitWidths(image(630), [480, 760, 1100])).toEqual([480, 630]);
  });

  it('mantiene la lista si la imagen es más grande', () => {
    expect(fitWidths(image(2880), [480, 760, 1100])).toEqual([480, 760, 1100]);
  });
});
