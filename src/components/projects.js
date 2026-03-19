import { projects } from '../data/content.js';
import { epitechProjects, epitechTechStack } from '../data/epitech-projects.js';
import { t, getLang } from '../i18n.js';

export function renderProjectsPreview() {
  const el = document.getElementById('projects-preview');
  if (!el) return;
  const lang = getLang();
  el.innerHTML = `
    <div class="tile-project-preview">
      <div class="tile-project-context">${lang === 'fr' ? 'EPITECH · 5 ANS' : 'EPITECH · 5 YEARS'}</div>
      <div class="tile-project-name">${epitechTechStack.totalProjects}+ ${lang === 'fr' ? 'projets' : 'projects'}</div>
      <div class="tile-project-tags">
        ${epitechTechStack.languages.slice(0, 4).map(l => `<span class="tile-tag">${l.name}</span>`).join('')}
      </div>
    </div>
    <div class="tile-project-preview" style="margin-top:8px">
      <div class="tile-project-context">${projects[0].context ? t(projects[0].context) : ''}</div>
      <div class="tile-project-name">${t(projects[0].title)}</div>
    </div>
    <div class="tile-project-preview" style="margin-top:8px">
      <div class="tile-project-context">${projects[1].context ? t(projects[1].context) : ''}</div>
      <div class="tile-project-name">${t(projects[1].title)}</div>
    </div>
    <div class="tile-project-preview" style="margin-top:8px">
      <div class="tile-project-context">${projects[2].context ? t(projects[2].context) : ''}</div>
      <div class="tile-project-name">${t(projects[2].title)}</div>
    </div>
  `;
}

export function renderProjectsExpanded() {
  const lang = getLang();
  const isEn = lang === 'en';

  // Epitech project map by year
  const years = ['year6', 'year5', 'year4', 'year2', 'year1'];
  const epitechHTML = years.map(yearKey => {
    const year = epitechProjects[yearKey];
    if (!year) return '';
    return `
      <div class="epitech-year">
        <div class="epitech-year-label">${year.label} <span class="epitech-year-period">${year.period}</span></div>
        <div class="epitech-grid">
          ${year.projects.map(p => `
            <div class="epitech-project ${p.starred ? 'epitech-project--starred' : ''}">
              <div class="epitech-project-name">${p.name}${p.count ? ` (${p.count})` : ''}</div>
              <div class="epitech-project-meta">${p.lang}${p.team ? ' \u00b7 team' : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Main projects
  const mainHTML = projects.map((proj, i) => `
    <div class="project-expanded-card ${proj.featured ? 'project-expanded-card--featured' : ''}">
      <div class="project-expanded-context">${proj.context ? t(proj.context) : `p(${i})`}</div>
      <div class="project-expanded-title">${t(proj.title)}</div>
      <p class="project-expanded-desc">${t(proj.desc)}</p>
      <div class="project-expanded-tags">${proj.tags.map(tag => `<span class="project-expanded-tag">${tag}</span>`).join('')}</div>
    </div>
  `).join('');

  // Devicon class mapping
  const iconMap = {
    'C': 'devicon-c-plain', 'C++': 'devicon-cplusplus-plain', 'Python': 'devicon-python-plain',
    'Haskell': 'devicon-haskell-plain', 'JavaScript': 'devicon-javascript-plain',
    'TypeScript': 'devicon-typescript-plain', 'Assembly': 'devicon-linux-plain',
    'Kotlin': 'devicon-kotlin-plain', 'Swift': 'devicon-swift-plain', 'Shell': 'devicon-bash-plain',
    'Docker': 'devicon-docker-plain', 'Git': 'devicon-git-plain',
    'Pandas': 'devicon-pandas-plain', 'NumPy': 'devicon-numpy-plain',
    'React': 'devicon-react-original', 'Linux': 'devicon-linux-plain',
  };

  const techSidebar = epitechTechStack.languages.map(l => {
    const icon = iconMap[l.name] || '';
    return `<div class="tech-row">
      ${icon ? `<i class="${icon} tech-icon"></i>` : '<span class="tech-icon-spacer"></span>'}
      <span class="tech-name">${l.name}</span>
      <span class="tech-count">${l.projects} proj</span>
    </div>`;
  }).join('');

  // Extra tools
  const tools = ['Docker', 'Git', 'Linux', 'Pandas', 'NumPy', 'React'];
  const toolsHTML = tools.map(name => {
    const icon = iconMap[name] || '';
    return `<div class="tech-row">
      ${icon ? `<i class="${icon} tech-icon"></i>` : ''}
      <span class="tech-name">${name}</span>
    </div>`;
  }).join('');

  return `
    <h2 class="expanded-heading expanded-heading--compact">${isEn ? 'Projects' : 'Projets'}</h2>
    <div class="expanded-subtitle">
      ${epitechTechStack.totalProjects}+ ${isEn ? 'PROJECTS' : 'PROJETS'} \u00b7 ${epitechTechStack.totalYears} ${isEn ? 'YEARS' : 'ANS'} \u00b7 ${epitechTechStack.languages.length} ${isEn ? 'LANGUAGES' : 'LANGAGES'}
    </div>
    <div class="projects-layout">
      <div>
        <div class="projects-sidebar-heading">${isEn ? 'Languages' : 'Langages'}</div>
        ${techSidebar}
        <div class="projects-sidebar-heading projects-sidebar-heading--spaced">${isEn ? 'Tools' : 'Outils'}</div>
        ${toolsHTML}
      </div>
      <div>
        <div class="projects-main-grid">
          ${mainHTML}
        </div>
        <h3 class="expanded-subheading">Epitech ${isEn ? 'Project Map' : 'Carte des Projets'}</h3>
        ${epitechHTML}
      </div>
    </div>
  `;
}
