// ============================================================
// Analytics — Comprehensive GA4 instrumentation
// All tracking no-ops gracefully when VITE_GA4_ID is missing
// ============================================================

const GA_ID = import.meta.env.VITE_GA4_ID;
let initialized = false;

// ─── Core ─────────────────────────────────────────────────

export function initAnalytics() {
  if (!GA_ID || initialized) return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: true });

  initialized = true;

  // Set user properties & start background trackers
  captureAttribution();
  setDeviceProperties();
  detectReturningVisitor();
  setupSessionMilestones();
  setupVisibilityTracking();
  setupIdleDetection();
  setupCopyTracking();
  setupRageClickDetection();
  setupInputMethodTracking();
  setupWebVitals();
  setupErrorTracking();
  setupNetworkInfo();
  setupPageLoadTiming();
}

function track(name, params = {}) {
  if (!initialized || !window.gtag) return;
  window.gtag('event', name, params);
}

function setUserProps(props) {
  if (!initialized || !window.gtag) return;
  window.gtag('set', 'user_properties', props);
}

// ─── UI Event Exports ─────────────────────────────────────

export function trackLangSwitch(language) {
  setUserProps({ preferred_language: language });
  track('lang_switch', { language });
}

export function trackThemeSwitch(theme) {
  setUserProps({ preferred_theme: theme });
  track('theme_switch', { theme });
}

export function trackTileOpen(tileName) {
  track('tile_open', { tile_name: tileName });
}

export function trackTileClose(tileName, method, durationMs) {
  track('tile_close', {
    tile_name: tileName,
    close_method: method,
    duration_ms: Math.round(durationMs),
  });
}

export function trackSkillView(skillId, skillLabel, cluster) {
  track('skill_view', {
    skill_id: skillId,
    skill_label: skillLabel,
    skill_cluster: cluster,
  });
}

export function trackVCardDownload() {
  track('vcard_download');
}

export function trackOutboundClick(url) {
  track('outbound_click', { link_url: url });
}

export function trackScrollDepth(percent, context = 'page') {
  track('scroll_depth', { percent, scroll_context: context });
}

export function trackTileScrollDepth(tileName, percent) {
  track('tile_scroll_depth', { tile_name: tileName, percent });
}

// ─── Hero Canvas Engagement ───────────────────────────────

export function setupHeroCanvasTracking(canvasEl) {
  if (!initialized || !canvasEl) return;
  let enterTime = 0;
  let totalMs = 0;

  canvasEl.addEventListener('mouseenter', () => { enterTime = performance.now(); });
  canvasEl.addEventListener('mouseleave', () => {
    if (enterTime) {
      totalMs += performance.now() - enterTime;
      enterTime = 0;
      if (totalMs > 2000) {
        track('hero_canvas_engage', { duration_ms: Math.round(totalMs) });
      }
    }
  });
}

// ─── Engagement: Session Milestones ───────────────────────

function setupSessionMilestones() {
  const milestones = [30, 60, 120, 300];
  let idx = 0;
  const start = performance.now();

  const timer = setInterval(() => {
    const elapsed = (performance.now() - start) / 1000;
    if (idx < milestones.length && elapsed >= milestones[idx]) {
      track('session_milestone', { seconds: milestones[idx] });
      idx++;
    }
    if (idx >= milestones.length) clearInterval(timer);
  }, 5000);
}

// ─── Engagement: Tab Visibility ───────────────────────────

function setupVisibilityTracking() {
  let hiddenAt = 0;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      hiddenAt = performance.now();
      track('tab_visibility', { state: 'hidden' });
    } else {
      const duration = hiddenAt ? Math.round(performance.now() - hiddenAt) : 0;
      track('tab_visibility', { state: 'visible', hidden_duration_ms: duration });
      hiddenAt = 0;
    }
  });
}

// ─── Engagement: Idle Detection ───────────────────────────

function setupIdleDetection() {
  const IDLE_TIMEOUT = 60000;
  let timer = null;
  let idleAt = 0;
  let isIdle = false;

  function resetIdle() {
    if (isIdle) {
      const duration = Math.round(performance.now() - idleAt);
      track('engagement_resumed', { idle_duration_ms: duration });
      isIdle = false;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      isIdle = true;
      idleAt = performance.now();
      track('idle_detected', { idle_seconds: IDLE_TIMEOUT / 1000 });
    }, IDLE_TIMEOUT);
  }

  ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt =>
    document.addEventListener(evt, resetIdle, { passive: true, capture: true })
  );
  resetIdle();
}

// ─── Interaction: Copy Tracking ───────────────────────────

function setupCopyTracking() {
  document.addEventListener('copy', () => {
    const text = (window.getSelection() || '').toString().trim();
    if (!text) return;

    let contentType = 'text';
    if (/[\w.-]+@[\w.-]+\.\w+/.test(text)) contentType = 'email';
    else if (/\+?\d[\d\s()-]{6,}/.test(text)) contentType = 'phone';

    track('content_copy', { content_type: contentType });
  });
}

// ─── Interaction: Rage Click Detection ────────────────────

function setupRageClickDetection() {
  const clicks = [];

  document.addEventListener('click', (e) => {
    const now = performance.now();
    const target = e.target;
    clicks.push({ time: now, target });

    // Keep only clicks within last 500ms
    while (clicks.length && now - clicks[0].time > 500) clicks.shift();

    // 3+ clicks on same element within 500ms
    const sameTarget = clicks.filter(c => c.target === target);
    if (sameTarget.length >= 3) {
      track('rage_click', {
        target_tag: target.tagName?.toLowerCase() || 'unknown',
        target_class: (target.className || '').toString().slice(0, 100),
      });
      clicks.length = 0; // Reset to avoid repeat firing
    }
  }, { capture: true });
}

// ─── Interaction: Input Method Detection ──────────────────

function setupInputMethodTracking() {
  let detected = false;
  let hadTouch = false;

  function report(method) {
    if (detected) return;
    detected = true;
    setUserProps({ input_method: method });
    track('input_method', { method });
  }

  document.addEventListener('touchstart', () => {
    hadTouch = true;
    report('touch');
  }, { once: true, passive: true, capture: true });

  document.addEventListener('mousemove', () => {
    if (!hadTouch) report('mouse');
  }, { once: true, passive: true, capture: true });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') report('keyboard');
  }, { capture: true });
}

// ─── Performance: Web Vitals ──────────────────────────────

function setupWebVitals() {
  const vitals = { lcp_ms: 0, fcp_ms: 0, cls: 0 };
  let sent = false;

  function send() {
    if (sent) return;
    sent = true;
    track('web_vitals', vitals);
  }

  // FCP
  try {
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          vitals.fcp_ms = Math.round(entry.startTime);
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });
  } catch (_) { /* unsupported */ }

  // LCP
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length) {
        vitals.lcp_ms = Math.round(entries[entries.length - 1].startTime);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (_) { /* unsupported */ }

  // CLS
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) clsValue += entry.value;
      }
      vitals.cls = Math.round(clsValue * 1000) / 1000;
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (_) { /* unsupported */ }

  // Send after 5s
  setTimeout(send, 5000);
}

// ─── Performance: JS Error Tracking ───────────────────────

function setupErrorTracking() {
  window.addEventListener('error', (e) => {
    track('js_error', {
      message: (e.message || 'unknown').slice(0, 200),
      source: (e.filename || '').split('/').pop() || 'unknown',
      line: e.lineno || 0,
    });
  });

  window.addEventListener('unhandledrejection', (e) => {
    track('js_error', {
      message: ('Promise: ' + String(e.reason || 'unknown')).slice(0, 200),
      source: 'promise',
      line: 0,
    });
  });
}

// ─── Performance: Network Info ────────────────────────────

function setupNetworkInfo() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return;

  track('network_info', {
    type: conn.effectiveType || 'unknown',
    downlink: conn.downlink || 0,
    rtt: conn.rtt || 0,
  });
}

// ─── Performance: Page Load Timing ────────────────────────

function setupPageLoadTiming() {
  if (document.readyState === 'complete') {
    sendLoadTiming();
  } else {
    window.addEventListener('load', () => setTimeout(sendLoadTiming, 0));
  }
}

function sendLoadTiming() {
  const nav = performance.getEntriesByType('navigation')[0];
  if (!nav) return;
  track('page_load', {
    dom_ready_ms: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
    load_ms: Math.round(nav.loadEventEnd - nav.startTime),
  });
}

// ─── Attribution ──────────────────────────────────────────

function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const props = {};

  ['utm_source', 'utm_medium', 'utm_campaign'].forEach(key => {
    const val = params.get(key);
    if (val) props[key] = val;
  });

  if (document.referrer) {
    try {
      props.referrer_domain = new URL(document.referrer).hostname;
    } catch (_) { /* invalid referrer */ }
  }

  if (Object.keys(props).length) setUserProps(props);
}

function detectReturningVisitor() {
  const KEY = 'analytics_visited';
  const returning = !!localStorage.getItem(KEY);
  setUserProps({ returning_visitor: returning });
  if (!returning) localStorage.setItem(KEY, '1');
}

function setDeviceProperties() {
  const w = window.innerWidth;
  const deviceType = w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
  setUserProps({
    device_type: deviceType,
    screen_bucket: `${screen.width}x${screen.height}`,
  });
}
