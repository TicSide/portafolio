/**
 * Datos de contacto y enlaces. Un valor `null` significa "por confirmar":
 * la interfaz muestra un marcador visible en lugar de inventar el dato.
 */
export const site = {
  name: 'Omar Rivera Ticllacuri',
  shortName: 'Omar Rivera',
  location: 'Lima, Perú',
  github: 'https://github.com/TicSide',
  githubUser: 'TicSide',
  itch: 'https://tic-side.itch.io/',
  linkedin: 'https://www.linkedin.com/in/omar-rivera-ticllacuri/' as string | null,
  // El correo se guarda partido para no exponerlo a bots en el HTML.
  email: { user: 'omarriveraticllacuri', domain: 'gmail.com' } as { user: string; domain: string } | null,
  phone: null as string | null, // opcional
  cv: {
    es: '/cv/omar-rivera-cv-es.pdf' as string | null,
    en: '/cv/omar-rivera-cv-en.pdf' as string | null,
  },
} as const;
