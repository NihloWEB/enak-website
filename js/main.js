/* ============================================================
   main.js — EN/AK entry point
   Imports every module and initialises it on DOM ready. Each init
   is a no-op when its target markup isn't on the page, so the same
   bundle drives the landing page and every subpage.
   ============================================================ */

import { ready } from './core/utils.js';
import { initI18n } from './core/i18n.js';

import { initReveal } from './effects/reveal.js';
import { initParallax } from './effects/parallax.js';
import { initHero } from './effects/hero.js';
import { initTextReveal } from './effects/text-reveal.js';
import { initHorizontal } from './effects/horizontal.js';

import { initNav } from './components/nav.js';
import { initCursor } from './components/cursor.js';
import { initMagnetic } from './components/magnetic.js';
import { initTilt } from './components/tilt.js';
import { initSelector } from './components/selector.js';
import { initCounters } from './components/counters.js';
import { initFilters } from './components/filter.js';
import { initLightbox } from './components/lightbox.js';

ready(() => {
  // i18n + navigation first (structure / chrome)
  initI18n();
  initNav();

  // entrance + scroll-driven effects
  initReveal();
  initParallax();
  initHero();
  initTextReveal();
  initHorizontal();

  // pointer-driven flourishes
  initCursor();
  initMagnetic();
  initTilt();

  // interactive widgets
  initSelector();
  initCounters();
  initFilters();
  initLightbox();

  // Year stamp(s)
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
