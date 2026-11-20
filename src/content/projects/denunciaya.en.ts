import type { CaseStudy } from '../types';
import { createComplaint } from '../code';

const org = 'https://github.com/1ASI0729-7401-2520-Prodevs-DenunciaYa';

export const study: CaseStudy = {
  slug: 'denunciaya',
  title: 'DenunciaYa',
  kind: 'software',
  status: 'academic-team',
  period: 'Aug – Dec 2025',
  summary: 'Web platform for citizen complaints. Team coursework.',
  seoDescription:
    'DenunciaYa case study: how I modeled the complaints module with Java and Spring Boot, its REST endpoints documented with OpenAPI, and what I would change.',
  stack: ['Java', 'Spring Boot', 'MySQL', 'Angular', 'TypeScript', 'OpenAPI'],
  repo: `${org}/DenunciaYa-Backend`,
  cover: 'dyHomeEn',
  coverAlt: 'DenunciaYa authority home dashboard.',
  language: 'Java',
  problem:
    'A citizen who wants to report a problem in their district has no single place to file it or to find out what happened next. The authority has nowhere to see the cases and assign them to someone.',
  goal: 'A web application where a citizen files a complaint with evidence and follows its progress, and the authority reviews, assigns and resolves it. This is coursework: it is not in production and has no real users.',
  mine: [
    'Backend, complaints module (complaintCreation): the Complaint aggregate, the Evidence and TimelineItem entities, commands, queries, services, JPA repositories and a controller with 17 REST endpoints documented with OpenAPI. By git blame, 2,498 of the 2,503 lines in the module are mine.',
    'Backend, authorities panel (authoritiesPanel): responsible officers and complaint assignment, with their exceptions and events. 1,939 of 2,716 lines.',
    'Angular frontend: complaint creation, authorities panel, history and authentication views, internationalization with ngx-translate, and connecting the views to the real backend. 78 of the 158 commits in the repository.',
    'The first landing page and, in the report, the style guidelines, information architecture, wireframes and needfinding interviews.',
    'Audit of the Figma file (over 21,000 layers): I reorganized its sections, turned a palette of 8 different blues into 23 color variables and 12 text styles, linked more than 6,700 fills to tokens, and split the brand color from the action color because the primary button only reached a 3.0:1 contrast ratio (WCAG 2.1 AA).',
  ],
  team: [
    'JWT authentication and the IAM module.',
    'The profiles, community and map modules.',
    'A large part of the frontend, and deployment.',
    'Team: Gabriel Mamani, Gabriel Braithuaite, Franco Rioja, Luis Montañez and other authors listed in the history.',
  ],
  tech: [
    'Java 25 and Spring Boot 3.5',
    'Spring Data JPA with MySQL',
    'Bean Validation',
    'springdoc-openapi (Swagger UI)',
    'Spring Security and JJWT (team)',
    'Angular 20 and TypeScript',
    'ngx-translate, PrimeNG and Angular Material',
  ],
  structure: {
    caption:
      'Every backend module repeats the same four layers. This is the complaints module, from the HTTP request to the database.',
    layers: [
      {
        name: 'interfaces',
        note: 'REST',
        mine: true,
        items: ['ComplaintResourceController', 'CreateComplaintResource', 'Resource ↔ command assemblers'],
      },
      {
        name: 'application',
        note: 'use cases',
        mine: true,
        items: ['ComplaintCommandServiceImpl', 'ComplaintQueryServiceImpl'],
      },
      {
        name: 'domain',
        note: 'rules',
        mine: true,
        items: ['Complaint (aggregate)', 'Evidence, TimelineItem', 'ComplaintId, ComplaintStatus, ComplaintPriority', 'Commands, queries, events, exceptions'],
      },
      {
        name: 'infrastructure',
        note: 'persistence',
        mine: true,
        items: ['ComplaintRepository', 'EvidenceRepository', 'TimelineItemRepository'],
      },
    ],
  },
  decisions: [
    {
      chose: 'Separate command and query services',
      over: 'a single CRUD service',
      why: 'Writes go through named commands (create, update status, advance timeline) and reads through queries. Each controller operation maps to one business intent.',
    },
    {
      chose: 'A public identifier as a value object (ComplaintId)',
      over: 'exposing the auto-increment database id',
      why: 'Citizens track a complaint with a code that does not depend on the internal table key.',
    },
    {
      chose: 'A five-step timeline created together with the complaint',
      over: 'storing only a status field',
      why: 'The citizen sees the whole possible path from the moment of filing, and the complaint status is derived from the current step.',
    },
    {
      chose: 'Validation at the edge with Bean Validation, plus domain exceptions',
      over: 'validating by hand inside the controller',
      why: 'Input resources declare which fields are required, and the domain throws named errors such as ComplaintNotFoundException.',
    },
  ],
  challenges: [
    {
      what: 'The complaint status and its timeline drifted out of sync.',
      how: 'I added sync methods in both directions and an endpoint to force it. It works, but it is the part I would redesign.',
    },
    {
      what: 'The frontend was built against a mock API running on json-server.',
      how: 'In the final week I connected the complaint views to the real backend and fixed the routes and models that did not match.',
    },
    {
      what: 'Table names were not what the other modules expected.',
      how: 'The project uses a pluralized snake_case naming strategy; I renamed the entities to match it.',
    },
  ],
  learned: [
    'I would keep a single source of truth for status. Today it is synced both ways by comparing strings, which is fragile.',
    'The Complaint aggregate grew to 583 lines, with methods written for the JSON output. I would move those to the assemblers.',
    'The backend has one test. I would start with unit tests for the aggregate and its status transitions.',
    'Configuration with secrets is committed to the repository. It belongs in environment variables and the secrets should be rotated.',
  ],
  gallery: [
    { image: 'dyHomeEn', alt: 'Authority home dashboard with complaint totals.', title: 'Authority home', mine: '482 of 482 lines are mine', url: 'localhost:4200/home', frame: 'browser' },
    { image: 'dyHomeCharts', alt: 'Charts of complaints by status and by category (Spanish UI).', title: 'Home charts', mine: '482 of 482 lines are mine', url: 'localhost:4200/home', frame: 'browser' },
    { image: 'dyFormEn', alt: 'Report Now form with category, priority and location.', title: 'Complaint form', mine: '1,274 of 1,371 lines are mine', url: 'localhost:4200/complaint-form', frame: 'browser' },
    { image: 'dyDetailEn', alt: 'Complaint detail with status, priority and assigned responsible.', title: 'Complaint detail', mine: '588 of 588 lines are mine', url: 'localhost:4200/complaint-detail/100237', frame: 'browser' },
    { image: 'dyMetricsEn', alt: 'Metrics screen with summary cards and charts.', title: 'Metrics and reports', mine: '400 of 400 lines are mine', url: 'localhost:4200/metrics', frame: 'browser' },
    { image: 'dyTeam', alt: 'Team management with a form and responsible cards (Spanish UI).', title: 'Team management', mine: '936 of 941 lines are mine', url: 'localhost:4200/team-managment', frame: 'browser' },
    { image: 'dySwagger', alt: 'Swagger UI of the backend listing the complaint endpoints.', title: 'Swagger UI of the deployed backend', note: 'A screenshot I added to the sprint 4 report.', url: 'denunciaya-backend.onrender.com/swagger-ui', frame: 'browser' },
    { image: 'dyLanding', alt: 'DenunciaYa landing page with the headline Make your voice heard.', title: 'Landing page', note: 'Published version; the initial structure is mine.', url: 'denunciaya.org', frame: 'browser' },
    { image: 'dyColor', alt: 'Color palette from the DenunciaYa style guide.', title: 'Style guide: color', note: 'An artifact I made for the report.', frame: 'plain' },
    { image: 'dyWireframe', alt: 'Grayscale wireframe of the Report Now form.', title: 'Form wireframe', note: 'An artifact I made for the report.', frame: 'plain' },
  ],
  code: { ...createComplaint, caption: 'The create endpoint. It delegates to a command and returns a resource.' },
  evidence: [
    'Commit history and git blame of the public repositories (figures measured in November 2026 on the develop branch).',
    'OpenAPI documentation generated from the controller, with a screenshot of the deployed Swagger UI on Render from December 2025. That deployment no longer responds.',
    'Screenshots of the frontend running locally against the repository test data (server/db.json).',
  ],
  links: [
    { label: 'Backend repository', href: `${org}/DenunciaYa-Backend` },
    { label: 'Frontend repository', href: `${org}/DenunciaYa.-Frontend` },
    { label: 'Landing page', href: `${org}/DenunciaYa-Landing-Page` },
    { label: 'Project report', href: `${org}/DenunciaYa-Proyect-Report` },
  ],
};
