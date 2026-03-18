#!/usr/bin/env python3
"""
Title: Interactive S&P 500 Sector Seasonality App
Description:
  - Provides an interactive Panel dashboard to select date range
    and dynamically see "Which sector to invest each month" analysis.
  - Also fetches 10yr yield if desired, but focus is on monthly sector returns.
"""

import os
import pandas as pd
import numpy as np
import yfinance as yf
from datetime import datetime, date
import panel as pn
import holoviews as hv

from pandas_datareader import data as web  # for FRED macro if needed
from bokeh.models import HoverTool

pn.extension()
hv.extension('bokeh')

# 1) Hardcoded sector data (7 tickers)
def load_sector_data():
    data = {
        'Ticker': ['AAPL', 'MSFT', 'XOM', 'JNJ', 'JPM', 'GOOG', 'AMZN'],
        'Sector': [
            'Information Technology',  # AAPL
            'Information Technology',  # MSFT
            'Energy',                  # XOM
            'Health Care',             # JNJ
            'Financials',              # JPM
            'Communication Services',  # GOOG
            'Consumer Discretionary'   # AMZN
        ]
    }
    return pd.DataFrame(data)

# 2) Fetch price data
def fetch_price_data(tickers, start_date, end_date):
    all_data = {}
    for ticker in tickers:
        try:
            df_temp = yf.download(ticker, start=start_date, end=end_date, progress=False, auto_adjust=False)
            if not df_temp.empty and "Adj Close" in df_temp.columns:
                all_data[ticker] = df_temp["Adj Close"]
        except:
            pass
    if not all_data:
        return pd.DataFrame()
    df_prices = pd.concat(all_data.values(), axis=1)
    df_prices.columns = all_data.keys()
    return df_prices

# 3) Compute daily sector returns
def compute_sector_returns(df_prices, df_sectors):
    if df_prices.empty:
        return pd.DataFrame()
    daily_returns = df_prices.pct_change().dropna(how='all')
    if daily_returns.empty:
        return pd.DataFrame()
    ticker_to_sector = dict(zip(df_sectors['Ticker'], df_sectors['Sector']))
    sector_map = {}
    for t, s in ticker_to_sector.items():
        sector_map.setdefault(s, []).append(t)
    sector_returns = {}
    for sector, tlist in sector_map.items():
        valid_tickers = [t for t in tlist if t in daily_returns.columns]
        if valid_tickers:
            sector_returns[sector] = daily_returns[valid_tickers].mean(axis=1)
    return pd.DataFrame(sector_returns).dropna(how='all')

# 4) Seasonality analysis
def analyze_seasonality(df_sector):
    """
    Returns:
      - monthly_avg: DataFrame of shape (12, #sectors) for average monthly returns
      - best_sector_per_month: Series of sector names (length=12)
      - best_return_per_month: Series of best returns (length=12)
    """
    if df_sector.empty:
        return pd.DataFrame(), None, None

    # Convert daily -> monthly
    df_monthly = (1 + df_sector).resample('M').prod() - 1
    df_monthly['Month'] = df_monthly.index.month
    monthly_avg = df_monthly.groupby('Month').mean()  # shape(12, #sectors)
    # Which sector is best each month?
    best_sector_per_month = monthly_avg.idxmax(axis=1)
    best_return_per_month = monthly_avg.max(axis=1)
    return monthly_avg, best_sector_per_month, best_return_per_month

# 5) Panel interactive class
class SectorSeasonalityApp(pn.viewable.Viewer):
    def __init__(self, **params):
        super().__init__(**params)

        self.df_sectors = load_sector_data()

        # Interactive widgets
        self.start_year = pn.widgets.IntSlider(name='Start Year', value=2020, start=2015, end=datetime.now().year)
        self.end_year   = pn.widgets.IntSlider(name='End Year',   value=2023, start=2015, end=datetime.now().year)

        self.run_button = pn.widgets.Button(name='Run Analysis', button_type='primary')

        # Output
        self.output_pane = pn.Column("**Select years and click 'Run Analysis'**")

        # Link button
        self.run_button.on_click(self._run_analysis)

        # Layout
        self.panel = pn.Column(
            pn.Row(self.start_year, self.end_year, self.run_button),
            self.output_pane
        )

    def _run_analysis(self, event):
        # 1) Build start/end from widget
        start_dt = datetime(self.start_year.value, 1, 1)
        end_dt   = datetime(self.end_year.value, 12, 31)

        # 2) Fetch data
        tickers = self.df_sectors['Ticker'].unique().tolist()
        df_prices = fetch_price_data(tickers, start_dt, end_dt)

        if df_prices.empty:
            self.output_pane.objects = ["**No data returned for this date range.**"]
            return

        # 3) Sector returns
        df_sector = compute_sector_returns(df_prices, self.df_sectors)
        if df_sector.empty:
            self.output_pane.objects = ["**No sector returns.**"]
            return

        # 4) Seasonality
        monthly_avg, best_sector, best_return = analyze_seasonality(df_sector)
        if monthly_avg.empty:
            self.output_pane.objects = ["**No monthly data.**"]
            return

        # Build a final string or plot
        # We'll create a single plot for "Which sector to invest each month"
        bars = []
        for month_num in monthly_avg.index:
            ret_val = best_return.loc[month_num] * 100.0
            sec_name = best_sector.loc[month_num]
            bars.append((month_num, ret_val, sec_name))

        # Convert to DataFrame for plotting
        df_bars = pd.DataFrame(bars, columns=['Month','Return','Sector'])

        # We'll use hv.Bars from holoviews
        bars_plot = hv.Bars(df_bars, kdims='Month', vdims='Return').opts(
            width=600, height=400, tools=['hover'], color='green', alpha=0.6,
            title="Best Sector Each Month (Avg Monthly Return)",
        )

        # We'll overlay text labels with the sector name
        labels = hv.Labels(df_bars, kdims=['Month','Return'], vdims='Sector').opts(
            text_font_size='8pt', text_align='center', text_baseline='bottom', yoffset=0.1
        )

        combined_plot = bars_plot * labels

        # Convert to Panel object
        hv_panel = pn.pane.HoloViews(combined_plot, sizing_mode='stretch_width')

        # Show numeric table for monthly_avg
        monthly_table = monthly_avg.style.format("{:.2%}")

        # Combine into output
        self.output_pane.objects = [
            pn.pane.Markdown(f"## Monthly Average Returns (Years {self.start_year.value}-{self.end_year.value})"),
            monthly_table,
            pn.pane.Markdown("## Best Sector Each Month"),
            hv_panel
        ]

    def panel_view(self):
        return self.panel

# Create instance
app = SectorSeasonalityApp()

# If run as script with `panel serve Sp500Interactive.py`, show `app.panel_view()`
# If run in notebook, you can display with `app.panel_view()`
pn.extension()
pn.template.FastListTemplate(
    title="Interactive Sector Seasonality",
    main=[app.panel_view()],
).servable()