import type { CaseStudy } from '../types';
import { triggerCinematic } from '../code';

export const study: CaseStudy = {
  slug: 'yupachayna',
  title: 'Yupachayña',
  kind: 'game',
  status: 'released',
  period: 'jun. – sep. 2025',
  summary: 'Videojuego 2D de acción y aventura con atmósfera andina, hecho en equipo con Unity y C# para la Patrimonio Game Jam.',
  seoDescription:
    'Caso de estudio de Yupachayña, un juego 2D en Unity y C#: qué scripts programé, cómo están organizados y qué cambiaría.',
  stack: ['Unity 6', 'C#', 'Timeline', 'Cinemachine', 'DOTween'],
  repo: 'https://github.com/ElJulioGG/PeruJam2025Cultura',
  cover: 'yuKarajia',
  coverAlt: 'Personaje junto a sarcófagos de estilo Chachapoyas al atardecer.',
  language: 'C#',
  problem:
    'Hacer, con un equipo pequeño y en pocos meses, un juego de acción con vista cenital que transmita la atmósfera de la mitología andina y de Chachapoyas sin caer en el folclore de postal.',
  goal: 'Un juego para Windows de 10 a 30 minutos, con combate, exploración, un jefe y cinemáticas que cuentan la historia. Está publicado en itch.io y tiene una valoración de 5,0 con 6 votos (noviembre de 2026).',
  mine: [
    'El enemigo Auqui: deambula, persigue al jugador cuando entra en su radio y vuelve a su posición si se aleja. Tiene dos ataques con corrutinas y tiempos de espera.',
    'Las cinemáticas con Timeline: disparadores, opción de saltarlas y devolución del control al jugador cuando terminan.',
    'Menú principal, transiciones entre escenas, cursor y elementos de interfaz.',
    'Piezas de nivel: placas de presión, trampas de flechas y encuentros que cierran la sala hasta derrotar a un grupo de enemigos.',
    'La mascota que sigue al jugador y el diseño de niveles con tilemaps.',
    'Los efectos de todo el juego, montados sobre el arte que me entregó el equipo.',
    '70 de los 97 commits del repositorio.',
  ],
  team: [
    'Movimiento y combate del jugador, estadísticas, máquinas de estado de los enemigos y del jefe, sistema de diálogos y gestor de audio: Julio Meza.',
    'Arte y música: el resto del equipo.',
    'Autores en itch.io: Tic_Side, ElJulioGG, Bossman_TB y ZaberDV.',
  ],
  tech: ['Unity 6 (6000.0)', 'C#', 'Timeline y PlayableDirector', 'Cinemachine', 'DOTween', 'Tilemaps 2D'],
  structure: {
    caption:
      'Los scripts del juego por área. Las columnas marcadas son las que programé yo; el resto es del equipo.',
    layers: [
      {
        name: 'Enemigos',
        items: ['AuquiEnemy, AuquiAttack (míos)', 'EnemyStateMachine, EnemyStats (equipo)'],
        mine: true,
      },
      { name: 'Jugador', items: ['Movement, PlayerStats (equipo)', 'PetFollower (mío)'] },
      {
        name: 'Nivel',
        items: ['PlacaPresion, ArrowSpawner', 'EnemyGroupWatcher', 'ChangeFloorTypeTrigger'],
        mine: true,
      },
      {
        name: 'Cinemáticas e interfaz',
        items: ['TriggerCinematic, RitualCinematicTrigger', 'MenuController, FadeTransition', 'CustomCursor, CircularProgress'],
        mine: true,
      },
      { name: 'Diálogo y audio', items: ['DialogBase, NPCController', 'AudioManager (equipo)'] },
    ],
  },
  decisions: [
    {
      chose: 'Devolver el control al jugador con el evento stopped del PlayableDirector',
      over: 'esperar un tiempo fijo',
      why: 'La cinemática puede saltarse o cambiar de duración. Al suscribirme al evento, el juego se reanuda justo cuando termina, y me desuscribo para que no se dispare dos veces.',
    },
    {
      chose: 'Encuentros como un componente configurable desde el Inspector',
      over: 'programar cada sala por separado',
      why: 'EnemyGroupWatcher recibe la lista de enemigos, el objeto que bloquea la salida y la música. Quien arma el nivel crea un encuentro nuevo sin tocar código.',
    },
    {
      chose: 'Comportamiento del Auqui por distancias dentro de Update',
      over: 'la máquina de estados que usan los demás enemigos',
      why: 'Fue más rápido para un enemigo con tres comportamientos. Es la decisión que hoy cambiaría.',
    },
  ],
  challenges: [
    {
      what: 'Al terminar una cinemática había que reactivar al jugador, la cámara, la mascota y la interfaz en el orden correcto.',
      how: 'Reuní toda la reactivación en un solo método que se ejecuta cuando la Timeline termina.',
    },
    {
      what: 'La mascota debía seguir al jugador sin taparlo.',
      how: 'Se coloca detrás según la dirección de movimiento, con un desplazamiento vertical sinusoidal y una interpolación suave.',
    },
  ],
  learned: [
    'Usaría una máquina de estados explícita para el Auqui, igual que el resto de enemigos, en lugar de banderas booleanas.',
    'EnemyGroupWatcher revisa la lista de enemigos en cada frame. Un evento de muerte sería más limpio.',
    'Muchas referencias se asignan a mano en el Inspector sin validación. Añadiría comprobaciones al iniciar.',
    'Mis mensajes de commit en jams son demasiado cortos. En proyectos de curso ya uso commits convencionales.',
  ],
  gallery: [
    { image: 'yuKarajia', alt: 'Personaje junto a sarcófagos de estilo Chachapoyas al atardecer.', title: 'Nivel exterior', note: 'Arte del equipo.', frame: 'plain' },
    { image: 'yuCinematic', alt: 'Cinemática con un narrador andino.', title: 'Cinemática del prólogo', mine: 'Mi código', note: 'Se puede saltar manteniendo la barra espaciadora.', frame: 'plain' },
    { image: 'yuSupay', alt: 'Cinemática del ritual al Supay.', title: 'El ritual del Supay', mine: 'Mi código', frame: 'plain' },
    { image: 'yuMenu', alt: 'Menú principal con Play, Créditos y Exit.', title: 'Menú principal', mine: 'Mi código', frame: 'plain' },
    { image: 'yuGameOver', alt: 'Pantalla de Game Over con una máscara andina.', title: 'Pantalla de derrota', frame: 'plain' },
  ],
  code: { ...triggerCinematic, caption: 'Disparador de cinemáticas. Se suscribe al evento stopped y se desuscribe al terminar.' },
  evidence: [
    'Historial de commits por archivo del repositorio público.',
    'Página del juego en itch.io, con capturas y valoraciones.',
    'Capturas tomadas de la página de itch.io.',
  ],
  links: [
    { label: 'Jugar en itch.io', href: 'https://tic-side.itch.io/yupachayna' },
    { label: 'Página del prototipo', href: 'https://bossman-tb.itch.io/yupachayna' },
    { label: 'Repositorio', href: 'https://github.com/ElJulioGG/PeruJam2025Cultura' },
  ],
};
