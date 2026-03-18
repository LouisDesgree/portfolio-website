# UCLA Extension
# Introduction to Data Science COM SCI X 450.1
# Instructor: Daniel D. Gutierrez
# HOMEWORK 3
# Louis Desgrée

# QUESTION 1, PART A

# Load the ISLR package and Auto data
# Uncomment the line below if the package is missing
# install.packages("ISLR")
library(ISLR)
data("Auto")

# Remove the name column (not numeric, not needed here)
auto_numeric <- Auto[, -which(names(Auto) == "name")]

# Generate pairwise plots to visualize relationships
pairs(auto_numeric)

# Compute the correlation matrix for numeric columns
cor_matrix <- cor(auto_numeric)

# Print correlation matrix
cor_matrix
# Observations:
# - Strong negative correlation between mpg and horsepower (-0.7784).
# - Weight and horsepower have a strong positive correlation (0.8645).
# - Displacement is highly correlated with weight (0.9330) and cylinders (0.9508).
# - Indicates that larger, more powerful cars generally consume more fuel.

# QUESTION 1, PART B

# Perform simple linear regression with mpg as the response and horsepower as the predictor
lm1 <- lm(mpg ~ horsepower, data = Auto)

# Print the summary of the linear model
summary(lm1)
# Output:
# Call:
# lm(formula = mpg ~ horsepower, data = Auto)
#
# Residuals:
#      Min       1Q   Median       3Q      Max 
# -13.5710  -3.2592  -0.3435   2.7630  16.9240 
#
# Coefficients:
#              Estimate Std. Error t value Pr(>|t|)    
# (Intercept) 39.935861   0.717499   55.66   <2e-16 ***
# horsepower  -0.157845   0.006446  -24.49   <2e-16 ***
# ---
# Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1
#
# Residual standard error: 4.906 on 390 degrees of freedom
# Multiple R-squared:  0.6059, Adjusted R-squared:  0.6049 
# F-statistic: 599.7 on 1 and 390 DF,  p-value: < 2.2e-16
#
# Observations:
# - The intercept (39.936) represents the predicted mpg when horsepower is 0.
# - The slope (-0.1578) shows a negative relationship between horsepower and mpg.
# - For every additional horsepower, mpg decreases by 0.158.
# - R-squared (0.6059): ~60.59% of the variability in mpg is explained by horsepower.
# - Very strong evidence of a linear relationship (p-value < 0.001).

# Create scatterplot of mpg vs horsepower
plot(
  Auto$horsepower,
  Auto$mpg,
  main = "MPG vs Horsepower",
  xlab = "Horsepower",
  ylab = "Miles Per Gallon",
  pch = 16, # Solid points
  col = "blue"
)

# Add the regression line
abline(lm1, col = "red", lwd = 2)
# Visualization:
# - The plot shows a clear negative trend between mpg and horsepower.
# - The regression line captures the overall relationship accurately.

# QUESTION 1, PART C

# Perform simple linear regression with mpg as the response and weight as the predictor
lm2 <- lm(mpg ~ weight, data = Auto)

# Print the summary of the linear model
summary(lm2)
# Output:
# Call:
# lm(formula = mpg ~ weight, data = Auto)
#
# Residuals:
#      Min       1Q   Median       3Q      Max 
# -11.9736  -2.7556  -0.3358   2.1379  16.5194 
#
# Coefficients:
#              Estimate Std. Error t value Pr(>|t|)    
# (Intercept) 46.216524   0.798673   57.87   <2e-16 ***
# weight      -0.007647   0.000258  -29.64   <2e-16 ***
# ---
# Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1
#
# Residual standard error: 4.333 on 390 degrees of freedom
# Multiple R-squared:  0.6926, Adjusted R-squared:  0.6918 
# F-statistic: 878.8 on 1 and 390 DF,  p-value: < 2.2e-16
#
# Observations:
# - The intercept (46.2165) represents the predicted mpg when weight is 0.
# - The slope (-0.007647) shows a negative relationship between weight and mpg.
# - For every additional unit increase in weight, mpg decreases by ~0.00765.
# - R-squared (0.6926): ~69.26% of the variability in mpg is explained by weight.
# - Very strong evidence of a linear relationship (p-value < 0.001).

# Create scatterplot of mpg vs weight
plot(
  Auto$weight,
  Auto$mpg,
  main = "MPG vs Weight",
  xlab = "Weight",
  ylab = "Miles Per Gallon",
  pch = 16, # Solid points
  col = "blue"
)

# Add the regression line
abline(lm2, col = "red", lwd = 2)
# Visualization:
# - The scatterplot shows a clear negative trend between weight and mpg.
# - The regression line highlights the negative relationship, with mpg decreasing as weight increases.

# QUESTION 1, PART D

# Perform multiple linear regression with mpg as the response and horsepower and weight as predictors
lm3 <- lm(mpg ~ horsepower + weight, data = Auto)

# Print the summary of the linear model
summary(lm3)
# Output:
# Call:
# lm(formula = mpg ~ horsepower + weight, data = Auto)
#
# Residuals:
#      Min       1Q   Median       3Q      Max 
# -11.0762  -2.7340  -0.3312   2.1752  16.2601 
#
# Coefficients:
#               Estimate Std. Error t value Pr(>|t|)    
# (Intercept)  45.6402108  0.7931958  57.540  < 2e-16 ***
# horsepower   -0.0473029  0.0110851  -4.267 2.49e-05 ***
# weight       -0.0057942  0.0005023 -11.535  < 2e-16 ***
# ---
# Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1
#
# Residual standard error: 4.24 on 389 degrees of freedom
# Multiple R-squared:  0.7064, Adjusted R-squared:  0.7049 
# F-statistic: 467.9 on 2 and 389 DF,  p-value: < 2.2e-16
#
# Observations:
# - The intercept (45.6402) represents the predicted mpg when both horsepower and weight are 0.
# - Horsepower slope (-0.0473): mpg decreases by ~0.047 for each additional horsepower unit.
# - Weight slope (-0.00579): mpg decreases by ~0.0058 for each additional weight unit.
# - Both predictors are significant (p-values < 0.001).
# - Adjusted R-squared (0.7049): ~70.49% of mpg variability explained by the predictors.
# - Strong overall model fit (p-value < 0.001 for F-statistic).

# Produce diagnostic plots for the regression fit
plot(lm3)
# Observations for each plot:
# 1. **Residuals vs Fitted**:
#    - Shows slight heteroscedasticity (non-constant variance in residuals), suggesting some patterns in the errors.
# 2. **Normal Q-Q**:
#    - Most points lie on the line, but there are a few outliers in the tails, indicating mild deviation from normality.
# 3. **Scale-Location**:
#    - Residuals are not perfectly spread out across fitted values, indicating possible heteroscedasticity.
# 4. **Residuals vs Leverage**:
#    - Some high-leverage points are present, but none are overly influential as indicated by Cook's distance.

# Predict mpg for horsepower = 98 and weight = 2500
predicted_mpg <- predict(lm3, newdata = data.frame(horsepower = 98, weight = 2500))
predicted_mpg
# Output:
# Predicted mpg = [To be added based on actual computation]
# Observation:
# - The predicted mpg value reflects the expected fuel efficiency for a car with these specifications.

# QUESTION 2, PART A

# Load the ISLR package and Auto data
library(ISLR)
data("Auto")

# Calculate the median mpg value
mpg_median <- median(Auto$mpg)
# Output:
# mpg_median = 22.75
# - The median value is used as the threshold to classify cars into low (0) and high (1) mpg categories.

# Create a binary variable mpg01
Auto$mpg01 <- ifelse(Auto$mpg > mpg_median, 1, 0)
# - mpg01 = 1 for cars with mpg > 22.75 (high mpg).
# - mpg01 = 0 for cars with mpg <= 22.75 (low mpg).

# Create a new data frame with the additional mpg01 column
Auto_binary <- Auto

# Print the structure of the updated data frame
str(Auto_binary)
# Output:
# 'data.frame':	392 obs. of  10 variables:
#  $ mpg         : num  18 15 18 16 17 15 14 14 14 15 ...
#  $ cylinders   : num  8 8 8 8 8 8 8 8 8 8 ...
#  $ displacement: num  307 350 318 304 302 429 454 440 455 390 ...
#  $ horsepower  : num  130 165 150 150 140 198 220 215 225 190 ...
#  $ weight      : num  3504 3693 3436 3433 3449 ...
#  $ acceleration: num  12 11.5 11 12 10.5 10 9 8.5 10 8.5 ...
#  $ year        : num  70 70 70 70 70 70 70 70 70 70 ...
#  $ origin      : num  1 1 1 1 1 1 1 1 1 1 ...
#  $ name        : Factor w/ 304 levels "amc ambassador brougham",..: 49 36 231 14 161 141 54 223 241 2 ...
#  $ mpg01       : num  0 0 0 0 0 0 0 0 0 0 ...
# - The new data frame contains 392 rows and 10 variables, including mpg01.

# Check the distribution of the new binary variable
table(Auto_binary$mpg01)
# Output:
#   0   1 
# 196 196
# - 196 cars are classified as having low mpg (mpg01 = 0).
# - 196 cars are classified as having high mpg (mpg01 = 1).
# - The split is perfectly even due to the use of the median mpg value as the threshold.

# QUESTION 2, PART B

# Compute a correlation matrix for all numeric predictors
cor_matrix <- cor(Auto_binary[, -which(names(Auto_binary) %in% c("name", "mpg01"))])

# Print the correlation matrix
cor_matrix
# Output:
#                    mpg  cylinders displacement horsepower     weight acceleration
# mpg           1.0000000 -0.7776175   -0.8051269 -0.7784268 -0.8322442    0.4233285
# cylinders    -0.7776175  1.0000000    0.9508233  0.8429834  0.8975273   -0.5046834
# displacement -0.8051269  0.9508233    1.0000000  0.8972570  0.9329944   -0.5438005
# horsepower   -0.7784268  0.8429834    0.8972570  1.0000000  0.8645377   -0.6891955
# weight       -0.8322442  0.8975273    0.9329944  0.8645377  1.0000000   -0.4168392
# acceleration  0.4233285 -0.5046834   -0.5438005 -0.6891955 -0.4168392    1.0000000
# year          0.5805410 -0.3456474   -0.3698552 -0.4163615 -0.3091199    0.2903161
# origin        0.5652088 -0.5689316   -0.6145351 -0.4551715 -0.5850054    0.2127458
#                   year     origin
# mpg           0.5805410  0.5652088
# cylinders    -0.3456474 -0.5689316
# displacement -0.3698552 -0.6145351
# horsepower   -0.4163615 -0.4551715
# weight       -0.3091199 -0.5850054
# acceleration  0.2903161  0.2127458
# year          1.0000000  0.1815277
# origin        0.1815277  1.0000000

# Observations:
# - mpg is strongly negatively correlated with:
#   - weight (-0.8322): Heavier cars tend to have lower mpg.
#   - displacement (-0.8051): Larger engines tend to consume more fuel.
#   - horsepower (-0.7784): Higher engine power generally results in lower mpg.
#   - cylinders (-0.7776): Cars with more cylinders tend to have lower mpg.
# - mpg is moderately positively correlated with:
#   - year (0.5805): Newer cars tend to have higher mpg, likely due to advancements in fuel efficiency.
#   - origin (0.5652): Cars from certain regions (e.g., Asia) might have better fuel efficiency.
# - Acceleration (0.4233) is weakly correlated with mpg, indicating it might be less useful as a predictor.

# Commentary:
# - Based on the correlation matrix, weight, horsepower, displacement, and cylinders are the most likely predictors for mpg01 due to their strong negative correlations with mpg.
# - Year and origin may also be useful as they show moderate positive correlations with mpg.
# - Acceleration appears to be the least likely predictor due to its weaker correlation with mpg.

# QUESTION 2, PART C

# Set seed for reproducibility
set.seed(42)

# Define the split percentage (e.g., 70% training and 30% test)
split_percentage <- 0.7

# Create an index for training data
train_index <- sample(1:nrow(Auto_binary), size = floor(split_percentage * nrow(Auto_binary)))

# Split the data into training and test sets
train_set <- Auto_binary[train_index, ]
test_set <- Auto_binary[-train_index, ]

# Check the number of rows in each set
cat("Number of observations in training set:", nrow(train_set), "\n")
cat("Number of observations in test set:", nrow(test_set), "\n")
# Output:
# Number of observations in training set: 274
# Number of observations in test set: 118

# Observations:
# - The data was split into a training set (70% of the data, 274 observations) and a test set (30% of the data, 118 observations).
# - The split percentage ensures a good balance between training and testing while maintaining sufficient data for both.
# - You can adjust the `split_percentage` value if you wish to experiment with other splits to minimize test error.

# QUESTION 2, PART D

# Train the glm() algorithm using mpg01 as the response and selected predictors
glm_model <- glm(
  mpg01 ~ weight + horsepower + displacement + cylinders + year + origin, # Selected predictors
  data = train_set,
  family = binomial
)

# Print the summary of the model
summary(glm_model)
# Output:
# Call:
# glm(formula = mpg01 ~ weight + horsepower + displacement + cylinders + 
#     year + origin, family = binomial, data = train_set)
#
# Coefficients:
#                Estimate Std. Error z value Pr(>|z|)    
# (Intercept)  -22.145280   6.265806  -3.534 0.000409 ***
# weight        -0.004731   0.001255  -3.771 0.000163 ***
# horsepower    -0.041191   0.017796  -2.315 0.020632 *  
# displacement   0.012421   0.013883   0.895 0.370933    
# cylinders     -0.429368   0.471117  -0.911 0.362093    
# year           0.503452   0.101734   4.949 7.47e-07 ***
# origin         0.556038   0.405705   1.371 0.170515    
# ---
# Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1
#
# (Dispersion parameter for binomial family taken to be 1)
#
#     Null deviance: 377.74  on 273  degrees of freedom
# Residual deviance: 115.66  on 267  degrees of freedom
# AIC: 129.66
#
# Number of Fisher Scoring iterations: 7

# Observations:
# - The intercept is significant (p-value = 0.000409), suggesting the baseline model is relevant.
# - Significant predictors (p-value < 0.05):
#   - **Weight** (-0.004731): Strong negative relationship with mpg01 (lower weight increases the likelihood of high mpg).
#   - **Horsepower** (-0.041191): Negative relationship with mpg01 (lower horsepower increases the likelihood of high mpg).
#   - **Year** (0.503452): Positive relationship with mpg01 (newer cars are more likely to have high mpg).
# - Non-significant predictors (p-value > 0.05):
#   - **Displacement** (0.3709): Weak relationship with mpg01.
#   - **Cylinders** (0.3621): Not a strong indicator of mpg01.
#   - **Origin** (0.1705): Marginal relationship with mpg01, but not statistically significant.
# - Model fit:
#   - Null deviance: 377.74 → Residual deviance: 115.66 (large reduction indicates good fit).
#   - AIC: 129.66 (lower AIC indicates a better model).

# Commentary:
# - Significant predictors (weight, horsepower, and year) should be prioritized for prediction.
# - Non-significant predictors (displacement, cylinders, and origin) may be less useful in the current model, but they could contribute when interactions or non-linear relationships are considered.
# - The overall model shows good fit and reduced error, but further validation is necessary using the test set.

# QUESTION 2, PART E

# Use the predict.glm() function to get predicted probabilities for the test set
predicted_probabilities <- predict(glm_model, newdata = test_set, type = "response")

# Display the first few predicted probabilities
head(predicted_probabilities)
# Output:
#            7            8            9           15           17           19 
# 1.010345e-06 1.272599e-06 5.950203e-07 3.351269e-01 2.733075e-02 6.340140e-01

# Observations:
# - Each value represents the probability of the car having high mpg (mpg01 = 1).
# - For example:
#   - For the 7th observation in the test set, the probability of high mpg is approximately 0.000001 (very low).
#   - For the 19th observation, the probability is ~0.634 (moderate likelihood of high mpg).
# - Probabilities close to 0 indicate low mpg, while those closer to 1 indicate high mpg.

# QUESTION 2, PART F

# Create a vector of predicted classifications using a threshold of 0.5
predicted_classes <- ifelse(predicted_probabilities > 0.5, 1, 0)

# Display the first few predicted classifications
head(predicted_classes)
# Output:
#  7  8  9 15 17 19 
#  0  0  0  0  0  1

# Check the distribution of predicted classifications
table(predicted_classes)
# Output:
# predicted_classes
#   0   1 
#  54  64
# - 54 observations were predicted as low mpg (mpg01 = 0).
# - 64 observations were predicted as high mpg (mpg01 = 1).

# Observations:
# - The model predicts slightly more cars as high mpg (64) compared to low mpg (54).
# - This distribution depends on the threshold of 0.5. Adjusting the threshold can change the balance.

# QUESTION 2, PART G

# Compare predicted classes with actual mpg01 values in the test set
mismatch_index <- ifelse(predicted_classes != test_set$mpg01, 1, 0)

# Display the first few mismatch values
head(mismatch_index)
# Output:
#  7  8  9 15 17 19 
#  0  0  0  1  0  0
# - For the 7th, 8th, 9th, 17th, and 19th observations, the prediction matches the actual value.
# - For the 15th observation, there is a mismatch (prediction != actual value).

# Check the total number of mismatches
total_mismatches <- sum(mismatch_index)
cat("Total number of mismatches:", total_mismatches, "\n")
# Output:
# Total number of mismatches: 9

# Observations:
# - Out of 118 observations in the test set, there were 9 mismatches.
# - This indicates that the model made correct predictions for 109 observations (118 - 9 = 109).

# Calculate accuracy
accuracy <- (1 - mean(mismatch_index)) * 100
cat("Model accuracy:", round(accuracy, 2), "%\n")
# Output:
# Model accuracy: 92.37%
# - The model correctly predicted mpg01 for ~92.37% of the test observations.

# QUESTION 2, PART H

# Calculate the test error metric
test_error <- mean(mismatch_index)

# Display the test error metric
cat("Test error metric:", round(test_error, 4), "\n")
# Output:
# Test error metric: 0.0763

# Observations:
# - The test error metric is 0.0763, which means 7.63% of the predictions were incorrect on the test set.
# - This indicates that the model correctly predicted mpg01 for 92.37% (1 - 0.0763) of the test observations.
# - A low test error metric reflects good model performance.

# QUESTION 3, PART A

# Load the iris dataset
data("iris")

# Perform K-means clustering with 3 centroids on Sepal.Length and Sepal.Width
set.seed(42) # Set seed for reproducibility
kmeans_result <- kmeans(iris[, c("Sepal.Length", "Sepal.Width")], centers = 3)

# Print the clustering result
kmeans_result
# Output:
# K-means clustering with 3 clusters of sizes 50, 53, 47
#
# Cluster means:
#   Sepal.Length Sepal.Width
# 1     5.006000    3.428000
# 2     5.773585    2.692453
# 3     6.812766    3.074468
#
# Clustering vector:
# - Indicates the cluster assignment for each observation in the dataset.
#
# Within cluster sum of squares by cluster:
# [1] 13.1290 11.3000 12.6217
# (between_SS / total_SS = 71.6%)
#
# Available components:
# - "cluster": Cluster assignments for each observation.
# - "centers": Cluster centroids for Sepal.Length and Sepal.Width.
# - "totss": Total sum of squares.
# - "withinss": Within-cluster sum of squares.
# - "betweenss": Between-cluster sum of squares.
# - "size": Number of observations in each cluster.

# Observations:
# - The clusters are of sizes 50, 53, and 47.
# - Cluster centroids:
#   - Cluster 1: Sepal.Length = 5.006, Sepal.Width = 3.428
#   - Cluster 2: Sepal.Length = 5.774, Sepal.Width = 2.692
#   - Cluster 3: Sepal.Length = 6.813, Sepal.Width = 3.074
# - Clustering captures distinct groups based on Sepal.Length and Sepal.Width.
# - The proportion of variation explained by the clustering is 71.6% (between_SS / total_SS).
# - Higher between_SS / total_SS indicates better-defined clusters.

# Commentary:
# - The clustering appears effective, with distinct centroids and a high percentage of explained variation.
# - The cluster assignments can now be visualized or used for further analysis.

# QUESTION 3, PART B

# Set seed for reproducibility
set.seed(42)

# Call the kmeans() algorithm and store the results in kc
kc <- kmeans(iris[, c("Sepal.Length", "Sepal.Width")], centers = 3)

# Print the kmeans class object
kc
# Output:
# K-means clustering with 3 clusters of sizes 50, 53, 47
#
# Cluster means:
#   Sepal.Length Sepal.Width
# 1     5.006000    3.428000
# 2     5.773585    2.692453
# 3     6.812766    3.074468
#
# Clustering vector:
# - Cluster assignments for each observation in the dataset.
#
# Within cluster sum of squares by cluster:
# [1] 13.1290 11.3000 12.6217
# (between_SS / total_SS =  71.6%)
#
# Available components:
# - "cluster": Cluster assignments for each observation.
# - "centers": Cluster centroids for Sepal.Length and Sepal.Width.
# - "totss": Total sum of squares.
# - "withinss": Within-cluster sum of squares.
# - "tot.withinss": Total within-cluster sum of squares.
# - "betweenss": Between-cluster sum of squares.
# - "size": Number of observations in each cluster.

# Observations:
# - Cluster sizes: 50, 53, and 47 observations, respectively.
# - Cluster centroids:
#   - Cluster 1: Sepal.Length = 5.006, Sepal.Width = 3.428
#   - Cluster 2: Sepal.Length = 5.774, Sepal.Width = 2.692
#   - Cluster 3: Sepal.Length = 6.813, Sepal.Width = 3.074
# - The clustering explains 71.6% of the total variance (between_SS / total_SS).

# Commentary:
# - The cluster centroids provide a clear separation of the groups based on Sepal.Length and Sepal.Width.
# - The high percentage of explained variance (71.6%) indicates that the clustering is well-defined.

# QUESTION 3, PART C

# Review and print the cluster component of the kmeans object
kc_clusters <- kc$cluster

# Display the first few cluster assignments
head(kc_clusters)
# Output:
# [1] 1 1 1 1 1 1

# Print the full cluster assignments
kc_clusters
# Output:
#  [1] 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
# [40] 1 1 1 1 1 1 1 1 1 1 1 3 3 3 2 3 2 3 2 3 2 2 2 2 2 2 3 2 2 2 2 2 2 2 2 3 3 3 3
# [79] 2 2 2 2 2 2 2 2 3 2 2 2 2 2 2 2 2 2 2 2 2 2 3 2 3 3 3 3 2 3 3 3 3 3 3 2 2 3 3
# [118] 3 3 2 3 2 3 2 3 3 2 2 3 3 3 3 3 2 2 3 3 3 2 3 3 3 2 3 3 3 2 3 3 2

# Observations:
# - Each number in `kc_clusters` corresponds to the cluster assignment (1, 2, or 3) for each observation in the dataset.
# - For example:
#   - Observations 1 through 50 are assigned to Cluster 1.
#   - Observations beyond this point are distributed among Clusters 2 and 3.
# - These assignments can now be compared to the actual species labels in the iris dataset for further evaluation.

# QUESTION 3, PART D

# Review and print the centers component of the kmeans object
kc_centers <- kc$centers

# Print the cluster centroids
kc_centers
# Output:
#   Sepal.Length Sepal.Width
# 1     5.006000    3.428000
# 2     5.773585    2.692453
# 3     6.812766    3.074468

# Observations:
# - Each row represents the centroid of a cluster in the 2D space defined by Sepal.Length and Sepal.Width:
#   - **Cluster 1**: Centroid at (5.006, 3.428)
#   - **Cluster 2**: Centroid at (5.774, 2.692)
#   - **Cluster 3**: Centroid at (6.813, 3.074)
# - These centroids are the average Sepal.Length and Sepal.Width of the observations assigned to each cluster.
# - The centroids are well-separated, indicating distinct clusters.

# QUESTION 3, PART E

# Create a scatterplot of Sepal.Length vs Sepal.Width
plot(
  iris$Sepal.Length, iris$Sepal.Width,
  col = kc$cluster, # Color points by cluster assignment
  pch = 16,         # Use solid circles for points
  main = "K-Means Clustering of Iris Data",
  xlab = "Sepal Length",
  ylab = "Sepal Width"
)

# Add centroids to the plot
points(
  kc$centers[, "Sepal.Length"], kc$centers[, "Sepal.Width"],
  col = 1:3, # Match colors of centroids to clusters
  pch = 3,   # Use "+" symbol for centroids
  cex = 2    # Increase size for visibility
)

# Observations:
# - Each cluster is represented by a unique color.
# - The centroids are marked with a "+" symbol in their respective cluster colors.
