# ============================================================
# Title: Tech Stocks Daily Return Analysis
# ============================================================

# 1. Libraries
# If needed:
# install.packages("tidyquant")
library(tidyquant)
library(dplyr)

# 2. Define Tickers and Date Range
tech_list <- c("AAPL", "GOOG", "MSFT", "AMZN")
end_date   <- Sys.Date()
start_date <- end_date - 365  # last 1 year

# 3. Download Stock Data from Yahoo Finance
stock_data <- tq_get(
  tech_list,
  from = start_date,
  to   = end_date,
  get  = "stock.prices"
)

# 4. Split Data into a List of Data Frames
#    (similar to Python's "company_list")
stock_list <- split(stock_data, stock_data$symbol)

# 5. Compute Daily Returns for Each Ticker
#    daily_return = (adjusted - lag(adjusted)) / lag(adjusted)
for (ticker in tech_list) {
  df <- stock_list[[ticker]]
  
  # daily_return as percentage (e.g., 0.01 => 1%)
  df$daily_return <- (df$adjusted - dplyr::lag(df$adjusted)) / dplyr::lag(df$adjusted) * 100
  
  stock_list[[ticker]] <- df
}

# Optional mapping for nicer subplot titles
company_names <- c(
  AAPL = "APPLE",
  GOOG = "GOOGLE",
  MSFT = "MICROSOFT",
  AMZN = "AMAZON"
)

# ------------------------------------------------------------
# 6. Plot Daily Return (2×2 Grid)
# ------------------------------------------------------------
par(mfrow = c(2, 2),  # 2 rows, 2 columns
    oma = c(0, 0, 2, 0),  # outer margins
    mar = c(4, 4, 2, 1))  # inner margins

for (ticker in tech_list) {
  df <- stock_list[[ticker]]
  plot(
    df$date, df$daily_return,
    type = "o",      # line + points
    lty  = 2,        # dashed line (like '--')
    pch  = 16,       # solid circle marker
    main = company_names[ticker],
    xlab = "Date",
    ylab = "Daily Return (%)"
  )
}
title("Daily Return Over Time", outer = TRUE)

# ------------------------------------------------------------
# 7. Plot Histograms of Daily Return (2×2 Grid)
# ------------------------------------------------------------
par(mfrow = c(2, 2))  # reset 2×2 layout

for (ticker in tech_list) {
  df <- stock_list[[ticker]]
  
  hist(
    df$daily_return,
    breaks = 50,
    main   = company_names[ticker],
    xlab   = "Daily Return (%)",
    col    = "lightblue",
    border = "black"
  )
}
title("Distribution of Daily Returns", outer = FALSE)

# ------------------------------------------------------------
# 8. End of Script
# ------------------------------------------------------------
cat("\n--- End of Tech Stocks Daily Return Analysis ---\n")

