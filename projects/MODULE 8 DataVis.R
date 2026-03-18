# MODULE 8 - Data Visualization
#
# (c) Copyright 2015-2024 - AMULET Analytics
# ---------------------------------------------------------------

# Our familiar Base R data sets for learning
data(ToothGrowth)
data(airquality)
data(iris)
data(AirPassengers)
data(mtcars)

# Package data sets
library(MASS)
data(Cars93)

# A new real-life data set
pData <- read.csv("../data/ss06pid.csv")   # ~10MB file
dim(pData)     # Data frame 14931x239
head(pData)    # Show first 6 rows
tail(pData)    # Show last 6 rows

# ---------------------------------------------------------------
# Exploratory plots 
# ---------------------------------------------------------------

# ---------------------------------------------------------------
# Histograms
# ---------------------------------------------------------------

# Single variable frequency plot

# The hist() function first cuts the range of the data into a number 
# of even intervals, and then counts the number of observations in 
# each interval. The bars height is proportional to those frequencies. 
# On the y-axis, you find the counts.
#
# The number of default bins is determined by Sturges' formula
# See: https://en.wikipedia.org/wiki/Histogram#Number_of_bins_and_width

data(iris)
# ---------------------------------------------------------------
# Use variable Sepal.Length from iris data set
#
# freq=TRUE (default) representation of frequencies (counts)
# freq=FALSE get probabilities densities
hist(iris$Sepal.Length, freq=TRUE, col="blue")

# ---------------------------------------------------------------
# Histogram with 2 variables side-by-side. Need to specify x-axis 
# range to accomodate Sepal.Length range (4-8) and Sepal.Width
# range (2-5) using xlim argument
# Use add=TRUE to superimpose two plots
hist(iris$Sepal.Length, col="blue",xlim=c(2, 8))
hist(iris$Sepal.Width, col="red", add=TRUE)

# ---------------------------------------------------------------
# Create a hist object
hist1 <- hist(iris$Sepal.Length, freq=TRUE, col="blue")
class(hist1)
#[1] "histogram"

# Object has a number of metadata items
names(hist1)
#[1] "breaks"   "counts"   "density"  "mids"     "xname"    "equidist"

hist1$breaks
#[1] 4.0 4.5 5.0 5.5 6.0 6.5 7.0 7.5 8.0

hist1$counts
#[1]  5 27 27 30 31 18  6  6

# ---------------------------------------------------------------
# Now use ss06pid.csv data set for histogram
pData <- read.csv("../data/ss06pid.csv") 

# Use default number of breaks
hist(x=pData$AGEP,col="blue")    # AGEP indicates patient age

# Use breaks=100 for more insight into distribution of values
hist(x=pData$AGEP,col="blue",breaks=100,main="Age")

# ---------------------------------------------------------------
# USE DataExplorer package to plot multiple histograms
# install.packages("DataExplorer")
library(DataExplorer)

# Plot histograms in a 2x2 matrix
plot_histogram(iris[,1:4], nrow=2, ncol=2)  

# ---------------------------------------------------------------
# Boxplots
# ---------------------------------------------------------------

data(airquality)

# Goal: to view the distribution of values for a 
# quantitative variable, e.g. the values of any data 
# points which lie beyond the extremes of the whiskers. 

# Collect outlier observations
out <- boxplot.stats(airquality$Ozone)$out  

boxplot(airquality$Ozone, col="blue")
# Add outliers if any to boxplot
mtext(paste("Outlier: ", paste(out, collapse = ", ")))

# Median - solid line is center of distribution. Half of the values
# are above the median, and half are below. When the median is in 
# the middle of the blue box it means it is a symmetric distribution.

# Upper border of blue box is 75th percentile - 1 quarter of the
# values are above this line and 3 quarters are below.

# Lower border of blue box is 25th percentile - 1 quarter of the
# values are below this line, and 3 quarters are above.

# Upper whisker (statistical calculation)

# Lower whisker (statistical calculation)

# Individual values judged to be extreme are plotted as individual
# points


# ---------------------------------------------------------------
# Different style of boxplot using horizontal, notch arguments
boxplot(airquality$Ozone,
        main = "Mean ozone in parts per billion at Roosevelt Island",
        xlab = "Parts Per Billion",
        ylab = "Ozone",
        col = "orange",
        border = "brown",
        horizontal = TRUE,
        notch = TRUE
)

# ---------------------------------------------------------------

data(ToothGrowth)

# Show numeric len broken down by factor supp 
boxplot(ToothGrowth$len ~ ToothGrowth$supp, 
        col=c("blue","orange"))

# ---------------------------------------------------------------
# Use varwidth=TRUE to visualize group sizes

library(MASS)
data(Cars93)

boxplot(MPG.city ~ Cylinders, 
        data=Cars93,
        xlab="Number of cylinders (missing for Mazda RX-7, which has a rotary engine)",
        ylab="City MPG (miles per US gallon by EPA rating)",
        varwidth=TRUE)

# ---------------------------------------------------------------

pData <- read.csv("../data/ss06pid.csv") 

# AGEP variable is "integer" - goal is to view the distribution 
# of the data
boxplot(pData$AGEP,col="blue")

# ---------------------------------------------------------------
# Now use DDRS - dressing

# Tilda "~" means show AGEP broken down by DDRS variable

# DDRS=1 have difficulty dressing
# DDRS=2 do not have difficulty dressing

# Interpretation of the dual boxplots is: older people have
# more difficult dressing

boxplot(pData$AGEP ~ as.factor(pData$DDRS),col="blue")

# ---------------------------------------------------------------
# Now use different colors for each group

# Use varwidth=TRUE so width of box is proportional to the
# number of observations in group

boxplot(pData$AGEP ~ as.factor(pData$DDRS),
        col=c("blue","orange"),
        names=c("Difficulty dressing","No difficulty dressing"),
        varwidth=TRUE)

# ---------------------------------------------------------------
# Barplots
# ---------------------------------------------------------------

data(airquality)

tab1 <- table(airquality$Temp)
tab1
#56 57 58 59 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 
#1  3  2  2  3  2  1  2  2  3  4  4  3  1  3  3  5  4  4  9  7  6  6  5 11  9  4  5 
#85 86 87 88 89 90 91 92 93 94 96 97 
#5  7  5  3  2  3  2  5  3  2  1  1 

class(tab1)
# [1] "table"

# Now visualize the table
# height arg: values describing the bars which make up the plot.
barplot(height=tab1, col="blue")

# ---------------------------------------------------------------
# Can also use subsetting with the table function
table(mtcars$cyl[mtcars$am==1])
#4 6 8 
#8 3 2 

# Now use table with subsetting as data for barplot
barplot(table(mtcars$cyl[mtcars$am==1]))


# ---------------------------------------------------------------

pData <- read.csv("../data/ss06pid.csv") 

# barplot() shows number of observations in each class of CIT.
# CIT has values 1 .. 5 with highly skewed distribution.
barplot(table(pData$CIT),col="blue")

table(pData$CIT)   # table() useful for numeric distribution
#    1     2     3     4     5 
#14122    13   110   263   423 


# ---------------------------------------------------------------
# Scatterplots - the most used type of plot for exploration. Use 
# to visualize relationships between quantitative variables. 
# ---------------------------------------------------------------

data(ToothGrowth)

# Notice dose is discrete, while len is continuous
plot(x=ToothGrowth$len, 
     y=ToothGrowth$dose, 
     pch=19, 
     col="blue")

# Add 3rd variable supp using pch trick
plot(x=ToothGrowth$len, 
     y=ToothGrowth$dose, 
     pch=ifelse(ToothGrowth$supp=="VC",0,1), 
     col="blue")

# ---------------------------------------------------------------

data(airquality)

# 3D scatter plots
#install.packages("scatterplot3d")
library(scatterplot3d)

scatterplot3d(airquality$Solar.R, 
              airquality$Wind, 
              airquality$Temp, 
              col.axis="blue", 
              col.grid="lightblue",
              main="Air Quality Data Set", 
              pch=20, 
              xlab="Solar Radiation", 
              ylab="Wind", 
              zlab="Temp")


# ---------------------------------------------------------------

pData <- read.csv("../data/ss06pid.csv")

# x axis - JWMNP (commuting time)
# y axis - WAGP (wage)

# The row of data points at top likely have to do with reasons 
# of encoding
plot(pData$JWMNP,pData$WAGP,pch=19,col="blue")  # pch=19 solid circles

# -----
# Smaller magnification value with cex=0.5 you get better resolution
# for each data point. 
plot(pData$JWMNP,pData$WAGP,pch=19,col="blue",cex=0.5)  # cex=0.5

# -----
# New technique to encode a 3rd variable using col argument
# SEX has values 1 or 2
plot(pData$JWMNP,pData$WAGP,pch=19,col=pData$SEX,cex=0.5)

# -----
# Use dot size to visualize 3rd variable: percentage of 
# maximum age value
percentMaxAge <- pData$AGEP/max(pData$AGEP) # Numeric vector, len=14931
percentMaxAge[1:10]
#[1] 0.46236559 0.45161290 0.17204301 0.15053763 0.31182796 0.43010753 0.16129032 0.30107527
#[9] 0.32258065 0.04301075

# The size of the x, y data point will have a size = % of max age
plot(pData$JWMNP,pData$WAGP,pch=19,col="blue",cex=percentMaxAge)


# ---------------------------------------------------------------
# scatterplots - representing numeric variables as factors 
#install.packages("Hmisc")
library(Hmisc)            # Need this package for cut2()

# Cut the numeric variable AGEP into 5 intervals
ageGroups <- cut2(pData$AGEP,g=5)    
class(ageGroups)
#[1] "factor" 

levels(ageGroups)
#[1] "[ 0,14)" "[14,29)" "[29,45)" "[45,60)" "[60,93]"

# Use different color for each of the 5 age groups
plot(pData$JWMNP,pData$WAGP,pch=19,col=ageGroups,cex=0.5)


# ---------------------------------------------------------------
# Line graphs
# ---------------------------------------------------------------

# Create the rain fall numeric data vector for the graph
rain_fall <- c(7,12,28,3,41)

# Plot the line graph
# NOTE: the type argument takes the value "p" to draw only the points, 
# "l" to draw only the lines and "o" to draw both points and lines.
plot(x=rain_fall,
     type = "o", 
     col = "red", 
     xlab = "Month", 
     ylab = "Rain fall",
     main = "Rain Fall Chart")

# ---------------------------------------------------------------

data(AirPassengers)

# Plot the line graph
plot(AirPassengers, 
     type = "l", 
     main = "Monthly Airline Passenger Numbers 1949-1960",
     xlab = "Month", 
     ylab = "Passengers", 
     col = "blue")


# ---------------------------------------------------------------
# Pairs() plot for a scatterplot matrix 
# ---------------------------------------------------------------

# To show possible correlations between all variables
data(iris)
pairs(iris[,c(1,2,3,4)])    

# ---------------------------------------------------------------
# Correlation matrix - shows trend where increased Petal.Length 
# corresponds to increased Petal.Width

# Correlation coefficient used "pearson"
cor(iris[,c(1,2,3,4)], method="pearson")  
#             Sepal.Length Sepal.Width Petal.Length Petal.Width
#Sepal.Length    1.0000000  -0.1175698    0.8717538   0.8179411
#Sepal.Width    -0.1175698   1.0000000   -0.4284401  -0.3661259
#Petal.Length    0.8717538  -0.4284401    1.0000000   0.9628654
#Petal.Width     0.8179411  -0.3661259    0.9628654   1.0000000

# Correlation confirmed: 96.3% means highly correlated


# ---------------------------------------------------------------
# QQ-plots
# ---------------------------------------------------------------

# One of the most common uses of a QQ-plot is to assess whether
# a data set follows a normal distribution. Many statistical 
# tests and models assume normality, and a QQ-plot provides 
# a visual check.

# QQ-plots can be effective in highlighting outliers. 

# Two vectors of 50 normally distributed random numbers
x <- rnorm(50)
y <- rnorm(50)

# Plot quantiles of x vs. quantiles of y
qqplot(x,y)

# Draw a diagonal line with y-intercept=0 and slope=1
# NOTE: y-intercept is defined where the line intersects 
# the y-axis when x = 0
abline(a=0, b=1)

# NOTE: if the two distributions were exactly the same, the 
# data points of the QQ-plot would land on the line.
qqplot(x,x)

# 2. An informal graphical test for showing a data sequence is 
#    normally distributed i.e. approximated by a straight line


# ---------------------------------------------------------------
# Big Data techniques - if you're trying to plot too many points
# ---------------------------------------------------------------

# Define two vectors x, y with 100,000 simulated data points each
x <- rnorm(1e5)
y <- rnorm(1e5)
plot(x,y, pch=16)

# Create a random sample index of 1,000 points instead of 100,000
sampledSubset <- sample(1:1e5, size=1000, replace=FALSE)
# Now plot using the sampled index, much better!
plot(x[sampledSubset], y[sampledSubset], pch=16)

# Plot a large number of point. Notice the outliers in the plot!
smoothScatter(x,y)   


# ---------------------------------------------------------------
# Missing value plots 
# ---------------------------------------------------------------

data(airquality)

# Boxplot for missing values: 
# what is the effect of missing/present values of one variable
# on another variable? 
boxplot(airquality$Temp ~ is.na(airquality$Solar.R))


# ---------------------------------------------------------------
# Expository plots
# ---------------------------------------------------------------

data(iris)

# Use type=n for no points or lines, just an empty plotting region, 
# and then you fill it in by adding points() 
plot(iris[,4],
     iris[,3],
     type="n",
     xlab="Petal Width (cm)",
     ylab="Petal Length (cm)")

# Add setosa points to plot
points(iris[iris$Species=="setosa",4],
       iris[iris$Species=="setosa",3],
       pch=19,
       col="black")

# Add virginica points to plot
points(iris[iris$Species=="virginica",4],
       iris[iris$Species=="virginica",3],
       pch=19,
       col="gray")

# Add versicolor points to plot
points(iris[iris$Species=="versicolor",4],
       iris[iris$Species=="versicolor",3],
       pch=1,
       col="black")

# Add legend
legend("topleft", legend=c("setosa", "virginica", "versicolor"),
       col=c("black", "gray", "black"),
       pch=c(19, 19, 1))

# ---------------------------------------------------------------
# Expository graphs: axes with labels and units of measure 

pData <- read.csv("../data/ss06pid.csv")

# Label your axes with xlab, ylab and ALWAYS include units
par(mar=c(5,6,4,1))
plot(pData$JWMNP,
     pData$WAGP,
     pch=19,
     col="blue",
     cex=0.5,
     xlab="Travel time (min)",
     ylab="Last 12 month wages (dollars)")

# ---------------------------------------------------------------
# Expository graphs: axes with larger text. Same as above, 
# just make the axes easier to read

pData <- read.csv("../data/ss06pid.csv")

par(mar=c(5,6,4,1))
plot(pData$JWMNP,
     pData$WAGP,
     pch=19,
     col="blue",
     cex=0.5,
     xlab="Travel time (min)",
     ylab="Last 12 month wages (dollars)",
     cex.lab=2,
     cex.axis=1.5)

# ---------------------------------------------------------------
# Expository graphs: legends 

pData <- read.csv("../data/ss06pid.csv")

par(mar=c(5,6,4,1))
plot(pData$JWMNP,
     pData$WAGP,
     pch=19,
     col="blue",
     cex=0.5,
     xlab="TT (min)",
     ylab="Wages (dollars)")

# Use legend() with x,y coords for upper/left corner of legend box 
# Might have to play around with positioning
legend(100,200000,legend="All surveyed",col="blue",pch=19,cex=0.5)


# ---------------------------------------------------------------
# Expository graphs: data driven legends, also use main argument
# for plot title

pData <- read.csv("../data/ss06pid.csv")

# Use color to represent 3rd variable: SEX (1=men, 2=women)
# Note: col=1 is black, and col=2 is red in R color palette
par(mar=c(5,6,4,1))
plot(pData$JWMNP,
     pData$WAGP,
     pch=19,
     cex=0.5,
     xlab="TT (min)",
     ylab="Wages (dollars)",
     col=pData$SEX,
     main="Wages earned versus commute time")

# Use col argument to sync up color coding for SEX and legend
SEX_val <- unique(pData$SEX)  # Make col argument data-driven
legend(100,200000,
       legend=c("men","women"),
       col=SEX_val,
       pch=c(19,19),
       cex=c(0.5,0.5))

# ---------------------------------------------------------------
# Expository graphs: 2-panel plot with histogram and scatterplot

data(airquality)

# Set graphical parameters: vector of form c(nr, nc)
par(mfrow=c(1,2))   

hist(airquality$Ozone, 
     xlab="Ozone (ppb)", 
     col="blue", 
     main="Ozone Frequencies")

plot(airquality$Ozone, 
     airquality$Temp, 
     pch=16, 
     col="blue", 
     cex=1.25, 
     xlab="Ozone (ppb)", 
     ylab="Temperature (degrees F)", 
     main="Air Quality - Ozone vs. Temp", 
     cex.axis=1.5)

legend(60,60,legend="May-Sep 1973", col="blue", pch=16, cex=0.5)

par(mfrow=c(1,1))


# ---------------------------------------------------------------
# Expository graphs: 2-panel plot

pData <- read.csv("../data/ss06pid.csv")

# Stacking graphs is common, up to 4 otherwise too hard to read
par(mfrow=c(1,2))

# Histogram
hist(pData$JWMNP,xlab="CT (min)",col="blue",breaks=100,main="")

# Scatterplot with legend
plot(pData$JWMNP,
     pData$WAGP,
     pch=19,
     cex=0.5,
     xlab="CT (min)",
     ylab="Wages (dollars)",
     col=pData$SEX)

legend(100,200000,
       legend=c("men","women"),
       col=c("black","red"),
       pch=c(19,19),
       cex=c(0.5,0.5))

par(mfrow=c(1,1))   # Reset panel argument

# ---------------------------------------------------------------
# Expository graphs: adding text

par(mfrow=c(1,2))
hist(pData$JWMNP,
     xlab="CT (min)",
     col="blue",
     breaks=100,
     main="")

# Adding figure designation (a)
mtext(text="Figure (a)",side=3,line=1)

plot(pData$JWMNP,
     pData$WAGP,
     pch=19,
     cex=0.5,
     xlab="CT (min)",
     ylab="Wages (dollars)",
     col=pData$SEX)

legend(100,200000,
       legend=c("men","women"),
       col=c("black","red"),
       pch=c(19,19),
       cex=c(0.5,0.5))

# Adding figure designation (b)
# arg text: character expression to be written to plot
# arg side: on which side of the plot (1=bottom, 2=left, 3=top, 4=right)
# arg line: on which MARgin line, starting at 0 counting outwards
mtext(text="Figure (b)",side=3,line=1)

par(mfrow=c(1,1))   # Reset panel argument

# ---------------------------------------------------------------
# Expository graphs: exporting the image

# Export to PNG (dimension in pixels) Also bmp(), jpeg(), and tiff()
png(file="twoPanel.png",height=480,width=(2*480))

# Export to PDF (dimension in inches)
#pdf(file="twoPanel.pdf",height=4,width=8)   

par(mfrow=c(1,2))

hist(pData$JWMNP,
     xlab="CT (min)",
     col="blue",
     breaks=100,
     main="")

mtext(text="(a)",side=3,line=1)

plot(pData$JWMNP,
     pData$WAGP,
     pch=19,
     cex=0.5,
     xlab="CT (min)",
     ylab="Wages (dollars)",
     col=pData$SEX)

legend(100,200000,
       legend=c("men","women"),
       col=c("black","red"),
       pch=c(19,19),
       cex=c(0.5,0.5))

mtext(text="(b)",side=3,line=1)
dev.off()


# ---------------------------------------------------------------
# Brief introduction to ggplot2  
# ---------------------------------------------------------------

#install.packages("tidyverse")
#library(tidyverse)

#install.packages("ggplot2")
library(ggplot2)

# ---------------------------------------------------------------
# Exploratory histogram

data(mpg, package="ggplot2")
? mpg

dim(mpg)
# [1] 234  11

bins=seq(10,50,5)
# aes() function (aesthetics) defines mapping of 
# variables to visual properties of graph
# geom_histogram() defines histogram geometric object
ggplot(data=mpg, aes(x=hwy)) + 
  geom_histogram(fill="darkcyan", color="gray",breaks=bins)


# ---------------------------------------------------------------
# Exploratory barplot

data(diamonds, package="ggplot2")
? diamonds

dim(diamonds)
# [1] 53940    10

table(diamonds$cut)
# Fair      Good Very Good   Premium     Ideal 
# 1610      4906     12082     13791     21551 

# geom_bar() defines barplot geometric object
ggplot(data=diamonds, aes(x=cut)) +
  geom_bar()

# ---------------------------------------------------------------
# Exploratory boxplot (box-and-whisker plot)

data(mtcars)

# aes() defines mapping of mpg grouped by cyl
# geom_boxplot() defines boxplot geometric object
# labs() function provides customized labels for the graph
ggplot(data = mtcars, aes(x = factor(cyl), y = mpg)) +
  geom_boxplot() +
  labs(title = "Boxplot of Miles Per Gallon by Number of Cylinders",
       x = "Number of Cylinders",
       y = "Miles Per Gallon")


# ---------------------------------------------------------------
# Exploratory scatterplot

data(mpg, package="ggplot2")

# displ (numeric)
# hwy (integer)
# class (character)

# geom_point() defines scatterplot geometric object
# Automatically uses color trick for 3rd variable: class
ggplot(data=mpg) +
  geom_point(mapping=aes(x=displ, y=hwy, color=class))








