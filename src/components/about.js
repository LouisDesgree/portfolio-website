import { about } from '../data/content.js';
import { t } from '../i18n.js';

export function renderAboutExpanded() {
  return `
    <h2 class="expanded-heading">${t({ en: 'About Me', fr: 'À Propos' })}</h2>
    <div class="expanded-body">
      ${about.paragraphs.map(p => `<p class="expanded-paragraph">${t(p)}</p>`).join('')}
    </div>
  `;
}
