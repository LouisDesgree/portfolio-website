# MODULE 2 - R Fundamentals for Data Science
#
# (c) Copyright 2015-2024 - AMULET Analytics
# ---------------------------------------------------------------

# ---------------------------------------------------------------
# Subsetting a vector
# ---------------------------------------------------------------

x <- c("a", "b", "c", "c", "d", "a")  # Define character vector

# Subset (extract) first element
x[1]         
#[1] "a"

# Subset second element
x[2]
#[1] "b"

# Subset sequence of elements 1-4
x[1:4]              
#[1] "a" "b" "c" "c"

# Subsetting using a logical expression
x[x > "a"]          # Select all elements with value > "a"
#[1] "b" "c" "c" "d"

u <- x > "a"        # Create a logical vector (map)
u
#[1] FALSE TRUE TRUE TRUE TRUE FALSE

x[u]                # Use logical vector as an index for x
#[1] "b" "c" "c" "d"


# ---------------------------------------------------------------
# Subsetting a matrix
# ---------------------------------------------------------------

# Matrices can be subsetted with (i, j) row and column indices.
#
# NOTE: a matrix does NOT have to be square.

# Define a 2x3 matrix
x <- matrix(1:6, 2, 3)
#     [,1] [,2] [,3]
#[1,]    1    3    5
#[2,]    2    4    6

# Subset a single element
x[1, 2]
#[1] 3

x[2, 1]     
#[1] 2

# Subset entire first row
x[1, ]      
#[1] 1 3 5

# Subset entire second column
x[, 2]    
#[1] 3 4

# NOTE: by default, when a single element of a matrix is 
# extracted, it is returned as a vector of length 1 rather 
# than a 1x1 matrix. This behavior can be turned off by setting 
# drop=FALSE

# A vector of 1 element, NOT a 1x1 matrix
x[1, 2]       
#[1] 3

# Preserve object class matrix
x[1, 2, drop = FALSE]    # Get a 1x1 matrix 
#     [,1]
#[1,]    3

# NOTE: subsetting a single column or a single row will give 
# you a vector, not a matrix (by default)

# Extract an integer vector of length 3
x[1, ]                 
#[1] 1 3 5

# Preserve object class matrix
x[1, , drop = FALSE]   # Take 1st row of matrix, get a 1x3 matrix 
#     [,1] [,2] [,3]
#[1,]    1    3    5


# ---------------------------------------------------------------
# Subsetting a list
# ---------------------------------------------------------------

# Extracting from a list: slice or subset, by index or by name

# Define a "ragged" list
x <- list(foo = 1:4, bar = 0.6)    
x
#$foo
#[1] 1 2 3 4
#
#$bar
#[1] 0.6

# Slice 1st element of list x    
x[1]                 # Integer vector of length 4     
#$foo
#[1] 1 2 3 4

class(x[1])          # Class of slice is always a list
#[1] "list"

# Print 1st element of list by name
x$foo                # Integer vector of length 4
#[1] 1 2 3 4

class(x$foo)         # Class "integer"
#[1] "integer"

# Subset 1st element of list
x[[1]]               # Integer vector of length 4
#[1] 1 2 3 4

class(x[[1]])        # Class integer vector, NOT a list
#[1] "integer"

# ---------------------------------------------------------------

# Slice 2nd element of list
x[2]                 # List of one element
#$bar
#[1] 0.6

class(x[2])          # Class of slice is always a list
#[1] "list"

# Print 2nd element of list by name
x$bar                # Numeric vector of length 1
#[1] 0.6

# Subset 2nd element of list
x[[2]]               # Numeric vector of length 1
#[1] 0.6

class(x[[2]])        # Class numeric vector, NOT a list
#[1] "numeric"

# Subsetting a list by element name
x[["bar"]]           # Class "numeric" vector
#[1] 0.6

x["bar"]             # Class "list"
#$bar
#[1] 0.6

# ---------------------------------------------------------------

# Extracting multiple elements of a list.

x <- list(foo = 1:4, bar = 0.6, baz = "hello")
x
#$foo
#[1] 1 2 3 4

#$bar
#[1] 0.6

#$baz
#[1] "hello"

# Slice elements 1 and 3. NOTE: output is a list of 2 elements
x[c(1, 3)]    # c(1,3) is a vector of element numbers
#$foo
#[1] 1 2 3 4
#$baz
#[1] "hello"

# ---------------------------------------------------------------
# subset() function
# ---------------------------------------------------------------

# subset() function's handling of NAs
x <- c(6, 1:3, NA, 12)    # Vector with NA
x
#[1]  6  1  2  3 NA 12

# Ordinary subsetting ignores NAs, and leaves them in result
x[x > 5]  # Subset with base R syntax using a logical expression
#[1]  6 NA 12   

# Use subset() to exclude NAs in result ONLY WITH VECTORS!
subset(x, x>5)  
#[1]  6 12

# ---------------------------------------------------------------
# subset() complex expressions

# First time we'll use a data set (from base R)
data(airquality)

# Can see all available data sets in base R using:
data() 

# Or data sets available from a specific package:
data(package="dplyr")

# Use head() with all new data sets
head(airquality)       # Display first 6 rows (by default)

# Use summary() with a new data sets
# Notice Ozone and Solar.R variables have NAs
summary(airquality)    

# Simple logical expression
# NAs not removed in results when using data frame
# NOTE: result is a data frame
subset(airquality, Temp > 80, select = c(Ozone, Temp))

# Complex logical expression
subset(airquality, Temp > 80 & Ozone < 50, select = c(Ozone, Temp))

# All variables EXCEPT Temp
subset(airquality, Day == 1, select = -Temp)

# Select a "sequence" of variables
subset(airquality, select = Ozone:Wind)

# Qualified naming not required, but still works
subset(airquality, airquality$Temp > 80)

# Create a temporary data frame consisting of only Temp values
filtered_temp <- subset(airquality,airquality[,5] == 6, select=Temp)
# Calculate the mean for the filtered Temp variable
mean(filtered_temp$Temp)
#[1] 79.1

# This works too
filtered_temp <- subset(airquality,airquality[,5] == 6, select=Temp)
bad <- is.na(filtered_temp)  # Useful IF there had been NAs
mean(filtered_temp[!bad])
#[1] 79.1

# This works too
mean(subset(airquality$Temp,airquality$Month == 6))
#[1] 79.1

# Extract all values of Solar.R in airquality where Month==5. 
# Note some NAs
airquality$Solar.R[airquality$Month==5]
#[1] 190 118 149 313  NA  NA 299  99  19 194  NA 256 290 274  65 334 307  78 322  44
#[21]   8 320  25  92  66 266  NA  13 252 223 279

# Since Solar.R has missing values (NA), this mean() won't work
mean(subset(airquality$Solar.R,airquality$Month == 5))  
#[1] NA

# This one uses a technique to get rid of NAs found in the R help
mean(subset(airquality$Solar.R,
            airquality$Month == 5 & !is.na(airquality$Solar.R)))
#[1] 181.2963

# Or we can use mean() to get rid of NAs
mean(subset(airquality$Solar.R,airquality$Month == 5),na.rm=TRUE)
#[1] 181.2963


# ---------------------------------------------------------------
# Common operations on a data frame
# ---------------------------------------------------------------

# Make a copy of a data frame
airquality_clone <- airquality

# Make a copy of airquality and exclude 4th variable, Temp
airquality_clone2 <- airquality[,-4]   

# Exclude 2nd, 4th variable: Solar.R, Temp
airquality_clone3 <- airquality[,c(-2, -4)]  

# Adding a new variable to a data frame
airquality_clone$warming_temp <- airquality_clone$Temp + 2.7 

# Removing a variable from a data frame
airquality_clone$Temp <- NULL

# ---------------------------------------------------------------
# Removing NA values from a vector
# ---------------------------------------------------------------

x <- c(1, 2, NA, 4, NA, 5)

# Create a logical map of NAs
bad <- is.na(x)        
bad
#[1] FALSE FALSE  TRUE FALSE  TRUE FALSE

x[!bad]        # Introducing the NOT logical operator "!" 
#[1] 1 2 4 5


# ---------------------------------------------------------------
# Removing NA values from pairs of vectors 
# ---------------------------------------------------------------

x <- c( NA, 2, 3, 4, NA, 5)
y <- c("a", "b", NA, "d", NA, "f")

# Product a logical map where like-elements are non-missing
good <- complete.cases(x, y)
good
#[1] FALSE  TRUE FALSE  TRUE FALSE  TRUE

x[good]      # Eliminate NAs
#[1] 2 4 5

y[good]      # Eliminate NAs
#[1] "b" "d" "f"


# ---------------------------------------------------------------
# Removing NA values from data frames
# ---------------------------------------------------------------

data(airquality)

# Create a logical map of complete rows
good <- complete.cases(airquality)

good

# Use the logical map to subset only rows with no NA
# Now only 111 out of 153 rows
airquality_clean = airquality[good,]

# ---------------------------------------------------------------
# How about NA and NULL in statistical functions? 
# ---------------------------------------------------------------

vy <- c(1, 2, 3, NA, 5)
mean(vy)    # Mean is meaningless (excuse pun) with any NAs
#[1] NA

mean(vy, na.rm=TRUE)   # na.rm=TRUE argument removes all NAs
#[1] 2.75

vz <- c(1, 2, 3, NaN, 5)
vz
#[1]   1   2   3 NaN   5

sum(vz)      # Can't sum a vector with NaN values
#[1] NaN

sum(vz, na.rm=TRUE)  # na.rm=TRUE works on NaN values too
#[1] 11

vx <- c(1, 2, 3, NULL, 5)
vx                 # NULL value disappears
#[1] 1 2 3 5

sum(vx)            # So no problem summing
#[1] 11

# Removing missing values from a vector
vy <- c(1,2,3,NA,5)
vy
#[1]  1  2  3 NA  5

vy <- vy[!is.na(vy)]   # Remove all NAs
vy
#[1] 1 2 3 5

vz <- c(1,2,3,NaN,5)
vz
#[1]   1   2   3 NaN   5

vz <- vz[!is.nan(vz)]   # Remove all NaNs
vz
#[1] 1 2 3 5


# ---------------------------------------------------------------
# Experimenting with Inf and Nan
# ---------------------------------------------------------------

# Inf and -Inf stands for infinity (or negative infinity) and is 
# a result of storing either a large number or a product that is 
# a result of division by zero. Inf is a reserved word and is - 
# in most cases - product of computations in R language and 
# therefore very rarely a product of data import.
x = 100/0        # Denominator is zero
x
#[1] Inf

# If x is not finite then set to 0
x = ifelse(!is.finite(x), 0, x)

# R considers everything larger than the largest number a 
# computer can hold to be infinity - on most machines, that's 
# approximately 10^308. This definition of infinity can lead 
# to unexpected results, as shown in the following example:
is.finite(10^(305:310))
# [1]  TRUE  TRUE  TRUE  TRUE FALSE FALSE

# Display numerical characteristics of machine R is running on
print(.Machine)

# NaN ("Not a Number") means 0/0 where both numerator and
# denominator are zero.
0/0
# [1] NaN

# Define data frame to process
df = data.frame(Delta_Cost=c(0,1,2,3), Delta_LY=c(0,4,5,6))

# Creat a new variable. Yields NaN for first observation
df$ICER <- df$Delta_Cost/df$Delta_LY

# Solution 1: Let NaN happen and then fix-up
df$ICER <- df$Delta_Cost/df$Delta_LY
df$ICER[is.nan(df$ICER)] <- 0

# Solution 2: Avoid NaN from happening 
# (uses ifelse() to be covered later in class)
df$ICER <- ifelse(df$Delta_Cost == 0 & df$Delta_LY == 0, 
                  0, 
                  df$Delta_Cost / df$Delta_LY)

# ---------------------------------------------------------------
# Emptry string in R 
# ---------------------------------------------------------------

c1 <- character(5)  # Define character vector length 5
c1
#[1] "" "" "" "" ""

empty_str <- ""
empty_str
#[1] ""

class(empty_str)
#[1] "character"

# Length of the vector with 1 element - emptry string
length(empty_str)   
#[1] 1

chr_vector <- character(2)
chr_vector
#[1] "" ""

chr_vector[3] <- "three"    # Add a new element
chr_vector
#[1] ""      ""      "three"

chr_vector[5] <- "five"     # Add 5th element, no 4th though!
chr_vector
#[1] ""      ""      "three" NA      "five"


