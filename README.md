# Portafolio de Omar Rivera Ticllacuri

Sitio estático bilingüe (español e inglés) hecho con [Astro](https://astro.build), con movimiento en GSAP y fondos propios en WebGL. No tiene backend, base de datos, rastreadores ni cookies.

Publicado en **https://omar-rivera.vercel.app**. Los CV en PDF están en `public/cv/` y sus fuentes en Word en `cv/`.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación y ejecución

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:4321
npm run build      # genera el sitio en dist/
npm run preview    # sirve dist/ para revisarlo
```

## Validación

```bash
npm run lint         # astro check: tipos y plantillas
npm test             # pruebas de i18n, contenido y datos de GitHub
npm run check:links  # enlaces internos y externos de dist/ (añade -- --offline para omitir externos)
npm run pending      # lista los datos [POR CONFIRMAR] que quedan
npm run validate     # todo lo anterior, en orden
```

## Antes de publicar

1. Completa `src/config/site.ts`: correo, LinkedIn y rutas de los CV. Mientras un dato sea `null`, el sitio muestra un marcador visible `[POR CONFIRMAR]`.
2. Copia los CV a `public/cv/` y pon sus rutas en `site.cv`.
3. Resuelve lo que liste `npm run pending`.
4. Define el dominio final con la variable `SITE_URL`. Se usa en canonical, hreflang, sitemap, `robots.txt`, `llms.txt` y Open Graph.

## Dónde está cada cosa

| Ruta | Contenido |
|---|---|
| `src/config/site.ts` | Enlaces y datos de contacto |
| `src/content/home.{es,en}.ts` | Textos de la portada |
| `src/content/projects/*.{es,en}.ts` | Casos de estudio |
| `src/content/types.ts` | Tipos que obligan a que ambos idiomas tengan la misma estructura |
| `src/i18n/` | Textos de interfaz y utilidades de rutas |
| `src/data/repos.json` | Repos curados y su snapshot de respaldo |
| `src/lib/github.ts` | Lectura de la API de GitHub en build-time |
| `src/content/media.ts` | Registro de imágenes (los archivos están en `src/assets/`) |
| `src/content/code.ts` | Fragmentos de código real que muestra el sitio, con su enlace a GitHub |
| `src/styles/tokens.css` | Design tokens: color, tipografía, espacios y movimiento |
| `src/styles/global.css` | Estilos de todas las secciones |
| `src/styles/v2.css` | Rediseño v2: tipografía, color, equipos, motion, diseño y reproductor |
| `src/scripts/reels.ts` | Vistas previas y reproductor de los videos de motion |
| `public/motion/` | Videos (720p), fragmentos de 6 s y pósters de motion graphics |
| `src/scripts/glass.ts` | Fondos WebGL: vidrio estriado y curvas de nivel |
| `src/scripts/motion.ts` | Animaciones con GSAP, ScrollTrigger, SplitText y Lenis |
| `src/scripts/app.ts` | Menú, reloj de Lima, cursor, correo e índice de los casos |
| `src/lib/fit.ts` | Ajuste de los titulares grandes al ancho disponible |
| `src/lib/icons.ts`, `src/lib/code-theme.ts` | Logos del stack (Simple Icons) y tema del resaltado de código |
| `public/init.js` | Script mínimo que decide, antes de pintar, si hay intro y movimiento |
| `src/components/`, `src/layouts/`, `src/pages/` | Componentes, layout y rutas |
| `tests/`, `scripts/` | Pruebas y scripts de validación |
| `cv/` | CV en Word (español e inglés); los PDF publicados están en `public/cv/` |

### Añadir un caso de estudio

1. Crea `src/content/projects/<slug>.es.ts` y `<slug>.en.ts` con el tipo `CaseStudy`.
2. Regístralos en `src/content/index.ts`.
3. Si lleva imágenes, añádelas a `src/assets/` y regístralas en `src/content/media.ts`.

Las pruebas fallan si un idioma tiene una estructura distinta del otro, si falta una sección o si una imagen no tiene texto alternativo.

### Cambiar el movimiento

Cada animación es una función de `src/scripts/motion.ts` que se activa en `initMotion()`. Todo queda desactivado con `prefers-reduced-motion`.

### Sección de GitHub

En cada build se consulta `https://api.github.com/repos/<owner>/<repo>` para los repos de `src/data/repos.json`. Si la API no responde, se usan los datos guardados en ese archivo. Para evitar el límite de peticiones anónimas, define `GITHUB_TOKEN` (un token sin permisos basta para repos públicos). Nunca lo subas al repositorio.

## Despliegue

### Vercel

1. Importa el repositorio en Vercel. Detecta Astro automáticamente.
2. En *Environment Variables* define `SITE_URL` con el dominio final y, si quieres, `GITHUB_TOKEN`.
3. `vercel.json` ya incluye las cabeceras de seguridad, la caché de `/_astro/` y la redirección de `/` a `/es/`.

### Netlify o Cloudflare Pages

Comando de build `npm run build`, directorio `dist`. Las cabeceras y la redirección están en `public/_headers` y `public/_redirects`.

### GitHub Pages

Funciona como sitio estático, pero GitHub Pages no permite cabeceras personalizadas: se pierde la CSP. Si el sitio queda en una subruta (`usuario.github.io/repo`), hay que configurar `base` en `astro.config.mjs`.

## Seguridad

- CSP estricta: `script-src 'self'` sin excepciones y todas las hojas de estilo como archivos propios. Solo se permiten atributos `style` (`style-src-attr 'unsafe-inline'`), que necesitan el resaltado de código y los titulares ajustados.
- Fuentes, scripts, imágenes y videos se sirven desde el propio dominio (`media-src 'self'`); no hay peticiones a terceros.
- El correo no aparece en el HTML: un script arma el enlace `mailto:` en el navegador.
- Los enlaces externos llevan `rel="noopener noreferrer"`.
- No hay secretos en el repositorio. `.env*` y `.vercel/` están en `.gitignore`.
