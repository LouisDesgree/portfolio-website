# MODULE 1 - R fundamentals
#
# (c) Copyright 2015-2024 - AMULET Analytics
# ---------------------------------------------------------------

# ---------------------------------------------------------------
# Creating variables of atomic classes using assignment operator
# ---------------------------------------------------------------

# <- is the assignment operator, = is almost the same.

# NOTE: R is a interpretive language (weakly typed)

x <- 1L                # Integer
x <- 3.14              # Numeric
x <- "hello world"     # Character
x <- TRUE              # Logical

# ---------------------------------------------------------------
# Creating vector objects by default
# ---------------------------------------------------------------

x <- 1      # Numeric vector of length 1 with only element = 1
x           # Implicit printing
#[1] 1

print(x)    # Explicit printing
#[1] 1

msg <- "UCLA"   # Character vector, 1 element
msg
#[1] "UCLA"


# ---------------------------------------------------------------
# Creating integer sequences
# ---------------------------------------------------------------

x <- 1:20    # Use : operator to create integer sequences
x
#[1]  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20

x <- 15:45
x
# [1] 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36
#[23] 37 38 39 40 41 42 43 44 45

# ---------------------------------------------------------------
# Using the c() Combine Values function
# ---------------------------------------------------------------

x <- c(0.5, 0.6)       ## numeric vector, 2 elements
x <- c(TRUE, FALSE)    ## logical vector, 2 elements
x <- c(T, F)           ## logical vector, 2 elements
x <- c("a", "b", "c")  ## character vector, 3 elements
x <- 9:29              ## integer vector, 21 elements

# ---------------------------------------------------------------
# Using the vector() constructor function
# ---------------------------------------------------------------

x <- vector()    # Empty vector assignment
x
#logical(0)

class(x)         # logical!
#[1] "logical"

# ---------------------------------------------------------------
# Creating a generic vector template
# ---------------------------------------------------------------

x <- vector("numeric", length = 10) # numeric vector, 10 elements, no data!

# All elements default to 0 since numeric class
x
#[1] 0 0 0 0 0 0 0 0 0 0


# ---------------------------------------------------------------
# Coercion (implicit transformation of class)
# ---------------------------------------------------------------

# Since vector elements MUST be of same type, "coercion" occurs!
y <- c(1.7, "a")  ## character vector, "1.7"
y
#[1] "1.7" "a"

y <- c(TRUE, 2)   ## numeric vector (1,2), where TRUE=1, FALSE=0
y
#[1] 1 2

y <- c("a", TRUE) ## character vector ("a", "TRUE")
y
#[1] "a"    "TRUE"

# ---------------------------------------------------------------
# Casting (explicit transformation of class)
# ---------------------------------------------------------------

x <- 0:6       # 0 1 2 3 4 5 6
class(x)
#[1] "integer"

as.numeric(x)          # Cast integer to numeric
#[1] 0 1 2 3 4 5 6

y <- as.numeric(x)     # Cast and save
class(y)
#[1] "numeric"

as.logical(x)          # Cast integer to logical
#[1] FALSE TRUE TRUE TRUE TRUE TRUE TRUE

as.character(x)        # Cast integer to character
#[1] "0" "1" "2" "3" "4" "5" "6"


# ---------------------------------------------------------------
# More on casting

x <- c("a", "b", "c")
as.numeric(x)
#[1] NA NA NA
#Warning message:
#  NAs introduced by coercion

as.logical(x)
#[1] NA NA NA


# ---------------------------------------------------------------
# Using matrices
# ---------------------------------------------------------------

# Matrices are vectors with a dimension attribute. The dimension
# attribute is itself an integer vector of length 2 (nrow, ncol)

m <- matrix(nrow = 2, ncol = 3)    # Use matrix() constructor
m
#   [,1] [,2] [,3]
#[1,] NA NA NA
#[2,] NA NA NA

# Return dimension attribute of matrix
dim(m)
#[1] 2 3

# Or use the attributes() function
attributes(m)
#$dim
#[1] 2 3

# ---------------------------------------------------------------
# Matrices are constructed column-wise, so entries can be thought
# of starting in the "upper left" corner and running down the
# columns.

# Assign values completing a column at a time
m <- matrix(1:6, nrow = 2, ncol = 3)
m
#     [,1] [,2] [,3]
#[1,]    1    3    5
#[2,]    2    4    6

# ---------------------------------------------------------------
# Another example using c()
m <- matrix(c(3,1,4,1,5,9), nrow=2, ncol=3)
m

# ---------------------------------------------------------------
# Matrices can also be created directly from vectors by adding a
# dimension attribute.

m <- 1:10       # Design an integer vector of 10 elements
m
#[1] 1 2 3 4 5 6 7 8 9 10

# Assign to dimension attribute making object a matrix
dim(m) <- c(2, 5)    # 2 rows, 5 columns
m
#     [,1] [,2] [,3] [,4] [,5]
#[1,]    1    3    5    7    9
#[2,]    2    4    6    8   10


# ---------------------------------------------------------------
# Using cbind() and rbind()
# ---------------------------------------------------------------

# Matrices can be created by column-binding or row-binding with
# cbind() and rbind().

# Define two integer vectors, each with 3 elements
x <- 1:3
y <- 10:12
cbind(x, y)         # Combine by column
#     x  y
#[1,] 1 10
#[2,] 2 11
#[3,] 3 12

rbind(x, y)         # Combing by row
#  [,1] [,2] [,3]
#x    1    2    3
#y   10   11   12


# ---------------------------------------------------------------
# Using lists
# ---------------------------------------------------------------

# Lists are a special type of vector that can contain elements of
# different classes. Lists ae a very important data type in R
# and you should get to know them well.

x <- list(1, "a", TRUE, 1 + 4i)
x             # See double brackets for elements of a list
#[[1]]
#[1] 1
#
#[[2]]
#[1] "a"
#
#[[3]]
#[1] TRUE
#
#[[4]]
#[1] 1+4i

class(x)
#[1] "list"

# ---------------------------------------------------------------
# Vectors containing lists
# ---------------------------------------------------------------

list1 <- list(1,2,3)
list2 <- list(4,5)

# Define a list using the vector constructor w/list mode
x <- vector(mode="list")
class(x)
#[1] "list"

x[[1]] <- list1
x[[2]] <- list2

# A flood of square brackets!
x              # Note: the list is ragged - a list of lists!
#[[1]]
#[[1]][[1]]
#[1] 1
#
#[[1]][[2]]
#[1] 2
#
#[[1]][[3]]
#[1] 3
#
#
#[[2]]
#[[2]][[1]]
#[1] 4
#
#[[2]][[2]]
#[1] 5


# ---------------------------------------------------------------
# More on constructing lists
# ---------------------------------------------------------------

n = c(2, 3, 5)    # Numeric vector
s = c("aa", "bb", "cc", "dd", "ee")   # Character vector
b = c(TRUE, FALSE, TRUE, FALSE, FALSE)   # Logical vector

# x is a list of vectors!
x = list(n, s, b, 3)   # List object x contains copies of n, s, b
x
#[[1]]
#[1] 2 3 5
#
#[[2]]
#[1] "aa" "bb" "cc" "dd" "ee"
#
#[[3]]
#[1]  TRUE FALSE  TRUE FALSE FALSE
#
#[[4]]
#[1] 3

# ---------------------------------------------------------------
# List slicing
# ---------------------------------------------------------------

# We retrieve a list slice with the single square bracket "[]"
# operator. The following is a slice containing the second
# member of x, which is a copy of the original vector s.
x[2]
# [[1]]
# [1] "aa" "bb" "cc" "dd" "ee"

# Member reference
# In order to reference a list member directly, we have to use the
# double square bracket "[[]]" operator. The following object x[[2]]
# is the second member of x. In other words, x[[2]] is a copy of s,
# but is NOT a slice containing s or its copy.
x[[2]]
# [1] "aa" "bb" "cc" "dd" "ee"

# With an index vector, we can retrieve a slice with multiple
# members. Here a slice containing the second and fourth
# members of x.
x[c(2, 4)]
# [[1]]
# [1] "aa" "bb" "cc" "dd" "ee"
#
# [[2]]
# [1] 3

# We can modify its content directly.
x[[2]][1] = "ta"
x[[2]]
#[1] "ta" "bb" "cc" "dd" "ee"
s
# [1] "aa" "bb" "cc" "dd" "ee"       # s is unaffected


# ---------------------------------------------------------------
# Using factors variables
# ---------------------------------------------------------------

# Used for categorical variables in statistics (not quantitative)

x <- factor(c("yes", "yes", "no", "yes", "no"))
x
#[1] yes yes no  yes no
#Levels: no yes

table(x)    # frequency of factor values
#x
# no yes
#  2   3

class(x)
#[1] "factor"

unclass(x)   # Convert a factor to its integer codes for level #
#[1] 2 2 1 2 1
#attr(,"levels")
#[1] "no"  "yes"

# Another example
y <- factor(c("b", "a", "a", "c", "a", "b", "c"))
unclass(y)
#[1] 2 1 1 3 1 2 3
#attr(,"levels")
#[1] "a" "b" "c"

levels(y)   # Display a list of levels for a factor variable
#[1] "a" "b" "c"

# ---------------------------------------------------------------
# More factors
# ---------------------------------------------------------------

# The order of the levels can be set using the levels argument
# to factor().

# Can also set order of levels
x <- factor(c("yes", "yes", "no", "yes", "no"),
            levels = c("yes", "no"))
x
#[1] yes yes no yes no
#Levels: yes no

# ---------------------------------------------------------------
# Using data frames
# ---------------------------------------------------------------

x <- data.frame(foo = 1:4, bar = c(T, T, F, F))
x
#  foo   bar
#1   1  TRUE
#2   2  TRUE
#3   3 FALSE
#4   4 FALSE

nrow(x)
#[1] 4

ncol(x)
#[1] 2


# ---------------------------------------------------------------
# Using name attributes
# ---------------------------------------------------------------

# R objects can also have names, which is very useful for writing
# readable code and self-describing objects.

x <- 1:3    # Create an integer vector
x
#[1] 1 2 3

names(x)    # No names for this vector object
#NULL

# Now assign some names for each element
names(x) <- c("foo", "bar", "norf")
x             # Print with names
#foo bar norf
#  1   2    3

names(x)       # Now just print the names, no values
#[1] "foo" "bar" "norf"

# ---------------------------------------------------------------
# Lists can also have names
x <- list(a = 1, b = 2, c = 3)   # Create a new list with names
x
#$a
#[1] 1
#$b
#[1] 2
#$c
#[1] 3


# ---------------------------------------------------------------
# Matrices can also have names

m <- matrix(1:4, nrow = 2, ncol = 2)  # Define 2x2 matrix
m                       # Note: no names, just indexes
#     [,1] [,2]
#[1,]    1    3
#[2,]    2    4

# Assign some names
dimnames(m) <- list(c("a", "b"), c("c", "d"))
m                       # Print matrix with names
#  c d
#a 1 3
#b 2 4

# Reference row and column names
rownames(m)
colnames(m)

# Can now use row/column names for subsetting

m["a",]           # Extract row "a"
#c d
#1 3

m[,"d"]           # Extract column "d"
#a b
#3 4

colnames(m) <- NULL  # Can also delete column names
m
#  [,1] [,2]
#a    1    3
#b    2    4

# ---------------------------------------------------------------
# matrix() dimensionality

# Matrices are ONLY 2-dimensional, e.g. rows and columns as in mathematics
# byrow=TRUE - matrix is filled by rows instead of default columns

x <- matrix(1:4, nrow=2, ncol=2, byrow=TRUE)


# ---------------------------------------------------------------
# dim(x) and attributes(x) where x is a vector

x <- 1:5    # Integer vector
x

length(x)   # Return the number of elements in vector

# dim(x) only works for matrix, array, data frame

# How about attributes()??

x <- 1:3   # Define an integer vector
names(x) <- c("a", "b", "c")    # Assign via $names attribute
x
# a b c
# 1 2 3

x["b"]      # Subset vector based on element name
#b
#2

attributes(x)   # Extract names attribut data
#$names
#[1] "a" "b" "c"

names(x)
#[1] "a" "b" "c"

# ---------------------------------------------------------------
# Using multidimensional arrays
# ---------------------------------------------------------------

x <- array(1:24, dim=c(3,4,2))   # 3-dimensional array
x
#, , 1
#
#     [,1] [,2] [,3] [,4]
#[1,]    1    4    7   10
#[2,]    2    5    8   11
#[3,]    3    6    9   12

#, , 2

#     [,1] [,2] [,3] [,4]
#[1,]   13   16   19   22
#[2,]   14   17   20   23
#[3,]   15   18   21   24


dim(x)
#[1] 3 4 2

attributes(x)
#$dim
#[1] 3 4 2

class(x)           # array
#[1] "array"


# ---------------------------------------------------------------
# Missing values
# ---------------------------------------------------------------

# na: not available
# nan: not a number

x <- c(1, 2, NA, 10, 3)   # Numeric vector
is.na(x)                  # Only 3rd element is NA
#[1] FALSE FALSE TRUE FALSE FALSE

is.nan(x)    # Is any element "Not a Number"? NO!
#[1] FALSE FALSE FALSE FALSE FALSE

is.nan(NA)   # NA is not considered NaN
#[1] FALSE

x <- c(1, 2, NaN, NA, 4)
is.na(x)           # NA and NaN considered missing value
#[1] FALSE FALSE TRUE TRUE FALSE

is.nan(x)     # Only 1 actual Nan
#[1] FALSE FALSE TRUE FALSE FALSE





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






# MODULE 3 - R Fundamentals for Data Science
#
# (c) Copyright 2015-2023 - AMULET Analytics
# ---------------------------------------------------------------

# ---------------------------------------------------------------
# Vectorized operations
# ---------------------------------------------------------------

x <- 1:4; y <- 6:9     # Define 2 vectors of same length = 4
x + y                  # Vector addition
#[1] 7 9 11 13

x - y                  # Element wise subtraction
#[1] -5 -5 -5 -5

x * y                  # Element wise multiplication
#[1] 6 14 24 36

x / y                  # Element wise division
#[1] 0.1666667 0.2857143 0.3750000 0.4444444

# ---------------------------------------------------------------
# Vectorized comparison yields a logical map

x > 2
#[1] FALSE FALSE TRUE TRUE

x >= 2
#[1] FALSE TRUE TRUE TRUE

y == 8
#[1] FALSE FALSE TRUE FALSE


# ---------------------------------------------------------------
# Vectorized matrix operations

x <- matrix(1:4, 2, 2); y <- matrix(rep(10, 4), 2, 2)

x * y             # Element-wise multiplication
#     [,1] [,2]
#[1,]   10   30
#[2,]   20   40

x / y             # Element-wise division
#     [,1] [,2]
#[1,]  0.1  0.3
#[2,]  0.2  0.4

x %*% y           # Linear algebra: true matrix multiplication
#     [,1] [,2]
#[1,]   40   40
#[2,]   60   60


# ---------------------------------------------------------------
# Compute transpose of a matrix

A <- matrix(1:9, nrow=3)
A
#     [,1] [,2] [,3]
#[1,]    1    4    7
#[2,]    2    5    8
#[3,]    3    6    9

A_transpose <- t(A)
A_transpose           # Rotate on main diagonal
#     [,1] [,2] [,3]
#[1,]    1    2    3
#[2,]    4    5    6
#[3,]    7    8    9

# ---------------------------------------------------------------
# Compute an inverse of a matrix

A <- matrix(1:4, nrow=2)
A

A_inv <- solve(A)
A_inv
#     [,1] [,2]
#[1,]   -2  1.5
#[2,]    1 -0.5

# Try it out using linear algebra definition of identity matrix
A %*% A_inv
#     [,1] [,2]
#[1,]    1    0
#[2,]    0    1


# ---------------------------------------------------------------
# if control structure
# ---------------------------------------------------------------

# Simple alter flow of control: execute or jump over statements
x <- 5
if(x > 0){
  print("Positive number")
}

# Now full if statement using else clause
a <- 3
if (a == 4) {
  x <- 1
} else {
  x <- 3
  y <- 4
}


# Now a network of if statements
x <- 0
# check if x is positive or negative or zero
if (x > 0) {
  print("x is a positive number")
} else if (x < 0) {
  print("x is a negative number")
} else {
  print("x is zero")
}
[1] "x is zero"

# ---------------------------------------------------------------
# if expression - can be used in an assignment statement
x <- 2
y <- if(x == 2) x else x+1
y

# Now use different if expression
x <- 3
y <- if(x != 2) x else x+1
y

# ---------------------------------------------------------------
# Now use function form: ifelse(test_expression, x, y)

# Also: %% indicates x mod y ("x modulo y")
# modulo returns the remainder of the division of the number to
# the left by the number on the right, for example 5 %% 3 is 2
a = c(5,7,2,9)
ifelse(a %% 2 == 0,"even","odd")
# [1] "odd"  "odd"  "even" "odd"


# ---------------------------------------------------------------
# Relational operators
# ---------------------------------------------------------------

# x == y  test for equality
# x >  y  test for greater than
# x <  y  test for less than
# x <= y  test for less than or equal to
# x >= y  test for greater than or equal to
# x != y  test for inequality


# ---------------------------------------------------------------
# Logical operators
# ---------------------------------------------------------------

# & for the AND operator
# | for the OR operator
# ! for the NOT operator


# ---------------------------------------------------------------
# Evaluating logical expressions
# ---------------------------------------------------------------

# ---------------------------------------------------------------
# First apply to numbers
1==1
#[1] TRUE

1==1 & 1==2
#[1] FALSE

# ---------------------------------------------------------------
# Now apply to vectors

# Element-wise comparison yields a logical vector
1:3==1:3
#[1] TRUE TRUE TRUE

# Elementwise compaison finds 2nd elements not equal
1:3==c(1,3,3)
#[1]  TRUE FALSE  TRUE

# A more complex element-wise comparison. Only 2nd element is FALSE
1:3==1:3 & 1:3==c(1,3,3)   # (TRUE TRUE TRUE) & (TRUE FALSE  TRUE)
#[1]  TRUE FALSE  TRUE

# ---------------------------------------------------------------
# Evaluating logical expression for subsetting
x <- 1:5
x
# [1] 1 2 3 4 5

x[x<5]                 # Clear!
#[1] 1 2 3 4

# Now use AND &
# [TRUE  TRUE  TRUE  TRUE FALSE] & [FALSE FALSE  TRUE  TRUE  TRUE]
x[x<5 & x>2]           # Only 3 and 4 elements are both TRUE
#[1] 3 4


# ---------------------------------------------------------------
# for control structure
# ---------------------------------------------------------------

# Sequence 1:10 represents a "set" of values for i to assume
for(i in 1:10) {
  print(i)
}

# ---------------------------------------------------------------
# More for control structure

x <- c("a", "b", "c", "z")

# Now use character elements of x as "set" for i to assume
for(i in x) {
  print(i)
}

# Use i as index for elements of x
for(i in 1:4) {
  print(x[i])
}

# Single statement loop
for(i in 1:4) print(x[i])

# ---------------------------------------------------------------
# In vectorized operations like element-wise addition, don't write loop!
x <- 1:4
y <- 6:9

n <- length(x)
z <- vector("numeric", length=n)  # Vector to receive element-wise sum

for (i in 1:4){
  z[i] <- x[i] + y[i]
}

# Much easier, and faster!
z <- x + y

# ---------------------------------------------------------------
# Using a trick to implement NEXT in a for() loop as found in
# other programming languages.
for(i in seq(from=1, to=78, by=2)){
  #  stuff, such as
  print(i)
}

# ---------------------------------------------------------------
# Nested for loops for traversing matrix elements

x <- matrix(1:6, 2, 3)   # 2x3 matrix

# Use seq() to generate sets of integers rows and cols of x
seq(from=1, to=nrow(x))
seq(from=1, to=ncol(x))

for(i in seq(from=1, to=nrow(x))) {
  for(j in seq(from=1, to=ncol(x))) {
    print(x[i, j])        # Print each traversed element in x
  }
}

#[1] 1
#[1] 3
#[1] 5
#[1] 2
#[1] 4
#[1] 6

# ---------------------------------------------------------------
# A for loop with break
numbers = c(2, 3, 12, 14, 5, 19, 23, 64)   # Set of numeric values

for (i in numbers) {
  # break the loop if number is 5
  if( i == 5) {
    break           # Stops at c[5] which has 5
  }
  print(i)
}
# After break, control is passed here

# ---------------------------------------------------------------
# Instead of terminating the loop, you can skip an iteration using
# the next statement.
numbers = c(2, 3, 12, 14, 5, 19, 23, 64)

for (i in numbers) {
  # use next to skip odd numbers
  if( i %% 2 != 0) {
    next
  }
  print(i)   # Only print even numbers from vector
}

# ---------------------------------------------------------------
# while control structure
# ---------------------------------------------------------------

count <- 0
while(count < 10) {
  print(count)           # Print 0 .. 9
  count <- count + 1
}


# ---------------------------------------------------------------
# More while control structure

# Let's try a probability data experiment flipping coins using
# the rbinom() function for random binomial distribution.
z <- 5

# Loop stops when z bounces out of end points 3 - 10
while(z >= 3 & z <= 10) {
  print(z)
  # Use binomial distribution:
  # n=1 Number of observations
  # size=1 Number of independent trials
  # prob=0.5 probability of success for each trial (fair coin toss)
  coin <- rbinom(n=1, size=1, prob=0.5)
  if(coin == 1) { ## random walk
    z <- z + 1
  } else {
    z <- z - 1
  }
}


# ---------------------------------------------------------------
# repeat control structure
# ---------------------------------------------------------------

# Now an optimization experiment
# NOTE: you can't actually run this code since stub function
# not defined!

x0 <- 1       # Initial value
delta <- 1e-8   # Converge to delta threshold to quit
repeat {
  x1 <- computeEstimate()    # computeEstimate() is a stub function
  if(abs(x1 - x0) < delta) {
    break
  } else {
    x0 <- x1
  }
}


# ---------------------------------------------------------------
# Infinite loop break

repeat {
  print("infinite loop, bad!")
  
}

# To stop the above, click on STOP SIGN icon in RStudio, type ESC.


# ---------------------------------------------------------------
# User Defined Functions (UDFs)
# ---------------------------------------------------------------

# Explore R syntax for defining and using a UDF
f <- function(a) {
  return(a+1)
}
f(100)
#[1] 101

# ---------------------------------------------------------------
# R uses "lazy" evaluation

# Here function has unused argument b
f <- function(a, b) {
  a^2        # Last expression in a function is the return value
}

f(2)    # Call the function passing a value for arg a

# ---------------------------------------------------------------
# This time both arguments are used in function body
f <- function(a, b) {
  print(a)
  print(b)
}

f(45)
#[1] 45
#Error in print(b) : argument "b" is missing, with no default


# ---------------------------------------------------------------
# Recursion in R: mostly used for traversing tree-based
# data structures

factorial <- function(x){
  
  if(x==1)
    return( 1)
  else
    return(x*factorial(x-1))
  
}

factorial(4)
#[1] 24


# ---------------------------------------------------------------
# Argument passing: R is a "pass arguments by value" language

# R has "pass-by-value" semantics, which minimizes accidental side
# effects (a good thing). However, when code is organized into
# many functions/methods for reusability/readability/maintainability
# and when that code needs to manipulate large data structures
# e.g., big data frames through a series of transformations/
# operations, the "pass-by-value" semantics leads to a lot of
# copying of data around that can result in heap thrashing
# (a bad thing). For example, a 50MB data frame that is passed
# as a function argument is not managed well.

arg1 <- 1

f <- function(x) {x <- 2}

f(arg1)   # arg1 is passed by value
print(arg1)    # Still 1! Not passed by reference.


# ---------------------------------------------------------------
# lapply() loop function
# ---------------------------------------------------------------

# Create a list with 2 elements: integer vector of length=5
# and numeric vector of length=10

# lapply() always returns a list, regardless of the class of
# the input.

x <- list(a = 1:5, b = rnorm(10))  # Normal distribution values
x
#$a
#[1] 1 2 3 4 5
#
#$b
#[1]  1.7233800  1.1606824 -2.0491337 -0.3789917 -0.4466583  0.4138854
#[7]  1.2072786 -1.6345064 -1.1511696  0.5912451

lapply(x, mean)   # Calculate mean of both vectors
#$a
#[1] 3
#
#$b
#[1] 0.0296824


# ---------------------------------------------------------------
# More lapply() loop function

# For rnorm(), mean=0 is default
# Here c uses mean=1
# Here d uses mean=5
x <- list(a = 1:4, b = rnorm(10), c = rnorm(20, 1),
          d = rnorm(100, 5))

lapply(x, mean)
#$a
#[1] 2.5

#$b
#[1] 0.06082667

#$c
#[1] 1.467083

#$d
#[1] 5.074749


# ---------------------------------------------------------------
# Even more lapply() loop function

x <- 1:4

# Generates random deviates
args(runif)     # Check out arg list for uniform distribution fcn
# arg n is number of observations
# Create a list object
# Element 1 has 1 random
# Element 2 has 2 randoms
# Element 3 has 3 randoms
# Element 4 has 4 randoms

l2 <- lapply(x, runif)
l2
#[[1]]
#[1] 0.2675082

#[[2]]
#[1] 0.2186453 0.5167968

#[[3]]
#[1] 0.2689506 0.1811683 0.5185761

#[[4]]
#[1] 0.5627829 0.1291569 0.2563676 0.7179353


# ---------------------------------------------------------------
# Still more lapply() loop function

x <- 1:4

# Note the ... argument is for min=0, max=10 below
? lapply

lapply(x, runif, min = 0, max = 10)
#[[1]]
#[1] 3.302142

#[[2]]
#[1] 6.848960 7.195282

#[[3]]
#[1] 3.5031416 0.8465707 9.7421014

#[[4]]
#[1] 1.195114 3.594027 2.930794 2.766946


# ---------------------------------------------------------------
# Final lapply() loop function

# Define a list consisting of 2 matrices
x <- list(a = matrix(1:4, 2, 2), b = matrix(1:6, 3, 2))
x
#$a
#     [,1] [,2]
#[1,]    1    3
#[2,]    2    4

#$b
#     [,1] [,2]
#[1,]    1    4
#[2,]    2    5
#[3,]    3    6

# lapply() and friends make heavy use of "anonymous" functions

# Define a "anonymous" function inside of lappy() for extracting
# first column of each matrix

l3 <- lapply(x, function(elt) elt[,1])
l3
#$a
#[1] 1 2

#$b
#[1] 1 2 3


# ---------------------------------------------------------------
# sapply() loop function
# ---------------------------------------------------------------

# First let's look at the lapply result
x <- list(a = 1:4, b = rnorm(10), c = rnorm(20, 1),
          d = rnorm(100, 5))
lapply(x, mean)
#$a
#[1] 2.5

#$b
#[1] 0.06082667

#$c
#[1] 1.467083

#$d
#[1] 5.074749

# Now let's use sapply to simplify

s1 <- sapply(x, mean)   # Returns a numeric vector, NOT a list
s1
#         a          b          c          d
#2.50000000 0.06082667 1.46708277 5.07474950


# ---------------------------------------------------------------
# switch control structure
# ---------------------------------------------------------------

# Create a vector of numeric product codes
product_ids <- c(101, 205, 310, 418, 502)

# Use sapply() and anonymous function to assign category
# based on product code
categories <- sapply(product_ids, function(product_id) {
  switch(as.character(product_id),
         "101" = "Electronics",
         "205" = "Clothing",
         "310" = "Home Appliances",
         "418" = "Beauty",
         "502" = "Sports",
         "Unknown"
  )
})

# Create a data frame with product_ids and their corresponding
# categories
result <- data.frame(product_id = product_ids,
                     category = categories)

print(result)






# MODULE 4 - R fundamentals
#
# (c) Copyright 2015-2024 - AMULET Analytics
# ---------------------------------------------------------------

# ---------------------------------------------------------------
# apply() loop function
# ---------------------------------------------------------------

# Use rnorm() function to generate test data: random numbers with
# a normal distribution
x <- matrix(rnorm(200), 20, 10)   # Create a 20x10 matrix
dim(x)
#[1] 20 10

# Compute mean over columns (MARGIN=2 for cols, MARGIN=1 rows)
v <- apply(X=x, MARGIN=2, FUN=mean)
v
#[1] -0.74303310  0.35458880  0.13481934  0.06145236  0.05091838
#[6] -0.17001175 -0.33114470  0.12330392  0.16776065  0.22982988

class(v)               # Numeric vector
# [1] "numeric"

# Compute sum for each row
v <- apply(x, 1, sum)
v
#[1] -0.7868339  1.2918416 -0.3977886  5.9339352  2.1263949 -1.3846887
#[7] -5.5452877 -0.6641990 -4.3731139  4.4081688 -0.5479200 -4.3701294
#[13]  3.4877387  3.8382023 -1.6243604  0.5771827 -3.9794925 -3.6587491
#[19] -0.4479327  3.6867072


# ---------------------------------------------------------------
# More apply() loop function

# Instead of doing this ...
row_sums = apply(X=x, MARGIN=1, FUN=sum)    # MARGIN=1 for rows
row_means = apply(X=x, MARGIN=1, FUN=mean)  # MARGIN=1 for rows
col_sums = apply(x, 2, sum)                 # MARGIN=2 for cols
col_means = apply(x, 2, mean)               # MARGIN=2 for cols

# ... you can use these built-in function shortcuts
row_sums  <- rowSums(x)
row_means <- rowMeans(x)
col_sums  <- colSums(x)
col_means <- colMeans(x)

# ---------------------------------------------------------------
# Even more apply() loop function

x <- matrix(rnorm(200), 20, 10)      # 20x10 matrix

# Find "Quantiles" of the rows of a matrix. In this example
# calculate 25% and 75% percentiles.
#
# Quantiles are points in a distribution that relate to the rank
# order of values in that distribution. For example, the middle
# quantile, or 50th percentile, is known as the median.

m <- apply(X=x, MARGIN=1, FUN=quantile, probs = c(0.25, 0.75))
m
#[,1]       [,2]       [,3]       [,4]       [,5]       [,6]
#25% -0.4739391 -0.8677358 -0.6958262 -0.1979822 -0.6930038 -0.7304902
#75%  0.4367207  0.3091204  0.3277869  0.6755583  0.8138959  0.4037430
#[,7]       [,8]       [,9]     [,10]      [,11]      [,12]
#25% -0.5236675 -0.5798327 -0.5347041 0.5238555 -0.7548490 -1.2683917
#75%  0.5993433  0.5234082  0.6125282 1.5146487 -0.1986852 -0.3488457
#[,13]      [,14]      [,15]      [,16]      [,17]      [,18]
#25% -0.5033292 -0.3253095 -0.2787021 -0.8012668 -1.1480751 -1.0877927
#75%  0.5538329  0.5726695  0.2829677  0.7507799  0.9994819  0.2751738
#[,19]      [,20]
#25% -1.212010 -1.2269352
#75%  1.315204  0.3881853

# ---------------------------------------------------------------
# Still more apply() loop function

# R arrays may contain 1, 2 or more dimensions

# Create a 3-dimensional matrix: 2 rows, 2 columns, 10 depth
a <- array(rnorm(2 * 2 * 10), dim=c(2, 2, 10))

# Average matrix in an array
# Collapse 3rd dimension
# MARGIN=c(1,2) indicates rows and columns
m <-apply(X=a, MARGIN=c(1, 2), FUN=mean)
m
#            [,1]      [,2]
#[1,] -0.64619153 0.4342067
#[2,]  0.09584386 0.4556951

class(m)
# [1] "matrix"

# Another way to do it
m <- rowMeans(a, dims = 2)     # Also returns a matrix
m
#            [,1]      [,2]
#[1,] -0.64619153 0.4342067
#[2,]  0.09584386 0.4556951

# ---------------------------------------------------------------
# Use apply() to remove all rows with ANY variable containing
# an empty string

mydf <- data.frame(V1=c("a","","","d",""),
                   V2=c("1","","3","4",""),
                   V3=c("m1","","m3","m4",""))
mydf
#  V1 V2 V3
#1  a  1 m1
#2
#3     3 m3
#4  d  4 m4
#5

# MARGIN=1 means rows
mydf <- mydf[!apply(mydf, 1, function(x) any(x=="")),]
mydf
#  V1 V2 V3
#1  a  1 m1
#4  d  4 m4


# ---------------------------------------------------------------
# tapply() loop function - apply a function over a ragged array
# ---------------------------------------------------------------

# Take group means

# Define a numeric vector of length 30
# runif() generates random variables with a uniform distribution
x <- c(rnorm(10), runif(10), rnorm(10, 1))

# gl(n,k) generates factor levels, n=# levels, k=# replications
f <- gl(n=3, k=10)        # Create factor variable f
f
#[1] 1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 3 3 3 3 3 3 3 3 3 3
#Levels: 1 2 3

# Take group means
a <- tapply(X=x, INDEX=f, FUN=mean)
a
#         1          2          3
#-0.1518069  0.5257590  0.4846167

class(a)
# [1] "array"

# ---------------------------------------------------------------
# More tapply() loop function

# Take group means without simplification.

# Use argument simplify=FALSE always returns "list"
list1 <- tapply(X=x, INDEX=f, FUN=mean, simplify = FALSE)
list1
#$`1`
#[1] -0.1518069

#$`2`
#[1] 0.525759

#$`3`
#[1] 0.4846167


# ---------------------------------------------------------------
# Even more tapply() loop function

# Find group ranges.

# Calculate the MIN and MAX values
tapply(x, f, range)
#$`1`
#[1] -1.817712  1.013674

#$`2`
#[1] 0.1173772 0.9314156

#$`3`
#[1] -1.192308  3.340692


# ---------------------------------------------------------------
# split() function - split vector x according to factor f into
# a list with a number of elements equal to # levels
# Also: unsplit()
# ---------------------------------------------------------------

x <- c(rnorm(10), runif(10), rnorm(10, 1))   # Vector length 30
f <- gl(n=3, k=10)   # n=number of levels, k=number of replications

# Divide x into the groups defined by f
s <- split(x, f)
s
#$`1`
#[1]  0.6747407  0.7809243 -1.3207132  0.1955758  1.2876734  1.3496505
#[7] -1.1890280 -1.1237316  1.4768832 -1.4751009

#$`2`
#[1] 0.6419825 0.3419221 0.6671094 0.5453081 0.5255481 0.1115069
#[7] 0.6517376 0.2380157 0.9482666 0.0627268

#$`3`
#[1] 1.1046428 1.4646097 1.5050529 3.1584884 0.6394136 0.9963238
#[7] 1.5416058 0.8581232 1.5952700 1.0198079


# ---------------------------------------------------------------
# More split() function

# A common idiom is split() followed by an lapply()

# Same as tapply
lapply(split(x, f), mean)
#$`1`
#[1] 0.06568742

#$`2`
#[1] 0.4734124

#$`3`
#[1] 1.388334


# ---------------------------------------------------------------
# splitting a data frame

data(airquality)
head(airquality)

# Create a list s with one element a list for each month
s <- split(airquality, airquality$Month)
s       # Check this out!
s[['7']]    # For July

s$'7'

# Calculate column mean for Ozone, Solar.R, Wind
# Notice some are NA because of missing data
# Good example of embedding a function in a function call
lapply(s, function(x) colMeans(x[, c("Ozone", "Solar.R", "Wind")]))


# ---------------------------------------------------------------
# More splitting a data frame

# The data set only has months May-Sept
# Missing data causes the NA
s1 <- sapply(s,
             function(x) colMeans(x[, c("Ozone", "Solar.R", "Wind")]))
s1
#               5         6          7        8        9
#Ozone         NA        NA         NA       NA       NA
#Solar.R       NA 190.16667 216.483871       NA 167.4333
#Wind    11.62258  10.26667   8.941935 8.793548  10.1800

# Now repeat above by remove the NAs
sapply(s, function(x) colMeans(x[, c("Ozone", "Solar.R", "Wind")],
                               na.rm = TRUE))
#                5         6          7          8         9
#Ozone    23.61538  29.44444  59.115385  59.961538  31.44828
#Solar.R 181.29630 190.16667 216.483871 171.857143 167.43333
#Wind     11.62258  10.26667   8.941935   8.793548  10.18000


# ---------------------------------------------------------------
# Dates and times in R using Base R functionality
# ---------------------------------------------------------------

# "UNIX epoch" used by UNIX engineers per Dennis Richie.
# 1 January 1970 00:00:00 UTC was considered a convenient date
# to work with.
x <- as.Date("1970-01-01")
x
#[1] "1970-01-01"

x+1     # Allows for date arithmetic
#[1] "1970-01-02"

unclass(x)
#[1] 0       # The origin date, beginning of "R time" Jan 1, 1970

dd <- as.Date("1963-06-06")
unclass(dd)
#[1] -2401   # Dates prior to 1/1/1970 are negative

unclass(as.Date("1970-01-02"))
#[1] 1


# ---------------------------------------------------------------
# Date and time support functions in R
# ---------------------------------------------------------------

weekdays(x)
#[1] "Thursday"

months(x, abbreviate=TRUE)
#[1] "Jan"

quarters(x)
#[1] "Q1"


# ---------------------------------------------------------------
# Date and time handling in R
# ---------------------------------------------------------------

# POSIXct class - for storing time data in a data frame
#    In format: 2015-04-14 18:18:41 PDT

# POSIXlt class - is a list under the hood with additional
#    items like day-of-week, day-of-year, etc.

x <- Sys.time()   # POSIXct class
x
#[1] "2015-04-14 18:14:32 PDT"

class(x)                  # POSIXt is a virtual class
#[1] "POSIXct" "POSIXt"

# Cast into POSIXlt class
p <- as.POSIXlt(x)
p
#[1] "2015-04-14 18:14:32 PDT"

# Display components in POSIXlt object
names(unclass(p))
#[1] "sec"    "min"    "hour"   "mday"   "mon"    "year"   "wday"
#[8] "yday"   "isdst"  "zone"   "gmtoff"

? POSIXlt  # For definition of list items

p$min      # 0-59: minutes

p$mday     # 1-31: day of the month

unclass(p)   # Show all list values

# ---------------------------------------------------------------
# Still more dates and times in R

x <- Sys.time()
x ## Already in `POSIXct' format
#[1] "2015-04-14 18:18:41 PDT"

# Times are stored as number of seconds since 1/1/1970
# so big number!
unclass(x)
#[1] 1429060722

x$sec       # Error since in POSIXct format, not POSIXlt

# Coerce the value
p <- as.POSIXlt(x)   # Coerce to list form of time
p$sec     # Now seconds is available


# ---------------------------------------------------------------
# Still more dates and times in R
# strptime() is for date-time conversions to and from char

datestring <- c("January 10, 2012 10:40", "December 9, 2011 09:10")
x <- strptime(datestring, "%B %d, %Y %H:%M")
x
#[1] "2012-01-10 10:40:00 PST" "2011-12-09 09:10:00 PST"

class(x)
#[1] "POSIXlt" "POSIXt"

?strptime        # To see all the "conversion specification" codes


# ---------------------------------------------------------------
# Still more dates and times in R

x <- as.Date("2012-01-01")     # Date class
y <- strptime("9 Jan 2011 11:34:21", "%d %b %Y %H:%M:%S")  # POSIXlt class
x - y    # Error!

x <- as.POSIXlt(x)
x - y             # Now both POSIXlt class
#Time difference of 356.1845 days


# ---------------------------------------------------------------
# Still more dates and times in R

# Data arithmetic
x <- as.Date("2012-03-01")   # Class is "Date"
y <- as.Date("2012-02-28")   # Class is "Date"
delta <- x - y
delta
#Time difference of 2 days

class(delta)
#[1] "difftime"      # Special "difftime" class

# Below x,y have class "POSIXct" "POSIXt"
x <- as.POSIXct("2012-10-25 01:00:00")     # PDT
# Specify time zone with tz. GMT is UTC
y <- as.POSIXct("2012-10-25 06:00:00", tz = "GMT")

y - x
#Time difference of -2 hours


# ---------------------------------------------------------------
# Random sampling with sample()
# ---------------------------------------------------------------

set.seed(1)        # seed() must preceed all random functions

sample(1:10, 4)    # Choose from integers 1:10, choose 4 items
#[1] 3 4 5 7

sample(1:10, 4)    # Repeat with no seed()
#[1] 3 9 8 5

letters            # Built-in character vector
#[1] "a" "b" "c" "d" "e" "f" "g" "h" "i" "j" "k" "l" "m" "n" "o" "p" "q"
#[18] "r" "s" "t" "u" "v" "w" "x" "y" "z"

sample(letters, 5) # Choose random letters
#[1] "q" "b" "e" "x" "p"

sample(1:10)       # permutation 1
#[1] 4 7 10 6 9 2 8 3 1 5

sample(1:10)       # permutation 2
#[1] 2 3 4 1 9 5 10 8 6 7

# Default is replace=FALSE, no replacement
# "replacement" means what you've randomly selected is/is not
# put back into the data next time around.

# With replacement, the following may include dups
sample(1:10, replace = TRUE) # Sample w/replacement

# ---------------------------------------------------------------
# Random sampling of a data frame

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






# MODULE 5 - Data Access
#
# (c) Copyright 2015-2024 - AMULET Analytics
# ---------------------------------------------------------------

# --------------------------------------------------------------
# Base R has an automatically loaded package "datasets"
# containing many sample data sets for learning purposes.
# --------------------------------------------------------------
library(help="datasets")


# --------------------------------------------------------------
# Downloading a data set from data repository: data.sfgov.org
# --------------------------------------------------------------

# Store download URL pointing to data set
fileUrl <- "https://data.sfgov.org/api/views/8vzz-qzz9/rows.csv?accessType=DOWNLOAD"

# NOTE: need to use RStudio to set working directory!

# Download the data set to data folder in Working Directory
download.file(fileUrl, destfile="./data/SFParkingMeters.csv")

# Verify the data set landed properly
list.files("./data")
# [1] "SFParkingMeters.csv"

# Now read the data set into R
SFParkingMeters <- read.table("./data/SFParkingMeters.csv",
                              sep=",",
                              quote = "\"",
                              header=TRUE)

# Take a look to see if data looks reasonable
head(SFParkingMeters)


# --------------------------------------------------------------
# Reading CSV files
# --------------------------------------------------------------

# Read the CSV file directly, assuming it is comma separated
SFParkingMeters <- read.csv("./data/SFParkingMeters.csv")


# --------------------------------------------------------------
# Reading EXCEL files
# --------------------------------------------------------------

# NOTE: your computer may need the Java Runtime installed
# (since xlsx was written in Java. Please visit the main
# Java site to download the Runtime: www.java.com)
#install.packages("xlsx")
library(xlsx)

# Listing of Active Businesses in Los Angeles via: lacity.data.org
# Download this Excel file from Canvas
LABusinesses <- read.xlsx2("./data/Listing_of_Active_Businesses.xlsx", sheetIndex=1)

# Review variables
head(LABusinesses)

# Can also use write.xlsx() to write Excel files

# An alternative R package for reading Excel files is "readxl" with
# a function read_excel() as used below:
#install.packages("readxl")
library(readxl)

LABusinesses <- read_excel("./data/Listing_of_Active_Businesses.xlsx")


# --------------------------------------------------------------
# Using fread() from data.table package
# --------------------------------------------------------------

# See docs for "Fast and friendly file finagler"
# https://www.rdocumentation.org/packages/data.table/versions/1.12.8/topics/fread

#install.packages("data.table")
library(data.table)

# Fast data import for big data files
SFParkingMeters <- fread("./data/SFParkingMeters.csv",
                         sep = ",",
                         header= TRUE)
class(SFParkingMeters)
#[1] "data.table" "data.frame"

# --------------------------------------------------------------
# Variable location for a data set. Use NYC-flights14 data
# obtained from the flights package (available on GitHub only).
# It contains On-Time flights data from the Bureau of
# Transportation Statistics for all the flights that departed
# from New York City airports in 2014

input <- if (file.exists("flights14.csv")) {
  "flights14.csv"
} else {
  "https://raw.githubusercontent.com/Rdatatable/data.table/master/vignettes/flights14.csv"
}
flights <- fread(input)
flights


# --------------------------------------------------------------
# Using File Connections
# --------------------------------------------------------------

con <- file("./data/SFParkingMeters.csv", "r")

SFParkingMeters <- read.csv(con)

close(con)


# --------------------------------------------------------------
# Reading a web page
#
# NOTE: see Tidyverse package rvest as a nice web scraping tool
# --------------------------------------------------------------

con <- url("http://radicaldatascience.wordpress.com/", "r")

RDS <- readLines(con, n=50)

close(con)

RDS            # Lot's of weird stuff: HTML, CSS, Javascript


class(RDS)     # Character vector, 50 elements
# [1] "character"


# --------------------------------------------------------------
# Accessing SQL Databases
# --------------------------------------------------------------

# Access relational database from Microsoft SQL Server Express

#install.packages("RODBC")
library(RODBC)

# NOTE: Requires Microsoft SQL Server developer's edition
# installed on local machine
con <- odbcConnect("Heritage", uid="dan")

# SQL statements passed to back-end database must be recognized
# by this particular relational database system. There are
# many dialects/feature-sets for SQL database systems.

df <- sqlQuery(con, "SELECT TOP 1000 [MemberID]
      ,[ProviderID]
      ,[Vendor]
                      ,[PCP]
                      ,[Year]
                      ,[Specialty]
                      ,[PlaceSvc]
                      ,[PayDelay]
                      ,[LengthOfStay]
                      ,[DSFS]
                      ,[PrimaryConditionGroup]
                      ,[CharlsonIndex]
                      ,[ProcedureGroup]
                      ,[SupLOS]
                      ,[dsfsI]
                      ,[CharlsonIndexI]
                      ,[LengthOfStayI]
                      ,[PayDelayI]
                      FROM [Heritage].[dbo].[Claims]")

odbcClose(con)

names(df)

# [1] "MemberID"              "ProviderID"            "Vendor"
# [4] "PCP"                   "Year"                  "Specialty"
# [7] "PlaceSvc"              "PayDelay"              "LengthOfStay"
# [10] "DSFS"                  "PrimaryConditionGroup" "CharlsonIndex"
# [13] "ProcedureGroup"        "SupLOS"                "dsfsI"
# [16] "CharlsonIndexI"        "LengthOfStayI"         "PayDelayI"

# Use R stats functions on data pulled from SQL database
mean(df$PayDelayI)

# [1] 42.944


# --------------------------------------------------------------
# Use SQL on R data frames
# --------------------------------------------------------------

#install.packages("sqldf")
library (sqldf)

# SQL queries using sqldf

# First, create two data frames with test data
orders <- data.frame(order_no=c("10021","10022","10023","10024","10025"),
                     prod_id=c("AC-01","AC-01","AD-11","AE-21","AM-19"),
                     qty=c(1,1,2,3,1))

product <- data.frame(prod_id=c("AC-01","AD-11","AE-21","AM-19","AG-40"),
                      desc=c("Widget A","Widget B","Widget C","Widget D", "Widget E"),
                      price=c(123.50,25,55,17.95,45.33))


# Select all rows from product table (data frame)
sqldf("SELECT * FROM product;")

# Select all rows from product tabld (data frame) ordering by price
sqldf("SELECT * FROM product ORDER BY price;")

# Select rows from product table where the price is 55
sqldf("SELECT * FROM product WHERE price=55;")

# Select rows from product table using a logical expression
sqldf("SELECT * FROM product WHERE price>20 AND price <100;")

# Now use SQL inner join query
# NOTE: not all SQL implementations have TOP n clause. Just like
# with MySQL, in R you can use "limit 4" at end of SQL string

sqldf("SELECT o.*, p.price 
      FROM orders o
      INNER JOIN product p ON o.prod_id = p.prod_id;")

#order_no prod_id qty  price
#1    10021   AC-01   1 123.50
#2    10022   AC-01   1 123.50
#3    10023   AD-11   2  25.00
#4    10024   AE-21   3  55.00
#5    10025   AM-19   1  17.95


# --------------------------------------------------------------
# SQL Equivalents in R
# --------------------------------------------------------------

data(CO2)       # Use CO2 data set in base R
? CO2           # Carbon dioxide uptake in grass plants

head(CO2)
#  Plant   Type  Treatment conc uptake
#1   Qn1 Quebec nonchilled   95   16.0
#2   Qn1 Quebec nonchilled  175   30.4
#3   Qn1 Quebec nonchilled  250   34.8
#4   Qn1 Quebec nonchilled  350   37.2
#5   Qn1 Quebec nonchilled  500   35.3
#6   Qn1 Quebec nonchilled  675   39.2

# --------------------------------------------------------------
# SQL select with compound logical expression in WHERE
# SELECT * FROM CO2 WHERE conc>400 AND uptake>40

CO2_subset <- CO2[CO2$conc>400 & CO2$uptake>40,]
head(CO2_subset)
#   Plant   Type  Treatment conc uptake
#12   Qn2 Quebec nonchilled  500   40.6
#13   Qn2 Quebec nonchilled  675   41.4
#14   Qn2 Quebec nonchilled 1000   44.3
#19   Qn3 Quebec nonchilled  500   42.9
#20   Qn3 Quebec nonchilled  675   43.9
#21   Qn3 Quebec nonchilled 1000   45.5

dim(CO2_subset)
#[1] 8 5

# --------------------------------------------------------------
# Use SQL to order the data frame
# SELECT * FROM CO2 ORDER BY conc, uptake DESC

CO2[order(CO2$conc, -CO2$uptake),][1:20,]

#   Plant        Type  Treatment conc uptake
#15   Qn3      Quebec nonchilled   95   16.2
#1    Qn1      Quebec nonchilled   95   16.0
#36   Qc3      Quebec    chilled   95   15.1
#22   Qc1      Quebec    chilled   95   14.2
#8    Qn2      Quebec nonchilled   95   13.6
#50   Mn2 Mississippi nonchilled   95   12.0
#57   Mn3 Mississippi nonchilled   95   11.3
#43   Mn1 Mississippi nonchilled   95   10.6
#78   Mc3 Mississippi    chilled   95   10.6
#64   Mc1 Mississippi    chilled   95   10.5
#29   Qc2      Quebec    chilled   95    9.3
#71   Mc2 Mississippi    chilled   95    7.7
#16   Qn3      Quebec nonchilled  175   32.4
#2    Qn1      Quebec nonchilled  175   30.4
#9    Qn2      Quebec nonchilled  175   27.3
#30   Qc2      Quebec    chilled  175   27.3
#23   Qc1      Quebec    chilled  175   24.1
#51   Mn2 Mississippi nonchilled  175   22.0
#37   Qc3      Quebec    chilled  175   21.0
#58   Mn3 Mississippi nonchilled  175   19.4

# --------------------------------------------------------------
# Use SQL for GROUP BY aggregations
# SELECT Plant, AVG(uptake) FROM CO2 GROUP BY Plant

# Use aggregate() to compute summary statistics of
# data subsets

# In this example, compute mean of uptake for each Plant
# NOTE: by argument must be a list or data frame

aggregate(x=CO2$uptake,
          by=data.frame(CO2$Plant),
          FUN="mean")
#   CO2.Plant        x
#1        Qn1 33.22857
#2        Qn2 35.15714
#3        Qn3 37.61429
#4        Qc1 29.97143
#5        Qc3 32.58571
#6        Qc2 32.70000
#7        Mn3 24.11429
#8        Mn2 27.34286
#9        Mn1 26.40000
#10       Mc2 12.14286
#11       Mc3 17.30000
#12       Mc1 18.00000


# --------------------------------------------------------------
# API key access to data repository
# --------------------------------------------------------------

# tidycensus is an R package that allows users to interface
# with a select number of the US Census Bureau’s data APIs and
# return tidyverse-ready data frame.
# https://walker-data.com/tidycensus/index.html

# Must request API key via: http://api.census.gov/data/key_signup.html

#install.packages("tidycensus")
library(tidycensus)
library(tidyverse)

# Authenticate with Census API key first time only.
#census_api_key("e12720f5fe849666a12fca1c25017c7733235ef6", install=TRUE)
#readRenviron("~/.Renviron")

age20 <- get_decennial(geography = "state",
                       variables = "P13_001N",
                       year = 2020,
                       sumfile = "dhc")

head(age20)


# --------------------------------------------------------------
# Writing Data to a File from R
# --------------------------------------------------------------

tempDF <- SFParkingMeters[,-1]   # Remove POST_ID variable

write.csv(tempDF, file="./data/newSFParkingMeters.csv")

# Read data set back in to check
newSFParkingMeters <- read.csv("./data/newSFParkingMeters.csv")

head(newSFParkingMeters, 10)











# MODULE 6 - Data Munging
#
# (c) Copyright 2015-2024 - AMULET Analytics
# ---------------------------------------------------------------

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
                                orders="%y-%m-%d %H:%M")

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
                                   orders="%y-%m-%d %H:%M")

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

# Ways to work with the order of elements in R objects:

x <- c(0, 20, 10, 15)        # Define a numeric vector

# SORT vector - Rearranges elements in ascending order
y = sort(x)    # Returns numeric vector with sorted elements
print(y)
#[1]  0 10 15 20
class(y)
#[1] "numeric"

# ORDER vector - Produce index of each element in sorted order
y = order(x)   # Returns integer vector with row numbers from x
print(y)
#[1] 1 3 4 2
class(y)
#[1] "integer"

# ---------------------------------------------------------------
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








