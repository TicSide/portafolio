/**
 * Registro de imágenes reales de los proyectos. Cada clave apunta a un archivo
 * de src/assets; Astro genera las versiones AVIF/WebP en el build.
 *
 * Procedencia:
 * - denunciaya/app-*: frontend ejecutado en local con los datos de prueba del repo.
 * - denunciaya/swagger-*: capturas que subiste al informe (sprint 4).
 * - denunciaya/design-*: artefactos de diseño que subiste al informe.
 * - denunciaya/landing-*: landing ejecutada en local.
 * - design/*: capturas de tus archivos de Figma (prototipo o lienzo), noviembre de 2026.
 * - orgs/psymed-wokwi.jpg: simulación del dispositivo IoT en Wokwi (proyecto público del equipo).
 * - orgs/sems-landing.jpg, orgs/intiva-landing.jpg: landings publicadas por cada equipo.
 * - projects/pueblo-agentico.jpg: vista previa del repositorio TicSide/pueblo-agentico.
 * - yupachayna/*, games/*: capturas de las páginas de itch.io.
 * - about/omar.jpg: foto de la sección de equipo de la landing de DenunciaYa.
 */
import omar from '@/assets/about/omar.jpg';
import dyHome from '@/assets/denunciaya/app-home-es.jpg';
import dyHomeCharts from '@/assets/denunciaya/app-home-es-charts.jpg';
import dyForm from '@/assets/denunciaya/app-complaint-form-es.jpg';
import dyMetrics from '@/assets/denunciaya/app-metrics-es-charts.jpg';
import dyDetail from '@/assets/denunciaya/app-detail-es.jpg';
import dyTeam from '@/assets/denunciaya/app-team-es-cards.jpg';
import dyHomeEn from '@/assets/denunciaya/app-home.jpg';
import dyFormEn from '@/assets/denunciaya/app-complaint-form.jpg';
import dyMetricsEn from '@/assets/denunciaya/app-metrics.jpg';
import dyDetailEn from '@/assets/denunciaya/app-detail.jpg';
import dySwagger from '@/assets/denunciaya/swagger-complaints.jpg';
import dyLanding from '@/assets/denunciaya/landing-hero.jpg';
import dyColor from '@/assets/denunciaya/design-color.jpg';
import dyWireframe from '@/assets/denunciaya/design-wireframe.jpg';
import yuKarajia from '@/assets/yupachayna/karajia.jpg';
import yuMenu from '@/assets/yupachayna/menu.jpg';
import yuCinematic from '@/assets/yupachayna/cinematica.jpg';
import yuSupay from '@/assets/yupachayna/supay.jpg';
import yuGameOver from '@/assets/yupachayna/gameover.jpg';
import hmCover from '@/assets/games/handemonium-cover.jpg';
import cpCover from '@/assets/games/crimson-cover.jpg';
import tsCover from '@/assets/games/toolshifter-cover.jpg';
import paCover from '@/assets/games/pinguis-cover.jpg';
import lpCover from '@/assets/games/labpaws-cover.jpg';
import puebloAgentico from '@/assets/projects/pueblo-agentico.jpg';
import dsSwirl from '@/assets/design/swirl-hero.jpg';
import dsSwirlManifesto from '@/assets/design/swirl-manifiesto.jpg';
import dsNova from '@/assets/design/nova-hero.jpg';
import dsIntiva from '@/assets/design/intiva-onboarding.jpg';
import dsSobraYa from '@/assets/design/sobraya-flujo.jpg';
import dsLouise from '@/assets/design/louise-mockup.jpg';
import psymedWokwi from '@/assets/orgs/psymed-wokwi.jpg';
import semsLanding from '@/assets/orgs/sems-landing.jpg';
import intivaLanding from '@/assets/orgs/intiva-landing.jpg';

export const media = {
  omar,
  dyHome,
  dyHomeCharts,
  dyForm,
  dyMetrics,
  dyDetail,
  dyTeam,
  dyHomeEn,
  dyFormEn,
  dyMetricsEn,
  dyDetailEn,
  dySwagger,
  dyLanding,
  dyColor,
  dyWireframe,
  yuKarajia,
  yuMenu,
  yuCinematic,
  yuSupay,
  yuGameOver,
  hmCover,
  cpCover,
  tsCover,
  paCover,
  lpCover,
  puebloAgentico,
  dsSwirl,
  dsSwirlManifesto,
  dsNova,
  dsIntiva,
  dsSobraYa,
  dsLouise,
  psymedWokwi,
  semsLanding,
  intivaLanding,
} as const;

export type MediaKey = keyof typeof media;

/** Las capturas de videojuegos son pixel art: se escalan sin suavizado. */
export const pixelArt: ReadonlySet<MediaKey> = new Set<MediaKey>([
  'yuKarajia',
  'yuMenu',
  'yuCinematic',
  'yuSupay',
  'yuGameOver',
  'hmCover',
  'cpCover',
  'tsCover',
  'lpCover',
]);
