export const NAV_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#writing', label: 'Writing' },
  { href: '#life', label: 'Life' },
  { href: '#contact', label: 'Contact' },
]

export const HERO_TERMINAL_LINES = [
  { type: 'dim' as const, text: 'resolving dependencies...' },
  { type: 'check' as const, text: 'backend-systems@production-grade' },
  { type: 'check' as const, text: 'systems-architecture@source-of-truth' },
  { type: 'check' as const, text: 'ai-assisted-engineering@claude-code' },
  { type: 'check' as const, text: 'underwriting-rebuild (2mo, replaces 3yr build)' },
  { type: 'muted' as const, text: 'added 1 engineer in 0.8s' },
  { type: 'success' as const, text: '✓ Suki Cai installed successfully' },
]

export const INTRO_TERMINAL_LINES = [
  { type: 'dim' as const, text: 'resolving dependencies...' },
  { type: 'check' as const, text: 'backend-systems@production-grade' },
  { type: 'check' as const, text: 'systems-architecture@source-of-truth' },
  { type: 'check' as const, text: 'ai-assisted-engineering@claude-code' },
  { type: 'muted' as const, text: 'added 1 engineer in 0.8s' },
  { type: 'success' as const, text: '✓ Suki Cai installed successfully' },
]

export interface WorkItem {
  title: string
  meta: string
  stack: string
  descriptionHtml: string
  result?: string
}

export const WORK_ITEMS: WorkItem[] = [
  {
    title: 'Underwriting Platform Rebuild',
    meta: 'Munich Re · 2024–present',
    stack: 'FastAPI · PostgreSQL · React / Next.js · Kubernetes',
    descriptionHtml:
      "The existing workbench — built by an external contractor team over ~3 years — had accumulated thousands of open bugs and a frontend our team didn't even own. I led the rebuild: ran discovery directly with underwriters and their engineering leads, shipped a working POC in a week to validate direction before committing months to it, and scoped the rebuild to preserve existing carrier workflows rather than forcing a retraining cycle. Shipped in 2 months.",
    result: 'Helped double enterprise client adoption · $3,000 Spot Bonus, SVP of Digital Solutions',
  },
  {
    title: 'Genomic Research Platform',
    meta: 'Sponsored by Broad Institute · 2026',
    stack: 'FastAPI · Next.js · D3.js · Web Workers',
    descriptionHtml:
      'Async pipelines and interactive visualizations for multi-GB genomic datasets. Chunked processing and Web Workers keep the UI thread responsive while rendering 1M+ data points.',
  },
  {
    title: 'Serverless E-commerce Platform',
    meta: 'Sponsored by Amazon · 2023',
    stack: 'Lambda · DynamoDB · Cognito',
    descriptionHtml:
      'Led an 8-person team building an event-driven serverless architecture designed to absorb burst traffic without over-provisioning.',
  },
]

export const WRITING_POST = {
  title: 'Source of truth should follow domain boundaries, not service convenience',
  meta: 'Notes from the Munich Re platform rebuild',
  paragraphs: [
    "When we rebuilt the underwriting workbench, the original assumption was that our case-management service — the thing that owns the lifecycle and state of an underwriting case — should also be the single source of truth for everything a case touches, including the client-specific schema and interview workflow that drives it.",
    "That assumption was quietly responsible for an entire category of bugs. The rules engine, not case management, was the system that actually owned each client's configurable schema and workflow definitions — and those could evolve independently. Copying that knowledge into case management meant the two services could, and eventually did, disagree with each other.",
    "The fix wasn't a patch. It was defining source-of-truth boundaries by domain instead of by convenience: the rules engine became authoritative for schema and workflow, case management remained authoritative for case state and processing. The frontend fetched schema dynamically from the service that actually owned it, and we versioned schemas so an in-flight case stayed pinned to the definition it was created against — even as the schema evolved underneath it.",
    'Instead of triaging symptoms one at a time, this eliminated the whole class of bugs structurally. It\'s the decision I\'d point to first if you asked what "owning the architecture" actually looked like on this project — not the two-month timeline, not the tech stack, this.',
  ],
}

export interface LifeCard {
  image: string
  alt: string
  caption: string
}

export const LIFE_CARDS: LifeCard[] = [
  { image: '/assets/life/life-1-code.webp', alt: 'Laptop glowing at a desk late at night, mid-debug', caption: '2am, mid-debug' },
  { image: '/assets/life/life-5-coffee.webp', alt: 'A cup of coffee with steam curling up in morning light', caption: 'Coffee, first' },
  { image: '/assets/life/life-3-campus.webp', alt: 'A university bell tower on campus, seen from a path lined with trees', caption: 'Berkeley, fall term' },
  { image: '/assets/life/life-6-books.webp', alt: 'A small stack of books with one open on top', caption: 'Rereading, again' },
  { image: '/assets/life/life-2-nyc.webp', alt: 'New York City skyline at dusk from a riverside bench', caption: 'New York, lately' },
  { image: '/assets/life/life-4-trail.webp', alt: 'A hiker looking out over layered mountain ridges', caption: 'Wherever it leads' },
  { image: '/assets/life/life-7-travel.webp', alt: 'View from an airplane window over clouds at golden hour', caption: 'Over the Pacific' },
]

export const CONTACT = {
  email: 'yufeicaimail@gmail.com',
  github: 'https://github.com/SukiCai',
  githubLabel: 'github.com/SukiCai',
  linkedin: 'https://linkedin.com/in/SukiCai',
  linkedinLabel: 'linkedin.com/in/SukiCai',
}
