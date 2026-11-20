import type { APIRoute } from 'astro';
import { caseStudies, home } from '@/content';
import { homePath, projectPath } from '@/i18n/utils';
import { site } from '@/config/site';

/** Resumen en texto plano para asistentes de IA (https://llmstxt.org). */
export const GET: APIRoute = ({ site: origin }) => {
  const url = (path: string) => new URL(path, origin).href;
  const lines = [
    `# ${site.name}`,
    '',
    `> ${home.en.meta.description}`,
    '',
    'Facts stated on this site are backed by public repositories. Team projects are coursework, not commercial products. .NET is listed as "learning", not as demonstrated experience.',
    '',
    '## Pages',
    `- [Home (English)](${url(homePath('en'))}): profile, stack by level of evidence, projects, contact`,
    `- [Inicio (español)](${url(homePath('es'))}): perfil, stack por nivel de evidencia, proyectos, contacto`,
    '',
    '## Case studies',
    ...caseStudies.en.map((study) => `- [${study.title}](${url(projectPath('en', study.slug))}): ${study.summary.replace(/\[[^\]]*\]/g, '').trim()}`),
    '',
    '## Profiles',
    `- [GitHub](${site.github})`,
    `- [itch.io](${site.itch})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
