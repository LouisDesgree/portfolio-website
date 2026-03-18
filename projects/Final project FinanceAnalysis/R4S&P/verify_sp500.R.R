# --- Libraries ---
library(tidyverse)
library(lubridate)

# --- 1. Define File Paths & Read Data ---
sp500_base_path <- "~/Desktop/FinanceAnalysis/s&p500"

# 1a. Read Index Data
sp500_index <- read_csv(file.path(sp500_base_path, "sp500_index.csv")) %>%
  mutate(Date = as.Date(Date, format = "%Y-%m-%d")) %>%
  arrange(Date)

# 1b. Read Companies Data
sp500_companies <- read_csv(file.path(sp500_base_path, "sp500_companies.csv")) %>%
  rename(Ticker = Symbol) %>%        # <--- FIX: Rename Symbol -> Ticker
  mutate(Ticker = toupper(Ticker)) %>%
  distinct()

# 1c. Read Individual Stocks Data
sp500_stocks <- read_csv(file.path(sp500_base_path, "sp500_stocks.csv")) %>%
  rename(Ticker = Symbol) %>%        # <--- FIX: Rename Symbol -> Ticker
  mutate(
    Ticker = toupper(Ticker),
    Date   = as.Date(Date, format = "%Y-%m-%d")
  ) %>%
  arrange(Ticker, Date)
# --- 2. Data Verification & Cleaning ---

# 2a. Check Missing Values
cat("\n=== Missing Values Summary ===\n")
cat("sp500_index:\n")
print(sp500_index %>% summarise_all(~ sum(is.na(.))))
cat("\nsp500_companies:\n")
print(sp500_companies %>% summarise_all(~ sum(is.na(.))))
cat("\nsp500_stocks:\n")
print(sp500_stocks %>% summarise_all(~ sum(is.na(.))))

# 2b. Check for Duplicate Keys
# sp500_index: Expect unique dates
dup_index <- sp500_index %>% group_by(Date) %>% filter(n() > 1)
if(nrow(dup_index) > 0) {
  cat("\nDuplicate dates found in sp500_index:\n")
  print(dup_index)
} else {
  cat("\nNo duplicate dates in sp500_index.\n")
}

# sp500_companies: Expect unique Tickers
dup_companies <- sp500_companies %>% group_by(Ticker) %>% filter(n() > 1)
if(nrow(dup_companies) > 0) {
  cat("\nDuplicate tickers found in sp500_companies:\n")
  print(dup_companies)
} else {
  cat("\nNo duplicate tickers in sp500_companies.\n")
}

# sp500_stocks: Expect unique (Ticker, Date)
dup_stocks <- sp500_stocks %>%
  group_by(Ticker, Date) %>%
  filter(n() > 1)
if(nrow(dup_stocks) > 0) {
  cat("\nDuplicate (Ticker, Date) found in sp500_stocks:\n")
  print(dup_stocks)
} else {
  cat("\nNo duplicate (Ticker, Date) in sp500_stocks.\n")
}

# --- 3. Demonstrate "Database" Relationships ---

# We can join sp500_stocks to sp500_companies by Ticker to add company info (e.g., sector).
# This is similar to having a dimension table (sp500_companies) and fact table (sp500_stocks).

sp500_stocks_joined <- sp500_stocks %>%
  left_join(sp500_companies, by = "Ticker")

# Example: If sp500_companies has columns: Ticker, CompanyName, Sector, etc.
# Now sp500_stocks_joined will have these columns as well.

# We can also (optionally) join sp500_index by Date if we want to compare
# individual stock performance to the index on the same day:
# sp500_stocks_joined <- sp500_stocks_joined %>%
#   left_join(sp500_index %>% select(Date, `S&P500`), by = "Date")

# --- 4. Summaries & Quick Analysis ---

# 4a. Summary of Index
index_summary <- sp500_index %>%
  summarise(
    start_date       = min(Date, na.rm = TRUE),
    end_date         = max(Date, na.rm = TRUE),
    total_days       = n(),
    avg_index_value  = mean(`S&P500`, na.rm = TRUE)
  )

cat("\n=== S&P 500 Index Summary ===\n")
print(index_summary)

# 4b. Summary of Companies
company_summary <- sp500_companies %>%
  summarise(
    total_companies = n_distinct(Ticker)
  )

cat("\n=== S&P 500 Companies Summary ===\n")
print(company_summary)

# If sp500_companies includes a 'Sector' column, for instance:
#   we can see how many companies are in each sector
if("Sector" %in% colnames(sp500_companies)) {
  cat("\nCompanies by Sector:\n")
  print(sp500_companies %>%
          count(Sector) %>%
          arrange(desc(n)))
}

# 4c. Summary of Stock Prices
# For example, average closing price by Ticker or by Sector
# Assuming sp500_stocks has columns: Ticker, Date, Open, Close, Volume, ...
# (Adjust as needed for your actual column names.)

stock_summary <- sp500_stocks_joined %>%
  group_by(Ticker) %>%
  summarise(
    avg_close  = mean(Close, na.rm = TRUE),
    total_rows = n()
  ) %>%
  ungroup() %>%
  arrange(desc(avg_close))

cat("\n=== Stock Summary (Avg Close per Ticker) ===\n")
print(head(stock_summary, 10))  # Show top 10

# If Sector data is available, we can also group by Sector:
if("Sector" %in% colnames(sp500_stocks_joined)) {
  sector_summary <- sp500_stocks_joined %>%
    group_by(Sector) %>%
    summarise(
      avg_close_sector = mean(Close, na.rm = TRUE),
      total_obs        = n()
    ) %>%
    ungroup() %>%
    arrange(desc(avg_close_sector))
  
  cat("\n=== Average Close Price by Sector ===\n")
  print(sector_summary)
}

# --- 5. Example Plots ---

# 5a. Plot the overall S&P 500 Index over time
plot_index <- ggplot(sp500_index, aes(x = Date, y = `S&P500`)) +
  geom_line(color = "blue") +
  labs(title = "S&P 500 Index Over Time", x = "Date", y = "Index Value") +
  theme_minimal()

print(plot_index)

# 5b. If we have daily closes for multiple tickers, let's see how they vary by sector (example)
if("Sector" %in% colnames(sp500_stocks_joined)) {
  # We'll look at a single snapshot or average across time for demonstration
  # For instance, let's take the last date in the data set for each Ticker
  latest_stocks <- sp500_stocks_joined %>%
    group_by(Ticker) %>%
    filter(Date == max(Date, na.rm = TRUE)) %>%
    ungroup()
  
  plot_sector_box <- ggplot(latest_stocks, aes(x = Sector, y = Close, fill = Sector)) +
    geom_boxplot() +
    labs(title = "Distribution of Closing Prices by Sector (Latest Date)",
         x = "Sector", y = "Closing Price") +
    theme_minimal() +
    theme(axis.text.x = element_text(angle = 45, hjust = 1))
  
  print(plot_sector_box)
}

# -------------------------------------------------------------------
# Notes on the "Database" Structure:
#   - sp500_companies: dimension table (Ticker is unique key)
#   - sp500_stocks: fact table (Ticker + Date is composite key)
#   - sp500_index: separate table keyed by Date for the overall index
#   - Common merges:
#       sp500_stocks -> sp500_companies by Ticker
#       sp500_stocks -> sp500_index by Date
#   - This approach lets you slice and dice S&P 500 data by date, sector, etc.
# -------------------------------------------------------------------
