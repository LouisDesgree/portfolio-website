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
      <div style="margin-bottom:var(--space-4)">
        <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-secondary);margin-bottom:8px;letter-spacing:0.1em">${year.label} <span style="color:var(--text-ghost)">${year.period}</span></div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${year.projects.map(p => `
            <div style="background:var(--bg-surface);border:1px solid rgba(255,255,255,0.04);padding:6px 10px;border-radius:4px;font-size:0.7rem;min-width:100px;${p.starred ? 'border-color:rgba(112,144,255,0.2)' : ''}${p.team ? '' : ''}">
              <div style="font-weight:400;color:var(--text-primary);margin-bottom:2px">${p.name}${p.count ? ` (${p.count})` : ''}</div>
              <div style="font-family:var(--font-mono);font-size:0.55rem;color:var(--text-ghost)">${p.lang}${p.team ? ' · team' : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Main projects
  const mainHTML = projects.map((proj, i) => `
    <div style="background:var(--bg-surface);border:1px solid ${proj.featured ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'};padding:var(--space-4);border-radius:4px;${proj.featured ? 'grid-column:1/-1' : ''}">
      <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text-ghost);margin-bottom:8px">${proj.context ? t(proj.context) : `p(${i})`}</div>
      <div style="font-size:1.1rem;font-weight:400;color:var(--text-primary);margin-bottom:8px">${t(proj.title)}</div>
      <p style="font-size:0.8rem;color:var(--text-tertiary);line-height:1.6;margin-bottom:12px">${t(proj.desc)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${proj.tags.map(tag => `<span style="font-family:var(--font-mono);font-size:0.55rem;color:var(--text-tertiary);border:1px solid rgba(255,255,255,0.06);padding:2px 8px;border-radius:2px">${tag}</span>`).join('')}</div>
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
    return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      ${icon ? `<i class="${icon}" style="font-size:16px;color:var(--text-secondary);width:20px;text-align:center"></i>` : '<span style="width:20px"></span>'}
      <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-primary)">${l.name}</span>
      <span style="font-family:var(--font-mono);font-size:0.55rem;color:var(--text-tertiary);margin-left:auto">${l.projects} proj</span>
    </div>`;
  }).join('');

  // Extra tools
  const tools = ['Docker', 'Git', 'Linux', 'Pandas', 'NumPy', 'React'];
  const toolsHTML = tools.map(name => {
    const icon = iconMap[name] || '';
    return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      ${icon ? `<i class="${icon}" style="font-size:16px;color:var(--text-secondary);width:20px;text-align:center"></i>` : ''}
      <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-primary)">${name}</span>
    </div>`;
  }).join('');

  return `
    <h2 style="font-family:var(--font-heading);font-size:var(--text-md);font-weight:200;color:var(--text-primary);margin-bottom:var(--space-3)">${isEn ? 'Projects' : 'Projets'}</h2>
    <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--text-tertiary);margin-bottom:var(--space-5);letter-spacing:0.1em">
      ${epitechTechStack.totalProjects}+ ${isEn ? 'PROJECTS' : 'PROJETS'} · ${epitechTechStack.totalYears} ${isEn ? 'YEARS' : 'ANS'} · ${epitechTechStack.languages.length} ${isEn ? 'LANGUAGES' : 'LANGAGES'}
    </div>

    <div style="display:grid;grid-template-columns:200px 1fr;gap:var(--space-5)">
      <!-- Left: Tech stack with icons -->
      <div>
        <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:12px">${isEn ? 'Languages' : 'Langages'}</div>
        ${techSidebar}
        <div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.15em;margin:16px 0 12px">${isEn ? 'Tools' : 'Outils'}</div>
        ${toolsHTML}
      </div>

      <!-- Right: Projects + Epitech map -->
      <div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-4);margin-bottom:var(--space-5)">
          ${mainHTML}
        </div>

        <h3 style="font-family:var(--font-heading);font-size:1.2rem;font-weight:300;color:var(--text-primary);margin-bottom:var(--space-3)">Epitech ${isEn ? 'Project Map' : 'Carte des Projets'}</h3>
        ${epitechHTML}
      </div>
    </div>
  `;
}
