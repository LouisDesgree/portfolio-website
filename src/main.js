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
import { renderNewsPreview, renderNewsExpanded } from './components/news.js';

function initTheme() {
  const saved = localStorage.getItem('theme');
  const theme = saved || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeUI(theme);

  let themeToggling = false;
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    if (themeToggling) return;
    themeToggling = true;
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeUI(next);
    // Re-render skills canvas with new colors
    initSkills();
    setTimeout(() => { themeToggling = false; }, 600);
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
  renderNewsPreview();
  initSkills();

  // Init tile expand system
  initTiles({
    about: renderAboutExpanded,
    experience: renderExperienceExpanded,
    projects: renderProjectsExpanded,
    education: renderEducationExpanded,
    news: renderNewsExpanded,
  });

  // Re-render on language change
  onLangChange(() => {
    renderPreviews();
    renderContact();
    renderPersonal();
    renderNewsPreview();
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
    `<div class="interest-pill">
      <span class="interest-icon">${i.icon}</span>
      <span class="interest-label">${t(i.label)}</span>
    </div>`
  ).join('');

  const cp = p.currentProject;
  el.innerHTML = `
    <div class="interest-pills">${interests}</div>
    <div class="current-project-section">
      <div class="status-indicator" style="margin-bottom:6px;margin-top:0">
        <span class="status-dot"></span>
        <span class="status-label">${isEn ? 'CURRENT PROJECT' : 'PROJET EN COURS'}</span>
      </div>
      <div class="current-project-name">${cp.name}</div>
      <div class="current-project-desc">${t(cp.desc)}</div>
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
      <div class="preview-stats">
        <div class="preview-stat">
          <span class="preview-stat-value">3</span>
          <span class="preview-stat-label">${isEn ? 'INDUSTRIES' : 'INDUSTRIES'}</span>
        </div>
        <div class="preview-stat">
          <span class="preview-stat-value">6</span>
          <span class="preview-stat-label">${isEn ? 'ROLES' : 'POSTES'}</span>
        </div>
        <div class="preview-stat">
          <span class="preview-stat-value">65+</span>
          <span class="preview-stat-label">${isEn ? 'SKILLS' : 'COMP.'}</span>
        </div>
      </div>
      <div class="preview-domains">tech \u00b7 luxury \u00b7 finance \u00b7 audiovisual</div>
      <div class="status-indicator">
        <span class="status-dot"></span>
        <span class="status-label">WORLDWIDE</span>
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
