#!/usr/bin/env python3
"""
Title: Step 5 - Cycle & Seasonality Analysis
Description:
  In this step, we aim to discover potential cyclical or seasonal patterns in our
  loaded S&P 500 (or multi-ticker) data. We'll address several adapted "business questions":

  1) How many trading days are in the dataset? (Total data points)
  2) What is the overall return from start to end date? (Total "sales")
  3) Which day had the highest single-day close? (Max "sales" day)
  4) Is the data seasonal or cyclical? (Chart by month or day-of-year)
  5) How many days reached that highest single-day close?

We'll use shared_data.df_prices from Steps 1-4 and provide interactive charts & explanations.
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

# Optional CSS
pn.config.raw_css.append("""
.light-box {
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
""")

class Step5CyclesApp(pn.viewable.Viewer):
    """
    Step 5: Cycle & Seasonality Analysis
    Addresses:
      1) # of trading days
      2) Overall return
      3) Highest single-day close
      4) Seasonal/cyclical patterns (monthly or day-of-year chart)
      5) Count of days with highest close
    """
    def __init__(self, **params):
        super().__init__(**params)

        # Ticker selection: If multiple columns, let user pick which to analyze in depth
        self.ticker_select = pn.widgets.Select(name="Select Ticker", options=self._get_ticker_options())
        self.ticker_select.param.watch(self._update_analysis, 'value')

        # Sections for each "business question"
        self.section_intro = self._create_intro_section()
        self.section_q1 = self._create_q1_total_trading_days()
        self.section_q2 = self._create_q2_overall_return()
        self.section_q3 = self._create_q3_highest_single_day_close()
        self.section_q4 = self._create_q4_seasonal_patterns()
        self.section_q5 = self._create_q5_how_many_highest_days()

        # Put everything into a single layout
        self.panel = pn.Column(
            self.section_intro,
            pn.Row(pn.Spacer(width=10), self.ticker_select),
            self.section_q1,
            self.section_q2,
            self.section_q3,
            self.section_q4,
            self.section_q5,
            # Navigation link
            pn.pane.Markdown("[Back to Step 4](../sp500_step4) | [End or Next Step](#)",
                             css_classes=["light-box"]),
            sizing_mode="stretch_width"
        )

        # Trigger an initial update
        self._update_analysis()

    def _get_ticker_options(self):
        df = shared_data.df_prices
        if df.empty:
            return []
        return df.columns.tolist()

    def _create_intro_section(self):
        return pn.pane.Markdown(
            """
# Step 5: Cycle & Seasonality Analysis

This step aims to reveal any cyclical or seasonal trends in our data.
We address five adapted "business questions" about the dataset.

1. **Total # of trading days** in the dataset  
2. **Overall return** from start to end date  
3. **Highest single-day close** (like the biggest single day "sale")  
4. **Seasonal or cyclical patterns** (is there a monthly or day-of-year trend?)  
5. **How many days** reached that highest single-day close?
""",
            css_classes=["light-box"]
        )

    def _create_q1_total_trading_days(self):
        header = pn.pane.Markdown("## Q1) How many trading days are in our dataset?", css_classes=["light-box"])
        self.q1_answer = pn.pane.Markdown("Loading...", css_classes=["light-box"])
        return pn.Column(header, self.q1_answer)

    def _create_q2_overall_return(self):
        header = pn.pane.Markdown("## Q2) What is the overall return from start to end date?", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
We measure overall return by comparing the **first available price** to the **last available price**:
\\[
\\text{Return} = \\frac{\\text{Last Price} - \\text{First Price}}{\\text{First Price}} \\times 100\\%
\\]
""",
            css_classes=["light-box"]
        )
        self.q2_answer = pn.pane.Markdown("Loading...", css_classes=["light-box"])
        return pn.Column(header, explanation, self.q2_answer)

    def _create_q3_highest_single_day_close(self):
        header = pn.pane.Markdown("## Q3) Which day had the highest single-day close?", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
We want to find the maximum closing price in the entire dataset, for the selected ticker.
""",
            css_classes=["light-box"]
        )
        self.q3_answer = pn.pane.Markdown("Loading...", css_classes=["light-box"])
        return pn.Column(header, explanation, self.q3_answer)

    def _create_q4_seasonal_patterns(self):
        header = pn.pane.Markdown("## Q4) Is there a seasonal or cyclical pattern?", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
One approach is to **group** data by **month** (or day-of-year) and look at average prices
(or returns) to see if certain months have recurring patterns.

Below is a bar chart showing **average monthly price** for the selected ticker.
If certain months consistently have higher or lower values, that may indicate seasonality.
""",
            css_classes=["light-box"]
        )
        self.q4_plot_pane = pn.pane.HoloViews()
        return pn.Column(header, explanation, self.q4_plot_pane)

    def _create_q5_how_many_highest_days(self):
        header = pn.pane.Markdown("## Q5) How many days reached that highest single-day close?", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
After finding the maximum daily close, we check how many days matched that same price.
Sometimes a ticker hits its all-time high on multiple days in a row.
""",
            css_classes=["light-box"]
        )
        self.q5_answer = pn.pane.Markdown("Loading...", css_classes=["light-box"])
        return pn.Column(header, explanation, self.q5_answer)

    def _update_analysis(self, *events):
        df = shared_data.df_prices
        ticker = self.ticker_select.value

        if df.empty or not ticker:
            self.q1_answer.object = "**No data available**"
            self.q2_answer.object = "**No data available**"
            self.q3_answer.object = "**No data available**"
            self.q4_plot_pane.object = hv.Text(0.5, 0.5, "No data available", halign='center')
            self.q5_answer.object = "**No data available**"
            return

        series = df[ticker].dropna()
        if series.empty:
            self.q1_answer.object = "**No data** for this ticker"
            self.q2_answer.object = "**No data**"
            self.q3_answer.object = "**No data**"
            self.q4_plot_pane.object = hv.Text(0.5, 0.5, "No data", halign='center')
            self.q5_answer.object = "**No data**"
            return

        # Q1) Number of trading days
        num_days = len(series)
        self.q1_answer.object = f"**Answer**: {num_days} trading days in this dataset for **{ticker}**."

        # Q2) Overall return
        first_price = series.iloc[0]
        last_price = series.iloc[-1]
        overall_return = ((last_price - first_price) / first_price) * 100
        self.q2_answer.object = (
            f"**Answer**: From the first available price (`{first_price:.2f}`) "
            f"to the last available price (`{last_price:.2f}`), "
            f"the return is **{overall_return:.2f}%**."
        )

        # Q3) Highest single-day close
        max_price = series.max()
        max_day = series.idxmax()
        self.q3_answer.object = (
            f"**Answer**: The highest close was **{max_price:.2f}** "
            f"on **{max_day.strftime('%Y-%m-%d')}**."
        )

        # Q4) Seasonal/cyclical patterns
        # Group by month (1-12) and compute average
        df_monthly = series.to_frame(name="Close").copy()
        df_monthly["Month"] = df_monthly.index.month
        monthly_avg = df_monthly.groupby("Month")["Close"].mean().reset_index()

        # Create a bar chart
        bars = monthly_avg.hvplot.bar(
            x="Month", y="Close", rot=45,
            title=f"Average Monthly Close for {ticker}",
            width=500, height=300
        )
        self.q4_plot_pane.object = bars

        # Q5) How many days matched that highest close
        # If multiple days had the same max, we count them
        count_max = (series == max_price).sum()
        self.q5_answer.object = (
            f"**Answer**: The price of **{max_price:.2f}** occurred on "
            f"**{count_max}** day(s) in total for {ticker}."
        )

    def panel_view(self):
        return self.panel


# -----------------------------------------------------------------------------
# Create & Serve
# -----------------------------------------------------------------------------
app5 = Step5CyclesApp()

template5 = pn.template.FastListTemplate(
    title="Step 5: Cycle & Seasonality Analysis",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app5.panel_view()],
    sidebar=[],
)
template5.servable()