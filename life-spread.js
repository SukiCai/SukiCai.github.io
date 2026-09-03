/* ---------------- Life card spread (hand-fan of photos) ----------------
 * A hinged fan of cards: each ".life-arm" rotates around a shared pivot at
 * the bottom of the container, and the card inside it sits a fixed radius
 * out along that rotated axis. Hovering (or focusing) a card nudges its
 * neighbours' rotation outward, like pulling one card free of a hand of
 * cards. Entrance (closed -> fanned open) is driven purely by CSS, keyed
 * off the shared ".reveal" IntersectionObserver in script.js.
 */

(function () {
  const spread = document.querySelector('.life-spread');
  if (!spread) return;

  const arms = Array.from(spread.querySelectorAll('.life-arm'));
  if (!arms.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PUSH_REACH = 1;
  const PUSH_DEG = 4.5;

  function setPush(hoveredIndex) {
    arms.forEach((arm, i) => {
      const d = i - hoveredIndex;
      if (d === 0 || Math.abs(d) > PUSH_REACH) {
        arm.style.setProperty('--push', '0deg');
        return;
      }
      const falloff = 1 - (Math.abs(d) - 1) / PUSH_REACH;
      const amount = PUSH_DEG * falloff * Math.sign(d);
      arm.style.setProperty('--push', `${amount}deg`);
    });
  }

  function clearPush() {
    arms.forEach((arm) => arm.style.setProperty('--push', '0deg'));
  }

  if (!reducedMotion) {
    arms.forEach((arm, i) => {
      const card = arm.querySelector('.life-card');
      if (!card) return;
      card.addEventListener('mouseenter', () => setPush(i));
      card.addEventListener('focus', () => setPush(i));
      card.addEventListener('mouseleave', clearPush);
      card.addEventListener('blur', clearPush);
    });

    spread.addEventListener('mouseleave', clearPush);
  }
})();
