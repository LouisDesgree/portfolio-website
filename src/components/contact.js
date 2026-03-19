import { contact, languages, hero } from '../data/content.js';
import { t, getLang } from '../i18n.js';

function generateVCard() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Louis Desgrée',
    'N:Desgrée;Louis;;;',
    `EMAIL:${contact.email}`,
    `TEL;TYPE=CELL:${contact.phone}`,
    'ADR;TYPE=HOME:;;Paris;;France',
    'NOTE:Software Engineer - Data Scientist - Python, ML, Full-Stack - LVMH, Fendi Alumni',
    'END:VCARD'
  ].join('\r\n');
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Louis_Desgree.vcf';
  a.click();
  URL.revokeObjectURL(url);
}

export function renderContact() {
  const el = document.getElementById('contact-content');
  if (!el) return;
  const lang = getLang();
  const isEn = lang === 'en';

  const langList = languages.map(l =>
    `<span style="color:var(--text-secondary)">${t(l.name)}</span> <span style="color:var(--text-ghost)">${typeof l.level === 'string' ? l.level : t(l.level)}</span>`
  ).join('  ·  ');

  el.innerHTML = `
    <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-secondary);margin-bottom:5px;letter-spacing:0.02em">${contact.email}</div>
    <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--text-tertiary)">${contact.phone}</div>
    <div style="font-family:var(--font-mono);font-size:0.58rem;color:var(--text-ghost);margin-top:8px">${t(contact.location)} · ${t(contact.nationality)}</div>
    <div style="border-top:1px solid var(--glass-border);margin-top:10px;padding-top:10px;font-family:var(--font-mono);font-size:0.55rem;line-height:1.9">${langList}</div>
    <div style="display:flex;align-items:center;gap:6px;margin-top:10px">
      <span style="width:5px;height:5px;border-radius:50%;background:var(--accent);display:inline-block;box-shadow:0 0 8px var(--tile-glow-color)"></span>
      <span style="font-family:var(--font-mono);font-size:0.5rem;color:var(--accent);letter-spacing:0.1em">${t(hero.availability)}</span>
    </div>
    <button id="vcard-btn" style="margin-top:10px;font-family:var(--font-mono);font-size:0.55rem;color:var(--text-secondary);background:var(--tile-glow-color);border:1px solid var(--glass-hover-border);border-radius:6px;padding:6px 14px;cursor:pointer;letter-spacing:0.08em;transition:all 0.25s ease">+ ${isEn ? 'ADD TO CONTACTS' : 'AJOUTER AUX CONTACTS'}</button>
  `;

  // Attach vCard download handler
  document.getElementById('vcard-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    generateVCard();
  });
}
