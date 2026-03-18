import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { skills, projects, experiences } from '../data/content.js';
import { t, getLang } from '../i18n.js';

let renderer, scene, camera, controls, animId;
let nodeMeshes = [], edgeLines = [], labelSprites = [], glowMeshes = [];
let nodePositions = {};
let lissajousGroup, particles;
let expandedNodeId = null;
let pointerDownPos = null;
const CLICK_THRESHOLD = 5;

function isLight() {
  return document.documentElement.getAttribute('data-theme') === 'light';
}

function hsl2hex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
  };
  return (f(0) << 16) | (f(8) << 8) | f(4);
}

function getNodeColor(id) {
  const node = skills.nodes.find(n => n.id === id);
  if (!node) return { h: 0, s: 0, l: 50 };
  return skills.clusters[node.cluster]?.color || { h: 0, s: 0, l: 50 };
}

function makeLabel(text, color, size) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const fs = 48;
  ctx.font = `600 ${fs}px "IBM Plex Mono", monospace`;
  const w = ctx.measureText(text).width + 24;
  canvas.width = Math.ceil(w);
  canvas.height = Math.ceil(fs * 1.5);
  ctx.font = `600 ${fs}px "IBM Plex Mono", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, sizeAttenuation: true });
  const sprite = new THREE.Sprite(mat);
  const aspect = canvas.width / canvas.height;
  sprite.scale.set(size * aspect, size, 1);
  return sprite;
}

function makePillLabel(text, textColor, bgColor, size) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const fs = 44;
  ctx.font = `700 ${fs}px "IBM Plex Mono", monospace`;
  const tw = ctx.measureText(text).width;
  const pad = 20;
  canvas.width = Math.ceil(tw + pad * 2);
  canvas.height = Math.ceil(fs * 1.6 + pad);
  // Pill bg
  ctx.fillStyle = bgColor;
  const r = canvas.height / 2;
  ctx.beginPath();
  ctx.roundRect(0, 0, canvas.width, canvas.height, r);
  ctx.fill();
  // Text
  ctx.font = `700 ${fs}px "IBM Plex Mono", monospace`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, sizeAttenuation: true });
  const sprite = new THREE.Sprite(mat);
  const aspect = canvas.width / canvas.height;
  sprite.scale.set(size * aspect, size, 1);
  return sprite;
}

export function initSkills() {
  const container = document.getElementById('skills-canvas')?.parentElement;
  if (!container) return;

  // Cleanup
  if (animId) cancelAnimationFrame(animId);
  if (renderer) { renderer.dispose(); renderer.domElement.remove(); }
  nodeMeshes = []; edgeLines = []; labelSprites = []; glowMeshes = [];

  const rect = container.getBoundingClientRect();
  const W = rect.width, H = rect.height;
  if (W < 10 || H < 10) return;
  const light = isLight();

  // Hide original 2D canvas
  const orig = document.getElementById('skills-canvas');
  if (orig) orig.style.display = 'none';

  // --- Scene ---
  scene = new THREE.Scene();
  const bgColor = light ? 0xF8F4EE : 0x050510;
  scene.background = new THREE.Color(bgColor);
  scene.fog = new THREE.FogExp2(bgColor, 0.004);

  // --- Camera ---
  camera = new THREE.PerspectiveCamera(55, W / H, 1, 2000);
  camera.position.set(0, 30, 180);

  // --- Renderer ---
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.cssText = 'position:absolute;inset:0;border-radius:14px;z-index:1';
  container.appendChild(renderer.domElement);

  // --- Controls ---
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.5;
  controls.zoomSpeed = 0.8;
  controls.minDistance = 60;
  controls.maxDistance = 400;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;

  // --- Lights ---
  scene.add(new THREE.AmbientLight(light ? 0xF5E8DD : 0x303060, 0.6));
  const pLight = new THREE.PointLight(light ? 0xCC4E1A : 0x7090ff, 1.5, 400);
  pLight.position.set(50, 80, 100);
  scene.add(pLight);
  const pLight2 = new THREE.PointLight(0xff3366, 0.3, 300);
  pLight2.position.set(-80, -40, -60);
  scene.add(pLight2);

  // --- Layout: clusters on a sphere ---
  const clusterKeys = Object.keys(skills.clusters);
  const clusterCenters = {};
  const R = 70;
  clusterKeys.forEach((key, i) => {
    const phi = Math.acos(1 - 2 * (i + 0.5) / clusterKeys.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    clusterCenters[key] = {
      x: R * Math.sin(phi) * Math.cos(theta),
      y: R * Math.cos(phi) * 0.6,
      z: R * Math.sin(phi) * Math.sin(theta),
    };
  });

  // Group nodes
  const clusterNodes = {};
  skills.nodes.forEach(n => {
    if (!clusterNodes[n.cluster]) clusterNodes[n.cluster] = [];
    clusterNodes[n.cluster].push(n);
  });

  // Position nodes
  nodePositions = {};
  Object.entries(clusterNodes).forEach(([cl, nodes]) => {
    const ctr = clusterCenters[cl];
    if (!ctr) return;
    const spread = 15 + nodes.length * 3;
    nodes.forEach((n, i) => {
      const phi = Math.acos(1 - 2 * (i + 0.5) / nodes.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = spread * (0.3 + n.size * 0.7);
      nodePositions[n.id] = {
        x: ctr.x + r * Math.sin(phi) * Math.cos(theta),
        y: ctr.y + r * Math.cos(phi),
        z: ctr.z + r * Math.sin(phi) * Math.sin(theta),
      };
    });
  });

  // Force repulsion
  for (let iter = 0; iter < 30; iter++) {
    for (let i = 0; i < skills.nodes.length; i++) {
      for (let j = i + 1; j < skills.nodes.length; j++) {
        const a = nodePositions[skills.nodes[i].id];
        const b = nodePositions[skills.nodes[j].id];
        if (!a || !b) continue;
        const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const min = (skills.nodes[i].size + skills.nodes[j].size) * 12 + 10;
        if (dist < min) {
          const push = (min - dist) * 0.2;
          const nx = dx / dist, ny = dy / dist, nz = dz / dist;
          a.x -= nx * push; a.y -= ny * push; a.z -= nz * push;
          b.x += nx * push; b.y += ny * push; b.z += nz * push;
        }
      }
    }
  }

  // === 3D GOLDEN-RATIO LISSAJOUS FIELD (clean grid, random seed) ===
  const PHI = (1 + Math.sqrt(5)) / 2;
  lissajousGroup = new THREE.Group();
  const bandCount = 50;
  const segCount = 300;
  const scaleXZ = 120;
  const scaleY = 80;
  // Random seed — different starting shape every page load
  const seed = Math.random() * Math.PI * 2;

  for (let band = 0; band < bandCount; band++) {
    const v = band / bandCount;
    const off = (v - 0.5) * 2;

    const pts = [];
    for (let s = 0; s <= segCount; s++) {
      const u = s / segCount;
      const ang = u * Math.PI * 2;
      const x = (Math.sin(PHI * ang + seed) + 0.3 * Math.sin(PHI * PHI * ang + seed) + off * 0.4 * Math.cos(ang * 3 + seed)) * scaleXZ;
      const y = (Math.sin(ang + seed) + 0.3 * Math.cos(PHI * ang + seed) + off * 0.4 * Math.sin(ang * 2 + seed)) * scaleY;
      const z = (Math.cos(ang * PHI + seed) * 0.5 + off * 0.3 * Math.sin(ang * 1.5 + seed)) * scaleXZ * 0.6;
      pts.push(new THREE.Vector3(x, y, z));
    }

    const hue = light ? 18 + off * 15 : 215 + off * 15;
    const sat = light ? 35 + Math.abs(off) * 30 : 35 + Math.abs(off) * 35;
    const lit = light ? 60 + Math.abs(off) * 10 : 72 - Math.abs(off) * 10;
    const alpha = 0.12 + 0.16 * Math.pow(Math.sin(v * Math.PI), 0.5);

    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: hsl2hex(hue, sat, lit),
      transparent: true,
      opacity: alpha,
      linewidth: 2,
    });
    lissajousGroup.add(new THREE.Line(geo, mat));
  }
  scene.add(lissajousGroup);

  // === NODES (spheres) ===
  skills.nodes.forEach(node => {
    const pos = nodePositions[node.id];
    if (!pos) return;
    const cl = skills.clusters[node.cluster];
    if (!cl) return;
    const hex = hsl2hex(cl.color.h, cl.color.s, cl.color.l);
    const rad = 2 + node.size * 3;

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(rad, 16, 12),
      new THREE.MeshPhongMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.3, shininess: 80, transparent: true, opacity: 0.85 }),
    );
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData = { node, basePos: { ...pos } };
    scene.add(mesh);
    nodeMeshes.push(mesh);

    // Glow ring
    const glow = new THREE.Mesh(
      new THREE.RingGeometry(rad + 0.8, rad + 1.8, 24),
      new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: 0.12, side: THREE.DoubleSide }),
    );
    glow.position.copy(mesh.position);
    scene.add(glow);
    glowMeshes.push(glow);
    mesh.userData.glow = glow;

    // Label
    const labelColor = light ? '#4A3D30' : '#c0c8e0';
    const label = makeLabel(node.label, labelColor, 5 + node.size * 2);
    label.position.set(pos.x, pos.y - rad - 3, pos.z);
    scene.add(label);
    labelSprites.push(label);
    mesh.userData.label = label;
  });

  // Edge opacity: subtle base, bright on hover
  const edgeBaseOpacity = light ? 0.18 : 0.15;
  const edgeHighlightOpacity = 1.0;

  // === EDGES (colored gradient) ===
  skills.edges.forEach(([fromId, toId]) => {
    const from = nodePositions[fromId], to = nodePositions[toId];
    if (!from || !to) return;
    const fc = getNodeColor(fromId), tc = getNodeColor(toId);
    const c1 = new THREE.Color(hsl2hex(fc.h, fc.s, fc.l));
    const c2 = new THREE.Color(hsl2hex(tc.h, tc.s, tc.l));

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(from.x, from.y, from.z),
      new THREE.Vector3((from.x + to.x) / 2, (from.y + to.y) / 2 + 3, (from.z + to.z) / 2),
      new THREE.Vector3(to.x, to.y, to.z),
    );
    const pts = curve.getPoints(16);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const colors = new Float32Array(pts.length * 3);
    for (let i = 0; i < pts.length; i++) {
      const f = i / (pts.length - 1);
      colors[i * 3] = c1.r + (c2.r - c1.r) * f;
      colors[i * 3 + 1] = c1.g + (c2.g - c1.g) * f;
      colors[i * 3 + 2] = c1.b + (c2.b - c1.b) * f;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: edgeBaseOpacity }));
    scene.add(line);
    edgeLines.push(line);
  });

  // === CLUSTER LABELS (pill badges) ===
  Object.entries(skills.clusters).forEach(([key, cl]) => {
    const ctr = clusterCenters[key];
    if (!ctr) return;
    const { h, s, l } = cl.color;
    const txtCol = light ? `hsl(${h},${Math.min(s+10,50)}%,${Math.max(l-25,20)}%)` : `hsl(${h},${Math.min(s+10,60)}%,${Math.min(l+15,82)}%)`;
    const bgCol = light ? `rgba(235,229,218,0.8)` : `rgba(20,20,50,0.75)`;
    const pill = makePillLabel(cl.label, txtCol, bgCol, 12);
    pill.position.set(ctr.x, ctr.y + 30, ctr.z);
    scene.add(pill);
  });

  // === PARTICLES ===
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(200 * 3);
  for (let i = 0; i < 200; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 300;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 200;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 300;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: light ? 0xCC4E1A : 0x7090ff, size: 0.8, transparent: true, opacity: 0.3, sizeAttenuation: true,
  }));
  scene.add(particles);

  // === Build edge lookup: nodeId -> [edge indices] ===
  const nodeEdgeMap = {};
  skills.edges.forEach(([a, b], idx) => {
    if (!nodeEdgeMap[a]) nodeEdgeMap[a] = [];
    if (!nodeEdgeMap[b]) nodeEdgeMap[b] = [];
    nodeEdgeMap[a].push(idx);
    nodeEdgeMap[b].push(idx);
  });

  // Store base opacity for edges
  // (edgeBaseOpacity and edgeHighlightOpacity defined above edges)

  // === TOOLTIP + HOVER HIGHLIGHT ===
  const tooltip = document.getElementById('skills-tooltip');
  const expandedCard = document.getElementById('skills-expanded-card');
  const raycaster = new THREE.Raycaster();
  raycaster.params.Sphere = { threshold: 3 };
  const mouse = new THREE.Vector2(-999, -999);
  let hoveredNode = null;

  // --- Helper: get connected node IDs ---
  function getConnectedNodes(nodeId) {
    const edgeIdxs = nodeEdgeMap[nodeId] || [];
    const connected = [];
    edgeIdxs.forEach(idx => {
      const [a, b] = skills.edges[idx];
      connected.push(a === nodeId ? b : a);
    });
    return connected;
  }

  // --- Helper: get related projects for a skill ---
  function getRelatedProjects(nodeId) {
    return projects.filter(p => p.relatedSkills && p.relatedSkills.includes(nodeId));
  }

  // --- Helper: get related experiences for a skill ---
  function getRelatedExperiences(nodeId) {
    return experiences.filter(e => e.relatedSkills && e.relatedSkills.includes(nodeId));
  }

  // --- Helper: proficiency level from node size ---
  function getProficiency(size) {
    const isEn = getLang() === 'en';
    if (size >= 0.9) return { label: isEn ? 'Expert' : 'Expert', pct: 95 };
    if (size >= 0.75) return { label: isEn ? 'Advanced' : 'Avancé', pct: 80 };
    if (size >= 0.6) return { label: isEn ? 'Proficient' : 'Confirmé', pct: 65 };
    return { label: isEn ? 'Familiar' : 'Familier', pct: 50 };
  }

  // --- Helper: build expanded card HTML ---
  function buildCardHTML(node) {
    const isEn = getLang() === 'en';
    const cl = skills.clusters[node.cluster];
    const color = cl ? `hsl(${cl.color.h},${cl.color.s}%,${cl.color.l}%)` : 'var(--accent)';
    const prof = getProficiency(node.size);

    // === Header: cluster badge + label + description ===
    let html = `<div class="skill-card-header">`;
    html += `<div class="skill-card-top-row">`;
    if (cl) html += `<span class="skill-card-cluster" style="color:${color};border-color:${color}44">${cl.label}</span>`;
    html += `</div>`;
    html += `<div class="skill-card-label" style="color:${color}">${node.label}</div>`;
    if (node.sub) html += `<div class="skill-card-sub">${node.sub}</div>`;
    if (node.description) html += `<div class="skill-card-desc">${t(node.description)}</div>`;
    html += `</div>`;

    // === Proficiency bar ===
    html += `<div class="skill-card-proficiency">`;
    html += `<div class="skill-card-prof-row">`;
    html += `<span class="skill-card-section-title">${isEn ? 'PROFICIENCY' : 'MAÎTRISE'}</span>`;
    html += `<span class="skill-card-prof-label">${prof.label}</span>`;
    html += `</div>`;
    html += `<div class="skill-card-bar"><div class="skill-card-bar-fill" style="width:${prof.pct}%;background:${color}"></div></div>`;
    html += `</div>`;

    // === Experience section ===
    const relExp = getRelatedExperiences(node.id);
    if (relExp.length > 0) {
      html += `<div class="skill-card-section">`;
      html += `<div class="skill-card-section-title">${isEn ? 'EXPERIENCE' : 'EXPÉRIENCE'}</div>`;
      relExp.forEach(e => {
        html += `<div class="skill-card-exp">`;
        html += `<span class="skill-card-exp-company">${e.company}</span>`;
        html += `<span class="skill-card-exp-role">${t(e.role)}</span>`;
        html += `<span class="skill-card-exp-date">${e.date}</span>`;
        html += `</div>`;
      });
      html += `</div>`;
    }

    // === Connected skills ===
    const connected = getConnectedNodes(node.id);
    if (connected.length > 0) {
      html += `<div class="skill-card-section">`;
      html += `<div class="skill-card-section-title">${isEn ? 'CONNECTED SKILLS' : 'COMPÉTENCES LIÉES'}</div>`;
      html += `<div class="skill-card-pills">`;
      connected.forEach(cId => {
        const cNode = skills.nodes.find(n => n.id === cId);
        if (!cNode) return;
        const cCl = skills.clusters[cNode.cluster];
        const cColor = cCl ? `hsl(${cCl.color.h},${cCl.color.s}%,${cCl.color.l}%)` : 'var(--text-secondary)';
        html += `<span class="skill-card-pill" style="color:${cColor};border-color:${cColor}33">${cNode.label}</span>`;
      });
      html += `</div></div>`;
    }

    // === Related projects ===
    const relProjects = getRelatedProjects(node.id);
    if (relProjects.length > 0) {
      html += `<div class="skill-card-section">`;
      html += `<div class="skill-card-section-title">${isEn ? 'PROJECTS' : 'PROJETS'}</div>`;
      relProjects.forEach(p => {
        html += `<div class="skill-card-project">`;
        html += `<div class="skill-card-project-title">${t(p.title)}${p.link ? ' ↗' : ''}</div>`;
        if (p.context) html += `<div class="skill-card-project-context">${t(p.context)}</div>`;
        if (p.tags && p.tags.length > 0) {
          html += `<div class="skill-card-project-tags">`;
          p.tags.forEach(tag => { html += `<span class="skill-card-project-tag">${tag}</span>`; });
          html += `</div>`;
        }
        html += `</div>`;
      });
      html += `</div>`;
    }

    return html;
  }

  // --- Helper: reset scene highlight ---
  function resetSceneHighlight() {
    nodeMeshes.forEach(m => {
      m.material.opacity = 0.85;
      m.material.emissiveIntensity = 0.3;
      m.scale.set(1, 1, 1);
      if (m.userData.glow) m.userData.glow.material.opacity = 0.12;
      if (m.userData.label) m.userData.label.material.opacity = 1;
    });
    edgeLines.forEach(line => { line.material.opacity = edgeBaseOpacity; });
  }

  // --- Helper: highlight scene for expanded node ---
  function highlightForNode(nodeId) {
    const connected = getConnectedNodes(nodeId);
    const highlightSet = new Set([nodeId, ...connected]);

    nodeMeshes.forEach(m => {
      if (highlightSet.has(m.userData.node.id)) {
        m.material.opacity = 0.95;
        if (m.userData.node.id === nodeId) {
          m.material.emissiveIntensity = 0.8;
          m.scale.set(1.3, 1.3, 1.3);
          if (m.userData.glow) m.userData.glow.material.opacity = 0.5;
        } else {
          m.material.emissiveIntensity = 0.5;
        }
      } else {
        m.material.opacity = 0.25;
        m.material.emissiveIntensity = 0.1;
        if (m.userData.glow) m.userData.glow.material.opacity = 0.03;
        if (m.userData.label) m.userData.label.material.opacity = 0.3;
      }
    });

    const connectedEdgeIdxs = new Set(nodeEdgeMap[nodeId] || []);
    edgeLines.forEach((line, idx) => {
      line.material.opacity = connectedEdgeIdxs.has(idx) ? edgeHighlightOpacity : 0.03;
    });
  }

  // --- Delayed close to prevent flicker ---
  let closeTimer = null;
  let cardHovered = false;

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (!cardHovered) {
        if (!expandedCard) return;
        expandedCard.classList.remove('active');
        expandedNodeId = null;
        resetSceneHighlight();
      }
    }, 80);
  }

  function cancelClose() {
    clearTimeout(closeTimer);
  }

  // --- Open expanded card ---
  function openExpandedCard(node, mesh) {
    if (!expandedCard) return;
    cancelClose();
    expandedNodeId = node.id;

    expandedCard.innerHTML = buildCardHTML(node);
    highlightForNode(node.id);

    // Position handled by CSS (top-right on desktop, bottom sheet on mobile)
    // Just clear any stale inline styles
    expandedCard.style.cssText = '';
    expandedCard.classList.add('active');
  }

  // --- Close expanded card (immediate) ---
  function closeExpandedCard() {
    cancelClose();
    if (!expandedCard) return;
    expandedCard.classList.remove('active');
    expandedNodeId = null;
    resetSceneHighlight();
  }

  // --- Card hover: keep open while mouse is over the card ---
  if (expandedCard) {
    expandedCard.addEventListener('mouseenter', () => {
      cardHovered = true;
      cancelClose();
    });
    expandedCard.addEventListener('mouseleave', () => {
      cardHovered = false;
      scheduleClose();
    });
  }

  // --- Hover: open expanded card on node hover ---
  renderer.domElement.addEventListener('mousemove', (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(nodeMeshes);

    if (hits.length > 0) {
      const nd = hits[0].object.userData.node;
      cancelClose();

      // Only update if hovering a different node
      if (hoveredNode !== nd.id) {
        hoveredNode = nd.id;
        if (tooltip) tooltip.style.opacity = '0';
        // Update card content without closing first (no blink)
        openExpandedCard(nd, hits[0].object);
      }

      renderer.domElement.style.cursor = 'pointer';
    } else {
      if (hoveredNode) {
        hoveredNode = null;
        scheduleClose();
      }
      if (tooltip) tooltip.style.opacity = '0';
      renderer.domElement.style.cursor = 'grab';
    }
  });

  renderer.domElement.addEventListener('mouseleave', () => {
    if (tooltip) tooltip.style.opacity = '0';
    if (hoveredNode) {
      hoveredNode = null;
      scheduleClose();
    }
    renderer.domElement.style.cursor = 'grab';
  });

  // --- Touch: tap to open/close on mobile ---
  let touchStart = null;
  renderer.domElement.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  renderer.domElement.addEventListener('touchend', (e) => {
    if (!touchStart || e.changedTouches.length !== 1) { touchStart = null; return; }
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    touchStart = null;
    if (Math.sqrt(dx * dx + dy * dy) > 10) return; // was a drag/pinch

    const r = renderer.domElement.getBoundingClientRect();
    mouse.x = ((touch.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = -((touch.clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(nodeMeshes);

    if (hits.length > 0) {
      const nd = hits[0].object.userData.node;
      if (expandedNodeId === nd.id) {
        closeExpandedCard();
      } else {
        openExpandedCard(nd, hits[0].object);
      }
    } else {
      if (expandedNodeId) closeExpandedCard();
    }
  });

  // Close card on orbit/zoom (user is dragging)
  controls.addEventListener('start', () => {
    if (expandedNodeId) closeExpandedCard();
  });

  // Auto-rotate pause/resume
  let idle;
  controls.addEventListener('start', () => { controls.autoRotate = false; clearTimeout(idle); });
  controls.addEventListener('end', () => { idle = setTimeout(() => { controls.autoRotate = true; }, 4000); });

  // === ANIMATE ===
  function animate() {
    animId = requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    // Node breathing
    nodeMeshes.forEach(m => {
      const bp = m.userData.basePos;
      m.position.x = bp.x + Math.sin(t * 0.4 + bp.x * 0.05) * 1.5;
      m.position.y = bp.y + Math.cos(t * 0.5 + bp.y * 0.05) * 1.5;
      m.position.z = bp.z + Math.sin(t * 0.3 + bp.z * 0.05) * 1.5;
      if (m.userData.glow) { m.userData.glow.position.copy(m.position); m.userData.glow.lookAt(camera.position); }
      if (m.userData.label) {
        const rad = 2 + m.userData.node.size * 3;
        m.userData.label.position.set(m.position.x, m.position.y - rad - 3, m.position.z);
      }
    });

    // Lissajous clean drift — slightly faster than before
    if (lissajousGroup) {
      lissajousGroup.rotation.y = t * 0.05;
      lissajousGroup.rotation.x = Math.sin(t * 0.025) * 0.15;
    }

    // Particles
    if (particles) {
      particles.rotation.y = t * 0.02;
    }

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Resize
  const ro = new ResizeObserver(() => {
    const r = container.getBoundingClientRect();
    if (r.width < 10 || r.height < 10) return;
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    renderer.setSize(r.width, r.height);
  });
  ro.observe(container);
}
