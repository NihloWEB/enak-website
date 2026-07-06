/* ============================================================
   lightbox.js — Project overlay
   Clicking a [data-open="slug"] tile shows the matching
   .project panel (description + photo spread) in the overlay.
   Clicking a spread photo zooms it near-fullscreen. Opens from
   the URL hash too (#proj-<slug>), so the home rail can
   deep-link into a project. Close on ✕ / backdrop / Escape
   (Escape closes the zoom first, then the lightbox).
   ============================================================ */

import { select, selectAll } from '../core/utils.js';

export function initLightbox() {
  const lightbox = select('[data-lightbox]');
  if (!lightbox) return;

  const panels = selectAll('.project', lightbox);
  const scroll = select('.lightbox__scroll', lightbox);
  const zoomview = select('[data-zoomview]', lightbox);
  const zoomImg = zoomview && select('img', zoomview);

  const open = (slug) => {
    const match = panels.find((p) => p.dataset.panel === slug);
    if (!match) return;
    panels.forEach((p) => { p.hidden = true; });
    void match.offsetWidth; // flush display:none so the fan-out replays on every open
    match.hidden = false;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (scroll) scroll.scrollTop = 0;
  };

  const closeZoom = () => {
    if (!zoomview) return;
    zoomview.classList.remove('is-open');
    zoomview.setAttribute('aria-hidden', 'true');
  };

  const openZoom = (src) => {
    if (!zoomview || !zoomImg) return;
    zoomImg.src = src;
    zoomview.classList.add('is-open');
    zoomview.setAttribute('aria-hidden', 'false');
  };

  const close = () => {
    closeZoom();
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (location.hash.startsWith('#proj-')) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  };

  selectAll('[data-open]').forEach((el) =>
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = el.dataset.open;
      open(slug);
      history.replaceState(null, '', '#proj-' + slug);
    })
  );

  selectAll('[data-lightbox-close]', lightbox).forEach((el) =>
    el.addEventListener('click', close)
  );

  // Photo spread → zoom
  selectAll('[data-zoom-src]', lightbox).forEach((btn) =>
    btn.addEventListener('click', () => openZoom(btn.dataset.zoomSrc))
  );
  if (zoomview) zoomview.addEventListener('click', closeZoom);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (zoomview && zoomview.classList.contains('is-open')) { closeZoom(); return; }
    if (lightbox.classList.contains('is-open')) close();
  });

  // Deep-link: open from the hash on load (e.g. arriving from the home rail)
  if (location.hash.startsWith('#proj-')) open(location.hash.slice(6));
}
