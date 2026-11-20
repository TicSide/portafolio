import type { CaseStudy } from '../types';
import { triggerCinematic } from '../code';

export const study: CaseStudy = {
  slug: 'yupachayna',
  title: 'Yupachayña',
  kind: 'game',
  status: 'released',
  period: 'Jun – Sep 2025',
  summary: '2D action-adventure game with an Andean atmosphere, made as a team with Unity and C# for the Patrimonio Game Jam.',
  seoDescription:
    'Yupachayña case study, a 2D game in Unity and C#: which scripts I wrote, how they are organized and what I would change.',
  stack: ['Unity 6', 'C#', 'Timeline', 'Cinemachine', 'DOTween'],
  repo: 'https://github.com/ElJulioGG/PeruJam2025Cultura',
  cover: 'yuKarajia',
  coverAlt: 'A character next to Chachapoyas-style sarcophagi at sunset.',
  language: 'C#',
  problem:
    'Build, with a small team and in a few months, a top-down action game that carries the atmosphere of Andean and Chachapoyas mythology without turning it into a postcard.',
  goal: 'A 10 to 30 minute Windows game with combat, exploration, a boss and cutscenes that tell the story. It is published on itch.io with a 5.0 rating from 6 votes (November 2026).',
  mine: [
    'The Auqui enemy: it wanders, chases the player inside its radius and returns to its post when the player leaves. It has two attacks driven by coroutines and cooldowns.',
    'The Timeline cutscenes: triggers, a skip option, and handing control back to the player when they end.',
    'Main menu, scene transitions, cursor and UI elements.',
    'Level pieces: pressure plates, arrow traps, and encounters that lock the room until a group of enemies is defeated.',
    'The pet that follows the player, and level design with tilemaps.',
    'The effects across the whole game, built on the art the team handed me.',
    '70 of the 97 commits in the repository.',
  ],
  team: [
    'Player movement and combat, stats, the enemy and boss state machines, the dialogue system and the audio manager: Julio Meza.',
    'Art and music: the rest of the team.',
    'Authors on itch.io: Tic_Side, ElJulioGG, Bossman_TB and ZaberDV.',
  ],
  tech: ['Unity 6 (6000.0)', 'C#', 'Timeline and PlayableDirector', 'Cinemachine', 'DOTween', '2D Tilemaps'],
  structure: {
    caption: 'The game scripts by area. The marked columns are the ones I wrote; the rest belongs to the team.',
    layers: [
      {
        name: 'Enemies',
        items: ['AuquiEnemy, AuquiAttack (mine)', 'EnemyStateMachine, EnemyStats (team)'],
        mine: true,
      },
      { name: 'Player', items: ['Movement, PlayerStats (team)', 'PetFollower (mine)'] },
      {
        name: 'Level',
        items: ['PlacaPresion, ArrowSpawner', 'EnemyGroupWatcher', 'ChangeFloorTypeTrigger'],
        mine: true,
      },
      {
        name: 'Cutscenes and UI',
        items: ['TriggerCinematic, RitualCinematicTrigger', 'MenuController, FadeTransition', 'CustomCursor, CircularProgress'],
        mine: true,
      },
      { name: 'Dialogue and audio', items: ['DialogBase, NPCController', 'AudioManager (team)'] },
    ],
  },
  decisions: [
    {
      chose: 'Handing control back with the PlayableDirector stopped event',
      over: 'waiting a fixed time',
      why: 'A cutscene can be skipped or change length. By subscribing to the event the game resumes exactly when it ends, and I unsubscribe so it cannot fire twice.',
    },
    {
      chose: 'Encounters as a component configured in the Inspector',
      over: 'scripting each room separately',
      why: 'EnemyGroupWatcher takes the enemy list, the object that blocks the exit and the music. Whoever builds the level creates a new encounter without touching code.',
    },
    {
      chose: 'Distance checks inside Update for the Auqui',
      over: 'the state machine the other enemies use',
      why: 'It was faster for an enemy with three behaviors. It is the decision I would change today.',
    },
  ],
  challenges: [
    {
      what: 'When a cutscene ended, the player, camera, pet and UI had to come back in the right order.',
      how: 'I put all of the reactivation in one method that runs when the Timeline stops.',
    },
    {
      what: 'The pet had to follow the player without covering them.',
      how: 'It sits behind the player based on movement direction, with a sine-wave vertical offset and smooth interpolation.',
    },
  ],
  learned: [
    'I would use an explicit state machine for the Auqui, like the other enemies, instead of boolean flags.',
    'EnemyGroupWatcher checks the enemy list every frame. A death event would be cleaner.',
    'Many references are assigned by hand in the Inspector with no validation. I would add checks on start.',
    'My commit messages in jams are too short. In coursework I already use conventional commits.',
  ],
  gallery: [
    { image: 'yuKarajia', alt: 'A character next to Chachapoyas-style sarcophagi at sunset.', title: 'Outdoor level', note: 'Art by the team.', frame: 'plain' },
    { image: 'yuCinematic', alt: 'Cutscene with an Andean narrator.', title: 'Prologue cutscene', mine: 'My code', note: 'Hold the space bar to skip it.', frame: 'plain' },
    { image: 'yuSupay', alt: 'Cutscene of the Supay ritual.', title: 'The Supay ritual', mine: 'My code', frame: 'plain' },
    { image: 'yuMenu', alt: 'Main menu with Play, Credits and Exit.', title: 'Main menu', mine: 'My code', frame: 'plain' },
    { image: 'yuGameOver', alt: 'Game Over screen with an Andean mask.', title: 'Defeat screen', frame: 'plain' },
  ],
  code: { ...triggerCinematic, caption: 'Cutscene trigger. It subscribes to the stopped event and unsubscribes when done.' },
  evidence: [
    'Per-file commit history of the public repository.',
    'The game page on itch.io, with screenshots and ratings.',
    'Screenshots taken from the itch.io page.',
  ],
  links: [
    { label: 'Play on itch.io', href: 'https://tic-side.itch.io/yupachayna' },
    { label: 'Prototype page', href: 'https://bossman-tb.itch.io/yupachayna' },
    { label: 'Repository', href: 'https://github.com/ElJulioGG/PeruJam2025Cultura' },
  ],
};
