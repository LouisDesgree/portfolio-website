#!/usr/bin/env python3
"""
Universal Data Cleaner and Visualizer
This application loads financial data from shared memory, displays its quality metrics,
and provides strict cleaning to remove any missing or negative values, ensuring a dataset
suitable for AI/ML training. It features:
  - Data quality visualization via a pie chart.
  - A line chart that highlights missing data points.
  - A cleaning process that drops rows with NA or negative values.
  - A before/after comparison of the data quality.
"""

import math
import pandas as pd
import panel as pn
import holoviews as hv
from bokeh.plotting import figure
from bokeh.transform import cumsum
import shared_data

pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')


def classify_rows(df):
    """
    Returns a dictionary with counts for 'Clean', 'NA', and 'Corrupted' rows.
    """
    if df.empty:
        return {'Clean': 0, 'NA': 0, 'Corrupted': 0}
    na_mask = df.isna().any(axis=1)
    corrupted_mask = (df < 0).any(axis=1)
    return {
        'Clean': int((~(na_mask | corrupted_mask)).sum()),
        'NA': int(na_mask.sum()),
        'Corrupted': int(corrupted_mask.sum())
    }


def strict_clean_data(df):
    """
    Removes rows with any missing or negative values.
    """
    cleaned_df = df.dropna(axis=0, how='any')
    cleaned_df = cleaned_df[(cleaned_df >= 0).all(axis=1)]
    return cleaned_df


def create_bokeh_pie(dcounts):
    """
    Creates a Bokeh pie chart to visualize data quality.
    """
    data = pd.Series(dcounts).reset_index(name='value').rename(columns={'index': 'category'})
    total = data['value'].sum()
    data['angle'] = data['value'] / total * 2 * math.pi if total > 0 else 0
    data['color'] = ["#66c2a5", "#fc8d62", "#8da0cb"][:len(data)]
    p = figure(
        height=300,
        title="Data Quality Distribution",
        toolbar_location=None,
        tools="hover",
        tooltips="@category: @value"
    )
    p.wedge(
        x=0, y=1, radius=0.4,
        start_angle=cumsum('angle', include_zero=True),
        end_angle=cumsum('angle'),
        line_color="white", fill_color='color', legend_field='category',
        source=data
    )
    p.axis.axis_label = None
    p.axis.visible = False
    p.grid.grid_line_color = None
    return p


def create_line_chart_with_na(df):
    """
    Creates an overlay of line charts for each ticker with red markers for missing data.
    """
    if df.empty:
        return hv.Overlay([])
    overlays = []
    for ticker in df.columns:
        curve = hv.Curve((df.index, df[ticker]), kdims=["Date"], vdims=[ticker], label=ticker)
        na_mask = df[ticker].isna()
        if na_mask.any():
            non_na_vals = df[ticker].dropna()
            na_y_value = non_na_vals.min() - abs(non_na_vals.min()) * 0.1 if not non_na_vals.empty and non_na_vals.min() != 0 else -1
            scatter = hv.Scatter((df.index[na_mask], [na_y_value] * na_mask.sum()), kdims=["Date"], vdims=["NA"], label=f"{ticker} NA").opts(color="red", marker="triangle_down", size=8)
            overlay = curve * scatter
        else:
            overlay = curve
        overlays.append(overlay)
    return hv.Overlay(overlays).opts(width=700, height=300, tools=["hover"], xlabel="Date", ylabel="Price", title="Line Chart (Missing Data Highlighted)")


class StrictDataCleaningApp(pn.viewable.Viewer):
    """
    Application for strict data cleaning and visualization.
    """
    def __init__(self, **params):
        super().__init__(**params)
        self.refresh_button = pn.widgets.Button(name='Refresh Data', button_type='primary')
        self.refresh_button.on_click(self._refresh_data)
        self.clean_button = pn.widgets.Button(name='Clean Data', button_type='primary')
        self.clean_button.on_click(self._clean_data)
        self.clean_explanation = pn.pane.Markdown(
            """
### Strict Data Cleaning for AI

- Rows with any missing (NA) values are removed.
- Rows with any negative values are removed.
- This ensures a complete and consistent dataset for AI training.
            """,
            css_classes=["light-box"]
        )
        self.output_pane = pn.Column(pn.pane.Markdown("**No data loaded yet.**", css_classes=["light-box"]))
        self.nav_links = pn.Row(
            pn.pane.Markdown("[Back to Step 1](../sp500_data_loader)", css_classes=["light-box"]),
            pn.pane.Markdown("[Proceed to Step 3](../sp500_step3)", css_classes=["light-box"]),
            sizing_mode="stretch_width"
        )
        self.panel = pn.Column(
            pn.pane.Markdown("## Strict Data Cleaning & Visualization", css_classes=["light-box"]),
            pn.Row(self.refresh_button, self.clean_button),
            self.clean_explanation,
            self.output_pane,
            self.nav_links,
            sizing_mode="stretch_width"
        )

    def _refresh_data(self, event):
        df_prices = shared_data.df_prices
        if df_prices.empty:
            self.output_pane.objects = [pn.pane.Markdown("**No data found. Please load data in Step 1 first.**", css_classes=["light-box"])]
            return
        dcounts = classify_rows(df_prices)
        pie_fig = create_bokeh_pie(dcounts)
        start_date_str = df_prices.index.min().strftime("%Y-%m-%d")
        end_date_str = df_prices.index.max().strftime("%Y-%m-%d")
        overlay = create_line_chart_with_na(df_prices)
        self.output_pane.objects = [
            pn.pane.Markdown(f"**Time Frame**: {start_date_str} → {end_date_str}", css_classes=["light-box"]),
            pn.pane.Bokeh(pie_fig, sizing_mode="stretch_width", css_classes=["light-box"]),
            pn.pane.Markdown(f"**Clean**: {dcounts['Clean']}  |  **NA**: {dcounts['NA']}  |  **Corrupted**: {dcounts['Corrupted']}", css_classes=["light-box"]),
            pn.pane.HoloViews(overlay, sizing_mode="stretch_width", css_classes=["light-box"])
        ]

    def _clean_data(self, event):
        df_prices = shared_data.df_prices
        if df_prices.empty:
            self.output_pane.objects = [pn.pane.Markdown("**No data found. Please load data in Step 1 first.**", css_classes=["light-box"])]
            return
        before_clean_counts = classify_rows(df_prices)
        pie_before = create_bokeh_pie(before_clean_counts)
        cleaned_df = strict_clean_data(df_prices)
        shared_data.df_prices = cleaned_df
        after_clean_counts = classify_rows(cleaned_df)
        pie_after = create_bokeh_pie(after_clean_counts)
        cleaned_overlay = create_line_chart_with_na(cleaned_df)
        self.output_pane.objects = [
            pn.pane.Markdown("## Strict Cleaning Process", css_classes=["light-box"]),
            pn.pane.Markdown(
                "Rows with any missing or negative values are removed to ensure data consistency for AI training. Below is a before/after comparison:",
                css_classes=["light-box"]
            ),
            pn.Row(
                pn.Column(pn.pane.Markdown("**Before Cleaning**", css_classes=["light-box"]), pn.pane.Bokeh(pie_before)),
                pn.Column(pn.pane.Markdown("**After Cleaning**", css_classes=["light-box"]), pn.pane.Bokeh(pie_after))
            ),
            pn.pane.Markdown(
                f"**Before**: Clean={before_clean_counts['Clean']}, NA={before_clean_counts['NA']}, Corrupted={before_clean_counts['Corrupted']}<br>"
                f"**After**: Clean={after_clean_counts['Clean']}, NA={after_clean_counts['NA']}, Corrupted={after_clean_counts['Corrupted']}",
                css_classes=["light-box"]
            ),
            pn.pane.Markdown("_Below is a line chart of the cleaned data (all values valid):_", css_classes=["light-box"]),
            pn.pane.HoloViews(cleaned_overlay, sizing_mode="stretch_width", css_classes=["light-box"])
        ]

    def panel_view(self):
        return self.panel

app2 = StrictDataCleaningApp()

template2 = pn.template.FastListTemplate(
    title="Strict Data Cleaning & Visualization",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app2.panel_view()],
    sidebar=[]
)
template2.servable()