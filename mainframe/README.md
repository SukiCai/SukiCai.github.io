# Suki Cai — personal site

React/TypeScript/Vite/Tailwind rebuild of [sukicai.github.io](https://sukicai.github.io/). Same copy and
interactions as the original static site, with a full-screen felt-character hero that scrubs on mouse move.

## Stack

- **React 19** + **TypeScript**
- **Vite** for dev server / bundling
- **Tailwind CSS v4** (via `@tailwindcss/vite`) for the nav/hero; the rest of the page uses ported CSS in `src/index.css`
- **three.js** for the intro sequence's ambient landscape (lazy-loaded)

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
  data/content.ts          # all copy: nav, work, writing, life, contact
  lib/
    particleText.ts        # canvas text-to-particles (intro greeting)
    terminalInstall.ts      # terminal "install" typing/checklist
  hooks/
    useReveal.ts            # IntersectionObserver reveal-on-scroll
    useLifeSpread.ts         # hover-push for the life card fan
    useScrollMaskReveal.ts   # wheel/touch/key iris reveal, intro → home
    useTypewriter.ts         # hero typewriter
    useVideoScrub.ts         # maps pointer X to hero video time
  components/
    IntroSequence.tsx       # terminal → particle greeting → reveal into Home
    LandscapeScene.tsx       # three.js intro backdrop (code-split)
    BackgroundVideo.tsx      # full-screen character video
    Home.tsx                 # Nav + Hero + About + Work + Writing + Life + Contact + Footer
public/assets/hero/character.mp4
```

### Intro → home

`Home` is mounted from the start. `IntroSequence` is a fixed overlay; scrolling grows a CSS-mask hole
until the overlay unmounts.

## Deploying to Vercel

This app lives in the `mainframe/` subdirectory (the repo root is still the old GitHub Pages static site).

1. Import `SukiCai/SukiCai.github.io` on Vercel.
2. Set **Root Directory** to `mainframe`.
3. Deploy. Pushes to `main` auto-deploy.
