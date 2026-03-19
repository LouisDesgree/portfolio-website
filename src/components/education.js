import { education, projects } from '../data/content.js';
import { t, getLang } from '../i18n.js';

export function renderEduPreview() {
  const el = document.getElementById('edu-preview');
  if (!el) return;
  const ucla = education.find(e => e.school.includes('UCLA'));
  const epitech = education.find(e => e.school.includes('Epitech'));
  el.innerHTML = `
    <div class="edu-preview-item">
      <div class="edu-preview-school">${epitech?.school || 'Epitech'}</div>
      <div class="edu-preview-degree">${epitech ? t(epitech.degree) : ''}</div>
    </div>
    <div class="edu-preview-item">
      <div class="edu-preview-school">UCLA Extension</div>
      <div class="edu-preview-degree">${ucla ? t(ucla.degree) : ''}</div>
    </div>
    <div class="edu-preview-highlights">
      <span class="edu-preview-gpa">${ucla?.highlight ? `GPA ${ucla.highlight.gpa}` : ''}</span>
      <span class="exp-preview-dot">&middot;</span>
      <span>${ucla?.highlight ? t(ucla.highlight.distinction) : ''}</span>
      <span class="exp-preview-dot">&middot;</span>
      <span>2021 - 2026</span>
    </div>
  `;
}

export function renderEducationExpanded() {
  return `
    <h2 class="expanded-heading">${t({ en: 'Education', fr: 'Formation' })}</h2>
    ${education.map(edu => {
      let html = `<div class="${edu.highlight ? 'edu-card edu-card--highlighted' : 'edu-card'}">`;
      html += `<div class="edu-school">${edu.school}</div>`;
      html += `<div class="edu-degree">${t(edu.degree)}</div>`;
      if (edu.years) html += `<div class="edu-years">${t(edu.years)}</div>`;
      if (edu.techStack) {
        html += `<div class="edu-tags">${edu.techStack.map(tag => `<span class="edu-tech-tag">${tag}</span>`).join('')}</div>`;
      }
      if (edu.detail) html += `<p class="edu-detail">${t(edu.detail)}</p>`;
      if (edu.highlight) {
        const h = edu.highlight;
        if (h.featuredProject) {
          const proj = projects.find(p => p.id === h.featuredProject);
          if (proj) {
            html += `<div class="edu-featured-project">`;
            html += `<div class="edu-featured-label">${getLang() === 'fr' ? 'Projet phare' : 'Featured project'}</div>`;
            html += `<div class="edu-featured-title">${t(proj.title)}</div>`;
            html += `<p class="edu-featured-desc">${t(proj.desc)}</p>`;
            html += `<div class="edu-featured-tags">${proj.tags.map(tag => `<span class="edu-project-tag">${tag}</span>`).join('')}</div>`;
            html += `</div>`;
          }
        }
        html += `<div class="edu-highlight-summary">GPA ${h.gpa} \u00b7 ${t(h.distinction)} \u00b7 ${t(h.achievement)}</div>`;
      }
      html += `</div>`;
      return html;
    }).join('')}
  `;
}
