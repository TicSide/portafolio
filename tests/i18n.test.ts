import { describe, expect, it } from 'vitest';
import { alternatePath, findPending, homePath, isLocale, projectPath, renderPending } from '@/i18n/utils';
import { ui } from '@/i18n/ui';

describe('rutas por idioma', () => {
  it('construye la portada y los proyectos con el segmento traducido', () => {
    expect(homePath('es')).toBe('/es/');
    expect(projectPath('es', 'denunciaya')).toBe('/es/proyectos/denunciaya/');
    expect(projectPath('en', 'denunciaya')).toBe('/en/projects/denunciaya/');
  });

  it('encuentra la página equivalente en el otro idioma', () => {
    expect(alternatePath('/es/', 'en')).toBe('/en/');
    expect(alternatePath('/es/proyectos/yupachayna/', 'en')).toBe('/en/projects/yupachayna/');
    expect(alternatePath('/en/projects/yupachayna/', 'es')).toBe('/es/proyectos/yupachayna/');
    expect(alternatePath('/es/proyectos/yupachayna/', 'es')).toBe('/es/proyectos/yupachayna/');
  });

  it('vuelve a la portada si la ruta no tiene idioma', () => {
    expect(alternatePath('/404/', 'en')).toBe('/en/');
    expect(isLocale('fr')).toBe(false);
  });
});

describe('marcadores de datos pendientes', () => {
  it('resalta el marcador y escapa el resto del texto', () => {
    const html = renderPending('Inglés <b> [POR CONFIRMAR: nivel]');
    expect(html).toBe('Inglés &lt;b&gt; <mark class="pending">[POR CONFIRMAR: nivel]</mark>');
  });

  it('reconoce marcadores en ambos idiomas', () => {
    expect(findPending('a [POR CONFIRMAR] b [TO CONFIRM: role]')).toEqual(['[POR CONFIRMAR]', '[TO CONFIRM: role]']);
    expect(findPending('sin marcadores')).toEqual([]);
  });
});

describe('textos de interfaz', () => {
  it('tiene las mismas claves en español y en inglés', () => {
    const keys = (value: unknown, prefix = ''): string[] =>
      value && typeof value === 'object'
        ? Object.entries(value).flatMap(([key, child]) => keys(child, `${prefix}${key}.`))
        : [prefix];
    expect(keys(ui.en).sort()).toEqual(keys(ui.es).sort());
  });
});
