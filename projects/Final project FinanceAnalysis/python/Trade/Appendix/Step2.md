# Universal Data Cleaner and Visualizer

This Step loads financial data from shared memory, evaluates its quality, and performs strict cleaning to remove any missing or negative values. It then visualizes the data quality both before and after cleaning to ensure the dataset is ready for AI/ML training.

## Features

- **Data Quality Visualization:**  
  - Pie chart shows the distribution of clean, NA, and corrupted rows.
  - Line chart highlights missing data points with red markers.

- **Strict Cleaning Process:**  
  - Drops rows with any missing (NA) or negative values.
  - Provides a before/after comparison of data quality.

## Technologies Used

- **Python 3:** Core programming language.
- **Pandas:** Data manipulation.
- **Panel & HoloViews:** Interactive dashboards and plotting.
- **Bokeh:** Rendering charts.

## How It Works

1. **Data Quality Assessment:**  
   - The `classify_rows` function counts clean rows, rows with NA, and corrupted rows (rows with negative values).
   - A Bokeh pie chart (`create_bokeh_pie`) visualizes these counts.
   - A HoloViews line chart (`create_line_chart_with_na`) shows missing data points.

2. **Data Cleaning:**  
   - The `strict_clean_data` function removes rows with missing or negative values.
   - The app then updates the shared data and presents a side-by-side comparison (before and after cleaning) using pie charts and line charts.

3. **User Interaction:**  
   - A "Refresh Data" button updates the quality metrics and displays the original data.
   - A "Clean Data" button executes the cleaning process and shows updated visualizations.

## Modifying the Project

- **Data Quality Rules:**  
  - Adjust the conditions in `classify_rows` or `strict_clean_data` to change which rows are considered NA or corrupted.
  
- **Visualization Customization:**  
  - Modify parameters in `create_bokeh_pie` and `create_line_chart_with_na` (such as colors, sizes, or labels) to suit your preferences.

- **Integration:**  
  - The app uses `shared_data.df_prices` as the data source. Update this shared data or change the data loading logic if needed.

## Setup and Running

1. **Install Dependencies:**  
   Ensure you have the following Python packages installed:
   ```bash
   pip install pandas panel holoviews bokeh