// ============================================================
// News & AI component
// Preview tile + expanded split view with mode toggle
// ============================================================

import { t } from '../i18n.js';
import { newsAI } from '../data/content.js';

let currentMode = 'aidev';

export function renderNewsPreview() {
  const el = document.getElementById('news-preview');
  if (!el) return;

  const modeKeys = Object.keys(newsAI.modes);
  const mode = newsAI.modes[currentMode];
  const items = mode.news.slice(0, 2);

  const tabs = modeKeys.map(k => {
    const m = newsAI.modes[k];
    const active = k === currentMode ? ' news-tab--active' : '';
    return `<span class="news-tab${active}" data-mode="${k}">${t(m.label)}</span>`;
  }).join('');

  const headlines = items.map(item =>
    `<div class="news-preview-item">
      <span class="news-preview-source">${item.source}</span>
      <span class="news-preview-title">${t(item.title)}</span>
    </div>`
  ).join('');

  el.innerHTML = `
    <div class="news-tabs">${tabs}</div>
    <div class="news-preview-items">${headlines}</div>
    <div class="news-preview-footer">
      <span class="news-live-dot"></span>
      <span>${t({ en: 'AI-UPDATED TWICE DAILY', fr: 'MIS À JOUR 2x/JOUR PAR IA' })}</span>
    </div>
  `;

  // Wire tab clicks inside the preview
  el.querySelectorAll('.news-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      currentMode = tab.dataset.mode;
      renderNewsPreview();
    });
  });
}

export function renderNewsExpanded() {
  const html = buildExpandedHTML(currentMode);

  return {
    html,
    onMount(container) {
      // Wire up mode toggle buttons
      container.querySelectorAll('.news-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.mode;
          if (mode === currentMode) return;
          currentMode = mode;

          // Update active state
          container.querySelectorAll('.news-mode-btn').forEach(b =>
            b.classList.toggle('active', b.dataset.mode === mode)
          );

          // Re-render content areas
          const newsCol = container.querySelector('.news-column-content');
          const researchCol = container.querySelector('.research-column-content');
          if (newsCol) newsCol.innerHTML = buildNewsList(mode);
          if (researchCol) researchCol.innerHTML = buildResearchPaper(mode);

          // Update preview tile too
          renderNewsPreview();
        });
      });
    },
  };
}

function buildExpandedHTML(mode) {
  return `
    <h2 class="expanded-heading">News & AI</h2>
    <div class="news-disclaimer">${t({ en: 'This page is updated twice a day autonomously by AI. Do not take it as true by definition.', fr: 'Cette page est mise à jour deux fois par jour de manière autonome par IA. Ne la prenez pas pour vraie par défaut.' })}</div>
    <div class="news-mode-toggle">
      <button class="news-mode-btn ${mode === 'aidev' ? 'active' : ''}" data-mode="aidev">
        ${t(newsAI.modes.aidev.label)}
      </button>
      <button class="news-mode-btn ${mode === 'finance' ? 'active' : ''}" data-mode="finance">
        ${t(newsAI.modes.finance.label)}
      </button>
      <button class="news-mode-btn ${mode === 'politics' ? 'active' : ''}" data-mode="politics">
        ${t(newsAI.modes.politics.label)}
      </button>
    </div>
    <div class="news-expanded-layout">
      <div>
        <div class="news-column-title">${t({ en: 'LATEST NEWS', fr: 'DERNIÈRES ACTUALITÉS' })}</div>
        <div class="news-column-content">${buildNewsList(mode)}</div>
      </div>
      <div>
        <div class="news-column-title">${t({ en: 'RESEARCH BRIEF', fr: 'NOTE DE RECHERCHE' })}</div>
        <div class="research-column-content">${buildResearchPaper(mode)}</div>
      </div>
    </div>
  `;
}

function buildNewsList(mode) {
  const items = newsAI.modes[mode].news;
  return items.map(item => `
    <div class="news-item">
      <div class="news-item-source">${item.link ? `<a href="${item.link}" target="_blank" rel="noopener">${item.source}</a>` : item.source}</div>
      <div class="news-item-title">${t(item.title)}</div>
      <div class="news-item-summary">${t(item.summary)}</div>
      <div class="news-item-date">${item.date}</div>
    </div>
  `).join('');
}

function buildResearchPaper(mode) {
  const r = newsAI.modes[mode].research;

  // Visual metrics per mode
  const metricsMap = {
    aidev: [
      { value: '70%', label: t({ en: 'COST SAVINGS', fr: 'RÉDUCTION COÛTS' }) },
      { value: '40+', label: t({ en: 'SYSTEMS REVIEWED', fr: 'SYSTÈMES ÉTUDIÉS' }) },
      { value: '3', label: t({ en: 'KEY DECISIONS', fr: 'DÉCISIONS CLÉS' }) },
    ],
    finance: [
      { value: '0.4', label: t({ en: 'SHARPE GAINED', fr: 'SHARPE GAGNÉ' }) },
      { value: '92%', label: t({ en: 'BACKTESTS FAIL', fr: 'BACKTESTS ÉCHOUENT' }) },
      { value: '6mo', label: t({ en: 'PAPER TRADE MIN', fr: 'PAPER TRADE MIN' }) },
    ],
    politics: [
      { value: '$47B', label: t({ en: 'WIPED IN 48H', fr: 'EFFACÉS EN 48H' }) },
      { value: '2.5%', label: t({ en: 'NATO GDP AVG', fr: 'PIB OTAN MOY' }) },
      { value: '30%+', label: t({ en: 'CHINA ETF GAP', fr: 'ÉCART ETF CHINE' }) },
    ],
  };

  const metrics = (metricsMap[mode] || []).map(m =>
    `<div class="research-metric">
      <span class="research-metric-value">${m.value}</span>
      <span class="research-metric-label">${m.label}</span>
    </div>`
  ).join('');

  // Relevance scores for visual bars
  const barWidths = [95, 80, 65];

  const sections = r.sections.map((s, si) => `
    <div class="research-section">
      <div class="research-section-title">${t(s.title)}</div>
      ${s.items.map((item, ii) => `
        <div class="research-stack-item">
          <span class="research-stack-name">${item.name}</span>
          <span class="research-stack-desc">${t(item.desc)}</span>
          <div class="research-bar"><div class="research-bar-fill" style="width: ${barWidths[ii] || 70}%"></div></div>
        </div>
      `).join('')}
    </div>
  `).join('');

  const tags = r.tags.map(tag =>
    `<span class="research-tag">${tag}</span>`
  ).join('');

  return `
    <div class="research-paper">
      <div class="research-paper-badge">${t(r.badge)}</div>
      <div class="research-paper-title">${t(r.title)}</div>
      <div class="research-metrics">${metrics}</div>
      <div class="research-paper-abstract">${t(r.abstract)}</div>
      ${sections}
      <div class="research-tags">${tags}</div>
    </div>
  `;
}
