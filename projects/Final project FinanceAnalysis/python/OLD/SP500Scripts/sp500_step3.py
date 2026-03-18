#!/usr/bin/env python3
"""
Title: Step 3 (plus new Step 4) - Beginner-Friendly EDA & Variability Overview
Description:
  In this step, we provide a clear and detailed overview of the loaded data,
  explain key statistical concepts in simple terms, and visualize the data distributions.

  Sections:
    1) Data Overview
    2) Measures of Central Tendency
    3) Measures of Variability
    4) Univariate Data Visualization (NEW)
    5) Box Plots
    6) Distribution Examples
    7) Automatic Conclusions
    8) Summary & Key Takeaways
"""

import math
import numpy as np
import pandas as pd
import panel as pn
import holoviews as hv
import hvplot.pandas

# Shared data from Step 1 & 2
import shared_data

pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')

# Enhanced CSS for better readability and larger LaTeX formulas
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
    Step 3 Page (with new Step 4 included): Beginner-Friendly Exploratory Data Analysis (EDA)
    & Variability Overview, plus a short intro to univariate data visualizations.
    
    Sections:
      1) Data Overview
      2) Measures of Central Tendency
      3) Measures of Variability
      4) Univariate Data Visualization (NEW)
      5) Box Plots
      6) Distribution Examples
      7) Automatic Conclusions
      8) Summary & Key Takeaways
    """
    def __init__(self, **params):
        super().__init__(**params)

        # 1) Data Overview
        self.section_data_loaded = self._create_data_loaded_section()
        # 2) Central Tendency
        self.section_central_tendency = self._create_central_tendency_section()
        # 3) Variability
        self.section_variability = self._create_variability_section()
        # 4) Univariate Data Visualization (NEW)
        self.section_univariate_vis = self._create_univariate_visualization_section()
        # 5) Box Plots
        self.section_box_plot = self._create_box_plot_section()
        # 6) Distribution Examples
        self.section_distribution_examples = self._create_distribution_examples_section()
        # 7) Automatic Conclusions
        self.section_conclusions = self._create_conclusions_section()
        # 8) Summary & Key Takeaways
        self.section_summary = self._create_summary_section()

        # Combine all sections into a single panel layout
        self.panel = pn.Column(
            self.section_data_loaded,
            self.section_central_tendency,
            self.section_variability,
            self.section_univariate_vis,
            self.section_box_plot,
            self.section_distribution_examples,
            self.section_conclusions,
            self.section_summary,
            sizing_mode="stretch_width"
        )

    # --------------------------------------------------------------------------
    # (1) DATA OVERVIEW
    # --------------------------------------------------------------------------
    def _create_data_loaded_section(self):
        """
        Displays details of the loaded data including tickers, number of rows, and timeframe.
        """
        df_prices = shared_data.df_prices
        header = pn.pane.Markdown("# 1) Data Overview", css_classes=["light-box"])
        if df_prices.empty:
            content = pn.pane.Markdown(
                "**No data loaded from Step 1**. Please load data to proceed.", 
                css_classes=["light-box"]
            )
        else:
            tickers_list = df_prices.columns.tolist()
            row_count = len(df_prices)
            start_date = df_prices.index.min().strftime("%Y-%m-%d")
            end_date   = df_prices.index.max().strftime("%Y-%m-%d")
            content = pn.pane.Markdown(
                f"""
**Currently Loaded Data**  
- **Tickers**: {tickers_list}  
- **Total Rows**: {row_count}  
- **Timeframe**: {start_date} → {end_date}
""",
                css_classes=["light-box"]
            )
        return pn.Column(header, content)

    # --------------------------------------------------------------------------
    # (2) MEASURES OF CENTRAL TENDENCY
    # --------------------------------------------------------------------------
    def _create_central_tendency_section(self):
        """
        Explains Mean, Median, and Mode with formulas and plain language explanations.
        """
        header = pn.pane.Markdown("# 2) Measures of Central Tendency", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
These metrics describe where the “middle” of the data lies:

- **Mean**: The arithmetic average. Add all the values and divide by the number of values.
- **Median**: The middle value once the data is sorted from smallest to largest.
- **Mode**: The value that appears most frequently.

When data has extreme values, the mean can be pulled toward them, while the median stays closer to the middle. The mode is useful if one value appears often.
""",
            css_classes=["light-box"]
        )
        # Display formulas in block form for clarity
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
x_{\frac{n+1}{2}}, & \text{if } n\text{ is odd}\\
\frac{x_{\frac{n}{2}} + x_{\frac{n}{2}+1}}{2}, & \text{if } n\text{ is even}
\end{cases}
\]
""", css_classes=["my-latex"]),
            pn.pane.LaTeX(r"""
\[
\textbf{Mode}: \quad \text{The value that appears most often}
\]
""", css_classes=["my-latex"]),
            css_classes=["light-box"]
        )
        return pn.Column(header, explanation, formulas)

    # --------------------------------------------------------------------------
    # (3) MEASURES OF VARIABILITY
    # --------------------------------------------------------------------------
    def _create_variability_section(self):
        """
        Introduces the concept of variability and displays a data-driven table with key metrics.
        """
        header = pn.pane.Markdown("# 3) Measures of Variability", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
Variability shows how spread out the data is.  
Common metrics:

- **5-Number Summary**: Min, Q1, Median, Q3, and Max.
- **IQR (Interquartile Range)**: Q3 - Q1, capturing the middle 50%.
- **Standard Deviation**: How far values typically stray from the mean.
""",
            css_classes=["light-box"]
        )
        # Use block form for the formulas
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
        Computes and returns a Markdown table with variability metrics for each ticker.
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
            q1_val  = series.quantile(0.25)
            med_val = series.median()
            q3_val  = series.quantile(0.75)
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

    # --------------------------------------------------------------------------
    # (4) UNIVARIATE DATA VISUALIZATION (NEW)
    # --------------------------------------------------------------------------
    def _create_univariate_visualization_section(self):
        """
        Introduces various univariate plots with short explanations.
        """
        header = pn.pane.Markdown("# 4) Univariate Data Visualization (NEW)", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
When exploring a single variable (univariate analysis), there are many ways to visualize it:

1. **Density Plot (Smooth Curve)**  
   - Also known as a Kernel Density Plot or Density Trace Graph.  
   - Displays the probability distribution of a continuous variable.

2. **Box Plot (Box & Whisker Plot)**  
   - Summarizes distribution using quartiles and highlights outliers.  
   - (We’ll show a code example in **Step 5**.)

3. **Violin Plot**  
   - Combines a box plot with a density curve to show data distribution more fully.

4. **Bar Chart (Categorical Data)**  
   - Displays the frequency or count of each category (e.g., number of loans per business sector).

5. **Pie Chart (Categorical Data)**  
   - Shows proportions of each category in a dataset (e.g., market share).

6. **Dot Plot (Small Datasets)**  
   - Simple plot where each data point is shown as a dot, often used for small sample sizes.

7. **Strip Chart**  
   - Places individual data points in a line or over time to show part-to-whole relationships.

8. **Fan Plot**  
   - Displays past history plus a range of possible future values, often used for forecasting.
""",
            css_classes=["light-box"]
        )

        return pn.Column(header, explanation)

    # --------------------------------------------------------------------------
    # (5) BOX PLOTS
    # --------------------------------------------------------------------------
    def _create_box_plot_section(self):
        """
        Creates and explains box plots for each ticker, highlighting key components.
        """
        df_prices = shared_data.df_prices
        header = pn.pane.Markdown("# 5) Box Plots", css_classes=["light-box"])
        if df_prices.empty:
            content = pn.pane.Markdown("**No data available** for box plot visualization.", css_classes=["light-box"])
            return pn.Column(header, content)

        # Reshape data for box plot
        df_long = df_prices.stack().reset_index()
        df_long.columns = ["Date", "Ticker", "Value"]

        boxplot = df_long.hvplot.box(
            y="Value", by="Ticker", legend=False, height=400, width=700,
            title="Box Plot: Variability per Ticker"
        )

        explanation = pn.pane.Markdown(
            """
A **box plot** visually compares different data distributions side by side.  

- **Box**: From Q1 to Q3 (the middle 50% of the data).  
- **Median line**: The middle value within the box.  
- **Whiskers**: Extend to the min and max, excluding outliers.  
- **Outliers**: Plotted as points beyond the whiskers.

These plots highlight whether a ticker’s data is tightly packed or widely spread out.
""",
            css_classes=["light-box"]
        )
        return pn.Column(header, explanation, pn.pane.HoloViews(boxplot, css_classes=["light-box"]))

    # --------------------------------------------------------------------------
    # (6) DISTRIBUTION EXAMPLES
    # --------------------------------------------------------------------------
    def _create_distribution_examples_section(self):
        """
        Shows examples of negatively skewed, symmetric, and positively skewed distributions.
        """
        header = pn.pane.Markdown("# 6) Distribution Examples", css_classes=["light-box"])
        explanation = pn.pane.Markdown(
            """
Distributions describe how often different values occur.  
- **Left-Skewed (Negative)**: A few low values pull the mean down.  
- **Symmetric**: Values are more or less evenly spread around the center.  
- **Right-Skewed (Positive)**: A few high values pull the mean up.
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

    # --------------------------------------------------------------------------
    # (7) AUTOMATIC CONCLUSIONS
    # --------------------------------------------------------------------------
    def _create_conclusions_section(self):
        """
        Generates simpler, beginner-friendly insights for each ticker.
        """
        df_prices = shared_data.df_prices
        header = pn.pane.Markdown("# 7) Automatic Conclusions", css_classes=["light-box"])
        if df_prices.empty:
            content = pn.pane.Markdown("**No data available** for generating conclusions.", css_classes=["light-box"])
            return pn.Column(header, content)

        conclusions_text = self._generate_conclusions_markdown(df_prices)
        return pn.Column(header, conclusions_text, css_classes=["light-box"])

    def _generate_conclusions_markdown(self, df_prices):
        lines = [
            "This section provides a quick look at each ticker’s skewness and how the mean compares to the median."
            "\n\n- **Skewness**: A measure of how asymmetrical the data is."
            "\n  - Negative (left) skew: A few low values pull the average down."
            "\n  - Positive (right) skew: A few high values pull the average up."
            "\n  - Near zero: The distribution is more balanced."
            "\n- **Mean vs. Median**: If the mean is higher than the median, it suggests some high values are pushing the average up; if it’s lower, some low values are dragging it down."
        ]

        for ticker in df_prices.columns:
            series = df_prices[ticker].dropna()
            if len(series) < 2:
                lines.append(f"- **{ticker}**: Not enough data to analyze.")
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
                f"- **{ticker}**: {skew_desc}; {mm_relation} "
                f"(skew={skew_val:.2f}, mean={mean_val:.2f}, median={median_val:.2f})"
            )

        return pn.pane.Markdown("\n".join(lines), css_classes=["light-box"])

    # --------------------------------------------------------------------------
    # (8) SUMMARY & KEY TAKEAWAYS
    # --------------------------------------------------------------------------
    def _create_summary_section(self):
        summary_text = """
# 8) Summary & Key Takeaways

1. **Data Overview**  
   Which tickers are loaded, total rows, and timeframe.

2. **Central Tendency**  
   Mean, Median, and Mode locate the “middle” of the data.

3. **Variability**  
   5-number summary, IQR, and Standard Deviation measure the spread.

4. **Univariate Data Visualization (NEW)**  
   Common ways to visualize a single variable, like density or bar charts.

5. **Box Plots**  
   A detailed code example of how to view quartiles and outliers side by side.

6. **Distribution Examples**  
   Demonstrations of negative, symmetric, and positive skew.

7. **Automatic Conclusions**  
   Quick insights into each ticker’s skewness and mean–median relationship.

Understanding these descriptive tools helps in detecting patterns or cycles. In future steps, you can use these insights to make predictions or deeper analyses.

**[Back to Step 2](../sp500_step2) | [Proceed to Step 4](../sp500_step4)**
"""
        return pn.Column(
            pn.pane.Markdown(summary_text, css_classes=["light-box"])
        )

    def panel_view(self):
        return self.panel


# -----------------------------------------------------------------------------
# Create & Serve
# -----------------------------------------------------------------------------
app3 = Step3PresentationApp()

template3 = pn.template.FastListTemplate(
    title="Step 3 (with new Step 4): Beginner-Friendly EDA & Variability Overview",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app3.panel_view()],
    sidebar=[],
)
template3.servable()