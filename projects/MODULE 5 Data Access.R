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

# NOTE: need to use RStudio to set directory!

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

# Read from Microsoft SQL Server Express

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







