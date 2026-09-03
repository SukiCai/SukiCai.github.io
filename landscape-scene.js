// Ambient Three.js backdrop for the landing page — a soft, low-poly rolling
// terrain under a gradient dawn sky, with a few drifting motes of light and
// a gentle mouse-parallax. Inspired by threeui.com's "Landscape" scene, but
// built from scratch here (plain Three.js, no build step) and tuned down to
// sit quietly behind the terminal + greeting rather than compete with them.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

(function () {
  const canvas = document.getElementById('landscapeCanvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canParallax = window.matchMedia('(hover: hover)').matches && !prefersReducedMotion;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
  } catch (e) {
    return; // No WebGL: canvas simply stays invisible, page background shows through.
  }

  const HORIZON = '#fbfaf8'; // matches --bg — lets the far terrain melt into the page
  const ZENITH = '#e9eefb'; // faint dawn blue, close to --accent-soft

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(HORIZON, 3.5, 15);

  const skyTexture = (function makeSkyTexture() {
    const c = document.createElement('canvas');
    c.width = 2;
    c.height = 256;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, ZENITH);
    grad.addColorStop(0.62, '#f3efe8');
    grad.addColorStop(1, HORIZON);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  })();
  scene.background = skyTexture;

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const basePosition = new THREE.Vector3(0, 1.7, 7.5);
  const lookTarget = new THREE.Vector3(0, 1.05, 0);
  camera.position.copy(basePosition);
  camera.lookAt(lookTarget);

  scene.add(new THREE.HemisphereLight(0xeef2fb, 0xb9b09c, 1.05));
  const sun = new THREE.DirectionalLight(0xfff1de, 0.55);
  sun.position.set(6, 9, 4);
  scene.add(sun);

  // ---- Terrain -----------------------------------------------------------
  // Layered sine waves at a few incommensurate wavelengths, tuned so 2-3
  // gentle crests sit inside the visible frame rather than reading as one
  // big diagonal ramp.
  function terrainHeight(x, z) {
    return (
      Math.sin(x * 0.26 + 0.6) * Math.cos(z * 0.2 - 0.3) * 0.5 +
      Math.sin(x * 0.11 - z * 0.15 + 2.4) * 0.85 +
      Math.sin(x * 0.42 + z * 0.34) * 0.16
    );
  }

  const geometry = new THREE.PlaneGeometry(50, 36, 60, 44);
  geometry.rotateX(-Math.PI / 2);

  const pos = geometry.attributes.position;
  let minH = Infinity;
  let maxH = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const h = terrainHeight(pos.getX(i), pos.getZ(i));
    pos.setY(i, h);
    if (h < minH) minH = h;
    if (h > maxH) maxH = h;
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();

  const colorLow = new THREE.Color('#a89f8a'); // shadowed hollow, warm taupe
  const colorMist = new THREE.Color('#c3cbe2'); // faint dawn-blue mist, valleys only
  const colorHigh = new THREE.Color('#fbfaf8'); // sunlit ridge, matches --bg
  const colors = new Float32Array(pos.count * 3);
  const span = Math.max(maxH - minH, 0.0001);
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) - minH) / span;
    // Warm taupe -> cream across most of the range; the misty blue only
    // shows up as a brief whisper in the lowest ~18% (deepest hollows).
    const base = colorLow.clone().lerp(colorHigh, Math.min(t / 0.55, 1));
    const mistAmount = Math.max(0, 1 - t / 0.18) * 0.35;
    const c = base.lerp(colorMist, mistAmount);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const terrain = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0, fog: true })
  );
  terrain.position.y = -2.1;
  terrain.position.z = -6;
  scene.add(terrain);

  // ---- Drifting light motes -----------------------------------------------
  const MOTE_COUNT = 90;
  const moteGeom = new THREE.BufferGeometry();
  const motePos = new Float32Array(MOTE_COUNT * 3);
  const moteSpeed = new Float32Array(MOTE_COUNT);
  const moteBaseY = new Float32Array(MOTE_COUNT);
  const MOTE_Y_RANGE = 7.5;
  for (let i = 0; i < MOTE_COUNT; i++) {
    const x = (Math.random() - 0.5) * 34;
    const y = Math.random() * MOTE_Y_RANGE - 1.5;
    const z = (Math.random() - 0.5) * 24 - 2;
    motePos[i * 3] = x;
    motePos[i * 3 + 1] = y;
    motePos[i * 3 + 2] = z;
    moteBaseY[i] = y;
    moteSpeed[i] = 0.12 + Math.random() * 0.22;
  }
  moteGeom.setAttribute('position', new THREE.BufferAttribute(motePos, 3));

  const moteSprite = (function makeMoteSprite() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();

  const moteMaterial = new THREE.PointsMaterial({
    color: 0x6685e0,
    map: moteSprite,
    size: 0.16,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const motes = new THREE.Points(moteGeom, moteMaterial);
  scene.add(motes);

  // ---- Resize --------------------------------------------------------------
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // ---- Mouse parallax --------------------------------------------------------
  const targetParallax = { x: 0, y: 0 };
  const parallax = { x: 0, y: 0 };
  if (canParallax) {
    window.addEventListener('mousemove', (e) => {
      targetParallax.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetParallax.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  // ---- Render loop -----------------------------------------------------------
  const clock = new THREE.Clock();
  let rafId = null;

  function renderFrame() {
    const dt = Math.min(clock.getDelta(), 0.05);

    if (canParallax) {
      parallax.x += (targetParallax.x - parallax.x) * 0.04;
      parallax.y += (targetParallax.y - parallax.y) * 0.04;
      camera.position.x = basePosition.x + parallax.x * 1.1;
      camera.position.y = basePosition.y - parallax.y * 0.5;
      camera.lookAt(lookTarget);
    }

    if (!prefersReducedMotion) {
      const mp = motes.geometry.attributes.position;
      for (let i = 0; i < MOTE_COUNT; i++) {
        let y = mp.getY(i) + moteSpeed[i] * dt;
        if (y > moteBaseY[i] + MOTE_Y_RANGE) y = moteBaseY[i] - MOTE_Y_RANGE * 0.15;
        mp.setY(i, y);
      }
      mp.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  function loop() {
    renderFrame();
    rafId = prefersReducedMotion ? null : requestAnimationFrame(loop);
  }

  renderFrame();
  canvas.classList.add('is-ready');
  if (!prefersReducedMotion) {
    rafId = requestAnimationFrame(loop);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!rafId) {
        clock.getDelta(); // drop the paused-time delta
        rafId = requestAnimationFrame(loop);
      }
    });
  }
})();
