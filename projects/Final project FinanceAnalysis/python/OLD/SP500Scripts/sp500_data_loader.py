#!/usr/bin/env python3
"""
Title: S&P 500 Data Loader (3 Sections) - Step 1 (Pivoting in Python)
Description:
  - Section 1: A bar chart of how many data points each ticker returned,
    plus a progress bar and real-time text updates.
  - Section 2: Overall multi-ticker line chart + summary.
  - Section 3: Ticker isolation for a second chart + details.
  - After data loads, we store it in shared_data.df_prices for Step 2 to use.
  - Additionally, we "melt" the DataFrame to long format and export to CSV,
    so Tableau can read it as (Date, Ticker, Price) automatically.
"""

import math
import pandas as pd
import yfinance as yf
from datetime import datetime
import panel as pn
import holoviews as hv

# Import the shared data module
import shared_data

pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')

# -----------------------------------------------------------------------------
# Custom CSS (Light Theme)
# -----------------------------------------------------------------------------
pn.config.raw_css.append("""
/* Overall light background and dark text */
body {
    background-color: #F0F0F0;
    color: #333333;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

/* Main Panel content background */
.pn-template-main {
    background-color: #FFFFFF;
    color: #333333;
}

/* Header styling */
.pn-template-header {
    background-color: #FF9500;  /* Apple bright orange */
    color: #FFFFFF;
}

/* Button styling */
.bk-btn {
    background-color: #4169E1 !important;  /* Royal Blue */
    color: #FFFFFF !important;
    border: none;
    border-radius: 6px;
    font-weight: bold;
}

/* Slider styling */
.bk-slider .bk-noUi-handle {
    background: #FF3B30 !important;  /* Red */
    border: none;
}
.bk-slider .bk-noUi-connect {
    background: #34C759 !important;  /* Green */
}

/* Rounded container for components */
.light-box {
    background-color: #FFFFFF;
    border-radius: 8px;
    padding: 10px;
    margin: 10px 0;
}

/* Markdown text adjustments */
.pn-markdown {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 10px;
    color: #333333;
}
""")

# -----------------------------------------------------------------------------
# Data Fetching
# -----------------------------------------------------------------------------
def fetch_price_data(tickers, start_date, end_date, progress_callback=None):
    """
    Fetches historical daily price data for each ticker using 'Adj Close'.
    Ensures auto_adjust=False so 'Adj Close' is returned.

    If progress_callback is provided, it's called after each ticker is fetched:
      progress_callback(current_idx, total, ticker, row_count)
    """
    all_data = {}
    total = len(tickers)
    for i, ticker in enumerate(tickers):
        row_count = 0
        try:
            df_temp = yf.download(
                ticker,
                start=start_date,
                end=end_date,
                progress=False,
                auto_adjust=False
            )
            if not df_temp.empty and "Adj Close" in df_temp.columns:
                all_data[ticker] = df_temp["Adj Close"]
                row_count = len(df_temp)
        except Exception as e:
            print(f"Error fetching data for {ticker}: {e}")

        if progress_callback:
            progress_callback(i + 1, total, ticker, row_count)

    if not all_data:
        return pd.DataFrame()

    df_prices = pd.concat(all_data.values(), axis=1)
    df_prices.columns = all_data.keys()
    return df_prices

# -----------------------------------------------------------------------------
# Main 3-Section App
# -----------------------------------------------------------------------------
class SP500DashboardThreeSections(pn.viewable.Viewer):
    """
    3 Sections:
      Section 1: 
        - A bar chart of "number of data points" per ticker as they're loaded.
        - A progress bar and real-time text updates.
      Section 2: 
        - Overall multi-ticker line chart + summary.
      Section 3:
        - Ticker isolation with MultiSelect for a second chart + details.

    After data loads, we store it in shared_data.df_prices for Step 2 to use.

    NEW: We also pivot (melt) the wide df_prices into a long DataFrame
    (Date, Ticker, Price) and save to a CSV for easy Tableau import.
    """
    def __init__(self, **params):
        super().__init__(**params)

        # Example tickers
        self.tickers = ['AAPL', 'MSFT', 'XOM', 'JNJ', 'JPM', 'GOOG', 'AMZN']

        # Date pickers & Load button
        self.start_date = pn.widgets.DatePicker(name='Start Date', value=datetime(2020, 1, 1))
        self.end_date   = pn.widgets.DatePicker(name='End Date',   value=datetime(2021, 1, 1))
        self.load_button = pn.widgets.Button(name='Load Data', button_type='primary')
        self.load_button.on_click(self._on_load_data_click)

        # Data
        self.df_prices = pd.DataFrame()

        # Section 1
        self.loaded_tickers_rows = {}
        self.section1_graph_pane = pn.pane.HoloViews(sizing_mode="stretch_width")
        self.section1_progress = pn.widgets.Progress(
            name="Progress", value=0, max=100, bar_color='info',
            sizing_mode="stretch_width"
        )
        self.section1_text = pn.pane.Markdown("**Click 'Load Data' to begin.**", css_classes=["light-box"])
        self.section1 = pn.Column(
            pn.pane.Markdown("## Section 1: Loading Visualization", css_classes=["light-box"]),
            self.section1_graph_pane,
            self.section1_text,
            self.section1_progress,
            css_classes=["light-box"]
        )

        # Section 2
        self.section2 = pn.Column(
            pn.pane.Markdown("## Section 2: Overall Chart + Summary", css_classes=["light-box"]),
            pn.pane.Markdown("_No data loaded yet._", css_classes=["light-box"]),
        )

        # Section 3
        self.ticker_select = pn.widgets.MultiSelect(
            name='Select Tickers to Isolate',
            options=self.tickers, 
            value=self.tickers,
            size=5
        )
        self.ticker_select.param.watch(self._update_isolated_view, 'value')

        self.section3_output = pn.Row(
            pn.pane.Markdown("**No data loaded yet.**", css_classes=["light-box"], width=600)
        )
        self.section3 = pn.Column(
            pn.pane.Markdown("## Section 3: Ticker Isolation", css_classes=["light-box"]),
            self.ticker_select,
            self.section3_output
        )

        # Controls
        controls = pn.Row(
            pn.Column(
                pn.pane.Markdown("### Select Date Range", css_classes=["light-box"]),
                self.start_date, self.end_date, self.load_button,
                css_classes=["light-box"]
            )
        )

        # A link to Step 2 in the main layout
        link_to_step2 = pn.pane.Markdown(
            "[Go to Step 2](../sp500_step2)",
            css_classes=["light-box"]
        )

        self.panel = pn.Column(
            controls,
            self.section1,
            self.section2,
            self.section3,
            link_to_step2,
            sizing_mode="stretch_width"
        )

    def _on_load_data_click(self, event):
        """
        1) Fetch data for the user-chosen tickers & date range
        2) Update UI sections
        3) Pivot (melt) the wide df_prices into a long DataFrame
        4) Save to CSV for Tableau
        """
        self.df_prices = pd.DataFrame()
        self.loaded_tickers_rows.clear()

        self.section1_progress.value = 0
        self.section1_text.object = "**Fetching data...**"
        self._update_section1_graph()

        def progress_callback(current_idx, total, ticker, row_count):
            self.loaded_tickers_rows[ticker] = row_count
            self._update_section1_graph()
            pct = int((current_idx / total) * 100)
            self.section1_progress.value = pct
            self.section1_text.object = f"**Fetching Ticker:** `{ticker}` ({current_idx}/{total}) — {row_count} rows"

        # 1) Fetch data
        df_prices = fetch_price_data(
            self.tickers,
            self.start_date.value,
            self.end_date.value,
            progress_callback=progress_callback
        )
        self.df_prices = df_prices

        # 2) Store data in shared_data so Step 2 can read it
        shared_data.df_prices = df_prices.copy()

        if df_prices.empty:
            self.section1_text.object = "**No data returned for the selected period.**"
            self.section2.objects = [
                pn.pane.Markdown("## Section 2: Overall Chart + Summary", css_classes=["light-box"]),
                pn.pane.Markdown("_No data loaded._", css_classes=["light-box"])
            ]
            self.section3_output.objects = [pn.pane.Markdown("**No data loaded yet.**", css_classes=["light-box"])]
            return

        # Data loaded
        self.section1_text.object = "**Data loading complete!**"

        # 3) Pivot (melt) wide -> long
        #    "Date" is the index, so let's reset it to a column
        df_prices.index.name = "Date"
        df_long = df_prices.reset_index().melt(
            id_vars="Date",       # keep "Date" as is
            var_name="Ticker",    # new column for ticker names
            value_name="Price"    # new column for values
        )

        # 4) Save to CSV for Tableau
        df_long.to_csv("financial_data_long.csv", index=False)
        print("Saved melted data to financial_data_long.csv")

        # Now update the UI with the usual sections
        self._update_section2(df_prices)
        self.ticker_select.options = list(df_prices.columns)
        self.ticker_select.value = list(df_prices.columns)
        self._update_isolated_view(None)

    def _update_section1_graph(self):
        if not self.loaded_tickers_rows:
            self.section1_graph_pane.object = hv.Bars([])
            return
        data = pd.DataFrame({
            'Ticker': list(self.loaded_tickers_rows.keys()),
            'RowCount': list(self.loaded_tickers_rows.values())
        })
        bars = hv.Bars(data, kdims='Ticker', vdims='RowCount').opts(
            width=600, height=300,
            title="Number of Data Points per Ticker (Fetched so far)",
            xlabel="Ticker", ylabel="Row Count",
            tools=['hover'],
            color='blue'
        )
        self.section1_graph_pane.object = bars

    def _update_section2(self, df_prices):
        # Plot the wide format in Panel/HoloViews for our Step 2 view
        curves = []
        for ticker in df_prices.columns:
            curve = hv.Curve((df_prices.index, df_prices[ticker]),
                             kdims=["Date"], vdims=[ticker], label=ticker)
            curves.append(curve)
        overlay = hv.Overlay(curves).opts(
            width=600, height=400, tools=['hover'],
            title="All Tickers (Adj Close)",
            xlabel="Date", ylabel="Price (USD)",
            legend_position='top_left'
        )
        chart_pane = pn.pane.HoloViews(overlay, sizing_mode="stretch_width")

        num_rows = len(df_prices)
        start_str = df_prices.index.min().strftime("%Y-%m-%d")
        end_str   = df_prices.index.max().strftime("%Y-%m-%d")
        summary_text = (
            f"**Loaded {num_rows} rows**\n\n"
            f"- **Date Range:** {start_str} to {end_str}\n"
            f"- **Tickers:** {', '.join(df_prices.columns)}\n"
        )
        last_row_df = df_prices.iloc[[-1]].T
        last_row_df.columns = ["Last Price"]

        text_pane = pn.Column(
            pn.pane.Markdown(summary_text, css_classes=["light-box"]),
            pn.pane.DataFrame(last_row_df, width=300, height=250, css_classes=["light-box"])
        )

        self.section2.objects = [
            pn.pane.Markdown("## Section 2: Overall Chart + Summary", css_classes=["light-box"]),
            pn.Row(chart_pane, text_pane)
        ]

    def _update_isolated_view(self, event):
        if self.df_prices.empty:
            self.section3_output.objects = [
                pn.pane.Markdown("**No data loaded yet.**", css_classes=["light-box"])
            ]
            return
        selected_tickers = self.ticker_select.value
        if not selected_tickers:
            self.section3_output.objects = [
                pn.pane.Markdown("**No tickers selected.**", css_classes=["light-box"])
            ]
            return
        df_selected = self.df_prices[selected_tickers]
        curves = []
        for ticker in df_selected.columns:
            curve = hv.Curve((df_selected.index, df_selected[ticker]),
                             kdims=["Date"], vdims=[ticker], label=ticker)
            curves.append(curve)
        overlay = hv.Overlay(curves).opts(
            width=600, height=400, tools=['hover'],
            title="Isolated Tickers (Adj Close)",
            xlabel="Date", ylabel="Price (USD)",
            legend_position='top_left'
        )
        chart_pane = pn.pane.HoloViews(overlay, sizing_mode="stretch_width")

        detail_df = df_selected.tail(5)
        detail_text = (
            f"**Selected Tickers:** {', '.join(selected_tickers)}\n\n"
            f"Below are the **last 5 rows** of data for these tickers."
        )
        text_pane = pn.Column(
            pn.pane.Markdown(detail_text, css_classes=["light-box"]),
            pn.pane.DataFrame(detail_df, width=400, height=200, css_classes=["light-box"])
        )

        self.section3_output.objects = [pn.Row(chart_pane, text_pane)]

    def panel_view(self):
        return self.panel


# -----------------------------------------------------------------------------
# Serve
# -----------------------------------------------------------------------------
app = SP500DashboardThreeSections()

template = pn.template.FastListTemplate(
    title="S&P 500 Loader (Pivot in Python) - Step 1",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app.panel_view()],
    sidebar=[],
)
template.servable()