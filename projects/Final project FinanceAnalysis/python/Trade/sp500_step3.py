#!/usr/bin/env python3
"""
Step 3: Financial Analysis and EDA Overview
This version of Step 3 is designed for comprehensive financial analysis and exploratory data analysis. It offers:
  1) An interactive line chart displaying the loaded data.
  2) Explanations of central tendency and variability measures with formulas.
  3) Multiple univariate visualization options.
  4) Box plots and distribution examples.
  5) Automatically generated beginner-friendly insights.
  6) A summary of key takeaways.
  7) An interactive section addressing essential financial business questions.
"""

import math
import numpy as np
import pandas as pd
import panel as pn
import holoviews as hv
import hvplot.pandas
import shared_data

pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')

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

class Step3PresentationApp(pn.viewable.Viewer):
    """
    Financial Analysis and EDA Application

    This application is divided into nine sections:
      1) Data Overview with an interactive price trend chart.
      2) Measures of Central Tendency with explanations and formulas.
      3) Measures of Variability with statistical summaries.
      4) Univariate Data Visualization with various plot types.
      5) Box Plots highlighting key quartiles and outliers.
      6) Distribution Examples showing different skewness types.
      7) Automatic Conclusions with beginner-friendly insights.
      8) Summary and Key Takeaways.
      9) Financial Business Questions presented interactively.
    """
    def __init__(self, **params):
        super().__init__(**params)
        self.section_data_loaded = self._create_data_loaded_section()
        self.section_central_tendency = self._create_central_tendency_section()
        self.section_variability = self._create_variability_section()
        self.section_univariate_vis = self._create_univariate_visualization_section()
        self.section_box_plot = self._create_box_plot_section()
        self.section_distribution_examples = self._create_distribution_examples_section()
        self.section_conclusions = self._create_conclusions_section()
        self.section_summary = self._create_summary_section()
        self.section_business_questions = self._create_business_questions_section()
        self.panel = pn.Column(
            self.section_data_loaded,
            self.section_central_tendency,
            self.section_variability,
            self.section_univariate_vis,
            self.section_box_plot,
            self.section_distribution_examples,
            self.section_conclusions,
            self.section_summary,
            self.section_business_questions,
            sizing_mode="stretch_width"
        )

    def _create_data_loaded_section(self):
        """
        Presents details about the loaded data including tickers, row count, and timeframe, along with a line chart for price trends.
        """
        df_prices = shared_data.df_prices
        header = pn.pane.Markdown("# Data Overview", css_classes=["light-box"])
        if df_prices.empty:
            content = pn.pane.Markdown(
                "**No data loaded from Step 1.** Please load data to proceed.", 
                css_classes=["light-box"]
            )
            chart = None
        else:
            tickers_list = df_prices.columns.tolist()
            row_count = len(df_prices)
            start_date = df_prices.index.min().strftime("%Y-%m-%d")
            end_date = df_prices.index.max().strftime("%Y-%m-%d")
            content = pn.pane.Markdown(
                f"""
**Currently Loaded Data**  
- **Tickers:** {tickers_list}  
- **Total Rows:** {row_count}  
- **Timeframe:** {start_date} → {end_date}
""",
                css_classes=["light-box"]
            )
            chart = df_prices.hvplot.line(
                title="Price Trends Over Time", width=700, height=400
            )
            chart = pn.pane.HoloViews(chart, css_classes=["light-box"])
        return pn.Column(header, content, chart)

    def _create_central_tendency_section(self):
        """
        Describes the central tendency measures (Mean, Median, Mode) with explanations and LaTeX formulas.
        """
        header = pn.pane.Markdown("# Measures of Central Tendency", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
These metrics indicate the center of the data distribution:

- **Mean:** The arithmetic average.
- **Median:** The middle value when sorted.
- **Mode:** The most frequently occurring value.

Extreme values can distort the mean, while the median is more robust.
""",
            css_classes=["light-box"]
        )
        formulas = pn.Column(
            pn.pane.LaTeX(r"""
\[
\textbf{Mean}: \quad \bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
\]
""", css_classes=["my-latex"]),
            pn.pane.LaTeX(r"""
\[
\textbf{Median}: \quad
\begin{cases}
x_{\frac{n+1}{2}}, & \text{if } n\text{ is odd}\\[6pt]
\frac{x_{\frac{n}{2}} + x_{\frac{n}{2}+1}}{2}, & \text{if } n\text{ is even}
\end{cases}
\]
""", css_classes=["my-latex"]),
            pn.pane.LaTeX(r"""
\[
\textbf{Mode}: \quad \text{The most frequent value}
\]
""", css_classes=["my-latex"]),
            css_classes=["light-box"]
        )
        return pn.Column(header, explanation, formulas)

    def _create_variability_section(self):
        """
        Introduces variability metrics and displays a table containing the 5-number summary, IQR, and Standard Deviation for each ticker.
        """
        header = pn.pane.Markdown("# Measures of Variability", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
Variability measures how spread out the data is. Key metrics include:

- **5-Number Summary:** Minimum, Q1, Median, Q3, Maximum.
- **IQR (Interquartile Range):** The range of the middle 50% of the data.
- **Standard Deviation:** The average deviation from the mean.
""",
            css_classes=["light-box"]
        )
        formulas = pn.Column(
            pn.pane.LaTeX(r"""
\[
\textbf{IQR} = Q_3 - Q_1
\]
""", css_classes=["my-latex"]),
            pn.pane.LaTeX(r"""
\[
\textbf{Standard Deviation}: \quad
s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n} (x_i - \bar{x})^2}
\]
""", css_classes=["my-latex"]),
            css_classes=["light-box"]
        )
        table = self._generate_variability_tables()
        return pn.Column(header, explanation, formulas, table)

    def _generate_variability_tables(self):
        """
        Computes and returns a Markdown table of variability metrics for each ticker.
        """
        df_prices = shared_data.df_prices
        if df_prices.empty:
            return pn.pane.Markdown("**No data available** to compute variability metrics.", css_classes=["light-box"])
        lines = []
        lines.append("| **Ticker** | **Min** | **Q1** | **Median** | **Q3** | **Max** | **IQR** | **Std Dev** |")
        lines.append("|---|---|---|---|---|---|---|---|")
        for ticker in df_prices.columns:
            series = df_prices[ticker].dropna()
            if len(series) < 2:
                lines.append(f"| **{ticker}** | Insufficient data |  |  |  |  |  |  |")
                continue
            min_val = series.min()
            q1_val = series.quantile(0.25)
            med_val = series.median()
            q3_val = series.quantile(0.75)
            max_val = series.max()
            iqr_val = q3_val - q1_val
            std_val = series.std()
            lines.append(
                f"| **{ticker}** "
                f"| {min_val:.2f} "
                f"| {q1_val:.2f} "
                f"| {med_val:.2f} "
                f"| {q3_val:.2f} "
                f"| {max_val:.2f} "
                f"| {iqr_val:.2f} "
                f"| {std_val:.2f} |"
            )
        markdown_table = "\n".join(lines)
        return pn.pane.Markdown(markdown_table, css_classes=["light-box"])

    def _create_univariate_visualization_section(self):
        """
        Provides an introduction to various univariate plots with descriptive text.
        """
        header = pn.pane.Markdown("# Univariate Data Visualization", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
Explore individual variables using different plot types:

1. **Density Plot** – Displays the smoothed probability distribution.
2. **Box Plot** – Summarizes data with quartiles and highlights outliers.
3. **Violin Plot** – Merges box plot features with a density curve.
4. **Bar Chart** – Illustrates counts or averages for categories.
5. **Dot/Strip Plot** – Shows detailed data point distributions.
""",
            css_classes=["light-box"]
        )
        return pn.Column(header, explanation)

    def _create_box_plot_section(self):
        """
        Generates box plots for each ticker to display key quartiles and potential outliers.
        """
        df_prices = shared_data.df_prices
        header = pn.pane.Markdown("# Box Plots", css_classes=["light-box"])
        if df_prices.empty:
            content = pn.pane.Markdown("**No data available** for box plot visualization.", css_classes=["light-box"])
            return pn.Column(header, content)
        df_long = df_prices.stack().reset_index()
        df_long.columns = ["Date", "Ticker", "Value"]
        boxplot = df_long.hvplot.box(
            y="Value", by="Ticker", legend=False, height=400, width=700,
            title="Box Plot: Variability per Ticker"
        )
        explanation = pn.pane.Markdown(
            """
A box plot illustrates:
- The box from Q1 to Q3 (middle 50% of data)
- The median value within the box
- Whiskers that extend to the minimum and maximum values (excluding outliers)
- Outliers as individual points
""",
            css_classes=["light-box"]
        )
        return pn.Column(header, explanation, pn.pane.HoloViews(boxplot, css_classes=["light-box"]))

    def _create_distribution_examples_section(self):
        """
        Demonstrates examples of different data distributions: left-skewed, symmetric, and right-skewed.
        """
        header = pn.pane.Markdown("# Distribution Examples", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
Different distribution shapes provide insights into data spread:
- **Left-Skewed:** Lower values pull the mean down.
- **Symmetric:** Data is evenly balanced.
- **Right-Skewed:** Higher values pull the mean up.
""",
            css_classes=["light-box"]
        )
        neg_plot = self._make_neg_skew_plot()
        sym_plot = self._make_symmetric_plot()
        pos_plot = self._make_pos_skew_plot()
        plots = pn.Row(
            pn.Column(
                pn.pane.HoloViews(neg_plot, width=300, height=250),
                pn.pane.Markdown("**Negatively Skewed**", css_classes=["light-box"])
            ),
            pn.Column(
                pn.pane.HoloViews(sym_plot, width=300, height=250),
                pn.pane.Markdown("**Symmetric**", css_classes=["light-box"])
            ),
            pn.Column(
                pn.pane.HoloViews(pos_plot, width=300, height=250),
                pn.pane.Markdown("**Positively Skewed**", css_classes=["light-box"])
            ),
            sizing_mode="stretch_width"
        )
        return pn.Column(header, explanation, plots)

    def _make_neg_skew_plot(self):
        x_left = -np.random.gamma(shape=2.0, scale=2.0, size=1000)
        hist_left = hv.Histogram(np.histogram(x_left, bins=30))
        return hist_left.opts(title="Left-Skew", tools=["hover"])

    def _make_symmetric_plot(self):
        x_norm = np.random.normal(loc=0, scale=1, size=1000)
        hist_norm = hv.Histogram(np.histogram(x_norm, bins=30))
        return hist_norm.opts(title="Symmetric", tools=["hover"])

    def _make_pos_skew_plot(self):
        x_right = np.random.gamma(shape=2.0, scale=2.0, size=1000)
        hist_right = hv.Histogram(np.histogram(x_right, bins=30))
        return hist_right.opts(title="Right-Skew", tools=["hover"])

    def _create_conclusions_section(self):
        """
        Generates beginner-friendly insights for each ticker by comparing skewness and the relationship between mean and median.
        """
        df_prices = shared_data.df_prices
        header = pn.pane.Markdown("# Automatic Conclusions", css_classes=["light-box"])
        if df_prices.empty:
            content = pn.pane.Markdown("**No data available** for generating conclusions.", css_classes=["light-box"])
            return pn.Column(header, content)
        conclusions_text = self._generate_conclusions_markdown(df_prices)
        return pn.Column(header, conclusions_text, css_classes=["light-box"])

    def _generate_conclusions_markdown(self, df_prices):
        lines = [
            "Quick insights into the price distributions for each ticker:",
            "\n- **Skewness** indicates the asymmetry of the distribution.",
            "\n- Differences between **Mean and Median** may reveal outliers."
        ]
        for ticker in df_prices.columns:
            series = df_prices[ticker].dropna()
            if len(series) < 2:
                lines.append(f"\n- **{ticker}**: Insufficient data for analysis.")
                continue
            mean_val = series.mean()
            median_val = series.median()
            skew_val = series.skew()
            if skew_val < -0.5:
                skew_desc = "Left-skewed (negative)"
            elif skew_val > 0.5:
                skew_desc = "Right-skewed (positive)"
            else:
                skew_desc = "Roughly symmetric"
            if mean_val > median_val:
                mm_relation = "Mean > Median"
            elif mean_val < median_val:
                mm_relation = "Mean < Median"
            else:
                mm_relation = "Mean = Median"
            lines.append(
                f"\n- **{ticker}**: {skew_desc}; {mm_relation} "
                f"(skew={skew_val:.2f}, mean={mean_val:.2f}, median={median_val:.2f})"
            )
        return pn.pane.Markdown("\n".join(lines), css_classes=["light-box"])

    def _create_summary_section(self):
        summary_text = """
# Summary & Key Takeaways

1. **Data Overview:** Examine loaded tickers, total rows, timeframe, and price trends.
2. **Central Tendency:** Understand the data center using mean, median, and mode.
3. **Variability:** Analyze the spread with the 5-number summary, IQR, and standard deviation.
4. **Univariate Visualizations:** Explore individual variable behavior.
5. **Box Plots & Distributions:** Identify quartiles, outliers, and distribution skewness.
6. **Automatic Conclusions:** Receive quick insights on data characteristics.

**[Proceed to Next Analysis Step](../sp500_step4)**
"""
        return pn.Column(pn.pane.Markdown(summary_text, css_classes=["light-box"]))

    def _create_business_questions_section(self):
        """
        Provides an interactive section addressing key financial questions:
          1) Total Trading Days
          2) Overall Return
          3) Highest Single-Day Close
          4) Frequency of the Highest Close
          5) Average Monthly Close (with a bar chart)
        """
        header = pn.pane.Markdown("# Financial Business Questions", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
This interactive section addresses essential financial questions:
1. **Trading Days:** Total number of trading sessions.
2. **Overall Return:** Percentage return from the first to the last price.
3. **Highest Single-Day Close:** Maximum closing price and the corresponding date.
4. **Count of Highest Close Days:** Frequency of the highest closing price.
5. **Average Monthly Close:** Trend analysis presented as a bar chart.
""", css_classes=["light-box"]
        )
        self.business_ticker_select = pn.widgets.Select(name="Select Ticker", options=self._get_ticker_options())
        self.business_ticker_select.param.watch(self._update_business_questions, 'value')
        self.business_q1 = pn.pane.Markdown("Loading...", css_classes=["light-box"])
        self.business_q2 = pn.pane.Markdown("Loading...", css_classes=["light-box"])
        self.business_q3 = pn.pane.Markdown("Loading...", css_classes=["light-box"])
        self.business_q4 = pn.pane.Markdown("Loading...", css_classes=["light-box"])
        self.business_q5 = pn.pane.Markdown("Loading...", css_classes=["light-box"])
        self.business_q6_plot = pn.pane.HoloViews(css_classes=["light-box"])
        questions_column = pn.Column(
            self.business_q1,
            self.business_q2,
            self.business_q3,
            self.business_q4,
            self.business_q5,
            self.business_q6_plot,
        )
        section = pn.Column(header, explanation, self.business_ticker_select, questions_column)
        self._update_business_questions()
        return section

    def _get_ticker_options(self):
        df = shared_data.df_prices
        if df.empty:
            return []
        return df.columns.tolist()

    def _update_business_questions(self, *events):
        df = shared_data.df_prices
        ticker = self.business_ticker_select.value
        if df.empty or not ticker:
            self.business_q1.object = "**No data available**"
            self.business_q2.object = "**No data available**"
            self.business_q3.object = "**No data available**"
            self.business_q4.object = "**No data available**"
            self.business_q5.object = "**No data available**"
            self.business_q6_plot.object = hv.Text(0.5, 0.5, "No data available", halign='center')
            return
        series = df[ticker].dropna()
        if series.empty:
            self.business_q1.object = "**No data** for this ticker"
            self.business_q2.object = "**No data**"
            self.business_q3.object = "**No data**"
            self.business_q4.object = "**No data**"
            self.business_q5.object = "**No data**"
            self.business_q6_plot.object = hv.Text(0.5, 0.5, "No data", halign='center')
            return
        num_days = len(series)
        self.business_q1.object = f"**Trading Days:** {num_days}"
        first_price = series.iloc[0]
        last_price = series.iloc[-1]
        overall_return = ((last_price - first_price) / first_price) * 100
        self.business_q2.object = f"**Overall Return:** {overall_return:.2f}% (from {first_price:.2f} to {last_price:.2f})"
        max_price = series.max()
        max_day = series.idxmax()
        self.business_q3.object = f"**Highest Single-Day Close:** {max_price:.2f} on {max_day.strftime('%Y-%m-%d')}"
        count_max = (series == max_price).sum()
        self.business_q4.object = f"**Count of Highest Close Days:** {count_max}"
        df_monthly = series.to_frame(name="Close").copy()
        df_monthly["Month"] = df_monthly.index.month
        monthly_avg = df_monthly.groupby("Month")["Close"].mean().reset_index()
        self.business_q5.object = f"**Average Monthly Close** calculated. See chart below."
        bars = monthly_avg.hvplot.bar(
            x="Month", y="Close", rot=45,
            title=f"Average Monthly Close for {ticker}",
            width=500, height=300
        )
        self.business_q6_plot.object = bars

    def panel_view(self):
        return self.panel

app3 = Step3PresentationApp()

template3 = pn.template.FastListTemplate(
    title="Financial Analysis & EDA Overview",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app3.panel_view()],
    sidebar=[],
)
template3.servable()