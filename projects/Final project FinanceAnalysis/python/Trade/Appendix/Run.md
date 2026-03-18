## Running the Project

Follow these steps to run the MLR, Stepwise, Best Subsets, & Classification application:

1. **Install Dependencies:**  
   Ensure that you have Python 3 installed and run the following command to install all required packages:
   ```bash
   pip install numpy pandas panel holoviews hvplot scikit-learn statsmodels mlxtend bokeh

2.	**Prepare Your Data:**
	Make sure that your financial data is loaded into shared_data.df_prices.
	The script will compute daily returns from this data, so ensure the data is correctly formatted.
3.	**Run the Script:**
   ```bash
panel serve Trade/sp500_data_loader.py Trade/sp500_step2.py Trade/sp500_step3.py Trade/sp500_step4.py Trade/sp500_step5.py Trade/sp500_Neural.py --autoreload --show