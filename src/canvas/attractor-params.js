// ============================================================
// Clifford Attractor Parameters
// Drift, scroll reactivity, mouse influence
// ============================================================

const BASE = { a: -1.7, b: 1.8, c: -1.9, d: -0.4 };

// How much each parameter oscillates over time
const DRIFT_AMP   = { a: 0.15, b: 0.12, c: 0.18, d: 0.15 };
const DRIFT_FREQ  = { a: 0.00005, b: 0.00007, c: 0.00004, d: 0.00006 };
const DRIFT_PHASE = { a: 0, b: 1.2, c: 2.5, d: 3.8 };

// How much scroll affects parameters
const SCROLL_INFLUENCE = { a: 0.5, b: -0.3, c: 0.4, d: -0.5 };

export class AttractorParams {
  constructor() {
    this.a = BASE.a;
    this.b = BASE.b;
    this.c = BASE.c;
    this.d = BASE.d;
    this.scrollProgress = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.startTime = performance.now();
  }

  update() {
    const elapsed = performance.now() - this.startTime;

    for (const key of ['a', 'b', 'c', 'd']) {
      // Base + time drift + scroll influence
      const drift = DRIFT_AMP[key] * Math.sin(elapsed * DRIFT_FREQ[key] + DRIFT_PHASE[key]);
      const scroll = SCROLL_INFLUENCE[key] * this.scrollProgress;
      const mouse = (key === 'a' || key === 'c')
        ? this.mouseX * 0.1
        : this.mouseY * 0.1;

      this[key] = BASE[key] + drift + scroll + mouse;
    }
  }

  setScroll(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
  }

  setMouse(nx, ny) {
    // nx, ny are normalized -1 to 1
    this.mouseX = nx * 0.5;
    this.mouseY = ny * 0.5;
  }

  getDisplayValues() {
    return {
      a: this.a.toFixed(4),
      b: this.b.toFixed(4),
      c: this.c.toFixed(4),
      d: this.d.toFixed(4),
    };
  }
}
