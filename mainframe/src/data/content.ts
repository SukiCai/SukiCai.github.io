export const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#notes', label: 'Notes' },
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

export const ABOUT = {
  paragraphs: [
    "I like systems with clear ownership boundaries and code that survives contact with real users. Most of my days are spent on insurance infrastructure at Munich Re in New York — multi-tenant case management, Kubernetes workers that stay out of the request path, and Azure OpenAI pipelines that have to de-identify a document before anyone else sees it.",
    "I got here by shipping under constraint: a trading floor at Citi, high-severity incidents at AWS, a week-long proof before a year-long bet at Munich Re, and sponsored work with Amazon and the Broad Institute. For four years I was a Lead TA at UBC — CS, statistics, physics, a thousand-plus students. I am finishing an M.S. in Software Engineering at UC Berkeley. Lately I build with Claude Code and MCP. The tools write more of the code. I still make the architectural decisions.",
  ],
  stats: [
    { value: '2 mo', label: 'to rebuild a core underwriting platform' },
    { value: '5 teams', label: 'shipping on AI-assisted workflows I designed' },
    { value: '3 pipelines', label: 'clinical documents in production, with PII stripped first' },
    { value: '4 years', label: 'Lead TA at UBC — CS, stats, physics, 1,000+ students' },
  ],
  path: [
    { when: 'Now', where: 'New York', what: 'Software Engineer at Munich Re. Finishing an M.S. in Software Engineering at UC Berkeley (MSSE Merit Scholarship). Open to relocation.' },
    { when: '2026', where: 'Broad Institute', what: 'Technical lead on a sponsored genomic research platform — async FastAPI pipelines and Web Worker viz for multi-GB datasets.' },
    { when: '2024—', where: 'Munich Re', what: 'Rebuilt the enterprise underwriting workbench in two months. Primary on-call. Productionized three clinical document pipelines.' },
    { when: '2023', where: 'AWS', what: 'Cloud Support intern. High-severity incidents across EC2, S3, IAM, Lambda, and VPC; automated the triage we kept repeating.' },
    { when: '2022', where: 'Citi', what: 'Software Engineer intern on a multi-billion-dollar fixed-income platform — Spring Boot, Angular, latency-sensitive reporting.' },
    { when: '2019–24', where: 'UBC', what: 'B.S. Computer Science and Statistics, High Distinction. Lead TA — first woman in the role in ten years. Google CS Research Mentorship Program Scholar.' },
  ],
}

export interface WorkItem {
  title: string
  meta: string
  stack: string
  description: string
  result?: string
  noteHref?: string
  noteLabel?: string
  demoHref?: string
  demoLabel?: string
  demoVideo?: string
}

export const WORK_ITEMS: WorkItem[] = [
  {
    title: 'Underwriting Platform Rebuild',
    meta: 'Munich Re · New York · 2024–present',
    stack: 'FastAPI · PostgreSQL · React / Next.js · Kubernetes · OAuth2',
    description:
      "The existing workbench — built by an external contractor team over ~3 years — had accumulated thousands of open bugs and a frontend our team didn't even own. I led the rebuild: sat with underwriters, shipped a working POC in a week, and kept carrier workflows intact so nobody had to relearn their job. The new system is multi-tenant by construction — request-scoped authorization, database-enforced isolation — with Kubernetes workers pulling jobs via FOR UPDATE SKIP LOCKED so async work never contends with the request path. I am the primary on-call. Production in two months.",
    result:
      'Helped double enterprise client adoption · $3,000 Spot Bonus, SVP of Digital Solutions · weekend integration demo, VP Sales Spotlight Award',
    noteHref: '#writing',
    noteLabel: 'Read the architecture decision behind it',
  },
  {
    title: 'Clinical Document Pipelines',
    meta: 'Munich Re · 2024–present',
    stack: 'Azure OpenAI · FastAPI · feature flags',
    description:
      'Radiology, sleep, and procedure reports are useful to underwriting only after they are structured — and they are dangerous until they are de-identified. I productionized three Azure OpenAI pipelines with PII stripping first, feature-flagged rollouts, and end-to-end validation so a model change could ship to one book of business without surprising the others.',
    noteHref: '#writing-documents',
    noteLabel: 'Notes on trusting a pipeline, not a prompt',
  },
  {
    title: 'ShouldI',
    meta: 'Personal · In progress · Human-in-the-loop decision agents',
    stack: 'Expo · Hono · Zod · Hermes agent stack',
    description:
      'People do not lack advice — they lack a clean decision. ShouldI runs a multi-agent stack on high-stakes “Should I…?” calls: structured intake, domain expert routing, challenge modes that attack fixed assumptions, then a YES/NO with rationale. The human stays in the loop — the agents sharpen the call; they do not take it. We rebuilt that agent layer end-to-end (prompt contracts, Hermes adapters, briefing and choice protocols) so the product is a decision protocol, not a chat with better memory: Expo stays thin, Hono proxies Hermes behind shared Zod schemas. While the industry races toward agents that act for you, ShouldI compounds judgment by keeping the decider human.',
    result: 'Human-in-the-loop decision agents — judgment stays with the person.',
    noteHref: '#writing-human-loop',
    noteLabel: 'Why human-in-the-loop still matters',
  },
]

export interface EarlierItem {
  title: string
  meta: string
  line: string
  demoHref?: string
  demoLabel?: string
  demoVideo?: string
  demoImage?: string
  demoImageAlt?: string
}

export const EARLIER_ITEMS: EarlierItem[] = [
  {
    title: 'Genomic Research Platform',
    meta: 'Sponsored by Broad Institute · 2026 · FastAPI · Next.js · D3 · Deck.gl',
    line: 'Led the build for multi-GB genomic exploration — async pipelines, chunked client processing, and Web Workers so million-point plots stay interactive.',
    demoHref: 'https://broad-1-26.vercel.app/',
    demoLabel: 'Live demo',
  },
  {
    title: 'Serverless E-commerce Platform',
    meta: 'Sponsored by Amazon · 2023 · Lambda · DynamoDB · Cognito',
    line: 'Led an 8-person team on an event-driven serverless stack sized for burst traffic — absorb a spike without paying for idle capacity the rest of the year.',
  },
  {
    title: 'Frontend, Munich Re intern',
    meta: 'Toronto · Summer 2023',
    line: 'Led a 3-engineer team on a production Next.js / MUI app. A metadata-driven component framework cut frontend duplication by about 40% and became a pattern in the shared UI libraries, with Jest standards to match.',
  },
  {
    title: 'Cloud Support, AWS intern',
    meta: 'Toronto · Winter 2023',
    line: 'High-severity incidents across EC2, S3, IAM, Lambda, and VPC for enterprise customers. Partnered with Core Service Engineering on systemic RCA, then automated the diagnostics we kept repeating — Python / Boto3, about 30% less manual triage.',
  },
  {
    title: 'Fixed-income platform, Citi intern',
    meta: 'Mississauga · Summer 2022',
    line: 'Full-stack analytics on a multi-billion-dollar trading platform: Spring Boot, Angular, real-time retrieval, multi-party institutional reporting, and tracing on the paths traders actually wait on.',
  },
  {
    title: 'World Life Expectancy (D3)',
    meta: 'UBC · D3.js',
    line: 'Interactive dashboard — map, year scrubber, and linked scatterplots for global life expectancy.',
    demoImage: '/assets/work/life-expectancy.gif',
    demoImageAlt: 'Animated preview of the World Life Expectancy D3 dashboard',
  },
  {
    title: 'Machine Learning Web App',
    meta: 'UBC · Freshman year · Jan 2020 · 3 days',
    line: 'End-to-end ML web app built in three days, before GPT existed.',
    demoImage: '/assets/work/ml-web-app.gif',
    demoImageAlt: 'Animated preview of the machine learning web app',
  },
]

export const FIELD_NOTES = [
  {
    n: '01',
    title: 'Source of truth follows the domain',
    body: 'Case management owned the case. The rules engine owned the schema. Copying one into the other looked convenient and produced a whole class of bugs. Authority should sit with the thing that actually changes.',
  },
  {
    n: '02',
    title: 'A week is long enough to be wrong',
    body: 'Before committing months to the underwriting rebuild, I shipped a POC in seven days and put it in front of the people who would live in it. Direction is cheaper to falsify than to unwind.',
  },
  {
    n: '03',
    title: 'Isolation is a database problem',
    body: 'Request-scoped auth is not tenant isolation. Isolation holds when the row lock, the SKIP LOCKED worker, and the schema all refuse to leak across carriers — including at 2am, when the on-call is you.',
  },
  {
    n: '04',
    title: 'The model writes. You still own the system.',
    body: 'Claude Code and MCP make me faster — the same workflows now run across five engineering teams. They do not decide where a boundary goes, what stays versioned, or what an in-flight case is allowed to assume. Velocity without ownership is just generating code.',
  },
]

export const WRITING_POSTS = [
  {
    title: 'Source of truth should follow domain boundaries, not service convenience',
    meta: 'Notes from the Munich Re platform rebuild',
    paragraphs: [
      "When we rebuilt the underwriting workbench, the original assumption was that our case-management service — the thing that owns the lifecycle and state of an underwriting case — should also be the single source of truth for everything a case touches, including the client-specific schema and interview workflow that drives it.",
      'That assumption was quietly responsible for an entire category of bugs. The rules engine, not case management, was the system that actually owned each client\'s configurable schema and workflow definitions — and those could evolve independently. Copying that knowledge into case management meant the two services could, and eventually did, disagree with each other.',
      'The fix wasn\'t a patch. It was defining source-of-truth boundaries by domain instead of by convenience: the rules engine became authoritative for schema and workflow, case management remained authoritative for case state and processing. The frontend fetched schema dynamically from the service that actually owned it, and we versioned schemas so an in-flight case stayed pinned to the definition it was created against — even as the schema evolved underneath it.',
      'Instead of triaging symptoms one at a time, this eliminated the whole class of bugs structurally. It\'s the decision I\'d point to first if you asked what "owning the architecture" actually looked like on this project — not the two-month timeline, not the tech stack, this.',
    ],
  },
  {
    title: 'Ship the proof before the plan',
    meta: 'How the rebuild started',
    paragraphs: [
      'The inherited workbench had thousands of open bugs and a frontend our team did not own. A 15-engineer contractor effort had spent about three years getting to that state. The tempting move was to write a long design doc and disappear for a quarter.',
      'I did the opposite. One week, a working POC, and a room of underwriters clicking through their actual workflows. If the new shape was wrong, we would find out while it was still cheap. It wasn\'t wrong enough to stop — so the next two months were execution, not debate.',
      'The POC was not a demo. It was a decision: keep the carrier\'s existing motions, replace the internals, do not force a retraining cycle. Everything we shipped later had to pass that test.',
    ],
  },
  {
    id: 'writing-documents',
    title: 'Trust the pipeline, not the prompt',
    meta: 'Clinical documents, PII, and a model that is allowed to be wrong',
    paragraphs: [
      'A radiology report is not a chat. It is a document that arrived with a person attached to it, and the useful part is a handful of structured fields that underwriting actually consumes. The rest is residue — including names, dates, and identifiers that should never leave the extraction step.',
      'The three pipelines I productionized (radiology, sleep, procedure) all do the same unglamorous things first: de-identify, validate, feature-flag the rollout. A better prompt does not get to skip that. A model upgrade ships to one book of business, not to production as an idea.',
      'I would rather own a boring pipeline that can be rolled back than a clever completion that cannot explain what it touched. The prompt is an implementation detail. The contract is the pipeline.',
    ],
  },
  {
    id: 'writing-human-loop',
    title: 'Why keep the human in the loop — especially now',
    meta: 'Notes from building ShouldI',
    paragraphs: [
      'The default story in 2026 is that agents should act for you: book the flight, send the email, accept the offer. That is a useful story for chores. It is a dangerous story for decisions that rewrite a life — career, money, relationship, immigration runway. Those calls are not incomplete chat threads. They are commitments you still have to live inside after the model stops talking.',
      'Memory does not solve this. A model that remembers your preferences can still sound certain while skipping the constraint that actually mattered — visa timing, a partner\'s non-negotiable, the offer you cannot reverse in six months. Autonomy without ownership just moves the failure mode: from "I did not know" to "the agent decided and I cannot explain why."',
      'Human-in-the-loop is not a safety sticker we glued on at the end. It is the product shape. On ShouldI the agent stack runs intake, routes domain experts, and challenges fixed assumptions — then stops at a YES/NO the person still has to own. The agents sharpen the call. They do not take it. That boundary is what makes the system compound judgment instead of outsourcing it.',
      'Later, when agents are cheaper and more capable, this only matters more. The scarce thing will not be another answer. It will be a person who can still say: this was my call, these were the tradeoffs, and I can defend them.',
    ],
  },
]

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
  linkedin: 'https://www.linkedin.com/in/sukicai/',
  linkedinLabel: 'linkedin.com/in/sukicai',
  line: 'Based in New York, open to relocation. If you are rebuilding something that outgrew its first architecture — or hiring for that kind of work — I would like to hear about it.',
}

export const HERO = {
  name: "Hi, I'm Suki",
  headline: 'Software Engineer at Munich Re · New York',
  subhead: 'M.S. Software Engineering, UC Berkeley · B.S. CS & Statistics, UBC',
  typewriter:
    'I build backend systems and rebuild the ones that stopped working. Open to conversations about architecture, AI-assisted engineering, and early-stage teams.',
  pills: [
    { href: '#work', label: 'Selected work', external: false },
    { href: '#notes', label: 'Notes', external: false },
    { href: 'https://github.com/SukiCai', label: 'GitHub ↗', external: true },
    { href: 'https://www.linkedin.com/in/sukicai/', label: 'LinkedIn ↗', external: true },
  ],
}
