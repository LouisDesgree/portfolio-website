# Detailed Univariate Analysis & Automatic Insights Documentation

Step4 provides an in-depth univariate analysis for a selected financial ticker. It generates a comprehensive statistical summary along with several interactive visualizations and concise interpretations. The tool is designed to help users quickly understand the distribution characteristics of the chosen ticker's data.

## Features

- **Key Summary Statistics Table:**  
  Displays count, mean, median, standard deviation, min, Q1, Q3, max, skewness, and kurtosis.

- **Kernel Density Estimate (KDE) Plot:**  
  Offers a smooth view of the data distribution with an automatic interpretation of whether the distribution is right-skewed, left-skewed, or fairly symmetric.

- **Histogram:**  
  Shows the frequency distribution of data values and provides insights into the spread of the data.

- **Box Plot:**  
  Highlights quartiles, medians, and potential outliers (using the 1.5×IQR rule).

- **Violin Plot:**  
  Combines density estimation with box plot elements for deeper visual clarity.

- **Cumulative Distribution Function (CDF) Plot:**  
  Displays the cumulative probability distribution to emphasize data density regions.

- **Navigation:**  
  Includes links to return to Step 3 or proceed to Step 5 (labeled as Step 5 even though it actually corresponds to Step 6).

## How It Works

1. **Ticker Selection:**  
   Users choose a ticker from a dropdown list populated with numeric columns from the shared financial data.

2. **Statistical Summary:**  
   A summary table is generated with key metrics (Count, Mean, Median, Std Dev, Min, Q1, Q3, Max, Skewness, Kurtosis). This table rounds the values for clarity.

3. **Visualizations and Interpretations:**
   - **KDE Plot:**  
     Displays a density curve with a text interpretation explaining the skewness and the relationship between mean and median.
   - **Histogram:**  
     Illustrates the frequency of values and reiterates insights similar to the KDE.
   - **Box Plot:**  
     Visualizes quartiles and identifies outliers. An interpretation text notes if any outliers exist beyond 1.5×IQR.
   - **Violin Plot:**  
     Combines the box plot’s quartile information with density estimates to show data clusters.
   - **CDF Plot:**  
     Presents the cumulative distribution to indicate data concentration at different levels.

4. **Automatic Interpretations:**  
   Each plot is accompanied by a brief explanation that interprets the plot, helping users understand whether the distribution is skewed and if there are outliers.

5. **Interactive Updates:**  
   The analysis updates automatically when a new ticker is selected from the dropdown.

## Technologies Used

- **Python 3:** Core language.
- **Pandas & NumPy:** For data manipulation and statistical calculations.
- **Panel & HoloViews (hvPlot):** To create interactive dashboards and visualizations.
- **Shared Data Module:** The application uses `shared_data.df_prices` as its data source.

## Setup and Running the Application

1. **Install Dependencies:**  
   Make sure the following packages are installed:
   ```bash
   pip install pandas numpy panel holoviews hvplot