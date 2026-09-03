const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, prefersReducedMotion ? 0 : ms));

(async function () {
  const stage = document.getElementById('landingStage');
  const cmdEl = document.getElementById('termCmd');
  const cursorEl = document.getElementById('termCursor');
  const outputEl = document.getElementById('termOutput');
  const greetHeading = document.getElementById('greetHeading');
  const greetCanvas = document.getElementById('greetCanvas');
  const signatureHeading = document.getElementById('signatureHeading');
  const signatureCanvas = document.getElementById('signatureCanvas');
  const enterLink = document.getElementById('landingEnter');
  const maskReveal = document.getElementById('maskReveal');
  const maskRevealFrame = document.getElementById('maskRevealFrame');

  if (!stage || !cmdEl || !cursorEl || !outputEl) return;

  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {
      /* proceed with fallback font metrics */
    }
  }

  if (typeof runTerminalInstall === 'function') {
    await runTerminalInstall({
      cmdEl,
      cursorEl,
      outputEl,
      command: 'npx install-suki',
      reducedMotion: prefersReducedMotion,
      startDelay: 500,
      trailingPrompt: false,
      lines: [
        { type: 'dim', text: 'resolving dependencies...' },
        { type: 'check', text: 'backend-systems@production-grade' },
        { type: 'check', text: 'systems-architecture@source-of-truth' },
        { type: 'check', text: 'ai-assisted-engineering@claude-code' },
        { type: 'muted', text: 'added 1 engineer in 0.8s' },
        { type: 'success', text: '✓ Suki Cai installed successfully' },
      ],
    });
  }

  await delay(650);

  // Sample + start both particle clouds *before* the greeting is ever
  // revealed. The container is still opacity:0 here, so nothing is visible
  // yet — this guarantees there's never a frame where the flat, non-particle
  // text is shown once the crossfade begins (which is what caused the
  // "not a particle for a second" glitch). By the time we fade the
  // container in, the particles are already mid-flight, so the reveal reads
  // as one continuous motion: dust fades in and gathers into the words.
  let greet = null;
  let signature = null;

  if (typeof createParticleText === 'function' && greetHeading && greetCanvas) {
    greet = createParticleText(greetHeading, greetCanvas, {
      reducedMotion: prefersReducedMotion,
      density: 1.2,
      sizeScale: 0.7,
    });
    greet.play();
  }

  await delay(180);

  if (typeof createParticleText === 'function' && signatureHeading && signatureCanvas) {
    signature = createParticleText(signatureHeading, signatureCanvas, { reducedMotion: prefersReducedMotion });
    signature.play();
  }

  // Both canvases are already hidden-text/particles-on at this point, so the
  // crossfade below only ever reveals particles, never flat text.
  await delay(prefersReducedMotion ? 0 : 120);
  stage.classList.add('is-greeting');

  await delay(1350);
  if (enterLink) enterLink.classList.add('is-visible');

  // Scrolling (or a wheel/touch/arrow-key nudge) from here on grows a soft
  // iris that reveals a live preview of index.html, then hands off to a
  // real navigation once it's fully open. Reduced-motion / no-JS visitors
  // still have the plain link (now doubling as the scroll hint) as an
  // immediate way in.
  if (!prefersReducedMotion && maskReveal && maskRevealFrame && typeof createScrollMaskTransition === 'function') {
    const transition = createScrollMaskTransition({
      container: maskReveal,
      frameEl: maskRevealFrame,
      targetHref: 'index.html',
    });
    transition.enable();
  }
})();
