// ============================================================
// Main - Dashboard mode
// ============================================================

import './styles/reset.css';
import './styles/variables.css';
import './styles/grain.css';
import './styles/dashboard.css';

import { LightFragmentation } from './canvas/light-fragmentation.js';
import { initI18n, onLangChange, toggleLang, t } from './i18n.js';
import * as content from './data/content.js';
import { initSkills } from './components/skills.js';
import { initTiles } from './components/tiles.js';
import { renderAboutExpanded } from './components/about.js';
import { renderExperienceExpanded, renderExpPreview } from './components/experience.js';
import { renderProjectsExpanded, renderProjectsPreview } from './components/projects.js';
import { renderEducationExpanded, renderEduPreview } from './components/education.js';
import { renderContact } from './components/contact.js';

function initTheme() {
  const saved = localStorage.getItem('theme');
  const theme = saved || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeUI(theme);

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeUI(next);
    // Re-render skills canvas with new colors
    initSkills();
  });
}

function updateThemeUI(theme) {
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  if (icon) icon.innerHTML = theme === 'dark' ? '&#9790;' : '&#9788;';
  if (label) label.textContent = theme === 'dark' ? 'DARK' : 'LIGHT';
}

function init() {
  initI18n();
  initTheme();

  // Language toggle
  document.getElementById('lang-toggle')?.addEventListener('click', toggleLang);

  // Render tile previews
  renderPreviews();
  renderContact();
  renderPersonal();
  initSkills();

  // Init tile expand system
  initTiles({
    about: renderAboutExpanded,
    experience: renderExperienceExpanded,
    projects: renderProjectsExpanded,
    education: renderEducationExpanded,
  });

  // Re-render on language change
  onLangChange(() => {
    renderPreviews();
    renderContact();
    renderPersonal();
    initSkills();
    updateI18n();
  });

  // Background attractor
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas) {
    const attractor = new LightFragmentation(bgCanvas);
    attractor.init();

    document.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      attractor.setMousePosition(nx, ny);
    });
  }

  updateI18n();
}

function renderPersonal() {
  const el = document.getElementById('personal-content');
  if (!el) return;
  const p = content.personal;
  const isEn = t({ en: true, fr: false });

  const interests = p.interests.map(i =>
    `<div style="display:inline-flex;align-items:center;gap:7px;background:var(--accent-subtle);border:1px solid var(--glass-border);border-radius:6px;padding:5px 11px;font-family:var(--font-mono);font-size:0.6rem;transition:all 0.2s ease;cursor:default">
      <span style="font-size:0.7rem">${i.icon}</span>
      <span style="color:var(--text-secondary)">${t(i.label)}</span>
    </div>`
  ).join('');

  const cp = p.currentProject;
  el.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">${interests}</div>
    <div style="border-top:1px solid var(--glass-border);padding-top:10px;margin-top:4px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
        <span style="width:5px;height:5px;border-radius:50%;background:var(--accent);display:inline-block;box-shadow:0 0 8px var(--tile-glow-color)"></span>
        <span style="font-family:var(--font-mono);font-size:0.5rem;color:var(--accent);letter-spacing:0.12em">${isEn ? 'CURRENT PROJECT' : 'PROJET EN COURS'}</span>
      </div>
      <div style="font-family:var(--font-heading);font-size:0.85rem;color:var(--text-primary);margin-bottom:5px;font-weight:400">${cp.name}</div>
      <div style="font-family:var(--font-mono);font-size:0.55rem;color:var(--text-tertiary);line-height:1.6">${t(cp.desc)}</div>
    </div>
  `;
}

function renderPreviews() {
  renderExpPreview();
  renderProjectsPreview();
  renderEduPreview();

  // About preview - rich multi-stat layout
  const aboutPrev = document.getElementById('about-preview');
  if (aboutPrev) {
    const isEn = t({ en: true, fr: false });
    aboutPrev.innerHTML = `
      <div style="display:flex;gap:14px;margin-bottom:12px">
        <div style="padding:6px 0">
          <span style="font-family:var(--font-mono);font-size:1.5rem;font-weight:200;color:var(--text-primary);text-shadow:0 0 30px var(--tile-glow-color)">3</span>
          <span style="font-family:var(--font-mono);font-size:0.48rem;color:var(--text-ghost);margin-left:5px;letter-spacing:0.08em">${isEn ? 'INDUSTRIES' : 'INDUSTRIES'}</span>
        </div>
        <div style="padding:6px 0">
          <span style="font-family:var(--font-mono);font-size:1.5rem;font-weight:200;color:var(--text-primary);text-shadow:0 0 30px var(--tile-glow-color)">6</span>
          <span style="font-family:var(--font-mono);font-size:0.48rem;color:var(--text-ghost);margin-left:5px;letter-spacing:0.08em">${isEn ? 'ROLES' : 'POSTES'}</span>
        </div>
        <div style="padding:6px 0">
          <span style="font-family:var(--font-mono);font-size:1.5rem;font-weight:200;color:var(--text-primary);text-shadow:0 0 30px var(--tile-glow-color)">65+</span>
          <span style="font-family:var(--font-mono);font-size:0.48rem;color:var(--text-ghost);margin-left:5px;letter-spacing:0.08em">${isEn ? 'SKILLS' : 'COMP.'}</span>
        </div>
      </div>
      <div style="font-family:var(--font-mono);font-size:0.58rem;color:var(--text-tertiary);margin-bottom:8px;letter-spacing:0.03em">tech · luxury · finance · audiovisual</div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:8px">
        <span style="width:5px;height:5px;border-radius:50%;background:var(--accent);display:inline-block;box-shadow:0 0 8px var(--tile-glow-color)"></span>
        <span style="font-family:var(--font-mono);font-size:0.5rem;color:var(--accent);letter-spacing:0.1em">WORLDWIDE</span>
      </div>
    `;
  }
}

function updateI18n() {
  const subtitle = document.querySelector('[data-i18n="hero.subtitle"]');
  const avail = document.querySelector('[data-i18n="hero.availability"]');
  if (subtitle) subtitle.textContent = t(content.hero.subtitle);
  if (avail) avail.textContent = t(content.hero.availability);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const parts = key.split('.');
    if (parts[0] === 'nav' && content.nav[parts[1]]) {
      el.textContent = t(content.nav[parts[1]]);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
