# MODULE 7 - Exploratory Data Analysis (numeric)
#
# (c) Copyright 2015-2024 - AMULET Analytics
# ---------------------------------------------------------------

# ---------------------------------------------------------------
# Probability distributions
#
# Many statistical tools and techniques used in data science 
# are based on probability. Probability measures how likely 
# it is for an event to occur on a scale from 0 (the event 
# never occurs) to 1 (the event always occurs.). When working 
# with data, variables in the columns of the data set can be 
# thought of as random variables: variables that vary due 
# to chance. A probability distribution describes how a 
# random variable is distributed; it tells us which values 
# a random variable is most likely to take on and which 
# values are less likely.

# In statistics, there are a range of precisely defined 
# probability distributions that have different shapes and 
# can be used to model different types of random events. 

# Knowing the distribution of data helps us better model 
# the world around us. It helps us to determine the 
# likeliness of various outcomes, or make an estimate of 
# the variability of an occurrence. All of this makes 
# knowing different probability distributions extremely 
# valuable in data science & machine learning.
#
# ---------------------------------------------------------------

# ---------------------------------------------------------------
# Generating random numbers for synthetic test data - normal 
# probability distribution using rnorm()
# ---------------------------------------------------------------

# The normal (aka Gaussian) distribution is perhaps the most 
# important distribution in all of statistics. It turns out 
# that many real world phenomena, like IQ test scores and 
# human heights, roughly follow a normal distribution, so 
# it is often used to model random variables. 

# Random number generation for the normal distribution with 
# argument "mean" equal to mean and "sd" equal to standard 
# deviation.
x <- rnorm(10, mean=0, sd=1)
x
#[1] -1.0699555 -0.5408636 -1.2404782  2.4247933 -0.1610625  0.6300392
#[7]  0.7965898  0.3648089  1.6164017  0.6919018

# 10 random numbers, normally distributed, mean=20, sd=2
x <- rnorm(10, mean=20, sd=2)
x
#[1] 21.78827 22.77555 19.77708 19.53316 21.55689 18.56826 23.19788
#[8] 18.47157 20.30528 19.34516

summary(x)


# ---------------------------------------------------------------
# Generating random numbers with seed() for experimental 
# reproducability 

rnorm(5)
#[1] -0.6264538  0.1836433 -0.8356286  1.5952808  0.3295078

# Different random numbers!
rnorm(5)
#[1] -0.8204684  0.4874291  0.7383247  0.5757814 -0.3053884

# Use same seed value to generate the same random numbers
set.seed(1)
rnorm(5)
#[1] -0.6264538  0.1836433 -0.8356286  1.5952808  0.3295078

set.seed(1)
rnorm(5)
#[1] -0.6264538  0.1836433 -0.8356286  1.5952808  0.3295078


# ---------------------------------------------------------------
# Generating random numbers for synthetic test data - Poisson 
# probability distribution using rpois()
# ---------------------------------------------------------------

# The Poisson Distribution is a discrete probability 
# distribution that is very useful in situations where the 
# discrete events occur in a continuous manner. 

# This has a huge application in many practical scenarios like: 
# - The number of calls received per minute at a call center
# - Visitors to a website
# - Movements in a stock prices
# - Number of cars arriving at a car wash during a 20 min interval

# rpois() returns a integer vector
rpois(n=10, lambda=1)    # lambda (rate) =1, vector of means
#[1] 0 0 1 1 2 1 1 4 1 2

rpois(10, 2)             # Now rate = 2 so slightly larger
#[1] 4 1 2 0 1 1 0 1 4 1

rpois(10, 20)            # Now rate = 20
#[1] 19 19 24 23 22 24 23 20 11 22


# ---------------------------------------------------------------
# Generating random numbers for synthetic test data - Binomial 
# probability distribution using rbinom()
# ---------------------------------------------------------------

# The binomial distribution model is an important probability 
# model that is used when there are two possible outcomes 
# (hence "binomial"). 

# Arguments: 
# n=1 Number of observations 
# size=1 Number of independent trials 
# prob=0.5 probability of SUCCESS for each trial (fair coin toss)

# 10 different random numbers
rbinom(n = 10, size = 1, prob = 0.5)
# [1] 0 1 0 1 1 0 1 0 1 0

# Find number of successes in 10 trials
rbinom(n = 1, size = 10, p = 0.5)
# [1] 3


# ---------------------------------------------------------------
# Using synthetic data for running linear model data experiments
# ---------------------------------------------------------------

set.seed(20)           # Set seed for reproducibility

x <- rnorm(100)        # Single predictor x
e <- rnorm(100, 0, 2)  # Error term (noise), mean=0, sd=2

# Use coefficients b1=2 (slope), b0=0.5 (y-intercept)
y <- 0.5 + 2 * x + e   # Linear model calc response y

# Simple scatter plot
plot(x, y)    # Note the linear trend


# ---------------------------------------------------------------
# Using synthetic data for running binomial data experiments
# ---------------------------------------------------------------

set.seed(10)         # Set seed for reproducibility

# Number of observations=100, number of trials=1, prob of 
# success each trial=0.5
x <- rbinom(100, 1, 0.5)    # All binary
e <- rnorm(100, 0, 2)       # Error term
y <- 0.5 + 2 * x + e

# Simple scatter plot
plot(x, y)         # X is binary with discrete values


# ---------------------------------------------------------------
# Using synthetic data for running Poisson data experiments:
# This one is called a "Poisson log-linear model"
# ---------------------------------------------------------------

set.seed(1)                # Set seed for reproducibility

# Generate 100 covariates
x <- rnorm(100)

# Compute the "log mean" of the model and then exponentiate 
# to get the mean (lambda).
# NOTE: log.mu is a vector of length 100.
log.mu <- 0.5 + 0.3 * x    

? rpois       # See lambda argument definition (can be vector)

# Call rpois() to generate 100 random variables, using vector 
# lambda
# NOTE: lambda is a vector of non-negative means, a linear 
# combination of the covariates corresponding to the ith 
# observation
y <- rpois(n=100, lambda=exp(log.mu))

# Simple scatter plot
plot(x, y)


# ---------------------------------------------------------------
# Performing counts
# ---------------------------------------------------------------

data(airquality)

# Show unique values found for a variable in order to become
# familiar with the distribution of the data.
unique(airquality$Month)       # Only month May - Sept covered
#[1] 5 6 7 8 9

# ---------------------------------------------------------------
# Count unique values for a variable using SQL
library(sqldf)
sqldf("select count(Ozone) from airquality where Ozone=11")
#  count(Ozone)
#1            3


# ---------------------------------------------------------------
# Exploring "contingency tables" aka crosstab
# ---------------------------------------------------------------

# Functions and data sets to support Venables and Ripley, "Modern 
# Applied Statistics with S" (4th edition, 2002)
# install.packages("MASS")
library(MASS)      # Large package with 170 page reference manual
data(Cars93)

? Cars93           # See data dictionary

Cars93$Type        # Factor variable with 6 levels

# Show all levels of a categorical variable (factor)
levels(Cars93$Type)
#[1] "Compact" "Large"   "Midsize" "Small"   "Sporty"  "Van"    

# Can use table() to count level values
table(Cars93$Type)
#Compact   Large Midsize   Small  Sporty     Van 
#     16      11      22      21      14       9 

# Can also compute percentages of observations represented by 
# each level
prop.table(table(Cars93$Type))
#Compact      Large    Midsize      Small     Sporty        Van 
#0.17204301 0.11827957 0.23655914 0.22580645 0.15053763 0.09677419 

sum(prop.table(table(Cars93$Type)))  # Must sum to 1
#[1] 1

# Do the same analysis for Origin
table(Cars93$Origin)
#    USA non-USA 
#     48      45 

prop.table(table(Cars93$Origin))
#      USA  non-USA 
# 0.516129 0.483871 

# Count types of cars with respect to their origin.
table(Cars93$Type, Cars93$Origin)
#        USA non-USA
#Compact   7       9
#Large    11       0
#Midsize  10      12
#Small     7      14
#Sporty    8       6
#Van       5       4

# Save table object in variable
ct1<-table(Cars93$Type, Cars93$Origin)
class(ct1)
# [1] "table"

# Sum rows of contingency table
rowSums(ct1)
#Compact   Large Midsize   Small  Sporty     Van 
#     16      11      22      21      14       9 

# Calculate frequencies (percentages) of contingency table
# prop.table() nested with table() gives frequencies.
#
# The result is a "joint probability distribution," from which 
# we can see that e.g., about 7.5% of cars are small and of 
# American origin.
prop.table(table(Cars93$Type, Cars93$Origin))
#               USA    non-USA
#Compact 0.07526882 0.09677419
#Large   0.11827957 0.00000000
#Midsize 0.10752688 0.12903226
#Small   0.07526882 0.15053763
#Sporty  0.08602151 0.06451613
#Van     0.05376344 0.04301075

# ---------------------------------------------------------------
# Chi-squared statistical test for categorical variables
# ---------------------------------------------------------------

# The most common question that arises from contingency tables 
# is if the row and column variables are independent. The most 
# basic way to answer it is to run a chi-squared statistical test
# on two categorical variables.
X <- chisq.test(Cars93$Type, Cars93$Origin)
X
#Pearson's Chi-squared test
#
#data:  Cars93$Type and Cars93$Origin
#X-squared = 14.08, df = 5, p-value = 0.01511

class(X)
#[1] "htest"

# From the above result, we can see that p-value is less than the 
# significance level (0.05). Therefore, we can conclude that 
# the two variables (Type & Origin) are not independent.

# Data scientists need to determine the relationship between 
# the independent features (predictors) and dependent variable
# (response variable). In feature selection, we aim to select 
# the features which are highly dependent on the response.


# ---------------------------------------------------------------
# Using summary() for summary statistics
# ---------------------------------------------------------------

# Summary statistics for all variables in data set
# Min: smallest value for a continuous variable
# Max: largest values for a continuous variable
# Mean: arithmetic mean (average) for a continuous variable
# Median: middle number in a sequence of values of a continuous variable
# The value of the 1st quartile (25th percentile): 
#   the value under which 25% of data points are found when they 
#   are arranged in increasing order.
# The value of the 3rd quartile (75th percentile): 
#   the value under which 75% of data points are found when they 
#   are arranged in increasing order.
# Shows # of NAs

# Automatically excludes NAs when calculating the summary statistics.

summary(airquality)

#Ozone           Solar.R           Wind       
#Min.   :  1.00   Min.   :  7.0   Min.   : 1.700  
#1st Qu.: 18.00   1st Qu.:115.8   1st Qu.: 7.400  
#Median : 31.50   Median :205.0   Median : 9.700  
#Mean   : 42.13   Mean   :185.9   Mean   : 9.958  
#3rd Qu.: 63.25   3rd Qu.:258.8   3rd Qu.:11.500  
#Max.   :168.00   Max.   :334.0   Max.   :20.700  
#NA's   :37       NA's   :7                       
#Temp           Month            Day      
#Min.   :56.00   Min.   :5.000   Min.   : 1.0  
#1st Qu.:72.00   1st Qu.:6.000   1st Qu.: 8.0  
#Median :79.00   Median :7.000   Median :16.0  
#Mean   :77.88   Mean   :6.993   Mean   :15.8  
#3rd Qu.:85.00   3rd Qu.:8.000   3rd Qu.:23.0  
#Max.   :97.00   Max.   :9.000   Max.   :31.0  

# Summary statistics for a specific variable
summary(airquality$Ozone)
#   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.    NA's 
#   1.00   18.00   31.50   42.13   63.25  168.00      37 

data(iris)

# Show count of each factor level
summary(iris)       # This data set has a categorical variable Species
# Sepal.Length    Sepal.Width     Petal.Length    Petal.Width   
#Min.   :4.300   Min.   :2.000   Min.   :1.000   Min.   :0.100  
#1st Qu.:5.100   1st Qu.:2.800   1st Qu.:1.600   1st Qu.:0.300  
#Median :5.800   Median :3.000   Median :4.350   Median :1.300  
#Mean   :5.843   Mean   :3.057   Mean   :3.758   Mean   :1.199  
#3rd Qu.:6.400   3rd Qu.:3.300   3rd Qu.:5.100   3rd Qu.:1.800  
#Max.   :7.900   Max.   :4.400   Max.   :6.900   Max.   :2.500  
#      Species  
#setosa    :50  
#versicolor:50  
#virginica :50  


# ---------------------------------------------------------------
# Simple R statistical functions
# ---------------------------------------------------------------

# Mean, Min, Max, Range, Quantile
mean(airquality$Ozone, na.rm=TRUE)
#[1] 42.12931

min(airquality$Wind)
#[1] 1.7

# When using stats functions, always use na.rm=TRUE
max(airquality$Solar.R, na.rm=TRUE)
#[1] 334

range(airquality$Month)
#[1] 5 9

# ---------------------------------------------------------------
# Variance
# ---------------------------------------------------------------

# The variance is a numerical value used to indicate how widely 
# individuals in a group vary. If individual observations vary 
# greatly from the group mean, the variance is big. In contrast, 
# A variance of 0 means all the values are identical.

# Variance is defined as the average of the "squared distances" 
# from each point to the mean. Data scientists often use variance 
# to better understand the distribution of a data set.

# Variance can never be negative, because it is the average 
# squared deviation from the mean. A related statistic is 
# "standard devation" which is the square root of the variance 
# which is a measure that is used to quantify the amount of 
# variation or dispersion of a set of data values.

# FEATURE SELECTION:
# The "variance threshold" is a simple baseline approach to 
# feature selection. It removes all features which variance 
# doesn't meet some threshold. By default, it removes all 
# zero-variance features. We assume that features with a higher 
# variance may contain more useful information,

# Use the var() function in R to compute the variance
var(airquality$Temp)
# [1] 89.59133

var(airquality$Ozone, na.rm=TRUE)
# [1] 1088.201

# --------------------------------------------------------------
# Visualize "spread" of values of a numerical variable. 
# x-axis shows rows in data frame
# Draw long-dash line using mean
# Draw short-dash line using sd
# Notice outliers in upper left corner
library(MASS)
data(UScereal)

x=UScereal$fibre

plot(x,
     xlab="Record Number",
     ylab="Grams of fibre per serving")

# Add the mean line
abline(h=mean(x), lty=2, lwd=2)

# Add the standard deviation line
abline(h=mean(x)+sd(x), lty=3, lwd=3)

# ---------------------------------------------------------------
# Quantiles
# ---------------------------------------------------------------

# You can gain some insight into the distriution of a set of
# observations by examing quantiles. 
#
# A quantile is a value computed from a numeric vector that 
# indicates an observation's rank when compared to all the 
# other observations. 
#
# For example, the median is a quantile - it gives a value below
# which half of the vector values lie. It is the 0.5th quantile.

# Terminology:
# 0 quartile = 0 quantile = 0 percentile
#
# 1 quartile = 0.25 quantile = 25 percentile
#
# 2 quartile = .5 quantile = 50 percentile (median)
#
# 3 quartile = .75 quantile = 75 percentile
#
# 4 quartile = 1 quantile = 100 percentile

# Quantiles using default arg: probs = seq(0, 1, 0.25)
# Produces sample quantiles corresponding to the specified 
# probabilities. The smallest observation corresponds to 
# a probability of 0 and the largest to a probability of 1.
quantile(airquality$Ozone, probs=seq(0,1,0.25),na.rm=TRUE)
#  0%    25%    50%    75%   100% 
#1.00  18.00  31.50  63.25 168.00 

# Example: below indicates that 25% of the Ozone values lie at
# or below 18.00 and that 75% of the Ozone values lie at or below
# 63.25
quantile(airquality$Ozone, prob=c(0.25, 0.75), na.rm=TRUE)
#   25%   75% 
# 18.00 63.25 

# And now a more detailed probability distribution
quantile(airquality$Ozone, probs=seq(0,1,0.125), na.rm=TRUE)
#     0%   12.5%     25%   37.5%     50%   62.5%     75%   87.5%     100% 
#  1.000  12.000  18.000  23.000  31.500  43.625  63.250  83.250  168.000

# ---------------------------------------------------------------
# Covariance
# ---------------------------------------------------------------

# Covariance and Correlation are used to measure the relationship 
# between two variables. Covariance measures the degree to which 
# two variables change together, while correlation is a 
# standardized measure of covariance that ranges from -1 to 1, 
# indicating the strength and direction of the relationship.

# ---------------------------------------------------------------
# Understanding the relationship between variables is important. 
# A powerful statistical tool for measuring this relationship
# is the covariance using R's cov() function. 

# Covariance is a measure that quantifies the relationship
# between two variables. It tells us how changes in one variable
# are associated with changes in another. Covariance can be 
# positive, indicating a positive relationship, negative, 
# indicating a negative relationship, or zero indicating no
# relationship at all. 

# By exploring and analyzing covariance, you can uncover
# hidden patterns, dependencies, and trends. 

# Covariance can vary between -∞ and +∞
# Covariance is affected by the changes in scale.
# Covariance is zero indicates if one variable moves and the 
#    other doesn’t.

x <- c(5, 7, 3, 6, 8)
y <- c(65, 80, 50, 70, 90)

covariance <- cov(x,y)

# For every unit increase in x there is a 29 unit increase in y
covariance
#[1] 29

# ---------------------------------------------------------------
# Covariance matrix

data(mtcars)

# Calculate the covariance matrix for the mtcars dataset
cov_matrix <- cov(mtcars)
cov_matrix

# The values along the diagonal of the matrix are simply the 
# variances of each variable. The other values in the matrix 
# represent the covariances between the various variables.

# A positive number for covariance indicates that two variables 
# tend to increase or decrease simultaneously.

# A negative number for covariance indicates that as one 
# variable increases, a second variable tends to decrease.

# ---------------------------------------------------------------
# Correlation
# ---------------------------------------------------------------

# You can calculate variable correlation with cor() in R. 
# The Pearson correlation assumes the random variables to be 
# normally distributed.

# Correlation is determined by dividing the covariance by the 
# sum of the standard deviations of the variables. It standardizes 
# the covariance. Correlation is a standardized measurement that 
# has a range of -1 to 1. It enables meaningful comparisons 
# between several variables and is independent of the magnitude 
# of the variables.

# FEATURE SELECTION:
# Correlation is a measure of the linear relationship of 2 or 
# more variables. Through correlation, we can predict one 
# variable from the other. The logic behind using correlation 
# for feature selection is that the good predictors are highly 
# correlated with the response variable. Furthermore, predictors 
# should be correlated with the response but should be 
# uncorrelated with themselves.

# If two variables are correlated, we can predict one from 
# the other. Therefore, if two features are correlated, the 
# model only really needs one of them, as the second one does 
# not add additional information.

# You must choose a threshold correlation value, say 0.5, for 
# selecting the feature variable. If we find that the features 
# are correlated with themselves, we can drop the one which 
# has a lower correlation coefficient value with the response
# variable. 

# Example: highly correlated variables
cor(iris$Sepal.Length, iris$Petal.Length)
#[1] 0.8717538

# Example: weak correlation, negative correlation: larger Wind 
# tends to have smaller Temp
cor(airquality$Wind, airquality$Temp, method="pearson")
# [1] -0.4579879

# Correlation matrix of all variables in data set. NAs in table 
# result from NAs in data set.
cor(airquality)
#        Ozone Solar.R       Wind       Temp        Month          Day
#Ozone       1      NA         NA         NA           NA           NA
#Solar.R    NA       1         NA         NA           NA           NA
#Wind       NA      NA  1.0000000 -0.4579879 -0.178292579  0.027180903
#Temp       NA      NA -0.4579879  1.0000000  0.420947252 -0.130593175
#Month      NA      NA -0.1782926  0.4209473  1.000000000 -0.007961763
#Day        NA      NA  0.0271809 -0.1305932 -0.007961763  1.000000000

# cor() does not have na.rm=TRUE argument, instead:
cor(airquality, use="complete.obs")
#               Ozone     Solar.R        Wind       Temp        Month          Day
#Ozone    1.000000000  0.34834169 -0.61249658  0.6985414  0.142885168 -0.005189769
#Solar.R  0.348341693  1.00000000 -0.12718345  0.2940876 -0.074066683 -0.057753801
#Wind    -0.612496576 -0.12718345  1.00000000 -0.4971897 -0.194495804  0.049871017
#Temp     0.698541410  0.29408764 -0.49718972  1.0000000  0.403971709 -0.096545800
#Month    0.142885168 -0.07406668 -0.19449580  0.4039717  1.000000000 -0.009001079
#Day     -0.005189769 -0.05775380  0.04987102 -0.0965458 -0.009001079  1.000000000

# ---------------------------------------------------------------
# Correlation plot

# install.packages("corrplot")
library(corrplot)

# This function has 49 arguments!

# The plot shows many relationships quickly:
# - Ellipses that are narrow and elongated indicate strong 
#   correlations between the variables. Rounder, less elongated 
#   ellipses indicate weaker associations.
# - Darker colors indicate stronger correlations, versus 
#   lighter colors
# - Positive correlations are if ellipse slopes from lower left 
#   to upper right, and negative if it slopes from the upper 
#   left to the lower right.
# - Having the numerical values for the correlations in the 
#   lower triangle helps quantify the results.

par(xpd=TRUE)  # Because corrplot() use of margins is quirky
corrplot(cor(na.omit(airquality)), 
         method="ellipse", 
         type="upper",
         cl.pos="n",
         tl.pos="diag",
         mar = c(2, 0, 4, 0))
corrplot(cor(na.omit(airquality)),
         method="number",
         type="lower",
         tl.pos="n",
         cl.pos="n",
         add=TRUE)

# ---------------------------------------------------------------
# Calculate a cumulative sum
# ---------------------------------------------------------------

# Example: Subset Ozone values for May, removing NAs
sub_Ozone <- with(airquality, 
                  subset(Ozone, Month ==5 & !is.na(Ozone)))
cumsum(sub_Ozone)
#[1]  41  77  89 107 135 158 177 185 192 208 219 233 251 265 299 305 335 346 347 358 362 394
#[23] 417 462 577 614

# ---------------------------------------------------------------
# The classic Box & Jenkins airline data. Monthly totals of 
# international airline passengers, 1949 to 1960.
data(AirPassengers)    # A monthly time series, in thousands.
# Example: using time series object
class(AirPassengers)
#[1] "ts"

# Create a data frame to contain all of the time series data:
# data, years, months
df <- data.frame(                 
  pass = as.vector(AirPassengers),
  year = sort(rep(1949:1960, 12)),
  month = rep(c("Jan", "Feb", "Mar", "Apr",
                "May", "Jun", "Jul", "Aug",
                "Sep", "Oct", "Nov", "Dec"), 12))

# Create new variable pass_sum containing cumsum of passengers
df$pass_sum <- cumsum(df$pass)   

# Now you have cumulative passenger counts
head(df)
#  pass year month pass_sum
#1  112 1949   Jan      112
#2  118 1949   Feb      230
#3  132 1949   Mar      362
#4  129 1949   Apr      491
#5  121 1949   May      612
#6  135 1949   Jun      747

# ---------------------------------------------------------------
# Detecting outliers
# ---------------------------------------------------------------

# Using the Interquartile Range (IQR) Method

# The IQR method identifies outliers as observations 
# that are either below Q1 - 1.5 * IQR or above 
# Q3 + 1.5 * IQR, where Q1 and Q3 are the first and 
# third quartiles, respectively, and IQR = Q3 - Q1.

# Sample data
data <- c(10, 12, 14, 15, 15, 15, 16, 18, 19, 20, 22, 30)

# Calculate Q1, Q3, and IQR
Q1 <- quantile(data, 0.25)
Q3 <- quantile(data, 0.75)
IQR <- Q3 - Q1        # Calculate the Interquartile Range

# Define outlier thresholds
lower_bound <- Q1 - 1.5 * IQR
upper_bound <- Q3 + 1.5 * IQR

# Identify outliers
outliers <- data[data < lower_bound | data > upper_bound]
outliers
#[1] 30


