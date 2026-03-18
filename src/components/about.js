import { about } from '../data/content.js';
import { t } from '../i18n.js';

export function renderAboutExpanded() {
  return `
    <h2 style="font-family:var(--font-heading);font-size:var(--text-md);font-weight:200;color:var(--text-primary);margin-bottom:var(--space-4);letter-spacing:0.03em">${t({ en: 'About Me', fr: 'À Propos' })}</h2>
    <div style="max-width:700px">
      ${about.paragraphs.map(p => `<p style="font-size:1rem;color:var(--text-secondary);line-height:1.8;margin-bottom:var(--space-3)">${t(p)}</p>`).join('')}
    </div>
  `;
}
