/* ============================================================
   book.js — About-page 3D book (three.js)
   A pinned book whose leaves turn as you scroll; each right-hand
   page is rendered from the .book-page source elements (so it stays
   bilingual + CMS-editable). Glossy, monochrome, no figure.
   Lazy-loaded only when WebGL is available and motion is allowed;
   otherwise the .book-pages fallback (plain editorial text) shows.
   ============================================================ */

import * as THREE from '../vendor/three.module.js';

const PAGE_W = 3.4;
const PAGE_H = 4.5;
const EASE = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* Flat, crisp page material (first-version look — matte black, no gloss). */
function pageMaterial(tex) {
  return new THREE.MeshBasicMaterial({ map: tex, transparent: true });
}

export function initBook(section) {
  const canvas = section.querySelector('[data-book-canvas]');
  const pageEls = [...section.querySelectorAll('.book-page')];
  if (!canvas || !pageEls.length) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  section.classList.add('is-3d');

  // ---- Text page → texture ----------------------------------------
  function pageTexture(el, index) {
    const c = document.createElement('canvas');
    c.width = 820; c.height = 1085;
    const g = c.getContext('2d');
    const grd = g.createLinearGradient(0, 0, 0, c.height);
    grd.addColorStop(0, '#14151c'); grd.addColorStop(1, '#0a0b0f');
    g.fillStyle = grd; g.fillRect(0, 0, c.width, c.height);
    // spine shadow
    const sh = g.createLinearGradient(0, 0, 100, 0);
    sh.addColorStop(0, 'rgba(0,0,0,0.55)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = sh; g.fillRect(0, 0, 100, c.height);
    // inner border
    g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 2;
    g.strokeRect(64, 64, c.width - 128, c.height - 128);

    const get = (r) => (el.querySelector('[data-role=' + r + ']')?.textContent || '').trim();
    const eyebrow = get('eyebrow'), title = get('title'), body = get('body');
    const M = 130; let y = 240;

    g.textBaseline = 'alphabetic';
    if (eyebrow) {
      g.fillStyle = 'rgba(245,246,248,0.55)';
      g.font = '600 32px "Lineal", system-ui, sans-serif';
      g.fillText(spaced(eyebrow.toUpperCase()), M, y);
      y += 70;
    }
    if (title) {
      g.fillStyle = '#f7f8fa';
      g.font = '800 96px "Lineal", system-ui, sans-serif';
      y = wrap(g, title, M, y + 30, c.width - M * 2, 100);
      g.strokeStyle = 'rgba(255,255,255,0.2)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(M, y + 28); g.lineTo(c.width - M, y + 28); g.stroke();
      y += 92;
    }
    if (body) {
      g.fillStyle = 'rgba(245,246,248,0.78)';
      g.font = '400 41px "Lineal", system-ui, sans-serif';
      wrap(g, body, M, y, c.width - M * 2, 58);
    }
    g.fillStyle = 'rgba(245,246,248,0.4)';
    g.font = '600 28px "Lineal", system-ui, sans-serif';
    g.fillText(String(index + 1).padStart(2, '0'), M, c.height - 100);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = maxAniso;
    return tex;
  }

  function backTexture() {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 683;
    const g = c.getContext('2d');
    const grd = g.createLinearGradient(0, 0, 0, c.height);
    grd.addColorStop(0, '#0a0b10'); grd.addColorStop(1, '#050609');
    g.fillStyle = grd; g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = 'rgba(255,255,255,0.06)'; g.lineWidth = 2;
    g.strokeRect(40, 40, c.width - 80, c.height - 80);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function spaced(s) { return s.split('').join(' '); }
  function wrap(g, text, x, y, maxW, lh) {
    const words = text.split(/\s+/);
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (g.measureText(t).width > maxW && line) { g.fillText(line, x, y); line = w; y += lh; }
      else line = t;
    }
    if (line) { g.fillText(line, x, y); y += lh; }
    return y;
  }

  // ---- Book: leaves hinged at the spine ---------------------------
  const book = new THREE.Group();
  scene.add(book);
  const backTex = backTexture();
  const leaves = [];

  function buildLeaves() {
    leaves.forEach((l) => book.remove(l.group));
    leaves.length = 0;
    const geo = new THREE.PlaneGeometry(PAGE_W, PAGE_H); // centred; spine = the group
    pageEls.forEach((el, i) => {
      const group = new THREE.Group();
      const front = new THREE.Mesh(geo, pageMaterial(pageTexture(el, i)));
      front.position.set(PAGE_W / 2, 0, 0.006);
      const back = new THREE.Mesh(geo, pageMaterial(backTex));
      back.position.set(PAGE_W / 2, 0, -0.006);
      back.rotation.y = Math.PI;
      group.add(front, back);
      group.position.set(0, 0, (pageEls.length - i) * 0.011);
      book.add(group);
      leaves.push({ group });
    });
  }
  buildLeaves();

  // cover backing
  const base = new THREE.Mesh(
    new THREE.PlaneGeometry(PAGE_W + 0.24, PAGE_H + 0.24).translate(PAGE_W / 2, 0, 0),
    new THREE.MeshBasicMaterial({ color: 0x05060a })
  );
  base.position.z = -0.03;
  book.add(base);

  book.rotation.x = -0.54;
  book.position.set(-1.7, -0.15, 0);

  // ---- Layout / resize -------------------------------------------
  function resize() {
    const r = section.querySelector('.book-sticky').getBoundingClientRect();
    const w = r.width || window.innerWidth, h = r.height || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 760 ? 44 : 33;
    camera.updateProjectionMatrix();
  }
  camera.position.set(0.1, 0.1, 6.8);
  camera.lookAt(0.05, -0.05, 0);
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ---- Scroll → progress, render while visible -------------------
  let target = 0, current = 0, visible = false;
  const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) tick(); }, { threshold: 0 });
  io.observe(section);

  function progress() {
    const rect = section.getBoundingClientRect();
    const dist = section.offsetHeight - window.innerHeight;
    return clamp(-rect.top / dist, 0, 1);
  }

  function tick() {
    target = progress();
    current = lerp(current, target, 0.13);
    const N = leaves.length;
    const flipped = current * (N - 1); // end on the last content page (no blank trailing page)
    leaves.forEach((l, i) => {
      const t = EASE(clamp(flipped - i, 0, 1));
      l.group.rotation.y = -t * Math.PI;
      l.group.position.y = Math.sin(t * Math.PI) * 0.14;
    });
    camera.position.x = 0.1 + Math.sin(current * Math.PI) * 0.28;
    camera.lookAt(0.05, -0.05, 0);
    renderer.render(scene, camera);
    if (visible) requestAnimationFrame(tick);
  }
  tick();

  document.addEventListener('langchange', () => {
    (document.fonts?.ready || Promise.resolve()).then(() => buildLeaves());
  });
}
