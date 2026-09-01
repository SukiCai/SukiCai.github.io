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
