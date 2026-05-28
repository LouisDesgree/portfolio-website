/* ============================================================
   Vision, App shell, routing, screens
   ============================================================ */

(function () {
  "use strict";

  // i18n shortcuts
  const tt = (en, fr) => VisionI18n.t(en, fr);
  function L(v) {
    if (v && typeof v === "object" && "en" in v && "fr" in v) return v[VisionI18n.getLang()];
    return v;
  }

  const state = {
    apiKey: null,
    portfolio: VisionData.INITIAL_PORTFOLIO.slice(),
    currentScreen: "welcome",
    currentTab: "home",
  };

  // Re-render everything on language change
  document.addEventListener("vision:langchange", () => {
    refreshAll();
  });
  function refreshAll() {
    renderHome();
    renderPortfolio();
    renderAutoAnalysis();
    // Re-render nodal palette + readouts + result tiles
    if (window.VisionCanvas?.refresh) VisionCanvas.refresh();
  }

  // ============================================================
  // Navigation
  // ============================================================
  function show(screenId) {
    document.querySelectorAll(".onboarding").forEach(el => el.classList.remove("active"));
    const target = document.getElementById(screenId);
    if (target && target.classList.contains("onboarding")) {
      target.classList.add("active");
      document.getElementById("shell").classList.add("hidden");
    } else if (screenId === "shell") {
      document.getElementById("shell").classList.remove("hidden");
      showTab(state.currentTab);
    }
    state.currentScreen = screenId;
  }

  function showTab(tab) {
    state.currentTab = tab;
    document.querySelectorAll("#main > .screen").forEach(s => s.classList.remove("active"));
    document.getElementById(tab)?.classList.add("active");
    document.querySelectorAll(".tab").forEach(t => {
      t.classList.toggle("active", t.dataset.tab === tab);
    });
    // Lazy refresh
    if (tab === "home") renderHome();
    if (tab === "portfolio") renderPortfolio();
    if (tab === "auto-analysis") renderAutoAnalysis();
    if (tab === "brand") renderBrandPage();
    if (tab === "nodal") {
      // Le canvas est déjà init au boot, juste refresh des dimensions
      window.dispatchEvent(new Event("resize"));
    }
  }

  // ============================================================
  // Home
  // ============================================================
  let homeChart = null;
  function renderHome() {
    // Summary cards
    const sumEl = document.getElementById("home-analysis-summary");
    const stats = state.portfolio.map(p => ({
      ticker: p.ticker,
      qty: p.qty,
      stats: VisionData.statsFor(p.ticker),
    }));
    const totalVal = stats.reduce((a, s) => a + s.stats.last * s.qty, 0);
    const startVal = stats.reduce((a, s) => a + s.stats.first * s.qty, 0);
    const delta = ((totalVal - startVal) / startVal) * 100;
    const best = stats.reduce((a, b) => (a.stats.change_pct > b.stats.change_pct ? a : b));
    const worst = stats.reduce((a, b) => (a.stats.change_pct < b.stats.change_pct ? a : b));
    sumEl.innerHTML = `
      <div class="stats-grid">
        <div class="stat">
          <div class="stat-label">${tt("Total value", "Valeur totale")}</div>
          <div class="stat-value">${money(totalVal)}</div>
        </div>
        <div class="stat">
          <div class="stat-label">${tt("1Y performance", "Performance 1A")}</div>
          <div class="stat-value" style="color:${delta >= 0 ? 'var(--success)' : 'var(--danger)'}">${pct(delta)}</div>
        </div>
        <div class="stat">
          <div class="stat-label">${tt("Top performer", "Meilleur actif")}</div>
          <div class="stat-value">${best.ticker} <span style="font-size:13px;color:var(--success)">${pct(best.stats.change_pct)}</span></div>
        </div>
        <div class="stat">
          <div class="stat-label">${tt("Worst", "Plus faible")}</div>
          <div class="stat-value">${worst.ticker} <span style="font-size:13px;color:var(--danger)">${pct(worst.stats.change_pct)}</span></div>
        </div>
      </div>
    `;

    // News
    const newsEl = document.getElementById("home-news");
    const ownedTickers = new Set(state.portfolio.map(p => p.ticker));
    const items = VisionData.NEWS
      .filter(n => ownedTickers.has(n.ticker))
      .concat(VisionData.NEWS.filter(n => !ownedTickers.has(n.ticker)))
      .slice(0, 6);
    newsEl.innerHTML = items
      .map(n => `
        <li>
          <span class="news-ticker">${n.ticker}</span>
          <div>
            <div class="news-title">${n.title}</div>
            <small class="news-sentiment ${n.sentiment}">${sentimentLabel(n.sentiment)} · ${n.date}</small>
          </div>
        </li>
      `)
      .join("");

    // Portfolio chart (sum of holdings)
    const dates = VisionData.DATES;
    const tail = 90;
    const series = dates.slice(-tail).map((_, i) => {
      const idx = dates.length - tail + i;
      return state.portfolio.reduce(
        (a, p) => a + (VisionData.PRICES[p.ticker][idx] || 0) * p.qty,
        0
      );
    });
    const dlast = series[series.length - 1];
    const dfirst = series[0];
    const dChange = ((dlast - dfirst) / dfirst) * 100;
    document.getElementById("home-portfolio-value").textContent = money(dlast);
    const dEl = document.getElementById("home-portfolio-delta");
    dEl.textContent = `${dChange >= 0 ? "+" : ""}${dChange.toFixed(2)}% (90j)`;
    dEl.className = "kpi-delta " + (dChange >= 0 ? "up" : "down");

    if (homeChart) homeChart.destroy();
    const ctx = document.getElementById("home-portfolio-chart").getContext("2d");
    homeChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates.slice(-tail),
        datasets: [
          {
            data: series,
            borderColor: "#4a7c7e",
            backgroundColor: ctxGradient(ctx),
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: chartOptions(),
    });
  }

  // ============================================================
  // Portfolio
  // ============================================================
  let comparisonChart = null;
  const sparkRegistry = new Map();
  function renderPortfolio() {
    const cards = document.getElementById("portfolio-cards");
    cards.innerHTML = "";
    state.portfolio.forEach(p => {
      const meta = VisionData.tickerMeta(p.ticker);
      const stats = VisionData.statsFor(p.ticker);
      const card = document.createElement("div");
      card.className = "asset-card";
      const change = stats.change_pct;
      card.innerHTML = `
        <span class="qty">x${p.qty}</span>
        <div class="ticker">${p.ticker}</div>
        <div class="name">${meta?.name || ""}</div>
        <div class="price">${money(stats.last)}</div>
        <div class="delta ${change >= 0 ? "up" : "down"}">${pct(change)} ${tt("1Y", "1A")}</div>
        <div class="spark-wrap"><canvas class="sparkline" id="spark-${p.ticker}"></canvas></div>
      `;
      cards.appendChild(card);
      // Draw sparkline
      setTimeout(() => {
        const old = sparkRegistry.get(p.ticker);
        if (old) old.destroy();
        const ctx = document.getElementById(`spark-${p.ticker}`).getContext("2d");
        const series = VisionData.seriesFor(p.ticker);
        const chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: series.map((_, i) => i),
            datasets: [
              {
                data: series,
                borderColor: change >= 0 ? "#5b8a5d" : "#b86056",
                fill: false,
                tension: 0.25,
                pointRadius: 0,
                borderWidth: 1.5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } },
          },
        });
        sparkRegistry.set(p.ticker, chart);
      }, 0);
    });

    // Comparison chart (normalisé base 100)
    const ctx = document.getElementById("portfolio-comparison-chart").getContext("2d");
    if (comparisonChart) comparisonChart.destroy();
    const palette = ["#4a7c7e", "#b87b58", "#5b8a5d", "#c9a168", "#8a6b97", "#b86056", "#6b9a9c"];
    const datasets = state.portfolio.map((p, idx) => {
      const series = VisionData.seriesFor(p.ticker);
      const base = series[0];
      return {
        label: p.ticker,
        data: series.map(v => (v / base) * 100),
        borderColor: palette[idx % palette.length],
        backgroundColor: "transparent",
        tension: 0.25,
        pointRadius: 0,
        borderWidth: 1.5,
      };
    });
    comparisonChart = new Chart(ctx, {
      type: "line",
      data: { labels: VisionData.DATES, datasets },
      options: {
        ...chartOptions(),
        plugins: {
          legend: { labels: { color: "#635c52", boxWidth: 10, font: { size: 11 } } },
        },
      },
    });
  }

  // ============================================================
  // Auto analysis, métriques financières détaillées + pédagogie
  // ============================================================
  let allocChart = null;
  let vsMarketChart = null;
  let tipIdx = 0;

  function renderAutoAnalysis() {
    const pfReturns = portfolioReturns(state.portfolio);
    const spyReturns = benchmarkReturns();
    const m = computeMetrics(pfReturns, spyReturns);
    const d = computeDiversification(state.portfolio);
    const score = compositeScore(m, d);

    renderScore(score);
    renderVsMarket(pfReturns, spyReturns, m);
    renderReturnMetrics(m);
    renderRiskMetrics(m);
    renderDivMetrics(d, state.portfolio);
    renderAllocation(state.portfolio);
    renderRiskAttribution(state.portfolio);
    renderNarrative(m, d, state.portfolio, score);
    renderRules(m, d, state.portfolio);
    renderRecos(m, d, state.portfolio);
    renderTip();
  }

  // Risk attribution: pourcentage de contribution au risque total
  let riskAttribChart = null;
  function renderRiskAttribution(portfolio) {
    const n = portfolio.length;
    const last = portfolio.map(p => VisionData.statsFor(p.ticker).last);
    const value = portfolio.map((p, i) => last[i] * p.qty);
    const total = value.reduce((a, b) => a + b, 0);
    const w = value.map(v => v / total);
    const returns = portfolio.map(p => VisionData.returnsFor(p.ticker));
    // Matrice de covariance
    const cov = [];
    for (let i = 0; i < n; i++) {
      cov[i] = [];
      for (let j = 0; j < n; j++) {
        cov[i][j] = sampleCov(returns[i], returns[j]);
      }
    }
    // Variance portefeuille
    let varP = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) varP += w[i] * w[j] * cov[i][j];
    const sigmaP = Math.sqrt(Math.max(varP, 1e-12));
    // MCR_i = (Σ_j w_j cov_ij) / σ_p
    // CCR_i = w_i × MCR_i ; PCR_i = CCR_i / σ_p
    const PCR = [];
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += w[j] * cov[i][j];
      const ccr = (w[i] * s) / sigmaP;
      PCR.push(ccr / sigmaP);
    }
    // Normaliser à 100% (au cas où covariances négatives produisent du < 0)
    const sumPCR = PCR.reduce((a, b) => a + Math.max(0, b), 0) || 1;
    const data = PCR.map(p => (Math.max(0, p) / sumPCR) * 100);

    const ctx = document.getElementById("auto-risk-attribution-chart").getContext("2d");
    if (riskAttribChart) riskAttribChart.destroy();
    const palette = ["#4a7c7e", "#b87b58", "#5b8a5d", "#c9a168", "#8a6b97", "#b86056", "#6b9a9c"];
    riskAttribChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: portfolio.map(p => p.ticker),
        datasets: [{
          data,
          backgroundColor: palette,
          borderColor: "#ffffff",
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { color: "#635c52", boxWidth: 12, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: c => `${c.label}: ${c.parsed.toFixed(1)}% du risque`,
            },
          },
        },
      },
    });
  }
  function sampleCov(a, b) {
    const n = Math.min(a.length, b.length);
    const xs = a.slice(-n), ys = b.slice(-n);
    const mx = xs.reduce((s, v) => s + v, 0) / n;
    const my = ys.reduce((s, v) => s + v, 0) / n;
    let acc = 0;
    for (let i = 0; i < n; i++) acc += (xs[i] - mx) * (ys[i] - my);
    return acc / n;
  }

  // Narrative auto-générée (style conseiller senior)
  function renderNarrative(m, d, portfolio, score) {
    const sentences = [];
    const intro = score.overall >= 80
      ? tt(`Excellent overall score (${score.overall}/100).`, `Excellent score global (${score.overall}/100).`)
      : score.overall >= 65
      ? tt(`Good overall score (${score.overall}/100).`, `Bon score global (${score.overall}/100).`)
      : score.overall >= 50
      ? tt(`Fair score (${score.overall}/100).`, `Score correct (${score.overall}/100).`)
      : tt(`Fragile score (${score.overall}/100).`, `Score fragile (${score.overall}/100).`);
    sentences.push(intro);

    if (m.sharpe >= 1.5) sentences.push(tt(
      `Your portfolio delivers a <strong>Sharpe of ${m.sharpe.toFixed(2)}</strong>, well above the market average (≈ 0.5-0.7). The risk you take is generously rewarded.`,
      `Ton portefeuille délivre un <strong>Sharpe de ${m.sharpe.toFixed(2)}</strong>, bien au-dessus de la moyenne marché (≈ 0.5-0.7). Le risque pris est généreusement récompensé.`
    ));
    else if (m.sharpe >= 1) sentences.push(tt(
      `<strong>Sharpe of ${m.sharpe.toFixed(2)}</strong>, above the long-term market.`,
      `<strong>Sharpe de ${m.sharpe.toFixed(2)}</strong>, au-dessus du marché long terme.`
    ));
    else if (m.sharpe >= 0.5) sentences.push(tt(
      `Sharpe at <strong>${m.sharpe.toFixed(2)}</strong>, in the market average.`,
      `Sharpe à <strong>${m.sharpe.toFixed(2)}</strong>, dans la moyenne marché.`
    ));
    else sentences.push(tt(
      `Weak Sharpe (<strong>${m.sharpe.toFixed(2)}</strong>), the risk is not sufficiently rewarded.`,
      `Sharpe faible (<strong>${m.sharpe.toFixed(2)}</strong>), le risque n'est pas suffisamment récompensé.`
    ));

    if (m.sortino > m.sharpe * 1.3) sentences.push(tt(
      `The Sortino (${m.sortino.toFixed(2)}) is clearly higher than the Sharpe, a sign that your volatility leans more toward the upside (good sign).`,
      `Le Sortino (${m.sortino.toFixed(2)}) est nettement supérieur au Sharpe, signe que ta volatilité est plutôt asymétrique vers le haut (bon signe).`
    ));

    if (d.hhi > 0.40) {
      sentences.push(tt(
        `On the flip side: <strong>${d.maxWeightTicker} weighs ${(d.maxWeight * 100).toFixed(0)}%</strong> of your exposure (HHI ${d.hhi.toFixed(2)}). A single asset in trouble can swing the whole thing.`,
        `En revanche : <strong>${d.maxWeightTicker} pèse ${(d.maxWeight * 100).toFixed(0)}%</strong> de ton exposition (HHI ${d.hhi.toFixed(2)}). Un seul actif en difficulté peut faire basculer l'ensemble.`
      ));
    } else if (d.hhi > 0.30) {
      sentences.push(tt(
        `Concentration is moderate (HHI ${d.hhi.toFixed(2)}, max ${d.maxWeightTicker} at ${(d.maxWeight * 100).toFixed(0)}%).`,
        `La concentration est modérée (HHI ${d.hhi.toFixed(2)}, max ${d.maxWeightTicker} à ${(d.maxWeight * 100).toFixed(0)}%).`
      ));
    }

    if (d.sectorCount < 3) sentences.push(tt(
      `Limited sector diversification (<strong>${d.sectorCount} sectors</strong>: ${d.sectors.join(", ")}). A sector shock would hit your whole portfolio.`,
      `Diversification sectorielle limitée (<strong>${d.sectorCount} secteurs</strong> : ${d.sectors.join(", ")}). Un choc sectoriel toucherait tout ton portefeuille.`
    ));
    else sentences.push(tt(
      `Decent sector diversification (${d.sectorCount} sectors present).`,
      `Diversification sectorielle correcte (${d.sectorCount} secteurs présents).`
    ));

    if (m.maxDD < -0.30) sentences.push(tt(
      `You have already suffered a drawdown of <strong>${(m.maxDD * 100).toFixed(0)}%</strong>, close to a historical crash. Mentally and financially, are you ready to hold if it happens again?`,
      `Tu as déjà subi un drawdown de <strong>${(m.maxDD * 100).toFixed(0)}%</strong>, proche d'un krach historique. Mentalement et financièrement, prévois-tu de tenir si ça se reproduit ?`
    ));
    else if (m.maxDD < -0.15) sentences.push(tt(
      `Worst drawdown over the period is ${(m.maxDD * 100).toFixed(0)}%, typical of a balanced equity PF.`,
      `Le pire drawdown sur la période est de ${(m.maxDD * 100).toFixed(0)}%, typique d'un PF actions équilibré.`
    ));
    else sentences.push(tt(
      `Contained drawdown (${(m.maxDD * 100).toFixed(0)}%), comfortable resilience so far.`,
      `Drawdown contenu (${(m.maxDD * 100).toFixed(0)}%), résilience confortable jusqu'ici.`
    ));

    if (m.kurtExcess > 5) sentences.push(tt(
      `Watch out: your returns distribution shows <strong>pronounced fat tails (kurtosis ${m.kurtExcess.toFixed(1)})</strong>. Crashes are more frequent than a Gaussian model would predict, don't rely only on VaR.`,
      `Attention : la distribution de tes returns montre des <strong>fat tails marquées (kurtosis ${m.kurtExcess.toFixed(1)})</strong>. Les krachs sont plus fréquents que ce qu'un modèle gaussien prédirait, ne te fie pas qu'à la VaR.`
    ));
    if (m.skewness < -0.5) sentences.push(tt(
      `Negative skewness (${m.skewness.toFixed(2)}), distribution leans toward extreme losses.`,
      `Skewness négative (${m.skewness.toFixed(2)}), distribution penchée vers les pertes extrêmes.`
    ));
    else if (m.skewness > 0.5) sentences.push(tt(
      `Positive skewness (${m.skewness.toFixed(2)}), extreme gains more frequent than losses, favorable configuration.`,
      `Skewness positive (${m.skewness.toFixed(2)}), gains extrêmes plus fréquents que pertes, configuration favorable.`
    ));

    if (m.beta > 1.4) sentences.push(tt(
      `High beta (${m.beta.toFixed(2)}): your PF amplifies market moves. Great in a bull, painful in a bear.`,
      `Beta élevé (${m.beta.toFixed(2)}) : ton PF amplifie les mouvements du marché. Génial en bull, douloureux en bear.`
    ));
    else if (m.beta < 0.5) sentences.push(tt(
      `Defensive beta (${m.beta.toFixed(2)}), low market sensitivity, good protection against systemic risk.`,
      `Beta défensif (${m.beta.toFixed(2)}), peu sensible au marché, bonne protection contre le risque systémique.`
    ));

    if (m.alpha > 0.05) sentences.push(tt(
      `You generate a <strong>${(m.alpha * 100).toFixed(1)}%/y alpha</strong> adjusted for the market, your stock-picking really does add value vs a passive ETF.`,
      `Tu génères un <strong>alpha de ${(m.alpha * 100).toFixed(1)}%/an</strong> ajusté du marché, ton stock-picking ajoute réellement de la valeur vs un ETF passif.`
    ));
    else if (m.alpha < -0.03) sentences.push(tt(
      `Negative alpha (${(m.alpha * 100).toFixed(1)}%/y), at equal risk, an S&P ETF would have done better.`,
      `Alpha négatif (${(m.alpha * 100).toFixed(1)}%/an), à risque égal, un ETF S&P aurait fait mieux.`
    ));

    // Action-oriented closing
    const closing = score.overall >= 70
      ? tt(
        "<em>As things stand, your portfolio is sustainable. Keep monitoring diversification as you add positions.</em>",
        "<em>En l'état, ton portefeuille est tenable. Continue de monitorer la diversification à mesure que tu ajoutes des positions.</em>"
      )
      : score.overall >= 50
      ? tt(
        "<em>Notable room for improvement, see the recommendations below.</em>",
        "<em>Marge de progression notable, vois les recommandations ci-dessous.</em>"
      )
      : tt(
        "<em>Multiple weak signals are accumulating, take the time to review your strategy before the next dip.</em>",
        "<em>Plusieurs signaux faibles s'accumulent, prends le temps de réviser ta stratégie avant la prochaine baisse.</em>"
      );
    sentences.push(closing);

    document.getElementById("auto-narrative").innerHTML = sentences.map(s => `<p>${s}</p>`).join("");
  }

  // === Calcul des séries ===
  function portfolioReturns(portfolio) {
    const dates = VisionData.DATES;
    const out = [];
    for (let i = 1; i < dates.length; i++) {
      let pf = 0, pfPrev = 0;
      for (const p of portfolio) {
        const px = VisionData.PRICES[p.ticker];
        pf += px[i] * p.qty;
        pfPrev += px[i - 1] * p.qty;
      }
      out.push(pfPrev > 0 ? (pf - pfPrev) / pfPrev : 0);
    }
    return out;
  }
  function benchmarkReturns() {
    return VisionData.returnsFor("SPY");
  }

  // === Métriques financières ===
  function computeMetrics(returns, bench) {
    const n = returns.length;
    const mean = returns.reduce((a, b) => a + b, 0) / n;
    const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const std = Math.sqrt(variance);

    const ann_return = (Math.pow(1 + mean, 252) - 1);
    const ann_vol = std * Math.sqrt(252);
    const sharpe = ann_vol > 0 ? ann_return / ann_vol : 0;

    // Sortino : ne pénalise que la vol baissière
    const downReturns = returns.filter(r => r < 0);
    const downVar = downReturns.length > 0
      ? downReturns.reduce((a, r) => a + r * r, 0) / n
      : 0;
    const downStd = Math.sqrt(downVar);
    const annDownVol = downStd * Math.sqrt(252);
    const sortino = annDownVol > 0 ? ann_return / annDownVol : 0;

    // Cumul + drawdown
    const cum = [1];
    for (const r of returns) cum.push(cum[cum.length - 1] * (1 + r));
    let peak = cum[0], maxDD = 0, ddStart = 0, ddEnd = 0;
    for (let i = 0; i < cum.length; i++) {
      if (cum[i] > peak) { peak = cum[i]; }
      const dd = (cum[i] - peak) / peak;
      if (dd < maxDD) { maxDD = dd; ddEnd = i; }
    }
    const calmar = maxDD < 0 ? ann_return / Math.abs(maxDD) : 0;

    // VaR / CVaR 95% (queue gauche, 1 jour)
    const sorted = [...returns].sort((a, b) => a - b);
    const k = Math.max(1, Math.floor(0.05 * n));
    const var95 = sorted[k - 1];
    const cvar95 = sorted.slice(0, k).reduce((a, b) => a + b, 0) / k;

    // Skewness / Kurtosis (excès)
    const m3 = returns.reduce((a, r) => a + (r - mean) ** 3, 0) / n;
    const m4 = returns.reduce((a, r) => a + (r - mean) ** 4, 0) / n;
    const skewness = std > 0 ? m3 / Math.pow(std, 3) : 0;
    const kurtExcess = std > 0 ? m4 / Math.pow(std, 4) - 3 : 0;

    // Hit rate + best/worst day
    const hitRate = (returns.filter(r => r > 0).length / n) * 100;
    const best = Math.max(...returns) * 100;
    const worst = Math.min(...returns) * 100;

    // Beta + Alpha + R² vs benchmark
    let beta = 0, alpha = 0, r2 = 0, benchAnn = 0;
    if (bench && bench.length) {
      const bN = Math.min(returns.length, bench.length);
      const r1 = returns.slice(-bN);
      const rB = bench.slice(-bN);
      const m1 = r1.reduce((a, b) => a + b, 0) / bN;
      const mB = rB.reduce((a, b) => a + b, 0) / bN;
      let covar = 0, varB = 0;
      for (let i = 0; i < bN; i++) {
        covar += (r1[i] - m1) * (rB[i] - mB);
        varB += (rB[i] - mB) ** 2;
      }
      covar /= bN;
      varB /= bN;
      beta = varB > 0 ? covar / varB : 0;
      alpha = (m1 - beta * mB) * 252;
      const corr = (varB > 0 && std > 0)
        ? covar / (std * Math.sqrt(varB))
        : 0;
      r2 = corr * corr;
      benchAnn = (Math.pow(1 + mB, 252) - 1);
    }

    return {
      n, mean, std,
      ann_return, ann_vol, sharpe, sortino, calmar,
      maxDD, var95, cvar95,
      skewness, kurtExcess,
      hitRate, best, worst,
      beta, alpha, r2,
      benchAnn,
      cumPF: cum,
    };
  }

  function computeDiversification(portfolio) {
    const total = portfolio.reduce((a, p) => a + VisionData.statsFor(p.ticker).last * p.qty, 0);
    const weights = portfolio.map(p => (VisionData.statsFor(p.ticker).last * p.qty) / total);

    const hhi = weights.reduce((a, w) => a + w * w, 0);
    const effN = hhi > 0 ? 1 / hhi : 0;

    // Corrélation moyenne entre paires
    let corrSum = 0, corrCount = 0;
    for (let i = 0; i < portfolio.length; i++) {
      for (let j = i + 1; j < portfolio.length; j++) {
        const ri = VisionData.returnsFor(portfolio[i].ticker);
        const rj = VisionData.returnsFor(portfolio[j].ticker);
        corrSum += corr(ri, rj);
        corrCount++;
      }
    }
    const avgCorr = corrCount > 0 ? corrSum / corrCount : 0;

    const sectors = [...new Set(portfolio.map(p => VisionData.tickerMeta(p.ticker)?.sector))];
    const maxWeight = Math.max(...weights);
    const maxWeightTicker = portfolio[weights.indexOf(maxWeight)].ticker;

    return {
      hhi, effN, avgCorr,
      sectorCount: sectors.length, sectors,
      maxWeight, maxWeightTicker,
      weights, total,
    };
  }

  function corr(a, b) {
    const n = Math.min(a.length, b.length);
    const xs = a.slice(-n), ys = b.slice(-n);
    const mx = xs.reduce((s, v) => s + v, 0) / n;
    const my = ys.reduce((s, v) => s + v, 0) / n;
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      dx += (xs[i] - mx) ** 2;
      dy += (ys[i] - my) ** 2;
    }
    return dx > 0 && dy > 0 ? num / Math.sqrt(dx * dy) : 0;
  }

  function compositeScore(m, d) {
    // Performance: basé sur Sharpe + Sortino
    const perf = clamp(50 + m.sharpe * 20 + m.sortino * 5, 0, 100);
    // Risque: drawdown + CVaR + skewness
    const ddPenalty = Math.abs(m.maxDD) * 100; // % perte
    const tailPenalty = Math.abs(m.cvar95) * 1000; // queue gauche
    const skewBonus = Math.max(0, m.skewness) * 10;
    const risk = clamp(100 - ddPenalty - tailPenalty + skewBonus, 0, 100);
    // Diversification: HHI + corrélation + secteurs
    const hhiScore = (1 - Math.min(1, m.hhi || d.hhi || 0)) * 100;
    const corrScore = (1 - Math.min(1, Math.abs(d.avgCorr))) * 100;
    const sectScore = Math.min(100, d.sectorCount * 25);
    const div = clamp((hhiScore + corrScore + sectScore) / 3, 0, 100);

    const overall = (perf + risk + div) / 3;
    return {
      perf: Math.round(perf),
      risk: Math.round(risk),
      div: Math.round(div),
      overall: Math.round(overall),
    };
  }

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  // === Rendu Score ===
  function renderScore(score) {
    document.getElementById("auto-score").textContent = score.overall;
    const grade = score.overall >= 80 ? tt("Excellent", "Excellent")
      : score.overall >= 65 ? tt("Good", "Bon")
      : score.overall >= 50 ? tt("Fair", "Correct")
      : score.overall >= 35 ? tt("Fragile", "Fragile")
      : tt("Concerning", "Préoccupant");
    document.getElementById("auto-score-title").textContent = tt(
      `Overall score: ${score.overall}/100, ${grade}`,
      `Score global : ${score.overall}/100, ${grade}`
    );
    document.getElementById("auto-score-summary").textContent = tt(
      "Composite of Performance (Sharpe + Sortino), Risk (drawdown + tail), and Diversification (HHI + correlation).",
      "Composite de Performance (Sharpe + Sortino), Risque (drawdown + tail) et Diversification (HHI + corr.)."
    );

    const axes = [
      { name: tt("Performance", "Performance"), val: score.perf },
      { name: tt("Risk", "Risque"), val: score.risk },
      { name: tt("Diversification", "Diversification"), val: score.div },
    ];
    document.getElementById("auto-score-axes").innerHTML = axes.map(a => `
      <div class="score-axis">
        <span class="lbl">${a.name}</span>
        <div class="bar"><span style="width:${a.val}%"></span></div>
        <span class="val">${a.val}/100</span>
      </div>
    `).join("");
  }

  // === Rendu vs Marché ===
  function renderVsMarket(pfR, spyR, m) {
    const n = Math.min(pfR.length, spyR.length);
    const cumPF = [100], cumSPY = [100];
    for (let i = 0; i < n; i++) {
      cumPF.push(cumPF[i] * (1 + pfR.slice(-n)[i]));
      cumSPY.push(cumSPY[i] * (1 + spyR.slice(-n)[i]));
    }
    const finalPF = cumPF[cumPF.length - 1];
    const finalSPY = cumSPY[cumSPY.length - 1];
    const excess = finalPF - finalSPY;

    document.getElementById("auto-vs-market").innerHTML =
      `${tt("PF", "PF")} : <strong>${finalPF.toFixed(0)}</strong> · SPY : <strong>${finalSPY.toFixed(0)}</strong> · ` +
      `${tt("Gap", "Écart")} : <strong style="color:${excess >= 0 ? 'var(--success)' : 'var(--danger)'}">${excess >= 0 ? "+" : ""}${excess.toFixed(0)} pts</strong>`;

    if (vsMarketChart) vsMarketChart.destroy();
    const ctx = document.getElementById("auto-vs-market-chart").getContext("2d");
    vsMarketChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: VisionData.DATES.slice(-n - 1),
        datasets: [
          { label: tt("Portfolio", "Portefeuille"), data: cumPF, borderColor: "#4a7c7e", backgroundColor: "transparent", borderWidth: 2, tension: 0.25, pointRadius: 0 },
          { label: "S&P 500", data: cumSPY, borderColor: "#b87b58", backgroundColor: "transparent", borderWidth: 1.5, borderDash: [4, 4], tension: 0.25, pointRadius: 0 },
        ],
      },
      options: {
        ...chartOptions(),
        plugins: {
          legend: { labels: { color: "#635c52", boxWidth: 12, font: { size: 11 } } },
        },
      },
    });

    const betaStatus = Math.abs(m.beta - 1) < 0.2 ? "ok" : Math.abs(m.beta) > 1.4 ? "warn" : "ok";
    const alphaStatus = m.alpha > 0.02 ? "ok" : m.alpha < -0.02 ? "bad" : "warn";
    const r2Status = m.r2 > 0.7 ? "warn" : "ok";

    document.getElementById("auto-market-metrics").innerHTML = [
      metricCard({
        label: "Beta (β)", value: m.beta, format: v => v.toFixed(2),
        status: betaStatus,
        bench: tt("Defensive < 0.7 · Aligned 0.8-1.2 · Aggressive > 1.3", "Défensif < 0.7 · Aligné 0.8-1.2 · Agressif > 1.3"),
        explain: betaInterpretation(m.beta),
        formula: "β = Cov(R_pf, R_market) / Var(R_market)",
        formulaDesc: tt(
          "Average sensitivity of the PF to market moves. β = 1.5 → if SPY +1%, your PF moves +1.5% on average.",
          "Sensibilité moyenne du PF aux mouvements du marché. β = 1.5 → si SPY +1%, ton PF fait +1.5% en moyenne."
        ),
      }),
      metricCard({
        label: tt("Alpha (α) annualized", "Alpha (α) annualisé"), value: m.alpha * 100, format: v => pct(v),
        status: alphaStatus,
        bench: tt("Good > +3%/y · Mediocre 0-3% · Bad < 0", "Bon > +3%/an · Médiocre 0-3% · Mauvais < 0"),
        explain: alphaInterpretation(m.alpha),
        formula: "α = (R_pf − β·R_market) × 252",
        formulaDesc: tt(
          "Extra return vs what your β should have produced. Positive = you beat the market adjusted for risk.",
          "Rendement supplémentaire vs ce qu'aurait dû produire ton β. Positif = tu bats le marché ajusté du risque."
        ),
      }),
      metricCard({
        label: tt("R² to market", "R² au marché"), value: m.r2, format: v => v.toFixed(2),
        status: r2Status,
        bench: tt("Independent < 0.4 · Mixed 0.4-0.7 · Follower > 0.7", "Indépendant < 0.4 · Mixte 0.4-0.7 · Suiveur > 0.7"),
        explain: tt(
          `${(m.r2 * 100).toFixed(0)}% of your variance is explained by the market. ${m.r2 > 0.7 ? "Highly correlated to the market, little value-add." : "Not too much of a follower, good sign."}`,
          `${(m.r2 * 100).toFixed(0)}% de ta variance est expliquée par le marché. ${m.r2 > 0.7 ? "Très corrélé au marché, peu de valeur ajoutée." : "Pas trop suiveur, bon signe."}`
        ),
        formula: "R² = Corr(R_pf, R_market)²",
        formulaDesc: tt("Share of PF variance explained by market movements.", "Part de la variance du PF expliquée par les mouvements du marché."),
      }),
    ].join("");
  }

  // === Rendu Métriques de Rendement ===
  function renderReturnMetrics(m) {
    const sharpeStatus = m.sharpe > 1 ? "ok" : m.sharpe > 0.5 ? "warn" : "bad";
    const sortinoStatus = m.sortino > 1.5 ? "ok" : m.sortino > 0.7 ? "warn" : "bad";
    const calmarStatus = m.calmar > 1 ? "ok" : m.calmar > 0.3 ? "warn" : "bad";
    const cagrStatus = m.ann_return > 0.08 ? "ok" : m.ann_return > 0 ? "warn" : "bad";

    document.getElementById("auto-return-metrics").innerHTML = [
      metricCard({
        label: tt("CAGR (annualized return)", "CAGR (rendement annualisé)"), value: m.ann_return * 100, format: pct,
        status: cagrStatus,
        bench: tt("S&P long term ≈ 8%/y · Good > 10% · Mediocre < 4%", "S&P long terme ≈ 8%/an · Bon > 10% · Médiocre < 4%"),
        explain: m.ann_return > 0
          ? tt(`At this pace, your PF doubles every ${(Math.log(2) / Math.log(1 + m.ann_return)).toFixed(0)} years.`, `À ce rythme, ton PF double tous les ${(Math.log(2) / Math.log(1 + m.ann_return)).toFixed(0)} ans.`)
          : tt("Negative annualized return, compounded loss.", "Rendement annualisé négatif, perte composée."),
        formula: "CAGR = (1 + mean)^252 − 1",
        formulaDesc: tt("The compound annual return. More stable than the simple mean for comparing assets.", "Le rendement annuel composé. Plus stable que la moyenne simple pour comparer des actifs."),
      }),
      metricCard({
        label: "Sharpe Ratio", value: m.sharpe, format: v => v.toFixed(2),
        status: sharpeStatus,
        bench: tt("Market ≈ 0.5-0.7 · Good > 1 · Excellent > 1.5", "Marché ≈ 0.5-0.7 · Bon > 1 · Excellent > 1.5"),
        explain: sharpeInterpretation(m.sharpe),
        formula: "Sharpe = (R_ann − R_riskfree) / σ_ann",
        formulaDesc: tt(
          "Return per unit of total volatility. Coined by William Sharpe in 1966. R_riskfree ≈ 0 here (demo mode).",
          "Rendement par unité de volatilité totale. Inventé par William Sharpe en 1966. R_sans_risque ≈ 0 ici (mode démo)."
        ),
      }),
      metricCard({
        label: "Sortino Ratio", value: m.sortino, format: v => v.toFixed(2),
        status: sortinoStatus,
        bench: tt("Good > 1.5 · Excellent > 2.5", "Bon > 1.5 · Excellent > 2.5"),
        explain: m.sortino > m.sharpe * 1.3
          ? tt("Sortino much higher than Sharpe: you don't have big drops, just 'upside' volatility (good sign).", "Sortino bien plus haut que Sharpe : tu n'as pas de grosses baisses, juste de la volatilité 'haussière' (bon signe).")
          : tt("Sortino close to Sharpe: symmetric volatility, no favorable asymmetry.", "Sortino proche du Sharpe : volatilité symétrique, pas d'asymétrie favorable."),
        formula: "Sortino = R_ann / σ_downside_ann",
        formulaDesc: tt(
          "Like Sharpe but only penalizes the volatility of negative days. Fairer, because upside volatility isn't risk.",
          "Comme Sharpe mais ne pénalise QUE la vol des journées négatives. Plus juste, car la vol haussière n'est pas du risque."
        ),
      }),
      metricCard({
        label: "Calmar Ratio", value: m.calmar, format: v => v.toFixed(2),
        status: calmarStatus,
        bench: tt("Good > 1 · Excellent > 3 · Fragile < 0.3", "Bon > 1 · Excellent > 3 · Fragile < 0.3"),
        explain: m.calmar > 1
          ? tt(`You earn ${m.calmar.toFixed(1)}× your worst drawdown per year, fast recovery.`, `Tu gagnes ${m.calmar.toFixed(1)}× ton pire drawdown par an récupération rapide.`)
          : tt("High drawdown relative to return, risk of post-crash stagnation.", "Drawdown élevé par rapport au rendement risque de stagnation post-crash."),
        formula: "Calmar = CAGR / |Max Drawdown|",
        formulaDesc: tt("Measures the 'pain' endured to obtain the return. Favored by hedge fund managers.", "Mesure la 'douleur' subie pour obtenir le rendement. Privilégié par les gérants de hedge funds."),
      }),
    ].join("");
  }

  // === Rendu Métriques de Risque ===
  function renderRiskMetrics(m) {
    const ddStatus = m.maxDD > -0.10 ? "ok" : m.maxDD > -0.25 ? "warn" : "bad";
    const varStatus = m.var95 > -0.02 ? "ok" : m.var95 > -0.04 ? "warn" : "bad";
    const cvarStatus = m.cvar95 > -0.025 ? "ok" : m.cvar95 > -0.05 ? "warn" : "bad";
    const skewStatus = m.skewness > 0 ? "ok" : m.skewness > -0.5 ? "warn" : "bad";
    const kurtStatus = m.kurtExcess < 1 ? "ok" : m.kurtExcess < 5 ? "warn" : "bad";
    const volStatus = m.ann_vol < 0.15 ? "ok" : m.ann_vol < 0.25 ? "warn" : "bad";

    document.getElementById("auto-risk-metrics").innerHTML = [
      metricCard({
        label: tt("Annualized volatility", "Volatilité annualisée"), value: m.ann_vol * 100, format: pct,
        status: volStatus,
        bench: tt("S&P ≈ 15%/y · High > 25% · Low < 10%", "S&P ≈ 15%/an · Élevé > 25% · Faible < 10%"),
        explain: tt(
          `Your returns typically oscillate by ±${(m.ann_vol * 100 / Math.sqrt(252)).toFixed(2)}% per day.`,
          `Tes returns oscillent typiquement de ±${(m.ann_vol * 100 / Math.sqrt(252)).toFixed(2)}% par jour.`
        ),
        formula: "σ_ann = σ_daily × √252",
        formulaDesc: tt("Standard deviation of daily returns, scaled to annual. Measures total dispersion.", "L'écart-type des returns journaliers, mis à l'échelle annuelle. Mesure la dispersion totale."),
      }),
      metricCard({
        label: "Max Drawdown", value: m.maxDD * 100, format: pct,
        status: ddStatus,
        bench: tt("Calm > −10% · Moderate −10/−25% · Severe < −25%", "Calme > −10% · Modéré −10/−25% · Sévère < −25%"),
        explain: ddInterpretation(m.maxDD),
        formula: "MDD = min((cum − peak) / peak)",
        formulaDesc: tt("Worst peak-to-trough fall. Indicator of max psychological pain.", "La pire chute depuis un sommet jusqu'au creux suivant. Indicateur de douleur psychologique maximale."),
      }),
      metricCard({
        label: tt("VaR 95% (1 day)", "VaR 95% (1 jour)"), value: m.var95 * 100, format: pct,
        status: varStatus,
        bench: tt("Moderate > −2% · Risky < −3.5%", "Modéré > −2% · Risqué < −3.5%"),
        explain: tt(
          `1 day out of 20, you can lose more than ${pct(m.var95 * 100)} on the day.`,
          `1 jour sur 20, tu peux perdre plus de ${pct(m.var95 * 100)} sur la journée.`
        ),
        formula: "VaR_95 = 5%_quantile(returns)",
        formulaDesc: tt("The 5th percentile of the returns distribution. Limit: says nothing about loss magnitude beyond.", "Le 5e percentile de la distribution des returns. Limite : ne dit rien sur l'ampleur des pertes au-delà."),
      }),
      metricCard({
        label: "CVaR 95%", value: m.cvar95 * 100, format: pct,
        status: cvarStatus,
        bench: tt("Moderate > −2.5% · Risky < −5%", "Modéré > −2.5% · Risqué < −5%"),
        explain: tt(
          `Across the 5% worst days, you lose ${pct(m.cvar95 * 100)} on average. ${m.cvar95 < m.var95 * 1.5 ? "Not a very thick tail." : "Thick tail, extreme losses more pronounced."}`,
          `Dans les 5% pires journées, tu perds en moyenne ${pct(m.cvar95 * 100)}. ${m.cvar95 < m.var95 * 1.5 ? "Pas de queue très épaisse." : "Queue épaisse, pertes extrêmes plus marquées."}`
        ),
        formula: "CVaR_95 = E[r | r ≤ VaR_95]",
        formulaDesc: tt("Average loss when VaR is exceeded. Much more informative about tail risk. Also called 'Expected Shortfall'.", "Perte moyenne quand on dépasse le VaR. Bien plus informatif sur le risque de queue. Aussi appelé 'Expected Shortfall'."),
      }),
      metricCard({
        label: tt("Skewness", "Skewness (asymétrie)"), value: m.skewness, format: v => v.toFixed(2),
        status: skewStatus,
        bench: tt("Good > 0 · Neutral −0.5/0 · Concerning < −0.5", "Bon > 0 · Neutre −0.5/0 · Préoccupant < −0.5"),
        explain: skewInterpretation(m.skewness),
        formula: "Skew = E[(r − μ)³] / σ³",
        formulaDesc: tt("Normalized 3rd moment. Positive = right tail (more extreme gains). Negative = left tail (crashes).", "3e moment normalisé. Positif = queue à droite (plus de gains extrêmes). Négatif = queue à gauche (krachs)."),
      }),
      metricCard({
        label: tt("Kurtosis (excess)", "Kurtosis (excès)"), value: m.kurtExcess, format: v => v.toFixed(2),
        status: kurtStatus,
        bench: tt("Normal ≈ 0 · Fat-tail > 3 · Very fat > 6", "Normale ≈ 0 · Fat-tail > 3 · Très fat > 6"),
        explain: kurtInterpretation(m.kurtExcess),
        formula: "K_excess = E[(r − μ)⁴] / σ⁴ − 3",
        formulaDesc: tt("Normalized 4th moment minus 3 (normal distribution reference). High = 'fat tails' = crashes / spikes more frequent than expected.", "4e moment normalisé moins 3 (référence loi normale). Élevé = 'fat tails' = krachs/spikes plus fréquents que prévu."),
      }),
    ].join("");
  }

  // === Rendu Diversification ===
  function renderDivMetrics(d, portfolio) {
    const hhiStatus = d.hhi < 0.2 ? "ok" : d.hhi < 0.35 ? "warn" : "bad";
    const effNStatus = d.effN > 4 ? "ok" : d.effN > 2.5 ? "warn" : "bad";
    const corrStatus = d.avgCorr < 0.4 ? "ok" : d.avgCorr < 0.7 ? "warn" : "bad";
    const sectStatus = d.sectorCount >= 4 ? "ok" : d.sectorCount >= 2 ? "warn" : "bad";

    document.getElementById("auto-div-metrics").innerHTML = [
      metricCard({
        label: tt("HHI (concentration)", "HHI (concentration)"), value: d.hhi, format: v => v.toFixed(2),
        status: hhiStatus,
        bench: tt("Diversified < 0.20 · Moderate 0.20-0.35 · Concentrated > 0.35", "Diversifié < 0.20 · Modéré 0.20-0.35 · Concentré > 0.35"),
        explain: tt(
          `Dominant position: ${d.maxWeightTicker} at ${(d.maxWeight * 100).toFixed(0)}% of the PF.`,
          `Position dominante : ${d.maxWeightTicker} à ${(d.maxWeight * 100).toFixed(0)}% du PF.`
        ),
        formula: "HHI = Σ w_i²",
        formulaDesc: tt(
          "Herfindahl-Hirschman Index. Sum of squared weights. HHI = 1 → everything in one asset. HHI = 1/N → equal-weighted.",
          "Indice Herfindahl-Hirschman. Somme des carrés des poids. HHI = 1 → tout dans un actif. HHI = 1/N → équipondéré."
        ),
      }),
      metricCard({
        label: tt("Effective N (1/HHI)", "N effectif (1/HHI)"), value: d.effN, format: v => v.toFixed(1),
        status: effNStatus,
        bench: tt(
          `Actual: ${portfolio.length} assets · Effective target ≥ ${Math.max(3, Math.round(portfolio.length * 0.7))}`,
          `Réel : ${portfolio.length} actifs · Effectif souhaité ≥ ${Math.max(3, Math.round(portfolio.length * 0.7))}`
        ),
        explain: tt(
          `You hold ${portfolio.length} positions, but they 'are worth' ${d.effN.toFixed(1)} equal-weighted positions in terms of diversification.`,
          `Tu détiens ${portfolio.length} positions, mais elles 'valent' ${d.effN.toFixed(1)} positions équipondérées en termes de diversification.`
        ),
        formula: "N_eff = 1 / HHI",
        formulaDesc: tt(
          "'Effective' number of independent bets. If you have 4 lines but 90% in one, N_eff ≈ 1.2.",
          "Nombre 'effectif' de paris indépendants. Si tu as 4 lignes mais 90% sur l'une, N_eff ≈ 1.2."
        ),
      }),
      metricCard({
        label: tt("Average correlation", "Corrélation moyenne"), value: d.avgCorr, format: v => v.toFixed(2),
        status: corrStatus,
        bench: tt("Real diversification < 0.4 · Moderate 0.4-0.7 · Illusory > 0.7", "Vraie diversif. < 0.4 · Modérée 0.4-0.7 · Illusoire > 0.7"),
        explain: d.avgCorr > 0.7
          ? tt("Your assets move together, the diversification is mostly cosmetic.", "Tes actifs bougent ensemble, la diversification est largement cosmétique.")
          : d.avgCorr > 0.4
          ? tt("Moderate correlation, partial diversification.", "Corrélation modérée, diversification partielle.")
          : tt("Low average correlation, real diversification.", "Faible corrélation moyenne, vraie diversification."),
        formula: "ρ̄ = mean of ρ(i, j)",
        formulaDesc: tt(
          "Arithmetic mean of correlations across all pairs. The lower, the more your lines are independent.",
          "Moyenne arithmétique des corrélations entre toutes les paires. Plus c'est bas, plus tes lignes sont indépendantes."
        ),
      }),
      metricCard({
        label: tt("Sector diversification", "Diversification sectorielle"), value: d.sectorCount, format: v => `${v} sec.`,
        status: sectStatus,
        bench: tt("Good ≥ 4 · Moderate 2-3 · Weak 1", "Bon ≥ 4 · Modéré 2-3 · Faible 1"),
        explain: tt(
          `Sectors represented: ${d.sectors.join(", ")}.`,
          `Secteurs représentés : ${d.sectors.join(", ")}.`
        ),
        formula: "count(unique sectors)",
        formulaDesc: tt(
          "Although correlation is the most rigorous indicator, sector diversification remains a good intuitive proxy.",
          "Bien que la corrélation soit l'indicateur le plus rigoureux, la diversification sectorielle reste un bon proxy intuitif."
        ),
      }),
    ].join("");
  }

  // === Allocation chart ===
  function renderAllocation(portfolio) {
    const stats = portfolio.map(p => ({
      ticker: p.ticker,
      value: VisionData.statsFor(p.ticker).last * p.qty,
    }));
    const total = stats.reduce((a, s) => a + s.value, 0);
    if (allocChart) allocChart.destroy();
    const ctx = document.getElementById("auto-allocation-chart").getContext("2d");
    const palette = ["#4a7c7e", "#b87b58", "#5b8a5d", "#c9a168", "#8a6b97", "#b86056", "#6b9a9c"];
    allocChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: stats.map(s => s.ticker),
        datasets: [{
          data: stats.map(s => (s.value / total) * 100),
          backgroundColor: palette,
          borderColor: "#ffffff",
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { color: "#635c52", boxWidth: 12, font: { size: 11 } } },
          tooltip: { callbacks: { label: c => `${c.label}: ${c.parsed.toFixed(1)}%` } },
        },
      },
    });
  }

  // === Business rules ===
  function renderRules(m, d, portfolio) {
    const rules = [
      {
        title: tt("Diversification (HHI)", "Diversification (HHI)"),
        detail: tt(
          `HHI = ${d.hhi.toFixed(2)}. Max position: ${d.maxWeightTicker} at ${(d.maxWeight * 100).toFixed(0)}%.`,
          `HHI = ${d.hhi.toFixed(2)}. Position max : ${d.maxWeightTicker} à ${(d.maxWeight * 100).toFixed(0)}%.`
        ),
        level: d.hhi < 0.25 ? "ok" : d.hhi < 0.4 ? "warn" : "bad",
        value: d.hhi.toFixed(2),
        icon: d.hhi < 0.25 ? "✓" : "!",
      },
      {
        title: tt("Average correlation", "Corrélation moyenne"),
        detail: d.avgCorr < 0.4 ? tt("Real diversification.", "Diversification réelle.") : d.avgCorr < 0.7 ? tt("Partial diversification.", "Diversification partielle.") : tt("Illusory diversification.", "Diversification illusoire."),
        level: d.avgCorr < 0.4 ? "ok" : d.avgCorr < 0.7 ? "warn" : "bad",
        value: d.avgCorr.toFixed(2),
        icon: d.avgCorr < 0.4 ? "✓" : "!",
      },
      {
        title: tt("Sharpe ratio", "Sharpe ratio"),
        detail: sharpeInterpretation(m.sharpe),
        level: m.sharpe >= 1 ? "ok" : m.sharpe >= 0.5 ? "warn" : "bad",
        value: m.sharpe.toFixed(2),
        icon: m.sharpe >= 1 ? "✓" : m.sharpe >= 0.5 ? "!" : "✗",
      },
      {
        title: tt("Max drawdown", "Max drawdown"),
        detail: ddInterpretation(m.maxDD),
        level: m.maxDD > -0.10 ? "ok" : m.maxDD > -0.25 ? "warn" : "bad",
        value: pct(m.maxDD * 100),
        icon: m.maxDD > -0.10 ? "✓" : "!",
      },
      {
        title: tt("Tail risk (CVaR 95%)", "Risque de queue (CVaR 95%)"),
        detail: tt(
          `In the worst 5%, average daily loss = ${pct(m.cvar95 * 100)}.`,
          `Dans le pire 5%, perte moyenne quotidienne = ${pct(m.cvar95 * 100)}.`
        ),
        level: m.cvar95 > -0.025 ? "ok" : m.cvar95 > -0.05 ? "warn" : "bad",
        value: pct(m.cvar95 * 100),
        icon: m.cvar95 > -0.025 ? "✓" : "!",
      },
      {
        title: tt("Skewness", "Asymétrie (skewness)"),
        detail: skewInterpretation(m.skewness),
        level: m.skewness > -0.3 ? "ok" : m.skewness > -0.6 ? "warn" : "bad",
        value: m.skewness.toFixed(2),
        icon: m.skewness > -0.3 ? "✓" : "!",
      },
      {
        title: tt("Market beta", "Beta marché"),
        detail: betaInterpretation(m.beta),
        level: Math.abs(m.beta - 1) < 0.3 ? "ok" : m.beta < 1.5 ? "warn" : "bad",
        value: m.beta.toFixed(2),
        icon: Math.abs(m.beta - 1) < 0.3 ? "✓" : "!",
      },
    ];
    document.getElementById("auto-rules").innerHTML = rules.map(r => `
      <div class="rule ${r.level}">
        <div class="rule-icon">${r.icon}</div>
        <div class="rule-text">
          ${r.title}
          <small>${r.detail}</small>
        </div>
        <div class="rule-value">${r.value}</div>
      </div>
    `).join("");
  }

  // === Dynamic recommendations ===
  function renderRecos(m, d, portfolio) {
    const recos = [];
    if (d.hhi > 0.35) {
      recos.push({ icon: "⚖️", text: tt(
        `Reduce ${d.maxWeightTicker} (${(d.maxWeight * 100).toFixed(0)}% of the PF) to limit idiosyncratic risk. Target: no line above 30%.`,
        `Réduire ${d.maxWeightTicker} (${(d.maxWeight * 100).toFixed(0)}% du PF) pour limiter le risque idiosyncratique. Objectif : aucune ligne > 30%.`
      ) });
    }
    if (d.sectorCount < 3) {
      recos.push({ icon: "🌐", text: tt(
        `You only have ${d.sectorCount} sector(s) (${d.sectors.join(", ")}). Add assets in Healthcare, Energy, or a broad index (SPY) to absorb sector shocks.`,
        `Tu n'as que ${d.sectorCount} secteur(s) (${d.sectors.join(", ")}). Ajoute des actifs dans Santé, Énergie ou un indice large (SPY) pour amortir les chocs sectoriels.`
      ) });
    }
    if (d.avgCorr > 0.7) {
      recos.push({ icon: "🔗", text: tt(
        `Average correlation ${d.avgCorr.toFixed(2)}, your lines move together. Consider truly decorrelated asset classes (gold, bonds, defensives).`,
        `Corrélation moyenne ${d.avgCorr.toFixed(2)}, tes lignes bougent ensemble. Considère des classes d'actifs vraiment décorrélées (or, bonds, défensifs).`
      ) });
    }
    if (m.sharpe < 0.5 && m.ann_return > 0) {
      recos.push({ icon: "📉", text: tt(
        `Weak Sharpe ${m.sharpe.toFixed(2)}: return (${pct(m.ann_return * 100)}/y) does not offset volatility (${pct(m.ann_vol * 100)}). Trim very volatile positions or hedge.`,
        `Sharpe ${m.sharpe.toFixed(2)} faible : le rendement (${pct(m.ann_return * 100)}/an) ne compense pas la vol (${pct(m.ann_vol * 100)}). Réduire les positions très volatiles ou hedger.`
      ) });
    }
    if (m.maxDD < -0.25) {
      recos.push({ icon: "🛡️", text: tt(
        `Drawdown ${pct(m.maxDD * 100)} severe. Consider defensive positions (Healthcare, Consumer Staples, Gold) or a systematic stop-loss to cap the next downside.`,
        `Drawdown ${pct(m.maxDD * 100)} sévère. Envisage des positions défensives (Santé, Conso, Or) ou un stop-loss systématique pour limiter la prochaine baisse.`
      ) });
    }
    if (m.beta > 1.3) {
      recos.push({ icon: "📊", text: tt(
        `Beta ${m.beta.toFixed(2)}: your PF amplifies the market by ${((m.beta - 1) * 100).toFixed(0)}%. Great in a bull, painful in a bear. To calibrate to your horizon.`,
        `Beta ${m.beta.toFixed(2)} : ton PF amplifie le marché de ${((m.beta - 1) * 100).toFixed(0)}%. Génial en bull, douloureux en bear. À calibrer selon ton horizon.`
      ) });
    }
    if (m.skewness < -0.5) {
      recos.push({ icon: "⚠️", text: tt(
        `Skewness ${m.skewness.toFixed(2)}, distribution leans toward extreme losses. Keep cash on hand or consider put options to protect the tails.`,
        `Skewness ${m.skewness.toFixed(2)}, distribution penche vers les pertes extrêmes. Garde des liquidités ou envisage des options put pour protéger les queues.`
      ) });
    }
    if (m.kurtExcess > 5) {
      recos.push({ icon: "💥", text: tt(
        `Kurtosis ${m.kurtExcess.toFixed(1)}: 'black swan' risk higher than a normal distribution suggests. VaR alone isn't enough, watch CVaR.`,
        `Kurtosis ${m.kurtExcess.toFixed(1)} : risque de 'black swan' plus élevé que ne le suggère une loi normale. Le VaR seul ne suffit pas, surveille le CVaR.`
      ) });
    }
    if (m.alpha > 0.05) {
      recos.push({ icon: "🎯", text: tt(
        `Positive alpha ${pct(m.alpha * 100)}/y, your stock-picking adds value vs the market. Keep doing what you're doing.`,
        `Alpha ${pct(m.alpha * 100)}/an positif, ton stock-picking ajoute de la valeur vs le marché. Continue ce que tu fais.`
      ) });
    }
    if (recos.length === 0) {
      recos.push({ icon: "✅", text: tt(
        "Your portfolio is balanced across the measured axes. Keep monitoring drawdown and correlation as you add lines.",
        "Ton portefeuille est équilibré sur les axes mesurés. Continue de monitorer le drawdown et la corrélation à mesure que tu ajoutes des lignes."
      ) });
    }
    document.getElementById("auto-recos").innerHTML = recos.slice(0, 6).map(r => `
      <li><span class="reco-icon">${r.icon}</span><span>${r.text}</span></li>
    `).join("");
  }

  // === Glossary (rotating tips) ===
  const GLOSSARY = [
    {
      title: { en: "Sharpe Ratio (William Sharpe, 1966)", fr: "Sharpe Ratio (William Sharpe, 1966)" },
      text: {
        en: "Return per unit of total volatility. Sharpe > 1 = every unit of risk rewards you more than it costs. The S&P long term sits around 0.5. Limit: penalizes upside volatility the same as downside.",
        fr: "Rendement par unité de volatilité totale. Sharpe > 1 = chaque unité de risque te rapporte plus qu'elle te coûte. Le S&P long terme tourne autour de 0.5. Limite : pénalise la vol haussière comme la vol baissière."
      },
    },
    {
      title: { en: "Sortino Ratio (Frank Sortino, 1980s)", fr: "Sortino Ratio (Frank Sortino, 1980s)" },
      text: {
        en: "A variant of Sharpe that only penalizes the volatility of negative days. Why? Because a +5% day isn't 'risk' in any meaningful sense. Fairer for assessing an asymmetric PF.",
        fr: "Variante du Sharpe qui ne pénalise QUE la vol des journées négatives. Pourquoi ? Parce qu'une journée +5% n'est pas du 'risque' au sens où on l'entend. Plus juste pour évaluer un PF asymétrique."
      },
    },
    {
      title: { en: "Calmar Ratio", fr: "Calmar Ratio" },
      text: {
        en: "Annualized return divided by the worst drawdown. Loved by hedge fund managers: it measures the 'pain' you endure to get the return. Calmar > 1 = good, > 3 = excellent.",
        fr: "Rendement annualisé divisé par le pire drawdown. Apprécié par les gérants de hedge funds : il mesure la 'douleur' à subir pour obtenir le rendement. Calmar > 1 = bon, > 3 = excellent."
      },
    },
    {
      title: { en: "Max Drawdown", fr: "Max Drawdown" },
      text: {
        en: "The worst fall from a historical peak. Psychologically critical: how much can you 'hold' without panicking? A strategy with a great Sharpe but a -50% MDD is unbearable for a human.",
        fr: "La pire chute depuis un sommet historique. Important psychologiquement : combien tu peux 'tenir' sans paniquer ? Une stratégie avec un beau Sharpe mais un MDD à -50% est intenable pour un humain."
      },
    },
    {
      title: { en: "VaR 95% (Value at Risk)", fr: "VaR 95% (Value at Risk)" },
      text: {
        en: "How much you can lose 95% of the time, on a single day. If VaR = -2%, then 1 day out of 20 you can lose more than that. Critical: VaR says NOTHING about how big the losses in the remaining 5% are (see CVaR).",
        fr: "Quel montant tu peux perdre dans 95% des cas, sur une journée. Si VaR = -2%, alors 1 jour sur 20 tu peux perdre plus que ça. Critique : VaR ne dit RIEN sur l'ampleur des pertes dans le 5% restant (cf. CVaR)."
      },
    },
    {
      title: { en: "CVaR (Conditional VaR / Expected Shortfall)", fr: "CVaR (Conditional VaR / Expected Shortfall)" },
      text: {
        en: "The AVERAGE loss when you exceed VaR. If CVaR_95 = -3%, then in the worst 5% of days, you lose 3% on average. More informative than VaR for distribution tails. Mandatory under Basel III.",
        fr: "Perte MOYENNE quand on dépasse le VaR. Si CVaR_95 = -3%, alors dans le pire 5% des jours, tu perds en moyenne 3%. Plus informatif que le VaR pour les queues de distribution. Mandatory dans Bâle III."
      },
    },
    {
      title: { en: "Skewness", fr: "Skewness (asymétrie)" },
      text: {
        en: "Measures whether the distribution leans left or right. Negative skew = more extreme losses than extreme gains (a bad sign). Equities have historically had slightly negative skew.",
        fr: "Mesure si la distribution penche à gauche ou à droite. Skew négative = plus de pertes extrêmes que de gains extrêmes (mauvais signe). Les actions ont historiquement une skew légèrement négative."
      },
    },
    {
      title: { en: "Kurtosis (tails)", fr: "Kurtosis (queues)" },
      text: {
        en: "Measures the thickness of the tails. 'Normal' (excess) kurtosis = 0. High = 'fat tails' = crashes and spikes more frequent than a Gaussian distribution predicts. Financial markets almost always show positive kurtosis, which is why Gaussian models under-estimate risk.",
        fr: "Mesure l'épaisseur des queues. Kurtosis 'normale' = 0 (excès). Élevée = 'fat tails' = krachs et spikes plus fréquents que ne le prédit une loi normale. Les marchés financiers ont presque toujours une kurtosis positive, c'est pourquoi les modèles gaussiens sous-estiment le risque."
      },
    },
    {
      title: { en: "Beta (β)", fr: "Beta (β)" },
      text: {
        en: "Sensitivity to the market. β = 1.5 → if SPY +1%, your PF on average +1.5%. Beta = 0.5 = defensive (utilities, staples). Beta > 1.5 = very aggressive (small caps, tech). Also the basis of CAPM.",
        fr: "Sensibilité au marché. β = 1.5 → si SPY +1%, ton PF en moyenne +1.5%. Beta = 0.5 = défensif (utilities, bons). Beta > 1.5 = très agressif (small caps tech). C'est aussi la base du CAPM."
      },
    },
    {
      title: { en: "Alpha (Jensen, 1968)", fr: "Alpha (Jensen, 1968)" },
      text: {
        en: "EXCESS return relative to what your beta alone should have produced. Positive alpha = you beat the market ADJUSTED FOR RISK. The 'pure' measure of stock picking, independent of market exposure.",
        fr: "Rendement EXCÉDENTAIRE par rapport à ce que ton beta seul aurait dû produire. Alpha positif = tu bats le marché AJUSTÉ DU RISQUE. C'est la mesure 'pure' du stock-picking, indépendante de l'exposition marché."
      },
    },
    {
      title: { en: "Herfindahl-Hirschman Index (HHI)", fr: "Herfindahl-Hirschman Index (HHI)" },
      text: {
        en: "Concentration index. Sum of squared portfolio weights. HHI = 1 → everything in one asset. HHI = 1/N → equal-weighted. Above 0.25 = concentrated. Also used in antitrust (market concentration).",
        fr: "Indice de concentration. Somme des carrés des poids du PF. HHI = 1 → tout dans un actif. HHI = 1/N → équipondéré. Au-dessus de 0.25 = concentré. Utilisé aussi en antitrust (concentration de marché)."
      },
    },
    {
      title: { en: "Effective N (1/HHI)", fr: "N effectif (1/HHI)" },
      text: {
        en: "'Effective' number of independent positions. You can have 10 lines on paper but an effective N of 2 if you have 80% on one. A fairer metric than simple line counting.",
        fr: "Nombre 'effectif' de positions indépendantes. Tu peux avoir 10 lignes au registre mais un N effectif de 2 si tu as 80% sur une. Métrique plus juste que le simple comptage de lignes."
      },
    },
    {
      title: { en: "Average portfolio correlation", fr: "Corrélation moyenne du PF" },
      text: {
        en: "Mean of correlations across every pair of assets. If you hold 10 tech stocks that all move together, your diversification is cosmetic. An average correlation < 0.4 indicates real diversification.",
        fr: "Moyenne des corrélations entre toutes les paires d'actifs. Si tu détiens 10 actions tech qui bougent toutes ensemble, ta diversification est cosmétique. Une corr moyenne < 0.4 indique de la vraie diversification."
      },
    },
  ];

  function renderTip() {
    const t = GLOSSARY[tipIdx % GLOSSARY.length];
    document.getElementById("auto-tip").innerHTML = `<h4>${L(t.title)}</h4><p>${L(t.text)}</p>`;
  }

  // === Helpers d'interprétation ===
  function sharpeInterpretation(s) {
    if (s < 0) return tt("Negative Sharpe, return insufficient given the risk (you'd lose less in cash).", "Sharpe négatif, rendement insuffisant au regard du risque (tu perdrais moins en cash).");
    if (s < 0.5) return tt("Weak Sharpe, the risk you take isn't translating into returns.", "Sharpe faible, le risque pris ne se traduit pas en rendement.");
    if (s < 1) return tt("Acceptable Sharpe, in the long-term market average.", "Sharpe acceptable, dans la moyenne marché long terme.");
    if (s < 1.5) return tt("Good Sharpe, above the market.", "Bon Sharpe, au-dessus du marché.");
    if (s < 2.5) return tt("Excellent Sharpe, very favorable risk / return.", "Excellent Sharpe, risque/rendement très favorable.");
    return tt("Exceptional Sharpe, suspect of overfitting or a lucky period.", "Sharpe exceptionnel, suspect de surajustement ou de période chanceuse.");
  }
  function ddInterpretation(dd) {
    const d = dd * 100;
    if (d > -10) return tt("Contained drawdown, comfortable resilience.", "Drawdown contenu, résilience confortable.");
    if (d > -20) return tt("Moderate drawdown, typical of a balanced equity PF.", "Drawdown modéré, typique d'un PF actions équilibré.");
    if (d > -35) return tt("Significant drawdown, equivalent to a bear market.", "Drawdown significatif, équivalent à un marché bear.");
    return tt("Severe drawdown, close to a historical crash. Watch out.", "Drawdown sévère, proche d'un krach historique. À surveiller.");
  }
  function skewInterpretation(s) {
    if (s > 0.5) return tt("Positive skewness, distribution leans toward extreme gains (rare and favorable).", "Skewness positive, distribution penche vers les gains extrêmes (rare et favorable).");
    if (s > -0.3) return tt("Near-symmetric skewness, balanced distribution.", "Skewness quasi-symétrique, distribution équilibrée.");
    if (s > -0.7) return tt("Negative skewness, slightly more extreme losses than gains. Caution.", "Skewness négative, légèrement plus de pertes extrêmes que de gains. Vigilance.");
    return tt("Very negative skewness, pronounced left tail, asymmetric crash risk.", "Skewness très négative, queue gauche prononcée, risque de krach asymétrique.");
  }
  function kurtInterpretation(k) {
    if (k < 0) return tt("Flat distribution, fewer surprises than a normal distribution (rare).", "Distribution plate, moins de surprises qu'une loi normale (rare).");
    if (k < 1) return tt("Kurtosis close to normal, no abnormal fat tails.", "Kurtosis proche d'une normale, pas de fat tails anormales.");
    if (k < 5) return tt("Moderate fat tails, extreme events more frequent than expected.", "Fat tails modérées, événements extrêmes plus fréquents que prévu.");
    return tt("Marked fat tails, high black swan risk. Don't rely on volatility alone.", "Fat tails marquées, risque de black swan élevé. Ne te fie pas qu'à la vol.");
  }
  function betaInterpretation(b) {
    if (b < 0) return tt("Negative beta, PF inversely correlated with the market (very rare, active hedge).", "Beta négatif, PF inversement corrélé au marché (très rare, hedge actif).");
    if (b < 0.5) return tt("Defensive PF, little sensitivity to market moves.", "PF défensif, peu sensible aux mouvements de marché.");
    if (b < 0.8) return tt("Slightly defensive PF.", "PF légèrement défensif.");
    if (b < 1.2) return tt("PF aligned with the market.", "PF aligné sur le marché.");
    if (b < 1.5) return tt("Aggressive PF, amplifies market moves.", "PF agressif, amplifie les mouvements du marché.");
    return tt("Very aggressive PF, strong amplification, gains and losses magnified.", "PF très agressif, forte amplification, gains et pertes décuplés.");
  }
  function alphaInterpretation(a) {
    const aPct = a * 100;
    if (aPct > 5) return tt(`Strong positive alpha (+${aPct.toFixed(1)}%/y), you clearly beat the market adjusted for risk.`, `Alpha positif fort (+${aPct.toFixed(1)}%/an), tu bats nettement le marché ajusté du risque.`);
    if (aPct > 0) return tt(`Moderate positive alpha (+${aPct.toFixed(1)}%/y), slight value-add vs market.`, `Alpha positif modéré (+${aPct.toFixed(1)}%/an), légère valeur ajoutée vs marché.`);
    if (aPct > -3) return tt(`Slightly negative alpha (${aPct.toFixed(1)}%/y), an S&P ETF would have done better at equal risk.`, `Alpha légèrement négatif (${aPct.toFixed(1)}%/an), un ETF S&P aurait mieux fait, à risque égal.`);
    return tt(`Marked negative alpha (${aPct.toFixed(1)}%/y), significant underperformance vs risk-adjusted market.`, `Alpha négatif marqué (${aPct.toFixed(1)}%/an), sous-performance significative vs marché ajusté.`);
  }

  // === metricCard helper ===
  function metricCard({ label, value, format, status, bench, explain, formula, formulaDesc }) {
    const cls = status ? `metric ${status}` : "metric";
    const statusBadge = status ? `<span class="metric-status ${status}">${statusIcon(status)}</span>` : "";
    const valStr = format ? format(value) : value;
    const explainStr = typeof explain === "function" ? explain(value) : explain;
    return `
      <div class="${cls}">
        <div class="metric-head">
          <span class="metric-label">${label}</span>
          ${statusBadge}
        </div>
        <div class="metric-value">${valStr}</div>
        ${bench ? `<div class="metric-bench">${bench}</div>` : ""}
        ${explainStr ? `<div class="metric-explain">${explainStr}</div>` : ""}
        ${formula ? `
          <details class="metric-formula">
            <summary>Comment c'est calculé ?</summary>
            <code>${formula}</code>
            ${formulaDesc ? `<p>${formulaDesc}</p>` : ""}
          </details>
        ` : ""}
      </div>
    `;
  }
  function statusIcon(s) {
    return {
      ok: tt("✓ good", "✓ bon"),
      warn: tt("! medium", "! moyen"),
      bad: tt("✗ alert", "✗ alerte"),
    }[s] || "";
  }

  // ============================================================
  // Modal: add asset
  // ============================================================
  function openAddAssetModal() {
    const sel = document.getElementById("modal-ticker");
    sel.innerHTML = VisionData.TICKERS
      .filter(t => !state.portfolio.find(p => p.ticker === t.ticker))
      .map(t => `<option value="${t.ticker}">${t.ticker}, ${t.name}</option>`)
      .join("");
    document.getElementById("modal-add-asset").classList.remove("hidden");
  }
  function closeModal() {
    document.getElementById("modal-add-asset").classList.add("hidden");
  }
  function confirmAdd() {
    const ticker = document.getElementById("modal-ticker").value;
    const qty = +document.getElementById("modal-quantity").value;
    if (!ticker || !qty) return;
    state.portfolio.push({ ticker, qty });
    closeModal();
    toast(tt(`${ticker} × ${qty} added.`, `${ticker} × ${qty} ajouté.`), "success");
    renderPortfolio();
    renderHome();
  }

  // ============================================================
  // Helpers
  // ============================================================
  function money(v) {
    return v.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  }
  function pct(v) {
    return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
  }
  function sentimentLabel(s) {
    return {
      pos: tt("positive", "positif"),
      neg: tt("negative", "négatif"),
      neu: tt("neutral", "neutre"),
    }[s] || s;
  }
  function ctxGradient(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, 200);
    g.addColorStop(0, "rgba(74,124,126,0.20)");
    g.addColorStop(1, "rgba(74,124,126,0.02)");
    return g;
  }
  function chartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#8b8276", maxTicksLimit: 6, font: { size: 10 } }, grid: { color: "rgba(45,42,38,0.05)" } },
        y: { ticks: { color: "#8b8276", font: { size: 10 } }, grid: { color: "rgba(45,42,38,0.05)" } },
      },
    };
  }
  function toast(msg, type) {
    const c = document.getElementById("toast-container");
    const t = document.createElement("div");
    t.className = "toast " + (type || "");
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  }

  // ============================================================
  // Wiring
  // ============================================================
  function attach() {
    document.querySelectorAll("[data-go]").forEach(b => {
      b.addEventListener("click", () => show(b.dataset.go));
    });

    // Language toggle
    document.querySelectorAll("[data-lang-btn]").forEach(b => {
      b.addEventListener("click", () => VisionI18n.setLang(b.dataset.langBtn));
    });
    document.querySelectorAll(".tab").forEach(t => {
      t.addEventListener("click", () => showTab(t.dataset.tab));
    });
    document.querySelectorAll("[data-go-tab]").forEach(b => {
      b.addEventListener("click", () => showTab(b.dataset.goTab));
    });

    // API form
    document.getElementById("api-form").addEventListener("submit", e => {
      e.preventDefault();
      const key = document.getElementById("api-key-input").value;
      if (key) {
        state.apiKey = key;
        VisionCanvas.setApiKey(true);
        updateApiStatus(true);
        toast(tt("AI key saved ✓", "Clé IA enregistrée ✓"), "success");
      }
      show("shell");
    });

    document.getElementById("add-asset-btn").addEventListener("click", openAddAssetModal);
    document.getElementById("modal-cancel").addEventListener("click", closeModal);
    document.getElementById("modal-confirm").addEventListener("click", confirmAdd);

    // Canvas controls
    document.getElementById("canvas-run").addEventListener("click", () => {
      VisionCanvas.runGraph();
      toast(tt("Graph executed", "Graph exécuté"));
    });
    document.getElementById("canvas-clear").addEventListener("click", () => {
      VisionCanvas.clear();
      toast(tt("Canvas cleared", "Canvas vidé"));
    });

    // Bibliothèque : démos
    const demoSelect = document.getElementById("demo-select");
    const demoDesc = document.getElementById("demo-desc");
    VisionCanvas.DEMOS.forEach((d, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = L(d.name);
      demoSelect.appendChild(opt);
    });
    function refreshDemoDesc() {
      const d = VisionCanvas.DEMOS[+demoSelect.value];
      demoDesc.textContent = d ? L(d.description) : "";
    }
    demoSelect.addEventListener("change", refreshDemoDesc);
    refreshDemoDesc();
    document.getElementById("demo-load").addEventListener("click", () => {
      const i = +demoSelect.value;
      const d = VisionCanvas.DEMOS[i];
      if (!d) return;
      VisionCanvas.loadDemo(i);
      toast(tt(`Demo "${L(d.name)}" loaded ✓`, `Démo "${L(d.name)}" chargée ✓`), "success");
    });

    // Bibliothèque : sauvegardes
    const savedSelect = document.getElementById("saved-select");
    const saveNameInput = document.getElementById("save-name");
    function refreshSaved() {
      const all = VisionCanvas.listSaved();
      savedSelect.innerHTML = "";
      if (!all.length) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "Aucune sauvegarde";
        opt.disabled = true;
        savedSelect.appendChild(opt);
      } else {
        all.forEach(g => {
          const opt = document.createElement("option");
          opt.value = g.name;
          const date = new Date(g.saved_at).toLocaleDateString("fr-FR");
          opt.textContent = `${g.name} (${date})`;
          savedSelect.appendChild(opt);
        });
      }
    }
    refreshSaved();

    document.getElementById("saved-load").addEventListener("click", () => {
      const name = savedSelect.value;
      if (!name) return toast(tt("No save selected", "Aucune sauvegarde sélectionnée"), "error");
      if (VisionCanvas.loadSaved(name)) toast(tt(`"${name}" loaded ✓`, `"${name}" chargé ✓`), "success");
      else toast(tt("Load failed", "Échec du chargement"), "error");
    });
    document.getElementById("saved-delete").addEventListener("click", () => {
      const name = savedSelect.value;
      if (!name) return;
      if (!confirm(tt(`Delete "${name}"?`, `Supprimer "${name}" ?`))) return;
      VisionCanvas.deleteSaved(name);
      refreshSaved();
      toast(tt(`"${name}" deleted`, `"${name}" supprimé`));
    });
    document.getElementById("save-current").addEventListener("click", () => {
      const name = saveNameInput.value.trim();
      if (!name) return toast(tt("Give the graph a name", "Donne un nom au graph"), "error");
      if (VisionCanvas.saveGraph(name)) {
        saveNameInput.value = "";
        refreshSaved();
        savedSelect.value = name;
        toast(tt(`"${name}" saved ✓`, `"${name}" sauvegardé ✓`), "success");
      } else {
        toast(tt("Save failed", "Échec de la sauvegarde"), "error");
      }
    });
    saveNameInput.addEventListener("keydown", e => {
      if (e.key === "Enter") document.getElementById("save-current").click();
    });

    // Risk slider
    const risk = document.getElementById("param-risk");
    const riskOut = document.getElementById("param-risk-out");
    risk.addEventListener("input", () => {
      riskOut.textContent = `${risk.value} / 10`;
    });

    // Tip rotation
    document.getElementById("auto-tip-next")?.addEventListener("click", () => {
      tipIdx = (tipIdx + 1) % GLOSSARY.length;
      renderTip();
    });

    // Command palette ⌘K
    initCmdK();

    // Groupes
    const groupNameInput = document.getElementById("group-name");
    const groupCreateBtn = document.getElementById("group-create");
    const groupStatusEl = document.getElementById("group-selection-status");
    const groupSelectEl = document.getElementById("group-select");

    function refreshGroupList() {
      const groups = VisionCanvas.listGroups();
      groupSelectEl.innerHTML = "";
      if (!groups.length) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "Aucun groupe";
        opt.disabled = true;
        groupSelectEl.appendChild(opt);
      } else {
        groups.forEach(g => {
          const opt = document.createElement("option");
          opt.value = g.name;
          opt.textContent = `${g.name} (${g.nodes.length} nodes)`;
          opt.title = g.description;
          groupSelectEl.appendChild(opt);
        });
      }
    }
    // Expose refreshGroupList globally so boot can re-call after init
    window._refreshGroupList = refreshGroupList;
    refreshGroupList();

    VisionCanvas.onSelectionChange = sel => {
      const n = sel.size;
      groupStatusEl.textContent = tt(
        `${n} node${n !== 1 ? "s" : ""} selected.`,
        `${n} node${n > 1 ? "s" : ""} sélectionné${n > 1 ? "s" : ""}.`
      );
      groupCreateBtn.disabled = n < 2 || !groupNameInput.value.trim();
    };
    groupNameInput.addEventListener("input", () => {
      const n = VisionCanvas.selectedIds.length;
      groupCreateBtn.disabled = n < 2 || !groupNameInput.value.trim();
    });
    groupCreateBtn.addEventListener("click", () => {
      const name = groupNameInput.value.trim();
      const ids = VisionCanvas.selectedIds;
      if (VisionCanvas.createGroupFromSelection(ids, name)) {
        groupNameInput.value = "";
        refreshGroupList();
        groupCreateBtn.disabled = true;
      }
    });
    groupNameInput.addEventListener("keydown", e => {
      if (e.key === "Enter" && !groupCreateBtn.disabled) groupCreateBtn.click();
    });

    document.getElementById("group-delete").addEventListener("click", () => {
      const name = groupSelectEl.value;
      if (!name) return;
      if (!confirm(`Supprimer le groupe "${name}" ?\n\nLes graphs qui l'utilisent ne fonctionneront plus.`)) return;
      VisionCanvas.deleteGroup(name);
      refreshGroupList();
      toast(tt(`"${name}" deleted`, `"${name}" supprimé`));
    });
    document.getElementById("group-ungroup").addEventListener("click", () => {
      const ids = VisionCanvas.selectedIds;
      if (!ids.length) return toast(tt("Select a group node", "Sélectionne un node groupe"), "error");
      let ok = 0;
      ids.forEach(id => { if (VisionCanvas.ungroupNode(id)) ok++; });
      if (ok > 0) toast(tt(`${ok} group(s) ungrouped`, `${ok} groupe(s) dégroupé(s)`), "success");
      else toast(tt("No group in selection", "Pas de groupe dans la sélection"), "error");
    });
  }

  // ============================================================
  // Brand identity page rendering
  // ============================================================
  const BRAND_PALETTE = {
    aperture: [
      { step: "50", hex: "#e8f1f1", light: true },
      { step: "100", hex: "#c6dadb", light: true },
      { step: "300", hex: "#7faaac", light: false },
      { step: "500", hex: "#4a7c7e", light: false, label: "Base" },
      { step: "700", hex: "#355a5c", light: false },
      { step: "900", hex: "#1f3838", light: false },
    ],
    paper: [
      { step: "50", hex: "#fdf5ee", light: true },
      { step: "300", hex: "#d7a587", light: true },
      { step: "500", hex: "#b87b58", light: false, label: "Base" },
      { step: "700", hex: "#8a5a3e", light: false },
      { step: "900", hex: "#5c3b29", light: false },
    ],
    insight: [
      { step: "500", hex: "#8a6b97", light: false, label: "Base" },
    ],
    semantic: [
      { step: "Pulse", hex: "#5b8a5d", light: false, label: "Gain" },
      { step: "Warm", hex: "#c9a168", light: false, label: "Vigilance" },
      { step: "Brick", hex: "#b86056", light: false, label: "Perte" },
    ],
    bg: [
      { step: "Vellum", hex: "#f5f1e9", light: true, label: "Page" },
      { step: "Plain", hex: "#ffffff", light: true, label: "Cards" },
      { step: "Soft", hex: "#fbf7ef", light: true, label: "Subtle" },
      { step: "Beige", hex: "#ede7da", light: true, label: "Sep" },
    ],
  };

  function renderBrandPage() {
    Object.entries(BRAND_PALETTE).forEach(([key, swatches]) => {
      const el = document.getElementById(`palette-${key}`);
      if (!el) return;
      el.innerHTML = swatches.map(s => `
        <div class="swatch ${s.light ? "light" : ""}" style="background:${s.hex}">
          <span class="step">${s.step}</span>
          <div>
            <div class="hex">${s.hex}</div>
            ${s.label ? `<div class="label">${s.label}</div>` : ""}
          </div>
        </div>
      `).join("");
    });
  }

  // ============================================================
  // Command Palette (⌘K)
  // ============================================================
  let cmdkOpen = false;
  let cmdkActiveIdx = 0;
  let cmdkFiltered = [];

  function buildCommands() {
    const cmds = [];
    const tabsLabel = {
      home: tt("Home", "Accueil"),
      portfolio: tt("Portfolio", "Portefeuille"),
      "auto-analysis": tt("Our analysis", "Notre analyse"),
      nodal: tt("Nodal canvas", "Canvas nodal"),
    };
    const NAV = tt("Navigation", "Navigation");
    const ACTION = tt("Action", "Action");

    // Navigation
    Object.entries(tabsLabel).forEach(([id, lbl]) => {
      cmds.push({
        group: NAV, icon: "→", title: tt(`Go to ${lbl}`, `Aller à ${lbl}`),
        keywords: id, action: () => showTab(id),
      });
    });
    cmds.push({
      group: NAV, icon: "◇", title: tt("Vision brand identity", "Identité graphique Vision"),
      keywords: "brand identity logo charte design palette typo",
      action: () => showTab("brand"),
    });

    // Actions canvas
    cmds.push({ group: ACTION, icon: "▶", title: tt("Run graph", "Exécuter le graph"), action: () => { showTab("nodal"); VisionCanvas.runGraph(); toast(tt("Graph executed", "Graph exécuté")); } });
    cmds.push({ group: ACTION, icon: "↺", title: tt("Clear canvas", "Vider le canvas"), action: () => { showTab("nodal"); VisionCanvas.clear(); toast(tt("Canvas cleared", "Canvas vidé")); } });
    cmds.push({ group: ACTION, icon: "⊕", title: tt("Reset canvas zoom", "Reset zoom canvas"), action: () => { showTab("nodal"); VisionCanvas.resetView(); } });
    cmds.push({ group: ACTION, icon: "+", title: tt("Add an asset to the portfolio", "Ajouter un actif au portefeuille"), action: openAddAssetModal });

    // Démos
    VisionCanvas.DEMOS.forEach((d, i) => {
      cmds.push({
        group: tt("Demo", "Démo"), icon: "🧪", title: L(d.name), desc: L(d.description),
        action: () => { showTab("nodal"); VisionCanvas.loadDemo(i); toast(tt(`Demo "${L(d.name)}" loaded`, `Démo "${L(d.name)}" chargée`), "success"); },
      });
    });

    // Saved graphs
    VisionCanvas.listSaved().forEach(g => {
      cmds.push({
        group: tt("Saved", "Sauvegarde"), icon: "💾", title: tt(`Load: ${g.name}`, `Charger : ${g.name}`),
        action: () => { showTab("nodal"); VisionCanvas.loadSaved(g.name); toast(tt(`"${g.name}" loaded`, `"${g.name}" chargé`), "success"); },
      });
    });

    // Groups
    VisionCanvas.listGroups().forEach(g => {
      cmds.push({
        group: tt("Group", "Groupe"), icon: "⊞", title: tt(`Add group: ${g.name}`, `Ajouter groupe : ${g.name}`),
        desc: g.description,
        action: () => { showTab("nodal"); VisionCanvas.addNode(g.name, 200, 200); toast(tt(`Group "${g.name}" added`, `Groupe "${g.name}" ajouté`)); },
      });
    });

    // Built-in nodes
    Object.entries(VisionCanvas.nodeTypes).forEach(([name, spec]) => {
      if (spec.isGroup) return; // already covered
      cmds.push({
        group: `Node · ${spec.category}`, icon: "◇", title: tt(`Add node: ${spec.title}`, `Ajouter node : ${spec.title}`),
        keywords: name.toLowerCase(),
        action: () => { showTab("nodal"); VisionCanvas.addNode(name, 200, 200); toast(tt(`${spec.title} node added`, `Node ${spec.title} ajouté`)); },
      });
    });

    // Tickers
    VisionData.TICKERS.forEach(t => {
      cmds.push({
        group: tt("Asset", "Actif"), icon: "$", title: tt(`Add ${t.ticker} to PF (${t.name})`, `Ajouter ${t.ticker} au PF (${t.name})`),
        keywords: `${t.ticker.toLowerCase()} ${t.name.toLowerCase()} ${t.sector.toLowerCase()}`,
        action: () => {
          if (!state.portfolio.find(p => p.ticker === t.ticker)) {
            state.portfolio.push({ ticker: t.ticker, qty: 10 });
            renderPortfolio(); renderHome(); renderAutoAnalysis();
            toast(tt(`${t.ticker} × 10 added`, `${t.ticker} × 10 ajouté`), "success");
          } else toast(tt(`${t.ticker} already held`, `${t.ticker} déjà détenu`));
        },
      });
    });

    // Glossary
    GLOSSARY.forEach((g, i) => {
      const title = L(g.title);
      const text = L(g.text);
      cmds.push({
        group: tt("Glossary", "Glossaire"), icon: "📚", title, desc: text.slice(0, 80) + "…",
        keywords: (typeof g.title === "object" ? `${g.title.en} ${g.title.fr}` : g.title).toLowerCase(),
        action: () => { showTab("auto-analysis"); tipIdx = i; renderTip(); setTimeout(() => document.getElementById("auto-tip")?.scrollIntoView({behavior: "smooth", block: "center"}), 200); },
      });
    });

    return cmds;
  }

  function filterCmds(query) {
    const all = buildCommands();
    if (!query) return all.slice(0, 50);
    const q = query.toLowerCase().trim();
    const scored = [];
    for (const c of all) {
      const hay = (c.title + " " + (c.desc || "") + " " + (c.keywords || "")).toLowerCase();
      if (hay.includes(q)) {
        const idx = hay.indexOf(q);
        scored.push({ c, score: idx });
      }
    }
    scored.sort((a, b) => a.score - b.score);
    return scored.slice(0, 50).map(x => x.c);
  }

  function renderCmdkResults() {
    const el = document.getElementById("cmdk-results");
    if (!cmdkFiltered.length) {
      el.innerHTML = `<div class="cmdk-empty">Aucun résultat. Essaie "AAPL", "stress", "Sharpe", "node Forecast"…</div>`;
      return;
    }
    // Group by .group
    const groups = {};
    cmdkFiltered.forEach((c, i) => {
      const k = c.group;
      groups[k] = groups[k] || [];
      groups[k].push({ c, i });
    });
    let html = "";
    for (const [g, items] of Object.entries(groups)) {
      html += `<div class="cmdk-group-label">${g}</div>`;
      for (const { c, i } of items) {
        html += `
          <div class="cmdk-item ${i === cmdkActiveIdx ? "active" : ""}" data-i="${i}">
            <span class="cmdk-item-icon">${c.icon || ""}</span>
            <div class="cmdk-item-body">
              <div class="cmdk-item-title">${c.title}</div>
              ${c.desc ? `<div class="cmdk-item-desc">${c.desc}</div>` : ""}
            </div>
          </div>
        `;
      }
    }
    el.innerHTML = html;
    // Click handlers
    el.querySelectorAll(".cmdk-item").forEach(div => {
      div.addEventListener("click", () => {
        cmdkActiveIdx = +div.dataset.i;
        executeActiveCmd();
      });
      div.addEventListener("mousemove", () => {
        const i = +div.dataset.i;
        if (i !== cmdkActiveIdx) {
          cmdkActiveIdx = i;
          renderCmdkResults();
        }
      });
    });
    // Scroll active into view
    const active = el.querySelector(".cmdk-item.active");
    if (active) active.scrollIntoView({ block: "nearest" });
  }

  function executeActiveCmd() {
    const cmd = cmdkFiltered[cmdkActiveIdx];
    if (!cmd) return;
    closeCmdK();
    setTimeout(cmd.action, 50);
  }

  function openCmdK() {
    cmdkOpen = true;
    cmdkActiveIdx = 0;
    document.getElementById("cmdk").classList.remove("hidden");
    const input = document.getElementById("cmdk-input");
    input.value = "";
    cmdkFiltered = filterCmds("");
    renderCmdkResults();
    setTimeout(() => input.focus(), 0);
  }
  function closeCmdK() {
    cmdkOpen = false;
    document.getElementById("cmdk").classList.add("hidden");
  }

  function initCmdK() {
    const input = document.getElementById("cmdk-input");
    input.addEventListener("input", () => {
      cmdkActiveIdx = 0;
      cmdkFiltered = filterCmds(input.value);
      renderCmdkResults();
    });
    input.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { e.preventDefault(); cmdkActiveIdx = Math.min(cmdkActiveIdx + 1, cmdkFiltered.length - 1); renderCmdkResults(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); cmdkActiveIdx = Math.max(0, cmdkActiveIdx - 1); renderCmdkResults(); }
      else if (e.key === "Enter") { e.preventDefault(); executeActiveCmd(); }
      else if (e.key === "Escape") closeCmdK();
    });
    document.getElementById("cmdk").addEventListener("click", e => {
      if (e.target.id === "cmdk") closeCmdK();
    });
    document.getElementById("cmdk-trigger")?.addEventListener("click", openCmdK);
    // Global hotkey
    document.addEventListener("keydown", e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        cmdkOpen ? closeCmdK() : openCmdK();
      }
    });
  }

  function updateApiStatus(active) {
    const el = document.getElementById("api-status");
    el.classList.toggle("live", active);
    el.querySelector(".api-status-label").textContent = active
      ? tt("AI enabled", "IA activée")
      : tt("Demo mode (no AI key)", "Mode démo (pas de clé IA)");
  }

  // ============================================================
  // Boot
  // ============================================================
  document.addEventListener("DOMContentLoaded", () => {
    attach();
    VisionCanvas.init({ ctx: { hasApiKey: false } });
    // Refresh group list now that groups are loaded from localStorage
    window._refreshGroupList?.();
    // Refresh callback so newly-created/deleted groups also re-render
    const origCreate = VisionCanvas.createGroupFromSelection;
    VisionCanvas.createGroupFromSelection = (...args) => {
      const r = origCreate(...args);
      if (r) window._refreshGroupList?.();
      return r;
    };
    const origDel = VisionCanvas.deleteGroup;
    VisionCanvas.deleteGroup = (...args) => {
      const r = origDel(...args);
      window._refreshGroupList?.();
      return r;
    };
    // Restore autosave, sinon démo par défaut
    setTimeout(() => {
      if (!VisionCanvas.restoreAutosave()) VisionCanvas.loadDemo(0);
    }, 100);
    // Pre-render hidden screens once
    setTimeout(() => {
      renderHome();
      renderPortfolio();
      renderAutoAnalysis();
    }, 200);
  });
})();
