# AI Forecasting Tool with Data Cleaning

This tool leverages **NeuralProphet** to perform forecasting with integrated data cleaning. It reindexes input data to daily frequency, removes invalid rows, and trains a model that produces forecasts, residuals, and accuracy metrics.

---

## Features

- **Data Cleaning:**  
  - Reindexes data to daily frequency and fills missing values.
  - Removes rows where the target value is ≤ 0 or missing.
- **Forecasting with NeuralProphet:**  
  - Trains a model using a specified number of past days (lags).
  - Incorporates exogenous variables (other tickers) to aid forecasting.
- **Visualization:**  
  - **Actual vs Forecast:** Shows the full timeline comparison.
  - **Residuals:** Displays differences (Actual - Forecast).
  - **Future-Only Forecast:** Highlights forecasted values beyond historical data.
  - **Accuracy:** Plots percentage error on historical predictions.
- **Automatic Conclusions:**  
  - Summarizes trend direction and model bias based on residuals.

---

## Technologies Used

- **Python 3:** Primary programming language.
- **Pandas & NumPy:** For data manipulation and numerical operations.
- **Panel & HoloViews (with hvPlot):** For interactive web app and plotting.
- **NeuralProphet:** For time series forecasting with deep learning.

---

## How It Works

1. **Data Preparation & Cleaning:**  
   - Select a target ticker and optional exogenous tickers from the shared data.
   - Cleans the data by filtering out non-positive or missing values.
   - Reindexes the data to ensure daily frequency, filling small gaps.

2. **Model Training:**  
   - Converts the dataset to the required format (`ds` for date, `y` for target, and `ar_i` for exogenous variables).
   - Configures NeuralProphet with specified lags and forecast horizon.
   - Trains the model and displays training metrics.

3. **Forecasting & Visualization:**  
   - Creates a future dataframe and predicts future values.
   - Generates interactive plots for:
     - **Forecast vs Actual:** Full timeline comparison.
     - **Residuals:** Helps identify prediction bias.
     - **Future-Only Forecast:** Isolated view of forecasted days.
     - **Accuracy:** Percentage error over the historical period.
   - Displays an automatic summary of the trend and model performance.

---

## Modifying the Project

- **Target & Exogenous Tickers:**  
  - Update the source data in `shared_data.df_prices` or adjust widget options in `_get_tickers()`.
- **Forecast Parameters:**  
  - Change the forecast horizon via `horizon_slider`.
  - Adjust the number of lags using `n_lags_slider`.
- **Data Cleaning Rules:**  
  - Modify cleaning steps in `_run_forecast` as needed (e.g., altering conditions for filtering data).
- **Visualizations:**  
  - Customize plots (titles, colors, dimensions) by updating the corresponding HoloViews and hvPlot options.

---

## Setup and Running

1. **Install Dependencies:**  
   Ensure the following packages are installed:
   - `pandas`, `numpy`, `panel`, `holoviews`, `hvplot`, `neuralprophet`
   
   Use:
   ```bash
   pip install pandas numpy panel holoviews hvplot neuralprophet