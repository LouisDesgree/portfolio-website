# MODULE 6 - Data Munging 
#
# (c) Copyright 2015-2024 - AMULET Analytics
# ---------------------------------------------------------------

# ---------------------------------------------------------------
# Random sampling of a data frame (before we start munging)
# ---------------------------------------------------------------

# Use popular iris data set
data(iris)
? iris

dim(iris)
# [1] 150   5

# First create an index of the random sample
# Use default replace=F to not allow duplicate selections
sample_index <-sample(1:nrow(iris), 10, replace=FALSE)
sample_index

# Now use the index to select observations
sample_set <- iris[sample_index,]
sample_set

# ---------------------------------------------------------------
# Fixing Variable Names: get rid of "old school" dots and
# upper case letters
# ---------------------------------------------------------------

# Create a test data frame with no data, just structure
df <- data.frame("Home.Address"=character(0), 
                 direction=character(0), 
                 Street=character(0), 
                 Cross.Street=character(0), 
                 Intersection=character(0), 
                 Location.Code=character(0))

# Variable names have:
# - mixed case: better to have all lower
# - name with "." as a separator, should use "_"

names(df)
# [1] "Home.Address"  "direction"     "Street"        "Cross.Street" 
# [5] "Intersection"  "Location.Code"

# ---------------------------------------------------------------
# Convert to all lower case
names(df) <- tolower(names(df))   
names(df)     
# [1] "home.address"  "direction"     "street"        "cross.street" 
# [5] "intersection"  "location.code"

# ---------------------------------------------------------------
# Use gsub() to replace . with _ in variable names
names(df) <- sapply(names(df), function(x) gsub(pattern="\\.", 
                                                replacement="_", 
                                                x=x))
names(df)
# [1] "home_address"  "direction"     "street"        "cross_street" 
# [5] "intersection"  "location_code"

# ---------------------------------------------------------------
# Create New Variables
# ---------------------------------------------------------------

# Sample dataset: Customer purchase data
cust <- data.frame(
  customer_id = 1:5,
  purchase_amount = c(150, 80, 220, 45, 300),
  purchase_date = as.Date(c("2023-07-15", "2023-07-20", "2023-08-05", "2023-08-10", "2023-08-15"))
)

# Make copy of original df
cust_transformed <- cust

# Create 3 new variables

# Add is_high_value feature which is a logical class
# indicating customer who have a purchase_amount beyond
# some threshold value. 
cust_transformed$is_high_value <- 
  cust_transformed$purchase_amount > 200

# Add days_since_purchase feature which is a numeric 
# class containing the number of days since last 
# purchase
cust_transformed$days_since_purchase <- 
  as.numeric(Sys.Date() - cust_transformed$purchase_date)

# Add purchase_month feature to yield the full month
# name using %B
cust_transformed$purchase_month <- 
  format(x=cust_transformed$purchase_date, format="%B")

class(cust_transformed$purchase_month)
# [1] "character"


# ---------------------------------------------------------------
# Discretize Numeric Variables
# ---------------------------------------------------------------

data(airquality)      # Use airquality data set from base R

airquality$Ozone[1:10]   # Display first 10 Ozone values
# [1] 41 36 12 18 NA 28 23 19  8 NA

# Use seq() function to define "buckets"
seq(0,200,by=25)
#[1]   0  25  50  75 100 125 150 175 200

? cut          # Convert numeric to factor

# NOTE: What happens if a data point lands on a bucket boundary, 
# e.g. will 50 land in (25,50] or [50,75) bucket? This is 
# controlled by "right" argument.
#
# See observation 90 with Ozone=50
# right=TRUE (default): bucket is (25,50], the lower bucket
# right=FALSE: bucket is [50,75), the higher bucket
ozoneRanges <- cut(airquality$Ozone, 
                   right=FALSE, 
                   breaks=seq(0,200,by=25))

# Factor names like "(25,50]" indicate range of values 
ozoneRanges[1:10]
# [1] (25,50] (25,50] (0,25]  (0,25]  <NA>    (25,50] (0,25]  (0,25]  (0,25] 
# [10] <NA>   
#  8 Levels: (0,25] (25,50] (50,75] (75,100] (100,125] (125,150] ... (175,200]

class(ozoneRanges)
# [1] "factor"

# Argument: useNA says whether to include NA values in the table
# <NA> becomes one of the buckets
table(ozoneRanges, useNA="ifany")  # Counts for each bucket
# ozoneRanges
# (0,25]   (25,50]   (50,75]  (75,100] (100,125] (125,150] (150,175] 
# 50        32        12        15         5         1         1 
# (175,200]      <NA> 
#  0        37

# ---------------------------------------------------------------
# Add ozoneRanges to data frame
airquality_copy <- airquality   # Make copy first!

# Create new variable in data frame
airquality_copy$ozoneRanges <- ozoneRanges

head(airquality_copy)  # Compare Ozone vs. ozoneRanges

#   Ozone Solar.R Wind Temp Month Day ozoneRanges
# 1    41     190  7.4   67     5   1     (25,50]
# 2    36     118  8.0   72     5   2     (25,50]
# 3    12     149 12.6   74     5   3      (0,25]
# 4    18     313 11.5   62     5   4      (0,25]
# 5    NA      NA 14.3   56     5   5        <NA>
# 6    28      NA 14.9   66     5   6     (25,50]

# ---------------------------------------------------------------
# Discretize Numeric Variables using EQUAL WIDTH buckets

data(iris)

# Save min/max values for Sepal.Length
maxSepLen <- max(iris$Sepal.Length)
minSepLen <- min(iris$Sepal.Length)

buckets <- 10    # Pick number of buckets

# Create custom breaks vector
cutPoints <- seq(minSepLen, 
                 maxSepLen, 
                 by=(maxSepLen-minSepLen)/buckets)
cutPoints
#[1] 4.30 4.66 5.02 5.38 5.74 6.10 6.46 6.82 7.18 7.54 7.90

# Use cutPoints vector to convert numeric to factor
cutSepLen <- cut(iris$Sepal.Length,
                 breaks=cutPoints,
                 include.lowest=TRUE)

# New data frame with original Sepal.Length and discretized 
# version
newiris <- data.frame(contSepLen=iris$Sepal.Length, 
                      discSepLen=cutSepLen)
head(newiris)

#  contSepLen  discSepLen
#1        5.1 (5.02,5.38]
#2        4.9 (4.66,5.02]
#3        4.7 (4.66,5.02]
#4        4.6  [4.3,4.66]
#5        5.0 (4.66,5.02]
#6        5.4 (5.38,5.74]

# ---------------------------------------------------------------
# Date Handling
# ---------------------------------------------------------------

# Use popular lubridate package, part of Tidyverse
#install.packages("lubridate")
library(lubridate)

# Use Lakers 2008-2009 basketball data set from lubridate package
data(lakers)      # 34624x13
? lakers          # Review data dictionary

df <- lakers      # Make a copy for testing

class(df$date)    # Integer vector!
class(df$time)    # Character vector!

# Integers are in yyyymmdd format
str(df$date)      # Display structure of df$date variable
# int [1:34624] 20081028 20081028 20081028 20081028 20081028 20081028 20081028 20081028 20081028 20081028 ...

# ---------------------------------------------------------------
# Combine date and time variables into single R date-time object
playdate <- df$date[1]    # Integer
playdate
#[1] 20081028

playtime <- df$time[1]    # Character
playtime
#[1] "12:00"

# Use paste() to concatenate strings so we get "ISO 8601 format" 
playdatetime <- paste(playdate, playtime)
playdatetime
#[1] "20081028 12:00"

# Use parse_date_time() from lubridate
playdatetime <- parse_date_time(x=playdatetime, 
                                orders="%y-%m-%d %H.%M")

# Note: defaults to tz="UTC" (Coordinated Universal Time)
# UTC is the primary time standard globally used to regulate 
# clocks and time. Time zones around the world are expressed 
# using positive or negative offsets from UTC.

# To get full list of time zones use base R function:  
OlsonNames()

Sys.timezone()         # Current time zone
# [1] "America/Los_Angeles"

playdatetime
# [1] "2008-10-28 12:00:00 UTC"
class(playdatetime)
# [1] "POSIXct" "POSIXt" 

# ---------------------------------------------------------------
# Use ymd() from lubridate to parse dates with YMD components 
# into R date-time object
df$date <- ymd(df$date)     # Parse dates in integer format
str(df$date)
# POSIXct[1:34624], format: "2008-10-28" "2008-10-28" "2008-10-28" "2008-10-28" "2008-10-28" ...
class(df$date)
# [1] "Date"

# Now create a new variable: PlayDateTime with combined date & 
# time parse_date_time() from lubridate package parses an input 
# vector into POSIXct date-time object.
df$PlayDateTime <- parse_date_time(x=paste(df$date, df$time), 
                                   orders="%y-%m-%d %H.%M")

class(df$PlayDateTime)
#[1] "POSIXct" "POSIXt" 

# Show new variable in POSIXCT class format, with tz
df$PlayDateTime[1]
# [1] "2008-10-28 12:00:00 UTC"

# NOTE: tz not displayed below, or in RStudio browser view
str(df$PlayDateTime)
# POSIXct[1:34624], format: "2008-10-28 12:00:00" "2008-10-28 11:39:00" "2008-10-28 11:37:00" ...

# May now remove date and time variables
df$date <- NULL
df$time <- NULL


# ---------------------------------------------------------------
# Creating binary categorical variables
# ---------------------------------------------------------------

# Use popular iris data set from base R
data(iris)         # 150x5

# Save 3 levels from Species factor variable
species_cat <- levels(iris$Species)
species_cat
#[1] "setosa"     "versicolor" "virginica"

# Define a user defined function to build a logical map of
# Species variable based on passed value
binarySpecies <- function(c) {return(iris$Species == c)}

# Test the binarySpecies function
# Binary map of whether Species=="versicolor"
binarySpecies("versicolor")  

# Now use sapply to loop through all Species levels
newVars <- sapply(species_cat, binarySpecies)
newVars[50:55,]

#     setosa versicolor virginica
#[1,]   TRUE      FALSE     FALSE
#[2,]  FALSE       TRUE     FALSE
#[3,]  FALSE       TRUE     FALSE
#[4,]  FALSE       TRUE     FALSE
#[5,]  FALSE       TRUE     FALSE
#[6,]  FALSE       TRUE     FALSE

class(newVars)
#[1] "matrix"

# Now combine new binary categorical variables with original iris df
bin_iris <- iris       # Make copy of data set first

bin_iris$setosa <- newVars[,1]       # Include setosa binaries
bin_iris$versicolor <- newVars[,2]   # Include versicolor binaries
bin_iris$virginica <- newVars[,3]    # Include virginica binaries

head(bin_iris)

names(bin_iris)
#[1] "Sepal.Length" "Sepal.Width"  "Petal.Length" "Petal.Width"  "Species"     
#[6] "setosa"       "versicolor"   "virginica"


# ---------------------------------------------------------------
# Merging data frames using merge() function
#
# merge() simulates various SQL joins:
# full outer join
# left outer join
# right outer join
# inner (natural) join
# ---------------------------------------------------------------

# Create two test data frames
df1 <- data.frame(id = 1:6,                                  
                  x1 = c(5, 1, 4, 9, 1, 2),
                  x2 = c("A", "Y", "G", "F", "G", "Y"))
df1
#  id x1 x2
#1  1  5  A
#2  2  1  Y
#3  3  4  G
#4  4  9  F
#5  5  1  G
#6  6  2  Y

df2 <- data.frame(id = 4:9,                                  
                  y1 = c(3, 3, 4, 1, 2, 9),
                  y2 = c("a", "x", "a", "x", "a", "x"))
df2
#  id y1 y2
#1  4  3  a
#2  5  3  x
#3  6  4  a
#4  7  1  x
#5  8  2  a
#6  9  9  x

# ---------------------------------------------------------------
# INNER JOIN: include only the rows where id matches
merge(df1, df2, all=FALSE)   
#  id x1 x2 y1 y2
#1  4  9  F  3  a
#2  5  1  G  3  x
#3  6  2  Y  4  a

# ---------------------------------------------------------------
# LEFT OUTER JOIN: include all rows from df1
merge(df1, df2, by = "id", all.x = TRUE)     
#  id x1 x2 y1   y2
#1  1  5  A NA <NA>
#2  2  1  Y NA <NA>
#3  3  4  G NA <NA>
#4  4  9  F  3    a
#5  5  1  G  3    x
#6  6  2  Y  4    a

# ---------------------------------------------------------------
# RIGHT OUTER JOIN: include all rows from df2
merge(df1, df2, by = "id", all.y = TRUE) 
#  id x1   x2 y1 y2
#1  4  9    F  3  a
#2  5  1    G  3  x
#3  6  2    Y  4  a
#4  7 NA <NA>  1  x
#5  8 NA <NA>  2  a
#6  9 NA <NA>  9  x

# ---------------------------------------------------------------
# FULL OUTER JOIN: include rows from both df1 and df2
 merge(df1, df2, by = "id", all = TRUE)  
#  id x1   x2 y1   y2
#1  1  5    A NA <NA>
#2  2  1    Y NA <NA>
#3  3  4    G NA <NA>
#4  4  9    F  3    a
#5  5  1    G  3    x
#6  6  2    Y  4    a
#7  7 NA <NA>  1    x
#8  8 NA <NA>  2    a
#9  9 NA <NA>  9    x


# ---------------------------------------------------------------
# Sorting data sets
# ---------------------------------------------------------------

# Three ways to work with the order of elements in R objects:

x <- c(0, 20, 10, 15)        #Define a vector

# SORT vector
sort(x)          # Rearranges elements in ascending order
#[1]  0 10 15 20

# ORDER vector
order(x)         # Return index of each element in sorted order
#[1] 1 3 4 2

# RANK vector
rank(x)   # Assign a rank to each element in vector (smallest = 1)         
#[1] 1 4 2 3

# Data sorting is any process that involves arranging the data 
# into some meaningful order to make it easier to understand, 
# analyze or visualize. In data science, sorting is a common 
# method used for visualizing data in a form that makes it 
# easier to comprehend the story the data is telling.

# Use base R data set mtcars: Motor Trend Car Road Tests
data(mtcars)
? mtcars

# Sort by mpg
sortedData <- mtcars[order(mtcars$mpg),]

# Sort by cyl and mpg
sortedData <- mtcars[order(mtcars$cyl, mtcars$mpg),]


# ---------------------------------------------------------------
# Reshape data sets
#
# "Wide" vs. "long" format for data sets. You need wide-format 
# for some types of data analysis and long-format data for 
# others. 
# ---------------------------------------------------------------

# NOTE: can also use functions in tidyr package (from tidyverse) 
# for reshaping. See pivot_longer() and pivot_wider()
# Tutorial: https://dcl-wrangle.stanford.edu/pivot_advanced.html
# Tutorial: https://blog.methodsconsultants.com/posts/data-pivoting-with-tidyr/
# The goal of tidyr is to help you create tidy data. 

# Need reshape2 package (by Hadley Wickham) for its 
# melt() function
# install.packages("reshape2")
library(reshape2)

# Create a small test data frame in wide-format
wide <- as.data.frame(matrix(c(4,5,1,4,2,3), 
                             byrow=TRUE, 
                             nrow=3))
wide 
#  V1 V2
#1  4  5
#2  1  4
#3  2  3

# Assign column names
names(wide) <- c("Quiz 1", "Quiz 2")
wide
#  Quiz 1 Quiz 2
#1      4      5
#2      1      4
#3      2      3

# Add a new student name column
wide$student <- c("Ellen", "Catherine", "Stephen")
wide

#  Quiz 1 Quiz 2   student
#1      4      5     Ellen
#2      1      4 Catherine
#3      2      3   Stephen

# ---------------------------------------------------------------
# Melt takes wide-format data and melts it into long-format data
# args:
# data: data frame to melt
# id.vars: variable(s) used to identify each long row
# variable.name: name of variable used to store measured variable names
# value.name: name of variable use to store values

# Simple melt with no variable/value naming
long <- melt(data=wide, 
             id.vars="student")
long
#    student variable value
#1     Ellen   Quiz 1     4
#2 Catherine   Quiz 1     1
#3   Stephen   Quiz 1     2
#4     Ellen   Quiz 2     5
#5 Catherine   Quiz 2     4
#6   Stephen   Quiz 2     3

# Now add variable/value naming (control column naming)
long <- melt(data=wide, 
             id.vars="student", 
             variable.name="Quiz", 
             value.name="Score")
long
#    student   Quiz Score
#1     Ellen Quiz 1     4
#2 Catherine Quiz 1     1
#3   Stephen Quiz 1     2
#4     Ellen Quiz 2     5
#5 Catherine Quiz 2     4
#6   Stephen Quiz 2     3

long[order(long$student),]    # Sort by student to group scores
#    student   Quiz Score
#2 Catherine Quiz 1     1
#5 Catherine Quiz 2     4
#1     Ellen Quiz 1     4
#4     Ellen Quiz 2     5
#3   Stephen Quiz 1     2
#6   Stephen Quiz 2     3

# For a short tutorial on reshaping a data frame using the
# airquality dataset: https://seananderson.ca/2013/10/19/reshape/


# ---------------------------------------------------------------
# Data Manipulation Using dplyr
#
# dplyr is a package designed specifically for data munging
# ---------------------------------------------------------------

# Use the dplyr package that is part of the Tidyverse

#install.packages("tidyverse")  # Can install ALL packages
#install.packages("dplyr")      # Can install ONE package
library(dplyr)

# ---------------------------------------------------------------
# as_tibble() function casts base R data frame to a tibble (tbl)
#
# A data frame tbl wraps a local data frame. One advantage 
# of using a tbl_df over a regular data frame is the printing: 
# tbl objects only print a few rows and all the columns that 
# fit on one screen, describing the rest of it as text.

data(ToothGrowth)          # Load base R data frame
? ToothGrowth 

class(ToothGrowth)
# [1] "data.frame"

ToothGrowth_tbl <- as_tibble(ToothGrowth)   # Cast to tbl
ToothGrowth_tbl            # Print first 10 rows by default

print(ToothGrowth_tbl, n=20)  # Print first 20 rows

# Print all rows
print(ToothGrowth_tbl, n=(nrow(ToothGrowth_tbl)))  

class(ToothGrowth_tbl)
# [1] "tbl_df"     "tbl"        "data.frame"


# ---------------------------------------------------------------
data("starwars")       # Load dplyr tibble
starwars
? starwars             # Data set of Stars Wars characters

# ---------------------------------------------------------------
# filter() allows you to select a subset of rows in a data frame.
# Example: select all characters with light skin color and brown 
# eyes
starwars %>% filter(skin_color == "light", eye_color == "brown")

# Same as using base R subsetting:
starwars[starwars$skin_color=="light" & starwars$eye_color=="brown",]

# ---------------------------------------------------------------
# arrange() is used to order/sort rows in a tibble 

starwars %>% arrange(height, mass) # 2-level ascending sort

# Use desc() to sort tibble by a column in descending order
starwars %>% arrange(desc(height))


# ---------------------------------------------------------------
# slice() - subset rows using their positions. Lets you select 
# rows from a tibble by row number

# Example: We can get row numbers 5 through 10.
starwars %>% slice(5:10)

# Example: helper function slice_head() to select first n rows
starwars %>% slice_head(n = 3)

# Example: helper function slice_sample() for random sample
starwars %>% slice_sample(n = 5)

# Example: Use the option prop to choose a certain proportion of 
# the row in a tibble.
starwars %>% slice_sample(prop = 0.1)

# Example: Use slice_min() and slice_max() select rows with 
# highest or lowest values of a variable. Note that we first 
# must choose only the values which are not NA.
starwars %>%
  filter(!is.na(height)) %>%
  slice_max(height, n = 3)

# Example: you can also save output of a pipe series to a new
# tibble
new_starwars = starwars %>% slice(5:10)


# ---------------------------------------------------------------
# Often you work with large data sets with many columns but only 
# a few are actually of interest to you. select() allows you to 
# rapidly zoom in on a useful subset of columns in a tibble.

# Example: Select columns by name
starwars %>% select(hair_color, skin_color, eye_color)

# Example: Select all columns between hair_color and eye_color 
# (inclusive)
starwars %>% select(hair_color:eye_color)

# Example: Select all columns except those from hair_color 
# to eye_color (inclusive)
starwars %>% select(!(hair_color:eye_color))

# Example: Select all columns ending with color using helper 
# function ends_with() 
starwars %>% select(ends_with("color"))


# ---------------------------------------------------------------
# Besides selecting sets of existing columns, it's often 
# useful to add new columns that are functions of existing 
# columns. This is the job of mutate():

# Example: calculate height in meters, where height is in
# centimeters, creating new variable height_m
starwars %>% mutate(height_m = height / 100)  # Added on right

# Example: Make reorder columns height_m and height using
# helper function everything() 
starwars %>%
  mutate(height_m = height / 100) %>%
  select(height_m, height, everything())


# Example: mutate() allows you to refer to columns that you've 
# just created. Here, BMI is created, and then referenced later 
# in the pipeline.
starwars %>%
  mutate(
    height_m = height / 100,
    BMI = mass / (height_m^2)
  ) %>%
  select(BMI, everything())

# Example: If you only want to keep the new variables in
# result set use transmute():
starwars %>%
  transmute(
    height_m = height / 100,
    BMI = mass / (height_m^2)
  )


# ---------------------------------------------------------------
# Moving around columns in a base R data frame is a lot of work. 
# With dplyr you can change column order with relocate()

# Example: move column group (sex, gender, homeworld) to before 
# height
starwars %>% relocate(sex:homeworld, .before = height)


# ---------------------------------------------------------------
# Aggregation of values with summarize(). Here we calculate
# the mean of the height column

# Example: 
starwars %>% summarize(mean_height = mean(height, na.rm = TRUE))
# A tibble: 1 × 1
# mean_height
#       <dbl>
# 1      174.

# ---------------------------------------------------------------
# To pipe or not to pipe! Three ways to code a mini-pipeline

# Example 1: No pipe using dplyr functions where intermediate 
# results are saved
a1 <- group_by(starwars, species, sex)
a2 <- select(a1, height, mass, species, sex)
a3 <- summarize(a2,
                mean_height = mean(height, na.rm = TRUE),
                mean_mass = mean(mass, na.rm = TRUE)
)


# Example 2: using nested function calls
summarize(
  select(
    group_by(starwars, species, sex),
    height, mass
  ),
  height = mean(height, na.rm = TRUE),
  mass = mean(mass, na.rm = TRUE)
)

# Example 3: now using dplyr pipes
starwars_height_mass = starwars %>%
  group_by(species, sex) %>%
  select(height, mass) %>%
  summarize(
    height = mean(height, na.rm = TRUE),
    mass = mean(mass, na.rm = TRUE)
  )
print(starwars_height_mass, n=nrow(starwars_height_mass))


# ---------------------------------------------------------------
# The NEW pipe in version 4.1.0 of R released May 18, 2021
#
# Can use |> instead of %>%

data(mtcars)

mtcars |>
  group_by(cyl) |>
  summarize(mean_mpg=mean(mpg)) |>
  arrange(mean_mpg)
#     cyl mean_mpg
#   <dbl>    <dbl>
# 1     8     15.1
# 2     6     19.7
# 3     4     26.7


# ---------------------------------------------------------------
# Final example of using dplyr: 
# Cast from char to num, add new column supp_num with dplyr 
# mutate(), scatterplot trick to add 3rd variable

# Create a new variable supp_num
# OJ coerced to 1
# VC coerced to 2
ToothGrowth_tbl <- mutate(ToothGrowth, supp_num=as.numeric(supp))   

# To avoid repeating data frame name below  
attach(ToothGrowth_tbl)       
# Scatterplot (needed for homework)
plot(len~dose, pch=supp_num)  

# ---------------------------------------------------------------
# Handling missing data
# ---------------------------------------------------------------

#install.packages("e1071")
library(e1071)    # Needed for impute()  

# Create some missing data in iris data set
iris_missing_data <- iris           # Make copy first

# Assign NA to arbitrary variables
iris_missing_data[5,1] <- NA
iris_missing_data[7,3] <- NA
iris_missing_data[10,4] <- NA

# See missing values
iris_missing_data[1:10, -5]
#   Sepal.Length Sepal.Width Petal.Length Petal.Width 
#1           5.1         3.5          1.4         0.2  
#2           4.9         3.0          1.4         0.2  
#3           4.7         3.2          1.3         0.2  
#4           4.6         3.1          1.5         0.2  
#5            NA         3.6          1.4         0.2  
#6           5.4         3.9          1.7         0.4 
#7           4.6         3.4           NA         0.3  
#8           5.0         3.4          1.5         0.2  
#9           4.4         2.9          1.4         0.2  
#10          4.9         3.1          1.5          NA  

# impute the missing data values replacing NAs with mean 
# (also available is what='median')
iris_repaired <- impute(iris_missing_data[,1:4], what='mean')
class(iris_repaired)
#[1] "matrix" "array"

# Replace original variables with imputed variables
iris_missing_data$Sepal.Length <- iris_repaired[,1]
iris_missing_data$Sepal.Width <- iris_repaired[,2]
iris_missing_data$Petal.Length <- iris_repaired[,3]
iris_missing_data$Petal.Width <- iris_repaired[,4]

# ---------------------------------------------------------------
# Feature Scaling
# ---------------------------------------------------------------

# Why scaling is needed: the features variables with high 
# magnitudes will weigh in a lot more in the distance 
# calculations used in some ML algorithms than feature 
# variables with low magnitudes.

# METHOD: scale(), with default settings, will calculate 
# the mean and standard deviation of the entire vector, 
# then "scale" each element using those values by 
# subtracting the mean and dividing by the sd.

# Age vector
age <- c(25, 35, 50)
# Salary vector
salary <- c(200000, 1200000, 2000000)
# Data frame created using age and salary
df <- data.frame( "Age" = age, "Salary"=salary)
df
#  Age  Salary
#1  25  200000
#2  35 1200000
#3  50 2000000

# Perform z-score standardization using R's built-in 
# scale() function.
dfNormZ <- as.data.frame(scale(df[1:2]))
dfNormZ
#Age      Salary
#1 -0.9271726 -1.03490978
#2 -0.1324532  0.07392213
#3  1.0596259  0.96098765








