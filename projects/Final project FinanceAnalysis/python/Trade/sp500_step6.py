#!/usr/bin/env python3
"""
MLR, Stepwise, Best Subsets, Classification with p-values
Focuses on:
  - Multiple Linear Regression, Stepwise, Best Subsets, Classification (Logistic)
  - p-values, R², RMSE, Accuracy
  - Automatic conclusions for model performance
  - Navigation to sp500_Neural.py
"""

import numpy as np
import pandas as pd
import panel as pn
import holoviews as hv
import hvplot.pandas
from bokeh.models import HoverTool
from sklearn.metrics import (
    mean_squared_error, r2_score,
    accuracy_score, confusion_matrix, classification_report
)
import statsmodels.api as sm
from mlxtend.feature_selection import ExhaustiveFeatureSelector
from sklearn.linear_model import LinearRegression, LogisticRegression
import shared_data

pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')

pn.config.raw_css.append("""
.pro-box {
    padding: 15px;
    margin-bottom: 15px;
    border: 1px solid #d8d8d8;
    border-radius: 5px;
    background-color: #f9f9f9;
}
""")

MODEL_DESCRIPTIONS = {
    "MLR": """
### Multiple Linear Regression (MLR)
- Fits all chosen predictors (no elimination).
- Uses statsmodels OLS for coefficients & p-values.
- p-value < 0.05 => significant predictor.
- R² = proportion of variance explained.
- RMSE = average magnitude of errors.
""",
    "Stepwise": """
### Stepwise Regression
- Iteratively adds/removes predictors based on p-values.
- Helps avoid useless predictors.
- R² = proportion of variance explained.
- RMSE = root mean squared error.
""",
    "Best Subsets": """
### Best Subsets
- Tries all combos of top features up to a limit.
- Systematically finds best subset by R² or MSE.
- R² = fraction of variance explained.
- RMSE = average error in target’s units.
""",
    "Classification (Logistic)": """
### Classification (Logistic Regression)
- Binary (0/1) target for logistic model.
- Accuracy = fraction of correct predictions.
"""
}

class Step6CorrelogramApp(pn.viewable.Viewer):
    """
    MLR, Stepwise, Best Subsets, & Classification with p-value emphasis.
    """

    def __init__(self, **params):
        super().__init__(**params)
        self.df_prices = shared_data.df_prices
        self.df_returns = self._compute_returns()

        self.intro = pn.pane.Markdown("""
# MLR, Stepwise, Best Subsets, & Classification

**Business Problem**: Predict or classify daily returns for better investment decisions.  
**Models**: 
- **MLR**: Fit all chosen predictors. 
- **Stepwise**: Add/remove based on p-values. 
- **Best Subsets**: Systematically find best subset. 
- **Classification**: Logistic for 0/1 target.  

Displays R², RMSE, p-values (statsmodels), or accuracy for classification.
""", css_classes=["pro-box"])

        self.coverage = pn.pane.Markdown("", css_classes=["pro-box"])
        self._update_coverage_info()

        self.corr_heatmap = pn.pane.HoloViews(sizing_mode="stretch_width", css_classes=["pro-box"])
        self._build_corr_heatmap()

        self.target_select = pn.widgets.Select(
            name="Target Ticker (returns)",
            options=self._get_tickers()
        )
        self.top_n_slider = pn.widgets.IntSlider(
            name="Number of Top Predictors",
            start=1, end=10, step=1, value=5
        )
        self.model_approach_select = pn.widgets.Select(
            name="Model Approach",
            options=["MLR", "Stepwise", "Best Subsets", "Classification (Logistic)"],
            value="MLR"
        )
        self.model_explanation = pn.pane.Markdown("", css_classes=["pro-box"])
        self.model_approach_select.param.watch(self._update_model_description, 'value')

        self.run_button = pn.widgets.Button(name="Train & Evaluate", button_type="primary")
        self.run_button.on_click(self._on_run)

        self.controls = pn.Column(
            pn.pane.Markdown("## Model Configuration", css_classes=["pro-box"]),
            self.target_select,
            self.top_n_slider,
            self.model_approach_select,
            self.model_explanation,
            self.run_button,
            css_classes=["pro-box"]
        )

        self.dist_plots = pn.Row()
        self.dist_info = pn.pane.Markdown("", css_classes=["pro-box"])
        self.model_summary = pn.pane.Markdown("", css_classes=["pro-box"])
        self.line_chart = pn.pane.HoloViews(hv.Curve([]), css_classes=["pro-box"])
        self.line_info = pn.pane.Markdown("", css_classes=["pro-box"])

        # Removed classification/confusion chart & Correlogram from the layout
        self.nav_links = pn.pane.Markdown(
            "[Back to Step 5](../sp500_step5) | [Proceed to Neural Step](../sp500_Neural)",
            css_classes=["pro-box"]
        )

        self.panel = pn.Column(
            self.intro,
            pn.Row(
                pn.Column(
                    pn.pane.Markdown("### Data Coverage", css_classes=["pro-box"]),
                    self.coverage,
                    pn.pane.Markdown("### Correlation Heatmap", css_classes=["pro-box"]),
                    self.corr_heatmap
                ),
                self.controls
            ),
            pn.pane.Markdown("### Target Distribution & Model Results", css_classes=["pro-box"]),
            self.dist_plots,
            self.dist_info,
            self.model_summary,
            pn.pane.Markdown("#### Regression Plots (if applicable)", css_classes=["pro-box"]),
            self.line_chart,
            self.line_info,
            self.nav_links,
            sizing_mode="stretch_width"
        )

        self._update_model_description(None)

    def _compute_returns(self):
        if self.df_prices.empty:
            return pd.DataFrame()
        df_ret = self.df_prices.pct_change().dropna(how='all')
        return df_ret

    def _get_tickers(self):
        if self.df_returns.empty:
            return []
        return self.df_returns.columns.tolist()

    def _update_coverage_info(self):
        if self.df_returns.empty:
            self.coverage.object = "No data available."
            return
        rows = len(self.df_returns)
        start_d = self.df_returns.index.min().strftime("%Y-%m-%d")
        end_d = self.df_returns.index.max().strftime("%Y-%m-%d")
        self.coverage.object = f"Rows: {rows}\nDate Range: {start_d} to {end_d}"

    def _build_corr_heatmap(self):
        if self.df_returns.empty:
            self.corr_heatmap.object = hv.Text(0.5, 0.5, "No data", halign="center")
            return
        corr = self.df_returns.corr()
        hm = corr.hvplot.heatmap(rot=45, width=400, height=400, title="Correlation Heatmap").opts(
            cmap="RdBu_r", colorbar=True, clim=(-1,1)
        )
        self.corr_heatmap.object = hm

    def _update_model_description(self, event):
        approach = self.model_approach_select.value
        desc = MODEL_DESCRIPTIONS.get(approach, "")
        self.model_explanation.object = desc

    def _on_run(self, event):
        if self.df_returns.empty:
            self._clear_outputs("No returns data loaded.")
            return

        target = self.target_select.value
        if not target or target not in self.df_returns.columns:
            self._clear_outputs("Invalid target ticker.")
            return

        top_n = self.top_n_slider.value
        approach = self.model_approach_select.value
        self._show_distribution(target)

        sel, corr_s = self._pick_top_correlated(target, top_n)
        if not sel:
            self._clear_outputs("No correlated columns found.")
            return

        data = self.df_returns[[target] + sel].dropna().sort_index()
        if data.empty:
            self._clear_outputs("No valid data after dropping NA.")
            return

        X = data[sel]
        y = data[target]

        split_i = int(len(data)*0.8)
        X_tr, X_te = X.iloc[:split_i], X.iloc[split_i:]
        y_tr, y_te = y.iloc[:split_i], y.iloc[split_i:]

        if len(X_te) < 1:
            self._clear_outputs("Test set is empty. Not enough data.")
            return

        if approach == "MLR":
            self._run_mlr(X_tr, y_tr, X_te, y_te, target)
        elif approach == "Stepwise":
            self._run_stepwise(X_tr, y_tr, X_te, y_te, target)
        elif approach == "Best Subsets":
            self._run_best_subsets(X_tr, y_tr, X_te, y_te, target)
        else:
            # Classification is still possible, but no confusion matrix plot is displayed
            self._run_classification(X_tr, y_tr, X_te, y_te, target)

    def _run_mlr(self, X_tr, y_tr, X_te, y_te, target):
        model = sm.OLS(y_tr, sm.add_constant(X_tr)).fit()
        y_pred = model.predict(sm.add_constant(X_te))
        r2 = r2_score(y_te, y_pred)
        rmse = np.sqrt(mean_squared_error(y_te, y_pred))

        coefs = pd.DataFrame({
            "Feature": ["const"] + list(X_tr.columns),
            "Coef": [model.params["const"]] + [model.params[f] for f in X_tr.columns],
            "p-value": [model.pvalues["const"]] + [model.pvalues[f] for f in X_tr.columns]
        }).round(4)

        if r2 < 0:
            conclusion = "Worse than naive guess (negative R^2)."
        elif r2 < 0.5:
            conclusion = "Weak predictive power."
        elif r2 < 0.8:
            conclusion = "Moderate predictive power."
        else:
            conclusion = "Strong predictive power."

        summary_txt = f"""
### MLR (Multiple Linear Regression)
**Target**: {target}  
**All Features**: {list(X_tr.columns)}

{coefs.to_markdown(index=False)}

**R^2**: {r2:.4f}  
**RMSE**: {rmse:.4f}  
Train Rows: {len(X_tr)}, Test Rows: {len(X_te)}

**Conclusion**: {conclusion}
"""
        self.model_summary.object = summary_txt
        self._plot_regression_results(y_te, y_pred, target, r2, rmse)

    def _run_stepwise(self, X_tr, y_tr, X_te, y_te, target):
        def stepwise_selection(X, y, threshold_in=0.05, threshold_out=0.10):
            included = []
            changed = True
            while changed:
                changed = False
                excluded = list(set(X.columns) - set(included))
                new_pval = pd.Series(index=excluded, dtype=float)
                for col in excluded:
                    mdl = sm.OLS(y, sm.add_constant(X[included+[col]])).fit()
                    new_pval[col] = mdl.pvalues[col]
                best_pval = new_pval.min()
                if best_pval < threshold_in:
                    best_feat = new_pval.idxmin()
                    included.append(best_feat)
                    changed = True
                mdl = sm.OLS(y, sm.add_constant(X[included])).fit()
                pvals = mdl.pvalues.drop("const")
                worst_pval = pvals.max()
                if worst_pval > threshold_out:
                    worst_feat = pvals.idxmax()
                    included.remove(worst_feat)
                    changed = True
            return included

        feats = stepwise_selection(X_tr, y_tr)
        if not feats:
            self._clear_outputs("Stepwise found no significant features. Possibly data too random.")
            return

        final_model = sm.OLS(y_tr, sm.add_constant(X_tr[feats])).fit()
        y_pred = final_model.predict(sm.add_constant(X_te[feats]))
        r2 = r2_score(y_te, y_pred)
        rmse = np.sqrt(mean_squared_error(y_te, y_pred))

        coefs = pd.DataFrame({
            "Feature": ["const"]+feats,
            "Coef": [final_model.params["const"]]+[final_model.params[f] for f in feats],
            "p-value": [final_model.pvalues["const"]]+[final_model.pvalues[f] for f in feats]
        }).round(4)

        if r2 < 0:
            conclusion = "Worse than naive guess (negative R^2)."
        elif r2 < 0.5:
            conclusion = "Weak predictive power."
        elif r2 < 0.8:
            conclusion = "Moderate predictive power."
        else:
            conclusion = "Strong predictive power."

        txt = f"""
### Stepwise Regression
**Target**: {target}  
**Selected Features**: {feats}

{coefs.to_markdown(index=False)}

**R^2**: {r2:.4f}  
**RMSE**: {rmse:.4f}  
Train Rows: {len(X_tr)}, Test Rows: {len(X_te)}

**Conclusion**: {conclusion}
"""
        self.model_summary.object = txt
        self._plot_regression_results(y_te, y_pred, target, r2, rmse)

    def _run_best_subsets(self, X_tr, y_tr, X_te, y_te, target):
        max_feats = min(5, X_tr.shape[1])
        efs = ExhaustiveFeatureSelector(
            LinearRegression(),
            min_features=1,
            max_features=max_feats,
            scoring='r2',
            cv=3
        )
        efs.fit(X_tr, y_tr)
        best_feats = list(efs.best_feature_names_)
        final_lr = LinearRegression().fit(X_tr[best_feats], y_tr)
        y_pred = final_lr.predict(X_te[best_feats])
        r2 = r2_score(y_te, y_pred)
        rmse = np.sqrt(mean_squared_error(y_te, y_pred))

        coefs = pd.DataFrame({
            "Feature": ["Intercept"] + best_feats,
            "Coef": [final_lr.intercept_] + list(final_lr.coef_)
        }).round(4)

        if r2 < 0:
            conclusion = "Worse than naive guess (negative R^2)."
        elif r2 < 0.5:
            conclusion = "Weak predictive power."
        elif r2 < 0.8:
            conclusion = "Moderate predictive power."
        else:
            conclusion = "Strong predictive power."

        txt = f"""
### Best Subsets
**Target**: {target}  
Tested up to {max_feats} features.  
**Chosen**: {best_feats}

{coefs.to_markdown(index=False)}

**R^2**: {r2:.4f}  
**RMSE**: {rmse:.4f}  
Train Rows: {len(X_tr)}, Test Rows: {len(X_te)}

**Conclusion**: {conclusion}
"""
        self.model_summary.object = txt
        self._plot_regression_results(y_te, y_pred, target, r2, rmse)

    def _run_classification(self, X_tr, y_tr, X_te, y_te, target):
        # Classification logic remains but no confusion matrix is shown in final layout
        unique_train = y_tr.unique()
        unique_test = y_te.unique()
        if len(unique_train) < 2 or len(unique_test) < 2:
            msg = f"Single-class scenario (Train classes: {unique_train}, Test classes: {unique_test})."
            self._clear_outputs(msg + " Classification needs 2 classes.")
            return

        clf = LogisticRegression()
        clf.fit(X_tr, y_tr)
        y_pred = clf.predict(X_te)

        acc = accuracy_score(y_te, y_pred)
        rep = classification_report(y_te, y_pred, digits=3)
        if acc < 0.5:
            conclusion = "Worse or same as random guess."
        elif acc < 0.7:
            conclusion = "Low to moderate accuracy."
        elif acc < 0.9:
            conclusion = "Moderate to good accuracy."
        else:
            conclusion = "High accuracy."

        txt = f"""
### Logistic Classification
**Target**: {target}  
**Accuracy**: {acc:.3f}

**Classification Report**:
{rep}

**Conclusion**: {conclusion}
"""
        self.model_summary.object = txt
        # No additional chart is displayed for classification results

    def _plot_regression_results(self, y_te, y_pred, target, r2, rmse):
        df_plot = pd.DataFrame({"Actual": y_te, "Predicted": y_pred}).dropna()
        if df_plot.empty:
            self.line_chart.object = hv.Text(0.5, 0.5, "No test data to plot", halign="center")
            self.line_info.object = ""
            return

        line_plt = df_plot[["Actual","Predicted"]].hvplot.line(
            title=f"Actual vs. Predicted: {target}",
            width=600, height=300
        ).opts(legend_position="top_left")
        self.line_chart.object = line_plt

        if r2 < 0:
            line_txt = f"Negative R^2={r2:.3f} (worse than naive)."
        elif r2 < 0.5:
            line_txt = f"Weak fit (R^2={r2:.3f}, RMSE={rmse:.3f})."
        elif r2 < 0.8:
            line_txt = f"Moderate predictive power."
        else:
            line_txt = f"Strong predictive power; R^2={r2:.3f}, RMSE={rmse:.3f}."
        self.line_info.object = line_txt

    def _show_distribution(self, target):
        s = self.df_returns[target].dropna()
        if s.empty:
            self.dist_plots.objects = []
            self.dist_info.object = "No data for distribution."
            return
        tooltips = [("Return", "@x"), ("Density", "@y")]
        hist = s.hvplot.hist(bins=30, alpha=0.5, width=300, height=250, title=f"Histogram: {target}")
        kde = s.hvplot.kde(width=300, height=250, title=f"Density: {target}").opts(
            tools=[HoverTool(tooltips=tooltips)]
        )
        self.dist_plots.objects = [
            pn.pane.HoloViews(hist, sizing_mode="stretch_width"),
            pn.pane.HoloViews(kde, sizing_mode="stretch_width")
        ]
        self.dist_info.object = f"Distribution of daily returns for {target}."

    def _pick_top_correlated(self, target, n):
        c = self.df_returns.corr()[target].dropna()
        c = c.drop(target, errors='ignore')
        c_sorted = c.reindex(c.abs().sort_values(ascending=False).index)
        selected = c_sorted.index[:n].tolist()
        return selected, c_sorted

    def _clear_outputs(self, msg):
        self.dist_plots.objects = []
        self.dist_info.object = msg
        self.model_summary.object = ""
        self.line_chart.object = hv.Curve([])
        self.line_info.object = ""

    def panel_view(self):
        return self.panel


app6 = Step6CorrelogramApp()

template6 = pn.template.FastListTemplate(
    title="MLR, Stepwise, Best Subsets, & Classification",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app6.panel_view()],
    sidebar=[],
)
template6.servable()