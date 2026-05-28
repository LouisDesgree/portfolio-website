/* ============================================================
   Vision, Mock financial data
   Reproductible random walk per ticker, pas de réseau, demo-ready.
   ============================================================ */

(function () {
  "use strict";

  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function generatePrices(seed, start, days = 365, vol = 0.018, drift = 0.0004) {
    const rng = mulberry32(seed);
    const out = [start];
    for (let i = 1; i < days; i++) {
      const u1 = Math.max(rng(), 1e-9);
      const u2 = rng();
      // Box-Muller pour des returns plus réalistes
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const ret = drift + vol * z;
      const next = Math.max(out[i - 1] * (1 + ret), 0.1);
      out.push(next);
    }
    return out;
  }

  function makeDateRange(days) {
    const out = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
  }

  const DAYS = 252; // ~1 année boursière
  const DATES = makeDateRange(DAYS);

  const TICKERS = [
    { ticker: "AAPL", name: "Apple Inc.", sector: "Tech", seed: 11, start: 178, vol: 0.018, drift: 0.0006 },
    { ticker: "MSFT", name: "Microsoft Corp.", sector: "Tech", seed: 22, start: 410, vol: 0.015, drift: 0.0008 },
    { ticker: "GOOG", name: "Alphabet Inc.", sector: "Tech", seed: 33, start: 140, vol: 0.019, drift: 0.0005 },
    { ticker: "TSLA", name: "Tesla, Inc.", sector: "Auto", seed: 44, start: 240, vol: 0.038, drift: 0.0001 },
    { ticker: "NVDA", name: "NVIDIA Corp.", sector: "Tech", seed: 55, start: 480, vol: 0.030, drift: 0.0014 },
    { ticker: "META", name: "Meta Platforms", sector: "Tech", seed: 66, start: 480, vol: 0.022, drift: 0.0007 },
    { ticker: "JPM", name: "JPMorgan Chase", sector: "Finance", seed: 77, start: 195, vol: 0.014, drift: 0.0003 },
    { ticker: "XOM", name: "Exxon Mobil", sector: "Énergie", seed: 88, start: 115, vol: 0.016, drift: 0.0002 },
    { ticker: "JNJ", name: "Johnson & Johnson",sector: "Santé", seed: 99, start: 152, vol: 0.011, drift: 0.0002 },
    { ticker: "SPY", name: "S&P 500 ETF", sector: "Indice", seed: 100, start: 510, vol: 0.010, drift: 0.0004 },
  ];

  const PRICES = {};
  TICKERS.forEach(t => {
    PRICES[t.ticker] = generatePrices(t.seed, t.start, DAYS, t.vol, t.drift);
  });

  // Headlines pour les actus (mock, version Home/Portfolio)
  const NEWS = [
    { ticker: "AAPL", title: "Apple dépasse les attentes au T1, services en forte croissance.", sentiment: "pos", date: "2026-05-12" },
    { ticker: "NVDA", title: "NVIDIA annonce une nouvelle puce IA, actions en hausse pré-marché.", sentiment: "pos", date: "2026-05-12" },
    { ticker: "TSLA", title: "Tesla rappelle 50k véhicules pour défaut logiciel.", sentiment: "neg", date: "2026-05-11" },
    { ticker: "MSFT", title: "Microsoft intègre Claude à Copilot pour entreprise.", sentiment: "pos", date: "2026-05-11" },
    { ticker: "META", title: "Meta lance ses lunettes AR en Europe au T3.", sentiment: "pos", date: "2026-05-10" },
    { ticker: "JPM", title: "JPMorgan révise ses prévisions de hausse de taux à la baisse.", sentiment: "neu", date: "2026-05-10" },
    { ticker: "XOM", title: "Pétrole : OPEP+ maintient les quotas, brut à 78$.", sentiment: "neu", date: "2026-05-09" },
    { ticker: "GOOG", title: "Antitrust : Alphabet conteste l'amende européenne.", sentiment: "neg", date: "2026-05-09" },
  ];

  // Base étendue d'actualités structurées pour les nodes News
  // sentiment ∈ [-1, +1] · relevance ∈ [0, 1] · category catégorise le sujet
  const NEWS_DB = [
    // Central banks
    { date: "2026-05-12", title: "Powell évoque une baisse de taux possible en juin", source: "Reuters", category: "central-banks", sentiment: 0.6, relevance: 0.92, tickers: [], sectors: ["Finance", "Tech"] },
    { date: "2026-05-08", title: "BCE maintient ses taux à 3.5%, Lagarde rassurante sur l'inflation", source: "Bloomberg", category: "central-banks", sentiment: 0.2, relevance: 0.7, tickers: [], sectors: ["Finance"] },
    { date: "2026-04-28", title: "Fed minutes : la baisse de taux pourrait être plus progressive que prévu", source: "WSJ", category: "central-banks", sentiment: -0.15, relevance: 0.75, tickers: [], sectors: [] },
    // Géopolitique
    { date: "2026-05-13", title: "Tarifs USA-Chine : nouvelle escalade sur les semi-conducteurs", source: "FT", category: "geopolitics", sentiment: -0.65, relevance: 0.95, tickers: ["NVDA"], sectors: ["Tech"] },
    { date: "2026-05-11", title: "Tensions Taiwan : la Chine annonce des exercices militaires", source: "Reuters", category: "geopolitics", sentiment: -0.45, relevance: 0.85, tickers: ["NVDA"], sectors: ["Tech"] },
    { date: "2026-05-02", title: "Sommet G7 : déclaration commune sur la régulation IA", source: "AFP", category: "geopolitics", sentiment: -0.20, relevance: 0.65, tickers: [], sectors: ["Tech"] },
    { date: "2026-04-19", title: "Iran/Israël : tensions remontent, brut +4%", source: "Bloomberg", category: "geopolitics", sentiment: -0.50, relevance: 0.8, tickers: ["XOM"], sectors: ["Énergie"] },
    // Politique US / EU
    { date: "2026-05-09", title: "Élections US 2026 : les sondages pro-business gagnent du terrain", source: "WSJ", category: "politics-us", sentiment: 0.30, relevance: 0.65, tickers: [], sectors: [] },
    { date: "2026-05-06", title: "France : motion de censure rejetée, gouvernement maintenu", source: "AFP", category: "politics-eu", sentiment: 0.10, relevance: 0.5, tickers: [], sectors: [] },
    { date: "2026-04-22", title: "Royaume-Uni : Premier ministre annonce un plan d'investissement de 50Md£", source: "Reuters", category: "politics-eu", sentiment: 0.35, relevance: 0.55, tickers: [], sectors: [] },
    // Tech / IA
    { date: "2026-05-12", title: "NVIDIA annonce une nouvelle puce IA, actions en hausse pré-marché", source: "Bloomberg", category: "tech", sentiment: 0.85, relevance: 0.9, tickers: ["NVDA"], sectors: ["Tech"] },
    { date: "2026-05-11", title: "Microsoft intègre Claude à Copilot pour l'entreprise", source: "TechCrunch", category: "tech", sentiment: 0.6, relevance: 0.75, tickers: ["MSFT"], sectors: ["Tech"] },
    { date: "2026-05-10", title: "Meta lance ses lunettes AR en Europe au T3", source: "The Verge", category: "tech", sentiment: 0.5, relevance: 0.7, tickers: ["META"], sectors: ["Tech"] },
    { date: "2026-05-12", title: "Apple dépasse les attentes au T1, services en forte croissance", source: "Reuters", category: "earnings", sentiment: 0.70, relevance: 0.8, tickers: ["AAPL"], sectors: ["Tech"] },
    // Régulation
    { date: "2026-05-09", title: "Antitrust : Alphabet conteste l'amende européenne", source: "FT", category: "regulation", sentiment: -0.30, relevance: 0.7, tickers: ["GOOG"], sectors: ["Tech"] },
    { date: "2026-05-07", title: "Régulation IA en Europe : nouveau cadre validé par le Conseil", source: "Politico", category: "regulation", sentiment: -0.40, relevance: 0.85, tickers: [], sectors: ["Tech"] },
    { date: "2026-04-30", title: "DOJ poursuit Meta sur l'usage abusif des données enfants", source: "WSJ", category: "regulation", sentiment: -0.55, relevance: 0.75, tickers: ["META"], sectors: ["Tech"] },
    // Énergie / climat
    { date: "2026-05-09", title: "Pétrole : OPEP+ maintient les quotas, brut à 78$", source: "Reuters", category: "energy", sentiment: 0.0, relevance: 0.65, tickers: ["XOM"], sectors: ["Énergie"] },
    { date: "2026-05-06", title: "Catastrophes climatiques : primes d'assurance en hausse de 12%", source: "Bloomberg", category: "climate", sentiment: -0.40, relevance: 0.55, tickers: [], sectors: ["Finance"] },
    { date: "2026-04-18", title: "Transition énergétique : nouveau plan IRA, +200Md$ sur 5 ans", source: "FT", category: "energy", sentiment: 0.45, relevance: 0.7, tickers: [], sectors: ["Énergie"] },
    // Finance
    { date: "2026-05-10", title: "JPMorgan révise ses prévisions de hausse de taux à la baisse", source: "WSJ", category: "finance", sentiment: 0.20, relevance: 0.65, tickers: ["JPM"], sectors: ["Finance"] },
    { date: "2026-05-04", title: "JPM annonce un programme de rachat d'actions de 30Md$", source: "Bloomberg", category: "corporate", sentiment: 0.70, relevance: 0.75, tickers: ["JPM"], sectors: ["Finance"] },
    // Scandales / corporate
    { date: "2026-05-11", title: "Tesla rappelle 50k véhicules pour défaut logiciel", source: "Reuters", category: "scandal", sentiment: -0.55, relevance: 0.7, tickers: ["TSLA"], sectors: ["Auto"] },
    { date: "2026-05-03", title: "Boeing : nouvelle enquête FAA sur le 737 MAX", source: "WSJ", category: "scandal", sentiment: -0.70, relevance: 0.7, tickers: [], sectors: [] },
    // Santé
    { date: "2026-05-08", title: "Johnson & Johnson : nouveau traitement Alzheimer approuvé", source: "FT", category: "healthcare", sentiment: 0.65, relevance: 0.55, tickers: ["JNJ"], sectors: ["Santé"] },
    // Macro
    { date: "2026-05-09", title: "Inflation US à 2.4% en avril, en ligne avec les attentes", source: "BLS", category: "macro", sentiment: 0.35, relevance: 0.9, tickers: [], sectors: [] },
    { date: "2026-05-02", title: "Emploi US : 175k créations en avril, taux à 4.2%", source: "BLS", category: "macro", sentiment: 0.40, relevance: 0.85, tickers: [], sectors: [] },
  ];

  // Sentiment moyens (mock, ce que renverrait l'IA en prod)
  const SENTIMENT = {
    AAPL: 0.62, MSFT: 0.70, GOOG: 0.40, TSLA: -0.30, NVDA: 0.85,
    META: 0.55, JPM: 0.10, XOM: 0.05, JNJ: 0.30, SPY: 0.45,
  };

  // Portefeuille initial (modifiable en runtime)
  const INITIAL_PORTFOLIO = [
    { ticker: "AAPL", qty: 12 },
    { ticker: "NVDA", qty: 5 },
    { ticker: "MSFT", qty: 8 },
    { ticker: "JPM", qty: 10 },
  ];

  // === API publique ===
  window.VisionData = {
    DATES,
    TICKERS,
    PRICES,
    NEWS,
    NEWS_DB,
    SENTIMENT,
    INITIAL_PORTFOLIO,

    tickerMeta(t) {
      return TICKERS.find(x => x.ticker === t);
    },

    seriesFor(t) {
      return PRICES[t] || [];
    },

    // Returns en % (utilisé par les nodes)
    returnsFor(t) {
      const s = PRICES[t] || [];
      const r = [];
      for (let i = 1; i < s.length; i++) {
        r.push((s[i] - s[i - 1]) / s[i - 1]);
      }
      return r;
    },

    // Stats récap pour un ticker
    statsFor(t) {
      const s = PRICES[t] || [];
      if (!s.length) return null;
      const r = this.returnsFor(t);
      const mean = r.reduce((a, b) => a + b, 0) / r.length;
      const variance = r.reduce((a, b) => a + (b - mean) ** 2, 0) / r.length;
      const std = Math.sqrt(variance);
      const ann_return = Math.pow(s[s.length - 1] / s[0], 252 / s.length) - 1;
      const ann_vol = std * Math.sqrt(252);
      const sharpe = ann_vol > 0 ? ann_return / ann_vol : 0;
      const max = Math.max(...s);
      const min = Math.min(...s);
      let maxDD = 0, peak = s[0];
      for (const v of s) {
        peak = Math.max(peak, v);
        maxDD = Math.min(maxDD, (v - peak) / peak);
      }
      return {
        last: s[s.length - 1],
        first: s[0],
        change_pct: (s[s.length - 1] / s[0] - 1) * 100,
        ann_return_pct: ann_return * 100,
        ann_vol_pct: ann_vol * 100,
        sharpe,
        max,
        min,
        max_drawdown_pct: maxDD * 100,
      };
    },

    newsFor(t) {
      return NEWS.filter(n => n.ticker === t);
    },
  };
})();
