# MLR, Stepwise, Best Subsets, & Classification Documentation

Step5 provides a comprehensive modeling interface for financial returns data. It implements multiple approaches for regression and classification including Multiple Linear Regression (MLR), Stepwise Regression, Best Subsets selection, and Logistic Regression for classification. The tool evaluates model performance using metrics such as R², RMSE, p-values (for regression), and accuracy (for classification), and automatically generates conclusions regarding model quality.

## Features

- **Multiple Modeling Approaches:**  
  - **MLR:** Fits all selected predictors using ordinary least squares (OLS) and displays coefficients with p-values.
  - **Stepwise Regression:** Iteratively adds or removes predictors based on p-value thresholds to identify significant variables.
  - **Best Subsets:** Searches for the optimal combination of predictors (up to a specified limit) that maximize R² or minimize RMSE.
  - **Classification (Logistic Regression):** For binary targets, provides accuracy and classification reports.

- **Performance Metrics:**  
  - **Regression:** Displays R², RMSE, and p-values for each predictor.
  - **Classification:** Shows accuracy and a detailed classification report.
  - **Visualizations:**  
    - Distribution plots (histogram and density) for the target variable.
    - Actual vs. Predicted line charts for regression results.
    - Correlation heatmap of returns.

- **Automatic Conclusions:**  
  Generates brief insights based on model performance (e.g., weak, moderate, or strong predictive power).

- **Navigation:**  
  Provides links to navigate back to the previous analysis step (Step 5) or to proceed to the Neural Network-based model.

## Technologies Used

- **Python 3:** Core programming language.
- **Pandas & NumPy:** Data manipulation and numerical computations.
- **Panel & HoloViews (hvPlot):** Building interactive dashboards and visualizations.
- **Statsmodels & scikit-learn:** Statistical modeling, regression analysis, and classification.
- **mlxtend:** Exhaustive feature selection for best subsets modeling.
- **Bokeh:** Underlying plotting engine for interactive visualizations.

## How It Works

1. **Data Preparation:**
   - The application reads financial returns from `shared_data.df_prices` and computes daily percentage changes.
   - A correlation heatmap of the returns is generated to visualize relationships between tickers.

2. **User Configuration:**
   - **Target Selection:**  
     Users select a target ticker (returns) from the available options.
   - **Predictor Selection:**  
     A slider determines the number of top predictors (based on correlation with the target) to consider.
   - **Model Approach:**  
     Users choose between "MLR", "Stepwise", "Best Subsets", or "Classification (Logistic)".
   - An explanation pane updates automatically to describe the selected modeling approach.

3. **Model Training & Evaluation:**
   - The data is split into training (80%) and testing (20%) subsets.
   - Depending on the chosen approach:
     - **MLR:** Uses all selected predictors to fit an OLS model.
     - **Stepwise:** Iteratively selects significant predictors based on p-value thresholds.
     - **Best Subsets:** Uses exhaustive feature selection (up to a set limit) to identify the best combination.
     - **Classification:** Applies Logistic Regression for binary targets.
   - Model performance is evaluated using R² and RMSE (for regression) or accuracy (for classification).
   - The application displays a summary of coefficients, performance metrics, and a generated conclusion regarding model quality.
   - A line chart compares actual versus predicted values for regression approaches.

4. **Visualizations & Distribution:**
   - Alongside the modeling results, the tool shows the distribution of daily returns using histograms and density plots.
   - A correlation heatmap is provided to help understand the relationships among predictors.

5. **Navigation:**
   - Links are provided to go back to Step 5 or proceed to the Neural Network-based model page.

## Running the Application

1. **Install Dependencies:**  
   Ensure that the following packages are installed:
   ```bash
   pip install numpy pandas panel holoviews hvplot scikit-learn statsmodels mlxtend bokeh