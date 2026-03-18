// ============================================================
// Clifford Strange Attractor - Core rendering engine
// Direct pixel manipulation for density visualization
// ============================================================

import { AttractorParams } from './attractor-params.js';

const ACCENT_HUE = 42;
const POINTS_PER_FRAME = 150000;
const POINTS_PER_FRAME_MOBILE = 40000;

export class CliffordAttractor {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = null;
    this.params = new AttractorParams();
    this.width = 0;
    this.height = 0;
    this.running = false;
    this.frameId = null;
    this.isMobile = window.innerWidth < 768;
    this.pointsPerFrame = this.isMobile ? POINTS_PER_FRAME_MOBILE : POINTS_PER_FRAME;

    // Iteration state
    this.x = 0.1;
    this.y = 0.1;

    // Density buffer (accumulates hits per pixel)
    this.density = null;
    this.bufWidth = 0;
    this.bufHeight = 0;
    this.maxDensity = 1;
    this.frameCount = 0;

    // Param display elements
    this.paramEls = {
      a: document.getElementById('param-a'),
      b: document.getElementById('param-b'),
      c: document.getElementById('param-c'),
      d: document.getElementById('param-d'),
    };

    this._onResize = this._onResize.bind(this);
    this._frame = this._frame.bind(this);
  }

  init() {
    this._onResize();
    window.addEventListener('resize', this._onResize);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop();
      else this.start();
    });

    setTimeout(() => {
      const paramsEl = document.getElementById('attractor-params');
      if (paramsEl) paramsEl.classList.add('visible');
    }, 2000);

    this.start();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._frame();
  }

  stop() {
    this.running = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this._onResize);
  }

  setScrollProgress(t) {
    this.params.setScroll(t);
  }

  setMousePosition(nx, ny) {
    this.params.setMouse(nx, ny);
  }

  _onResize() {
    const parent = this.canvas.parentElement;
    const rect = parent.getBoundingClientRect();

    // Use half resolution for performance (still looks great)
    this.bufWidth = Math.floor(rect.width / 2);
    this.bufHeight = Math.floor(rect.height / 2);
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.bufWidth;
    this.canvas.height = this.bufHeight;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.canvas.style.imageRendering = 'auto';
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

    // Reset density buffer
    this.density = new Float32Array(this.bufWidth * this.bufHeight * 3); // R, G, B channels
    this.maxDensity = 1;
    this.frameCount = 0;

    this.isMobile = window.innerWidth < 768;
    this.pointsPerFrame = this.isMobile ? POINTS_PER_FRAME_MOBILE : POINTS_PER_FRAME;
  }

  _frame() {
    if (!this.running) return;

    this.params.update();
    this._iterate();
    this.frameCount++;

    // Render image every frame
    this._renderImage();
    this._updateParamDisplay();

    this.frameId = requestAnimationFrame(this._frame);
  }

  _iterate() {
    const { params, density, bufWidth, bufHeight } = this;
    const { a, b, c, d } = params;
    let { x, y } = this;

    // Scale to fill viewport, offset to center the attractor pattern
    const scale = Math.min(bufWidth, bufHeight) / 5;
    const offsetX = bufWidth / 2;
    const offsetY = bufHeight * 0.48;

    // Slowly decay the buffer for morphing effect
    if (this.frameCount % 3 === 0) {
      const decay = 0.997;
      for (let i = 0; i < density.length; i++) {
        density[i] *= decay;
      }
    }

    for (let i = 0; i < this.pointsPerFrame; i++) {
      const nx = Math.sin(a * y) - Math.cos(b * x);
      const ny = Math.sin(c * x) - Math.cos(d * y);
      x = nx;
      y = ny;

      const px = Math.floor(offsetX + x * scale);
      const py = Math.floor(offsetY + y * scale);

      if (px >= 0 && px < bufWidth && py >= 0 && py < bufHeight) {
        const idx = (py * bufWidth + px) * 3;
        // Color based on angle from origin
        const angle = Math.atan2(y, x);
        const t = (angle + Math.PI) / (2 * Math.PI); // 0 to 1

        // Warm gold palette: subtle amber to gold
        const r = 0.85 + t * 0.15;
        const g = 0.5 + Math.sin(t * Math.PI) * 0.2;
        const b_val = 0.1 + t * 0.1;

        density[idx]     += r * 0.7;
        density[idx + 1] += g * 0.7;
        density[idx + 2] += b_val * 0.7;

        const mag = density[idx] + density[idx + 1] + density[idx + 2];
        if (mag > this.maxDensity) this.maxDensity = mag;
      }
    }

    this.x = x;
    this.y = y;
  }

  _renderImage() {
    const { ctx, density, bufWidth, bufHeight, maxDensity } = this;
    const imageData = ctx.createImageData(bufWidth, bufHeight);
    const data = imageData.data;

    // Log-scale mapping for better dynamic range
    const logMax = Math.log(maxDensity + 1);

    for (let i = 0; i < bufWidth * bufHeight; i++) {
      const di = i * 3;
      const pi = i * 4;

      const r = density[di];
      const g = density[di + 1];
      const b = density[di + 2];
      const total = r + g + b;

      if (total > 0.01) {
        // Log-scale brightness
        const brightness = Math.log(total + 1) / logMax;
        const intensity = Math.pow(brightness, 0.55); // gamma correction

        // More subtle, ethereal rendering
        const mult = 1.8;
        data[pi]     = Math.min(255, Math.floor((r / total) * intensity * 255 * mult));
        data[pi + 1] = Math.min(255, Math.floor((g / total) * intensity * 255 * mult));
        data[pi + 2] = Math.min(255, Math.floor((b / total) * intensity * 255 * mult));
        data[pi + 3] = Math.min(255, Math.floor(intensity * 200 + 30));
      } else {
        // Background: very dark with slight blue tint
        data[pi]     = 5;
        data[pi + 1] = 5;
        data[pi + 2] = 8;
        data[pi + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  _updateParamDisplay() {
    if (this.frameCount % 5 !== 0) return; // throttle DOM updates
    const vals = this.params.getDisplayValues();
    for (const key of ['a', 'b', 'c', 'd']) {
      if (this.paramEls[key]) {
        this.paramEls[key].textContent = vals[key];
      }
    }
  }
}
