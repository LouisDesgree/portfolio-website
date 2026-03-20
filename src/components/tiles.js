// ============================================================
// Tile expand/collapse system — GSAP-powered
// Click a tile -> orchestrated morph to fullscreen with depth
// Escape or X or backdrop click -> choreographed reverse
// ============================================================

import gsap from 'gsap';
import { trackTileOpen, trackTileClose, trackTileScrollDepth } from '../utils/analytics.js';

let currentExpanded = null;
let currentBackdrop = null;
let currentTileEl = null;
let expandTimeline = null;
let currentTileKey = null;
let tileOpenedAt = 0;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initTiles(expandedContentRenderers) {
  const tiles = document.querySelectorAll('[data-expand]');

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const key = tile.dataset.expand;
      if (expandedContentRenderers[key]) {
        expandTile(tile, key, expandedContentRenderers[key]);
      }
    });

    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const key = tile.dataset.expand;
        if (expandedContentRenderers[key]) {
          expandTile(tile, key, expandedContentRenderers[key]);
        }
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentExpanded) {
      closeTile('escape');
    }
  });
}

function expandTile(tileEl, key, renderContent) {
  if (expandTimeline?.isActive() || currentExpanded) return;
  currentTileKey = key;
  tileOpenedAt = performance.now();
  trackTileOpen(key);

  const rect = tileEl.getBoundingClientRect();
  currentTileEl = tileEl;
  tileEl.setAttribute('aria-expanded', 'true');

  const isMobile = window.innerWidth <= 768;
  const dur = prefersReducedMotion() ? 0.01 : 1;

  // Collect other tiles for depth effect
  const otherTiles = gsap.utils.toArray('.tile').filter(
    t => t !== tileEl && !t.classList.contains('tile--name')
  );

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'tile-backdrop';
  backdrop.addEventListener('click', () => closeTile('backdrop'));
  document.body.appendChild(backdrop);
  currentBackdrop = backdrop;

  // Create overlay at tile position
  const overlay = document.createElement('div');
  overlay.className = 'tile-expanded';
  overlay.style.top = rect.top + 'px';
  overlay.style.left = rect.left + 'px';
  overlay.style.width = rect.width + 'px';
  overlay.style.height = rect.height + 'px';

  // Close button (hidden initially)
  const closeBtn = document.createElement('button');
  closeBtn.className = 'tile-expanded-close';
  closeBtn.textContent = '\u2715 ESC';
  closeBtn.setAttribute('aria-label', 'Close expanded view');
  closeBtn.addEventListener('click', () => closeTile('button'));
  gsap.set(closeBtn, { opacity: 0, x: 20 });

  // Content container (hidden initially)
  const inner = document.createElement('div');
  inner.className = 'tile-expanded-inner';
  gsap.set(inner, { opacity: 0 });

  const result = renderContent();
  if (typeof result === 'string') {
    inner.innerHTML = result;
  } else {
    inner.innerHTML = result.html;
    if (result.onUnmount) {
      overlay._onUnmount = result.onUnmount;
    }
  }

  // Track scroll depth within expanded tile
  const scrollMilestones = new Set();
  inner.addEventListener('scroll', () => {
    const scrollHeight = inner.scrollHeight - inner.clientHeight;
    if (scrollHeight <= 0) return;
    const pct = Math.round((inner.scrollTop / scrollHeight) * 100);
    [25, 50, 75, 100].forEach(m => {
      if (pct >= m && !scrollMilestones.has(m)) {
        scrollMilestones.add(m);
        trackTileScrollDepth(key, m);
      }
    });
  }, { passive: true });

  overlay.appendChild(closeBtn);
  overlay.appendChild(inner);
  document.body.appendChild(overlay);
  currentExpanded = overlay;

  // Focus trap
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusable = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // === GSAP EXPAND TIMELINE ===
  expandTimeline = gsap.timeline({
    onComplete() {
      closeBtn.focus();
      // Fire onMount callback after animation settles
      if (typeof result !== 'string' && result.onMount) {
        result.onMount(inner);
      }
    },
  });

  // Phase 1: Departure — other tiles push back
  const depthProps = isMobile
    ? { scale: 0.96, opacity: 0.3, duration: 0.3 * dur, stagger: 0.015, ease: 'power2.inOut' }
    : { scale: 0.95, opacity: 0.4, filter: 'blur(3px)', duration: 0.35 * dur, stagger: 0.02, ease: 'power2.inOut' };

  expandTimeline.to(otherTiles, depthProps, 0);

  // Source tile fades out
  expandTimeline.to(tileEl, {
    opacity: 0,
    scale: 0.97,
    duration: 0.2 * dur,
    ease: 'power2.in',
  }, 0);

  // Backdrop fades in
  expandTimeline.to(backdrop, {
    opacity: 1,
    duration: 0.4 * dur,
    ease: 'power2.out',
  }, 0.1 * dur);

  // Phase 2: Morph overlay to fullscreen
  expandTimeline.to(overlay, {
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    borderRadius: 0,
    duration: 0.5 * dur,
    ease: 'power3.out',
  }, 0.12 * dur);

  // Phase 3: Content entrance
  expandTimeline.to(closeBtn, {
    opacity: 1,
    x: 0,
    duration: 0.3 * dur,
    ease: 'power2.out',
  }, 0.5 * dur);

  // Reveal inner container
  expandTimeline.to(inner, {
    opacity: 1,
    duration: 0.15 * dur,
  }, 0.45 * dur);

  // Stagger content children
  expandTimeline.add(() => {
    animateContentEntrance(inner, overlay, dur, isMobile);
  }, 0.5 * dur);
}

function closeTile(method = 'unknown') {
  if (!currentExpanded || expandTimeline?.isActive()) return;

  if (currentTileKey) {
    const duration = performance.now() - tileOpenedAt;
    trackTileClose(currentTileKey, method, duration);
  }

  const overlay = currentExpanded;
  const backdrop = currentBackdrop;
  const sourceTile = currentTileEl;
  const inner = overlay.querySelector('.tile-expanded-inner');
  const closeBtn = overlay.querySelector('.tile-expanded-close');

  // Cleanup callback
  if (overlay._onUnmount) overlay._onUnmount();
  if (overlay._scrollObserver) overlay._scrollObserver.disconnect();

  // Get source tile rect for morph-back
  const rect = sourceTile ? sourceTile.getBoundingClientRect() : null;

  const otherTiles = gsap.utils.toArray('.tile').filter(
    t => t !== sourceTile && !t.classList.contains('tile--name')
  );

  const isMobile = window.innerWidth <= 768;
  const dur = prefersReducedMotion() ? 0.01 : 1;

  expandTimeline = gsap.timeline({
    onComplete() {
      overlay.remove();
      if (backdrop) backdrop.remove();
      currentExpanded = null;
      currentBackdrop = null;
      expandTimeline = null;
      currentTileKey = null;

      if (sourceTile) {
        sourceTile.setAttribute('aria-expanded', 'false');
        sourceTile.focus();
        currentTileEl = null;
      }
    },
  });

  // Phase 1: Content fades out fast
  if (closeBtn) {
    expandTimeline.to(closeBtn, {
      opacity: 0, x: 20,
      duration: 0.12 * dur,
      ease: 'power2.in',
    }, 0);
  }

  if (inner) {
    expandTimeline.to(inner, {
      opacity: 0, y: -15,
      duration: 0.18 * dur,
      ease: 'power2.in',
    }, 0);
  }

  // Phase 2: Morph overlay back to tile
  if (rect) {
    expandTimeline.to(overlay, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      borderRadius: 14,
      duration: 0.4 * dur,
      ease: 'power3.inOut',
    }, 0.12 * dur);
  }

  // Backdrop fades out
  if (backdrop) {
    expandTimeline.to(backdrop, {
      opacity: 0,
      duration: 0.3 * dur,
      ease: 'power2.inOut',
    }, 0.15 * dur);
  }

  // Phase 3: Other tiles return
  const returnProps = isMobile
    ? { scale: 1, opacity: 1, duration: 0.35 * dur, stagger: 0.015, ease: 'power2.out' }
    : { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.4 * dur, stagger: 0.02, ease: 'power2.out' };

  expandTimeline.to(otherTiles, returnProps, 0.2 * dur);

  // Source tile fades back in
  if (sourceTile) {
    expandTimeline.to(sourceTile, {
      opacity: 1,
      scale: 1,
      duration: 0.3 * dur,
      ease: 'power2.out',
    }, 0.3 * dur);
  }
}

function animateContentEntrance(container, overlay, dur, isMobile) {
  if (prefersReducedMotion()) return;

  const stagger = isMobile ? 0.04 : 0.07;

  // Heading
  const heading = container.querySelector('.expanded-heading');
  if (heading) {
    gsap.from(heading, {
      y: 20, opacity: 0,
      duration: 0.4 * dur,
      ease: 'power2.out',
    });
  }

  // Subtitle
  const subtitle = container.querySelector('.expanded-subtitle');
  if (subtitle) {
    gsap.from(subtitle, {
      y: 15, opacity: 0,
      duration: 0.35 * dur,
      delay: 0.06,
      ease: 'power2.out',
    });
  }

  // Stagger targets — paragraphs, timeline items, cards
  const staggerTargets = container.querySelectorAll(
    '.expanded-paragraph, .exp-item, .project-expanded-card, .edu-card'
  );
  if (staggerTargets.length) {
    gsap.from(staggerTargets, {
      y: 25,
      opacity: 0,
      duration: 0.45 * dur,
      stagger,
      ease: 'power2.out',
    });
  }

  // Below-fold content: IntersectionObserver for scroll reveals
  const belowFold = container.querySelectorAll('.epitech-year, .edu-featured-project');
  if (belowFold.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.from(entry.target, {
            y: 20, opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
          });
          observer.unobserve(entry.target);
        }
      });
    }, { root: overlay, threshold: 0.1 });

    belowFold.forEach(el => observer.observe(el));
    overlay._scrollObserver = observer;
  }
}
