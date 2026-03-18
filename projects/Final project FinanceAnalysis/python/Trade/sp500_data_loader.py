#!/usr/bin/env python3
"""
Universal Data Loader
This application allows users to select multiple stock tickers, fetch historical data from Yahoo Finance, and visualize the data with professional charts and summaries.
Features include:
  - Selection of multiple tickers from a predefined list.
  - Option to fetch "All Time" or a custom date range.
  - Visualization of data loading progress via a donut chart.
  - Aggregate multi-ticker line chart with summary statistics.
  - Detailed ticker-specific analysis.
  - Volume data export in both wide and long formats.
"""

import math
import pandas as pd
import yfinance as yf
from datetime import datetime
import panel as pn
import holoviews as hv
from bokeh.plotting import figure
from bokeh.transform import cumsum
from bokeh.palettes import Category20
import shared_data

pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')

POPULAR_TICKERS = [
    "AAPL", "MSFT", "AMZN", "GOOG", "TSLA", "META", "NVDA", "NFLX", "JPM", "JNJ",
    "XOM", "V", "WMT", "PG", "BAC", "DIS", "HD", "INTC", "CSCO", "VZ",
    "PFE", "T", "PEP", "COST", "ADBE", "CRM", "ABBV", "ACN", "AVGO", "ABNB",
    "AMD", "CMCSA", "KO", "ORCL", "MRK", "TMO", "C", "CVX", "MCD", "UPS"
]

pn.config.raw_css.append("""
body {
    background-color: #F0F0F0;
    color: #333333;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.pn-template-main {
    background-color: #FFFFFF;
    color: #333333;
}
.pn-template-header {
    background-color: #FF9500;
    color: #FFFFFF;
}
.bk-btn {
    background-color: #4169E1 !important;
    color: #FFFFFF !important;
    border: none;
    border-radius: 6px;
    font-weight: bold;
}
.bk-slider .bk-noUi-handle {
    background: #FF3B30 !important;
    border: none;
}
.bk-slider .bk-noUi-connect {
    background: #34C759 !important;
}
.light-box {
    background-color: #FFFFFF;
    border-radius: 8px;
    padding: 10px;
    margin: 10px 0;
}
.pn-markdown {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 10px;
    color: #333333;
}
""")

class UniversalDataLoaderApp(pn.viewable.Viewer):
    """
    Universal Data Loader Application
    Provides functionality for loading and visualizing financial data.
    """
    def __init__(self, **params):
        super().__init__(**params)
        self.ticker_choice = pn.widgets.MultiChoice(
            name="Select Tickers",
            options=POPULAR_TICKERS,
            value=[]
        )
        self.time_range_select = pn.widgets.RadioButtonGroup(
            name="Time Range",
            options=["All Time", "Custom Range"],
            value="Custom Range"
        )
        self.start_date = pn.widgets.DatePicker(name='Start Date', value=datetime(2021, 1, 1))
        self.end_date   = pn.widgets.DatePicker(name='End Date', value=datetime(2022, 1, 1))
        self.load_button = pn.widgets.Button(name='Load Data', button_type='primary')
        self.load_button.on_click(self._on_load_data_click)
        self.df_prices = pd.DataFrame()
        self.loaded_tickers_rows = {}
        self.section1_plot_pane = pn.pane.Bokeh(sizing_mode="stretch_width")
        self.section1_text = pn.pane.Markdown(
            "**Select tickers & date range, then click 'Load Data'**",
            css_classes=["light-box"]
        )
        self.section1 = pn.Column(
            pn.pane.Markdown("## Data Loading Overview", css_classes=["light-box"]),
            self.section1_plot_pane,
            self.section1_text,
            css_classes=["light-box"]
        )
        self.section2 = pn.Column(
            pn.pane.Markdown("## Aggregate Price Chart & Summary", css_classes=["light-box"]),
            pn.pane.Markdown("_No data loaded yet._", css_classes=["light-box"])
        )
        self.ticker_isolation_select = pn.widgets.MultiSelect(
            name='Select Tickers for Detailed Analysis',
            options=[],
            value=[],
            size=8
        )
        self.ticker_isolation_select.param.watch(self._update_isolated_view, 'value')
        self.section3_output = pn.Row(
            pn.pane.Markdown("**No data loaded yet.**", css_classes=["light-box"], width=600)
        )
        self.section3 = pn.Column(
            pn.pane.Markdown("## Individual Ticker Analysis", css_classes=["light-box"]),
            self.ticker_isolation_select,
            self.section3_output
        )
        controls = pn.Row(
            pn.Column(
                pn.pane.Markdown("### Ticker & Date Selection", css_classes=["light-box"]),
                self.ticker_choice,
                self.time_range_select,
                self.start_date,
                self.end_date,
                self.load_button,
                css_classes=["light-box"]
            )
        )
        link_to_step2 = pn.pane.Markdown("[Go to Step 2](../sp500_step2)", css_classes=["light-box"])
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
        Loads historical data for selected tickers based on the chosen date range.
        Downloads data from Yahoo Finance and updates all visualizations.
        Exports both adjusted close and volume data to CSV files.
        """
        chosen_tickers = self.ticker_choice.value
        if not chosen_tickers:
            self.section1_text.object = "**No tickers selected. Please pick from the dropdown.**"
            return
        self.df_prices = pd.DataFrame()
        self.loaded_tickers_rows.clear()
        self.section1_text.object = "**Fetching data...**"
        self.section1_plot_pane.object = None
        all_data_adj_close = {}
        all_data_volume = {}
        def progress_callback(current_idx, total, ticker, row_count):
            self.loaded_tickers_rows[ticker] = row_count
            self._update_donut_chart()
            self.section1_text.object = (
                f"**Fetching Ticker:** `{ticker}` ({current_idx}/{total}) — {row_count} rows"
            )
        total = len(chosen_tickers)
        for i, ticker in enumerate(chosen_tickers):
            row_count = 0
            try:
                if self.time_range_select.value == "All Time":
                    df_temp = yf.download(
                        ticker,
                        period="max",
                        progress=False,
                        auto_adjust=False
                    )
                else:
                    df_temp = yf.download(
                        ticker,
                        start=self.start_date.value,
                        end=self.end_date.value,
                        progress=False,
                        auto_adjust=False
                    )
                if not df_temp.empty and "Adj Close" in df_temp.columns:
                    all_data_adj_close[ticker] = df_temp["Adj Close"]
                    if "Volume" in df_temp.columns:
                        all_data_volume[ticker] = df_temp["Volume"]
                    row_count = len(df_temp)
            except Exception as e:
                print(f"Error fetching data for {ticker}: {e}")
            progress_callback(i + 1, total, ticker, row_count)
        if not all_data_adj_close:
            self.section1_text.object = "**No data returned for these tickers/date range.**"
            self.section2.objects = [
                pn.pane.Markdown("## Aggregate Price Chart & Summary", css_classes=["light-box"]),
                pn.pane.Markdown("_No data loaded._", css_classes=["light-box"])
            ]
            self.section3_output.objects = [
                pn.pane.Markdown("**No data loaded yet.**", css_classes=["light-box"])
            ]
            return
        df_prices = pd.concat(all_data_adj_close.values(), axis=1)
        df_prices.columns = all_data_adj_close.keys()
        self.df_prices = df_prices.copy()
        shared_data.df_prices = df_prices.copy()
        if all_data_volume:
            df_volume = pd.concat(all_data_volume.values(), axis=1)
            df_volume.columns = all_data_volume.keys()
            df_volume.to_csv("financial_data_volume_wide.csv", index=True)
            print("Saved volume data (wide format) to financial_data_volume_wide.csv")
            df_volume.index.name = "Date"
            df_long_vol = df_volume.reset_index().melt(
                id_vars="Date",
                var_name="Ticker",
                value_name="Volume"
            )
            df_long_vol.to_csv("financial_data_long_volume.csv", index=False)
            print("Saved melted volume data to financial_data_long_volume.csv")
        df_prices.index.name = "Date"
        df_long_price = df_prices.reset_index().melt(
            id_vars="Date",
            var_name="Ticker",
            value_name="Price"
        )
        df_long_price.to_csv("financial_data_long_prices.csv", index=False)
        print("Saved melted price data to financial_data_long_prices.csv")
        self.section1_text.object = "**Data loading complete!**"
        self._update_donut_chart()
        self._update_section2(df_prices)
        self.ticker_isolation_select.options = list(df_prices.columns)
        self.ticker_isolation_select.value = list(df_prices.columns)
        self._update_isolated_view(None)

    def _update_donut_chart(self):
        """
        Updates the donut chart to display the number of rows fetched per ticker.
        """
        if not self.loaded_tickers_rows:
            self.section1_plot_pane.object = None
            return
        df_counts = pd.DataFrame({
            'Ticker': list(self.loaded_tickers_rows.keys()),
            'Rows': list(self.loaded_tickers_rows.values())
        })
        total_rows = df_counts['Rows'].sum()
        df_counts['angle'] = df_counts['Rows'] / total_rows * 2 * math.pi
        color_list = Category20[20] if len(df_counts) <= 20 else Category20[20]*2
        df_counts['color'] = [color_list[i % len(color_list)] for i in range(len(df_counts))]
        p = figure(
            width=400,
            height=350,
            title="Rows per Ticker",
            toolbar_location=None,
            tools="hover",
            tooltips="@Ticker: @Rows"
        )
        p.annular_wedge(
            x=0, y=1,
            inner_radius=0.2,
            outer_radius=0.3,
            start_angle=cumsum('angle', include_zero=True),
            end_angle=cumsum('angle'),
            line_color="white",
            fill_color='color',
            legend_field='Ticker',
            source=df_counts
        )
        p.legend.location = "top_left"
        self.section1_plot_pane.object = p

    def _update_section2(self, df_prices):
        """
        Displays the aggregate multi-ticker line chart along with summary statistics.
        """
        curves = []
        for ticker in df_prices.columns:
            curve = hv.Curve((df_prices.index, df_prices[ticker]),
                             kdims=["Date"], vdims=[ticker], label=ticker)
            curves.append(curve)
        overlay = hv.Overlay(curves).opts(
            width=600, height=400, tools=['hover'],
            title="Aggregate Adjusted Close Prices",
            xlabel="Date", ylabel="Price (USD)",
            legend_position='top_left'
        )
        chart_pane = pn.pane.HoloViews(overlay, sizing_mode="stretch_width")
        num_rows = len(df_prices)
        start_str = df_prices.index.min().strftime("%Y-%m-%d")
        end_str   = df_prices.index.max().strftime("%Y-%m-%d")
        summary_text = (
            f"**Loaded {num_rows} total rows**\n\n"
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
            pn.pane.Markdown("## Aggregate Price Chart & Summary", css_classes=["light-box"]),
            pn.Row(chart_pane, text_pane)
        ]

    def _update_isolated_view(self, event):
        """
        Updates the individual ticker analysis view, showing isolated charts and recent data.
        """
        if self.df_prices.empty:
            self.section3_output.objects = [
                pn.pane.Markdown("**No data loaded yet.**", css_classes=["light-box"])
            ]
            return
        selected = self.ticker_isolation_select.value
        if not selected:
            self.section3_output.objects = [
                pn.pane.Markdown("**No tickers selected.**", css_classes=["light-box"])
            ]
            return
        df_selected = self.df_prices[selected]
        curves = []
        for ticker in df_selected.columns:
            curve = hv.Curve((df_selected.index, df_selected[ticker]),
                             kdims=["Date"], vdims=[ticker], label=ticker)
            curves.append(curve)
        overlay = hv.Overlay(curves).opts(
            width=600, height=400, tools=['hover'],
            title="Detailed Adjusted Close Prices",
            xlabel="Date", ylabel="Price (USD)",
            legend_position='top_left'
        )
        chart_pane = pn.pane.HoloViews(overlay, sizing_mode="stretch_width")
        detail_df = df_selected.tail(5)
        detail_text = (
            f"**Selected Tickers:** {', '.join(selected)}\n\n"
            f"Latest 5 rows of data are shown below."
        )
        text_pane = pn.Column(
            pn.pane.Markdown(detail_text, css_classes=["light-box"]),
            pn.pane.DataFrame(detail_df, width=400, height=200, css_classes=["light-box"])
        )
        self.section3_output.objects = [pn.Row(chart_pane, text_pane)]

    def panel_view(self):
        """Returns the main layout for serving the application."""
        return self.panel

app = UniversalDataLoaderApp()

template = pn.template.FastListTemplate(
    title="Universal Data Loader",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app.panel_view()],
    sidebar=[],
)
template.servable()