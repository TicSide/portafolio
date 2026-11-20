import type { MediaKey } from './media';

/** Nivel de evidencia de una tecnología. */
export type Evidence = 'used' | 'base' | 'learning';

/** Estado de un proyecto. */
export type Status = 'completed' | 'released' | 'academic-team' | 'research' | 'in-progress' | 'planned';

export interface Link {
  label: string;
  href: string;
}

/** Una imagen real del proyecto con su contexto. */
export interface Shot {
  image: MediaKey;
  alt: string;
  /** Qué muestra la imagen. */
  title: string;
  /** Detalle breve: qué parte es mía o de dónde sale. */
  note?: string;
  /** Cifra de autoría (p. ej. "482 de 482 líneas"). Se marca en dorado. */
  mine?: string;
  /** Dirección que aparece en el marco del navegador. */
  url?: string;
  /** 'browser' para capturas web, 'plain' para juegos o artefactos. */
  frame?: 'browser' | 'plain';
}

export interface Stat {
  value: number;
  /** Texto que acompaña la cifra (p. ej. "de 2 503"). */
  suffix?: string;
  label: string;
}

export interface CodeExcerpt {
  file: string;
  lang: 'java' | 'csharp' | 'typescript';
  code: string;
  caption: string;
  href?: string;
}

export interface Layer {
  name: string;
  note?: string;
  items: string[];
  /** true si la capa es aporte propio. */
  mine?: boolean;
}

export interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  kind: 'software' | 'game';
  status: Status;
  period: string;
  /** Una línea para listados y metadatos. */
  summary: string;
  seoDescription: string;
  stack: string[];
  cover?: MediaKey;
  coverAlt?: string;
  problem: string;
  goal: string;
  mine: string[];
  team: string[];
  tech: string[];
  structure: { caption: string; layers: Layer[] };
  decisions: { chose: string; over: string; why: string }[];
  challenges: { what: string; how: string }[];
  learned: string[];
  gallery: Shot[];
  code?: CodeExcerpt;
  evidence: string[];
  links: Link[];
  repo?: string;
  language?: string;
}

export interface StackItem {
  name: string;
  /** Clave del ícono en src/lib/icons.ts. */
  icon: string;
  level: Evidence;
}

export interface WorkItem {
  name: string;
  kind: string;
  status: Status;
  period: string;
  role: string;
  text: string;
  image?: MediaKey;
  imageAlt?: string;
  code?: CodeExcerpt;
  links: Link[];
}

/** Color de acento de una pieza (ver tokens.css). El dorado queda para «lo que hice yo». */
export type Accent = 'cobalt' | 'violet' | 'pink' | 'lime' | 'mint' | 'orange' | 'sky';

/** Proyecto en una organización de GitHub (curso o equipo) donde colaboré. */
export interface OrgProject {
  name: string;
  org: string;
  orgUrl: string;
  kind: string;
  period: string;
  lede: string;
  role: string;
  mine: string[];
  team: string[];
  stack: string[];
  stat?: Stat;
  image?: MediaKey;
  imageAlt?: string;
  /** Etiquetas cortas que flotan sobre la imagen (p. ej. lecturas del dispositivo). */
  badges?: string[];
  /** Video de public/motion (slug) que acompaña al proyecto. */
  video?: string;
  videoTitle?: string;
  code?: CodeExcerpt;
  accent: Accent;
  links: Link[];
}

/** Diseño de interfaz hecho en Figma. */
export interface DesignPiece {
  name: string;
  kind: string;
  text: string;
  image: MediaKey;
  alt: string;
  tags: string[];
  accent: Accent;
  /** Pantallas móviles en fila: se muestran más anchas. */
  wide?: boolean;
}

/** Pieza de motion graphics servida desde public/motion/<slug>.mp4. */
export interface MotionPiece {
  slug: string;
  title: string;
  kind: string;
  duration: string;
  accent: Accent;
  vertical?: boolean;
}

export interface JourneyItem {
  when: string;
  title: string;
  text: string;
  state: 'done' | 'now' | 'planned';
}

export interface HomeContent {
  meta: { title: string; description: string };
  hero: { kicker: string; statement: string; status: string; place: string; scroll: string; cta: string };
  marquee: string[];
  about: {
    title: string;
    statement: string;
    photoAlt: string;
    stats: Stat[];
    facts: { term: string; value: string }[];
  };
  denunciaya: {
    kicker: string;
    lede: string;
    shots: Shot[];
    shotsNote: string;
    architectureTitle: string;
    architectureText: string;
    layers: Layer[];
    apiTitle: string;
    apiText: string;
    endpoints: Endpoint[];
    code: CodeExcerpt;
    swagger: Shot;
    stats: Stat[];
    mine: string[];
    team: string[];
  };
  yupachayna: {
    kicker: string;
    lede: string;
    frames: Shot[];
    stats: Stat[];
    code: CodeExcerpt;
    mine: string[];
    team: string[];
    itch: Link;
  };
  orgs: { title: string; intro: string; items: OrgProject[] };
  design: { title: string; intro: string; note: string; items: DesignPiece[] };
  motion: { title: string; intro: string; featured: MotionPiece; items: MotionPiece[]; play: string; close: string; sound: string };
  more: { title: string; intro: string; items: WorkItem[] };
  stack: {
    title: string;
    intro: string;
    levels: { level: Evidence; label: string; text: string }[];
    items: StackItem[];
  };
  journey: { title: string; intro: string; items: JourneyItem[]; certsTitle: string; certs: string[] };
  github: { title: string; intro: string; roles: Record<string, string> };
  contact: { kicker: string; title: string; text: string };
}
