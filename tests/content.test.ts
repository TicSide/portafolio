import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { caseStudies, home } from '@/content';
import { locales } from '@/i18n/utils';
import { media } from '@/content/media';

/** Forma de un objeto sin sus textos: claves y longitudes de listas. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, shape(child)]));
  }
  return typeof value;
}

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

describe('paridad entre idiomas', () => {
  it('la portada tiene la misma estructura en ES y EN', () => {
    expect(shape(home.en)).toEqual(shape(home.es));
  });

  it('cada caso de estudio existe en ambos idiomas con la misma estructura', () => {
    expect(caseStudies.en.map((s) => s.slug)).toEqual(caseStudies.es.map((s) => s.slug));
    caseStudies.es.forEach((study, index) => {
      expect(shape(caseStudies.en[index])).toEqual(shape(study));
    });
  });

  it('un marcador pendiente en un idioma tiene su par en el otro', () => {
    const count = (value: unknown, token: string) => strings(value).join(' ').split(token).length - 1;
    expect(count(home.en, '[TO CONFIRM')).toBe(count(home.es, '[POR CONFIRMAR'));
    caseStudies.es.forEach((study, index) => {
      expect(count(caseStudies.en[index], '[TO CONFIRM')).toBe(count(study, '[POR CONFIRMAR'));
    });
  });
});

describe('estructura de los casos de estudio', () => {
  for (const locale of locales) {
    for (const study of caseStudies[locale]) {
      it(`${locale}/${study.slug} tiene todas las secciones`, () => {
        expect(study.problem.length).toBeGreaterThan(20);
        expect(study.goal.length).toBeGreaterThan(20);
        for (const list of [study.mine, study.team, study.tech, study.structure.layers, study.decisions, study.challenges, study.learned, study.evidence]) {
          expect(list.length).toBeGreaterThan(0);
        }
        expect(study.seoDescription.length).toBeLessThanOrEqual(160);
      });
    }
  }

  it('la portada separa mi aporte del aporte del equipo en los capítulos', () => {
    for (const locale of locales) {
      const { denunciaya, yupachayna } = home[locale];
      for (const chapter of [denunciaya, yupachayna]) {
        expect(chapter.mine.length).toBeGreaterThan(0);
        expect(chapter.team.length).toBeGreaterThan(0);
      }
    }
  });

  it('cada imagen usada existe en el registro de medios y tiene texto alternativo', () => {
    for (const locale of locales) {
      const shots = [
        ...home[locale].denunciaya.shots,
        home[locale].denunciaya.swagger,
        ...home[locale].yupachayna.frames,
        ...caseStudies[locale].flatMap((study) => study.gallery),
      ];
      for (const shot of shots) {
        expect(media[shot.image]).toBeTruthy();
        expect(shot.alt.length).toBeGreaterThan(10);
      }
      for (const item of [...home[locale].more.items, ...home[locale].orgs.items]) {
        if (item.image) {
          expect(media[item.image]).toBeTruthy();
          expect(item.imageAlt?.length ?? 0).toBeGreaterThan(10);
        }
      }
      for (const item of home[locale].design.items) {
        expect(media[item.image]).toBeTruthy();
        expect(item.alt.length).toBeGreaterThan(10);
      }
    }
  });

  it('cada pieza de motion tiene su video, su fragmento y su póster en public/motion', () => {
    for (const locale of locales) {
      const { motion, orgs } = home[locale];
      const slugs = [motion.featured.slug, ...motion.items.map((p) => p.slug), ...orgs.items.flatMap((o) => (o.video ? [o.video] : []))];
      for (const slug of slugs) {
        for (const file of [`${slug}.mp4`, `${slug}-loop.mp4`, `${slug}.webp`]) {
          expect(existsSync(fileURLToPath(new URL(`../public/motion/${file}`, import.meta.url))), file).toBe(true);
        }
      }
    }
  });

  it('los proyectos en equipo separan mi aporte del aporte del equipo', () => {
    for (const locale of locales) {
      for (const org of home[locale].orgs.items) {
        expect(org.mine.length).toBeGreaterThan(0);
        expect(org.team.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('reglas de honestidad del contenido', () => {
  const banned = [/\bexpert[oa]?s?\b/i, /\bavanzad[oa]s?\b/i, /\bsenior\b/i, /\bfull[- ]?stack\b/i, /\d+\s?%/, /usuarios reales/i, /real users/i, /en producción/i, /in production/i, /lorem ipsum/i];
  // Las únicas menciones permitidas son las que lo niegan y, para "full stack",
  // las que lo plantean como meta y no como nivel actual.
  const allowed = [
    /no está en producción ni tiene usuarios reales/i,
    /not in production and has no real users/i,
    /(?:ser|crecer como) desarrollador full stack/i,
    /(?:be|grow as|growing as) a full stack developer/i,
    /on my way to full stack development/i,
  ];

  it('no usa adjetivos de nivel ni porcentajes de habilidad', () => {
    for (const locale of locales) {
      const text = strings([home[locale], caseStudies[locale]])
        .join('\n')
        .replace(new RegExp(allowed.map((r) => r.source).join('|'), 'gi'), '');
      for (const pattern of banned) expect(text).not.toMatch(pattern);
    }
  });

  it('los enlaces externos usan https', () => {
    for (const locale of locales) {
      const urls = strings([home[locale], caseStudies[locale]]).filter((value) => /^https?:/.test(value));
      expect(urls.length).toBeGreaterThan(5);
      for (const url of urls) expect(url).toMatch(/^https:\/\//);
    }
  });
});
