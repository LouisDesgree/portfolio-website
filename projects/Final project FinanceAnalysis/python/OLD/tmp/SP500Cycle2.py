#!/usr/bin/env python3
"""
Title: Light Themed Interactive S&P 500 Sector Cycle Dashboard
Description:
  - Provides an interactive Panel dashboard with a light background.
  - Overall background is white/light gray with dark text.
  - Components (buttons, sliders, panels, graphs) use bright accents:
      - Header: apple orange
      - Buttons: royal blue
      - Slider handle: red
      - Slider connect: green
      - Forecast bars: royal blue
  - Users can select the training range for the AI and the prediction year.
  - Forecasts display detailed YYYY-MM information and appear at the top.
  - A second chart shows backtesting performance (forecast accuracy).
"""

import os
import calendar
import pandas as pd
import numpy as np
import yfinance as yf
from datetime import datetime
from dateutil.relativedelta import relativedelta
import panel as pn
import holoviews as hv

from pandas_datareader import data as web  # For FRED macro if needed

# Initialize Panel and Holoviews extensions
pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')

# -----------------------------------------------------------------------------
# Custom CSS for a Light Themed UI with White/Light Gray Backgrounds and Apple Bright Accents
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
# 1) Hardcoded Sector Data
# -----------------------------------------------------------------------------
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

# -----------------------------------------------------------------------------
# 2) Fetch Price Data from Yahoo Finance
# -----------------------------------------------------------------------------
def fetch_price_data(tickers, start_date, end_date):
    all_data = {}
    for ticker in tickers:
        try:
            df_temp = yf.download(ticker, start=start_date, end=end_date, progress=False, auto_adjust=False)
            if not df_temp.empty and "Adj Close" in df_temp.columns:
                all_data[ticker] = df_temp["Adj Close"]
        except Exception as e:
            print(f"Error fetching data for {ticker}: {e}")
            pass
    if not all_data:
        return pd.DataFrame()
    df_prices = pd.concat(all_data.values(), axis=1)
    df_prices.columns = all_data.keys()
    return df_prices

# -----------------------------------------------------------------------------
# 3) Compute Daily Sector Returns
# -----------------------------------------------------------------------------
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

# -----------------------------------------------------------------------------
# 4) Seasonality Analysis (Monthly Aggregates)
# -----------------------------------------------------------------------------
def analyze_seasonality(df_sector):
    """
    Returns:
      - monthly_avg: DataFrame (index: month 1-12, columns: sectors) for average monthly returns.
      - best_sector_per_month: Series of sector names (length=12) with highest average return per month.
      - best_return_per_month: Series of best returns (length=12).
    """
    if df_sector.empty:
        return pd.DataFrame(), None, None

    # Convert daily returns to monthly returns
    df_monthly = (1 + df_sector).resample('M').prod() - 1
    df_monthly['Month'] = df_monthly.index.month
    monthly_avg = df_monthly.groupby('Month').mean()
    best_sector_per_month = monthly_avg.idxmax(axis=1)
    best_return_per_month = monthly_avg.max(axis=1)
    return monthly_avg, best_sector_per_month, best_return_per_month

# -----------------------------------------------------------------------------
# 5) Forecast Future Cycles Based on Historical Seasonality
# -----------------------------------------------------------------------------
def forecast_future_cycles(prediction_year, forecast_horizon, best_sector, best_return):
    """
    Uses historical seasonal averages to forecast future cycles.
    Forecast starts from January of the selected prediction year.
    Returns a DataFrame with columns:
      - Forecast Month: in YYYY-MM format
      - Predicted Best Sector: based on historical averages
      - Predicted Return (%): forecasted return percentage
    """
    forecast_start_date = datetime(prediction_year, 1, 1)
    forecast_results = []
    for i in range(forecast_horizon):
        forecast_date = forecast_start_date + relativedelta(months=i)
        month_number = forecast_date.month
        predicted_sector = best_sector.loc[month_number] if best_sector is not None else "N/A"
        predicted_return = best_return.loc[month_number] * 100.0 if best_return is not None else np.nan
        forecast_results.append((forecast_date.strftime("%Y-%m"), predicted_sector, predicted_return))
    forecast_df = pd.DataFrame(forecast_results, columns=["Forecast Month", "Predicted Best Sector", "Predicted Return (%)"])
    return forecast_df

# -----------------------------------------------------------------------------
# 6) Helper: Compute Backtest Chart and Accuracy
# -----------------------------------------------------------------------------
def compute_backtest_chart(df_sector, test_year, best_sector_train, best_return_train):
    """
    For a given test year (held-out from training), computes:
      - A forecast for the test year based on seasonal averages from the training portion.
      - The actual best sector and returns per month in the test year.
      - A grouped bar chart comparing forecasted vs. actual returns.
      - The prediction accuracy (percentage of months where the predicted best sector matches the actual best).
    Returns:
      - backtest_df: DataFrame with forecast, actual, and accuracy info.
      - accuracy_pct: Prediction accuracy percentage.
      - bars: Holoviews Bars object for the chart.
    """
    # Filter data for the test year
    test_df = df_sector[df_sector.index.year == test_year]
    if test_df.empty:
        return None, None, None

    # Compute monthly returns for the test period
    df_monthly_test = (1 + test_df).resample('M').prod() - 1
    actual_best_sector = df_monthly_test.idxmax(axis=1)
    actual_best_return = df_monthly_test.max(axis=1) * 100.0

    # Forecast for the test year using the seasonal averages from training portion
    forecast_df = forecast_future_cycles(test_year, 12, best_sector_train, best_return_train)
    backtest_df = forecast_df.copy()
    backtest_df['Actual Best Sector'] = actual_best_sector.values
    backtest_df['Actual Return (%)'] = actual_best_return.values
    backtest_df['Correct'] = (backtest_df['Predicted Best Sector'] == backtest_df['Actual Best Sector']).astype(int)
    accuracy_pct = backtest_df['Correct'].mean() * 100.0

    # Melt the DataFrame for a grouped bar chart (Forecasted vs. Actual returns)
    backtest_melt = pd.melt(
        backtest_df,
        id_vars=["Forecast Month"],
        value_vars=["Predicted Return (%)", "Actual Return (%)"],
        var_name="Type",
        value_name="Return (%)"
    )
    # Grouped bar chart, same styling, but with shared_axes disabled
    bars = hv.Bars(backtest_melt, kdims="Forecast Month", vdims="Return (%)").opts(
        width=600, height=400, tools=['hover'],
        title=f"Backtest: Forecasted vs Actual Returns for {test_year}",
        xlabel="Month", ylabel="Return (%)",
        toolbar='above',
        # Disable axis sharing so it won't show extra empty dates
        shared_axes=False,
        framewise=True
    )
    return backtest_df, accuracy_pct, bars

# -----------------------------------------------------------------------------
# 7) Panel Interactive Dashboard Class
# -----------------------------------------------------------------------------
class SectorSeasonalityApp(pn.viewable.Viewer):
    def __init__(self, **params):
        super().__init__(**params)
        self.df_sectors = load_sector_data()

        current_year = datetime.now().year

        # Widgets for training period selection
        self.start_year = pn.widgets.IntSlider(name='Training Start Year', value=2020, start=2015, end=current_year-1)
        self.end_year   = pn.widgets.IntSlider(name='Training End Year', value=2022, start=2015, end=current_year-1)
        # Prediction year (must be > training end year)
        self.prediction_year = pn.widgets.IntSlider(
            name='Prediction Year',
            value=self.end_year.value+1,
            start=self.end_year.value+1,
            end=self.end_year.value+5
        )

        self.run_button = pn.widgets.Button(name='Run Analysis & Forecast', button_type='primary', width=220)

        self.output_pane = pn.Column("**Configure the training range and prediction year. Click the button below to run analysis.**")

        # Link button click to analysis function
        self.run_button.on_click(self._run_analysis)

        # ---------------------------------------
        # Re-organized Controls Layout
        # ---------------------------------------
        training_box = pn.Column(
            pn.pane.Markdown("### Training Period"),
            self.start_year,
            self.end_year,
            css_classes=["light-box"],
            width=250
        )
        prediction_box = pn.Column(
            pn.pane.Markdown("### Prediction Year"),
            self.prediction_year,
            css_classes=["light-box"],
            width=250
        )
        top_controls = pn.Row(training_box, prediction_box)
        button_row = pn.Row(self.run_button)
        self.controls = pn.Column(top_controls, button_row, css_classes=["light-box"], width=850)

        self.panel = pn.Column(self.controls, self.output_pane, sizing_mode="stretch_width")

    def _run_analysis(self, event):
        # Update prediction_year slider range based on training end year
        self.prediction_year.start = self.end_year.value + 1
        if self.prediction_year.value <= self.end_year.value:
            self.prediction_year.value = self.end_year.value + 1

        # 1. Define training period dates
        start_dt = datetime(self.start_year.value, 1, 1)
        end_dt   = datetime(self.end_year.value, 12, 31)

        # 2. Fetch price data
        tickers = self.df_sectors['Ticker'].unique().tolist()
        df_prices = fetch_price_data(tickers, start_dt, end_dt)
        if df_prices.empty:
            self.output_pane.objects = ["**No data returned for the selected training period.**"]
            return

        # 3. Compute sector returns
        df_sector = compute_sector_returns(df_prices, self.df_sectors)
        if df_sector.empty:
            self.output_pane.objects = ["**No sector return data available.**"]
            return

        # 4. Seasonality analysis on training data
        monthly_avg, best_sector, best_return = analyze_seasonality(df_sector)
        if monthly_avg.empty:
            self.output_pane.objects = ["**Insufficient monthly data.**"]
            return

        # 5. Forecast future cycles for the selected prediction year
        forecast_df = forecast_future_cycles(self.prediction_year.value, 12, best_sector, best_return)
        forecast_plot = hv.Bars(forecast_df, kdims="Forecast Month", vdims="Predicted Return (%)").opts(
            width=600, height=400, tools=['hover'],
            color="#4169E1", alpha=0.8,
            title="Forecasted Best Sector Returns",
            xlabel="Forecast Month", ylabel="Predicted Return (%)",
            toolbar='above',
            # Disable shared axes so it won't show extra empty months
            shared_axes=False,
            framewise=True
        )
        labels_forecast = hv.Labels(
            forecast_df,
            kdims=["Forecast Month", "Predicted Return (%)"],
            vdims="Predicted Best Sector"
        ).opts(
            text_font_size='10pt',
            text_align='center',
            text_baseline='bottom',
            yoffset=3
        )
        combined_forecast = forecast_plot * labels_forecast
        hv_forecast_panel = pn.pane.HoloViews(combined_forecast, sizing_mode='stretch_width')
        forecast_box = pn.Column(hv_forecast_panel, css_classes=["light-box"])

        # 6. Backtesting: If training period spans more than one year, use the last year for backtest
        if self.end_year.value - self.start_year.value >= 1:
            # Use data before the last year for the backtest forecast
            backtest_train_df = df_sector[df_sector.index.year < self.end_year.value]
            if backtest_train_df.empty:
                backtest_panel = pn.pane.Markdown("**Not enough data for backtesting analysis.**")
            else:
                _, best_sector_bt, best_return_bt = analyze_seasonality(backtest_train_df)
                backtest_df, accuracy_pct, backtest_bars = compute_backtest_chart(
                    df_sector, self.end_year.value, best_sector_bt, best_return_bt
                )
                if backtest_df is None:
                    backtest_panel = pn.pane.Markdown("**Not enough data for backtesting analysis.**")
                else:
                    accuracy_text = (
                        f"**Backtesting Accuracy for {self.end_year.value}: "
                        f"{accuracy_pct:.1f}% of months predicted correctly.**"
                    )
                    backtest_panel = pn.Column(
                        pn.pane.Markdown(accuracy_text),
                        pn.pane.HoloViews(backtest_bars, sizing_mode='stretch_width'),
                        css_classes=["light-box"]
                    )
        else:
            backtest_panel = pn.pane.Markdown("**Not enough data for backtesting analysis.**")

        # 7. Assemble final output
        explanation = pn.pane.Markdown(
            f"""
### Analysis Overview
- **Training Period:** {self.start_year.value} to {self.end_year.value}
- **Prediction Year:** {self.prediction_year.value} (Forecast for 12 months starting January)
- **Backtesting:** Last full training year ({self.end_year.value}) used to evaluate prediction accuracy.

**Components:**
- *Forecast Chart*: Uses historical seasonal averages to predict the best sector for each month.
- *Backtest Chart*: Compares forecasted vs. actual returns and shows prediction accuracy.
            """, width=850
        )

        self.output_pane.objects = [
            forecast_box,
            explanation,
            backtest_panel
        ]

    def panel_view(self):
        return self.panel

# -----------------------------------------------------------------------------
# Create Instance and Serve the Dashboard using a Light Themed Template
# -----------------------------------------------------------------------------
app = SectorSeasonalityApp()

template = pn.template.FastListTemplate(
    title="Light Themed Sector Cycle Dashboard",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app.panel_view()],
    sidebar=[],
)

template.servable()