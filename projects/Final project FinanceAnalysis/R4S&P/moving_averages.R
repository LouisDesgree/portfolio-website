# ============================================================
# 1. Libraries
# ============================================================
# If tidyquant or zoo are not installed, uncomment and run:
# install.packages("tidyquant")
# install.packages("zoo")

library(tidyquant)  # For tq_get() to download Yahoo data
library(dplyr)      # For data wrangling
library(zoo)        # For rollapply (rolling means)
library(ggplot2)    # (Optional, if you want ggplot-based approaches)

# ============================================================
# 2. Define Tickers and Date Range
# ============================================================
tech_list <- c("AAPL", "GOOG", "MSFT", "AMZN")

end_date   <- Sys.Date()
start_date <- end_date - 365  # last 1 year

# ============================================================
# 3. Download Stock Data from Yahoo Finance
# ============================================================
stock_data <- tq_get(
  tech_list,
  from = start_date,
  to   = end_date,
  get  = "stock.prices"
)

# We’ll focus on 'symbol', 'date', 'adjusted' (equivalent to 'Adj Close'), and 'volume'.

# ============================================================
# 4. Split Data into a List of Data Frames
#    (One data frame per ticker)
# ============================================================
# This is similar to "company_list" in your Python code:
# e.g. AAPL, GOOG, MSFT, AMZN as separate data frames.

stock_list <- split(stock_data, stock_data$symbol)
# Now stock_list[["AAPL"]] is Apple’s data, etc.

# ============================================================
# 5. Define a Function to Add Moving Averages
# ============================================================
add_mas <- function(df, ma_days = c(10, 20, 50)) {
  # df is a data frame with 'adjusted' column
  for (ma in ma_days) {
    col_name <- paste0("MA_", ma, "_days")
    # Use rollapply from zoo to compute the rolling mean
    df[[col_name]] <- rollapply(
      df$adjusted,
      width = ma,
      FUN   = mean,
      align = "right",
      fill  = NA
    )
  }
  return(df)
}

# ============================================================
# 6. Apply the Function to Each Company's Data
# ============================================================
ma_days <- c(10, 20, 50)

for (ticker in tech_list) {
  stock_list[[ticker]] <- add_mas(stock_list[[ticker]], ma_days)
}

# Now each data frame has columns:
# "MA_10_days", "MA_20_days", "MA_50_days"

# ============================================================
# 7. Create a 2×2 Plot of Adjusted Close + MAs for Each Ticker
#    Using Base R
# ============================================================
# This replicates your Python subplots approach.

par(mfrow = c(2, 2),  # 2 rows, 2 columns
    oma = c(0, 0, 2, 0),  # outer margins (optional)
    mar = c(4, 4, 2, 1))  # inner margins for each subplot

plot_ticker_ma <- function(df, main_title) {
  # Plot the adjusted close
  plot(df$date, df$adjusted, type = "l", col = "black", lwd = 2,
       main = main_title,
       xlab = "Date", ylab = "Price (USD)")
  
  # Add lines for each MA
  if ("MA_10_days" %in% names(df)) {
    lines(df$date, df$MA_10_days, col = "red", lwd = 1.5)
  }
  if ("MA_20_days" %in% names(df)) {
    lines(df$date, df$MA_20_days, col = "blue", lwd = 1.5)
  }
  if ("MA_50_days" %in% names(df)) {
    lines(df$date, df$MA_50_days, col = "green", lwd = 1.5)
  }
}

# Subplot 1: AAPL
plot_ticker_ma(stock_list[["AAPL"]], "APPLE")

# Subplot 2: GOOG
plot_ticker_ma(stock_list[["GOOG"]], "GOOGLE")

# Subplot 3: MSFT
plot_ticker_ma(stock_list[["MSFT"]], "MICROSOFT")

# Subplot 4: AMZN
plot_ticker_ma(stock_list[["AMZN"]], "AMAZON")

title("Adjusted Close + Moving Averages (10, 20, 50 days)", outer = TRUE)

# ============================================================
# 8. (Optional) Show Last 6 Rows of AAPL for Debug
# ============================================================
cat("\n=== AAPL Last 6 Rows ===\n")
tail(stock_list[["AAPL"]])

cat("\n--- End of Moving Averages Analysis ---\n")

