#!/usr/bin/env python3
"""
Title: Step 4 - Univariate Data Visualization
Description:
  Demonstrates various plots for exploring a single variable (univariate analysis).
  We use one chosen ticker/column from our loaded data, then visualize it in different ways:
    1) Density Plot (KDE)
    2) Box Plot
    3) Violin Plot
    4) Bar Chart (Categorical)
    5) Pie Chart (Categorical) - Using Bokeh wedge
    6) Dot Plot
    7) Strip Chart
    8) Fan Plot (basic placeholder for possible future values)
  Navigation: [Back to Step 3](../sp500_step3) | [Proceed to Step 5](../sp500_step5)
"""

import math
import numpy as np
import pandas as pd
import panel as pn
import holoviews as hv
import hvplot.pandas  # for easy hvplot usage

# Bokeh imports for the Pie Chart
from bokeh.plotting import figure
from bokeh.transform import cumsum
from bokeh.palettes import Category20

import shared_data  # <-- Reads the global df_prices

pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')

# Optional CSS
pn.config.raw_css.append("""
.my-latex .bk-tex {
    font-size: 140% !important;
    margin: 10px 0;
}
.light-box {
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
""")

class Step4UnivariateVizApp(pn.viewable.Viewer):
    """
    Step 4: Univariate Data Visualization.
    Demonstrates different plot types for a single variable (one ticker or column).
    """

    def __init__(self, **params):
        super().__init__(**params)

        # 1) Provide a ticker selector so the user can pick which column to visualize
        self.ticker_select = pn.widgets.Select(
            name="Select Ticker",
            options=self._get_ticker_options()
        )
        # When the selected ticker changes, update all plots
        self.ticker_select.param.watch(self._update_plots, 'value')

        # Sections for each type of plot
        self.section_intro = self._create_intro_section()
        self.section_density = self._create_density_plot_section()
        self.section_box = self._create_box_plot_section()
        self.section_violin = self._create_violin_plot_section()
        self.section_bar = self._create_bar_chart_section()
        self.section_pie = self._create_pie_chart_section()
        self.section_dot = self._create_dot_plot_section()
        self.section_strip = self._create_strip_chart_section()
        self.section_fan = self._create_fan_plot_section()

        # Navigation links at the bottom
        self.nav_links = pn.pane.Markdown(
            "[Back to Step 3](../sp500_step3) | [Proceed to Step 5](../sp500_step5)",
            css_classes=["light-box"]
        )

        # Combine everything into the main panel
        self.panel = pn.Column(
            self.section_intro,
            pn.Row(pn.Spacer(width=10), self.ticker_select),
            self.section_density,
            self.section_box,
            self.section_violin,
            self.section_bar,
            self.section_pie,
            self.section_dot,
            self.section_strip,
            self.section_fan,
            self.nav_links,
            sizing_mode="stretch_width"
        )

        # Initial update of all plots
        self._update_plots()

    def _get_ticker_options(self):
        """
        Return a list of numeric columns available for univariate plots.
        If no data is loaded or no numeric columns exist, return an empty list.
        """
        df = shared_data.df_prices
        if df.empty:
            return []
        # Keep only numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        return numeric_cols

    def _create_intro_section(self):
        return pn.pane.Markdown(
            """
# Step 4: Univariate Data Visualization

Below are examples of **univariate** plots (one variable at a time).  
Use the dropdown to select which ticker (column) you want to visualize.

**Plot Types**:
1. **Density Plot** (KDE)
2. **Box Plot**
3. **Violin Plot**
4. **Bar Chart** (categorical)
5. **Pie Chart** (categorical)
6. **Dot Plot**
7. **Strip Chart**
8. **Fan Plot** (placeholder for forecast)
""",
            css_classes=["light-box"]
        )

    # --------------------------------------------------------------------------
    # 1) DENSITY PLOT
    # --------------------------------------------------------------------------
    def _create_density_plot_section(self):
        header = pn.pane.Markdown("## 1) Density Plot (KDE)", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
A **Density Plot** (or KDE plot) shows the probability distribution of a continuous variable.
It’s a smoothed version of a histogram, helping to reveal peaks and overall shape.
""",
            css_classes=["light-box"]
        )
        self.density_plot_pane = pn.pane.HoloViews()
        return pn.Column(header, explanation, self.density_plot_pane)

    # --------------------------------------------------------------------------
    # 2) BOX PLOT
    # --------------------------------------------------------------------------
    def _create_box_plot_section(self):
        header = pn.pane.Markdown("## 2) Box Plot", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
A **Box Plot** (box-and-whisker) shows the distribution using:
- Minimum
- First Quartile (Q1)
- Median
- Third Quartile (Q3)
- Maximum  
Outliers appear as individual points.
""",
            css_classes=["light-box"]
        )
        self.box_plot_pane = pn.pane.HoloViews()
        return pn.Column(header, explanation, self.box_plot_pane)

    # --------------------------------------------------------------------------
    # 3) VIOLIN PLOT
    # --------------------------------------------------------------------------
    def _create_violin_plot_section(self):
        header = pn.pane.Markdown("## 3) Violin Plot", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
A **Violin Plot** combines a box plot with a *density* shape, showing both quartile ranges and
where the data is denser or sparser. This helps visualize multi-modal distributions more clearly.
""",
            css_classes=["light-box"]
        )
        self.violin_plot_pane = pn.pane.HoloViews()
        return pn.Column(header, explanation, self.violin_plot_pane)

    # --------------------------------------------------------------------------
    # 4) BAR CHART
    # --------------------------------------------------------------------------
    def _create_bar_chart_section(self):
        header = pn.pane.Markdown("## 4) Bar Chart (Categorical Data)", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
A **Bar Chart** displays frequencies or counts for different categories.  
If your data is purely numeric, you can convert it into categories by binning it.
""",
            css_classes=["light-box"]
        )
        self.bar_chart_pane = pn.pane.HoloViews()
        return pn.Column(header, explanation, self.bar_chart_pane)

    # --------------------------------------------------------------------------
    # 5) PIE CHART (using Bokeh wedge)
    # --------------------------------------------------------------------------
    def _create_pie_chart_section(self):
        header = pn.pane.Markdown("## 5) Pie Chart (Categorical Data)", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
A **Pie Chart** represents categories as slices of a circle, showing their proportion of the total.
We're using a **Bokeh** wedge glyph here, since HoloViews does not have a built-in `Wedge` element.
""",
            css_classes=["light-box"]
        )
        self.pie_chart_pane = pn.pane.Bokeh()
        return pn.Column(header, explanation, self.pie_chart_pane)

    # --------------------------------------------------------------------------
    # 6) DOT PLOT
    # --------------------------------------------------------------------------
    def _create_dot_plot_section(self):
        header = pn.pane.Markdown("## 6) Dot Plot", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
A **Dot Plot** places each data point as a dot along an axis, making it easy to see individual points.
It’s most effective for smaller datasets, where each dot can be clearly distinguished.
""",
            css_classes=["light-box"]
        )
        self.dot_plot_pane = pn.pane.HoloViews()
        return pn.Column(header, explanation, self.dot_plot_pane)

    # --------------------------------------------------------------------------
    # 7) STRIP CHART
    # --------------------------------------------------------------------------
    def _create_strip_chart_section(self):
        header = pn.pane.Markdown("## 7) Strip Chart", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
A **Strip Chart** displays individual data points, often with a bit of random jitter along one axis
to avoid overlapping points. Useful when you want to see each observation rather than just a summary.
""",
            css_classes=["light-box"]
        )
        self.strip_chart_pane = pn.pane.HoloViews()
        return pn.Column(header, explanation, self.strip_chart_pane)

    # --------------------------------------------------------------------------
    # 8) FAN PLOT
    # --------------------------------------------------------------------------
    def _create_fan_plot_section(self):
        header = pn.pane.Markdown("## 8) Fan Plot (Placeholder)", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
A **Fan Plot** shows past values plus a possible range of future values (forecasts).
Below is a simple placeholder example to demonstrate the concept.
""",
            css_classes=["light-box"]
        )
        self.fan_plot_pane = pn.pane.HoloViews()
        return pn.Column(header, explanation, self.fan_plot_pane)

    # --------------------------------------------------------------------------
    # The all-important _update_plots method
    # --------------------------------------------------------------------------
    def _update_plots(self, *events):
        """
        Refreshes all plots whenever the selected ticker changes or the data is updated.
        """
        df = shared_data.df_prices
        ticker = self.ticker_select.value

        # If no data is loaded or no ticker selected
        if df.empty or not ticker:
            for pane in [
                self.density_plot_pane, self.box_plot_pane, self.violin_plot_pane,
                self.bar_chart_pane, self.pie_chart_pane, self.dot_plot_pane,
                self.strip_chart_pane, self.fan_plot_pane
            ]:
                pane.object = hv.Text(0.5, 0.5, "No data available", halign='center')
            return

        # 1) Density Plot (KDE)
        density = df[ticker].dropna().hvplot.kde(
            title=f"Density Plot for {ticker}",
            width=500, height=300
        )
        self.density_plot_pane.object = density

        # 2) Box Plot
        box = df[ticker].dropna().hvplot.box(
            title=f"Box Plot for {ticker}",
            width=300, height=300
        )
        self.box_plot_pane.object = box

        # 3) Violin Plot
        val_series = df[ticker].dropna()
        if val_series.empty:
            self.violin_plot_pane.object = hv.Text(0.5, 0.5, "No data for Violin Plot", halign='center')
        else:
            viol_df = pd.DataFrame({'Category': ['All Data']*len(val_series), 'Value': val_series.values})
            viol = hv.Violin(viol_df, kdims=['Category'], vdims=['Value']).opts(
                width=300, height=300, tools=["hover"], violin_fill_color="#1f77b4",
                title=f"Violin Plot for {ticker}"
            )
            self.violin_plot_pane.object = viol

        # 4) Bar Chart (bin numeric data into categories)
        cat_data = pd.cut(df[ticker].dropna(), bins=5, labels=[f"Bin{i}" for i in range(1,6)])
        bar = cat_data.value_counts().hvplot.bar(
            title=f"Bar Chart of {ticker} (binned into 5 categories)",
            rot=45, width=400, height=300
        )
        self.bar_chart_pane.object = bar

        # 5) Pie Chart (using Bokeh wedge)
        pie_data = cat_data.value_counts().reset_index()
        pie_data.columns = ["Category", "Count"]
        if len(pie_data) > 0:
            total = pie_data["Count"].sum()
            pie_data["angle"] = pie_data["Count"] / total * 2 * math.pi
            pie_data["color"] = [Category20[20][i % 20] for i in range(len(pie_data))]

            p = figure(
                width=300, height=300,
                title="Pie Chart (Binned Data)",
                toolbar_location=None,
                tools="hover",
                tooltips="@Category: @Count"
            )
            p.wedge(
                x=0, y=1, radius=0.4,
                start_angle=cumsum('angle', include_zero=True),
                end_angle=cumsum('angle'),
                line_color="white",
                fill_color='color',
                legend_field='Category',
                source=pie_data
            )
            p.legend.location = "top_left"
            self.pie_chart_pane.object = p
        else:
            self.pie_chart_pane.object = hv.Text(0.5, 0.5, "No categories to display", halign='center')

        # 6) Dot Plot
        dot_data = df[ticker].dropna().reset_index()
        dot_data.columns = ["Index", "Value"]
        dot_plot = hv.Scatter(dot_data, kdims=["Index"], vdims=["Value"]).opts(
            width=500, height=300, marker="dot", size=5, tools=["hover"],
            title=f"Dot Plot for {ticker}"
        )
        self.dot_plot_pane.object = dot_plot

        # 7) Strip Chart
        strip_data = df[ticker].dropna().reset_index()
        strip_data["Jitter"] = 0.1 * np.random.randn(len(strip_data))
        strip_chart = hv.Scatter(
            (strip_data.index + strip_data["Jitter"], strip_data[ticker]),
            kdims=["Index+Jitter"], vdims=["Value"]
        ).opts(
            width=500, height=300, marker="circle", size=5, tools=["hover"],
            title=f"Strip Chart for {ticker}"
        )
        self.strip_chart_pane.object = strip_chart

        # 8) Fan Plot (placeholder)
        if len(val_series) > 20:
            hist_curve = hv.Curve((val_series.index, val_series.values), label="Historical")
            last_date = val_series.index[-1]
            future_dates = pd.date_range(last_date, periods=10, freq="D")[1:]
            last_price = val_series.iloc[-1]
            forecasts = []
            for d in future_dates:
                low = last_price - np.random.uniform(0, 2)
                high = last_price + np.random.uniform(0, 2)
                forecasts.append((d, low, high))
            forecast_df = pd.DataFrame(forecasts, columns=["Date", "Low", "High"])
            band = hv.Area((forecast_df["Date"], forecast_df["Low"], forecast_df["High"]))
            fan_plot = hist_curve * band.opts(alpha=0.3, color="green")
            fan_plot = fan_plot.opts(
                width=600, height=300,
                title=f"Fan Plot (Historical + Simple Range) for {ticker}",
                tools=["hover"]
            )
            self.fan_plot_pane.object = fan_plot
        else:
            self.fan_plot_pane.object = hv.Text(
                0.5, 0.5, "Not enough data for a Fan Plot example", halign='center'
            )

    def panel_view(self):
        return self.panel

# -----------------------------------------------------------------------------
# Create & Serve
# -----------------------------------------------------------------------------
app4 = Step4UnivariateVizApp()

template4 = pn.template.FastListTemplate(
    title="Step 4: Univariate Data Visualization",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app4.panel_view()],
    sidebar=[],
)
template4.servable()