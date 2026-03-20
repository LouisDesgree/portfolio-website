// ============================================================
// Tile expand/collapse system
// Click a tile -> backdrop overlay + fullscreen overlay with content
// Escape or X or backdrop click -> returns to dashboard
// ============================================================

let currentExpanded = null;
let currentBackdrop = null;
let currentTileEl = null;
let isAnimating = false;

export function initTiles(expandedContentRenderers) {
  const tiles = document.querySelectorAll('[data-expand]');

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const key = tile.dataset.expand;
      if (expandedContentRenderers[key]) {
        expandTile(tile, key, expandedContentRenderers[key]);
      }
    });

    // Keyboard accessibility: Enter or Space triggers expand
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

  // Escape key closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentExpanded) {
      closeTile();
    }
  });
}

function expandTile(tileEl, key, renderContent) {
  if (currentExpanded || isAnimating) return;
  isAnimating = true;

  const rect = tileEl.getBoundingClientRect();

  // Track which tile opened the overlay
  currentTileEl = tileEl;
  tileEl.setAttribute('aria-expanded', 'true');
  tileEl.classList.add('tile--expanding');

  // Create backdrop overlay
  const backdrop = document.createElement('div');
  backdrop.className = 'tile-backdrop';
  backdrop.addEventListener('click', closeTile);
  document.body.appendChild(backdrop);
  currentBackdrop = backdrop;

  // Trigger backdrop fade-in
  requestAnimationFrame(() => {
    backdrop.classList.add('visible');
  });

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'tile-expanded';
  overlay.style.top = rect.top + 'px';
  overlay.style.left = rect.left + 'px';
  overlay.style.width = rect.width + 'px';
  overlay.style.height = rect.height + 'px';

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'tile-expanded-close';
  closeBtn.textContent = '\u2715 ESC';
  closeBtn.setAttribute('aria-label', 'Close expanded view');
  closeBtn.addEventListener('click', closeTile);

  // Content container
  const inner = document.createElement('div');
  inner.className = 'tile-expanded-inner';
  const result = renderContent();
  if (typeof result === 'string') {
    inner.innerHTML = result;
  } else {
    inner.innerHTML = result.html;
    if (result.onUnmount) {
      overlay._onUnmount = result.onUnmount;
    }
    if (result.onMount) {
      // Schedule mount callback after DOM insertion
      requestAnimationFrame(() => result.onMount(inner));
    }
  }

  overlay.appendChild(closeBtn);
  overlay.appendChild(inner);
  document.body.appendChild(overlay);

  currentExpanded = overlay;

  // Simple focus trap: keep focus within the expanded overlay
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

  // Animate to full screen
  requestAnimationFrame(() => {
    overlay.classList.add('full');
    // Focus close button after expand animation completes
    setTimeout(() => {
      closeBtn.focus();
      isAnimating = false;
      tileEl.classList.remove('tile--expanding');
    }, 500);
  });
}

function closeTile() {
  if (!currentExpanded || isAnimating) return;
  isAnimating = true;
  const overlay = currentExpanded;
  const backdrop = currentBackdrop;
  const sourceTile = currentTileEl;

  // Run cleanup callback if set
  if (overlay._onUnmount) overlay._onUnmount();

  overlay.classList.remove('full');
  if (backdrop) backdrop.classList.remove('visible');

  // Update ARIA on source tile
  if (sourceTile) {
    sourceTile.setAttribute('aria-expanded', 'false');
  }

  // Remove after animation
  setTimeout(() => {
    overlay.remove();
    if (backdrop) backdrop.remove();
    currentExpanded = null;
    currentBackdrop = null;
    isAnimating = false;

    // Return focus to the source tile
    if (sourceTile) {
      sourceTile.focus();
      currentTileEl = null;
    }
  }, 500);
}
