# Financial Analysis and EDA Overview Documentation

This Step 3 provides a comprehensive financial analysis and exploratory data analysis (EDA) platform. It integrates multiple interactive sections to help users understand the quality and distribution of financial data, derive statistical insights, and answer essential business questions.

## Overview

The tool is organized into nine sections:

1. **Data Overview:**
   Displays summary information about the loaded data (tickers, row count, timeframe) along with an interactive line chart showing price trends over time.

2. **Central Tendency:**  
   Explains the measures of central tendency (Mean, Median, Mode) and provides LaTeX-formatted formulas for each metric.

3. **Variability:**  
   Presents variability metrics using the 5-number summary, Interquartile Range (IQR), and Standard Deviation. A Markdown table summarizes these metrics for each ticker.

4. **Univariate Visualization:**  
   Introduces different plot types (density, box, violin, bar, dot/strip plots) to explore individual variable distributions.

5. **Box Plots:**  
   Generates box plots for each ticker to highlight key quartiles, medians, and potential outliers.

6. **Distribution Examples:**  
   Demonstrates examples of left-skewed, symmetric, and right-skewed distributions with corresponding histograms.

7. **Automatic Conclusions:**  
   Provides beginner-friendly insights by comparing skewness and the relationship between the mean and median for each ticker.

8. **Summary & Key Takeaways:**  
   Summarizes the overall analysis with key points and a navigation link to proceed to the next analysis step.

9. **Financial Business Questions:**  
   An interactive section that addresses key financial questions such as:
   - Total trading days.
   - Overall return from the first to the last price.
   - Highest single-day close and its frequency.
   - Average monthly closing prices (displayed via a bar chart).

## Technologies Used

- **Python 3**
- **Pandas & NumPy:** Data manipulation and numerical computations.
- **Panel & HoloViews (with hvPlot):** Building interactive dashboards and visualizations.
- **LaTeX:** Rendering mathematical formulas for statistical measures.
- **Shared Data Module:** Uses `shared_data.df_prices` for the input financial data.

## How It Works

### 1. Data Overview
- **Data Summary:**  
  Displays the list of tickers, total number of rows, and the timeframe (start and end dates).
- **Interactive Chart:**  
  Shows a line chart of price trends over time.

### 2. Measures of Central Tendency
- **Explanations & Formulas:**  
  Provides definitions and LaTeX-formatted formulas for Mean, Median, and Mode, clarifying how each metric describes the data center.

### 3. Measures of Variability
- **Statistical Summary:**  
  Computes the 5-number summary (Min, Q1, Median, Q3, Max), IQR, and Standard Deviation for each ticker.
- **Tabular Display:**  
  A Markdown table summarizes these metrics for easy comparison.

### 4. Univariate Visualization
- **Plot Types:**  
  Introduces various plots (density, box, violin, bar, dot/strip) to explore individual variable behavior.

### 5. Box Plots
- **Visualization:**  
  Generates box plots for each ticker to reveal quartiles, median, and any outliers present in the data.

### 6. Distribution Examples
- **Histograms:**  
  Illustrates different distribution shapes (left-skewed, symmetric, right-skewed) to provide insights into the data spread.

### 7. Automatic Conclusions
- **Insights Generation:**  
  Analyzes each ticker’s data to provide quick insights on skewness and the relationship between the mean and median, highlighting potential data issues or trends.

### 8. Summary & Key Takeaways
- **Consolidated Insights:**  
  Recaps the analysis findings and offers key takeaways, along with a link to proceed to the next step.

### 9. Financial Business Questions
- **Interactive Analysis:**  
  Allows users to select a ticker and answers key financial questions:
  - **Trading Days:** Total number of trading sessions.
  - **Overall Return:** Percentage change from the first to the last closing price.
  - **Highest Single-Day Close:** Maximum closing price and its date.
  - **Frequency of Highest Close:** How often the highest close occurred.
  - **Average Monthly Close:** Presents a bar chart to visualize monthly averages.

## Running the Application

1. **Install Dependencies:**  
   Ensure that the following packages are installed:
   ```bash
   pip install pandas numpy panel holoviews hvplot