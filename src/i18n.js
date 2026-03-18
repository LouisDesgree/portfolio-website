// ============================================================
// i18n - Bilingual support (EN/FR)
// ============================================================

const STORAGE_KEY = 'portfolio-lang';
let currentLang = 'en';
const listeners = [];

export function initI18n() {
  // Check localStorage, then browser language
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (stored === 'en' || stored === 'fr')) {
    currentLang = stored;
  } else {
    const browserLang = navigator.language?.substring(0, 2);
    currentLang = browserLang === 'fr' ? 'fr' : 'en';
  }
  document.documentElement.lang = currentLang;
  updateToggleUI();
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (lang !== 'en' && lang !== 'fr') return;
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  updateToggleUI();
  listeners.forEach(fn => fn(lang));
}

export function toggleLang() {
  setLang(currentLang === 'en' ? 'fr' : 'en');
}

export function onLangChange(fn) {
  listeners.push(fn);
}

/** Resolve a bilingual value: { en: '...', fr: '...' } or plain string */
export function t(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[currentLang] || value.en || '';
}

function updateToggleUI() {
  const toggle = document.getElementById('lang-toggle');
  if (!toggle) return;
  toggle.querySelectorAll('.lang-option').forEach(el => {
    el.classList.toggle('active', el.dataset.lang === currentLang);
  });
}
