# Suki Cai — personal site

React/TypeScript/Vite/Tailwind rebuild of [sukicai.github.io](https://sukicai.github.io/), migrated from the
original static HTML/CSS/JS site so it can be deployed on Vercel with git-based CI instead of hand-committing
build output. Ported from the original site 1:1: same copy, same visual design, same interactions — just as
React components with proper hooks instead of imperative DOM scripts.

## Stack

- **React 19** + **TypeScript**
- **Vite** for dev server / bundling
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — mostly unused directly; nearly all styling is the ported,
  hand-written CSS in `src/index.css` (kept as-is for visual fidelity with the original site)
- **three.js** for the intro sequence's ambient landscape backdrop (lazy-loaded, not in the main bundle)
- **lottie-web** (via CDN script tag) for the small animated logo mark

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Structure

```
src/
  data/content.ts          # all copy: nav links, work items, writing post, life cards, contact
  lib/
    particleText.ts        # canvas text-to-particles engine (hero name, intro greeting)
    terminalInstall.ts      # terminal "install" typing/checklist engine
  hooks/
    useReveal.ts            # IntersectionObserver reveal-on-scroll
    useHeroSpotlight.ts      # cursor-tracking ambient glow on the hero
    useLifeSpread.ts         # hover-push interaction for the life card fan
    useLottieLogo.ts         # loads the animated spark mark into the nav logo
    useScrollMaskReveal.ts   # wheel/touch/key-driven iris reveal for the intro -> home transition
  components/
    IntroSequence.tsx       # terminal -> particle greeting -> scroll-mask reveal into Home
    LandscapeScene.tsx       # three.js backdrop for the intro (code-split, lazy-loaded)
    ParticleHeading.tsx      # reusable canvas-particle heading/paragraph
    Terminal.tsx             # reusable terminal UI
    Home.tsx                 # Nav + Hero + About + Work + Writing + Life + Contact + Footer
    Nav.tsx, Hero.tsx, About.tsx, Work.tsx, Writing.tsx, LifeSpread.tsx, Contact.tsx, Footer.tsx
  App.tsx                   # mounts Home immediately; IntroSequence overlays it until dismissed
```

### How the intro -> home transition works

Unlike the original two-page version (`landing.html` navigating to `index.html`, with a scroll-driven iframe
preview during the handoff), this is one SPA: `Home` is mounted for real from the start, and `IntroSequence` is
a `position: fixed` overlay on top of it. Scrolling (or touch/keyboard) grows a soft-edged hole in that overlay
via a CSS `mask-image`, revealing the real `Home` underneath — once the hole is big enough, the overlay
unmounts and scroll hands off to the normal page. No iframe, no page navigation.

## Deploying to Vercel

This project lives in the `mainframe/` subdirectory of a repo whose root is otherwise the old static site, so
when importing on Vercel:

1. Push this repo to GitHub (already the `origin` remote).
2. On [vercel.com](https://vercel.com), **Add New Project** → import `SukiCai/SukiCai.github.io`.
3. In the import screen, set **Root Directory** to `mainframe`. Framework preset (Vite) and build/output
   settings are auto-detected — no other config needed.
4. Deploy. Every push to `main` will auto-deploy; PRs get preview URLs for free.

Once you're happy with it, point your custom domain (or swap the GitHub Pages site) at the Vercel deployment.

Alternatively, from the CLI:

```bash
cd mainframe
npx vercel login   # one-time browser/email auth
npx vercel         # first run: link/create the project, deploy a preview
npx vercel --prod  # promote to production
```
