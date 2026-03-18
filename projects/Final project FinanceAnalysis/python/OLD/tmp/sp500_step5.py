#!/usr/bin/env python3
"""
Title: Step 5 - Return-Based MLR with Clear Explanations
Description:
  This version of Step 5:
  - Uses daily returns from raw prices.
  - Lets you choose a target ticker, top correlated predictors, model type (Linear, Ridge, Lasso),
    and polynomial degree (1..3).
  - Splits data 80/20, fits the model, shows R^2, RMSE, and provides a correlation heatmap,
    distribution plots, line chart, and scatter plot with simplified, clear text.
"""

import numpy as np
import pandas as pd
import panel as pn
import holoviews as hv
import hvplot.pandas
from bokeh.models import HoverTool
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error, r2_score

import shared_data  # The global df_prices from previous steps

pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')

# Optional CSS
pn.config.raw_css.append("""
.pro-box {
    padding: 15px;
    margin-bottom: 15px;
    border: 1px solid #d8d8d8;
    border-radius: 5px;
    background-color: #f9f9f9;
}
""")

class Step5ClarityMLRApp(pn.viewable.Viewer):
    """
    Step 5: Return-Based MLR with Clear Explanations
    """

    def __init__(self, **params):
        super().__init__(**params)

        # Data
        self.df_prices = shared_data.df_prices
        self.df_returns = self._compute_returns()

        # Introduction
        self.intro_markdown = pn.pane.Markdown(
            """
## About Multiple Linear Regression (MLR)

MLR uses one target (Y) and multiple predictors (X). We convert prices to daily returns to reduce non-stationary issues.

## Model Types

Linear is ordinary least squares.  
Ridge adds an L2 penalty to reduce large coefficients.  
Lasso adds an L1 penalty to drive some coefficients to zero.

## Correlation Heatmap

Shows how returns move together. Red or blue cells indicate strong correlation (positive or negative). This helps find related tickers.

## Number of Predictors

We pick top correlated tickers by absolute correlation. More predictors can capture more signals but can also add noise.

## Polynomial Degree

Degree 1 means a simple linear model. Degree 2 or 3 adds non-linear terms (like squares or cubes of the predictors).

""",
            css_classes=["pro-box"]
        )

        # Data Coverage
        self.coverage_pane = pn.pane.Markdown("", css_classes=["pro-box"])
        self._update_coverage_info()

        # Correlation Heatmap
        self.corr_heatmap_pane = pn.pane.HoloViews(sizing_mode="stretch_width", css_classes=["pro-box"])
        self._build_corr_heatmap()

        # Controls
        self.target_select = pn.widgets.Select(
            name="Target Ticker (returns)",
            options=self._get_tickers()
        )
        self.top_n_slider = pn.widgets.IntSlider(
            name="Number of Top Predictors",
            start=1, end=10, step=1, value=5
        )
        self.model_type_select = pn.widgets.Select(
            name="Model Type",
            options=["Linear", "Ridge", "Lasso"],
            value="Linear"
        )
        self.poly_degree_slider = pn.widgets.IntSlider(
            name="Polynomial Degree",
            start=1, end=3, step=1, value=1
        )
        self.run_button = pn.widgets.Button(name="Run MLR", button_type="primary")
        self.run_button.on_click(self._on_run)

        self.controls_box = pn.Column(
            pn.pane.Markdown("### Model Configuration", css_classes=["pro-box"]),
            self.target_select,
            self.top_n_slider,
            self.model_type_select,
            self.poly_degree_slider,
            self.run_button,
            css_classes=["pro-box"]
        )

        # Outputs
        self.dist_plots = pn.Row()
        self.dist_info = pn.pane.Markdown("", css_classes=["pro-box"])
        self.model_summary = pn.pane.Markdown("", css_classes=["pro-box"])
        self.line_chart = pn.pane.HoloViews(sizing_mode="stretch_width", css_classes=["pro-box"])
        self.line_info = pn.pane.Markdown("", css_classes=["pro-box"])
        self.scatter_chart = pn.pane.HoloViews(sizing_mode="stretch_width", css_classes=["pro-box"])
        self.scatter_info = pn.pane.Markdown("", css_classes=["pro-box"])

        self.nav_links = pn.pane.Markdown("[Back to Step 4](../sp500_step4)", css_classes=["pro-box"])

        # Layout
        self.panel = pn.Column(
            self.intro_markdown,
            pn.Row(
                pn.Column(
                    pn.pane.Markdown("### Data Coverage", css_classes=["pro-box"]),
                    self.coverage_pane,
                    pn.pane.Markdown("### Correlation Heatmap", css_classes=["pro-box"]),
                    self.corr_heatmap_pane,
                ),
                self.controls_box
            ),
            pn.pane.Markdown("### Target Distribution & MLR Results", css_classes=["pro-box"]),
            self.dist_plots,
            self.dist_info,
            self.model_summary,
            pn.pane.Markdown("#### Actual vs. Predicted (Time Series)", css_classes=["pro-box"]),
            self.line_chart,
            self.line_info,
            pn.pane.Markdown("#### Predicted vs. Actual (Scatter Plot)", css_classes=["pro-box"]),
            self.scatter_chart,
            self.scatter_info,
            self.nav_links,
            sizing_mode="stretch_width"
        )

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
            self.coverage_pane.object = "No data available."
            return
        rows = len(self.df_returns)
        start_d = self.df_returns.index.min().strftime("%Y-%m-%d")
        end_d = self.df_returns.index.max().strftime("%Y-%m-%d")
        self.coverage_pane.object = f"Rows: {rows}\nDate Range: {start_d} to {end_d}"

    def _build_corr_heatmap(self):
        if self.df_returns.empty:
            self.corr_heatmap_pane.object = hv.Text(0.5, 0.5, "No data", halign="center")
            return
        corr = self.df_returns.corr()
        hm = corr.hvplot.heatmap(rot=45, width=400, height=400, title="Correlation Heatmap").opts(
            cmap="RdBu_r", colorbar=True, clim=(-1,1)
        )
        self.corr_heatmap_pane.object = hm

    def _on_run(self, event):
        if self.df_returns.empty:
            self._clear_outputs("No returns data.")
            return

        target = self.target_select.value
        if not target or target not in self.df_returns.columns:
            self._clear_outputs("Invalid target.")
            return

        top_n = self.top_n_slider.value
        model_type = self.model_type_select.value
        poly_deg = self.poly_degree_slider.value

        # Show distribution
        self._show_distribution(target)

        # Pick top correlated
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

        # 80/20 split
        split_i = int(len(data)*0.8)
        X_tr, X_te = X.iloc[:split_i], X.iloc[split_i:]
        y_tr, y_te = y.iloc[:split_i], y.iloc[split_i:]

        if len(X_te) < 1:
            self._clear_outputs("Test set is empty.")
            return

        # Polynomial
        poly = PolynomialFeatures(degree=poly_deg, include_bias=False)
        X_tr_poly = poly.fit_transform(X_tr)
        X_te_poly = poly.transform(X_te)
        feats = poly.get_feature_names_out(sel)

        # Model type
        if model_type == "Linear":
            model = LinearRegression()
        elif model_type == "Ridge":
            model = Ridge(alpha=1.0)
        else:
            model = Lasso(alpha=0.01)

        model.fit(X_tr_poly, y_tr)
        y_pred = model.predict(X_te_poly)

        r2 = r2_score(y_te, y_pred)
        mse = mean_squared_error(y_te, y_pred)
        rmse = np.sqrt(mse)

        # Summary
        coefs = pd.DataFrame({
            "Feature": feats,
            "Coefficient": model.coef_
        }).round(4)
        summary_txt = f"""
Model: {model_type} with degree={poly_deg}
Target: {target}
Intercept: {model.intercept_:.4f}

Coefficients:
{coefs.to_markdown(index=False)}

R^2: {r2:.4f}
RMSE: {rmse:.4f}
Train Rows: {len(X_tr)}, Test Rows: {len(X_te)}
"""
        self.model_summary.object = summary_txt

        # Actual vs. Predicted line
        res_df = pd.DataFrame({"Actual": y_te, "Predicted": y_pred}, index=y_te.index)
        line_plt = res_df[["Actual","Predicted"]].hvplot.line(
            title=f"Actual vs. Predicted: {target}",
            width=600, height=300
        ).opts(legend_position="top_left")
        self.line_chart.object = line_plt

        if r2 < 0:
            line_txt = f"Negative R^2 = {r2:.3f}. Model is worse than naive average."
        elif r2 < 0.5:
            line_txt = f"Weak fit (R^2={r2:.3f}), RMSE={rmse:.3f}."
        elif r2 < 0.8:
            line_txt = f"Moderate fit (R^2={r2:.3f}), RMSE={rmse:.3f}."
        else:
            line_txt = f"Strong fit (R^2={r2:.3f}), RMSE={rmse:.3f}."
        self.line_info.object = f"Time-series view of Actual vs. Predicted. {line_txt}"

        # Scatter
        scatter = hv.Scatter(
            (res_df["Actual"], res_df["Predicted"]),
            kdims=["Actual"], vdims=["Predicted"]
        ).opts(
            width=400, height=300, title="Scatter: Predicted vs. Actual",
            xlabel="Actual", ylabel="Predicted", tools=["hover"], size=5, color="blue"
        )
        self.scatter_chart.object = scatter

        if r2 < 0:
            sc_txt = "Points scattered randomly, no diagonal alignment."
        elif r2 < 0.5:
            sc_txt = "Points are somewhat off diagonal, indicating errors."
        elif r2 < 0.8:
            sc_txt = "Points partially follow a diagonal, but with some spread."
        else:
            sc_txt = "Points mostly on a diagonal, indicating strong alignment."
        self.scatter_info.object = f"The scatter plot shows how close predictions are to actual values. {sc_txt}"

    def _clear_outputs(self, msg):
        self.dist_plots.objects = []
        self.dist_info.object = msg
        self.model_summary.object = ""
        self.line_chart.object = hv.Text(0.5, 0.5, "", halign="center")
        self.line_info.object = ""
        self.scatter_chart.object = hv.Text(0.5, 0.5, "", halign="center")
        self.scatter_info.object = ""

    def _show_distribution(self, target):
        s = self.df_returns[target].dropna()
        if s.empty:
            self.dist_plots.objects = []
            self.dist_info.object = "No data for distribution."
            return
        # Custom tooltip to avoid "???"
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

    def panel_view(self):
        return self.panel


# -----------------------------------------------------------------------------
# Create & Serve
# -----------------------------------------------------------------------------
app5 = Step5ClarityMLRApp()

template5 = pn.template.FastListTemplate(
    title="Step 5: Return-Based MLR with Clear Explanations",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app5.panel_view()],
    sidebar=[],
)
template5.servable()