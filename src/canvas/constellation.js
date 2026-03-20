// ============================================================
// Constellation Background — subtle node-graph animation
// Used behind the projects expanded view
// ============================================================

export class Constellation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = [];
    this.animId = null;
    this.time = 0;
    this.scrollProgress = 0;

    this.isMobile = window.innerWidth < 768;
    this.nodeCount = this.isMobile ? 20 : 40;
    this.connectionDist = this.isMobile ? 120 : 150;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    this._onResize = this.resize.bind(this);
    window.addEventListener('resize', this._onResize);

    this.resize();
    this.initNodes();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.width = w;
    this.height = h;
    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  initNodes() {
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 1.2 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  update() {
    this.time += 0.004;

    for (const node of this.nodes) {
      // Base velocity + gentle sine drift
      node.x += node.vx + Math.sin(this.time + node.phase) * 0.08;
      node.y += node.vy + Math.cos(this.time * 0.7 + node.phase) * 0.06;

      // Bounce off edges with padding
      if (node.x < 0) { node.x = 0; node.vx = Math.abs(node.vx); }
      if (node.x > this.width) { node.x = this.width; node.vx = -Math.abs(node.vx); }
      if (node.y < 0) { node.y = 0; node.vy = Math.abs(node.vy); }
      if (node.y > this.height) { node.y = this.height; node.vy = -Math.abs(node.vy); }
    }
  }

  draw() {
    const { ctx, width, height, nodes, connectionDist } = this;

    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDist) {
          const alpha = (1 - dist / connectionDist) * 0.2;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(112, 144, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const pulse = 0.8 + 0.2 * Math.sin(this.time * 2 + node.phase);
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(112, 144, 255, 0.4)`;
      ctx.fill();
    }
  }

  loop() {
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (this.animId) return;
    this.loop();
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    window.removeEventListener('resize', this._onResize);
  }
}
