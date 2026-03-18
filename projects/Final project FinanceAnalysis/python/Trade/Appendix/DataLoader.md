# Universal Data Loader Documentation

This document provides an overview of the **Universal Data Loader** application. The project enables users to select multiple stock tickers, fetch historical data from Yahoo Finance, and visualize the results with interactive charts and summary statistics.

## Features

- **Multiple Ticker Selection:** Choose tickers from a predefined list.
- **Flexible Date Range:** Option to fetch data for "All Time" or within a custom range.
- **Interactive Visualizations:**
  - **Donut Chart:** Visualizes the data loading progress by showing the number of rows fetched per ticker.
  - **Aggregate Line Chart:** Displays combined adjusted closing prices for multiple tickers with summary statistics.
  - **Individual Ticker Analysis:** Provides detailed views and the latest 5 rows for selected tickers.
- **Data Export:** Saves price and volume data in both wide and long CSV formats.

## Technologies Used

- **Python 3:** Primary programming language.
- **Pandas:** Data manipulation and time series analysis.
- **yfinance:** Fetching historical stock data.
- **Panel & HoloViews:** Building interactive dashboards and visualizations.
- **Bokeh:** Underlying plotting engine for rendering charts.

## How It Works

### Data Fetching

- **Ticker & Date Selection:**  
  Users select stock tickers and specify a date range (either custom or "All Time").
- **Downloading Data:**  
  The application downloads historical data from Yahoo Finance for each selected ticker.  
  - **Adjusted Close Prices** and **Volume Data** are extracted.
- **Data Export:**  
  Data is saved in CSV format:
  - **Wide Format:** Each ticker is a separate column.
  - **Long Format:** Data is reshaped so that each row represents a ticker, date, and value.

### Visualizations

#### Donut Chart

- **Purpose:**  
  Displays the number of rows fetched per ticker.
- **Formula:**  
  Each ticker's wedge angle is computed as:  
  \[
  \text{angle} = \frac{\text{rows for ticker}}{\text{total rows}} \times 2\pi
  \]
- **Implementation:**  
  Uses Bokeh’s `annular_wedge` with the `Category20` color palette.

#### Aggregate & Detailed Line Charts

- **Aggregate Chart:**  
  Overlays line charts of adjusted close prices for all tickers using HoloViews.
  - Displays summary details such as the total number of rows, date range, and the latest closing prices.
- **Detailed Analysis:**  
  Users can select specific tickers to view an isolated line chart along with a table showing the latest 5 rows of data.

## Modifying the Project

### To modify or extend the project:

#### Ticker List:
- Update the `POPULAR_TICKERS` list to add or remove default ticker options.

#### Date Range Selection:
- Change the default dates in the `DatePicker` widgets.
- Adjust the logic in the `_on_load_data_click` method if you need different date filtering.

#### Visualizations:
- **Donut Chart:** Modify parameters in the `p.annular_wedge()` function (e.g., inner/outer radii and color palette).
- **Aggregate & Detailed Charts:** Customize chart titles, axis labels, and dimensions via HoloViews options.

#### Data Export:
- Update file paths or add new formats in the section that saves CSV files.

## Setup and Running

1. **Install Dependencies:**  
   Make sure the following Python packages are installed:
   - `pandas`
   - `yfinance`
   - `panel`
   - `holoviews`
   - `bokeh`

   Install them with:
   ```bash
   pip install pandas yfinance panel holoviews bokeh