/* ---------------- Scroll-mask page transition ----------------
 * Inspired by React Bits Pro's "Scroll Mask": scrolling (or a wheel/touch/
 * key gesture) grows a soft-edged iris that reveals a live preview of the
 * destination page underneath, then hands off to a real navigation once
 * fully open. The landing page itself is never scrollable content — this
 * repurposes scroll *input* as a progress control for the transition.
 */

function createScrollMaskTransition(options) {
  const {
    container,
    frameEl,
    targetHref,
    scrollLength = window.innerHeight * 1.6,
    smooth = 0.16,
    settle = 0.96,
  } = options;

  if (!container || !frameEl || !targetHref) return { enable() {}, disable() {} };

  let enabled = false;
  let navigated = false;
  let frameLoading = false;
  let progress = 0;
  let target = 0;
  let rafId = null;
  let touchStartY = null;

  function ensureFrame() {
    if (frameLoading) return;
    frameLoading = true;
    frameEl.src = targetHref;
  }

  function render(p) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxRadius = Math.hypot(vw, vh) / 2 + 24;
    const feather = Math.max(28, maxRadius * 0.1);
    const radius = p * maxRadius;

    container.style.setProperty('--mask-radius', `${radius}px`);
    container.style.setProperty('--mask-feather', `${feather}px`);
    container.style.setProperty('--mask-scrim', `${Math.max(0, 0.32 * (1 - p / 0.55))}`);
    container.style.setProperty('--mask-zoom', `${1.1 - 0.1 * Math.min(1, p / 0.75)}`);
    container.style.opacity = p > 0.002 ? '1' : '0';
  }

  function tick() {
    progress += (target - progress) * smooth;
    if (Math.abs(target - progress) < 0.0008) progress = target;
    render(progress);

    if (progress >= settle && !navigated) {
      navigated = true;
      window.location.href = targetHref;
      rafId = null;
      return;
    }

    if (progress !== target) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  function nudge(deltaPx) {
    if (!enabled || navigated) return;
    target = Math.min(1, Math.max(0, target + deltaPx / scrollLength));
    if (target > 0.01) ensureFrame();
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function onWheel(e) {
    if (!enabled) return;
    // Keep swallowing wheel input even once navigation has fired, so trailing
    // events from a fast scroll can't leak through and scroll the page we're
    // navigating away from during the brief handoff window.
    e.preventDefault();
    if (navigated) return;
    nudge(e.deltaY);
  }

  function onTouchStart(e) {
    touchStartY = e.touches && e.touches.length ? e.touches[0].clientY : null;
  }

  function onTouchMove(e) {
    if (!enabled || touchStartY === null) return;
    e.preventDefault();
    const y = e.touches[0].clientY;
    if (!navigated) nudge((touchStartY - y) * 2.4);
    touchStartY = y;
  }

  function onKeydown(e) {
    if (!enabled || navigated) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      nudge(scrollLength * 0.32);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      nudge(scrollLength * -0.32);
    }
  }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('keydown', onKeydown);

  return {
    enable() {
      enabled = true;
    },
    disable() {
      enabled = false;
    },
  };
}
