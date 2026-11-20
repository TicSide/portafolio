import type { CaseStudy } from '../types';
import { createComplaint } from '../code';

const org = 'https://github.com/1ASI0729-7401-2520-Prodevs-DenunciaYa';

export const study: CaseStudy = {
  slug: 'denunciaya',
  title: 'DenunciaYa',
  kind: 'software',
  status: 'academic-team',
  period: 'ago. – dic. 2025',
  summary: 'Plataforma web de denuncias ciudadanas. Proyecto académico en equipo.',
  seoDescription:
    'Caso de estudio de DenunciaYa: cómo modelé el módulo de denuncias con Java y Spring Boot, sus endpoints REST documentados con OpenAPI y qué haría distinto.',
  stack: ['Java', 'Spring Boot', 'MySQL', 'Angular', 'TypeScript', 'OpenAPI'],
  repo: `${org}/DenunciaYa-Backend`,
  cover: 'dyHome',
  coverAlt: 'Panel de inicio de la autoridad en DenunciaYa.',
  language: 'Java',
  problem:
    'Un ciudadano que quiere reportar un problema en su distrito no tiene un canal único para registrarlo ni para saber en qué quedó. La autoridad, por su parte, no tiene dónde ver los casos y asignarlos a un responsable.',
  goal: 'Una aplicación web donde el ciudadano registra una denuncia con evidencia y sigue su avance, y la autoridad la revisa, la asigna y la resuelve. Es un proyecto de curso: no está en producción ni tiene usuarios reales.',
  mine: [
    'Backend, módulo de denuncias (complaintCreation): el agregado Complaint, las entidades Evidence y TimelineItem, comandos, consultas, servicios, repositorios JPA y un controlador con 17 endpoints REST documentados con OpenAPI. Según git blame, 2 498 de las 2 503 líneas del módulo son mías.',
    'Backend, panel de autoridades (authoritiesPanel): responsables y asignación de denuncias, con sus excepciones y eventos. 1 939 de 2 716 líneas.',
    'Frontend Angular: vistas de creación de denuncias, panel de autoridades, historial y autenticación, internacionalización con ngx-translate y la conexión de las vistas con el backend real. 78 de los 158 commits del repositorio.',
    'Landing page inicial y, en el informe, las guías de estilo, la arquitectura de información, los wireframes y las entrevistas de needfinding.',
    'Auditoría del archivo de Figma (más de 21 000 capas): reorganicé las secciones, pasé una paleta de 8 azules distintos a 23 variables de color y 12 estilos de texto, enlacé más de 6 700 rellenos a tokens y separé el color de marca del color de acción porque el botón primario solo alcanzaba un contraste de 3,0:1 (WCAG 2.1 AA).',
  ],
  team: [
    'Autenticación con JWT y el módulo IAM.',
    'Los módulos de perfiles, comunidad y mapa.',
    'Buena parte del frontend y el despliegue.',
    'Equipo: Gabriel Mamani, Gabriel Braithuaite, Franco Rioja, Luis Montañez y otros autores que figuran en el historial.',
  ],
  tech: [
    'Java 25 y Spring Boot 3.5',
    'Spring Data JPA con MySQL',
    'Bean Validation',
    'springdoc-openapi (Swagger UI)',
    'Spring Security y JJWT (equipo)',
    'Angular 20 y TypeScript',
    'ngx-translate, PrimeNG y Angular Material',
  ],
  structure: {
    caption:
      'Cada módulo del backend repite las mismas cuatro capas. Así se ve el módulo de denuncias, de la petición HTTP a la base de datos.',
    layers: [
      {
        name: 'interfaces',
        note: 'REST',
        mine: true,
        items: ['ComplaintResourceController', 'CreateComplaintResource', 'Assemblers recurso ↔ comando'],
      },
      {
        name: 'application',
        note: 'casos de uso',
        mine: true,
        items: ['ComplaintCommandServiceImpl', 'ComplaintQueryServiceImpl'],
      },
      {
        name: 'domain',
        note: 'reglas',
        mine: true,
        items: ['Complaint (agregado)', 'Evidence, TimelineItem', 'ComplaintId, ComplaintStatus, ComplaintPriority', 'Comandos, consultas, eventos, excepciones'],
      },
      {
        name: 'infrastructure',
        note: 'persistencia',
        mine: true,
        items: ['ComplaintRepository', 'EvidenceRepository', 'TimelineItemRepository'],
      },
    ],
  },
  decisions: [
    {
      chose: 'Servicios de comandos y de consultas separados',
      over: 'un único servicio CRUD',
      why: 'Las escrituras pasan por comandos con nombre (crear, actualizar estado, avanzar línea de tiempo) y las lecturas por consultas. Cada operación del controlador se corresponde con una intención del negocio.',
    },
    {
      chose: 'Identificador público como value object (ComplaintId)',
      over: 'exponer el id autoincremental de la base de datos',
      why: 'El ciudadano hace seguimiento con un código de denuncia que no depende de la clave interna de la tabla.',
    },
    {
      chose: 'Línea de tiempo con cinco hitos creada junto con la denuncia',
      over: 'guardar solo un campo de estado',
      why: 'El ciudadano ve todo el recorrido posible desde el registro, y el estado de la denuncia se obtiene del hito actual.',
    },
    {
      chose: 'Validación en el borde con Bean Validation y excepciones de dominio',
      over: 'validar a mano dentro del controlador',
      why: 'Los recursos de entrada declaran qué campos son obligatorios y el dominio lanza errores con nombre, como ComplaintNotFoundException.',
    },
  ],
  challenges: [
    {
      what: 'El estado de la denuncia y su línea de tiempo se desincronizaban.',
      how: 'Añadí métodos de sincronización en ambos sentidos y un endpoint para forzarla. Funciona, pero es la parte que rediseñaría.',
    },
    {
      what: 'El frontend se construyó contra una API simulada con json-server.',
      how: 'En la última semana conecté las vistas de denuncias al backend real y ajusté rutas y modelos donde no coincidían.',
    },
    {
      what: 'Las tablas no se llamaban como esperaban los otros módulos.',
      how: 'El proyecto usa una estrategia de nombres en snake_case y plural; corregí los nombres de las entidades para que coincidieran.',
    },
  ],
  learned: [
    'Dejaría una sola fuente de verdad para el estado. Hoy se sincroniza en dos sentidos comparando textos, y eso es frágil.',
    'El agregado Complaint creció hasta 583 líneas, con métodos pensados para el JSON. Movería esa parte a los assemblers.',
    'El backend tiene una sola prueba. Empezaría por pruebas unitarias del agregado y de las transiciones de estado.',
    'La configuración con secretos está en el repositorio. Deben ir en variables de entorno y rotarse.',
  ],
  gallery: [
    { image: 'dyHome', alt: 'Panel de inicio de la autoridad con totales de denuncias.', title: 'Inicio de la autoridad', mine: '482 de 482 líneas mías', url: 'localhost:4200/home', frame: 'browser' },
    { image: 'dyHomeCharts', alt: 'Gráficos de distribución de denuncias por estado y por categoría.', title: 'Gráficos del inicio', mine: '482 de 482 líneas mías', url: 'localhost:4200/home', frame: 'browser' },
    { image: 'dyForm', alt: 'Formulario Denunciar ahora con categoría, prioridad y ubicación.', title: 'Formulario para denunciar', mine: '1 274 de 1 371 líneas mías', url: 'localhost:4200/complaint-form', frame: 'browser' },
    { image: 'dyDetail', alt: 'Detalle de una denuncia con estado, prioridad y responsable asignado.', title: 'Detalle de la denuncia', mine: '588 de 588 líneas mías', url: 'localhost:4200/complaint-detail/100237', frame: 'browser' },
    { image: 'dyMetrics', alt: 'Métricas con gráfico polar por categoría y tendencias mensuales.', title: 'Métricas y reportes', mine: '400 de 400 líneas mías', url: 'localhost:4200/metrics', frame: 'browser' },
    { image: 'dyTeam', alt: 'Gestión de equipos con formulario y tarjetas de responsables.', title: 'Gestión de equipos', mine: '936 de 941 líneas mías', url: 'localhost:4200/team-managment', frame: 'browser' },
    { image: 'dySwagger', alt: 'Swagger UI del backend con los endpoints de denuncias.', title: 'Swagger UI del backend desplegado', note: 'Captura que subí al informe del sprint 4.', url: 'denunciaya-backend.onrender.com/swagger-ui', frame: 'browser' },
    { image: 'dyLanding', alt: 'Landing de DenunciaYa con el titular Make your voice heard.', title: 'Landing page', note: 'Versión publicada; la estructura inicial es mía.', url: 'denunciaya.org', frame: 'browser' },
    { image: 'dyColor', alt: 'Paleta de colores de la guía de estilos de DenunciaYa.', title: 'Guía de estilos: color', note: 'Artefacto que hice para el informe.', frame: 'plain' },
    { image: 'dyWireframe', alt: 'Wireframe en escala de grises del formulario Denunciar ahora.', title: 'Wireframe del formulario', note: 'Artefacto que hice para el informe.', frame: 'plain' },
  ],
  code: { ...createComplaint, caption: 'Endpoint de creación. Delega en un comando y responde con un recurso.' },
  evidence: [
    'Historial de commits y git blame de los repositorios públicos (cifras medidas en noviembre de 2026 sobre la rama develop).',
    'Documentación OpenAPI generada desde el controlador, con captura del Swagger desplegado en Render en diciembre de 2025. Hoy ese despliegue no responde.',
    'Capturas del frontend ejecutado en local con los datos de prueba del repositorio (server/db.json).',
  ],
  links: [
    { label: 'Repositorio backend', href: `${org}/DenunciaYa-Backend` },
    { label: 'Repositorio frontend', href: `${org}/DenunciaYa.-Frontend` },
    { label: 'Landing page', href: `${org}/DenunciaYa-Landing-Page` },
    { label: 'Informe del proyecto', href: `${org}/DenunciaYa-Proyect-Report` },
  ],
};
