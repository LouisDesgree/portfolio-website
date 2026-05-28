/* ============================================================
   Vision — Nodal canvas
   ============================================================ */

(function () {
  "use strict";

  // ============================================================
  // Node type registry
  // ============================================================
  // Chaque node a:
  //   - title, category
  //   - inputs:  [{ name, type }]  où type ∈ { series, returns, stats, scalar, sentiment }
  //   - outputs: [{ name, type }]
  //   - params:  [{ name, label, type, default, options? }]
  //   - compute(inputs, params, ctx): renvoie un dict { outputName: value }
  //
  // Output null = node ne peut pas calculer (input manquant).

  const NODE_TYPES = {
    Asset: {
      title: "Asset",
      category: "source",
      inputs: [],
      outputs: [{ name: "prices", type: "series" }],
      params: [
        {
          name: "ticker",
          label: "Ticker",
          type: "select",
          default: "AAPL",
          options: () => VisionData.TICKERS.map(t => t.ticker),
        },
      ],
      compute(_inputs, params) {
        const s = VisionData.seriesFor(params.ticker);
        if (!s.length) return { prices: null };
        return {
          prices: { ticker: params.ticker, values: s, dates: VisionData.DATES },
        };
      },
      readout(out) {
        const s = out.prices;
        if (!s) return "—";
        return `${s.ticker}\n${s.values.length} pts\nLast: ${s.values[s.values.length - 1].toFixed(2)}`;
      },
    },

    Clean: {
      title: "Clean",
      category: "transform",
      inputs: [{ name: "in", type: "series" }],
      outputs: [{ name: "out", type: "series" }],
      params: [],
      compute(inputs) {
        const s = inputs.in;
        if (!s) return { out: null };
        const filtered = s.values
          .map((v, i) => ({ v, d: s.dates[i] }))
          .filter(x => x.v != null && !Number.isNaN(x.v) && x.v > 0);
        return {
          out: {
            ticker: s.ticker,
            values: filtered.map(x => x.v),
            dates: filtered.map(x => x.d),
            cleaned: s.values.length - filtered.length,
          },
        };
      },
      readout(out) {
        const s = out.out;
        if (!s) return "—";
        return `${s.values.length} valid\n${s.cleaned} dropped`;
      },
    },

    Returns: {
      title: "Returns",
      category: "transform",
      inputs: [{ name: "in", type: "series" }],
      outputs: [{ name: "out", type: "series" }],
      params: [],
      compute(inputs) {
        const s = inputs.in;
        if (!s) return { out: null };
        const r = [];
        for (let i = 1; i < s.values.length; i++) {
          r.push((s.values[i] - s.values[i - 1]) / s.values[i - 1]);
        }
        return {
          out: { ticker: s.ticker, values: r, dates: s.dates.slice(1) },
        };
      },
      readout(out) {
        const s = out.out;
        if (!s) return "—";
        const mean = s.values.reduce((a, b) => a + b, 0) / s.values.length;
        return `n=${s.values.length}\nμ=${(mean * 100).toFixed(3)}%/j`;
      },
    },

    RollingMean: {
      title: "Rolling Mean",
      category: "transform",
      inputs: [{ name: "in", type: "series" }],
      outputs: [{ name: "out", type: "series" }],
      params: [{ name: "window", label: "Fenêtre (jours)", type: "number", default: 20 }],
      compute(inputs, params) {
        const s = inputs.in;
        if (!s) return { out: null };
        const w = Math.max(2, parseInt(params.window, 10) || 20);
        const out = [];
        for (let i = 0; i < s.values.length; i++) {
          const start = Math.max(0, i - w + 1);
          const slice = s.values.slice(start, i + 1);
          out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
        }
        return {
          out: { ticker: `${s.ticker} MA${w}`, values: out, dates: s.dates },
        };
      },
      readout(out) {
        const s = out.out;
        if (!s) return "—";
        return `${s.ticker}\nlast: ${s.values[s.values.length - 1].toFixed(2)}`;
      },
    },

    Stats: {
      title: "Stats",
      category: "analysis",
      inputs: [{ name: "in", type: "series" }],
      outputs: [{ name: "stats", type: "stats" }],
      params: [],
      compute(inputs) {
        const s = inputs.in;
        if (!s || !s.values || !s.values.length) return { stats: null };
        const v = s.values;
        // Détecte si c'est une série de prix (positive) ou de returns
        const isReturns = v.some(x => x < 0) || (Math.abs(v[0]) < 1);
        let returns;
        if (isReturns) {
          returns = v;
        } else {
          returns = [];
          for (let i = 1; i < v.length; i++) returns.push((v[i] - v[i - 1]) / v[i - 1]);
        }
        const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
        const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
        const std = Math.sqrt(variance);
        const ann_return = (Math.pow(1 + mean, 252) - 1);
        const ann_vol = std * Math.sqrt(252);
        const sharpe = ann_vol > 0 ? ann_return / ann_vol : 0;
        const last = isReturns ? v[v.length - 1] : v[v.length - 1];
        const first = isReturns ? v[0] : v[0];
        // Drawdown sur prices uniquement
        let max_drawdown_pct = 0;
        if (!isReturns) {
          let peak = v[0];
          for (const x of v) {
            peak = Math.max(peak, x);
            max_drawdown_pct = Math.min(max_drawdown_pct, (x - peak) / peak);
          }
          max_drawdown_pct *= 100;
        }
        return {
          stats: {
            ticker: s.ticker,
            n: v.length,
            last, first,
            change_pct: isReturns ? (returns.reduce((a, b) => (1 + a) * (1 + b) - 1, 0) * 100) : ((last / first - 1) * 100),
            ann_return_pct: ann_return * 100,
            ann_vol_pct: ann_vol * 100,
            sharpe,
            max_drawdown_pct,
            max: Math.max(...v),
            min: Math.min(...v),
          },
        };
      },
      readout(out) {
        const s = out.stats;
        if (!s) return "—";
        return [
          `Return: ${s.ann_return_pct.toFixed(1)}%/an`,
          `Vol:    ${s.ann_vol_pct.toFixed(1)}%`,
          `Sharpe: ${s.sharpe.toFixed(2)}`,
          `Max DD: ${s.max_drawdown_pct.toFixed(1)}%`,
        ].join("\n");
      },
    },

    Correlation: {
      title: "Correlation",
      category: "analysis",
      inputs: [
        { name: "a", type: "series" },
        { name: "b", type: "series" },
      ],
      outputs: [
        { name: "corr", type: "scalar" },
        { name: "stats", type: "stats" },
      ],
      params: [],
      compute(inputs) {
        const a = inputs.a, b = inputs.b;
        if (!a || !b) return { corr: null, stats: null };
        const n = Math.min(a.values.length, b.values.length);
        const av = a.values.slice(-n), bv = b.values.slice(-n);
        const ma = av.reduce((x, y) => x + y, 0) / n;
        const mb = bv.reduce((x, y) => x + y, 0) / n;
        let num = 0, da = 0, db = 0;
        for (let i = 0; i < n; i++) {
          num += (av[i] - ma) * (bv[i] - mb);
          da += (av[i] - ma) ** 2;
          db += (bv[i] - mb) ** 2;
        }
        const corr = num / Math.sqrt(da * db);
        return {
          corr: { value: corr, pair: `${a.ticker} / ${b.ticker}` },
          stats: {
            ticker: `${a.ticker}/${b.ticker}`,
            n,
            correlation: corr,
            ann_return_pct: corr * 100,
            ann_vol_pct: 0,
            sharpe: corr,
            max_drawdown_pct: 0,
          },
        };
      },
      readout(out) {
        const c = out.corr;
        if (!c) return "—";
        return `${c.pair}\nρ = ${c.value.toFixed(3)}`;
      },
    },

    Forecast: {
      title: "Forecast",
      category: "ml",
      inputs: [{ name: "in", type: "series" }],
      outputs: [{ name: "forecast", type: "series" }],
      params: [
        { name: "horizon", label: "Horizon (jours)", type: "number", default: 30 },
        { name: "method", label: "Méthode", type: "select", default: "drift",
          options: () => ["drift", "ar(1)", "naive"] },
      ],
      compute(inputs, params) {
        const s = inputs.in;
        if (!s) return { forecast: null };
        const h = Math.max(1, parseInt(params.horizon, 10) || 30);
        const v = s.values;
        const out = [];
        const lastDate = new Date(s.dates[s.dates.length - 1]);
        const fdates = [];
        for (let i = 1; i <= h; i++) {
          const d = new Date(lastDate);
          d.setDate(lastDate.getDate() + i);
          fdates.push(d.toISOString().slice(0, 10));
        }
        if (params.method === "naive") {
          for (let i = 0; i < h; i++) out.push(v[v.length - 1]);
        } else if (params.method === "ar(1)") {
          const r = [];
          for (let i = 1; i < v.length; i++) r.push((v[i] - v[i - 1]) / v[i - 1]);
          const mean = r.reduce((a, b) => a + b, 0) / r.length;
          let last = v[v.length - 1];
          const phi = 0.3;
          let prev = r[r.length - 1] || mean;
          for (let i = 0; i < h; i++) {
            const rt = mean + phi * (prev - mean);
            last = last * (1 + rt);
            out.push(last);
            prev = rt;
          }
        } else {
          // drift = linear fit on log prices
          const n = v.length;
          const logp = v.map(x => Math.log(x));
          const meanLog = logp.reduce((a, b) => a + b, 0) / n;
          const xs = Array.from({ length: n }, (_, i) => i);
          const meanX = (n - 1) / 2;
          let num = 0, den = 0;
          for (let i = 0; i < n; i++) {
            num += (xs[i] - meanX) * (logp[i] - meanLog);
            den += (xs[i] - meanX) ** 2;
          }
          const slope = num / den;
          const intercept = meanLog - slope * meanX;
          for (let i = 0; i < h; i++) {
            out.push(Math.exp(intercept + slope * (n + i)));
          }
        }
        return {
          forecast: {
            ticker: `${s.ticker} forecast`,
            values: out,
            dates: fdates,
            method: params.method,
          },
        };
      },
      readout(out) {
        const f = out.forecast;
        if (!f) return "—";
        return `${f.method}\n+${f.values.length}j\nend: ${f.values[f.values.length - 1].toFixed(2)}`;
      },
    },

    LinearRegression: {
      title: "Linear Reg.",
      category: "ml",
      inputs: [
        { name: "X", type: "series" },
        { name: "y", type: "series" },
      ],
      outputs: [
        { name: "fitted", type: "series" },
        { name: "stats", type: "stats" },
      ],
      params: [],
      compute(inputs) {
        const X = inputs.X, y = inputs.y;
        if (!X || !y || !X.values.length || !y.values.length) {
          return { fitted: null, stats: null };
        }
        const n = Math.min(X.values.length, y.values.length);
        const xs = X.values.slice(-n);
        const ys = y.values.slice(-n);
        const mx = xs.reduce((a, b) => a + b, 0) / n;
        const my = ys.reduce((a, b) => a + b, 0) / n;
        let sxy = 0, sxx = 0, syy = 0;
        for (let i = 0; i < n; i++) {
          sxy += (xs[i] - mx) * (ys[i] - my);
          sxx += (xs[i] - mx) ** 2;
          syy += (ys[i] - my) ** 2;
        }
        const slope = sxx > 0 ? sxy / sxx : 0;
        const intercept = my - slope * mx;
        const fitted = xs.map(x => intercept + slope * x);
        const ssRes = ys.reduce((a, b, i) => a + (b - fitted[i]) ** 2, 0);
        const r2 = syy > 0 ? 1 - ssRes / syy : 0;
        return {
          fitted: {
            ticker: `fit(${X.ticker} → ${y.ticker})`,
            values: fitted,
            dates: X.dates ? X.dates.slice(-n) : ys.map((_, i) => String(i)),
          },
          stats: {
            ticker: `${X.ticker} → ${y.ticker}`,
            n,
            slope,
            intercept,
            r_squared: r2,
            ann_return_pct: r2 * 100,
            ann_vol_pct: Math.abs(slope) * 100,
            sharpe: r2,
            max_drawdown_pct: 0,
          },
        };
      },
      readout(out) {
        const s = out.stats;
        if (!s) return "—";
        return `R²: ${s.r_squared.toFixed(3)}\nslope: ${s.slope.toFixed(3)}\nn=${s.n}`;
      },
    },

    Anomalies: {
      title: "Anomalies",
      category: "ml",
      inputs: [{ name: "in", type: "series" }],
      outputs: [
        { name: "flags", type: "series" },
        { name: "stats", type: "stats" },
      ],
      params: [
        { name: "threshold", label: "Z seuil", type: "number", default: 2.5 },
      ],
      compute(inputs, params) {
        const s = inputs.in;
        if (!s || !s.values.length) return { flags: null, stats: null };
        const v = s.values;
        const mean = v.reduce((a, b) => a + b, 0) / v.length;
        const variance = v.reduce((a, b) => a + (b - mean) ** 2, 0) / v.length;
        const std = Math.sqrt(variance) || 1e-9;
        const thresh = Math.max(0.1, +params.threshold || 2.5);
        const flags = v.map(x => Math.abs((x - mean) / std) > thresh ? 1 : 0);
        const count = flags.reduce((a, b) => a + b, 0);
        const rate = (count / v.length) * 100;
        return {
          flags: {
            ticker: `${s.ticker} anomalies`,
            values: flags,
            dates: s.dates,
          },
          stats: {
            ticker: s.ticker,
            n: v.length,
            anomalies: count,
            anomaly_rate_pct: rate,
            threshold: thresh,
            ann_return_pct: rate,
            ann_vol_pct: rate,
            sharpe: thresh,
            max_drawdown_pct: 0,
          },
        };
      },
      readout(out) {
        const s = out.stats;
        if (!s) return "—";
        return `${s.anomalies} anomalies\n${s.anomaly_rate_pct.toFixed(1)}%\nseuil z=${s.threshold}`;
      },
    },

    Classifier: {
      title: "Classifier",
      category: "ml",
      inputs: [{ name: "in", type: "series" }],
      outputs: [{ name: "stats", type: "stats" }],
      params: [
        { name: "horizon", label: "Horizon (j)", type: "number", default: 1 },
        { name: "signal", label: "Signal", type: "select", default: "momentum",
          options: () => ["momentum", "mean-revert"] },
      ],
      compute(inputs, params) {
        const s = inputs.in;
        if (!s || s.values.length < 10) return { stats: null };
        const v = s.values;
        const h = Math.max(1, parseInt(params.horizon, 10) || 1);
        const returns = [];
        for (let i = 1; i < v.length; i++) returns.push((v[i] - v[i - 1]) / v[i - 1]);
        const ups = returns.filter(x => x > 0).length;
        const upRate = ups / returns.length;
        const baseline = Math.max(upRate, 1 - upRate);
        let correct = 0, total = 0;
        for (let i = h; i < returns.length; i++) {
          let pred;
          if (params.signal === "mean-revert") {
            pred = returns[i - h] > 0 ? 0 : 1;
          } else {
            pred = returns[i - h] > 0 ? 1 : 0;
          }
          const actual = returns[i] > 0 ? 1 : 0;
          if (pred === actual) correct++;
          total++;
        }
        const acc = total > 0 ? correct / total : 0;
        return {
          stats: {
            ticker: s.ticker,
            n: returns.length,
            accuracy_pct: acc * 100,
            baseline_pct: baseline * 100,
            edge_pct: (acc - baseline) * 100,
            up_rate_pct: upRate * 100,
            ann_return_pct: (acc - baseline) * 100 * 252,
            ann_vol_pct: baseline * 100,
            sharpe: (acc - baseline) * 10,
            max_drawdown_pct: 0,
          },
        };
      },
      readout(out) {
        const s = out.stats;
        if (!s) return "—";
        const edge = s.accuracy_pct - s.baseline_pct;
        const arrow = edge > 0 ? "↑" : edge < 0 ? "↓" : "→";
        return `Acc: ${s.accuracy_pct.toFixed(1)}%\nBase: ${s.baseline_pct.toFixed(1)}%\nEdge: ${arrow} ${edge.toFixed(1)}pt`;
      },
    },

    RLAgent: {
      title: "RL Agent",
      category: "ml",
      inputs: [{ name: "in", type: "series" }],
      outputs: [
        { name: "equity", type: "series" },
        { name: "stats", type: "stats" },
      ],
      params: [
        { name: "strategy", label: "Stratégie", type: "select", default: "momentum",
          options: () => ["momentum", "mean-revert", "trend"] },
      ],
      compute(inputs, params) {
        const s = inputs.in;
        if (!s || s.values.length < 50) return { equity: null, stats: null };
        const v = s.values;
        const strat = params.strategy;

        function ma(arr, i, w) {
          const start = Math.max(0, i - w + 1);
          let sum = 0;
          for (let k = start; k <= i; k++) sum += arr[k];
          return sum / (i - start + 1);
        }

        let cash = 1, position = 0, trades = 0;
        const eq = [1];
        const peaks = [1];
        let peak = 1, maxDD = 0;
        for (let i = 1; i < v.length; i++) {
          const ret = (v[i] - v[i - 1]) / v[i - 1];
          let signal = 0;
          if (strat === "momentum") {
            signal = i >= 5 && (v[i - 1] - v[i - 5]) / v[i - 5] > 0 ? 1 : 0;
          } else if (strat === "mean-revert") {
            signal = i >= 20 && v[i - 1] < ma(v, i - 1, 20) ? 1 : 0;
          } else {
            signal = i >= 50 && v[i - 1] > ma(v, i - 1, 50) ? 1 : 0;
          }
          if (signal !== position) trades++;
          position = signal;
          cash = cash * (1 + position * ret);
          eq.push(cash);
          peak = Math.max(peak, cash);
          maxDD = Math.min(maxDD, (cash - peak) / peak);
        }
        const totalRet = (eq[eq.length - 1] - 1) * 100;
        const buyhold = (v[v.length - 1] / v[0] - 1) * 100;
        const annRet = totalRet * (252 / v.length);
        // vol annualisée des returns stratégie
        const strRets = [];
        for (let i = 1; i < eq.length; i++) strRets.push((eq[i] - eq[i - 1]) / eq[i - 1]);
        const meanR = strRets.reduce((a, b) => a + b, 0) / strRets.length;
        const stdR = Math.sqrt(strRets.reduce((a, b) => a + (b - meanR) ** 2, 0) / strRets.length);
        const annVol = stdR * Math.sqrt(252) * 100;
        return {
          equity: {
            ticker: `${s.ticker} ${strat}`,
            values: eq,
            dates: s.dates,
          },
          stats: {
            ticker: s.ticker,
            strategy: strat,
            n: v.length,
            trades,
            ann_return_pct: annRet,
            ann_vol_pct: annVol,
            sharpe: annVol > 0 ? annRet / annVol : 0,
            max_drawdown_pct: maxDD * 100,
            vs_buyhold_pct: totalRet - buyhold,
            total_return_pct: totalRet,
          },
        };
      },
      readout(out) {
        const s = out.stats;
        if (!s) return "—";
        const vs = s.vs_buyhold_pct;
        return `${s.strategy}\nret: ${s.ann_return_pct.toFixed(1)}%/an\nvs B&H: ${vs >= 0 ? "+" : ""}${vs.toFixed(1)}%\n${s.trades} trades`;
      },
    },

    StressTest: {
      title: "Stress Test",
      category: "ml",
      inputs: [{ name: "in", type: "series" }],
      outputs: [
        { name: "stressed", type: "series" },
        { name: "stats", type: "stats" },
      ],
      params: [
        {
          name: "scenario",
          label: "Scénario historique",
          type: "select",
          default: "gfc-2008",
          options: () => ["gfc-2008", "covid-2020", "rates-2022", "dotcom-2000"],
        },
      ],
      compute(inputs, params) {
        const s = inputs.in;
        if (!s || !s.values?.length) return { stressed: null, stats: null };
        // Scénarios calibrés sur les vraies périodes historiques
        // Calibrés sur les périodes historiques réelles
        // GFC : S&P -49% sur ~130j → drift -0.0052/j
        // COVID : -34% en 33j → drift -0.0125/j
        // Rates 2022 : -25% sur 250j → drift -0.00115/j
        // Dot-com : Nasdaq -78% sur ~500j → drift -0.0030/j
        const SCENARIOS = {
          "gfc-2008":   { name: "Crise 2008 (GFC)",   drift: -0.0052, vol: 0.016, days: 130 },
          "covid-2020": { name: "Krach COVID 2020",   drift: -0.0125, vol: 0.028, days: 33  },
          "rates-2022": { name: "Hausse taux 2022",   drift: -0.00115, vol: 0.012, days: 250 },
          "dotcom-2000":{ name: "Bulle Dot-com 2000", drift: -0.0030, vol: 0.020, days: 500 },
        };
        const sc = SCENARIOS[params.scenario] || SCENARIOS["gfc-2008"];
        // RNG déterministe pour reproductibilité
        let seed = 0;
        for (const c of params.scenario) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
        const rng = () => {
          seed = (seed * 1664525 + 1013904223) >>> 0;
          return seed / 4294967296;
        };
        const startValue = s.values[s.values.length - 1];
        const allValues = [...s.values];
        const allDates = [...s.dates];
        const lastDate = new Date(s.dates[s.dates.length - 1]);
        let v = startValue;
        let peak = startValue;
        let trough = startValue;
        for (let i = 1; i <= sc.days; i++) {
          const u1 = Math.max(rng(), 1e-9);
          const u2 = rng();
          const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          v = v * (1 + sc.drift + sc.vol * z);
          v = Math.max(v, 0.01);
          allValues.push(v);
          peak = Math.max(peak, v);
          trough = Math.min(trough, v);
          const d = new Date(lastDate);
          d.setDate(lastDate.getDate() + i);
          allDates.push(d.toISOString().slice(0, 10));
        }
        const endValue = allValues[allValues.length - 1];
        const stressDD = (trough - startValue) / startValue;
        const endChange = (endValue - startValue) / startValue;
        // Recovery : fin atteint au moins 95% du début ?
        const recovered = endValue >= startValue * 0.95;
        // Recovery time : jours pour revenir à 95% du peak (depuis trough)
        let recoveryDays = null;
        const troughIdx = allValues.lastIndexOf(trough);
        if (troughIdx >= 0) {
          for (let i = troughIdx; i < allValues.length; i++) {
            if (allValues[i] >= startValue * 0.95) {
              recoveryDays = i - troughIdx;
              break;
            }
          }
        }
        return {
          stressed: {
            ticker: `${s.ticker} [${sc.name}]`,
            values: allValues,
            dates: allDates,
          },
          stats: {
            ticker: s.ticker,
            scenario: sc.name,
            max_drawdown_pct: stressDD * 100,
            total_return_pct: endChange * 100,
            ann_return_pct: 0, ann_vol_pct: 0, sharpe: 0,
            stress_dd_pct: stressDD * 100,
            stress_end_pct: endChange * 100,
            stress_recovered: recovered ? 1 : 0,
            stress_recovery_days: recoveryDays || 0,
          },
        };
      },
      readout(out) {
        const s = out.stats;
        if (!s) return "—";
        const recovStr = s.stress_recovered ? `récupéré en ${s.stress_recovery_days}j` : "non récupéré";
        return `${s.scenario}\nDD: ${s.stress_dd_pct.toFixed(0)}%\nFin: ${s.stress_end_pct >= 0 ? "+" : ""}${s.stress_end_pct.toFixed(0)}%\n${recovStr}`;
      },
    },

    Sentiment: {
      title: "Sentiment",
      category: "ml",
      inputs: [],
      outputs: [{ name: "score", type: "sentiment" }],
      params: [
        {
          name: "ticker",
          label: "Ticker",
          type: "select",
          default: "AAPL",
          options: () => VisionData.TICKERS.map(t => t.ticker),
        },
      ],
      compute(_inputs, params, ctx) {
        const score = VisionData.SENTIMENT[params.ticker] ?? 0;
        const aiActive = !!ctx && ctx.hasApiKey;
        return {
          score: {
            ticker: params.ticker,
            value: score,
            source: aiActive ? "IA (clé fournie)" : "mock (pas de clé)",
          },
        };
      },
      readout(out) {
        const s = out.score;
        if (!s) return "—";
        const label = s.value > 0.3 ? "positif" : s.value < -0.3 ? "négatif" : "neutre";
        return `${s.ticker}\n${s.value.toFixed(2)} (${label})\n${s.source}`;
      },
    },

    NewsFeed: {
      title: "News Feed",
      category: "source",
      inputs: [],
      outputs: [
        { name: "news", type: "news" },
        { name: "stats", type: "stats" },
      ],
      params: [
        { name: "topic", label: "Topic", type: "select", default: "all",
          options: () => ["all", "central-banks", "geopolitics", "politics-us", "politics-eu", "tech", "regulation", "energy", "climate", "finance", "corporate", "scandal", "healthcare", "macro", "earnings"] },
        { name: "period", label: "Période (jours)", type: "number", default: 30 },
        { name: "min_relevance", label: "Pertinence min (0–1)", type: "number", default: 0.3 },
      ],
      compute(_inputs, params) {
        const db = VisionData.NEWS_DB || [];
        const today = new Date();
        const period = Math.max(1, +params.period || 30);
        const cutoff = new Date(today);
        cutoff.setDate(today.getDate() - period);
        const minRel = Math.max(0, Math.min(1, +params.min_relevance || 0));
        const items = db.filter(n => {
          if (params.topic && params.topic !== "all" && n.category !== params.topic) return false;
          if (n.relevance < minRel) return false;
          const d = new Date(n.date);
          if (d < cutoff) return false;
          return true;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
        const sentSum = items.reduce((a, n) => a + n.sentiment * n.relevance, 0);
        const relSum = items.reduce((a, n) => a + n.relevance, 0);
        const avg = relSum > 0 ? sentSum / relSum : 0;
        return {
          news: { items, count: items.length, topic: params.topic, period },
          stats: {
            ticker: params.topic,
            n: items.length,
            news_sentiment: avg,
            news_count: items.length,
            ann_return_pct: avg * 100,
            ann_vol_pct: 0,
            sharpe: avg,
            max_drawdown_pct: 0,
          },
        };
      },
      readout(out) {
        const n = out.news;
        if (!n) return "—";
        const s = out.stats;
        return `${n.count} actu(s)\nsent: ${s.news_sentiment.toFixed(2)}\n${n.topic}`;
      },
    },

    NewsFilter: {
      title: "News Filter",
      category: "transform",
      inputs: [{ name: "in", type: "news" }],
      outputs: [
        { name: "out", type: "news" },
        { name: "stats", type: "stats" },
      ],
      params: [
        { name: "ticker", label: "Ticker", type: "select", default: "all",
          options: () => ["all", ...VisionData.TICKERS.map(t => t.ticker)] },
        { name: "sector", label: "Secteur", type: "select", default: "all",
          options: () => ["all", "Tech", "Finance", "Auto", "Énergie", "Santé"] },
      ],
      compute(inputs, params) {
        const src = inputs.in;
        if (!src) return { out: null, stats: null };
        let items = src.items;
        if (params.ticker && params.ticker !== "all") {
          items = items.filter(n => n.tickers?.includes(params.ticker));
        }
        if (params.sector && params.sector !== "all") {
          items = items.filter(n => n.sectors?.includes(params.sector));
        }
        const sentSum = items.reduce((a, n) => a + n.sentiment * n.relevance, 0);
        const relSum = items.reduce((a, n) => a + n.relevance, 0);
        const avg = relSum > 0 ? sentSum / relSum : 0;
        return {
          out: { items, count: items.length, topic: src.topic, period: src.period },
          stats: {
            ticker: `${params.ticker}/${params.sector}`,
            n: items.length,
            news_sentiment: avg,
            news_count: items.length,
            ann_return_pct: avg * 100,
            sharpe: avg,
            ann_vol_pct: 0,
            max_drawdown_pct: 0,
          },
        };
      },
      readout(out) {
        const n = out.out;
        if (!n) return "—";
        return `${n.count} après filtrage`;
      },
    },

    NewsSentiment: {
      title: "News Sentiment",
      category: "analysis",
      inputs: [{ name: "news", type: "news" }],
      outputs: [
        { name: "score", type: "sentiment" },
        { name: "stats", type: "stats" },
      ],
      params: [
        { name: "weight", label: "Pondération", type: "select", default: "relevance",
          options: () => ["relevance", "uniform", "recency"] },
      ],
      compute(inputs, params) {
        const n = inputs.news;
        if (!n || !n.items.length) return { score: null, stats: null };
        let sum = 0, weight = 0;
        const today = new Date();
        for (const it of n.items) {
          let w;
          if (params.weight === "uniform") w = 1;
          else if (params.weight === "recency") {
            const d = new Date(it.date);
            const daysAgo = Math.max(1, (today - d) / (1000 * 60 * 60 * 24));
            w = 1 / Math.sqrt(daysAgo);
          } else w = it.relevance;
          sum += it.sentiment * w;
          weight += w;
        }
        const score = weight > 0 ? sum / weight : 0;
        return {
          score: {
            ticker: n.topic || "news",
            value: score,
            source: `aggregate · ${params.weight}`,
          },
          stats: {
            ticker: n.topic || "news",
            n: n.items.length,
            news_sentiment: score,
            ann_return_pct: score * 100,
            sharpe: score,
            ann_vol_pct: 0,
            max_drawdown_pct: 0,
          },
        };
      },
      readout(out) {
        const s = out.score;
        if (!s) return "—";
        const lbl = s.value > 0.3 ? "positif" : s.value < -0.3 ? "négatif" : "neutre";
        return `${s.value.toFixed(2)} (${lbl})\nn=${out.stats.n}`;
      },
    },

    EventImpact: {
      title: "Event Impact",
      category: "ml",
      inputs: [
        { name: "series", type: "series" },
        { name: "news", type: "news" },
      ],
      outputs: [
        { name: "adjusted", type: "series" },
        { name: "stats", type: "stats" },
      ],
      params: [
        { name: "horizon", label: "Horizon (j)", type: "number", default: 30 },
        { name: "magnitude", label: "Magnitude (×)", type: "number", default: 1 },
      ],
      compute(inputs, params) {
        const s = inputs.series;
        const news = inputs.news;
        if (!s || !news) return { adjusted: null, stats: null };
        const h = Math.max(1, +params.horizon || 30);
        const mag = +params.magnitude || 1;
        let sum = 0, weight = 0;
        for (const it of news.items) {
          sum += it.sentiment * it.relevance;
          weight += it.relevance;
        }
        const avg = weight > 0 ? sum / weight : 0;
        const drift = avg * 0.0015 * mag;
        const values = [...s.values];
        const dates = [...s.dates];
        let v = values[values.length - 1];
        const lastDate = new Date(dates[dates.length - 1]);
        for (let i = 1; i <= h; i++) {
          v = v * (1 + drift);
          values.push(v);
          const d = new Date(lastDate);
          d.setDate(lastDate.getDate() + i);
          dates.push(d.toISOString().slice(0, 10));
        }
        const projectedReturn = ((v / s.values[s.values.length - 1]) - 1) * 100;
        return {
          adjusted: {
            ticker: `${s.ticker} +news`,
            values, dates,
          },
          stats: {
            ticker: s.ticker,
            n: news.items.length,
            news_sentiment: avg,
            projected_drift_pct: drift * 100,
            projected_return_pct: projectedReturn,
            ann_return_pct: drift * 252 * 100,
            sharpe: avg,
            ann_vol_pct: 0,
            max_drawdown_pct: 0,
          },
        };
      },
      readout(out) {
        const s = out.stats;
        if (!s) return "—";
        return `news=${s.news_sentiment.toFixed(2)}\ndrift=${s.projected_drift_pct.toFixed(3)}%/j\nfin: ${s.projected_return_pct >= 0 ? "+" : ""}${s.projected_return_pct.toFixed(1)}%`;
      },
    },

    PoliticalScenario: {
      title: "Political Scenario",
      category: "ml",
      inputs: [{ name: "in", type: "series" }],
      outputs: [
        { name: "scenario", type: "series" },
        { name: "stats", type: "stats" },
      ],
      params: [
        { name: "scenario", label: "Scénario", type: "select", default: "tariffs-us-china",
          options: () => Object.keys(POLITICAL_SCENARIOS) },
      ],
      compute(inputs, params) {
        const s = inputs.in;
        if (!s || !s.values.length) return { scenario: null, stats: null };
        const sc = POLITICAL_SCENARIOS[params.scenario] || POLITICAL_SCENARIOS["tariffs-us-china"];
        // RNG déterministe
        let seed = 0;
        for (const c of params.scenario) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
        const rng = () => {
          seed = (seed * 1664525 + 1013904223) >>> 0;
          return seed / 4294967296;
        };
        const start = s.values[s.values.length - 1];
        const out = [...s.values];
        const dates = [...s.dates];
        const lastDate = new Date(s.dates[s.dates.length - 1]);
        let v = start;
        let peak = start, trough = start;
        for (let i = 1; i <= sc.duration; i++) {
          const u1 = Math.max(rng(), 1e-9);
          const u2 = rng();
          const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          v = v * (1 + sc.drift + sc.vol * z);
          v = Math.max(v, 0.01);
          out.push(v);
          peak = Math.max(peak, v);
          trough = Math.min(trough, v);
          const d = new Date(lastDate);
          d.setDate(lastDate.getDate() + i);
          dates.push(d.toISOString().slice(0, 10));
        }
        const endChange = (v - start) / start;
        const dd = (trough - start) / start;
        return {
          scenario: {
            ticker: `${s.ticker} · ${sc.name}`,
            values: out, dates,
          },
          stats: {
            ticker: s.ticker,
            scenario: sc.name,
            stress_dd_pct: dd * 100,
            stress_end_pct: endChange * 100,
            max_drawdown_pct: dd * 100,
            total_return_pct: endChange * 100,
            ann_return_pct: endChange * 100 * (252 / sc.duration),
            sharpe: 0,
            ann_vol_pct: 0,
          },
        };
      },
      readout(out) {
        const s = out.stats;
        if (!s) return "—";
        return `${s.scenario}\nDD: ${s.stress_dd_pct.toFixed(0)}%\nFin: ${s.stress_end_pct >= 0 ? "+" : ""}${s.stress_end_pct.toFixed(0)}%`;
      },
    },

    Headlines: {
      title: "Headlines",
      category: "output",
      inputs: [{ name: "news", type: "news" }],
      outputs: [],
      params: [{ name: "max", label: "Max items", type: "number", default: 6 }],
      compute(inputs, params) {
        const n = inputs.news;
        if (!n) return { _news: null };
        return { _news: n.items.slice(0, +params.max || 6), _meta: { topic: n.topic, period: n.period } };
      },
      readout(out) {
        if (!out._news) return "(non connecté)";
        return `📰 ${out._news.length} headlines`;
      },
      displayType: "headlines",
    },

    Verdict: {
      title: "Verdict",
      category: "output",
      inputs: [
        { name: "stats", type: "stats" },
        { name: "sentiment", type: "sentiment" },
      ],
      outputs: [{ name: "decision", type: "verdict" }],
      params: [
        { name: "risk", label: "Tolérance risque", type: "select", default: "medium",
          options: () => ["low", "medium", "high"] },
      ],
      compute(inputs, params) {
        const st = inputs.stats;
        const sent = inputs.sentiment;
        if (!st) return { decision: null };
        const sentVal = sent ? sent.value : 0;
        const riskBias = { low: -0.2, medium: 0, high: 0.2 }[params.risk] || 0;
        // Score = sharpe normalisé + sentiment + biais risque
        const score = Math.max(-1, Math.min(1, st.sharpe / 2)) + sentVal * 0.5 + riskBias;
        let action, why;
        if (score > 0.6) {
          action = "BUY";
          why = `Sharpe ${st.sharpe.toFixed(2)} + sentiment ${sentVal.toFixed(2)} → upside attendu.`;
        } else if (score < -0.2) {
          action = "SELL";
          why = `Risque/sentiment dégradés (score ${score.toFixed(2)}).`;
        } else {
          action = "HOLD";
          why = `Signaux mitigés (score ${score.toFixed(2)}).`;
        }
        return { decision: { action, score, why } };
      },
      readout(out) {
        const d = out.decision;
        if (!d) return "—";
        return `${d.action}\nscore: ${d.score.toFixed(2)}`;
      },
    },

    Chart: {
      title: "Chart",
      category: "output",
      inputs: [{ name: "series", type: "series" }],
      outputs: [],
      params: [],
      compute(inputs) {
        return { _series: inputs.series };
      },
      readout(out) {
        const s = out._series;
        if (!s) return "(non connecté)";
        return `📈 ${s.ticker}\n${s.values.length} pts`;
      },
      displayType: "chart",
    },

    KPI: {
      title: "KPI",
      category: "output",
      inputs: [{ name: "stats", type: "stats" }],
      outputs: [],
      params: [
        { name: "metric", label: "Métrique", type: "select", default: "sharpe",
          options: () => [
            "sharpe", "ann_return_pct", "ann_vol_pct", "max_drawdown_pct",
            "correlation", "r_squared", "slope",
            "anomalies", "anomaly_rate_pct",
            "accuracy_pct", "edge_pct",
            "trades", "vs_buyhold_pct", "total_return_pct",
            "stress_dd_pct", "stress_end_pct", "stress_recovery_days",
            "news_sentiment", "news_count", "projected_drift_pct", "projected_return_pct",
          ] },
      ],
      compute(inputs, params) {
        const s = inputs.stats;
        if (!s) return { _value: null, _label: params.metric };
        return { _value: s[params.metric], _label: params.metric };
      },
      readout(out) {
        if (out._value == null) return "—";
        return `${out._label}\n${out._value.toFixed(2)}`;
      },
      displayType: "kpi",
    },
  };

  // ============================================================
  // Scénarios politiques (pour PoliticalScenario node)
  // ============================================================
  const POLITICAL_SCENARIOS = {
    "tariffs-us-china": {
      name: "Tarifs USA-Chine 25%",
      description: "Escalade commerciale, taxe additionnelle sur tech/semi-conducteurs",
      drift: -0.0030, vol: 0.018, duration: 60,
    },
    "banking-crisis": {
      name: "Crise bancaire majeure",
      description: "Effondrement d'une banque systémique régionale",
      drift: -0.0045, vol: 0.025, duration: 90,
    },
    "ai-regulation-strict": {
      name: "Régulation IA stricte UE",
      description: "Cadre limitant l'entraînement de modèles + obligations transparence",
      drift: -0.0020, vol: 0.014, duration: 180,
    },
    "energy-shock": {
      name: "Choc énergétique",
      description: "Coupure approvisionnement gaz/pétrole, prix bondit +50%",
      drift: -0.0028, vol: 0.020, duration: 90,
    },
    "election-pro-business": {
      name: "Choc électoral pro-business",
      description: "Résultat électoral surprise favorable aux marchés (déréglementation, baisse impôts)",
      drift: 0.0028, vol: 0.012, duration: 45,
    },
    "geopolitical-conflict": {
      name: "Conflit géopolitique majeur",
      description: "Tension militaire entre grandes puissances, fuite vers les actifs sûrs",
      drift: -0.0055, vol: 0.030, duration: 60,
    },
    "fed-pivot-dovish": {
      name: "Pivot Fed dovish",
      description: "Fed annonce des baisses de taux plus rapides que prévu",
      drift: 0.0020, vol: 0.014, duration: 90,
    },
  };

  // ============================================================
  // Démos pré-câblées
  // ============================================================
  // Format : { name, description, nodes: [{type,x,y,params}], edges: [{fromIdx,fromPort,toIdx,toPort}] }

  const DEMOS = [
    {
      name: "Analyse simple",
      description: "Stats + verdict sur un actif unique (NVDA). Le pipeline complet à connaître.",
      nodes: [
        { type: "Asset",     x: 40,  y: 40,  params: { ticker: "NVDA" } },
        { type: "Clean",     x: 240, y: 40 },
        { type: "Returns",   x: 440, y: 40 },
        { type: "Stats",     x: 640, y: 40 },
        { type: "Sentiment", x: 40,  y: 260, params: { ticker: "NVDA" } },
        { type: "Verdict",   x: 860, y: 130 },
        { type: "Chart",     x: 440, y: 260 },
        { type: "KPI",       x: 860, y: 40,  params: { metric: "sharpe" } },
      ],
      edges: [
        { fromIdx: 0, fromPort: "prices", toIdx: 1, toPort: "in" },
        { fromIdx: 1, fromPort: "out",    toIdx: 2, toPort: "in" },
        { fromIdx: 1, fromPort: "out",    toIdx: 6, toPort: "series" },
        { fromIdx: 2, fromPort: "out",    toIdx: 3, toPort: "in" },
        { fromIdx: 3, fromPort: "stats",  toIdx: 5, toPort: "stats" },
        { fromIdx: 4, fromPort: "score",  toIdx: 5, toPort: "sentiment" },
        { fromIdx: 3, fromPort: "stats",  toIdx: 7, toPort: "stats" },
      ],
    },
    {
      name: "Corrélation 2 actifs",
      description: "Quelle corrélation entre NVDA et MSFT ? Les deux actifs sont nettoyés, transformés en returns puis croisés.",
      nodes: [
        { type: "Asset",       x: 40,  y: 40,  params: { ticker: "NVDA" } },
        { type: "Clean",       x: 240, y: 40 },
        { type: "Returns",     x: 440, y: 40 },
        { type: "Asset",       x: 40,  y: 220, params: { ticker: "MSFT" } },
        { type: "Clean",       x: 240, y: 220 },
        { type: "Returns",     x: 440, y: 220 },
        { type: "Correlation", x: 640, y: 130 },
        { type: "KPI",         x: 840, y: 130, params: { metric: "sharpe" } },
      ],
      edges: [
        { fromIdx: 0, fromPort: "prices", toIdx: 1, toPort: "in" },
        { fromIdx: 1, fromPort: "out",    toIdx: 2, toPort: "in" },
        { fromIdx: 3, fromPort: "prices", toIdx: 4, toPort: "in" },
        { fromIdx: 4, fromPort: "out",    toIdx: 5, toPort: "in" },
        { fromIdx: 2, fromPort: "out",    toIdx: 6, toPort: "a" },
        { fromIdx: 5, fromPort: "out",    toIdx: 6, toPort: "b" },
      ],
    },
    {
      name: "Backtest momentum",
      description: "Stratégie momentum vs buy & hold sur NVDA. Sortie : courbe d'equity + écart vs B&H.",
      nodes: [
        { type: "Asset",   x: 40,  y: 100, params: { ticker: "NVDA" } },
        { type: "Clean",   x: 240, y: 100 },
        { type: "RLAgent", x: 440, y: 100, params: { strategy: "momentum" } },
        { type: "Chart",   x: 660, y: 100 },
        { type: "KPI",     x: 860, y: 40,  params: { metric: "vs_buyhold_pct" } },
        { type: "KPI",     x: 860, y: 200, params: { metric: "trades" } },
      ],
      edges: [
        { fromIdx: 0, fromPort: "prices", toIdx: 1, toPort: "in" },
        { fromIdx: 1, fromPort: "out",    toIdx: 2, toPort: "in" },
        { fromIdx: 2, fromPort: "equity", toIdx: 3, toPort: "series" },
        { fromIdx: 2, fromPort: "stats",  toIdx: 4, toPort: "stats" },
        { fromIdx: 2, fromPort: "stats",  toIdx: 5, toPort: "stats" },
      ],
    },
    {
      name: "Détection anomalies",
      description: "Z-score > 2.5 sur TSLA pour repérer les jours statistiquement extrêmes.",
      nodes: [
        { type: "Asset",     x: 40,  y: 100, params: { ticker: "TSLA" } },
        { type: "Clean",     x: 240, y: 100 },
        { type: "Anomalies", x: 440, y: 100, params: { threshold: 2.5 } },
        { type: "Chart",     x: 240, y: 260 },
        { type: "KPI",       x: 660, y: 40,  params: { metric: "anomalies" } },
        { type: "KPI",       x: 660, y: 200, params: { metric: "anomaly_rate_pct" } },
      ],
      edges: [
        { fromIdx: 0, fromPort: "prices", toIdx: 1, toPort: "in" },
        { fromIdx: 1, fromPort: "out",    toIdx: 2, toPort: "in" },
        { fromIdx: 1, fromPort: "out",    toIdx: 3, toPort: "series" },
        { fromIdx: 2, fromPort: "stats",  toIdx: 4, toPort: "stats" },
        { fromIdx: 2, fromPort: "stats",  toIdx: 5, toPort: "stats" },
      ],
    },
    {
      name: "Forecast 60j",
      description: "Prévision SPY sur 60 jours via tendance log (drift). Sortie : chart prolongé.",
      nodes: [
        { type: "Asset",    x: 40,  y: 100, params: { ticker: "SPY" } },
        { type: "Clean",    x: 240, y: 100 },
        { type: "Forecast", x: 440, y: 100, params: { horizon: 60, method: "drift" } },
        { type: "Chart",    x: 240, y: 260 },
        { type: "Chart",    x: 660, y: 100 },
      ],
      edges: [
        { fromIdx: 0, fromPort: "prices",   toIdx: 1, toPort: "in" },
        { fromIdx: 1, fromPort: "out",      toIdx: 2, toPort: "in" },
        { fromIdx: 1, fromPort: "out",      toIdx: 3, toPort: "series" },
        { fromIdx: 2, fromPort: "forecast", toIdx: 4, toPort: "series" },
      ],
    },
    {
      name: "Stress Test 2008",
      description: "Si la crise de 2008 se reproduisait avec NVDA aujourd'hui ? Drawdown projeté + jours de récupération.",
      nodes: [
        { type: "Asset",      x: 40,  y: 80,  params: { ticker: "NVDA" } },
        { type: "Clean",      x: 240, y: 80 },
        { type: "StressTest", x: 440, y: 80,  params: { scenario: "gfc-2008" } },
        { type: "Chart",      x: 660, y: 80 },
        { type: "KPI",        x: 880, y: 20,  params: { metric: "stress_dd_pct" } },
        { type: "KPI",        x: 880, y: 140, params: { metric: "stress_recovery_days" } },
      ],
      edges: [
        { fromIdx: 0, fromPort: "prices",   toIdx: 1, toPort: "in" },
        { fromIdx: 1, fromPort: "out",      toIdx: 2, toPort: "in" },
        { fromIdx: 2, fromPort: "stressed", toIdx: 3, toPort: "series" },
        { fromIdx: 2, fromPort: "stats",    toIdx: 4, toPort: "stats" },
        { fromIdx: 2, fromPort: "stats",    toIdx: 5, toPort: "stats" },
      ],
    },
    {
      name: "Comparaison stratégies",
      description: "3 RL agents en parallèle (momentum, mean-revert, trend) sur NVDA. Quelle stratégie bat B&H ?",
      nodes: [
        { type: "Asset",   x: 40,  y: 130, params: { ticker: "NVDA" } },
        { type: "Clean",   x: 240, y: 130 },
        { type: "RLAgent", x: 440, y: 20,  params: { strategy: "momentum" } },
        { type: "RLAgent", x: 440, y: 140, params: { strategy: "mean-revert" } },
        { type: "RLAgent", x: 440, y: 260, params: { strategy: "trend" } },
        { type: "KPI",     x: 660, y: 20,  params: { metric: "vs_buyhold_pct" } },
        { type: "KPI",     x: 660, y: 140, params: { metric: "vs_buyhold_pct" } },
        { type: "KPI",     x: 660, y: 260, params: { metric: "vs_buyhold_pct" } },
      ],
      edges: [
        { fromIdx: 0, fromPort: "prices", toIdx: 1, toPort: "in" },
        { fromIdx: 1, fromPort: "out",    toIdx: 2, toPort: "in" },
        { fromIdx: 1, fromPort: "out",    toIdx: 3, toPort: "in" },
        { fromIdx: 1, fromPort: "out",    toIdx: 4, toPort: "in" },
        { fromIdx: 2, fromPort: "stats",  toIdx: 5, toPort: "stats" },
        { fromIdx: 3, fromPort: "stats",  toIdx: 6, toPort: "stats" },
        { fromIdx: 4, fromPort: "stats",  toIdx: 7, toPort: "stats" },
      ],
    },

    // ============================================================
    // DÉMOS NEWS / POLITIQUE
    // ============================================================
    {
      name: "📰 News → Sentiment → Verdict",
      description: "Flux d'actu Tech sur 30j → filtre NVDA → sentiment pondéré → injection dans le Verdict. Le sentiment marché vient de la vraie actu.",
      nodes: [
        { type: "NewsFeed",      x: 40,  y: 60,  params: { topic: "tech", period: 30, min_relevance: 0.5 } },
        { type: "NewsFilter",    x: 260, y: 60,  params: { ticker: "NVDA", sector: "all" } },
        { type: "Headlines",     x: 480, y: 60,  params: { max: 6 } },
        { type: "NewsSentiment", x: 480, y: 280, params: { weight: "relevance" } },
        { type: "Asset",         x: 40,  y: 460, params: { ticker: "NVDA" } },
        { type: "Clean",         x: 260, y: 460 },
        { type: "Returns",       x: 480, y: 460 },
        { type: "Stats",         x: 700, y: 460 },
        { type: "Verdict",       x: 920, y: 280, params: { risk: "medium" } },
        { type: "KPI",           x: 1140, y: 280, params: { metric: "news_sentiment" } },
      ],
      edges: [
        { fromIdx: 0, fromPort: "news", toIdx: 1, toPort: "in" },
        { fromIdx: 1, fromPort: "out",  toIdx: 2, toPort: "news" },
        { fromIdx: 1, fromPort: "out",  toIdx: 3, toPort: "news" },
        { fromIdx: 4, fromPort: "prices", toIdx: 5, toPort: "in" },
        { fromIdx: 5, fromPort: "out",   toIdx: 6, toPort: "in" },
        { fromIdx: 6, fromPort: "out",   toIdx: 7, toPort: "in" },
        { fromIdx: 7, fromPort: "stats", toIdx: 8, toPort: "stats" },
        { fromIdx: 3, fromPort: "score", toIdx: 8, toPort: "sentiment" },
        { fromIdx: 3, fromPort: "stats", toIdx: 9, toPort: "stats" },
      ],
    },
    {
      name: "🏛️ Vision politique 2026",
      description: "5 scénarios politiques projetés sur NVDA : tarifs Chine, régulation IA, choc électoral, crise bancaire, pivot Fed. 4 trajectoires comparées + headlines.",
      nodes: [
        { type: "NewsFeed",          x: 40,  y: 40,  params: { topic: "geopolitics", period: 30, min_relevance: 0.5 } },
        { type: "Headlines",         x: 260, y: 40,  params: { max: 6 } },
        { type: "Asset",             x: 40,  y: 300, params: { ticker: "NVDA" } },
        { type: "Clean",             x: 260, y: 300 },
        // 4 scénarios politiques en parallèle
        { type: "PoliticalScenario", x: 480, y: 60,  params: { scenario: "tariffs-us-china" } },
        { type: "Chart",             x: 700, y: 60 },
        { type: "PoliticalScenario", x: 480, y: 220, params: { scenario: "ai-regulation-strict" } },
        { type: "Chart",             x: 700, y: 220 },
        { type: "PoliticalScenario", x: 480, y: 380, params: { scenario: "election-pro-business" } },
        { type: "Chart",             x: 700, y: 380 },
        { type: "PoliticalScenario", x: 480, y: 540, params: { scenario: "banking-crisis" } },
        { type: "Chart",             x: 700, y: 540 },
        // KPI synthèse
        { type: "KPI",               x: 920, y: 60,  params: { metric: "stress_end_pct" } },
        { type: "KPI",               x: 920, y: 220, params: { metric: "stress_end_pct" } },
        { type: "KPI",               x: 920, y: 380, params: { metric: "stress_end_pct" } },
        { type: "KPI",               x: 920, y: 540, params: { metric: "stress_end_pct" } },
      ],
      edges: [
        { fromIdx: 0, fromPort: "news",   toIdx: 1, toPort: "news" },
        { fromIdx: 2, fromPort: "prices", toIdx: 3, toPort: "in" },
        // 4 scénarios
        { fromIdx: 3, fromPort: "out", toIdx: 4, toPort: "in" },
        { fromIdx: 4, fromPort: "scenario", toIdx: 5, toPort: "series" },
        { fromIdx: 4, fromPort: "stats", toIdx: 12, toPort: "stats" },
        { fromIdx: 3, fromPort: "out", toIdx: 6, toPort: "in" },
        { fromIdx: 6, fromPort: "scenario", toIdx: 7, toPort: "series" },
        { fromIdx: 6, fromPort: "stats", toIdx: 13, toPort: "stats" },
        { fromIdx: 3, fromPort: "out", toIdx: 8, toPort: "in" },
        { fromIdx: 8, fromPort: "scenario", toIdx: 9, toPort: "series" },
        { fromIdx: 8, fromPort: "stats", toIdx: 14, toPort: "stats" },
        { fromIdx: 3, fromPort: "out", toIdx: 10, toPort: "in" },
        { fromIdx: 10, fromPort: "scenario", toIdx: 11, toPort: "series" },
        { fromIdx: 10, fromPort: "stats", toIdx: 15, toPort: "stats" },
      ],
    },
    {
      name: "📡 Event Impact (news × prix)",
      description: "Sentiment des news Tech projeté en drift sur NVDA pour les 30 prochains jours. Combine narrative et prix pour estimer la trajectoire.",
      nodes: [
        { type: "NewsFeed",      x: 40,  y: 40,  params: { topic: "tech", period: 30, min_relevance: 0.4 } },
        { type: "NewsFilter",    x: 260, y: 40,  params: { ticker: "NVDA", sector: "all" } },
        { type: "Headlines",     x: 480, y: 40,  params: { max: 5 } },
        { type: "Asset",         x: 40,  y: 260, params: { ticker: "NVDA" } },
        { type: "Clean",         x: 260, y: 260 },
        { type: "EventImpact",   x: 480, y: 260, params: { horizon: 30, magnitude: 1 } },
        { type: "Chart",         x: 700, y: 260 },
        { type: "KPI",           x: 920, y: 200, params: { metric: "projected_return_pct" } },
        { type: "KPI",           x: 920, y: 320, params: { metric: "news_sentiment" } },
      ],
      edges: [
        { fromIdx: 0, fromPort: "news",    toIdx: 1, toPort: "in" },
        { fromIdx: 1, fromPort: "out",     toIdx: 2, toPort: "news" },
        { fromIdx: 3, fromPort: "prices",  toIdx: 4, toPort: "in" },
        { fromIdx: 4, fromPort: "out",     toIdx: 5, toPort: "series" },
        { fromIdx: 1, fromPort: "out",     toIdx: 5, toPort: "news" },
        { fromIdx: 5, fromPort: "adjusted",toIdx: 6, toPort: "series" },
        { fromIdx: 5, fromPort: "stats",   toIdx: 7, toPort: "stats" },
        { fromIdx: 5, fromPort: "stats",   toIdx: 8, toPort: "stats" },
      ],
    },

    // ============================================================
    // DÉMOS ULTRA-COMPLEXES
    // ============================================================
    {
      name: "🧪 Lab quant complet (NVDA)",
      description: "Pipeline d'analyse exhaustif sur 1 actif : stats + verdict + MA50 + forecast 60j + détection anomalies + stress 2008. 17 nodes, 5 branches parallèles depuis Clean.",
      nodes: [
        { type: "Sentiment",   x: 40,  y: 40,  params: { ticker: "NVDA" } },
        { type: "Asset",       x: 40,  y: 220, params: { ticker: "NVDA" } },
        { type: "Clean",       x: 260, y: 220 },
        // Branche 1 : Stats → Verdict + 3 KPI
        { type: "Returns",     x: 480, y: 40 },
        { type: "Stats",       x: 700, y: 40 },
        { type: "Verdict",     x: 920, y: 40,  params: { risk: "medium" } },
        { type: "KPI",         x: 1140, y: 0,  params: { metric: "sharpe" } },
        { type: "KPI",         x: 1140, y: 95, params: { metric: "ann_vol_pct" } },
        { type: "KPI",         x: 1140, y: 190,params: { metric: "max_drawdown_pct" } },
        // Branche 2 : Rolling Mean → Chart
        { type: "RollingMean", x: 480, y: 220, params: { window: 50 } },
        { type: "Chart",       x: 700, y: 220 },
        // Branche 3 : Forecast → Chart
        { type: "Forecast",    x: 480, y: 360, params: { horizon: 60, method: "drift" } },
        { type: "Chart",       x: 700, y: 360 },
        // Branche 4 : Anomalies → KPI
        { type: "Anomalies",   x: 480, y: 500, params: { threshold: 2.5 } },
        { type: "KPI",         x: 700, y: 500, params: { metric: "anomaly_rate_pct" } },
        // Branche 5 : Stress 2008 → KPI + Chart
        { type: "StressTest",  x: 480, y: 640, params: { scenario: "gfc-2008" } },
        { type: "KPI",         x: 700, y: 640, params: { metric: "stress_dd_pct" } },
      ],
      edges: [
        // Asset → Clean
        { fromIdx: 1, fromPort: "prices", toIdx: 2, toPort: "in" },
        // Branche 1
        { fromIdx: 2, fromPort: "out",    toIdx: 3, toPort: "in" },
        { fromIdx: 3, fromPort: "out",    toIdx: 4, toPort: "in" },
        { fromIdx: 4, fromPort: "stats",  toIdx: 5, toPort: "stats" },
        { fromIdx: 0, fromPort: "score",  toIdx: 5, toPort: "sentiment" },
        { fromIdx: 4, fromPort: "stats",  toIdx: 6, toPort: "stats" },
        { fromIdx: 4, fromPort: "stats",  toIdx: 7, toPort: "stats" },
        { fromIdx: 4, fromPort: "stats",  toIdx: 8, toPort: "stats" },
        // Branche 2
        { fromIdx: 2, fromPort: "out",    toIdx: 9, toPort: "in" },
        { fromIdx: 9, fromPort: "out",    toIdx: 10, toPort: "series" },
        // Branche 3
        { fromIdx: 2, fromPort: "out",    toIdx: 11, toPort: "in" },
        { fromIdx: 11, fromPort: "forecast", toIdx: 12, toPort: "series" },
        // Branche 4
        { fromIdx: 2, fromPort: "out",    toIdx: 13, toPort: "in" },
        { fromIdx: 13, fromPort: "stats", toIdx: 14, toPort: "stats" },
        // Branche 5
        { fromIdx: 2, fromPort: "out",    toIdx: 15, toPort: "in" },
        { fromIdx: 15, fromPort: "stats", toIdx: 16, toPort: "stats" },
      ],
    },

    {
      name: "🔗 Pairs Trading NVDA/MSFT",
      description: "Analyse d'une paire d'actifs : 2 pipelines parallèles + corrélation + régression linéaire + Sharpe comparé. 12 nodes pour détecter des opportunités d'arbitrage.",
      nodes: [
        // Pipeline A (NVDA)
        { type: "Asset",       x: 40,  y: 60,  params: { ticker: "NVDA" } },
        { type: "Clean",       x: 240, y: 60 },
        { type: "Returns",     x: 440, y: 60 },
        { type: "Stats",       x: 640, y: 60 },
        { type: "KPI",         x: 840, y: 60, params: { metric: "sharpe" } },
        // Pipeline B (MSFT)
        { type: "Asset",       x: 40,  y: 400, params: { ticker: "MSFT" } },
        { type: "Clean",       x: 240, y: 400 },
        { type: "Returns",     x: 440, y: 400 },
        { type: "Stats",       x: 640, y: 400 },
        { type: "KPI",         x: 840, y: 400, params: { metric: "sharpe" } },
        // Cross-analysis : correlation entre returns
        { type: "Correlation", x: 640, y: 230 },
        { type: "KPI",         x: 840, y: 230, params: { metric: "correlation" } },
        // Régression A → B
        { type: "LinearRegression", x: 1060, y: 230 },
        { type: "KPI",         x: 1260, y: 200, params: { metric: "r_squared" } },
        { type: "KPI",         x: 1260, y: 290, params: { metric: "slope" } },
      ],
      edges: [
        // Pipeline A
        { fromIdx: 0, fromPort: "prices", toIdx: 1, toPort: "in" },
        { fromIdx: 1, fromPort: "out",    toIdx: 2, toPort: "in" },
        { fromIdx: 2, fromPort: "out",    toIdx: 3, toPort: "in" },
        { fromIdx: 3, fromPort: "stats",  toIdx: 4, toPort: "stats" },
        // Pipeline B
        { fromIdx: 5, fromPort: "prices", toIdx: 6, toPort: "in" },
        { fromIdx: 6, fromPort: "out",    toIdx: 7, toPort: "in" },
        { fromIdx: 7, fromPort: "out",    toIdx: 8, toPort: "in" },
        { fromIdx: 8, fromPort: "stats",  toIdx: 9, toPort: "stats" },
        // Correlation between returns
        { fromIdx: 2, fromPort: "out",    toIdx: 10, toPort: "a" },
        { fromIdx: 7, fromPort: "out",    toIdx: 10, toPort: "b" },
        { fromIdx: 10, fromPort: "stats", toIdx: 11, toPort: "stats" },
        // Linear regression A on B
        { fromIdx: 2, fromPort: "out",    toIdx: 12, toPort: "X" },
        { fromIdx: 7, fromPort: "out",    toIdx: 12, toPort: "y" },
        { fromIdx: 12, fromPort: "stats", toIdx: 13, toPort: "stats" },
        { fromIdx: 12, fromPort: "stats", toIdx: 14, toPort: "stats" },
      ],
    },

    {
      name: "🛡️ Stress 4 scénarios (NVDA)",
      description: "Le même actif soumis aux 4 grandes crises historiques simultanément : GFC 2008, COVID 2020, hausse taux 2022, dot-com 2000. 14 nodes pour évaluer la résilience.",
      nodes: [
        { type: "Asset",      x: 40,  y: 280, params: { ticker: "NVDA" } },
        { type: "Clean",      x: 240, y: 280 },
        // 4 scénarios en parallèle
        { type: "StressTest", x: 440, y: 40,  params: { scenario: "gfc-2008" } },
        { type: "Chart",      x: 640, y: 40 },
        { type: "KPI",        x: 840, y: 40,  params: { metric: "stress_dd_pct" } },
        { type: "StressTest", x: 440, y: 200, params: { scenario: "covid-2020" } },
        { type: "Chart",      x: 640, y: 200 },
        { type: "KPI",        x: 840, y: 200, params: { metric: "stress_dd_pct" } },
        { type: "StressTest", x: 440, y: 360, params: { scenario: "rates-2022" } },
        { type: "Chart",      x: 640, y: 360 },
        { type: "KPI",        x: 840, y: 360, params: { metric: "stress_dd_pct" } },
        { type: "StressTest", x: 440, y: 520, params: { scenario: "dotcom-2000" } },
        { type: "Chart",      x: 640, y: 520 },
        { type: "KPI",        x: 840, y: 520, params: { metric: "stress_dd_pct" } },
      ],
      edges: [
        { fromIdx: 0, fromPort: "prices", toIdx: 1, toPort: "in" },
        // GFC
        { fromIdx: 1, fromPort: "out",      toIdx: 2, toPort: "in" },
        { fromIdx: 2, fromPort: "stressed", toIdx: 3, toPort: "series" },
        { fromIdx: 2, fromPort: "stats",    toIdx: 4, toPort: "stats" },
        // COVID
        { fromIdx: 1, fromPort: "out",      toIdx: 5, toPort: "in" },
        { fromIdx: 5, fromPort: "stressed", toIdx: 6, toPort: "series" },
        { fromIdx: 5, fromPort: "stats",    toIdx: 7, toPort: "stats" },
        // 2022
        { fromIdx: 1, fromPort: "out",      toIdx: 8, toPort: "in" },
        { fromIdx: 8, fromPort: "stressed", toIdx: 9, toPort: "series" },
        { fromIdx: 8, fromPort: "stats",    toIdx: 10, toPort: "stats" },
        // Dot-com
        { fromIdx: 1, fromPort: "out",      toIdx: 11, toPort: "in" },
        { fromIdx: 11, fromPort: "stressed",toIdx: 12, toPort: "series" },
        { fromIdx: 11, fromPort: "stats",   toIdx: 13, toPort: "stats" },
      ],
    },

    {
      name: "🏛️ Hedge Fund Lab (4 stratégies)",
      description: "Backtest complet : 3 stratégies RL + Forecast 60j + référence buy & hold. Equity curves + écart vs B&H + Sharpe pour chacune. 16 nodes.",
      nodes: [
        { type: "Asset",       x: 40,  y: 380, params: { ticker: "NVDA" } },
        { type: "Clean",       x: 240, y: 380 },
        // Stratégie 1 : Momentum
        { type: "RLAgent",     x: 440, y: 40,  params: { strategy: "momentum" } },
        { type: "Chart",       x: 640, y: 40 },
        { type: "KPI",         x: 840, y: 40,  params: { metric: "vs_buyhold_pct" } },
        // Stratégie 2 : Mean-revert
        { type: "RLAgent",     x: 440, y: 200, params: { strategy: "mean-revert" } },
        { type: "Chart",       x: 640, y: 200 },
        { type: "KPI",         x: 840, y: 200, params: { metric: "vs_buyhold_pct" } },
        // Stratégie 3 : Trend
        { type: "RLAgent",     x: 440, y: 360, params: { strategy: "trend" } },
        { type: "Chart",       x: 640, y: 360 },
        { type: "KPI",         x: 840, y: 360, params: { metric: "vs_buyhold_pct" } },
        // Stratégie 4 : Forecast AR(1)
        { type: "Forecast",    x: 440, y: 520, params: { horizon: 60, method: "ar(1)" } },
        { type: "Chart",       x: 640, y: 520 },
        // Référence buy & hold (Stats baseline)
        { type: "Returns",     x: 440, y: 680 },
        { type: "Stats",       x: 640, y: 680 },
        { type: "KPI",         x: 840, y: 680, params: { metric: "sharpe" } },
      ],
      edges: [
        { fromIdx: 0, fromPort: "prices", toIdx: 1, toPort: "in" },
        // Momentum
        { fromIdx: 1, fromPort: "out",    toIdx: 2, toPort: "in" },
        { fromIdx: 2, fromPort: "equity", toIdx: 3, toPort: "series" },
        { fromIdx: 2, fromPort: "stats",  toIdx: 4, toPort: "stats" },
        // Mean-revert
        { fromIdx: 1, fromPort: "out",    toIdx: 5, toPort: "in" },
        { fromIdx: 5, fromPort: "equity", toIdx: 6, toPort: "series" },
        { fromIdx: 5, fromPort: "stats",  toIdx: 7, toPort: "stats" },
        // Trend
        { fromIdx: 1, fromPort: "out",    toIdx: 8, toPort: "in" },
        { fromIdx: 8, fromPort: "equity", toIdx: 9, toPort: "series" },
        { fromIdx: 8, fromPort: "stats",  toIdx: 10, toPort: "stats" },
        // Forecast
        { fromIdx: 1, fromPort: "out",    toIdx: 11, toPort: "in" },
        { fromIdx: 11, fromPort: "forecast", toIdx: 12, toPort: "series" },
        // Baseline B&H
        { fromIdx: 1, fromPort: "out",    toIdx: 13, toPort: "in" },
        { fromIdx: 13, fromPort: "out",   toIdx: 14, toPort: "in" },
        { fromIdx: 14, fromPort: "stats", toIdx: 15, toPort: "stats" },
      ],
    },
  ];

  // ============================================================
  // Canvas state
  // ============================================================
  const canvas = {
    nodes: [],            // { id, type, x, y, params, outputs, error }
    edges: [],            // { id, from: {nodeId, port}, to: {nodeId, port} }
    selectedNodeId: null, // dernier node cliqué (pour Suppr)
    selectedNodeIds: new Set(), // multi-selection
    nodeIdSeq: 1,
    edgeIdSeq: 1,

    // Drag state
    dragging: null,       // { type: 'node'|'wire'|'pan', ... }

    // Pan/zoom
    zoom: 1,
    panX: 0,
    panY: 0,
    minZoom: 0.3,
    maxZoom: 2.5,

    // DOM refs
    wrap: null,
    viewport: null,
    wiresSvg: null,
    nodesEl: null,
    resultsEl: null,
    statusEl: null,
    zoomLabelEl: null,
    ctx: { hasApiKey: false },

    onChange: null,       // callback when graph changes
  };

  function applyTransform() {
    if (canvas.viewport) {
      canvas.viewport.style.transform =
        `translate(${canvas.panX}px, ${canvas.panY}px) scale(${canvas.zoom})`;
    }
    if (canvas.zoomLabelEl) {
      canvas.zoomLabelEl.textContent = `${Math.round(canvas.zoom * 100)}%`;
    }
  }

  function screenToWorld(screenX, screenY) {
    return {
      x: (screenX - canvas.panX) / canvas.zoom,
      y: (screenY - canvas.panY) / canvas.zoom,
    };
  }

  function setZoom(newZoom, anchorScreenX, anchorScreenY) {
    newZoom = Math.max(canvas.minZoom, Math.min(canvas.maxZoom, newZoom));
    if (anchorScreenX != null && anchorScreenY != null) {
      // Garde le point sous le curseur fixe
      const before = screenToWorld(anchorScreenX, anchorScreenY);
      canvas.zoom = newZoom;
      canvas.panX = anchorScreenX - before.x * newZoom;
      canvas.panY = anchorScreenY - before.y * newZoom;
    } else {
      canvas.zoom = newZoom;
    }
    applyTransform();
  }

  function resetView() {
    canvas.zoom = 1;
    canvas.panX = 0;
    canvas.panY = 0;
    applyTransform();
  }

  function fitView() {
    if (!canvas.nodes.length) return resetView();
    // Approx node size (offsetWidth not always reliable post-load)
    const NW = 180, NH = 130;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of canvas.nodes) {
      const el = document.querySelector(`[data-node-id="${n.id}"]`);
      const w = (el?.offsetWidth || NW);
      const h = (el?.offsetHeight || NH);
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + w);
      maxY = Math.max(maxY, n.y + h);
    }
    const pad = 30;
    const bw = maxX - minX + 2 * pad;
    const bh = maxY - minY + 2 * pad;
    const rect = canvas.wrap.getBoundingClientRect();
    const z = Math.min(canvas.maxZoom, Math.min(rect.width / bw, rect.height / bh));
    canvas.zoom = Math.max(canvas.minZoom, z);
    // Center the bbox in the viewport
    canvas.panX = (rect.width - bw * canvas.zoom) / 2 - (minX - pad) * canvas.zoom;
    canvas.panY = (rect.height - bh * canvas.zoom) / 2 - (minY - pad) * canvas.zoom;
    applyTransform();
  }

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function addNode(typeName, x, y, paramsOverride, opts = {}) {
    const spec = NODE_TYPES[typeName];
    if (!spec) return null;
    const params = {};
    (spec.params || []).forEach(p => (params[p.name] = p.default));
    if (paramsOverride) Object.assign(params, paramsOverride);
    const node = {
      id: uid("n"),
      type: typeName,
      x: x ?? 100,
      y: y ?? 100,
      params,
      outputs: {},
      error: null,
    };
    canvas.nodes.push(node);
    renderNode(node);
    if (!opts.skipRun) runGraph();
    return node;
  }

  function removeNode(nodeId) {
    canvas.nodes = canvas.nodes.filter(n => n.id !== nodeId);
    canvas.edges = canvas.edges.filter(
      e => e.from.nodeId !== nodeId && e.to.nodeId !== nodeId
    );
    document.querySelector(`[data-node-id="${nodeId}"]`)?.remove();
    runGraph();
  }

  function addEdge(fromNodeId, fromPort, toNodeId, toPort, opts = {}) {
    // Type check
    const fromNode = canvas.nodes.find(n => n.id === fromNodeId);
    const toNode = canvas.nodes.find(n => n.id === toNodeId);
    if (!fromNode || !toNode) return false;
    const outSpec = NODE_TYPES[fromNode.type].outputs.find(o => o.name === fromPort);
    const inSpec = NODE_TYPES[toNode.type].inputs.find(i => i.name === toPort);
    if (!outSpec || !inSpec) return false;
    if (outSpec.type !== inSpec.type) {
      showToast(`Incompatible: ${outSpec.type} → ${inSpec.type}`, "error");
      return false;
    }
    // Pas d'auto-connexion
    if (fromNodeId === toNodeId) return false;
    // Remplace toute edge existante sur ce port d'entrée (1 connection in)
    canvas.edges = canvas.edges.filter(
      e => !(e.to.nodeId === toNodeId && e.to.port === toPort)
    );
    canvas.edges.push({
      id: uid("e"),
      from: { nodeId: fromNodeId, port: fromPort },
      to: { nodeId: toNodeId, port: toPort },
    });
    if (!opts.skipRun) runGraph();
    return true;
  }

  // ============================================================
  // Graph execution
  // ============================================================
  function runGraph() {
    // Reset outputs
    canvas.nodes.forEach(n => {
      n.outputs = {};
      n.error = null;
    });

    // Topological sort
    const inDeg = {};
    canvas.nodes.forEach(n => (inDeg[n.id] = 0));
    canvas.edges.forEach(e => {
      inDeg[e.to.nodeId] = (inDeg[e.to.nodeId] || 0) + 1;
    });
    const queue = canvas.nodes.filter(n => inDeg[n.id] === 0).map(n => n.id);
    const order = [];
    while (queue.length) {
      const id = queue.shift();
      order.push(id);
      canvas.edges
        .filter(e => e.from.nodeId === id)
        .forEach(e => {
          inDeg[e.to.nodeId]--;
          if (inDeg[e.to.nodeId] === 0) queue.push(e.to.nodeId);
        });
    }
    // Execute
    for (const id of order) {
      const node = canvas.nodes.find(n => n.id === id);
      const spec = NODE_TYPES[node.type];
      const inputs = {};
      (spec.inputs || []).forEach(i => {
        const edge = canvas.edges.find(e => e.to.nodeId === id && e.to.port === i.name);
        if (edge) {
          const src = canvas.nodes.find(n => n.id === edge.from.nodeId);
          inputs[i.name] = src && src.outputs ? src.outputs[edge.from.port] : null;
        } else {
          inputs[i.name] = null;
        }
      });
      try {
        const out = spec.compute(inputs, node.params, canvas.ctx) || {};
        node.outputs = out;
      } catch (err) {
        node.error = err.message;
        node.outputs = {};
      }
    }

    redrawAll();
    autosave();
    if (canvas.onChange) canvas.onChange(canvas);
  }

  // ============================================================
  // Rendering
  // ============================================================
  function categoryColor(cat) {
    return {
      source: "#5b8a5d",
      transform: "#4a7c7e",
      analysis: "#c9a168",
      ml: "#b86056",
      output: "#8a6b97",
      group: "#b87b58",
    }[cat] || "#fff";
  }

  function renderNode(node) {
    const spec = NODE_TYPES[node.type];
    const old = document.querySelector(`[data-node-id="${node.id}"]`);
    if (old) old.remove();

    const el = document.createElement("div");
    el.className = "node";
    el.dataset.nodeId = node.id;
    el.style.left = node.x + "px";
    el.style.top = node.y + "px";

    const header = document.createElement("div");
    header.className = "node-header";
    const cat = document.createElement("span");
    cat.className = "node-cat";
    cat.style.background = categoryColor(spec.category);
    header.appendChild(cat);
    header.appendChild(document.createTextNode(spec.title));
    el.appendChild(header);

    const body = document.createElement("div");
    body.className = "node-body";

    (spec.params || []).forEach(p => {
      const pwrap = document.createElement("div");
      pwrap.className = "node-param";
      const label = document.createElement("label");
      label.textContent = p.label || p.name;
      pwrap.appendChild(label);
      let input;
      if (p.type === "select") {
        input = document.createElement("select");
        const opts = typeof p.options === "function" ? p.options() : p.options;
        opts.forEach(o => {
          const opt = document.createElement("option");
          opt.value = o;
          opt.textContent = o;
          input.appendChild(opt);
        });
        input.value = node.params[p.name];
      } else {
        input = document.createElement("input");
        input.type = p.type === "number" ? "number" : "text";
        input.value = node.params[p.name];
      }
      input.addEventListener("change", () => {
        node.params[p.name] = p.type === "number" ? +input.value : input.value;
        runGraph();
      });
      input.addEventListener("mousedown", e => e.stopPropagation());
      pwrap.appendChild(input);
      body.appendChild(pwrap);
    });

    const readout = document.createElement("div");
    readout.className = "node-readout";
    readout.dataset.role = "readout";
    body.appendChild(readout);
    el.appendChild(body);

    // Ports
    (spec.inputs || []).forEach((inp, idx) => {
      const port = document.createElement("div");
      port.className = "node-port in";
      port.dataset.portKind = "in";
      port.dataset.portName = inp.name;
      port.style.top = `${52 + idx * 22}px`;
      el.appendChild(port);

      const label = document.createElement("span");
      label.className = "port-label in";
      label.textContent = inp.name;
      label.style.top = `${52 + idx * 22}px`;
      label.style.fontSize = "9px";
      el.appendChild(label);
    });
    (spec.outputs || []).forEach((out, idx) => {
      const port = document.createElement("div");
      port.className = "node-port out";
      port.dataset.portKind = "out";
      port.dataset.portName = out.name;
      port.style.top = `${52 + idx * 22}px`;
      el.appendChild(port);

      const label = document.createElement("span");
      label.className = "port-label out";
      label.textContent = out.name;
      label.style.top = `${52 + idx * 22}px`;
      label.style.fontSize = "9px";
      el.appendChild(label);
    });

    // Drag node — offset en world coords pour rester correct sous zoom
    header.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopPropagation();
      if (e.shiftKey) {
        // Shift+clic : toggle multi-select, pas de drag
        toggleSelectNode(node.id);
        return;
      }
      // Clic simple sur node non-sélectionné → selection unique
      if (!canvas.selectedNodeIds.has(node.id)) {
        selectNode(node.id, false);
      } else {
        canvas.selectedNodeId = node.id;
      }
      const rect = canvas.wrap.getBoundingClientRect();
      const w = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
      canvas.dragging = {
        type: "node",
        nodeId: node.id,
        offsetX: w.x - node.x,
        offsetY: w.y - node.y,
      };
    });

    // Drag from output port
    el.querySelectorAll(".node-port.out").forEach(port => {
      port.addEventListener("mousedown", e => {
        e.preventDefault();
        e.stopPropagation();
        const portName = port.dataset.portName;
        canvas.dragging = {
          type: "wire",
          fromNodeId: node.id,
          fromPort: portName,
        };
      });
    });

    // Drop wire on input port
    el.querySelectorAll(".node-port.in").forEach(port => {
      port.addEventListener("mouseup", e => {
        e.preventDefault();
        e.stopPropagation();
        const d = canvas.dragging;
        if (d && d.type === "wire") {
          addEdge(d.fromNodeId, d.fromPort, node.id, port.dataset.portName);
        }
        canvas.dragging = null;
      });
    });

    el.addEventListener("mousedown", () => selectNode(node.id));

    canvas.nodesEl.appendChild(el);
  }

  function selectNode(id, additive) {
    if (!additive) canvas.selectedNodeIds.clear();
    if (id) canvas.selectedNodeIds.add(id);
    canvas.selectedNodeId = id;
    refreshSelectionDom();
  }
  function toggleSelectNode(id) {
    if (canvas.selectedNodeIds.has(id)) canvas.selectedNodeIds.delete(id);
    else canvas.selectedNodeIds.add(id);
    canvas.selectedNodeId = id;
    refreshSelectionDom();
  }
  function refreshSelectionDom() {
    document.querySelectorAll(".node").forEach(n => {
      n.classList.toggle("selected", canvas.selectedNodeIds.has(n.dataset.nodeId));
    });
    if (canvas.onSelectionChange) canvas.onSelectionChange(canvas.selectedNodeIds);
  }

  function redrawAll() {
    // Readouts
    canvas.nodes.forEach(n => {
      const el = document.querySelector(`[data-node-id="${n.id}"]`);
      if (!el) return;
      const readout = el.querySelector("[data-role='readout']");
      const spec = NODE_TYPES[n.type];
      readout.textContent = n.error
        ? `⚠ ${n.error}`
        : spec.readout
        ? spec.readout(n.outputs)
        : "(ok)";
      el.classList.toggle("error", !!n.error);
      const hasOut = Object.values(n.outputs).some(v => v != null);
      el.classList.toggle("computed", hasOut);
    });
    redrawWires();
    redrawResults();
  }

  function portPos(nodeId, kind, portName) {
    // World coordinates — la SVG vit dans le viewport transformé, donc on
    // n'a pas besoin d'appliquer pan/zoom ici.
    const node = canvas.nodes.find(n => n.id === nodeId);
    if (!node) return null;
    const spec = NODE_TYPES[node.type];
    const list = kind === "in" ? spec.inputs : spec.outputs;
    const idx = list.findIndex(p => p.name === portName);
    if (idx < 0) return null;
    const el = document.querySelector(`[data-node-id="${nodeId}"]`);
    const nodeWidth = el?.offsetWidth || 160;
    return {
      x: kind === "in" ? node.x : node.x + nodeWidth,
      y: node.y + 52 + idx * 22,
    };
  }

  function redrawWires(extraPreview) {
    const svg = canvas.wiresSvg;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    // Existing wires
    canvas.edges.forEach(e => {
      const a = portPos(e.from.nodeId, "out", e.from.port);
      const b = portPos(e.to.nodeId, "in", e.to.port);
      if (!a || !b) return;
      svg.appendChild(makeWire(a, b, false, e.id));
    });
    if (extraPreview) {
      svg.appendChild(makeWire(extraPreview.from, extraPreview.to, true));
    }
  }

  function makeWire(a, b, preview, id) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const dx = Math.max(40, Math.abs(b.x - a.x) / 2);
    const d = `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
    path.setAttribute("d", d);
    path.setAttribute("class", "wire" + (preview ? " preview" : ""));
    if (id) path.dataset.edgeId = id;
    if (!preview) {
      path.style.pointerEvents = "stroke";
      path.style.cursor = "pointer";
      path.addEventListener("click", () => {
        canvas.edges = canvas.edges.filter(e => e.id !== id);
        runGraph();
      });
    }
    return path;
  }

  // ============================================================
  // Registre KPI — pour chaque métrique : label, bench, status, explain, formule
  // ============================================================
  const KPI_INFO = {
    sharpe: {
      label: "Sharpe Ratio",
      fmt: v => v.toFixed(2),
      bench: "Marché ≈ 0.5–0.7 · Bon > 1 · Excellent > 1.5",
      status: v => v >= 1 ? "ok" : v >= 0.5 ? "warn" : "bad",
      explain: v => v >= 1.5 ? "Excellent — risque/rendement très favorable."
        : v >= 1 ? "Bon — au-dessus du marché."
        : v >= 0.5 ? "Acceptable, dans la moyenne marché."
        : v >= 0 ? "Faible — le risque n'est pas récompensé."
        : "Sharpe négatif — perte ajustée du risque.",
      formula: "Sharpe = R_annualisé / σ_annualisée",
      formulaDesc: "Rendement par unité de volatilité totale (William Sharpe, 1966).",
    },
    ann_return_pct: {
      label: "Rendement annualisé",
      fmt: v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`,
      bench: "S&P long terme ≈ 8% · Bon > 10% · Médiocre < 4%",
      status: v => v >= 8 ? "ok" : v >= 0 ? "warn" : "bad",
      explain: v => v > 0
        ? `À ce rythme, ton capital double tous les ~${Math.max(1, Math.round(72 / v))} ans (règle de 72).`
        : "Rendement annualisé négatif — pertes composées.",
      formula: "CAGR = (1 + moyenne)^252 − 1",
      formulaDesc: "Le rendement annuel composé, plus pertinent que la moyenne simple.",
    },
    ann_vol_pct: {
      label: "Volatilité annualisée",
      fmt: v => `${v.toFixed(1)}%`,
      bench: "S&P ≈ 15% · Calme < 10% · Élevée > 25%",
      status: v => v < 15 ? "ok" : v < 25 ? "warn" : "bad",
      explain: v => `Variation typique de ±${(v / Math.sqrt(252)).toFixed(2)}% par jour.`,
      formula: "σ_ann = σ_quotidienne × √252",
      formulaDesc: "Écart-type des returns journaliers mis à l'échelle annuelle.",
    },
    max_drawdown_pct: {
      label: "Max Drawdown",
      fmt: v => `${v.toFixed(1)}%`,
      bench: "Calme > −10% · Modéré −10/−25% · Sévère < −25%",
      status: v => v > -10 ? "ok" : v > -25 ? "warn" : "bad",
      explain: v => v > -10 ? "Drawdown contenu — résilience confortable."
        : v > -25 ? "Drawdown modéré — typique."
        : "Drawdown sévère — proche d'un krach historique.",
      formula: "MDD = min((cum − peak) / peak)",
      formulaDesc: "Pire chute depuis un sommet vers un creux. Indicateur de douleur maximale.",
    },
    r_squared: {
      label: "R² (qualité d'ajustement)",
      fmt: v => v.toFixed(3),
      bench: "Bon > 0.7 · Mixte 0.3–0.7 · Faible < 0.3",
      status: v => v > 0.7 ? "ok" : v > 0.3 ? "warn" : "bad",
      explain: v => `${(v * 100).toFixed(0)}% de la variance de y est expliquée par X.`,
      formula: "R² = 1 − SS_res / SS_tot",
      formulaDesc: "Mesure la qualité de l'ajustement de la régression linéaire.",
    },
    correlation: {
      label: "Corrélation",
      fmt: v => v.toFixed(3),
      bench: "−1 (opposé) · 0 (indép.) · +1 (identique)",
      status: v => Math.abs(v) > 0.7 ? "bad" : Math.abs(v) > 0.4 ? "warn" : "ok",
      explain: v => Math.abs(v) > 0.7
        ? "Très forte corrélation — les deux actifs bougent ensemble, diversification illusoire."
        : Math.abs(v) > 0.4
        ? "Corrélation modérée — diversification partielle."
        : "Faible corrélation — vraie diversification possible.",
      formula: "ρ = Cov(A, B) / (σ_A × σ_B)",
      formulaDesc: "Coefficient de Pearson. Mesure la cohérence linéaire entre deux séries.",
    },
    slope: {
      label: "Slope (pente)",
      fmt: v => v.toFixed(3),
      bench: "Sensibilité de y à X",
      status: () => null,
      explain: v => `Pour chaque +1 unité de X, y bouge de ${v.toFixed(2)} en moyenne.`,
      formula: "β = Cov(X, y) / Var(X)",
      formulaDesc: "Coefficient de régression — équivalent au Beta financier si X = marché.",
    },
    anomalies: {
      label: "Anomalies détectées",
      fmt: v => Math.round(v),
      bench: "Selon seuil z choisi",
      status: () => null,
      explain: v => `${Math.round(v)} jours classés extrêmes selon le z-score.`,
      formula: "anomalie ⇔ |x − μ| / σ > seuil",
      formulaDesc: "Détection naïve par z-score. Un z=2.5 capture ~1% de jours sous loi normale.",
    },
    anomaly_rate_pct: {
      label: "Taux d'anomalies",
      fmt: v => `${v.toFixed(1)}%`,
      bench: "Sous loi normale (z=2.5) ≈ 1%",
      status: v => v < 2 ? "ok" : v < 5 ? "warn" : "bad",
      explain: v => v > 1.5
        ? "Au-dessus de l'attendu sous loi normale — fat tails."
        : "Cohérent avec une loi normale.",
      formula: "count(|z| > seuil) / n",
      formulaDesc: "Proportion de jours dépassant le seuil. Sur-représenté = distribution non-gaussienne.",
    },
    accuracy_pct: {
      label: "Accuracy (classifier)",
      fmt: v => `${v.toFixed(1)}%`,
      bench: "Hasard ≈ 50% · Edge à partir de 53–55%",
      status: v => v > 58 ? "ok" : v > 52 ? "warn" : "bad",
      explain: v => v > 55
        ? `${(v - 50).toFixed(1)}pt au-dessus du hasard — signal exploitable.`
        : "Proche du hasard — pas de signal robuste.",
      formula: "Acc = (TP + TN) / N",
      formulaDesc: "Proportion de prédictions correctes. À comparer à la baseline (toujours prédire la classe majoritaire).",
    },
    edge_pct: {
      label: "Edge vs baseline",
      fmt: v => `${v >= 0 ? "+" : ""}${v.toFixed(1)} pt`,
      bench: "> 0 = vraie information · > 3pt = signal solide",
      status: v => v > 2 ? "ok" : v > 0 ? "warn" : "bad",
      explain: v => v > 0
        ? `${v.toFixed(1)} pt d'edge — ton modèle apporte de l'information.`
        : "Pas d'edge — équivalent à toujours prédire la classe majoritaire.",
      formula: "edge = accuracy − baseline",
      formulaDesc: "Pour évaluer un classifier binaire honnêtement, comparer toujours à la baseline (% de classe majoritaire).",
    },
    trades: {
      label: "Nombre de trades",
      fmt: v => Math.round(v),
      bench: "Stratégie active si > 20",
      status: v => v > 5 ? "ok" : "warn",
      explain: v => `${Math.round(v)} changements de position. Attention aux frais transaction non simulés ici.`,
      formula: "count(signal_t ≠ signal_{t-1})",
      formulaDesc: "Plus de trades = plus de frais en réel. Slippage à considérer.",
    },
    vs_buyhold_pct: {
      label: "Écart vs Buy & Hold",
      fmt: v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`,
      bench: "> 0 = la stratégie bat B&H · 0 = neutre",
      status: v => v > 0 ? "ok" : v > -5 ? "warn" : "bad",
      explain: v => v > 0
        ? `La stratégie bat un simple buy & hold de ${v.toFixed(1)} points.`
        : `La stratégie sous-performe buy & hold de ${Math.abs(v).toFixed(1)} pt — la simplicité paye souvent.`,
      formula: "Δ = R_stratégie − R_buy&hold",
      formulaDesc: "Si Δ < 0, l'effort de timing ne vaut pas le coup (avant même les frais).",
    },
    total_return_pct: {
      label: "Rendement total",
      fmt: v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`,
      bench: "Sur la période backtest",
      status: v => v > 0 ? "ok" : "bad",
      explain: v => v > 0
        ? `Capital final = capital initial × ${(1 + v / 100).toFixed(2)}.`
        : `Capital final = capital initial × ${(1 + v / 100).toFixed(2)} — perte.`,
    },
    stress_dd_pct: {
      label: "DD sous stress",
      fmt: v => `${v.toFixed(1)}%`,
      bench: "Suivant le scénario : peut atteindre −55% (2008) à −78% (Dot-com)",
      status: v => v > -20 ? "ok" : v > -40 ? "warn" : "bad",
      explain: v => `Sous ce scénario historique, ton actif aurait subi un drawdown de ${v.toFixed(0)}%.`,
      formula: "DD_stress = (min_value − start_value) / start_value",
    },
    stress_end_pct: {
      label: "Solde fin de stress",
      fmt: v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`,
      bench: "Récupération complète = 0% · Pas récupéré = < 0%",
      status: v => v >= -5 ? "ok" : v >= -20 ? "warn" : "bad",
      explain: v => v >= -5 ? "Récupération quasi-complète à la fin du scénario." : `Valeur finale ${v.toFixed(0)}% en dessous du départ — choc persistant.`,
      formula: "end = (val_finale − val_initiale) / val_initiale",
    },
    news_sentiment: {
      label: "Sentiment news (pondéré)",
      fmt: v => v.toFixed(2),
      bench: "−1 (très négatif) · 0 (neutre) · +1 (très positif)",
      status: v => v > 0.3 ? "ok" : v < -0.3 ? "bad" : "warn",
      explain: v => v > 0.3
        ? "Sentiment de l'actu positif — narrative favorable."
        : v < -0.3
        ? "Sentiment de l'actu négatif — narrative défavorable."
        : "Sentiment neutre — pas de narrative dominante.",
      formula: "Σ(sentiment × relevance) / Σ(relevance)",
      formulaDesc: "Moyenne pondérée par pertinence éditoriale. Permet de filtrer les actus secondaires.",
    },
    news_count: {
      label: "Nombre d'actus",
      fmt: v => Math.round(v),
      bench: "Plus élevé = sujet plus médiatisé",
      status: () => null,
      explain: v => `${Math.round(v)} actus correspondent aux filtres.`,
    },
    projected_drift_pct: {
      label: "Drift projeté (news)",
      fmt: v => `${v.toFixed(3)}%/j`,
      bench: "Calculé à partir du sentiment news",
      status: v => v > 0 ? "ok" : v < -0.05 ? "bad" : "warn",
      explain: v => `Le sentiment des actus implique une dérive quotidienne de ${v.toFixed(3)}% sur l'horizon.`,
      formula: "drift = sentiment_pondéré × 0.0015 × magnitude",
    },
    projected_return_pct: {
      label: "Return projeté",
      fmt: v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`,
      bench: "Sur l'horizon news-impact",
      status: v => v > 0 ? "ok" : v < -3 ? "bad" : "warn",
      explain: v => v > 0 ? "Trajectoire haussière projetée." : "Trajectoire baissière projetée.",
    },
    stress_recovery_days: {
      label: "Jours de récupération",
      fmt: v => Math.round(v) || "—",
      bench: "Plus c'est court, plus la résilience est forte",
      status: v => v > 0 && v < 100 ? "ok" : v > 0 ? "warn" : "bad",
      explain: v => v > 0 ? `Il faut ~${Math.round(v)} jours après le creux pour revenir à 95% du départ.` : "Pas de récupération observée dans la durée du scénario.",
    },
  };

  // Results panel rendering
  let chartRegistry = new Map();
  function _statusBadge(s) {
    if (!s) return "";
    const labels = { ok: "✓ bon", warn: "! moyen", bad: "✗ alerte" };
    return `<span class="result-status ${s}">${labels[s]}</span>`;
  }

  function _renderKPI(n) {
    const info = KPI_INFO[n.outputs._label];
    const v = n.outputs._value;
    if (v == null || !info) {
      return `
        <div class="result-tile-label">${(n.outputs._label || "KPI").toUpperCase()}</div>
        <div class="result-kpi-value">—</div>
        <div class="result-kpi-empty">Connecte un node Stats / Linear Reg / Anomalies / Classifier / RL Agent.</div>
      `;
    }
    const status = info.status ? info.status(v) : null;
    const formatted = info.fmt ? info.fmt(v) : v.toFixed(2);
    return `
      <div class="result-tile-label">${info.label.toUpperCase()} ${_statusBadge(status)}</div>
      <div class="result-kpi-value">${formatted}</div>
      ${info.bench ? `<div class="result-bench">${info.bench}</div>` : ""}
      ${info.explain ? `<div class="result-explain">${info.explain(v)}</div>` : ""}
      ${info.formula ? `
        <details class="result-formula">
          <summary>Comment c'est calculé ?</summary>
          <code>${info.formula}</code>
          ${info.formulaDesc ? `<p>${info.formulaDesc}</p>` : ""}
        </details>
      ` : ""}
    `;
  }

  function _renderVerdict(n) {
    const d = n.outputs.decision;
    if (!d) {
      return `
        <div class="result-tile-label">VERDICT</div>
        <div class="result-kpi-value">—</div>
        <div class="result-kpi-empty">Connecte Stats (obligatoire) + Sentiment (optionnel).</div>
      `;
    }
    // Récupère les inputs branchés
    const inEdgeStats = canvas.edges.find(e => e.to.nodeId === n.id && e.to.port === "stats");
    const inEdgeSent = canvas.edges.find(e => e.to.nodeId === n.id && e.to.port === "sentiment");
    const statsSrc = inEdgeStats ? canvas.nodes.find(x => x.id === inEdgeStats.from.nodeId) : null;
    const sentSrc = inEdgeSent ? canvas.nodes.find(x => x.id === inEdgeSent.from.nodeId) : null;
    const stats = statsSrc?.outputs?.stats;
    const sent = sentSrc?.outputs?.score;

    // Étoiles 1-5 selon score
    const score = d.score;
    const stars = score > 1 ? 5 : score > 0.5 ? 4 : score > 0 ? 3 : score > -0.5 ? 2 : 1;
    const starStr = "★".repeat(stars) + "☆".repeat(5 - stars);
    const actionCls = d.action === "BUY" ? "buy" : d.action === "SELL" ? "sell" : "hold";
    const titleFR = { BUY: "Acheter / Renforcer", HOLD: "Conserver", SELL: "Réduire / Vendre" }[d.action];

    const components = [];
    if (stats) {
      const sharpeStatus = stats.sharpe >= 1 ? "ok" : stats.sharpe >= 0.5 ? "warn" : "bad";
      components.push({ label: "Sharpe", value: stats.sharpe.toFixed(2), status: sharpeStatus });
    }
    if (sent) {
      const sentStatus = sent.value > 0.3 ? "ok" : sent.value < -0.3 ? "bad" : "warn";
      components.push({ label: "Sentiment", value: sent.value.toFixed(2), status: sentStatus });
    }
    const risk = n.params.risk || "medium";
    components.push({ label: "Risque", value: risk, status: null });
    components.push({ label: "Score", value: score.toFixed(2), status: null, total: true });

    const compHTML = components.map(c => `
      <div class="vc${c.total ? " vc-total" : ""}">
        <span>${c.label}</span>
        <strong>${c.value}</strong>
        ${c.status ? `<span class="result-status ${c.status}" style="font-size:9px;padding:0 4px;">${c.status}</span>` : "<span></span>"}
      </div>
    `).join("");

    return `
      <div class="result-tile-label">VERDICT</div>
      <div class="verdict-head">
        <span class="verdict-stars">${starStr}</span>
        <span class="verdict-action-pill ${actionCls}">${d.action}</span>
      </div>
      <div class="verdict-title-fr">${titleFR}</div>
      <div class="verdict-components">${compHTML}</div>
      <div class="verdict-why">${d.why}</div>
      <details class="result-formula">
        <summary>Limites du modèle</summary>
        <p>Le verdict est un score linéaire : <code>min/max(sharpe/2, ±1) + sentiment × 0.5 + biais_risque</code>. Il ne prend pas en compte le drawdown, la corrélation au marché, ni la liquidité.</p>
      </details>
    `;
  }

  function _renderChart(n, tile) {
    const s = n.outputs._series;
    if (!s || !s.values?.length) {
      tile.innerHTML = `
        <div class="result-tile-label">CHART</div>
        <div class="result-kpi-empty">Connecte une série (Asset, Clean, Returns, RL Agent equity, Forecast…).</div>
      `;
      return;
    }
    const last = s.values[s.values.length - 1];
    const first = s.values[0];
    const min = Math.min(...s.values);
    const max = Math.max(...s.values);
    const delta = first !== 0 ? ((last / first) - 1) * 100 : 0;
    const deltaCls = delta >= 0 ? "ok" : "bad";

    const cid = `chart-${n.id}`;
    tile.innerHTML = `
      <div class="result-tile-label">CHART · ${s.ticker || ""}</div>
      <div class="chart-wrap" style="height: 100px;">
        <canvas id="${cid}"></canvas>
      </div>
      <div class="chart-stats">
        <span class="cs"><span class="lbl">Last</span><strong>${formatNum(last)}</strong></span>
        <span class="cs"><span class="lbl">Min/Max</span><strong>${formatNum(min)}/${formatNum(max)}</strong></span>
        <span class="cs"><span class="lbl">Δ</span><strong class="${deltaCls}">${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%</strong></span>
        <span class="cs"><span class="lbl">Points</span><strong>${s.values.length}</strong></span>
      </div>
    `;
    canvas.resultsEl.appendChild(tile);
    setTimeout(() => {
      const old = chartRegistry.get(cid);
      if (old) old.destroy();
      const el = document.getElementById(cid);
      if (!el) return;
      const ctx = el.getContext("2d");
      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: s.dates,
          datasets: [{
            data: s.values,
            borderColor: "#4a7c7e",
            backgroundColor: "rgba(74,124,126,0.12)",
            fill: true,
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 1.5,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } },
        },
      });
      chartRegistry.set(cid, chart);
    }, 0);
  }

  function _renderHeadlines(n) {
    const items = n.outputs._news;
    if (!items || !items.length) {
      return `
        <div class="result-tile-label">HEADLINES</div>
        <div class="result-kpi-empty">Connecte un node <strong>News Feed</strong> ou <strong>News Filter</strong>.</div>
      `;
    }
    const meta = n.outputs._meta || {};
    const items_html = items.map(it => {
      const cls = it.sentiment > 0.3 ? "pos" : it.sentiment < -0.3 ? "neg" : "neu";
      const sentLabel = it.sentiment > 0.3 ? "positif" : it.sentiment < -0.3 ? "négatif" : "neutre";
      return `
        <div class="headline-item">
          <div class="headline-meta">
            <span class="headline-source">${it.source}</span>
            <span class="headline-date">${it.date}</span>
            <span class="headline-sent ${cls}">${sentLabel}</span>
          </div>
          <div class="headline-title">${it.title}</div>
          <div class="headline-tags">
            <span class="headline-cat">${it.category}</span>
            ${it.tickers?.length ? it.tickers.map(t => `<span class="headline-ticker">${t}</span>`).join("") : ""}
          </div>
        </div>
      `;
    }).join("");
    return `
      <div class="result-tile-label">📰 HEADLINES · ${meta.topic || "tous"} · ${meta.period || "?"}j</div>
      <div class="headlines-list">${items_html}</div>
    `;
  }

  function formatNum(v) {
    if (Math.abs(v) >= 1000) return v.toFixed(0);
    if (Math.abs(v) >= 10) return v.toFixed(1);
    if (Math.abs(v) >= 1) return v.toFixed(2);
    return v.toFixed(3);
  }

  function redrawResults() {
    if (!canvas.resultsEl) return;
    canvas.resultsEl.innerHTML = "";
    const outputs = canvas.nodes.filter(n => NODE_TYPES[n.type].category === "output");
    if (!outputs.length) {
      canvas.resultsEl.innerHTML = `<div class="subtle" style="grid-column: 1/-1; padding: 8px;">Ajoute un node <strong>Chart</strong>, <strong>KPI</strong> ou <strong>Verdict</strong> pour voir les résultats ici, avec leur interprétation.</div>`;
      canvas.statusEl.textContent = "Prêt";
      return;
    }
    outputs.forEach(n => {
      const tile = document.createElement("div");
      tile.className = "result-tile";
      if (n.type === "Verdict") {
        tile.classList.add("verdict-tile");
        tile.innerHTML = _renderVerdict(n);
        canvas.resultsEl.appendChild(tile);
      } else if (n.type === "KPI") {
        tile.classList.add("kpi-tile");
        tile.innerHTML = _renderKPI(n);
        canvas.resultsEl.appendChild(tile);
      } else if (n.type === "Chart") {
        tile.classList.add("chart-tile");
        _renderChart(n, tile);
      } else if (n.type === "Headlines") {
        tile.classList.add("headlines-tile");
        tile.innerHTML = _renderHeadlines(n);
        canvas.resultsEl.appendChild(tile);
      }
    });
    const ok = outputs.every(n => !n.error);
    canvas.statusEl.textContent = ok ? `✓ ${outputs.length} output(s) calculé(s)` : "⚠ Erreur graph";
  }

  // ============================================================
  // Global mouse handlers
  // ============================================================
  function attachGlobalHandlers() {
    document.addEventListener("mousemove", e => {
      if (!canvas.dragging) return;
      const rect = canvas.wrap.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      if (canvas.dragging.type === "node") {
        const node = canvas.nodes.find(n => n.id === canvas.dragging.nodeId);
        if (node) {
          const w = screenToWorld(screenX, screenY);
          node.x = w.x - canvas.dragging.offsetX;
          node.y = w.y - canvas.dragging.offsetY;
          const el = document.querySelector(`[data-node-id="${node.id}"]`);
          if (el) {
            el.style.left = node.x + "px";
            el.style.top = node.y + "px";
          }
          redrawWires();
        }
      } else if (canvas.dragging.type === "wire") {
        const from = portPos(canvas.dragging.fromNodeId, "out", canvas.dragging.fromPort);
        const w = screenToWorld(screenX, screenY);
        if (from) redrawWires({ from, to: { x: w.x, y: w.y } });
      } else if (canvas.dragging.type === "pan") {
        canvas.panX = canvas.dragging.startPanX + (e.clientX - canvas.dragging.startClientX);
        canvas.panY = canvas.dragging.startPanY + (e.clientY - canvas.dragging.startClientY);
        applyTransform();
      }
    });

    document.addEventListener("mouseup", () => {
      if (canvas.dragging?.type === "wire") {
        redrawWires();
      }
      if (canvas.dragging?.type === "pan") {
        canvas.wrap.classList.remove("panning");
      }
      canvas.dragging = null;
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const target = e.target;
        if (target && (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA")) return;
        if (canvas.selectedNodeId) {
          removeNode(canvas.selectedNodeId);
          canvas.selectedNodeId = null;
        }
      }
    });

    // Pan : mousedown n'importe où SAUF sur un node ou un port
    canvas.wrap.addEventListener("mousedown", e => {
      if (e.target.closest(".node") || e.target.closest(".node-port")) return;
      if (canvas.dragging) return;
      e.preventDefault();
      // Clic vide = deselect
      if (!e.shiftKey) selectNode(null, false);
      canvas.dragging = {
        type: "pan",
        startClientX: e.clientX,
        startClientY: e.clientY,
        startPanX: canvas.panX,
        startPanY: canvas.panY,
      };
      canvas.wrap.classList.add("panning");
    });

    // Zoom à la molette, centré sur le curseur
    canvas.wrap.addEventListener("wheel", e => {
      e.preventDefault();
      const rect = canvas.wrap.getBoundingClientRect();
      const anchorX = e.clientX - rect.left;
      const anchorY = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      setZoom(canvas.zoom * factor, anchorX, anchorY);
    }, { passive: false });
  }

  function showToast(msg, type) {
    const c = document.getElementById("toast-container");
    if (!c) return;
    const t = document.createElement("div");
    t.className = "toast " + (type || "");
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  }

  // ============================================================
  // Palette
  // ============================================================
  function renderPalette() {
    const paletteEl = document.getElementById("node-palette");
    if (!paletteEl) return;
    paletteEl.innerHTML = "";
    Object.entries(NODE_TYPES).forEach(([name, spec]) => {
      const item = document.createElement("div");
      item.className = `palette-item cat-${spec.category}`;
      item.draggable = true;
      item.innerHTML = `<span class="palette-dot"></span>${spec.title}`;
      item.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", name);
      });
      item.addEventListener("dblclick", () => {
        const x = 100 + (canvas.nodes.length % 4) * 200;
        const y = 80 + Math.floor(canvas.nodes.length / 4) * 160;
        addNode(name, x, y);
      });
      paletteEl.appendChild(item);
    });
  }

  function attachCanvasDropZone() {
    canvas.wrap.addEventListener("dragover", e => e.preventDefault());
    canvas.wrap.addEventListener("drop", e => {
      e.preventDefault();
      const name = e.dataTransfer.getData("text/plain");
      if (!NODE_TYPES[name]) return;
      const rect = canvas.wrap.getBoundingClientRect();
      const w = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
      addNode(name, w.x - 80, w.y - 20);
    });
  }

  // ============================================================
  // Init
  // ============================================================
  function init(opts) {
    canvas.wrap = document.getElementById("canvas-wrap");
    canvas.viewport = document.getElementById("canvas-viewport");
    canvas.wiresSvg = document.getElementById("canvas-wires");
    canvas.nodesEl = document.getElementById("canvas-nodes");
    canvas.resultsEl = document.getElementById("nodal-results-body");
    canvas.statusEl = document.getElementById("canvas-status");
    canvas.zoomLabelEl = document.getElementById("zoom-reset");
    if (opts && opts.ctx) Object.assign(canvas.ctx, opts.ctx);
    if (opts && opts.onChange) canvas.onChange = opts.onChange;
    loadGroupsFromStorage(); // groupes AVANT renderPalette
    renderPalette();
    attachCanvasDropZone();
    attachGlobalHandlers();
    applyTransform();

    // Zoom controls
    document.getElementById("zoom-in")?.addEventListener("click", () => {
      const r = canvas.wrap.getBoundingClientRect();
      setZoom(canvas.zoom * 1.2, r.width / 2, r.height / 2);
    });
    document.getElementById("zoom-out")?.addEventListener("click", () => {
      const r = canvas.wrap.getBoundingClientRect();
      setZoom(canvas.zoom / 1.2, r.width / 2, r.height / 2);
    });
    document.getElementById("zoom-reset")?.addEventListener("click", resetView);
    document.getElementById("zoom-fit")?.addEventListener("click", fitView);
  }

  function clear() {
    canvas.nodes = [];
    canvas.edges = [];
    canvas.nodesEl.innerHTML = "";
    redrawAll();
  }

  function loadGraph(g) {
    if (!g || !g.nodes) return false;
    clear();
    const idsByIdx = {};
    g.nodes.forEach((n, i) => {
      const node = addNode(n.type, n.x, n.y, n.params || {}, { skipRun: true });
      if (node) idsByIdx[i] = node.id;
    });
    (g.edges || []).forEach(e => {
      const fromId = idsByIdx[e.fromIdx];
      const toId = idsByIdx[e.toIdx];
      if (fromId && toId) addEdge(fromId, e.fromPort, toId, e.toPort, { skipRun: true });
    });
    if (typeof g.zoom === "number") {
      canvas.zoom = g.zoom;
      canvas.panX = g.panX || 0;
      canvas.panY = g.panY || 0;
      applyTransform();
    } else {
      // Auto-fit après que les nodes soient rendus (offsetWidth dispo)
      setTimeout(() => fitView(), 30);
    }
    runGraph();
    return true;
  }

  function loadDemo(indexOrName) {
    let demo;
    if (typeof indexOrName === "number") demo = DEMOS[indexOrName];
    else if (typeof indexOrName === "string") demo = DEMOS.find(d => d.name === indexOrName);
    else demo = DEMOS[0];
    if (!demo) return false;
    return loadGraph(demo);
  }

  // ============================================================
  // Sérialisation + sauvegarde localStorage
  // ============================================================
  const LS_SAVES = "vision:graphs";
  const LS_AUTOSAVE = "vision:current";

  function serializeGraph(name) {
    const idxById = {};
    canvas.nodes.forEach((n, i) => (idxById[n.id] = i));
    return {
      name: name || "",
      saved_at: new Date().toISOString(),
      nodes: canvas.nodes.map(n => ({
        type: n.type,
        x: n.x,
        y: n.y,
        params: { ...n.params },
      })),
      edges: canvas.edges
        .filter(e => idxById[e.from.nodeId] != null && idxById[e.to.nodeId] != null)
        .map(e => ({
          fromIdx: idxById[e.from.nodeId],
          fromPort: e.from.port,
          toIdx: idxById[e.to.nodeId],
          toPort: e.to.port,
        })),
      zoom: canvas.zoom,
      panX: canvas.panX,
      panY: canvas.panY,
    };
  }

  function listSaved() {
    try {
      return JSON.parse(localStorage.getItem(LS_SAVES) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveGraph(name) {
    if (!name) return false;
    const data = serializeGraph(name);
    const all = listSaved();
    const i = all.findIndex(g => g.name === name);
    if (i >= 0) all[i] = data;
    else all.push(data);
    try {
      localStorage.setItem(LS_SAVES, JSON.stringify(all));
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadSaved(name) {
    const g = listSaved().find(g => g.name === name);
    return g ? loadGraph(g) : false;
  }

  function deleteSaved(name) {
    const all = listSaved().filter(g => g.name !== name);
    try {
      localStorage.setItem(LS_SAVES, JSON.stringify(all));
      return true;
    } catch (e) {
      return false;
    }
  }

  let _autosaveTimer = null;
  function autosave() {
    if (_autosaveTimer) clearTimeout(_autosaveTimer);
    _autosaveTimer = setTimeout(() => {
      try {
        localStorage.setItem(LS_AUTOSAVE, JSON.stringify(serializeGraph("")));
      } catch (e) {}
    }, 200);
  }

  function restoreAutosave() {
    try {
      const raw = localStorage.getItem(LS_AUTOSAVE);
      if (!raw) return false;
      const g = JSON.parse(raw);
      if (!g || !g.nodes || !g.nodes.length) return false;
      return loadGraph(g);
    } catch (e) {
      return false;
    }
  }

  function setApiKey(active) {
    canvas.ctx.hasApiKey = active;
    runGraph();
  }

  // ============================================================
  // Groupes (composite nodes)
  // ============================================================
  const customGroups = {};
  const LS_GROUPS = "vision:groups_v2";

  function registerGroup(def) {
    customGroups[def.name] = def;
    NODE_TYPES[def.name] = {
      title: def.name,
      category: "group",
      inputs: def.inputs.map(i => ({ name: i.name, type: i.type })),
      outputs: def.outputs.map(o => ({ name: o.name, type: o.type })),
      params: def.params.map(p => ({
        name: p.name, label: p.label, type: p.type, default: p.default,
        options: typeof p.options === "function" ? p.options : (
          Array.isArray(p.options) ? () => p.options : undefined
        ),
      })),
      compute(inputs, params, ctx) {
        return runSubgraph(def, inputs, params, ctx);
      },
      readout(out) {
        const lines = [];
        for (const o of def.outputs) {
          const v = out[o.name];
          if (v == null) { lines.push(`${o.name}: —`); continue; }
          if (v.values) lines.push(`${o.name}: ${v.values.length} pts`);
          else if (v.action) lines.push(`${o.name}: ${v.action}`);
          else if (typeof v === "object") lines.push(`${o.name}: obj`);
          else lines.push(`${o.name}: ${v}`);
        }
        return lines.slice(0, 4).join("\n") || `${def.nodes.length} inner nodes`;
      },
      isGroup: true,
      _def: def,
    };
  }

  function unregisterGroup(name) {
    delete customGroups[name];
    delete NODE_TYPES[name];
  }

  function runSubgraph(def, externalInputs, externalParams, ctx) {
    // Snapshot inner nodes
    const inner = def.nodes.map(n => ({
      id: n.id, type: n.type, params: { ...n.params }, outputs: {}, error: null,
    }));

    // Apply params from external (group params → inner node params)
    if (externalParams) {
      for (const p of def.params || []) {
        if (externalParams[p.name] === undefined) continue;
        const nd = inner.find(n => n.id === p.forNodeId);
        if (nd) nd.params[p.forParam] = externalParams[p.name];
      }
    }

    // Map external inputs onto inner ports
    const preset = {};
    for (const ext of def.inputs) {
      preset[ext.to.nodeId] = preset[ext.to.nodeId] || {};
      preset[ext.to.nodeId][ext.to.port] = externalInputs[ext.name];
    }

    // Topological sort
    const inDeg = {};
    inner.forEach(n => (inDeg[n.id] = 0));
    def.edges.forEach(e => { inDeg[e.to.nodeId] = (inDeg[e.to.nodeId] || 0) + 1; });
    const queue = inner.filter(n => inDeg[n.id] === 0).map(n => n.id);
    const order = [];
    while (queue.length) {
      const id = queue.shift();
      order.push(id);
      def.edges.filter(e => e.from.nodeId === id).forEach(e => {
        inDeg[e.to.nodeId]--;
        if (inDeg[e.to.nodeId] === 0) queue.push(e.to.nodeId);
      });
    }

    // Execute
    for (const nodeId of order) {
      const nd = inner.find(n => n.id === nodeId);
      const spec = NODE_TYPES[nd.type];
      if (!spec) { nd.error = "Type inconnu: " + nd.type; continue; }
      const inputs = {};
      (spec.inputs || []).forEach(inp => {
        const edge = def.edges.find(e => e.to.nodeId === nodeId && e.to.port === inp.name);
        if (edge) {
          const src = inner.find(x => x.id === edge.from.nodeId);
          inputs[inp.name] = src?.outputs?.[edge.from.port];
        } else if (preset[nodeId] && preset[nodeId][inp.name] !== undefined) {
          inputs[inp.name] = preset[nodeId][inp.name];
        } else {
          inputs[inp.name] = null;
        }
      });
      try {
        nd.outputs = spec.compute(inputs, nd.params, ctx) || {};
      } catch (err) {
        nd.error = err.message;
        nd.outputs = {};
      }
    }

    // Collect exposed outputs
    const out = {};
    for (const ext of def.outputs) {
      const src = inner.find(n => n.id === ext.from.nodeId);
      out[ext.name] = src?.outputs?.[ext.from.port] ?? null;
    }
    return out;
  }

  function createGroupFromSelection(selectedIds, name) {
    if (!name) return false;
    if (NODE_TYPES[name]) { showToast(`Le nom "${name}" est déjà pris`, "error"); return false; }
    const idSet = new Set(selectedIds);
    const selected = canvas.nodes.filter(n => idSet.has(n.id));
    if (selected.length < 2) { showToast("Sélectionne au moins 2 nodes", "error"); return false; }

    const minX = Math.min(...selected.map(n => n.x));
    const minY = Math.min(...selected.map(n => n.y));

    const innerNodes = selected.map(n => ({
      id: n.id, type: n.type,
      x: n.x - minX, y: n.y - minY,
      params: { ...n.params },
    }));

    const innerEdges = canvas.edges
      .filter(e => idSet.has(e.from.nodeId) && idSet.has(e.to.nodeId))
      .map(e => ({ from: { ...e.from }, to: { ...e.to } }));

    const externalIn = canvas.edges.filter(e => idSet.has(e.to.nodeId) && !idSet.has(e.from.nodeId));
    const externalOut = canvas.edges.filter(e => idSet.has(e.from.nodeId) && !idSet.has(e.to.nodeId));

    // Build inputs (1 per external incoming edge)
    const inputs = [];
    const uniqueName = (base, taken) => {
      let n = base, i = 1;
      while (taken.has(n)) n = `${base}_${++i}`;
      taken.add(n);
      return n;
    };
    const inNames = new Set();
    externalIn.forEach(e => {
      const innerNode = innerNodes.find(n => n.id === e.to.nodeId);
      const typeSpec = NODE_TYPES[innerNode.type];
      const innerPort = typeSpec.inputs.find(p => p.name === e.to.port);
      const pname = uniqueName(`${innerNode.type.toLowerCase()}.${e.to.port}`, inNames);
      inputs.push({
        name: pname,
        type: innerPort.type,
        to: { nodeId: e.to.nodeId, port: e.to.port },
        externalSource: { nodeId: e.from.nodeId, port: e.from.port },
      });
    });

    // Build outputs: expose all outputs that either have an external consumer OR no internal consumer
    const outputs = [];
    const outNames = new Set();
    for (const n of innerNodes) {
      const spec = NODE_TYPES[n.type];
      for (const outp of spec.outputs || []) {
        const externalUsers = externalOut.filter(e => e.from.nodeId === n.id && e.from.port === outp.name);
        const internalUsers = innerEdges.filter(e => e.from.nodeId === n.id && e.from.port === outp.name);
        if (externalUsers.length > 0 || internalUsers.length === 0) {
          const pname = uniqueName(`${n.type.toLowerCase()}.${outp.name}`, outNames);
          outputs.push({
            name: pname,
            type: outp.type,
            from: { nodeId: n.id, port: outp.name },
            externalConsumers: externalUsers.map(e => ({ nodeId: e.to.nodeId, port: e.to.port })),
          });
        }
      }
    }

    // Promote all params with unique names
    const paramNames = new Set();
    const groupParams = [];
    for (const n of innerNodes) {
      const spec = NODE_TYPES[n.type];
      for (const p of spec.params || []) {
        const pname = uniqueName(`${n.type.toLowerCase()}.${p.name}`, paramNames);
        groupParams.push({
          name: pname,
          label: `${spec.title} · ${p.label || p.name}`,
          type: p.type,
          options: typeof p.options === "function" ? p.options() : p.options,
          default: n.params[p.name],
          forNodeId: n.id,
          forParam: p.name,
        });
      }
    }

    const def = {
      name,
      description: `${innerNodes.length} nodes : ${selected.map(n => NODE_TYPES[n.type].title).join(" → ")}`,
      nodes: innerNodes,
      edges: innerEdges,
      inputs,
      outputs,
      params: groupParams,
    };

    registerGroup(def);
    persistGroups();

    // Remove selected nodes + their edges
    selected.forEach(n => {
      canvas.nodes = canvas.nodes.filter(x => x.id !== n.id);
      canvas.edges = canvas.edges.filter(e => e.from.nodeId !== n.id && e.to.nodeId !== n.id);
      document.querySelector(`[data-node-id="${n.id}"]`)?.remove();
    });

    // Add a single group node at minX, minY
    const groupNode = addNode(name, minX, minY, undefined, { skipRun: true });
    if (!groupNode) { showToast("Impossible de créer le node groupe", "error"); return false; }

    // Re-wire external edges to group ports
    for (const inp of inputs) {
      if (inp.externalSource) {
        addEdge(inp.externalSource.nodeId, inp.externalSource.port, groupNode.id, inp.name, { skipRun: true });
      }
    }
    for (const out of outputs) {
      for (const ext of out.externalConsumers || []) {
        addEdge(groupNode.id, out.name, ext.nodeId, ext.port, { skipRun: true });
      }
    }

    // Reset selection to the new group node
    selectNode(groupNode.id, false);
    renderPalette();
    runGraph();
    showToast(`Groupe "${name}" créé (${innerNodes.length} nodes)`, "success");
    return true;
  }

  function ungroupNode(nodeId) {
    const node = canvas.nodes.find(n => n.id === nodeId);
    if (!node) return false;
    const spec = NODE_TYPES[node.type];
    if (!spec?.isGroup) { showToast("Pas un groupe", "error"); return false; }
    const def = spec._def;

    // Map: oldInnerId → newId
    const idMap = {};
    def.nodes.forEach(n => {
      const newId = uid("n");
      idMap[n.id] = newId;
      const cloned = {
        id: newId,
        type: n.type,
        x: node.x + n.x,
        y: node.y + n.y,
        params: { ...n.params },
        outputs: {},
        error: null,
      };
      // Apply current group params overrides
      for (const p of def.params || []) {
        if (p.forNodeId === n.id && node.params[p.name] !== undefined) {
          cloned.params[p.forParam] = node.params[p.name];
        }
      }
      canvas.nodes.push(cloned);
      renderNode(cloned);
    });
    // Restore internal edges
    def.edges.forEach(e => {
      const fromId = idMap[e.from.nodeId];
      const toId = idMap[e.to.nodeId];
      if (fromId && toId) addEdge(fromId, e.from.port, toId, e.to.port, { skipRun: true });
    });
    // Re-wire external edges from group → inner
    const externalIn = canvas.edges.filter(e => e.to.nodeId === nodeId);
    const externalOut = canvas.edges.filter(e => e.from.nodeId === nodeId);
    externalIn.forEach(e => {
      const inp = def.inputs.find(i => i.name === e.to.port);
      if (inp) addEdge(e.from.nodeId, e.from.port, idMap[inp.to.nodeId], inp.to.port, { skipRun: true });
    });
    externalOut.forEach(e => {
      const out = def.outputs.find(o => o.name === e.from.port);
      if (out) addEdge(idMap[out.from.nodeId], out.from.port, e.to.nodeId, e.to.port, { skipRun: true });
    });

    // Remove group node
    canvas.nodes = canvas.nodes.filter(n => n.id !== nodeId);
    canvas.edges = canvas.edges.filter(e => e.from.nodeId !== nodeId && e.to.nodeId !== nodeId);
    document.querySelector(`[data-node-id="${nodeId}"]`)?.remove();

    runGraph();
    return true;
  }

  function persistGroups() {
    try {
      localStorage.setItem(LS_GROUPS, JSON.stringify(Object.values(customGroups)));
    } catch (e) {}
  }
  function loadGroupsFromStorage() {
    try {
      const arr = JSON.parse(localStorage.getItem(LS_GROUPS) || "[]");
      arr.forEach(def => registerGroup(def));
    } catch (e) {}
  }
  function listGroups() {
    return Object.values(customGroups);
  }
  function deleteGroup(name) {
    unregisterGroup(name);
    persistGroups();
  }

  // Export
  window.VisionCanvas = {
    init,
    clear,
    loadDemo,
    loadGraph,
    runGraph,
    addNode,
    setApiKey,
    resetView,
    fitView,
    nodeTypes: NODE_TYPES,
    DEMOS,
    saveGraph,
    listSaved,
    loadSaved,
    deleteSaved,
    restoreAutosave,
    // Groupes
    createGroupFromSelection,
    ungroupNode,
    listGroups,
    deleteGroup,
    get selectedIds() { return [...canvas.selectedNodeIds]; },
    onSelectionChange: null,
  };
  // Permettre l'assignation directe à VisionCanvas.onSelectionChange
  Object.defineProperty(window.VisionCanvas, "onSelectionChange", {
    set(fn) { canvas.onSelectionChange = fn; },
    get() { return canvas.onSelectionChange; },
  });
})();
