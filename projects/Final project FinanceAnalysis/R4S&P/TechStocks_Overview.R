# ===================================================================
# 1. Install (If Needed) and Load Libraries
# ===================================================================
# If tidyquant is not installed, uncomment and run:
# install.packages("tidyquant")

library(tidyquant)
library(dplyr)
library(ggplot2)

# ===================================================================
# 2. Define Tickers and Date Range
# ===================================================================
tech_list <- c("AAPL", "GOOG", "MSFT", "AMZN")

end_date   <- Sys.Date()
start_date <- end_date - 365  # last 1 year

# ===================================================================
# 3. Download Stock Data from Yahoo Finance
# ===================================================================
stock_data <- tq_get(tech_list,
                     from = start_date,
                     to   = end_date,
                     get  = "stock.prices")

# ===================================================================
# 4. (Optional) Add a "company_name" Column
# ===================================================================
mapping <- tibble(
  symbol       = c("AAPL", "GOOG", "MSFT", "AMZN"),
  company_name = c("APPLE", "GOOGLE", "MICROSOFT", "AMAZON")
)

stock_data_joined <- stock_data %>%
  left_join(mapping, by = "symbol")

# ===================================================================
# 5. Quick Inspection of Combined Data
# ===================================================================
cat("\n=== Last 10 Rows of Combined Data ===\n")
tail(stock_data_joined, 10)

# (Optional) Quick line plot of close price for all tickers:
# ggplot(stock_data_joined, aes(x = date, y = close, color = symbol)) +
#   geom_line() +
#   labs(title = "Tech Stocks Closing Prices (Last 1 Year)",
#        x = "Date", y = "Close (USD)") +
#   theme_minimal()

# ===================================================================
# 6. Create a List of Data Frames, One per Ticker
#    (Similar to Python's "company_list")
# ===================================================================
# In Python, you'd do something like:
#   for stock in tech_list:
#       company_list.append( that_stock_df )
#
# In R, we can split stock_data_joined by 'symbol':
company_list <- split(stock_data_joined, stock_data_joined$symbol)

# Now company_list[["AAPL"]] is the data for Apple, etc.

# ===================================================================
# 7. Plot Adjusted Closing Price for Each Ticker (2x2 grid)
# ===================================================================
# In Python, you used subplots with a 2x2 layout. 
# We'll do the same in base R by setting par(mfrow=c(2,2)).

# Make sure to open a new plotting device or ensure your plotting window
# is large enough to see the subplots clearly.

par(mfrow = c(2, 2))  # 2 rows, 2 columns

for (i in seq_along(tech_list)) {
  ticker <- tech_list[i]
  # Each sub-dataframe
  df <- company_list[[ticker]]
  
  # Tidyquant columns: 
  # "adjusted" is the adjusted close (equivalent to "Adj Close" in Python).
  plot(df$date, df$adjusted, type = "l",
       main = paste("Adjusted Close of", ticker),
       xlab = "", ylab = "Adjusted Close (USD)")
}

# ===================================================================
# 8. Plot Volume for Each Ticker (2x2 grid)
# ===================================================================
par(mfrow = c(2, 2))  # reset 2x2 layout

for (i in seq_along(tech_list)) {
  ticker <- tech_list[i]
  df <- company_list[[ticker]]
  
  plot(df$date, df$volume, type = "l",
       main = paste("Sales Volume for", ticker),
       xlab = "", ylab = "Volume")
}

# ===================================================================
# End of Script
# ===================================================================