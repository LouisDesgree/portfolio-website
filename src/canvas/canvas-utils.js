// ============================================================
// Canvas utilities - HiDPI, resize, color math
// ============================================================

export function setupCanvas(canvas, container) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, width: rect.width, height: rect.height, dpr };
}

export function onResize(canvas, container, callback) {
  const observer = new ResizeObserver(() => {
    const result = setupCanvas(canvas, container);
    callback(result);
  });
  observer.observe(container);
  return observer;
}

/** HSL to CSS string */
export function hsl(h, s, l, a = 1) {
  if (a < 1) return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  return `hsl(${h}, ${s}%, ${l}%)`;
}
