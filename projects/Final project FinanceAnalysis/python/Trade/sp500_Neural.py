#!/usr/bin/env python3
"""
AI Forecasting Tool with Data Cleaning
- Reindexes to daily frequency, performs basic cleaning, then trains NeuralProphet.
- Appends future rows for predictions.
- Displays:
  1) Actual vs Forecast (full timeline)
  2) Residuals
  3) Future-Only Forecast
  4) Accuracy (Percentage Error) on historical portion
"""

import math
import numpy as np
import pandas as pd
import panel as pn
import holoviews as hv
import hvplot.pandas
from neuralprophet import NeuralProphet
import shared_data

pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')

class AIForecastingTool(pn.viewable.Viewer):
    """
    AI Forecasting Tool that uses NeuralProphet.
    Incorporates basic data cleaning to remove invalid or negative data
    before training.
    """
    def __init__(self, **params):
        super().__init__(**params)

        # Widgets
        self.target_select = pn.widgets.Select(name="Target Ticker", options=self._get_tickers())
        self.exo_multiselect = pn.widgets.MultiSelect(name="Exogenous Tickers", options=self._get_tickers(), size=6)
        self.horizon_slider = pn.widgets.IntSlider(name="Forecast Horizon (Days)", start=5, end=60, step=5, value=15)
        self.n_lags_slider = pn.widgets.IntSlider(name="Number of Lags (Days)", start=1, end=14, step=1, value=5)
        self.run_button = pn.widgets.Button(name="Train & Forecast", button_type="primary")
        self.run_button.on_click(self._run_forecast)

        # Explanation
        self.ai_explanation = pn.pane.Markdown("""
**NeuralProphet**  
Single-step model, repeated for multi-day horizons.  

**Exogenous Tickers**  
Extra variables (e.g., other stock tickers) that might help predict the target.  

**Forecast Horizon & Lags**  
- `Forecast Horizon (Days)`: how many days ahead we want.  
- `Number of Lags (Days)`: how many past days are used to predict the next day.

**Data Cleaning**  
- Removes rows where the target is <= 0 (if applicable).
- Drops rows with missing values in the target.
- Reindexes to daily frequency and fills small gaps.
""", css_classes=["light-box"])

        # Output Panes
        self.data_preview = pn.pane.Markdown("")
        self.model_summary = pn.pane.Markdown("")
        self.forecast_plot = pn.pane.HoloViews(hv.Curve([]))
        self.residual_plot = pn.pane.HoloViews(hv.Curve([]))
        self.future_forecast_plot = pn.pane.HoloViews(hv.Curve([]))
        self.accuracy_plot = pn.pane.HoloViews(hv.Curve([]))
        self.conclusion_pane = pn.pane.Markdown("")
        self.explanation_pane = pn.pane.Markdown("")

        # Layout
        controls = pn.Column(
            pn.pane.Markdown("# AI Forecasting Tool (NeuralProphet)", css_classes=["light-box"]),
            self.target_select,
            self.exo_multiselect,
            self.horizon_slider,
            self.n_lags_slider,
            self.run_button,
            self.ai_explanation
        )
        results = pn.Column(
            pn.pane.Markdown("## Results", css_classes=["light-box"]),
            self.data_preview,
            self.model_summary,
            self.forecast_plot,
            self.residual_plot,
            self.future_forecast_plot,
            self.accuracy_plot,
            self.conclusion_pane,
            self.explanation_pane
        )
        self.panel = pn.Row(controls, results, sizing_mode="stretch_width")

    def _get_tickers(self):
        df = getattr(shared_data, "df_prices", pd.DataFrame())
        if df.empty:
            return []
        return df.columns.tolist()

    def _run_forecast(self, event):
        df = getattr(shared_data, "df_prices", pd.DataFrame())
        if df.empty:
            self.data_preview.object = "No data loaded in shared_data.df_prices."
            return

        target = self.target_select.value
        if not target:
            self.data_preview.object = "No target ticker selected."
            return

        exo_list = [x for x in self.exo_multiselect.value if x != target and x in df.columns]
        if target not in df.columns:
            self.data_preview.object = f"Target '{target}' not in df."
            return

        # Subset data
        needed_cols = [target] + exo_list
        df_sub = df[needed_cols].copy()
        if df_sub.empty:
            self.data_preview.object = "No valid data after subsetting columns."
            return

        # Basic data cleaning
        # 1) Keep only rows where target > 0 (if your data must be strictly positive)
        df_sub = df_sub[df_sub[target] > 0]
        # 2) Drop any rows with missing values in needed columns
        df_sub = df_sub.dropna(subset=needed_cols)
        if df_sub.empty:
            self.data_preview.object = "All rows removed by cleaning. Check your data or cleaning rules."
            return

        # Check for datetime index
        if not isinstance(df_sub.index, pd.DatetimeIndex):
            self.data_preview.object = "df_prices index is not a DatetimeIndex. Cannot reindex daily."
            return

        # Sort and reindex daily
        df_sub = df_sub.sort_index()
        all_days = pd.date_range(start=df_sub.index.min(), end=df_sub.index.max(), freq="D")
        df_sub = df_sub.reindex(all_days).ffill().bfill()

        # Final cleaning step: drop any leftover NA
        df_sub = df_sub.dropna()
        if df_sub.empty:
            self.data_preview.object = "No data left after reindexing daily and filling. Check cleaning steps."
            return

        # Convert index -> ds, rename target->y, exogenous->ar_1, ar_2, ...
        df_sub = df_sub.reset_index().rename(columns={"index": "ds", target: "y"})
        exo_map = {}
        for i, col in enumerate(exo_list):
            exo_map[col] = f"ar_{i+1}"
        df_sub = df_sub.rename(columns=exo_map)
        final_cols = ["ds", "y"] + list(exo_map.values())
        df_sub = df_sub[final_cols]

        # Data preview
        self.data_preview.object = (
            "### Data Preview (After Cleaning)\n\n" + df_sub.head(5).to_markdown(index=False)
        )

        # Train NeuralProphet
        horizon = self.horizon_slider.value
        n_lags = self.n_lags_slider.value
        m = NeuralProphet(
            n_forecasts=1,
            n_lags=n_lags,
            yearly_seasonality=False,
            weekly_seasonality=True,
            daily_seasonality=False,
            epochs=50,
            batch_size=32,
        )
        for reg_col in exo_map.values():
            m.add_future_regressor(name=reg_col)

        metrics_df = m.fit(df_sub, freq="D")
        self.model_summary.object = (
            "### Model Training Metrics (last 5 rows):\n\n"
            + metrics_df.tail().to_markdown(index=False)
            + f"\n\n**n_lags={n_lags}, horizon={horizon}**"
        )

        # Build future dataframe
        last_ds = df_sub["ds"].max()
        last_date = pd.to_datetime(last_ds)
        future_days = pd.date_range(last_date + pd.Timedelta(days=1), periods=horizon, freq="D")
        df_future = pd.DataFrame({"ds": future_days})
        for reg_col in exo_map.values():
            df_future[reg_col] = df_sub[reg_col].iloc[-1]
        # Put y=0 for future since we don't have actuals
        df_future["y"] = 0
        df_pred_input = pd.concat([df_sub, df_future], ignore_index=True).ffill().bfill()

        # Predict
        forecast_df = m.predict(df_pred_input)
        merged = forecast_df[["ds", "yhat1"]].copy()
        merged = pd.merge(merged, df_sub[["ds", "y"]], on="ds", how="left")
        merged = merged.set_index("ds").rename(columns={"yhat1": "Forecast", "y": "Actual"})

        # (1) Actual vs Forecast
        actual_curve = merged["Actual"].hvplot.line(label="Actual", color="blue", width=700, height=400)
        forecast_curve = merged["Forecast"].hvplot.line(label="Forecast", color="orange", width=700, height=400)
        line_plot = (actual_curve * forecast_curve).opts(
            title=f"{target} Forecast vs. Actual (Horiz={horizon}, lags={n_lags})",
            legend_position="top_left"
        )
        self.forecast_plot.object = line_plot

        # (2) Residuals
        merged["Residual"] = merged["Actual"] - merged["Forecast"]
        residual_data = merged.loc[merged["Actual"].notnull(), "Residual"]
        if not residual_data.empty:
            y_min, y_max = residual_data.min(), residual_data.max()
            buffer = 0.1 * (y_max - y_min) if y_max != y_min else 1.0
            res_plot = residual_data.hvplot.line(
                label="Residual",
                color="green",
                width=700,
                height=300,
                title=f"Residuals (Actual - Forecast) for {target}",
            ).opts(ylim=(y_min - buffer, y_max + buffer), legend_position="top_left")
            self.residual_plot.object = res_plot
        else:
            self.residual_plot.object = hv.Curve([])

        # (3) Future-Only Forecast
        future_only = merged[merged["Actual"].isna() & merged["Forecast"].notna()]
        if not future_only.empty:
            if len(future_only) > 1:
                future_curve = future_only["Forecast"].hvplot.line(
                    label="Future Forecast",
                    color="red",
                    width=700,
                    height=300,
                    title=f"Future-Only Forecast for {target}",
                )
            else:
                future_curve = future_only["Forecast"].hvplot.scatter(
                    label="Future Forecast (1 point)",
                    color="red",
                    width=700,
                    height=300,
                    title=f"Future-Only Forecast for {target}",
                )
            x_min, x_max = future_only.index.min(), future_only.index.max()
            future_curve = future_curve.opts(xlim=(x_min, x_max), legend_position="top_left")
            self.future_forecast_plot.object = future_curve
        else:
            self.future_forecast_plot.object = hv.Curve([])

        # (4) Accuracy Over Historical Period
        hist_only = merged.dropna(subset=["Actual"])
        if not hist_only.empty:
            hist_only["PctError"] = 100 * (hist_only["Forecast"] - hist_only["Actual"]) / hist_only["Actual"]
            if len(hist_only) > 1:
                acc_plot = hist_only["PctError"].hvplot.line(
                    label="Percentage Error",
                    color="purple",
                    width=700,
                    height=300,
                    title=f"Accuracy Over Historical Period for {target}",
                )
            else:
                acc_plot = hist_only["PctError"].hvplot.scatter(
                    label="Percentage Error (1 point)",
                    color="purple",
                    width=700,
                    height=300,
                    title=f"Accuracy Over Historical Period for {target}",
                )
            x_min, x_max = hist_only.index.min(), hist_only.index.max()
            acc_plot = acc_plot.opts(xlim=(x_min, x_max), legend_position="top_left")
            self.accuracy_plot.object = acc_plot
        else:
            self.accuracy_plot.object = hv.Curve([])

        # Automatic Conclusions
        if hist_only.empty:
            self.conclusion_pane.object = "No historical data to draw conclusions from."
            return

        last_val = hist_only["Actual"].iloc[-1]
        last_actual_date = hist_only.index[-1]
        if not future_only.empty:
            final_fcast_val = future_only["Forecast"].iloc[-1]
            final_fcast_date = future_only.index[-1]
        else:
            final_fcast_val = hist_only["Forecast"].dropna().iloc[-1]
            final_fcast_date = hist_only.dropna(subset=["Forecast"]).index[-1]

        if final_fcast_val > last_val * 1.01:
            trend = "an upward"
        elif final_fcast_val < last_val * 0.99:
            trend = "a downward"
        else:
            trend = "a neutral"

        mean_res = residual_data.mean()
        if mean_res > 0:
            res_conclusion = "On average, the model is under-predicting (residual > 0)."
        elif mean_res < 0:
            res_conclusion = "On average, the model is over-predicting (residual < 0)."
        else:
            res_conclusion = "On average, predictions match closely."

        self.conclusion_pane.object = f"""
### Automatic Conclusions
- Forecast suggests **{trend}** trend for **{target}**.
- Latest actual date: **{last_actual_date.strftime('%Y-%m-%d')}** at **{last_val:.2f}**.
- Final forecast date: **{final_fcast_date.strftime('%Y-%m-%d')}** at **{final_fcast_val:.2f}**.
- {res_conclusion}
"""

        self.explanation_pane.object = f"""
**Plot Explanations**  
1. **Forecast vs. Actual**: Full timeline comparison.  
2. **Residuals**: (Actual - Forecast). Helps see over/under-prediction.  
3. **Future-Only Forecast**: Predicted values beyond the historical range.  
4. **Accuracy**: Percentage error in historical portion.  
"""

    def panel_view(self):
        return self.panel

app_ai = AIForecastingTool()

template_ai = pn.template.FastListTemplate(
    title="AI Forecasting & Visualization (with Cleaning)",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app_ai.panel_view()],
    sidebar=[],
)
template_ai.servable()