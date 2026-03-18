// ============================================================
// Tile expand/collapse system
// Click a tile -> backdrop overlay + fullscreen overlay with content
// Escape or X or backdrop click -> returns to dashboard
// ============================================================

let currentExpanded = null;
let currentBackdrop = null;

export function initTiles(expandedContentRenderers) {
  const tiles = document.querySelectorAll('[data-expand]');

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const key = tile.dataset.expand;
      if (expandedContentRenderers[key]) {
        expandTile(tile, key, expandedContentRenderers[key]);
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
  if (currentExpanded) return;

  const rect = tileEl.getBoundingClientRect();

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
  closeBtn.addEventListener('click', closeTile);

  // Content container
  const inner = document.createElement('div');
  inner.className = 'tile-expanded-inner';
  inner.innerHTML = renderContent();

  overlay.appendChild(closeBtn);
  overlay.appendChild(inner);
  document.body.appendChild(overlay);

  currentExpanded = overlay;

  // Animate to full screen
  requestAnimationFrame(() => {
    overlay.classList.add('full');
  });
}

function closeTile() {
  if (!currentExpanded) return;
  const overlay = currentExpanded;
  const backdrop = currentBackdrop;

  overlay.classList.remove('full');
  if (backdrop) backdrop.classList.remove('visible');

  // Remove after animation
  setTimeout(() => {
    overlay.remove();
    if (backdrop) backdrop.remove();
    currentExpanded = null;
    currentBackdrop = null;
  }, 500);
}
