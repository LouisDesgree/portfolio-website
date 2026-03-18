#!/usr/bin/env python3
"""
Title: S&P 500 Sector Pattern Analysis
Description:
    1) Loads tickers and sectors (from a local CSV or predefined list).
    2) Fetches ~1 year of daily price data using yfinance.
    3) Computes daily returns, aggregates by sector.
    4) Analyzes patterns via correlation matrix and PCA.
"""

import os
import pandas as pd
import numpy as np
import yfinance as yf
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns

# Optional: For PCA
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

def load_sector_data():
    """
    Load or define a DataFrame with columns: ['Ticker', 'Sector'].
    Replace this with your actual data source.
    """
    data = {
        'Ticker': ['AAPL', 'MSFT', 'XOM', 'JNJ', 'JPM', 'GOOG', 'AMZN'],
        'Sector': [
            'Information Technology',
            'Information Technology',
            'Energy',
            'Health Care',
            'Financials',
            'Communication Services',
            'Consumer Discretionary'
        ]
    }
    df = pd.DataFrame(data)
    return df

def fetch_price_data(tickers, start_date, end_date):
    """
    Fetch daily adjusted close price data for a list of tickers.
    Returns a DataFrame of shape (dates, tickers).
    Skips tickers that return empty data or lack an 'Adj Close' column.
    """
    all_series = []

    for ticker in tickers:
        try:
            df_temp = yf.download(
                ticker,
                start=start_date,
                end=end_date,
                progress=False,
                auto_adjust=False  # ensures 'Adj Close' is in columns
            )

            if df_temp.empty:
                print(f"No data returned for {ticker}. Skipping.")
                continue

            if "Adj Close" not in df_temp.columns:
                print(f"No 'Adj Close' column for {ticker}. Skipping.")
                continue

            # We'll store as a Series: index=Date, name=ticker
            s = df_temp["Adj Close"].copy()
            s.name = ticker
            all_series.append(s)

        except Exception as e:
            print(f"Error with {ticker}: {e}")
            continue

    # If we have no valid data, return empty
    if not all_series:
        print("\nNo valid data for any ticker!")
        return pd.DataFrame()

    # Combine all Series into one DataFrame (columns = tickers, index = Date)
    df_prices = pd.concat(all_series, axis=1)
    df_prices.sort_index(inplace=True)
    return df_prices

def compute_sector_returns(df_prices, df_sectors):
    """
    1) Compute daily returns for each ticker.
    2) Aggregate returns by sector (average).
    """
    if df_prices.empty:
        return pd.DataFrame()

    # 1. Daily returns
    daily_returns = df_prices.pct_change().dropna(how='all')

    # 2. Ticker -> Sector
    ticker_to_sector = dict(zip(df_sectors['Ticker'], df_sectors['Sector']))
    sector_map = {}
    for t, s in ticker_to_sector.items():
        sector_map.setdefault(s, []).append(t)

    # 3. For each sector, average daily returns across its tickers
    sector_returns = {}
    for sector, tlist in sector_map.items():
        valid_tickers = [t for t in tlist if t in daily_returns.columns]
        if len(valid_tickers) == 0:
            continue
        # Mean across those columns
        sector_returns[sector] = daily_returns[valid_tickers].mean(axis=1)

    df_sector = pd.DataFrame(sector_returns).dropna(how='all')
    return df_sector

def main():
    # 1) Load or define sector data
    df_sectors = load_sector_data()
    print("=== Sector Data (head) ===")
    print(df_sectors.head())

    # 2) Use a valid date range (~1 year)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)

    # 3) Fetch price data
    tickers = df_sectors['Ticker'].unique().tolist()
    print(f"\nFetching price data for {len(tickers)} tickers "
          f"from {start_date.date()} to {end_date.date()}...")
    df_prices = fetch_price_data(tickers, start_date, end_date)
    print("\n=== Price Data (head) ===")
    print(df_prices.head())

    # 4) Compute sector returns
    df_sector_returns = compute_sector_returns(df_prices, df_sectors)
    print("\n=== Sector Returns (head) ===")
    print(df_sector_returns.head())

    # If empty, skip analysis
    if df_sector_returns.empty:
        print("\nNo sector returns data found. Exiting.")
        return

    # 5) Correlation
    corr_matrix = df_sector_returns.corr()
    print("\n=== Sector Correlation Matrix ===")
    print(corr_matrix)

    # 6) PCA
    df_sector_returns_dropna = df_sector_returns.dropna()
    if df_sector_returns_dropna.shape[0] < 1:
        print("\nNot enough rows for PCA. Exiting.")
        return
    X = df_sector_returns_dropna.values
    if X.shape[1] < 2:
        print("\nNot enough sectors for PCA. Exiting.")
        return

    X_std = StandardScaler().fit_transform(X)
    from sklearn.decomposition import PCA
    pca = PCA(n_components=2)
    pcs = pca.fit_transform(X_std)

    # 7) Plot correlation heatmap
    import matplotlib.pyplot as plt
    import seaborn as sns

    plt.figure(figsize=(8,6))
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm')
    plt.title("Sector Returns Correlation")
    plt.tight_layout()
    plt.show()

    # 8) PCA results
    sector_names = df_sector_returns.columns.tolist()
    loadings = pca.components_.T  # shape (#sectors, 2)
    plt.figure(figsize=(6,6))
    for i, sector in enumerate(sector_names):
        x, y = loadings[i, 0], loadings[i, 1]
        plt.scatter(x, y, s=50)
        plt.text(x+0.01, y, sector, fontsize=10)
    plt.axhline(0, color='gray', linewidth=1)
    plt.axvline(0, color='gray', linewidth=1)
    plt.title("PCA Loadings: Sector Returns (First 2 Components)")
    plt.xlabel("PC1")
    plt.ylabel("PC2")
    plt.show()

    # 9) Print explained variance ratio
    print("\nExplained Variance Ratio (PC1, PC2):", pca.explained_variance_ratio_)

if __name__ == "__main__":
    main()
