/* ============================================================
   filter.js — Showcase project filtering
   Filter chips ([data-filter="key"]) toggle which tiles
   ([data-category="key"]) are shown. "all" shows everything.
   ============================================================ */

import { select, selectAll } from '../core/utils.js';

export function initFilters() {
  const bar = select('[data-filters]');
  const grid = select('[data-project-grid]');
  if (!bar || !grid) return;

  const chips = selectAll('.filter-chip', bar);
  const tiles = selectAll('[data-category]', grid);

  const apply = (key) => {
    chips.forEach((c) => {
      const active = c.dataset.filter === key;
      c.classList.toggle('is-active', active);
      c.setAttribute('aria-selected', String(active));
    });
    tiles.forEach((t) => {
      const show = key === 'all' || t.dataset.category === key;
      t.classList.toggle('is-hidden', !show);
    });
  };

  chips.forEach((c) => c.addEventListener('click', () => apply(c.dataset.filter)));
}
