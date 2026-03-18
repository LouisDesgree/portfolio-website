#!/usr/bin/env python3
"""
Title: S&P 500 Sector + Macro Analysis (Cyclical/Seasonality Focus + Best-Sector-Per-Month)
Description:
  1) Defines a small set of tickers (7) and their sectors inline (no CSV).
  2) Downloads ~3 years of daily price data with yfinance.
  3) Downloads 10-year Treasury yield from FRED (pandas_datareader).
  4) Computes daily returns for each sector, merges with macro data.
  5) Performs correlation, PCA, multiple linear regression (MLR).
  6) Seasonality Analysis (monthly returns):
       - Resample daily returns -> monthly returns
       - Group by month-of-year
       - Plot bar charts of average monthly returns per sector
       - **NEW**: Determine which sector is "best" for each month (based on average monthly return),
                  and plot a single summary chart showing "Invest in <Sector> for Month X"
  7) All code is documented so you can understand each step.
"""

import os
import pandas as pd
import numpy as np
import yfinance as yf
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns

# For optional FRED data
import pandas_datareader.data as web

# For PCA & standardization
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# For MLR significance
import statsmodels.api as sm

########################################################################
# 1) Define Sectors & Tickers (No CSV)
########################################################################

def load_sector_data():
    """
    Returns a DataFrame with columns: [Ticker, Sector].
    You can expand or modify the list below as desired.
    """
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

########################################################################
# 2) Fetch Price Data (~3 years)
########################################################################

def fetch_price_data(tickers, start_date, end_date):
    """
    Download daily 'Adj Close' price data for each ticker using yfinance.
    Returns a DataFrame of shape (dates, tickers).
    """
    all_data = {}
    for ticker in tickers:
        try:
            df_temp = yf.download(
                ticker,
                start=start_date,
                end=end_date,
                progress=False,
                auto_adjust=False  # ensures 'Adj Close' is available
            )
            if df_temp.empty:
                print(f"[WARN] No data returned for {ticker}. Skipping.")
                continue

            if "Adj Close" not in df_temp.columns:
                print(f"[WARN] 'Adj Close' missing for {ticker}. Skipping.")
                continue

            all_data[ticker] = df_temp["Adj Close"]
        except Exception as e:
            print(f"[ERROR] {ticker}: {e}")
            continue

    if not all_data:
        print("\n[ERROR] No valid data for any ticker!")
        return pd.DataFrame()

    df_prices = pd.concat(all_data.values(), axis=1)
    df_prices.columns = all_data.keys()
    return df_prices

########################################################################
# 3) Fetch Macro: 10-year Treasury Yield
########################################################################

def fetch_macro_data_10yr_yield(start_date, end_date):
    """
    Fetch 10-year Treasury yield from FRED using pandas_datareader.
    Returns a DataFrame with a single column 'TENYR'.
    Symbol: "DGS10"
    """
    try:
        df_10yr = web.DataReader('DGS10', 'fred', start_date, end_date)
        df_10yr.rename(columns={'DGS10': 'TENYR'}, inplace=True)
        df_10yr.ffill(inplace=True)  # forward-fill missing
        return df_10yr
    except Exception as e:
        print(f"[ERROR] Could not fetch 10yr yield from FRED: {e}")
        return pd.DataFrame()

########################################################################
# 4) Compute Sector Returns
########################################################################

def compute_sector_returns(df_prices, df_sectors):
    """
    1) daily returns for each ticker
    2) group by sector, average returns
    Returns DataFrame with columns as sectors.
    """
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
        if not valid_tickers:
            continue
        sector_returns[sector] = daily_returns[valid_tickers].mean(axis=1)

    df_sector = pd.DataFrame(sector_returns).dropna(how='all')
    return df_sector

########################################################################
# 5) Plot with Trendlines
########################################################################

def plot_with_trendlines(df, title="Plot with Trendlines"):
    """
    Plot each column of df over time with a linear regression trendline.
    This helps illustrate the general slope/trend of each series.
    """
    plt.figure(figsize=(10,6))
    df_no_na = df.dropna()

    # Convert datetime to ordinal (numerical)
    x_ordinal = df_no_na.index.map(lambda d: d.toordinal())

    for col in df_no_na.columns:
        y_vals = df_no_na[col].values
        plt.plot(df_no_na.index, y_vals, label=col)

        # Simple linear fit (1D):
        if len(x_ordinal) > 1:
            fit = np.polyfit(x_ordinal, y_vals, 1)
            y_fit = np.polyval(fit, x_ordinal)
            plt.plot(df_no_na.index, y_fit, linestyle='--', linewidth=1.5)

    plt.title(title)
    plt.legend()
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

########################################################################
# 6) Seasonality (Monthly) + "Which Sector to Invest" Plot
########################################################################

def analyze_seasonality(df_sector_returns):
    """
    Demonstrate cyclical/seasonality approach:
      1) Convert daily sector returns -> monthly returns
      2) Group by month-of-year
      3) Plot bar charts of average monthly returns for each sector
      4) Then pick the best sector per month and create a single summary plot
         showing "In Month X, invest in Y" with the expected average monthly return.
    """
    if df_sector_returns.empty:
        print("[Seasonality] No sector returns. Skipping.")
        return

    # Convert daily returns to monthly returns
    # monthly return = product(1+daily) - 1
    df_monthly = (1 + df_sector_returns).resample('M').prod() - 1

    # Add a 'Month' column (1=Jan, 12=Dec)
    df_monthly['Month'] = df_monthly.index.month

    # Average monthly returns across the entire window
    monthly_avg = df_monthly.groupby('Month').mean()

    # (A) Bar charts for each sector
    sector_cols = [c for c in monthly_avg.columns if c != 'Month']
    for sector in sector_cols:
        plt.figure(figsize=(8,4))
        plt.bar(monthly_avg.index, monthly_avg[sector]*100, color='blue', alpha=0.7)
        plt.title(f"{sector} - Average Monthly Returns (Seasonality)")
        plt.xlabel("Month (1=Jan, 12=Dec)")
        plt.ylabel("Avg Monthly Return (%)")
        for i, val in enumerate(monthly_avg[sector]):
            if not np.isnan(val):
                plt.text(monthly_avg.index[i], val*100 + 0.05, f"{val*100:.2f}%", 
                         ha='center', fontsize=9)
        plt.xticks(monthly_avg.index)
        plt.tight_layout()
        plt.show()

    # (B) Single summary: "Which sector is best each month?"
    # For each month (1..12), find the sector with the highest average monthly return
    # We'll also get that best return value.
    best_sector_per_month = monthly_avg.idxmax(axis=1)  # returns sector name
    best_return_per_month = monthly_avg.max(axis=1)     # returns float

    # We'll create a single figure with 12 bars, each bar representing the "best sector"
    # We'll color-code the bar by sector, or simply one color with text label
    # For a simple approach, let's do one color and text label.

    plt.figure(figsize=(8,5))
    # x-axis is month 1..12
    x_vals = monthly_avg.index
    y_vals = best_return_per_month.values * 100.0  # convert to percent
    plt.bar(x_vals, y_vals, color='green', alpha=0.7)
    plt.title("Which Sector to Invest Each Month (Highest Avg Monthly Return)")
    plt.xlabel("Month (1=Jan, 12=Dec)")
    plt.ylabel("Best Avg Monthly Return (%)")

    for i, month_num in enumerate(x_vals):
        sector_name = best_sector_per_month[month_num]
        return_val = y_vals[i]
        # Place text label above the bar: e.g. "Tech (2.35%)"
        plt.text(month_num, return_val + 0.05, f"{sector_name}\n({return_val:.2f}%)",
                 ha='center', fontsize=8)

    plt.xticks(x_vals)
    plt.tight_layout()
    plt.show()

########################################################################
# MAIN
########################################################################

def main():
    # 1) & 2) Load or define sector data, 3-year window
    df_sectors = load_sector_data()
    print("=== Sector Data (head) ===")
    print(df_sectors.head())

    end_date = datetime.now()
    start_date = end_date - timedelta(days=1095)  # ~3 years

    # 3) Fetch price data
    tickers = df_sectors['Ticker'].unique().tolist()
    print(f"\nFetching price data for {len(tickers)} tickers "
          f"from {start_date.date()} to {end_date.date()}...")
    df_prices = fetch_price_data(tickers, start_date, end_date)
    print("\n=== Price Data (head) ===")
    print(df_prices.head())

    if df_prices.empty:
        print("[ERROR] No price data. Exiting.")
        return

    # Quick price plot
    plt.figure(figsize=(10,6))
    for col in df_prices.columns:
        plt.plot(df_prices.index, df_prices[col], label=col)
    plt.title("Daily Adjusted Close Prices (No Trendlines)")
    plt.legend()
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

    # 3a) Macro data: 10yr yield
    df_10yr = fetch_macro_data_10yr_yield(start_date, end_date)
    print("\n=== 10yr Yield (head) ===")
    print(df_10yr.head())

    if not df_10yr.empty:
        plot_with_trendlines(df_10yr, title="10-Year Treasury Yield (with Trendline)")

    # 4) Sector returns
    df_sector_returns = compute_sector_returns(df_prices, df_sectors)
    print("\n=== Sector Returns (head) ===")
    print(df_sector_returns.head())

    if df_sector_returns.empty:
        print("[ERROR] No sector returns. Exiting.")
        return

    # Trendlines for daily sector returns
    plot_with_trendlines(df_sector_returns, title="Sector Daily Returns (with Trendlines)")

    # 6) Seasonality Analysis + "Which Sector to Invest Each Month"
    print("\n=== Seasonality Analysis (Monthly Returns) + Best-Sector-Per-Month ===")
    analyze_seasonality(df_sector_returns)

    # 5) Merge sector returns with macro
    df_10yr_daily = df_10yr.resample('D').ffill()  # daily freq
    df_merged = df_sector_returns.join(df_10yr_daily, how='left')
    print("\n=== Merged Sector Returns + Macro (head) ===")
    print(df_merged.head())

    # 5a) Correlation
    corr_matrix = df_merged.corr()
    print("\n=== Correlation Matrix with Macro ===")
    print(corr_matrix)

    # Heatmap
    if corr_matrix.shape[0] > 1:
        plt.figure(figsize=(8,6))
        sns.heatmap(corr_matrix, annot=True, cmap='coolwarm')
        plt.title("Sector Returns + 10yr Yield Correlation")
        plt.tight_layout()
        plt.show()

    # 5b) PCA
    df_merged_dropna = df_merged.dropna()
    if df_merged_dropna.shape[0] > 1 and df_merged_dropna.shape[1] > 1:
        X = df_merged_dropna.values
        X_std = StandardScaler().fit_transform(X)

        pca = PCA(n_components=min(2, X_std.shape[1]))
        pcs = pca.fit_transform(X_std)

        print("\nPCA Explained Variance Ratio (First 2 PCs):")
        print(pca.explained_variance_ratio_)

        # PCA loadings scatter
        col_names = df_merged_dropna.columns.tolist()
        loadings = pca.components_.T  # shape (#features, 2)

        plt.figure(figsize=(6,6))
        for i, col in enumerate(col_names):
            x, y = loadings[i, 0], loadings[i, 1]
            plt.scatter(x, y, s=50)
            plt.text(x+0.01, y, col, fontsize=10)
        plt.axhline(0, color='gray', linewidth=1)
        plt.axvline(0, color='gray', linewidth=1)
        plt.title("PCA Loadings: Sectors + 10yr Yield")
        plt.xlabel("PC1")
        plt.ylabel("PC2")
        plt.tight_layout()
        plt.show()

        # Bar chart for explained variance
        plt.figure(figsize=(5,4))
        x_positions = np.arange(len(pca.explained_variance_ratio_)) + 1
        plt.bar(x_positions, pca.explained_variance_ratio_ * 100.0, color='green')
        plt.title("Explained Variance Ratio (%) for PCA Components")
        plt.xlabel("Principal Component")
        plt.ylabel("Variance Explained (%)")
        for i, val in enumerate(pca.explained_variance_ratio_):
            plt.text(x_positions[i], val*100.0 + 0.5, f"{val*100:.2f}%", ha='center')
        plt.tight_layout()
        plt.show()
    else:
        print("[INFO] Not enough data for PCA analysis.")

    #######################################################################
    # 5c) Multiple Linear Regression (MLR)
    #######################################################################
    target_sector = 'Financials'
    if target_sector in df_merged.columns:
        if df_merged_dropna.shape[0] > 10:
            X_cols = [col for col in df_merged_dropna.columns if col != target_sector]
            if not X_cols:
                print("[MLR] No features. Skipping.")
            else:
                X = df_merged_dropna[X_cols]
                y = df_merged_dropna[target_sector]

                X_const = sm.add_constant(X, prepend=True)
                model = sm.OLS(y, X_const).fit()
                print(f"\n=== MLR Summary for Target Sector: {target_sector} ===")
                print(model.summary())

                # Actual vs. Predicted
                y_pred = model.predict(X_const)
                plt.figure(figsize=(6,6))
                plt.scatter(y, y_pred, alpha=0.7)
                plt.title(f"MLR: Actual vs. Predicted for {target_sector}")
                plt.xlabel("Actual Returns")
                plt.ylabel("Predicted Returns")
                plt.axhline(0, color='gray', linewidth=1)
                plt.axvline(0, color='gray', linewidth=1)
                plt.tight_layout()
                plt.show()

    #######################################################################
    # 5d) Isolate sector pairs for illustration
    #######################################################################
    if 'Energy' in df_merged.columns and 'Financials' in df_merged.columns:
        df_pair = df_merged[['Energy','Financials']].dropna()
        plt.figure(figsize=(6,6))
        plt.scatter(df_pair['Energy'], df_pair['Financials'], alpha=0.7)
        plt.title("Energy vs. Financials Daily Returns")
        plt.xlabel("Energy Returns")
        plt.ylabel("Financials Returns")

        # Fit line
        X_pair = sm.add_constant(df_pair['Energy'])
        y_pair = df_pair['Financials']
        pair_model = sm.OLS(y_pair, X_pair).fit()
        y_line = pair_model.predict(X_pair)
        plt.plot(df_pair['Energy'], y_line, color='red', linewidth=2)

        plt.axhline(0, color='gray', linewidth=1)
        plt.axvline(0, color='gray', linewidth=1)
        plt.tight_layout()
        plt.show()

        # Print correlation + descriptive stats
        print("\n=== Stats for Selected Sectors ===")
        print(df_pair.describe())
        print(f"\nCorrelation between 'Energy' and 'Financials':")
        print(df_pair.corr())

    print("\n=== Analysis Complete. Expand tickers/time for deeper insights. ===")


if __name__ == "__main__":
    main()