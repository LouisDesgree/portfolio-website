#!/usr/bin/env python3
"""
Detailed Univariate Analysis & Automatic Insights
This application provides an in-depth univariate analysis for a selected ticker. It includes:
  - A comprehensive summary table (Count, Mean, Median, Std Dev, Min, Q1, Q3, Max, Skewness, Kurtosis).
  - A Kernel Density Estimate (KDE) plot with an automatic interpretation of distribution shape.
  - A Histogram for frequency distribution insights.
  - A Box Plot highlighting quartiles and potential outliers.
  - A Violin Plot merging box/density information for deeper visual clarity.
  - A Cumulative Distribution Function (CDF) plot, concluding the distribution overview.
  - Navigation links to return to Step 3 or proceed to (what is actually) Step 6 but labeled as Step 5.
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

class Step4UnivariateAnalysisApp(pn.viewable.Viewer):
    """
    Step 4: Univariate Analysis
    Displays key summary statistics and multiple plots for a chosen ticker,
    offering brief interpretations of each visualization.
    """
    def __init__(self, **params):
        super().__init__(**params)

        self.ticker_select = pn.widgets.Select(
            name="Select Ticker",
            options=self._get_numeric_tickers()
        )
        self.ticker_select.param.watch(self._update_all, 'value')

        self.intro_section = pn.pane.Markdown(
            """
# In-Depth Univariate Analysis

Choose a ticker to explore the following:
- **Key Summary Statistics**
- **Density Plot (KDE)**  
- **Histogram**  
- **Box Plot**  
- **Violin Plot**  
- **CDF (Cumulative Distribution)**  

Each section provides a concise interpretation to guide you.  
If the statistics table is clipped, please scroll or enlarge the view.
""",
            css_classes=["light-box"]
        )

        self.stats_table = pn.widgets.DataFrame(
            name="Key Summary Statistics",
            autosize_mode='fit_viewport',
            disabled=True,
            show_index=False,
            width=400,
            height=250
        )

        self.stats_section = pn.Column(
            pn.pane.Markdown("### Key Summary Statistics", css_classes=["light-box"]),
            self.stats_table
        )

        self.density_plot_pane = pn.pane.HoloViews(sizing_mode="stretch_width", css_classes=["light-box"])
        self.density_text = pn.pane.Markdown("", css_classes=["light-box"])

        self.histogram_pane = pn.pane.HoloViews(sizing_mode="stretch_width", css_classes=["light-box"])
        self.histogram_text = pn.pane.Markdown("", css_classes=["light-box"])

        self.box_plot_pane = pn.pane.HoloViews(sizing_mode="stretch_width", css_classes=["light-box"])
        self.box_text = pn.pane.Markdown("", css_classes=["light-box"])

        self.violin_plot_pane = pn.pane.HoloViews(sizing_mode="stretch_width", css_classes=["light-box"])
        self.violin_text = pn.pane.Markdown("", css_classes=["light-box"])

        self.cdf_plot_pane = pn.pane.HoloViews(sizing_mode="stretch_width", css_classes=["light-box"])
        self.cdf_text = pn.pane.Markdown("", css_classes=["light-box"])

        # <-- Updated Navigation Link Here -->
        self.nav_links = pn.pane.Markdown(
            "[Back to Step 3](../sp500_step3) | [Proceed to Step 5](../sp500_step6)",
            css_classes=["light-box"]
        )
        # ------------------------------------

        self.panel = pn.Column(
            self.intro_section,
            pn.Row(pn.Spacer(width=10), self.ticker_select),
            self.stats_section,
            pn.pane.Markdown("### Density Plot (KDE)", css_classes=["light-box"]),
            self.density_plot_pane,
            self.density_text,
            pn.pane.Markdown("### Histogram", css_classes=["light-box"]),
            self.histogram_pane,
            self.histogram_text,
            pn.pane.Markdown("### Box Plot", css_classes=["light-box"]),
            self.box_plot_pane,
            self.box_text,
            pn.pane.Markdown("### Violin Plot", css_classes=["light-box"]),
            self.violin_plot_pane,
            self.violin_text,
            pn.pane.Markdown("### Cumulative Distribution Plot (CDF)", css_classes=["light-box"]),
            self.cdf_plot_pane,
            self.cdf_text,
            self.nav_links,
            sizing_mode="stretch_width"
        )

        self._update_all()

    def _get_numeric_tickers(self):
        df = shared_data.df_prices
        if df.empty:
            return []
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        return numeric_cols

    def _compute_stats_table(self, series: pd.Series) -> pd.DataFrame:
        count_val = series.count()
        mean_val = series.mean()
        median_val = series.median()
        std_val = series.std()
        min_val = series.min()
        q1_val = series.quantile(0.25)
        q3_val = series.quantile(0.75)
        max_val = series.max()
        skew_val = series.skew()
        kurt_val = series.kurtosis()

        data = {
            "Statistic": [
                "Count", "Mean", "Median", "Std Dev", "Min", "Q1", "Q3", "Max", "Skewness", "Kurtosis"
            ],
            "Value": [
                count_val, mean_val, median_val, std_val, min_val, q1_val, q3_val, max_val, skew_val, kurt_val
            ]
        }
        return pd.DataFrame(data)

    def _detect_outliers(self, series: pd.Series) -> int:
        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        outliers = series[(series < lower_bound) | (series > upper_bound)]
        return len(outliers)

    def _interpret_distribution(self, mean_val, median_val, skew_val) -> str:
        if skew_val > 0.5:
            skew_desc = "right-skewed (long tail on the right side)"
        elif skew_val < -0.5:
            skew_desc = "left-skewed (long tail on the left side)"
        else:
            skew_desc = "fairly symmetric"

        if mean_val > median_val:
            mm_desc = "the mean is higher than the median, indicating possible high-end outliers."
        elif mean_val < median_val:
            mm_desc = "the mean is lower than the median, indicating possible low-end outliers."
        else:
            mm_desc = "the mean equals the median, suggesting a balanced distribution."

        return f"The distribution appears {skew_desc}, and {mm_desc}"

    def _update_all(self, *events):
        df = shared_data.df_prices
        ticker = self.ticker_select.value

        # Handle no data or invalid ticker
        if df.empty or ticker not in df.columns:
            self.stats_table.value = pd.DataFrame({"Statistic": ["Info"], "Value": ["No data available"]})
            no_data = hv.Text(0.5, 0.5, "No data available", halign="center")
            for pane in [
                self.density_plot_pane,
                self.histogram_pane,
                self.box_plot_pane,
                self.violin_plot_pane,
                self.cdf_plot_pane
            ]:
                pane.object = no_data
            for txt in [
                self.density_text,
                self.histogram_text,
                self.box_text,
                self.violin_text,
                self.cdf_text
            ]:
                txt.object = ""
            return

        # Filter to non-NA data
        series = df[ticker].dropna()
        if series.empty:
            self.stats_table.value = pd.DataFrame({"Statistic": ["Info"], "Value": [f"No valid data for {ticker}"]})
            return

        # Compute stats
        stats_df = self._compute_stats_table(series)
        self.stats_table.value = stats_df.round(2)

        mean_val = stats_df.loc[stats_df["Statistic"] == "Mean", "Value"].values[0]
        median_val = stats_df.loc[stats_df["Statistic"] == "Median", "Value"].values[0]
        skew_val = stats_df.loc[stats_df["Statistic"] == "Skewness", "Value"].values[0]
        dist_comment = self._interpret_distribution(mean_val, median_val, skew_val)
        outlier_count = self._detect_outliers(series)

        # KDE Plot
        density_plot = series.hvplot.kde(
            title=f"Density Plot for {ticker}",
            responsive=True,
            min_height=300,
            label=ticker
        ).opts(show_legend=True)
        self.density_plot_pane.object = density_plot
        self.density_text.object = (
            f"**Interpretation**: This KDE provides a smooth view of {ticker}'s distribution. {dist_comment}"
        )

        # Histogram
        hist_plot = series.hvplot.hist(
            bins=30,
            title=f"Histogram for {ticker}",
            responsive=True,
            min_height=300,
            alpha=0.7,
            label=ticker
        ).opts(show_legend=True)
        self.histogram_pane.object = hist_plot
        self.histogram_text.object = (
            f"**Interpretation**: The histogram shows the frequency of {ticker} values in each bin. {dist_comment}"
        )

        # Box Plot
        box_plot = series.hvplot.box(
            title=f"Box Plot for {ticker}",
            responsive=True,
            min_height=300,
            label=ticker
        ).opts(show_legend=True)
        self.box_plot_pane.object = box_plot
        if outlier_count > 0:
            outlier_msg = f"There are **{outlier_count} outliers** beyond 1.5×IQR."
        else:
            outlier_msg = "No outliers detected beyond 1.5×IQR."
        self.box_text.object = (
            f"**Interpretation**: The box plot reveals Q1, Median, and Q3, with whiskers spanning 1.5×IQR. {outlier_msg}"
        )

        # Violin Plot
        viol_df = pd.DataFrame({'Category': [ticker]*len(series), 'Value': series.values})
        violin_plot = hv.Violin(
            viol_df,
            kdims=['Category'],
            vdims=['Value'],
            label=ticker
        ).opts(
            responsive=True,
            min_height=300,
            tools=["hover"],
            title=f"Violin Plot for {ticker}",
            show_legend=True
        )
        self.violin_plot_pane.object = violin_plot
        self.violin_text.object = (
            "**Interpretation**: The violin plot combines density information with box plot elements, highlighting where data clusters."
        )

        # CDF
        sorted_vals = np.sort(series.values)
        cdf = np.linspace(0, 1, len(sorted_vals))
        cdf_curve = hv.Curve(
            (sorted_vals, cdf),
            kdims=['Value'],
            vdims=['CDF'],
            label=ticker
        ).opts(
            title=f"Cumulative Distribution for {ticker}",
            responsive=True,
            min_height=300,
            tools=["hover"],
            show_legend=True
        )
        self.cdf_plot_pane.object = cdf_curve
        self.cdf_text.object = (
            "**Interpretation**: The CDF shows the proportion of data points below each value. "
            "Steeper segments indicate denser data regions."
        )

    def panel_view(self):
        return self.panel


app4 = Step4UnivariateAnalysisApp()

template4 = pn.template.FastListTemplate(
    title="Univariate Analysis",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app4.panel_view()],
    sidebar=[],
)
template4.servable()