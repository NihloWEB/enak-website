/* ============================================================
   lightbox.js — Project overlay
   Clicking a [data-open="slug"] tile shows the matching
   .project panel (description + photo rails) in the overlay.
   Opens from the URL hash too (#proj-<slug>), so the home rail
   can deep-link into a project. Close on ✕ / backdrop / Escape.
   ============================================================ */

import { select, selectAll } from '../core/utils.js';

export function initLightbox() {
  const lightbox = select('[data-lightbox]');
  if (!lightbox) return;

  const panels = selectAll('.project', lightbox);
  const scroll = select('.lightbox__scroll', lightbox);

  const open = (slug) => {
    let matched = false;
    panels.forEach((p) => {
      const isMatch = p.dataset.panel === slug;
      p.hidden = !isMatch;
      if (isMatch) matched = true;
    });
    if (!matched) return;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (scroll) scroll.scrollTop = 0;
  };

  const close = () => {
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
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });

  // Deep-link: open from the hash on load (e.g. arriving from the home rail)
  if (location.hash.startsWith('#proj-')) open(location.hash.slice(6));
}
