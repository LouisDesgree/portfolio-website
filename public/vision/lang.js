/* ============================================================
   Vision — i18n EN / FR
   ============================================================
   API :
     VisionI18n.t(en, fr)     pick the right one
     VisionI18n.getLang()     "en" | "fr"
     VisionI18n.setLang(l)    switch + persist + refresh DOM
     VisionI18n.applyTranslations()   reapply data-i18n-* attrs

   Static HTML : use data-i18n-en + data-i18n-fr (textContent),
                 or data-i18n-html-en/fr (innerHTML),
                 or data-i18n-placeholder-en/fr.

   Default text in source HTML is FR (current). On boot, if
   browser lang is en, we swap. If user already chose, we honor.
   ============================================================ */

(function () {
  "use strict";

  let lang = localStorage.getItem("vision:lang");
  if (lang !== "en" && lang !== "fr") {
    lang = "en";
  }

  function getLang() { return lang; }

  function t(en, fr) { return lang === "en" ? en : fr; }

  function setLang(newLang) {
    if (newLang !== "en" && newLang !== "fr") return;
    if (newLang === lang) return;
    lang = newLang;
    try { localStorage.setItem("vision:lang", lang); } catch (e) {}
    applyTranslations();
    document.documentElement.lang = lang;
    document.dispatchEvent(new CustomEvent("vision:langchange", { detail: { lang } }));
  }

  function applyTranslations() {
    const suffix = lang === "en" ? "En" : "Fr";
    document.querySelectorAll("[data-i18n-en][data-i18n-fr]").forEach(el => {
      el.textContent = el.dataset[`i18n${suffix}`];
    });
    document.querySelectorAll("[data-i18n-html-en][data-i18n-html-fr]").forEach(el => {
      el.innerHTML = el.dataset[`i18nHtml${suffix}`];
    });
    document.querySelectorAll("[data-i18n-placeholder-en][data-i18n-placeholder-fr]").forEach(el => {
      el.placeholder = el.dataset[`i18nPlaceholder${suffix}`];
    });
    document.querySelectorAll("[data-i18n-title-en][data-i18n-title-fr]").forEach(el => {
      el.title = el.dataset[`i18nTitle${suffix}`];
    });
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang-btn]").forEach(b => {
      b.classList.toggle("active", b.dataset.langBtn === lang);
    });
  }

  // Initial application on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyTranslations);
  } else {
    applyTranslations();
  }

  window.VisionI18n = { getLang, setLang, t, applyTranslations };
})();
