#!/usr/bin/env python3
"""
Title: Step 2 (Second Page) - Strict Cleaning
Description:
  - Reads the data from shared_data.df_prices (populated by sp500_data_loader.py).
  - "Refresh Data" button: loads the current DataFrame from Step 1.
  - Displays time frame, a pie chart of Clean/NA/Corrupted, and a line chart 
    with red markers for NA at a y-offset so they're clearly visible.
  - "Clean Data" button: removes NA/negative rows **across all columns** so that
    the AI/ML model sees no missing or invalid values.
  - Shows a before/after comparison and also displays a second chart for the cleaned data.

Why Strict Cleaning for AI:
  - Any NA or invalid (negative) values in **any** column can break or mislead the AI.
  - We therefore remove rows with NA in *any* column, plus rows with negative prices.
  - This ensures the final dataset is 100% complete for every variable used by the model.
"""

import math
import pandas as pd
import panel as pn
import holoviews as hv
from bokeh.plotting import figure
from bokeh.transform import cumsum

import shared_data  # The shared data module

pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')


def classify_rows(df):
    """
    Returns a dict with counts for 'Clean', 'NA', 'Corrupted'.
      - 'NA': any row with missing data in any column
      - 'Corrupted': any row with negative price(s) in any column
      - 'Clean': everything else
    """
    if df.empty:
        return {'Clean': 0, 'NA': 0, 'Corrupted': 0}
    
    na_mask = df.isna().any(axis=1)
    corrupted_mask = (df < 0).any(axis=1)

    na_count = na_mask.sum()
    corrupted_count = corrupted_mask.sum()
    clean_count = (~(na_mask | corrupted_mask)).sum()

    return {
        'Clean': int(clean_count),
        'NA': int(na_count),
        'Corrupted': int(corrupted_count)
    }


def strict_clean_data(df):
    """
    Strictly cleans the data by removing rows with NA or negative values
    in *any* column. This ensures there are absolutely no missing/invalid
    entries in any variable used by the AI model.
    """
    # 1) Drop rows with NA in *any* column
    cleaned_df = df.dropna(axis=0, how='any')

    # 2) Drop rows where any column has negative values
    cleaned_df = cleaned_df[(cleaned_df >= 0).all(axis=1)]

    return cleaned_df


def create_bokeh_pie(dcounts):
    """
    Creates a Bokeh figure with wedge glyphs for a pie chart.
    dcounts is a dict like {'Clean': 100, 'NA': 20, 'Corrupted': 5}.
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
    Creates a Holoviews Overlay with:
      - A line chart for each ticker
      - Red scatter points for NA, placed at a y-offset so they're easily visible.
    """
    if df.empty:
        return hv.Overlay([])

    overlays = []
    for ticker in df.columns:
        # Main line
        curve = hv.Curve(
            (df.index, df[ticker]),
            kdims=["Date"], vdims=[ticker],
            label=ticker
        )
        # Identify NA points
        na_mask = df[ticker].isna()
        if na_mask.any():
            non_na_vals = df[ticker].dropna()
            if not non_na_vals.empty:
                min_price = non_na_vals.min()
                na_y_value = min_price - abs(min_price)*0.1 if min_price != 0 else -1
            else:
                na_y_value = -1

            scatter = hv.Scatter(
                (df.index[na_mask], [na_y_value] * na_mask.sum()),
                kdims=["Date"], vdims=["NA"],
                label=f"{ticker} NA"
            ).opts(color="red", marker="triangle_down", size=8)
            overlay = curve * scatter
        else:
            overlay = curve

        overlays.append(overlay)

    return hv.Overlay(overlays).opts(
        width=700, height=300,
        tools=["hover"],
        xlabel="Date", ylabel="Price",
        title="Line Chart (NA in Red Triangles)"
    )


class Step2StrictCleaningApp(pn.viewable.Viewer):
    """
    Uses shared_data.df_prices from Step 1 and:
      - A "Refresh Data" button to load the current DataFrame.
      - Displays the time frame, a pie chart for Clean/NA/Corrupted,
        and a line chart highlighting NA in red at a y-offset.
      - A "Clean Data" button removing NA/negative rows in *any* column,
        ensuring the AI sees no missing or invalid data whatsoever.
      - Shows a before/after comparison of the data distribution,
        plus a separate line chart for the cleaned data.
    """
    def __init__(self, **params):
        super().__init__(**params)

        # Buttons
        self.refresh_button = pn.widgets.Button(name='Refresh Data', button_type='primary')
        self.refresh_button.on_click(self._refresh_data)

        self.clean_button = pn.widgets.Button(name='Clean Data', button_type='primary')
        self.clean_button.on_click(self._clean_data)

        # Explanation
        self.clean_explanation = pn.pane.Markdown(
            """
### Strict Data Cleaning for AI

- We **drop any row** that has a missing (NA) value in **any** column.
- We **drop any row** that has a negative price in **any** column.
- This guarantees a 100% complete dataset for all variables, so the AI won't see any invalid or missing points.

**Why do this?**
1. **AI Models** can fail or produce nonsense results if even one variable has missing or invalid data.
2. By strictly removing these rows, we ensure the entire dataset is consistent and valid.
3. It can reduce the dataset size, but the remaining data is much safer for AI training.
            """,
            css_classes=["light-box"]
        )

        # Output area
        self.output_pane = pn.Column(
            pn.pane.Markdown("**No data loaded yet.**", css_classes=["light-box"])
        )

        # Navigation links: Back to Step 1 and Proceed to Step 3
        self.nav_links = pn.Row(
            pn.pane.Markdown("[Back to Step 1](../sp500_data_loader)", css_classes=["light-box"]),
            pn.pane.Markdown("[Proceed to Step 3](../sp500_step3)", css_classes=["light-box"]),
            sizing_mode="stretch_width"
        )

        # Layout
        self.panel = pn.Column(
            pn.pane.Markdown("## Step 2: Strict Data Cleaning & Visualization", css_classes=["light-box"]),
            pn.Row(self.refresh_button, self.clean_button),
            self.clean_explanation,
            self.output_pane,
            self.nav_links,
            sizing_mode="stretch_width"
        )

    def _refresh_data(self, event):
        """
        Manually refresh the data from shared_data.df_prices and display:
          - Time frame
          - Pie chart for data quality
          - Line chart with NA in red
        """
        df_prices = shared_data.df_prices
        if df_prices.empty:
            self.output_pane.objects = [
                pn.pane.Markdown("**No data found. Please load data in Step 1 first.**", css_classes=["light-box"])
            ]
            return

        dcounts = classify_rows(df_prices)
        pie_fig = create_bokeh_pie(dcounts)

        # Time frame
        start_date_str = df_prices.index.min().strftime("%Y-%m-%d")
        end_date_str   = df_prices.index.max().strftime("%Y-%m-%d")

        # Line chart with red NA markers
        overlay = create_line_chart_with_na(df_prices)

        self.output_pane.objects = [
            pn.pane.Markdown(f"**Time Frame**: {start_date_str} → {end_date_str}", css_classes=["light-box"]),
            pn.pane.Bokeh(pie_fig, sizing_mode="stretch_width", css_classes=["light-box"]),
            pn.pane.Markdown(
                f"**Clean**: {dcounts['Clean']}  |  **NA**: {dcounts['NA']}  |  **Corrupted**: {dcounts['Corrupted']}",
                css_classes=["light-box"]
            ),
            pn.pane.HoloViews(overlay, sizing_mode="stretch_width", css_classes=["light-box"])
        ]

    def _clean_data(self, event):
        """
        Clean the data by removing rows with NA or negative values in ANY column.
        Display a before/after comparison (pie charts + stats),
        plus a separate line chart for the cleaned data.
        """
        df_prices = shared_data.df_prices
        if df_prices.empty:
            self.output_pane.objects = [
                pn.pane.Markdown("**No data found. Please load data in Step 1 first.**", css_classes=["light-box"])
            ]
            return

        # Before cleaning
        before_clean_counts = classify_rows(df_prices)
        pie_before = create_bokeh_pie(before_clean_counts)

        # Strict Clean
        cleaned_df = strict_clean_data(df_prices)
        # Overwrite the global data with the cleaned version
        shared_data.df_prices = cleaned_df

        # After cleaning
        after_clean_counts = classify_rows(cleaned_df)
        pie_after = create_bokeh_pie(after_clean_counts)

        # Also show a line chart of the cleaned data (no NA or negative)
        cleaned_overlay = create_line_chart_with_na(cleaned_df)

        self.output_pane.objects = [
            pn.pane.Markdown("## Strict Cleaning Process", css_classes=["light-box"]),
            pn.pane.Markdown(
                "We remove rows that contain **any NA** or **any negative** values in any column.\n"
                "This ensures a fully valid dataset for AI training.\n"
                "Below is the **before** and **after** comparison:",
                css_classes=["light-box"]
            ),
            pn.Row(
                pn.Column(
                    pn.pane.Markdown("**Before Cleaning**", css_classes=["light-box"]),
                    pn.pane.Bokeh(pie_before)
                ),
                pn.Column(
                    pn.pane.Markdown("**After Cleaning**", css_classes=["light-box"]),
                    pn.pane.Bokeh(pie_after)
                )
            ),
            pn.pane.Markdown(
                f"**Before**: Clean={before_clean_counts['Clean']}, "
                f"NA={before_clean_counts['NA']}, Corrupted={before_clean_counts['Corrupted']}<br>"
                f"**After**: Clean={after_clean_counts['Clean']}, "
                f"NA={after_clean_counts['NA']}, Corrupted={after_clean_counts['Corrupted']}",
                css_classes=["light-box"]
            ),
            pn.pane.Markdown("_Below is a line chart of the **cleaned** data (no NA or negative values):_", css_classes=["light-box"]),
            pn.pane.HoloViews(cleaned_overlay, sizing_mode="stretch_width", css_classes=["light-box"])
        ]

    def panel_view(self):
        return self.panel

# -----------------------------------------------------------------------------
# Serve Step 2
# -----------------------------------------------------------------------------
app2 = Step2StrictCleaningApp()
template2 = pn.template.FastListTemplate(
    title="Step 2: Strict Data Cleaning & Visualization",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app2.panel_view()],
    sidebar=[],
)
template2.servable()