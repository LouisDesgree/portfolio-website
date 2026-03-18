# ============================================================
# Title: Tech Stocks Correlation & Pairwise Plots
# ============================================================

# 1. Libraries
# ------------------------------------------------------------
# If needed:
install.packages("tidyquant")
install.packages("GGally")
install.packages("reshape2")
install.packages("pheatmap")  # or "corrplot"

library(tidyquant)  # For tq_get() to download Yahoo data
library(dplyr)      # For data wrangling
library(tidyr)      # For pivoting wide/long
library(reshape2)   # For melting correlation matrices
library(GGally)     # For ggpairs (like sns.pairplot)
library(pheatmap)   # For correlation heatmaps
# library(corrplot) # (alternative to pheatmap)

# 2. Define Tickers and Date Range
# ------------------------------------------------------------
tech_list <- c("AAPL", "GOOG", "MSFT", "AMZN")
end_date   <- Sys.Date()
start_date <- end_date - 365  # last 1 year

# 3. Download Stock Data from Yahoo Finance
# ------------------------------------------------------------
stock_data <- tq_get(
  tech_list,
  from = start_date,
  to   = end_date,
  get  = "stock.prices"
)

# 4. Create Wide DataFrame of Adjusted Close
#    (Equivalent to 'closing_df' in Python)
# ------------------------------------------------------------
# We'll pivot so each ticker is a separate column.
closing_df <- stock_data %>%
  select(symbol, date, adjusted) %>%
  pivot_wider(names_from = symbol, values_from = adjusted) %>%
  arrange(date)

# 5. Compute Daily Returns (pct_change)
#    (Equivalent to 'tech_rets' in Python)
# ------------------------------------------------------------
# We'll use a helper function to get daily returns as a percentage
pct_change <- function(x) {
  (x - dplyr::lag(x)) / dplyr::lag(x) * 100
}

# Apply pct_change to each column (except 'date')
tech_rets <- closing_df %>%
  mutate(across(-date, pct_change)) %>%
  arrange(date)

# We'll drop the first row (which is NA from lag) to avoid issues
tech_rets <- tech_rets %>% drop_na()

# 6. Jointplot-Like Example: Compare GOOG vs. MSFT Returns
#    (Equivalent to sns.jointplot)
# ------------------------------------------------------------
library(ggplot2)

cat("\n=== Plotting GOOG vs. MSFT Daily Returns (jointplot style) ===\n")
ggplot(tech_rets, aes(x = GOOG, y = MSFT)) +
  geom_point(color = "purple", alpha = 0.6) +
  geom_smooth(method = "lm", color = "black") +
  labs(
    title = "Daily Returns: GOOG vs. MSFT",
    x = "GOOG Daily Return (%)",
    y = "MSFT Daily Return (%)"
  ) +
  theme_minimal()

# 7. Pairplot-Like Example: Compare All Tickers' Returns
#    (Equivalent to sns.pairplot(tech_rets, kind='reg'))
# ------------------------------------------------------------
# We'll use GGally::ggpairs for a matrix of scatter plots + regression lines
cat("\n=== Pairwise Plots of All Tech Daily Returns ===\n")
ggpairs(
  tech_rets %>% select(-date),
  lower = list(continuous = wrap("smooth", color = "blue", alpha = 0.5)),
  diag  = list(continuous = wrap("barDiag", fill = "orange")),
  upper = list(continuous = wrap("cor", size = 5))
) +
  labs(title = "Pairwise Scatter Plots of Tech Daily Returns")

# 8. Another Pairplot-Like for 'closing_df' (Optional)
#    to see correlation among closing prices
# ------------------------------------------------------------
cat("\n=== Pairwise Plots of Closing Prices ===\n")
ggpairs(
  closing_df %>% select(-date),
  lower = list(continuous = wrap("smooth", color = "red", alpha = 0.5)),
  diag  = list(continuous = wrap("barDiag", fill = "lightblue")),
  upper = list(continuous = wrap("cor", size = 5))
) +
  labs(title = "Pairwise Scatter Plots of Tech Closing Prices")

# 9. Heatmaps of Correlations (Daily Returns vs. Closing)
# ------------------------------------------------------------
cat("\n=== Correlation Heatmaps ===\n")

# 9a. Correlation of daily returns
rets_cor <- cor(tech_rets %>% select(-date), use = "complete.obs")

# 9b. Correlation of closing prices
price_cor <- cor(closing_df %>% select(-date), use = "complete.obs")

# We'll create a 2×2 layout for these two heatmaps
par(mfrow = c(1, 2))  # 1 row, 2 columns

pheatmap(rets_cor,
         main = "Correlation of Stock Returns",
         display_numbers = TRUE,
         color = colorRampPalette(c("yellow", "white", "blue"))(50))

pheatmap(price_cor,
         main = "Correlation of Stock Closing Prices",
         display_numbers = TRUE,
         color = colorRampPalette(c("yellow", "white", "blue"))(50))

cat("\n--- End of Tech Stocks Correlation Script ---\n")

