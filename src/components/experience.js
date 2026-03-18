import { experiences } from '../data/content.js';
import { t } from '../i18n.js';

export function renderExpPreview() {
  const preview = document.getElementById('exp-preview');
  const footer = document.getElementById('exp-footer');
  if (!preview) return;

  // Show latest 3 roles with companies
  const top3 = experiences.slice(0, 3);
  preview.innerHTML = top3.map(exp =>
    `<div style="margin-bottom:6px;padding:4px 0;border-bottom:1px solid var(--glass-border)">
      <div style="color:var(--text-primary);font-size:0.72rem;font-weight:400;margin-bottom:1px">${t(exp.role)}</div>
      <div style="display:flex;align-items:center;gap:4px">
        <span style="color:var(--text-ghost);font-family:var(--font-mono);font-size:0.55rem;letter-spacing:0.04em">${exp.company}</span>
        <span style="color:var(--bg-line)">·</span>
        <span style="color:var(--text-ghost);font-family:var(--font-mono);font-size:0.5rem">${exp.date}</span>
      </div>
    </div>`
  ).join('');

  // Year range + company list
  const years = experiences.map(e => e.date).join(' · ');
  if (footer) footer.textContent = experiences.map(e => e.company).join(' · ');
}

export function renderExperienceExpanded() {
  return `
    <h2 style="font-family:var(--font-heading);font-size:var(--text-md);font-weight:200;color:var(--text-primary);margin-bottom:var(--space-5);letter-spacing:0.03em">${t({ en: 'Experience', fr: 'Expérience' })}</h2>
    <div style="padding-left:var(--space-4);border-left:1px solid var(--bg-line)">
      ${experiences.map((exp, i) => `
        <div style="margin-bottom:var(--space-5);position:relative">
          <div style="position:absolute;left:calc(-1*var(--space-4) - 4px);top:6px;width:9px;height:9px;border-radius:50%;border:2px solid var(--accent);background:var(--bg-deep)"></div>
          <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text-ghost);margin-bottom:4px">[${String(i+1).padStart(2,'0')}, ${exp.date.slice(-4)}]</div>
          <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px;margin-bottom:4px">
            <span style="font-size:1.1rem;font-weight:400;color:var(--text-primary)">${t(exp.role)}</span>
            <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-dim)">${exp.date}</span>
          </div>
          <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-secondary);margin-bottom:8px">${exp.company} ·${t(exp.location)}</div>
          <p style="font-size:0.9rem;color:var(--text-tertiary);line-height:1.7;max-width:600px">${t(exp.desc)}</p>
        </div>
      `).join('')}
    </div>
  `;
}
