#!/usr/bin/env python3
"""
Title: Light Themed Interactive S&P 500 Sector Cycle Dashboard (Auto-Optimized for Accuracy)
Description:
  - Each ticker is assigned a real company name (Apple, Microsoft, etc.).
  - We treat each ticker as its own "sector," so each gets a unique color on the bar chart.
  - A short-term "recent performance" factor is combined with the seasonal average.
  - We automatically search (grid search) for the best 'window' and 'weight' that
    maximize backtest accuracy, then apply that to the final forecast.
  - A small label is placed at the top of each bar, centered.
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

# Initialize Panel and Holoviews extensions
pn.extension(sizing_mode="stretch_width")
hv.extension('bokeh')

# -----------------------------------------------------------------------------
# Custom CSS for a Light Themed UI with clear labels for beginners
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
# 1) Map Each Ticker to Its Real Company Name
# -----------------------------------------------------------------------------
def load_sector_data():
    """
    Returns a DataFrame mapping each ticker to a company name.
    Here, each ticker is treated as its own "sector."
    """
    data = {
        'Ticker': ['AAPL', 'MSFT', 'XOM', 'JNJ', 'JPM', 'GOOG', 'AMZN'],
        'Sector': [
            'Apple',
            'Microsoft',
            'Exxon Mobil',
            'Johnson & Johnson',
            'JPMorgan',
            'Google',
            'Amazon'
        ]
    }
    return pd.DataFrame(data)

# -----------------------------------------------------------------------------
# 2) Fetch Price Data from Yahoo Finance
# -----------------------------------------------------------------------------
def fetch_price_data(tickers, start_date, end_date):
    """
    Fetches historical daily price data for each ticker.
    Only uses the "Adjusted Close" price.
    """
    all_data = {}
    for ticker in tickers:
        try:
            df_temp = yf.download(ticker, start=start_date, end=end_date, 
                                  progress=False, auto_adjust=False)
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
# 3) Compute Daily Returns for Each "Sector"
# -----------------------------------------------------------------------------
def compute_sector_returns(df_prices, df_sectors):
    """
    Converts ticker-level prices to daily returns and groups them by company.
    Since each ticker is its own "sector," the return is simply computed for that ticker.
    """
    if df_prices.empty:
        return pd.DataFrame()
    daily_returns = df_prices.pct_change().dropna(how='all')
    ticker_to_sector = dict(zip(df_sectors['Ticker'], df_sectors['Sector']))
    sector_map = {}
    for t, s in ticker_to_sector.items():
        sector_map.setdefault(s, []).append(t)
    sector_returns = {}
    for sector, tlist in sector_map.items():
        valid_tickers = [t for t in tlist if t in daily_returns.columns]
        if valid_tickers:
            # With one ticker per company, this is just the daily return for that ticker.
            sector_returns[sector] = daily_returns[valid_tickers].mean(axis=1)
    return pd.DataFrame(sector_returns).dropna(how='all')

# -----------------------------------------------------------------------------
# 4) Enhanced Seasonality Analysis: Seasonal Average + Recent Trend
# -----------------------------------------------------------------------------
def analyze_seasonality_with_recent_trend(df_sector, window=3, weight=0.5):
    """
    1) Calculate monthly (seasonal) average returns.
    2) Calculate a recent trend using a rolling window over monthly returns.
    3) Combine them with a given weight:
       EnhancedReturn = SeasonalAvg + (weight × RecentTrend)
    Returns:
      - Enhanced monthly returns,
      - Best performing sector per month, and
      - The corresponding best returns.
    """
    if df_sector.empty:
        return pd.DataFrame(), None, None
    df_monthly = (1 + df_sector).resample('M').prod() - 1
    df_monthly['Month'] = df_monthly.index.month
    monthly_avg = df_monthly.groupby('Month').mean()
    df_monthly_trend = df_monthly.drop(columns='Month').rolling(window).mean().shift(1)
    df_monthly_trend['Month'] = df_monthly['Month']
    monthly_trend = df_monthly_trend.groupby('Month').mean()
    enhanced_monthly = monthly_avg + weight * monthly_trend
    best_sector_per_month = enhanced_monthly.idxmax(axis=1)
    best_return_per_month = enhanced_monthly.max(axis=1)
    return enhanced_monthly, best_sector_per_month, best_return_per_month

# -----------------------------------------------------------------------------
# 5) Forecast Future Cycles Based on Enhanced Analysis
# -----------------------------------------------------------------------------
def forecast_future_cycles(prediction_year, forecast_horizon, best_sector, best_return):
    """
    For each month in the prediction year, picks the best stock (sector) 
    and its expected return based on the enhanced analysis.
    """
    forecast_start_date = datetime(prediction_year, 1, 1)
    forecast_results = []
    for i in range(forecast_horizon):
        forecast_date = forecast_start_date + relativedelta(months=i)
        month_number = forecast_date.month
        if best_sector is not None and month_number in best_sector.index:
            predicted_sector = best_sector.loc[month_number]
            predicted_return = best_return.loc[month_number] * 100.0
        else:
            predicted_sector = "N/A"
            predicted_return = np.nan
        forecast_results.append((forecast_date.strftime("%Y-%m"), predicted_sector, predicted_return))
    return pd.DataFrame(forecast_results, columns=["Forecast Month", "Predicted Best Sector", "Predicted Return (%)"])

# -----------------------------------------------------------------------------
# 6) Create a Backtest Chart to Compare Forecasts with Actual Data
# -----------------------------------------------------------------------------
def compute_backtest_chart(df_sector, test_year, best_sector_train, best_return_train):
    """
    For the test year, compute the actual best performing stock (sector)
    and compare it with our forecast. Then, calculate the accuracy.
    """
    test_df = df_sector[df_sector.index.year == test_year]
    if test_df.empty:
        return None, None, None
    df_monthly_test = (1 + test_df).resample('M').prod() - 1
    actual_best_sector = df_monthly_test.idxmax(axis=1)
    actual_best_return = df_monthly_test.max(axis=1) * 100.0
    actual_best_sector.index = actual_best_sector.index.month
    actual_best_return.index = actual_best_return.index.month
    forecast_df = forecast_future_cycles(test_year, 12, best_sector_train, best_return_train)
    forecast_df['Month'] = forecast_df['Forecast Month'].apply(lambda x: int(x.split("-")[1]))
    forecast_df = forecast_df.merge(actual_best_sector.rename("Actual Best Sector"),
                                    left_on="Month", right_index=True, how="left")
    forecast_df = forecast_df.merge(actual_best_return.rename("Actual Return (%)"),
                                    left_on="Month", right_index=True, how="left")
    forecast_df['Correct'] = (forecast_df['Predicted Best Sector'] == forecast_df['Actual Best Sector']).astype(int)
    accuracy_pct = forecast_df['Correct'].mean() * 100.0
    backtest_melt = pd.melt(
        forecast_df,
        id_vars=["Forecast Month"],
        value_vars=["Predicted Return (%)", "Actual Return (%)"],
        var_name="Type",
        value_name="Return (%)"
    )
    bars = hv.Bars(backtest_melt, kdims="Forecast Month", vdims="Return (%)").opts(
        width=600, height=400, tools=['hover'],
        title=f"Backtest: Forecast vs Actual Returns for {test_year}",
        xlabel="Month", ylabel="Return (%)",
        toolbar='above'
    )
    return forecast_df, accuracy_pct, bars

# -----------------------------------------------------------------------------
# 7) Grid Search to Find the Best Trend Parameters (Window & Weight)
# -----------------------------------------------------------------------------
def find_best_trend_params(df_sector, test_year, window_candidates, weight_candidates):
    """
    Tries different window and weight combinations on the training data (before test_year)
    and returns the combo with the highest backtest accuracy.
    """
    best_accuracy = -1
    best_params = (3, 0.5)  # Default fallback values
    if df_sector.empty:
        return best_params
    train_df = df_sector[df_sector.index.year < test_year]
    if train_df.empty:
        return best_params
    for w in window_candidates:
        for wt in weight_candidates:
            _, best_sector_bt, best_return_bt = analyze_seasonality_with_recent_trend(train_df, w, wt)
            backtest_df, accuracy_pct, _ = compute_backtest_chart(df_sector, test_year, best_sector_bt, best_return_bt)
            if backtest_df is None:
                continue
            if accuracy_pct > best_accuracy:
                best_accuracy = accuracy_pct
                best_params = (w, wt)
    return best_params

# -----------------------------------------------------------------------------
# 8) Panel Interactive Dashboard Class (Beginner-Friendly)
# -----------------------------------------------------------------------------
class SectorSeasonalityApp(pn.viewable.Viewer):
    """
    This interactive dashboard lets you:
      - Choose a training period and a prediction year.
      - See how seasonal averages and recent trends are combined.
      - Automatically find the best trend parameters.
      - View forecasted best-performing stocks and a backtest chart.
      
    All input labels and titles are written clearly for beginners.
    """
    def __init__(self, **params):
        super().__init__(**params)
        self.df_sectors = load_sector_data()
        current_year = datetime.now().year

        # User controls for the training period and prediction year
        self.start_year = pn.widgets.IntSlider(name='Training Start Year (e.g., 2015)', value=2020, start=2015, end=current_year-1)
        self.end_year   = pn.widgets.IntSlider(name='Training End Year (e.g., 2022)', value=2022, start=2015, end=current_year-1)
        self.prediction_year = pn.widgets.IntSlider(
            name='Prediction Year (Year to Forecast)', value=self.end_year.value+1, 
            start=self.end_year.value+1, end=self.end_year.value+5
        )

        # Controls for initial trend settings (auto-optimized later)
        self.recent_performance_window = pn.widgets.IntSlider(
            name='Initial Recent Performance Window (months)', value=3, start=1, end=12, step=1
        )
        self.recent_trend_weight = pn.widgets.FloatSlider(
            name='Initial Recent Trend Weight (multiplier)', value=0.5, start=0.0, end=2.0, step=0.05
        )

        # Run button to start analysis
        self.run_button = pn.widgets.Button(name='Run Analysis & Forecast', button_type='primary', width=250)
        self.run_button.on_click(self._run_analysis)

        # Simple explanation text for beginners
        self.output_pane = pn.Column(
            pn.pane.Markdown(
            """
**Welcome to the S&P 500 Sector Cycle Dashboard!**

In this dashboard:
- **Training Period**: We use historical data (e.g., 2020-2022) to learn seasonal trends.
- **Prediction Year**: We forecast the best-performing stock for each month.
- **Enhanced Return Formula**:
  
  \\( \\text{EnhancedReturn} = \\text{SeasonalAvg} + (\\text{Weight} \\times \\text{RecentTrend}) \\)
  
Click the button below to run the analysis.
            """
            )
        )

        # Layout for controls
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
        trend_box = pn.Column(
            pn.pane.Markdown("### Trend Settings\n(Initial values; will be auto-optimized)"),
            self.recent_performance_window,
            self.recent_trend_weight,
            css_classes=["light-box"],
            width=350
        )

        top_controls = pn.Row(training_box, prediction_box, trend_box)
        button_row = pn.Row(self.run_button)

        self.controls = pn.Column(
            top_controls, button_row, css_classes=["light-box"], width=950
        )
        self.panel = pn.Column(
            self.controls, self.output_pane, sizing_mode="stretch_width"
        )

    def _run_analysis(self, event):
        # Ensure prediction year is valid
        self.prediction_year.start = self.end_year.value + 1
        if self.prediction_year.value <= self.end_year.value:
            self.prediction_year.value = self.end_year.value + 1

        # Define training period
        start_dt = datetime(self.start_year.value, 1, 1)
        end_dt   = datetime(self.end_year.value, 12, 31)

        # Fetch price data for the training period
        tickers = self.df_sectors['Ticker'].unique().tolist()
        df_prices = fetch_price_data(tickers, start_dt, end_dt)
        if df_prices.empty:
            self.output_pane.objects = ["**No data returned for the selected training period.**"]
            return

        # Compute daily returns for each company
        df_sector = compute_sector_returns(df_prices, self.df_sectors)
        if df_sector.empty:
            self.output_pane.objects = ["**No sector return data available.**"]
            return

        # Auto-optimize trend parameters if there is enough training data
        if self.end_year.value - self.start_year.value < 1:
            best_window = self.recent_performance_window.value
            best_weight = self.recent_trend_weight.value
            note = "Not enough data for auto-optimization. Using initial settings."
        else:
            window_candidates = list(range(1, 13))  # 1 to 12 months
            weight_candidates = [round(x * 0.05, 2) for x in range(0, 41)]  # 0.0 to 2.0 in 0.05 steps
            best_window, best_weight = find_best_trend_params(
                df_sector, self.end_year.value, window_candidates, weight_candidates
            )
            note = f"Auto-optimized settings: Window = {best_window} months, Weight = {best_weight}"

        # Run enhanced seasonal analysis with best parameters
        enhanced_monthly, best_sector, best_return = analyze_seasonality_with_recent_trend(
            df_sector,
            window=best_window,
            weight=best_weight
        )
        if enhanced_monthly.empty:
            self.output_pane.objects = ["**Insufficient monthly data for analysis.**"]
            return

        # Forecast for the prediction year
        forecast_df = forecast_future_cycles(self.prediction_year.value, 12, best_sector, best_return)

        # Create a forecast bar chart with labels using Holoviews
        forecast_plot = hv.Bars(
            forecast_df, 
            kdims=["Forecast Month"], 
            vdims=["Predicted Return (%)", "Predicted Best Sector"]
        ).opts(
            width=600, height=400, tools=['hover'],
            color_index='Predicted Best Sector',
            cmap='Category10',   # Distinct colors for different companies
            alpha=0.8,
            title="Forecasted Best Stock Returns",
            xlabel="Forecast Month", ylabel="Predicted Return (%)",
            toolbar='above'
        )
        labels_forecast = hv.Labels(
            forecast_df, 
            kdims=["Forecast Month", "Predicted Return (%)"], 
            vdims="Predicted Best Sector"
        ).opts(
            text_font_size='8pt',
            text_align='center',
            text_baseline='bottom',
            yoffset=1,
            text_color='black'
        )
        combined_forecast = forecast_plot * labels_forecast
        hv_forecast_panel = pn.pane.HoloViews(combined_forecast, sizing_mode='stretch_width')
        forecast_box = pn.Column(hv_forecast_panel, css_classes=["light-box"])

        # Backtest analysis for the last training year
        if self.end_year.value - self.start_year.value >= 1:
            backtest_train_df = df_sector[df_sector.index.year < self.end_year.value]
            if backtest_train_df.empty:
                backtest_panel = pn.pane.Markdown("**Not enough data for backtesting analysis.**")
            else:
                _, best_sector_bt, best_return_bt = analyze_seasonality_with_recent_trend(
                    backtest_train_df,
                    window=best_window,
                    weight=best_weight
                )
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

        # Final explanation summary for the user
        final_explanation = pn.pane.Markdown(
            f"""
### Analysis Summary
- **Training Period:** {self.start_year.value} to {self.end_year.value}
- **Prediction Year:** {self.prediction_year.value}

**Auto-Optimization Note:** {note}

**Final Chosen Settings:**  
- Recent Performance Window = {best_window} months  
- Recent Trend Weight = {best_weight}

**Enhanced Return Formula:**  
\\( \\text{EnhancedReturn} = \\text{SeasonalAvg} + (\\text{Weight} \\times \\text{RecentTrend}) \\)

The forecast bar chart above shows the predicted best-performing stock for each month, with each bar colored by company.
            """, width=900
        )

        self.output_pane.objects = [
            forecast_box,
            final_explanation,
            backtest_panel
        ]

    def panel_view(self):
        return self.panel

# -----------------------------------------------------------------------------
# Create the App and Serve It Using a FastListTemplate
# -----------------------------------------------------------------------------
app = SectorSeasonalityApp()

template = pn.template.FastListTemplate(
    title="Sector Cycle Dashboard",
    accent_base_color="#4169E1",
    header_background="#FF9500",
    main=[app.panel_view()],
    sidebar=[],
)

template.servable()