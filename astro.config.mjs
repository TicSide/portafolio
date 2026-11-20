import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL debe apuntar al dominio final (por defecto, el de Vercel).
const site = process.env.SITE_URL ?? 'https://omar-rivera.vercel.app';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: {
    // Todo el CSS va en archivos externos: permite una CSP sin 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/') && page !== `${site}/`,
      i18n: { defaultLocale: 'es', locales: { es: 'es-PE', en: 'en' } },
    }),
  ],
});
