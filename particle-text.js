/* ---------------- Particle text engine (canvas text-to-particles) ----------------
 * Samples the glyphs of a hidden text node onto an offscreen canvas, then
 * animates a swarm of particles from a scattered start into that shape.
 * Shared by the portfolio hero name and the standalone landing greeting.
 */

function createParticleText(heading, canvas, options) {
  options = options || {};
  const reducedMotion =
    options.reducedMotion !== undefined
      ? options.reducedMotion
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const textEl = heading.querySelector('.particle-name-text');
  if (!textEl || !canvas.getContext) return { play() {}, retarget() {} };

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const INK = options.colors && options.colors.ink ? options.colors.ink : [20, 20, 20];
  const INK_SOFT = options.colors && options.colors.inkSoft ? options.colors.inkSoft : [85, 83, 77];
  const ACCENT = options.colors && options.colors.accent ? options.colors.accent : [47, 95, 219];
  const REPEL_RADIUS = options.repelRadius || 46;
  const density = options.density || 3;
  const sizeScale = options.sizeScale || 1;

  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let rafId = null;
  let startedAt = null;

  const MIN_PAD = 10; // baseline breathing room even when metrics agree
  let boxWidth = 1;
  let leftInset = 0; // how far the canvas's left edge sits left of the heading box

  function sampleTargets() {
    const rect = heading.getBoundingClientRect();
    const domWidth = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    boxWidth = domWidth;

    const cs = getComputedStyle(textEl);
    const text = textEl.textContent.trim();
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;

    // Canvas text metrics can drift from the DOM element's own layout width
    // (different shaping engine, no letter-spacing rounding, etc.), and that
    // drift compounds over a long string. Measure what canvas will actually
    // draw and size/center the raster around THAT, instead of assuming it
    // matches the DOM box — otherwise trailing characters can get clipped.
    const probe = document.createElement('canvas').getContext('2d');
    probe.font = font;
    if ('letterSpacing' in probe) probe.letterSpacing = cs.letterSpacing;
    const measuredWidth = probe.measureText(text).width;

    const contentWidth = Math.max(domWidth, measuredWidth);
    const canvasWidth = Math.ceil(contentWidth + MIN_PAD * 2);
    leftInset = (canvasWidth - domWidth) / 2;

    canvas.width = canvasWidth * dpr;
    canvas.height = height * dpr;
    canvas.style.left = `${-leftInset}px`;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = height + 'px';

    const off = document.createElement('canvas');
    off.width = canvas.width;
    off.height = canvas.height;
    const octx = off.getContext('2d');
    octx.scale(dpr, dpr);
    octx.textBaseline = 'middle';
    octx.font = font;
    if ('letterSpacing' in octx) octx.letterSpacing = cs.letterSpacing;
    octx.fillStyle = '#000';
    octx.fillText(text, (canvasWidth - measuredWidth) / 2, height / 2);

    // Scan every device pixel for ink (so thin strokes on small text are
    // never skipped by a coarse grid), then randomly thin the resulting
    // point cloud down to the desired particle density.
    const data = octx.getImageData(0, 0, off.width, off.height).data;
    const keepProbability = 1 / (density * density);
    const targets = [];
    for (let y = 0; y < off.height; y++) {
      for (let x = 0; x < off.width; x++) {
        const idx = (y * off.width + x) * 4;
        if (data[idx + 3] > 120 && Math.random() < keepProbability) {
          targets.push({ x: x / dpr - leftInset, y: y / dpr });
        }
      }
    }
    return targets;
  }

  function mix(c1, c2, t) {
    return [
      c1[0] + (c2[0] - c1[0]) * t,
      c1[1] + (c2[1] - c1[1]) * t,
      c1[2] + (c2[2] - c1[2]) * t,
    ];
  }

  // A smooth ink-to-soft gradient across the shape reads as a considered
  // material instead of random speckle, with the rare accent fleck kept
  // subtle (blended toward ink) so it reads as a glint, not a polka dot.
  function pickColor(target) {
    const isSparkle = Math.random() < 0.018;
    const tNorm = boxWidth > 0 ? target.x / boxWidth : 0.5;
    const t = Math.min(1, Math.max(0, tNorm + (Math.random() - 0.5) * 0.14));
    if (isSparkle) return { rgb: mix(ACCENT, INK, 0.2), sparkle: true };
    return { rgb: mix(INK, INK_SOFT, t), sparkle: false };
  }

  function makeParticle(target, scattered) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 130;
    const picked = pickColor(target);
    return {
      tx: target.x,
      ty: target.y,
      x: scattered ? target.x + Math.cos(angle) * dist : target.x,
      y: scattered ? target.y + Math.sin(angle) * dist : target.y,
      vx: 0,
      vy: 0,
      delay: scattered ? Math.random() * 420 : 0,
      size: (0.95 + Math.random() * 1.05) * sizeScale * (picked.sparkle ? 1.15 : 1),
      color: picked.rgb,
      alpha: 0.82 + Math.random() * 0.18,
      sparkle: picked.sparkle,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function draw(elapsed) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    for (const p of particles) {
      if (elapsed >= p.delay) {
        let tx = p.tx;
        let ty = p.ty;
        if (!reducedMotion) {
          tx += Math.sin(elapsed * 0.0011 + p.phase) * 1;
          ty += Math.cos(elapsed * 0.0013 + p.phase) * 1;

          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < REPEL_RADIUS && d > 0.01) {
            const force = ((REPEL_RADIUS - d) / REPEL_RADIUS) * 2.4;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }
        p.vx += (tx - p.x) * 0.09;
        p.vy += (ty - p.y) * 0.09;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;
      }

      const [r, g, b] = p.color;
      const cx = p.x + leftInset;

      // A faint halo beneath a crisp core reads as depth/sheen rather than
      // a flat, printed-looking dot — kept subtle so it doesn't turn into haze.
      ctx.beginPath();
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(p.sparkle ? 0.16 : 0.08) * p.alpha})`;
      ctx.arc(cx, p.y, p.size * (p.sparkle ? 2.1 : 1.6), 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
      ctx.arc(cx, p.y, p.size * 0.62, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function loop(now) {
    if (startedAt === null) startedAt = now;
    draw(now - startedAt);
    rafId = requestAnimationFrame(loop);
  }

  function init(scattered) {
    const targets = sampleTargets();
    if (scattered || particles.length === 0) {
      particles = targets.map((t) => makeParticle(t, !reducedMotion));
    } else {
      // Reflow (e.g. resize): retarget in place instead of replaying the reveal.
      while (particles.length < targets.length) {
        particles.push(makeParticle(targets[particles.length], false));
      }
      particles.length = targets.length;
      targets.forEach((t, i) => {
        particles[i].tx = t.x;
        particles[i].ty = t.y;
      });
    }
    heading.classList.add('has-particles');
    startedAt = null;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  heading.addEventListener('mousemove', (e) => {
    const rect = heading.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  heading.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => init(false), 200);
  });

  return {
    play() {
      init(true);
    },
    retarget() {
      init(false);
    },
  };
}
