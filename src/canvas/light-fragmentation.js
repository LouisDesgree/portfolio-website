// ============================================================
// Abstract Lineal Mesh — Parametric ribbon curves
// Flowing 3D Lissajous ribbons projected to 2D with mesh grid.
// Vivid pink/purple/magenta palette on dark background.
// ============================================================

export class LightFragmentation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.running = false;
    this.frameId = null;
    this.time = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollOffset = 0;
    this.isMobile = window.innerWidth < 768;
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

  setMousePosition(nx, ny) {
    this.mouseX = nx;
    this.mouseY = ny;
  }

  setScrollProgress(t) {
    this.scrollOffset = t;
  }

  _onResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parent = this.canvas.parentElement || document.body;
    const rect = parent.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    const scale = this.isMobile ? 0.5 : 0.75;
    this.canvas.width = Math.floor(this.width * scale);
    this.canvas.height = Math.floor(this.height * scale);
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(scale, scale);
    this.isMobile = window.innerWidth < 768;
  }

  _frame() {
    if (!this.running) return;
    this.time += 0.003;
    this._draw();
    this.frameId = requestAnimationFrame(this._frame);
  }

  _hsl(h, s, l, a) {
    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }

  // 3D parametric point on a toroidal ribbon
  _ribbonPoint(u, v, t) {
    // Torus-knot inspired parametric surface
    const p = 2, q = 3; // knot winding numbers
    const R = 1.2; // major radius
    const r = 0.4 + v * 0.3; // minor radius varies with v

    const phi = u * Math.PI * 2 * p + t * 0.5;
    const theta = u * Math.PI * 2 * q + t * 0.3;

    // Mouse reactivity — subtle warp
    const mx = this.mouseX * 0.15;
    const my = this.mouseY * 0.15;

    const x = (R + r * Math.cos(theta + mx)) * Math.cos(phi);
    const y = (R + r * Math.cos(theta + mx)) * Math.sin(phi);
    const z = r * Math.sin(theta + my) + Math.sin(u * Math.PI * 4 + t) * 0.2;

    return { x, y, z };
  }

  // Simple 3D → 2D projection
  _project(x, y, z) {
    const fov = 2.5;
    const dist = fov + z * 0.3;
    const scale = Math.min(this.width, this.height) * 0.45;
    return {
      px: this.width / 2 + (x / dist) * scale,
      py: this.height / 2 + (y / dist) * scale,
      depth: z
    };
  }

  _draw() {
    const { ctx, width, height, time } = this;

    // Dark gradient background — deep navy
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#060a14');
    bgGrad.addColorStop(0.5, '#080c1a');
    bgGrad.addColorStop(1, '#0a0e1e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const ribbonCount = this.isMobile ? 2 : 4;
    const linesPerRibbon = this.isMobile ? 30 : 55;
    const segments = this.isMobile ? 100 : 180;

    for (let ribbon = 0; ribbon < ribbonCount; ribbon++) {
      const ribbonPhase = ribbon * 2.1 + time * 0.2;
      const ribbonRotY = ribbon * 0.8 + Math.sin(time * 0.15 + ribbon) * 0.3;

      for (let line = 0; line < linesPerRibbon; line++) {
        const v = line / linesPerRibbon; // 0 → 1 across ribbon width
        const lineAlpha = 0.18 + 0.3 * Math.sin(v * Math.PI); // brighter at center

        // Color: white → light blue → royal blue
        const hue = 210 + v * 30 + ribbon * 15 + Math.sin(time + ribbon) * 10;
        const sat = 30 + v * 50; // low sat (white) at edges, higher (blue) at center
        const lit = 70 - v * 30 + Math.sin(time * 0.5 + line * 0.2) * 8; // bright white → royal blue

        ctx.beginPath();
        let firstPoint = true;

        for (let seg = 0; seg <= segments; seg++) {
          const u = seg / segments;
          const pt = this._ribbonPoint(u, v, time + ribbonPhase);

          // Rotate around Y axis for variety between ribbons
          const cosR = Math.cos(ribbonRotY);
          const sinR = Math.sin(ribbonRotY);
          const rx = pt.x * cosR - pt.z * sinR;
          const rz = pt.x * sinR + pt.z * cosR;

          // Scroll offset tilts the view
          const tilt = this.scrollOffset * 0.3;
          const cosT = Math.cos(tilt);
          const sinT = Math.sin(tilt);
          const ry = pt.y * cosT - rz * sinT;
          const rz2 = pt.y * sinT + rz * cosT;

          const proj = this._project(rx, ry, rz2);

          if (firstPoint) {
            ctx.moveTo(proj.px, proj.py);
            firstPoint = false;
          } else {
            ctx.lineTo(proj.px, proj.py);
          }
        }

        ctx.strokeStyle = this._hsl(hue % 360, sat, lit, lineAlpha);
        ctx.lineWidth = 0.8 + Math.sin(v * Math.PI) * 0.6;
        ctx.stroke();
      }
    }

    // Cross-lines (u-direction) for mesh grid look
    const crossLines = this.isMobile ? 20 : 40;
    for (let ribbon = 0; ribbon < ribbonCount; ribbon++) {
      const ribbonPhase = ribbon * 2.1 + time * 0.2;
      const ribbonRotY = ribbon * 0.8 + Math.sin(time * 0.15 + ribbon) * 0.3;

      for (let cross = 0; cross <= crossLines; cross++) {
        const u = cross / crossLines;

        ctx.beginPath();
        let firstPoint = true;
        const steps = 12;

        for (let step = 0; step <= steps; step++) {
          const v = step / steps;
          const pt = this._ribbonPoint(u, v, time + ribbonPhase);

          const cosR = Math.cos(ribbonRotY);
          const sinR = Math.sin(ribbonRotY);
          const rx = pt.x * cosR - pt.z * sinR;
          const rz = pt.x * sinR + pt.z * cosR;

          const tilt = this.scrollOffset * 0.3;
          const cosT = Math.cos(tilt);
          const sinT = Math.sin(tilt);
          const ry = pt.y * cosT - rz * sinT;
          const rz2 = pt.y * sinT + rz * cosT;

          const proj = this._project(rx, ry, rz2);

          if (firstPoint) {
            ctx.moveTo(proj.px, proj.py);
            firstPoint = false;
          } else {
            ctx.lineTo(proj.px, proj.py);
          }
        }

        const hue = 215 + ribbon * 15 + Math.sin(u * Math.PI * 4 + time) * 10;
        ctx.strokeStyle = this._hsl(hue % 360, 40, 65, 0.12);
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}
