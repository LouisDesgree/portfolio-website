// ============================================================
// Voronoi Section Dividers
// Thin tessellation strips between sections
// ============================================================

import { hsl } from './canvas-utils.js';

const ACCENT_HUE = 220;
const NUM_SEEDS = 25;

export class VoronoiDivider {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = null;
    this.seeds = [];
    this.width = 0;
    this.height = 0;
    this.rendered = false;
  }

  init() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(dpr, dpr);

    // Generate seed points
    this.seeds = [];
    for (let i = 0; i < NUM_SEEDS; i++) {
      this.seeds.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.1,
      });
    }

    this.render();
  }

  render() {
    const { ctx, width, height, seeds } = this;
    ctx.clearRect(0, 0, width, height);

    // Draw edges using distance-field approach (simplified)
    // For each pixel row, find where nearest seed changes = edge
    const step = 2; // half resolution for performance
    for (let y = 0; y < height; y += step) {
      let prevNearest = -1;
      for (let x = 0; x < width; x += step) {
        let minDist = Infinity;
        let nearest = 0;
        for (let i = 0; i < seeds.length; i++) {
          const dx = x - seeds[i].x;
          const dy = y - seeds[i].y;
          const dist = dx * dx + dy * dy;
          if (dist < minDist) {
            minDist = dist;
            nearest = i;
          }
        }
        if (prevNearest !== -1 && nearest !== prevNearest) {
          // Edge detected - draw a dot
          ctx.fillStyle = hsl(ACCENT_HUE, 30, 25, 0.6);
          ctx.fillRect(x, y, 1, 1);
        }
        prevNearest = nearest;
      }
    }

    // Also scan vertically for better edge coverage
    for (let x = 0; x < width; x += step) {
      let prevNearest = -1;
      for (let y = 0; y < height; y += step) {
        let minDist = Infinity;
        let nearest = 0;
        for (let i = 0; i < seeds.length; i++) {
          const dx = x - seeds[i].x;
          const dy = y - seeds[i].y;
          const dist = dx * dx + dy * dy;
          if (dist < minDist) {
            minDist = dist;
            nearest = i;
          }
        }
        if (prevNearest !== -1 && nearest !== prevNearest) {
          ctx.fillStyle = hsl(ACCENT_HUE, 30, 25, 0.6);
          ctx.fillRect(x, y, 1, 1);
        }
        prevNearest = nearest;
      }
    }

    this.rendered = true;
  }
}

export function initAllVoronoiDividers() {
  const canvases = document.querySelectorAll('.voronoi-canvas');
  const dividers = [];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const divider = new VoronoiDivider(entry.target);
        divider.init();
        dividers.push(divider);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });

  canvases.forEach(c => observer.observe(c));
  return dividers;
}
