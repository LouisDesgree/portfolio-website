import { experiences } from '../data/content.js';
import { t } from '../i18n.js';

export function renderExpPreview() {
  const preview = document.getElementById('exp-preview');
  const footer = document.getElementById('exp-footer');
  if (!preview) return;
  const top3 = experiences.slice(0, 3);
  preview.innerHTML = top3.map(exp =>
    `<div class="exp-preview-item">
      <div class="exp-preview-role">${t(exp.role)}</div>
      <div class="exp-preview-meta">
        <span class="exp-preview-company">${exp.company}</span>
        <span class="exp-preview-dot">&middot;</span>
        <span class="exp-preview-date">${exp.date}</span>
      </div>
    </div>`
  ).join('');
  if (footer) footer.textContent = experiences.map(e => e.company).join(' \u00b7 ');
}

export function renderExperienceExpanded() {
  return `
    <h2 class="expanded-heading">${t({ en: 'Experience', fr: 'Expérience' })}</h2>
    <div class="exp-timeline">
      ${experiences.map((exp, i) => `
        <div class="exp-item">
          <div class="exp-dot"></div>
          <div class="exp-coord">[${String(i+1).padStart(2,'0')}, ${exp.date.slice(-4)}]</div>
          <div class="exp-header">
            <span class="exp-role">${t(exp.role)}</span>
            <span class="exp-date">${exp.date}</span>
          </div>
          <div class="exp-company">${exp.company} \u00b7 ${t(exp.location)}</div>
          <p class="exp-desc">${t(exp.desc)}</p>
        </div>
      `).join('')}
    </div>
  `;
}
