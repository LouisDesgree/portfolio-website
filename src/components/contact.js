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
    `<span class="contact-lang-name">${t(l.name)}</span> <span class="contact-lang-level">${typeof l.level === 'string' ? l.level : t(l.level)}</span>`
  ).join('  \u00b7  ');

  el.innerHTML = `
    <div class="contact-email">${contact.email}</div>
    <div class="contact-phone">${contact.phone}</div>
    <div class="contact-location">${t(contact.location)} \u00b7 ${t(contact.nationality)}</div>
    <div class="contact-languages">${langList}</div>
    <div class="status-indicator">
      <span class="status-dot"></span>
      <span class="status-label">${t(hero.availability)}</span>
    </div>
    <button id="vcard-btn" class="contact-vcard-btn">+ ${isEn ? 'ADD TO CONTACTS' : 'AJOUTER AUX CONTACTS'}</button>
  `;

  // Attach vCard download handler
  document.getElementById('vcard-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    generateVCard();
  });
}
