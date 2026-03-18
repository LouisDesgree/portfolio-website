# UCLA Extension
# Introduction to Data Science COM SCI X 450.1
# Instructor: Daniel D. Gutierrez
# HOMEWORK 2
# Louis Desgrée

# QUESTION 1

# Install and load the required package for SQL-based operations
# Uncomment if not installed
# install.packages("sqldf")
library(sqldf)

# Calculate the average uptake grouped by Type using SQL
average_uptake <- sqldf("SELECT Type, AVG(uptake) AS avg_uptake FROM CO2 GROUP BY Type")
average_uptake
# Output:
#         Type avg_uptake
# 1 Mississippi   20.88333
# 2      Quebec   33.54286


# QUESTION 2

# Define the vectors for the dataset
Died.At <- c(22, 40, 72, 41)
Writer.At <- c(16, 18, 36, 36)
First.Name <- c("John", "Edgar", "Walt", "Jane")
Second.Name <- c("Doe", "Poe", "Whitman", "Austen")
Sex <- c("MALE", "MALE", "MALE", "FEMALE")
Date.Of.Death <- c("2015-05-10", "1849-10-07", "1892-03-26", "1817-07-18")

# Create the data frame df
df <- data.frame(
  Died.At = Died.At,
  Writer.At = Writer.At,
  First.Name = First.Name,
  Second.Name = Second.Name,
  Sex = Sex,
  Date.Of.Death = Date.Of.Death
)
df
# Output:
#   Died.At Writer.At First.Name Second.Name    Sex Date.Of.Death
# 1      22        16       John         Doe   MALE   2015-05-10
# 2      40        18      Edgar         Poe   MALE   1849-10-07
# 3      72        36       Walt     Whitman   MALE   1892-03-26
# 4      41        36       Jane      Austen FEMALE   1817-07-18

# Cast the Sex variable to a factor
df$Sex <- as.factor(df$Sex)

# Print the structure of the updated data frame
str(df)
# Output:
# 'data.frame':    4 obs. of  6 variables:
#  $ Died.At     : num  22 40 72 41
#  $ Writer.At   : num  16 18 36 36
#  $ First.Name  : chr  "John" "Edgar" "Walt" "Jane"
#  $ Second.Name : chr  "Doe" "Poe" "Whitman" "Austen"
#  $ Sex         : Factor w/ 2 levels "FEMALE","MALE": 2 2 2 1
#  $ Date.Of.Death: chr  "2015-05-10" "1849-10-07" "1892-03-26" "1817-07-18"

# Rename the columns for clarity
names(df) <- c("age_at_death", "age_as_writer", "first_name", "surname", "gender", "date_died")
df
# Output:
#   age_at_death age_as_writer first_name  surname  gender   date_died
# 1           22           16       John      Doe    MALE  2015-05-10
# 2           40           18      Edgar      Poe    MALE  1849-10-07
# 3           72           36       Walt  Whitman    MALE  1892-03-26
# 4           41           36       Jane   Austen  FEMALE  1817-07-18

# Convert the date_died column to Date format
df$date_died <- as.Date(df$date_died)

# Calculate John Doe's birthdate
john_birthdate <- df$date_died[df$first_name == "John" & df$surname == "Doe"] - 
  (df$age_at_death[df$first_name == "John" & df$surname == "Doe"] * 365.25)
john_birthdate
# Output:
# [1] "1993-05-09"


# QUESTION 3

# Install and load the reshape2 package for reshaping data
# Uncomment if not installed
# install.packages("reshape2")
library(reshape2)

# Create the observations_wide data frame
product <- c("A", "B")
height <- c(10, 20)
width <- c(5, 10)
weight <- c(2, NA)
observations_wide <- data.frame(product, height, width, weight)

# Reshape the data to long format
observations_long <- melt(
  observations_wide, 
  id.vars = "product", 
  variable.name = "variable", 
  value.name = "value", 
  na.rm = TRUE
)

# Sort the reshaped data
observations_long <- observations_long[order(observations_long$product, observations_long$variable), ]
observations_long
# Output:
#   product variable value
# 1       A   height    10
# 3       A    width     5
# 5       A   weight     2
# 2       B   height    20
# 4       B    width    10


# QUESTION 4

# Load the mtcars dataset and calculate average mpg by cylinder

calculate_avg_mpg <- function(data, group_var, value_var) {
  # Split the data based on group_var
  split_data <- split(data[[value_var]], data[[group_var]])
  
  # Initialize a vector for averages
  averages <- numeric(length(split_data))
  names(averages) <- names(split_data)
  
  # Loop to calculate averages
  for (group in names(split_data)) {
    averages[group] <- mean(split_data[[group]])
  }
  
  return(averages)
}

mpg_averages <- calculate_avg_mpg(mtcars, "cyl", "mpg")
mpg_averages
# Output:
#        4        6        8 
# 26.66364 19.74286 15.10000

# QUESTION 5

# Load the mtcars dataset to calculate horsepower differences by cylinder type

# Calculate the average horsepower for 4-cylinder cars
avg_hp_4cyl <- mean(mtcars$hp[mtcars$cyl == 4])

# Calculate the average horsepower for 8-cylinder cars
avg_hp_8cyl <- mean(mtcars$hp[mtcars$cyl == 8])

# Calculate the absolute difference between the two averages
absolute_difference <- abs(avg_hp_4cyl - avg_hp_8cyl)
absolute_difference
# Output:
# [1] 126.5779


# QUESTION 6

# Load the airquality dataset and calculate the mean temperature for June

# Subset temperatures for the month of June
mean_temp_june <- mean(airquality$Temp[airquality$Month == 6], na.rm = TRUE)
mean_temp_june
# Output:
# [1] 79.1


# QUESTION 7

# Load the dplyr package for data manipulation
# Uncomment if not installed
# install.packages("dplyr")
library(dplyr)

# Calculate mean mpg by transmission type and sort the results
result <- mtcars %>%
  group_by(am) %>%
  summarize(mean_mpg = mean(mpg)) %>%
  arrange(mean_mpg)

result
# Output:
# # A tibble: 2 x 2
#      am mean_mpg
#   <dbl>    <dbl>
# 1     0     17.1
# 2     1     24.4


# QUESTION 8

# Load the scatterplot3d package for 3D visualization
# Uncomment if not installed
# install.packages("scatterplot3d")
library(scatterplot3d)

# Create a 3D scatterplot for weight, displacement, and mpg
scatterplot3d(
  x = mtcars$wt,
  y = mtcars$disp,
  z = mtcars$mpg,
  color = "blue",
  pch = ifelse(mtcars$am == 1, 16, 17),  # Shape based on transmission type
  main = "3D Scatter Plot: Weight, Displacement, and MPG",
  xlab = "Weight (1000 lbs)",
  ylab = "Displacement (cu.in.)",
  zlab = "Miles per Gallon"
)

# Add a legend to describe point shapes
legend(
  x = "topright",
  legend = c("Manual (am = 1)", "Automatic (am = 0)"),
  pch = c(16, 17),
  col = "blue",
  title = "Transmission Type"
)


# QUESTION 9

# Create a histogram for CO2 uptake variable

# Generate a histogram with defined aesthetics
uptake_histogram <- hist(
  x = CO2$uptake,
  breaks = 20,
  main = "Histogram of CO2 Uptake",
  xlab = "Uptake (µmol/m²/sec)",
  ylab = "Frequency",
  col = "cornflowerblue",
  border = "black",
  plot = TRUE
)

# Display histogram break points and counts
break_points <- uptake_histogram$breaks
break_points
# [1]  6  8 10 12 14 16 18 20 22 24 26 28 30 32 34 36 38 40 42 44 46

cell_counts <- uptake_histogram$counts
cell_counts
# [1] 1 1 6 5 5 5 7 3 1 2 5 3 7 5 6 3 8 5 4 2


# QUESTION 10

# Create a boxplot for mpg by gear type

# Generate the boxplot
boxplot(
  formula = mpg ~ gear,
  data = mtcars,
  main = "Miles Per Gallon by Gear Type",
  xlab = "Number of Forward Gears",
  ylab = "Miles Per Gallon",
  col = "gray",
  varwidth = TRUE
)

# The label designated to the "Y" axis is not showing and I have no idea why

# Add a manual label to the Y-axis
mtext("Miles Per Gallon", side = 2, line = 3, cex = 1.2)
