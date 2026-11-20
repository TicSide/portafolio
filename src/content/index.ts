import type { Locale } from '@/i18n/utils';
import type { CaseStudy, HomeContent } from './types';
import { home as homeEs } from './home.es';
import { home as homeEn } from './home.en';
import { study as denunciayaEs } from './projects/denunciaya.es';
import { study as denunciayaEn } from './projects/denunciaya.en';
import { study as yupachaynaEs } from './projects/yupachayna.es';
import { study as yupachaynaEn } from './projects/yupachayna.en';

export const home: Record<Locale, HomeContent> = { es: homeEs, en: homeEn };

/** El orden define la jerarquía editorial de la portada. */
export const caseStudies: Record<Locale, CaseStudy[]> = {
  es: [denunciayaEs, yupachaynaEs],
  en: [denunciayaEn, yupachaynaEn],
};

export function getCaseStudy(locale: Locale, slug: string): CaseStudy | undefined {
  return caseStudies[locale].find((study) => study.slug === slug);
}
