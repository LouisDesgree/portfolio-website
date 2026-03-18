#!/usr/bin/env python3
"""
Title: Step 6 - Extended Cycle & Seasonality Analysis (Multiple Tickers)
Description:
  Builds on Step 5 by offering more grouping intervals (weekly, monthly, quarterly)
  and rolling-window charts to spot cyclical/trend behaviors for multiple tickers.
"""

import math
import numpy as np
import pandas as pd
import panel as pn
import holoviews as hv
import hvplot.pandas

import shared_data  # Contains df_prices

pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')

pn.config.raw_css.append("""
.light-box {
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
""")

class Step6ExtendedCyclesApp(pn.viewable.Viewer):
    """
    Step 6: Extended Cycle & Seasonality Analysis (Multiple Tickers)

    Features:
      - MultiSelect for choosing multiple tickers
      - Grouping by Weekly, Monthly, or Quarterly intervals
      - Rolling-window chart for subtle cyclical/trend insights
      - Overlays each selected ticker on the same chart
    """
    def __init__(self, **params):
        super().__init__(**params)

        # MultiSelect for multiple tickers
        self.ticker_select = pn.widgets.MultiSelect(
            name="Select Ticker(s)",
            options=self._get_ticker_options(),
            size=6,
            value=[]  # start empty or pick a default
        )
        self.ticker_select.param.watch(self._update_analysis, 'value')

        # Interval selection (weekly, monthly, quarterly)
        self.interval_select = pn.widgets.RadioButtonGroup(
            name="Grouping Interval",
            options=["Weekly", "Monthly", "Quarterly"],
            value="Monthly"
        )
        self.interval_select.param.watch(self._update_analysis, 'value')

        # Rolling window size slider
        self.rolling_slider = pn.widgets.IntSlider(
            name="Rolling Window (days)",
            start=5, end=120, step=5, value=30
        )
        self.rolling_slider.param.watch(self._update_analysis, 'value')

        # Intro and explanation
        self.section_intro = self._create_intro_section()

        # Grouped chart area
        self.section_grouped_chart = self._create_grouped_chart_section()

        # Rolling window chart area
        self.section_rolling_chart = self._create_rolling_chart_section()

        # Navigation link
        self.nav_links = pn.pane.Markdown(
            "[Back to Step 5](../sp500_step5) | [End or Next Step](#)",
            css_classes=["light-box"]
        )

        # Assemble final layout
        self.panel = pn.Column(
            self.section_intro,
            pn.Row(self.ticker_select, self.interval_select, self.rolling_slider),
            self.section_grouped_chart,
            self.section_rolling_chart,
            self.nav_links,
            sizing_mode="stretch_width"
        )

        # Initial update
        self._update_analysis()

    def _get_ticker_options(self):
        df = shared_data.df_prices
        if df.empty:
            return []
        return df.select_dtypes(include=[np.number]).columns.tolist()

    def _create_intro_section(self):
        return pn.pane.Markdown(
            """
# Step 6: Extended Cycle & Seasonality Analysis (Multiple Tickers)

In this step, we can:
1. **Select multiple tickers** at once.
2. **Group** data by weekly, monthly, or quarterly intervals to see if patterns emerge.
3. **Apply a rolling-window** average to smooth out daily fluctuations and reveal cycles or trends.

Use the MultiSelect (top-left) to pick one or more tickers, then choose a grouping interval and a rolling window size.
All selected tickers will appear on the same chart in different colors.
""",
            css_classes=["light-box"]
        )

    def _create_grouped_chart_section(self):
        header = pn.pane.Markdown("## Grouped Chart (Weekly / Monthly / Quarterly)", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
Select an interval to see how the average closing price changes by **week**, **month**, or **quarter**.
All selected tickers are overlaid on the same chart, each with a different color.
""",
            css_classes=["light-box"]
        )
        self.grouped_chart_pane = pn.pane.HoloViews()
        return pn.Column(header, explanation, self.grouped_chart_pane)

    def _create_rolling_chart_section(self):
        header = pn.pane.Markdown("## Rolling-Window Chart", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
A **rolling average** (or rolling sum/median/etc.) can smooth out day-to-day noise
and highlight longer-term cycles or trends. Adjust the **Rolling Window (days)** slider above
to see how the chart changes. Each selected ticker appears as a separate line.
""",
            css_classes=["light-box"]
        )
        self.rolling_chart_pane = pn.pane.HoloViews()
        return pn.Column(header, explanation, self.rolling_chart_pane)

    def _update_analysis(self, *events):
        df = shared_data.df_prices
        tickers = self.ticker_select.value  # list of selected tickers
        if df.empty or not tickers:
            self.grouped_chart_pane.object = hv.Text(0.5, 0.5, "No data or no tickers selected", halign='center')
            self.rolling_chart_pane.object = hv.Text(0.5, 0.5, "No data or no tickers selected", halign='center')
            return

        df_subset = df[tickers].dropna(how='all')
        if df_subset.empty:
            self.grouped_chart_pane.object = hv.Text(0.5, 0.5, "No data for these tickers", halign='center')
            self.rolling_chart_pane.object = hv.Text(0.5, 0.5, "No data for these tickers", halign='center')
            return

        # =============== GROUPED CHART (Weekly / Monthly / Quarterly) ===============
        interval = self.interval_select.value  # "Weekly", "Monthly", "Quarterly"
        overlays = []
        for t in df_subset.columns:
            series = df_subset[t].dropna()
            if series.empty:
                continue
            df_temp = series.to_frame(name="Close").copy()

            if interval == "Weekly":
                df_temp["YearWeek"] = df_temp.index.to_period("W-SUN")
                grouped_df = df_temp.groupby("YearWeek")["Close"].mean().reset_index()
                grouped_df["Date"] = grouped_df["YearWeek"].apply(lambda x: x.start_time)
                curve = hv.Curve(
                    (grouped_df["Date"], grouped_df["Close"]),
                    kdims=["Date"], vdims=["Close"], label=t
                ).opts(width=600, height=300)
            elif interval == "Monthly":
                df_temp["YearMonth"] = df_temp.index.to_period("M")
                grouped_df = df_temp.groupby("YearMonth")["Close"].mean().reset_index()
                grouped_df["Date"] = grouped_df["YearMonth"].apply(lambda x: x.start_time)
                curve = hv.Curve(
                    (grouped_df["Date"], grouped_df["Close"]),
                    kdims=["Date"], vdims=["Close"], label=t
                ).opts(width=600, height=300)
            else:  # "Quarterly"
                df_temp["YearQ"] = df_temp.index.to_period("Q")
                grouped_df = df_temp.groupby("YearQ")["Close"].mean().reset_index()
                grouped_df["Date"] = grouped_df["YearQ"].apply(lambda x: x.start_time)
                curve = hv.Curve(
                    (grouped_df["Date"], grouped_df["Close"]),
                    kdims=["Date"], vdims=["Close"], label=t
                ).opts(width=600, height=300)

            overlays.append(curve)

        if overlays:
            grouped_overlay = hv.Overlay(overlays).opts(
                title=f"{interval} Average (Multi-Ticker)",
                tools=["hover"],
                xlabel="Date", ylabel="Avg Close",
                legend_position="top_left"
            )
            self.grouped_chart_pane.object = grouped_overlay
        else:
            self.grouped_chart_pane.object = hv.Text(0.5, 0.5, "No data in overlays", halign='center')

        # =============== ROLLING-WINDOW CHART ===============
        window_size = self.rolling_slider.value
        overlays_rolling = []
        for t in df_subset.columns:
            series = df_subset[t].dropna()
            if series.empty:
                continue
            rolling_series = series.rolling(window_size).mean()
            curve_rolling = hv.Curve(
                (rolling_series.index, rolling_series.values),
                kdims=["Date"], vdims=[t], label=f"{t} (roll)"
            )
            overlays_rolling.append(curve_rolling)

        if overlays_rolling:
            rolling_overlay = hv.Overlay(overlays_rolling).opts(
                width=600, height=300,
                title=f"Rolling Mean ({window_size} days) - Multi-Ticker",
                tools=["hover"],
                legend_position="top_left"
            )
            self.rolling_chart_pane.object = rolling_overlay
        else:
            self.rolling_chart_pane.object = hv.Text(0.5, 0.5, "No data for rolling", halign='center')

    def panel_view(self):
        return self.panel

# -----------------------------------------------------------------------------
# Create & Serve
# -----------------------------------------------------------------------------
app6 = Step6ExtendedCyclesApp()

template6 = pn.template.FastListTemplate(
    title="Step 6: Extended Cycle & Seasonality Analysis (Multiple Tickers)",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app6.panel_view()],
    sidebar=[],
)
template6.servable()