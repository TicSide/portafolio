/**
 * Íconos de tecnologías. Los logos vienen de Simple Icons (licencia CC0) y se
 * usan solo para nombrar la herramienta. Para marcas que Simple Icons no
 * incluye (C#, SQL Server, Azure) se usa un monograma de texto propio, no el
 * logo oficial.
 */
import {
  siAngular,
  siDocker,
  siDotnet,
  siFigma,
  siFirebase,
  siGit,
  siGithub,
  siGo,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siMongodb,
  siMysql,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPython,
  siRender,
  siSpringboot,
  siSwagger,
  siTypescript,
  siUnity,
  siVercel,
  siVuedotjs,
} from 'simple-icons';

export type Icon = { kind: 'path'; d: string; title: string } | { kind: 'text'; text: string; title: string };

const path = (icon: { path: string; title: string }): Icon => ({ kind: 'path', d: icon.path, title: icon.title });
const text = (value: string, title: string): Icon => ({ kind: 'text', text: value, title });

export const icons: Record<string, Icon> = {
  java: path(siOpenjdk),
  springboot: path(siSpringboot),
  swagger: path(siSwagger),
  mysql: path(siMysql),
  angular: path(siAngular),
  typescript: path(siTypescript),
  unity: path(siUnity),
  git: path(siGit),
  github: path(siGithub),
  render: path(siRender),
  firebase: path(siFirebase),
  vercel: path(siVercel),
  jwt: path(siJsonwebtokens),
  postgresql: path(siPostgresql),
  mongodb: path(siMongodb),
  python: path(siPython),
  vue: path(siVuedotjs),
  html: path(siHtml5),
  javascript: path(siJavascript),
  figma: path(siFigma),
  node: path(siNodedotjs),
  docker: path(siDocker),
  dotnet: path(siDotnet),
  csharp: text('C#', 'C#'),
  sqlserver: text('SQL', 'SQL Server'),
  azure: text('Az', 'Azure'),
  efcore: text('EF', 'Entity Framework Core'),
  scrum: text('SM', 'Scrum'),
  solid: text('S', 'SOLID'),
  go: path(siGo),
  motion: text('Mo', 'Motion graphics'),
};

export function getIcon(key: string): Icon {
  const icon = icons[key];
  if (!icon) throw new Error(`Ícono desconocido: ${key}`);
  return icon;
}
