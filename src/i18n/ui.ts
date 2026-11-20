import type { Locale } from './utils';
import type { Evidence, Status } from '@/content/types';

interface UI {
  skip: string;
  nav: { work: string; motion: string; design: string; about: string; stack: string; journey: string; contact: string };
  navLabel: string;
  menu: string;
  langSwitch: string;
  evidence: Record<Evidence, string>;
  status: Record<Status, string>;
  cta: { contact: string; github: string; linkedin: string; cv: string; itch: string; email: string };
  pending: string;
  localTime: string;
  readCase: string;
  myPart: string;
  teamPart: string;
  viewCode: string;
  viewImage: string;
  updated: string;
  stars: string;
  githubSnapshot: string;
  githubLive: string;
  endpoints: string;
  mineLegend: string;
  intro: string;
  case: {
    back: string;
    problem: string;
    goal: string;
    mine: string;
    team: string;
    tech: string;
    structure: string;
    decisions: string;
    chose: string;
    over: string;
    challenges: string;
    learned: string;
    gallery: string;
    code: string;
    evidence: string;
    links: string;
    noLinks: string;
    next: string;
    contents: string;
  };
  footer: { built: string; top: string };
  notFound: { title: string; text: string; home: string };
}

export const ui: Record<Locale, UI> = {
  es: {
    skip: 'Saltar al contenido',
    nav: { work: 'Proyectos', motion: 'Motion', design: 'Diseño', about: 'Sobre mí', stack: 'Stack', journey: 'Trayectoria', contact: 'Contacto' },
    navLabel: 'Secciones',
    menu: 'Menú',
    langSwitch: 'English',
    evidence: { used: 'Usado en proyectos', base: 'Base de curso', learning: 'Aprendiendo' },
    status: {
      completed: 'Completado',
      released: 'Publicado',
      'academic-team': 'Académico en equipo',
      research: 'Investigación',
      'in-progress': 'En desarrollo',
      planned: 'Planificado',
    },
    cta: { contact: 'Escribirme', github: 'GitHub', linkedin: 'LinkedIn', cv: 'Descargar CV', itch: 'itch.io', email: 'Correo' },
    pending: 'POR CONFIRMAR',
    localTime: 'en Lima',
    readCase: 'Leer el caso completo',
    myPart: 'Lo que hice yo',
    teamPart: 'Lo que hizo el equipo',
    viewCode: 'Ver en GitHub',
    viewImage: 'Ver',
    updated: 'Último push',
    stars: 'estrellas',
    githubSnapshot: 'Datos guardados en el repositorio: la API de GitHub no respondió durante el build.',
    githubLive: 'Datos obtenidos de la API de GitHub durante el build.',
    endpoints: 'endpoints',
    mineLegend: 'El dorado marca lo que hice yo.',
    intro: 'Cargando',
    case: {
      back: 'Volver a proyectos',
      problem: 'Problema',
      goal: 'Objetivo',
      mine: 'Mi aporte',
      team: 'Aporte del equipo',
      tech: 'Tecnologías usadas',
      structure: 'Cómo está organizado',
      decisions: 'Decisiones',
      chose: 'Elegí',
      over: 'en lugar de',
      challenges: 'Retos',
      learned: 'Qué aprendí y qué haría distinto',
      gallery: 'Imágenes del proyecto',
      code: 'Código real',
      evidence: 'Evidencia',
      links: 'Enlaces',
      noLinks: 'Todavía no hay enlaces verificados para este proyecto.',
      next: 'Siguiente proyecto',
      contents: 'En esta página',
    },
    footer: { built: 'Hecho con Astro, WebGL y GSAP. Sin rastreadores ni cookies.', top: 'Volver arriba' },
    notFound: { title: 'Esta página no existe', text: 'El enlace puede estar roto o la página se movió.', home: 'Ir al inicio' },
  },
  en: {
    skip: 'Skip to content',
    nav: { work: 'Projects', motion: 'Motion', design: 'Design', about: 'About', stack: 'Stack', journey: 'Journey', contact: 'Contact' },
    navLabel: 'Sections',
    menu: 'Menu',
    langSwitch: 'Español',
    evidence: { used: 'Used in projects', base: 'Coursework', learning: 'Learning' },
    status: {
      completed: 'Completed',
      released: 'Released',
      'academic-team': 'Team coursework',
      research: 'Research',
      'in-progress': 'In development',
      planned: 'Planned',
    },
    cta: { contact: 'Email me', github: 'GitHub', linkedin: 'LinkedIn', cv: 'Download CV', itch: 'itch.io', email: 'Email' },
    pending: 'TO CONFIRM',
    localTime: 'in Lima',
    readCase: 'Read the full case study',
    myPart: 'What I did',
    teamPart: 'What the team did',
    viewCode: 'View on GitHub',
    viewImage: 'View',
    updated: 'Last push',
    stars: 'stars',
    githubSnapshot: 'Data stored in the repository: the GitHub API did not respond during the build.',
    githubLive: 'Data fetched from the GitHub API during the build.',
    endpoints: 'endpoints',
    mineLegend: 'Gold marks what I did myself.',
    intro: 'Loading',
    case: {
      back: 'Back to projects',
      problem: 'Problem',
      goal: 'Goal',
      mine: 'My part',
      team: 'The team’s part',
      tech: 'Technologies used',
      structure: 'How it is organized',
      decisions: 'Decisions',
      chose: 'I chose',
      over: 'over',
      challenges: 'Challenges',
      learned: 'What I learned and what I would change',
      gallery: 'Project images',
      code: 'Real code',
      evidence: 'Evidence',
      links: 'Links',
      noLinks: 'There are no verified links for this project yet.',
      next: 'Next project',
      contents: 'On this page',
    },
    footer: { built: 'Built with Astro, WebGL and GSAP. No trackers or cookies.', top: 'Back to top' },
    notFound: { title: 'This page does not exist', text: 'The link may be broken or the page has moved.', home: 'Go to the home page' },
  },
};
