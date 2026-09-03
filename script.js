const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Reveal on scroll ---------------- */

const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach((el) => observer.observe(el));

/* ---------------- Hero cursor-tracking glow ---------------- */

const hero = document.querySelector('.hero');
const spot = document.querySelector('.hero-spot');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (hero && spot && canHover && !prefersReducedMotion) {
  let ticking = false;
  let lastEvent = null;

  hero.addEventListener('mousemove', (e) => {
    lastEvent = e;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        spot.style.setProperty('--mx', `${lastEvent.clientX - rect.left}px`);
        spot.style.setProperty('--my', `${lastEvent.clientY - rect.top}px`);
        ticking = false;
      });
    }
  });
}

/* ---------------- Particle name (canvas text-to-particles) ---------------- */

(function () {
  const heading = document.getElementById('nameHeading');
  const canvas = document.getElementById('nameCanvas');
  if (!heading || !canvas || typeof createParticleText === 'undefined') return;

  const particleName = createParticleText(heading, canvas, { reducedMotion: prefersReducedMotion });
  const start = () => particleName.play();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start).catch(start);
  } else {
    start();
  }
})();

/* ---------------- Logo mark (Lottie sparkle) ---------------- */

(function () {
  const el = document.getElementById('logoMark');
  if (!el || typeof lottie === 'undefined') return;

  const anim = lottie.loadAnimation({
    container: el,
    renderer: 'svg',
    loop: !prefersReducedMotion,
    autoplay: true,
    path: 'spark.json',
  });

  if (prefersReducedMotion) {
    // Settle on a single, still frame instead of a continuous spin/pulse.
    anim.addEventListener('DOMLoaded', () => anim.goToAndStop(0, true));
  }
})();

/* ---------------- Terminal install animation ---------------- */

(function () {
  const cmdEl = document.getElementById('termCmd');
  const cursorEl = document.getElementById('termCursor');
  const outputEl = document.getElementById('termOutput');
  if (!cmdEl || !cursorEl || !outputEl || typeof runTerminalInstall === 'undefined') return;

  runTerminalInstall({
    cmdEl,
    cursorEl,
    outputEl,
    command: 'npx install-suki',
    reducedMotion: prefersReducedMotion,
    startDelay: 1300,
    trailingPrompt: true,
    lines: [
      { type: 'dim', text: 'resolving dependencies...' },
      { type: 'check', text: 'backend-systems@production-grade' },
      { type: 'check', text: 'systems-architecture@source-of-truth' },
      { type: 'check', text: 'ai-assisted-engineering@claude-code' },
      { type: 'check', text: 'underwriting-rebuild (2mo, replaces 3yr build)' },
      { type: 'muted', text: 'added 1 engineer in 0.8s' },
      { type: 'success', text: '✓ Suki Cai installed successfully' },
    ],
  });
})();

/* ---------------- Nav scrollspy ---------------- */

const navLinks = document.querySelectorAll('[data-nav]');
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (sections.length && navLinks.length) {
  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}
