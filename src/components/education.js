import { education, projects } from '../data/content.js';
import { t, getLang } from '../i18n.js';

export function renderEduPreview() {
  const el = document.getElementById('edu-preview');
  if (!el) return;
  const ucla = education.find(e => e.school.includes('UCLA'));
  const epitech = education.find(e => e.school.includes('Epitech'));
  el.innerHTML = `
    <div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--glass-border)">
      <div style="font-family:var(--font-heading);font-size:0.85rem;font-weight:400;color:var(--text-primary);margin-bottom:2px">${epitech?.school || 'Epitech'}</div>
      <div style="font-family:var(--font-mono);font-size:0.52rem;color:var(--text-ghost);letter-spacing:0.03em">${epitech ? t(epitech.degree) : ''}</div>
    </div>
    <div style="margin-bottom:8px">
      <div style="font-family:var(--font-heading);font-size:0.85rem;font-weight:400;color:var(--text-primary);margin-bottom:2px">UCLA Extension</div>
      <div style="font-family:var(--font-mono);font-size:0.52rem;color:var(--text-ghost);letter-spacing:0.03em">${ucla ? t(ucla.degree) : ''}</div>
    </div>
    <div style="font-family:var(--font-mono);font-size:0.5rem;color:var(--text-ghost);margin-top:4px;display:flex;align-items:center;gap:6px">
      <span style="color:var(--spec-cyan);font-weight:500">${ucla?.highlight ? `GPA ${ucla.highlight.gpa}` : ''}</span>
      <span style="color:var(--bg-line)">·</span>
      <span>${ucla?.highlight ? t(ucla.highlight.distinction) : ''}</span>
      <span style="color:var(--bg-line)">·</span>
      <span>2021 - 2026</span>
    </div>
  `;
}

export function renderEducationExpanded() {
  return `
    <h2 style="font-family:var(--font-heading);font-size:var(--text-md);font-weight:200;color:var(--text-primary);margin-bottom:var(--space-5);letter-spacing:0.03em">${t({ en: 'Education', fr: 'Formation' })}</h2>
    ${education.map(edu => {
      let html = `<div style="border-left:2px solid ${edu.highlight ? 'var(--spec-cyan)' : 'var(--accent-dim)'};padding:var(--space-3) var(--space-4);margin-bottom:var(--space-4);${edu.highlight ? 'background:var(--bg-surface);border-radius:2px;padding:var(--space-4)' : ''}">`;
      html += `<div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:400;color:var(--text-primary);margin-bottom:4px">${edu.school}</div>`;
      html += `<div style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:4px">${t(edu.degree)}</div>`;
      if (edu.years) html += `<div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-tertiary);margin-bottom:8px">${t(edu.years)}</div>`;

      if (edu.techStack) {
        html += `<div style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0">${edu.techStack.map(tag => `<span style="font-family:var(--font-mono);font-size:0.6rem;color:var(--spec-cyan);border:1px solid rgba(0,204,255,0.15);padding:2px 8px;border-radius:2px">${tag}</span>`).join('')}</div>`;
      }
      if (edu.detail) html += `<p style="font-size:0.85rem;color:var(--text-tertiary);line-height:1.6;margin:8px 0;max-width:600px">${t(edu.detail)}</p>`;

      if (edu.highlight) {
        const h = edu.highlight;
        if (h.featuredProject) {
          const proj = projects.find(p => p.id === h.featuredProject);
          if (proj) {
            html += `<div style="background:var(--bg-deep);border:1px solid var(--bg-raised);border-radius:2px;padding:var(--space-3);margin:12px 0">`;
            html += `<div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--spec-violet);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:4px">${getLang() === 'fr' ? 'Projet phare' : 'Featured project'}</div>`;
            html += `<div style="font-family:var(--font-heading);font-size:1rem;font-weight:400;color:var(--text-primary);margin-bottom:4px">${t(proj.title)}</div>`;
            html += `<p style="font-size:0.8rem;color:var(--text-tertiary);line-height:1.6;margin-bottom:8px">${t(proj.desc)}</p>`;
            html += `<div style="display:flex;flex-wrap:wrap;gap:6px">${proj.tags.map(tag => `<span style="font-family:var(--font-mono);font-size:0.6rem;color:var(--spec-violet);border:1px solid rgba(136,85,255,0.2);padding:2px 8px;border-radius:2px">${tag}</span>`).join('')}</div>`;
            html += `</div>`;
          }
        }

        html += `<div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-tertiary);border-top:1px solid var(--bg-line);padding-top:8px;margin-top:8px">GPA ${h.gpa} · ${t(h.distinction)} · ${t(h.achievement)}</div>`;
      }
      html += `</div>`;
      return html;
    }).join('')}
  `;
}
