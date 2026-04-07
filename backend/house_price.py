# ── House Price Prediction ──────────────────────────────────────────
# Dataset  : California Housing (built into sklearn — no download needed)
# Model    : Linear Regression
# Metrics  : MAE, RMSE, R²
# ────────────────────────────────────────────────────────────────────

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# ── 1. Load Data ──────────────────────────────────────────────────────
data = fetch_california_housing()
df = pd.DataFrame(data.data, columns=data.feature_names)
df['Price'] = data.target  # price in $100,000s

print("Dataset shape:", df.shape)
print("\nFirst 5 rows:")
print(df.head())
print("\nBasic stats:")
print(df.describe())

# ── 2. Prepare Features ───────────────────────────────────────────────
X = df.drop('Price', axis=1)
y = df['Price']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scale features (important for linear regression)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)

# ── 3. Train Model ────────────────────────────────────────────────────
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# ── 4. Evaluate ───────────────────────────────────────────────────────
y_pred = model.predict(X_test_scaled)

mae  = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2   = r2_score(y_test, y_pred)

print("\n── Model Results ──────────────────")
print(f"MAE  : ${mae*100_000:,.0f}")
print(f"RMSE : ${rmse*100_000:,.0f}")
print(f"R²   : {r2:.4f}  (1.0 = perfect)")

# ── 5. Visualizations ────────────────────────────────────────────────

# Plot 1: Actual vs Predicted
plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred, alpha=0.3, color='steelblue', edgecolors='none')
plt.plot([y_test.min(), y_test.max()],
         [y_test.min(), y_test.max()], 'r--', lw=2, label='Perfect prediction')
plt.xlabel('Actual Price ($100k)')
plt.ylabel('Predicted Price ($100k)')
plt.title('Actual vs Predicted House Prices')
plt.legend()
plt.tight_layout()
plt.savefig('actual_vs_predicted.png', dpi=150)
plt.show()
print("Saved: actual_vs_predicted.png")

# Plot 2: Feature Importance
coef_df = pd.DataFrame({
    'Feature': data.feature_names,
    'Coefficient': model.coef_
}).sort_values('Coefficient', ascending=True)

plt.figure(figsize=(8, 5))
colors = ['coral' if c < 0 else 'steelblue' for c in coef_df['Coefficient']]
plt.barh(coef_df['Feature'], coef_df['Coefficient'], color=colors)
plt.xlabel('Coefficient Value')
plt.title('Feature Impact on House Price')
plt.tight_layout()
plt.savefig('feature_importance.png', dpi=150)
plt.show()
print("Saved: feature_importance.png")

# Plot 3: Residuals
residuals = y_test - y_pred
plt.figure(figsize=(8, 4))
plt.hist(residuals, bins=50, color='steelblue', edgecolor='white')
plt.axvline(0, color='red', linestyle='--')
plt.xlabel('Prediction Error ($100k)')
plt.ylabel('Count')
plt.title('Distribution of Prediction Errors')
plt.tight_layout()
plt.savefig('residuals.png', dpi=150)
plt.show()
print("Saved: residuals.png")

print("\n✓ Done! 3 chart images saved for your GitHub README.")
print("\n── Predict Your Own House ──────────────")
print("Enter house details below:\n")

med_inc     = float(input("Median Income in area (e.g. 5.0): "))
house_age   = float(input("House Age in years (e.g. 20): "))
ave_rooms   = float(input("Average Rooms (e.g. 6): "))
ave_bedrms  = float(input("Average Bedrooms (e.g. 1): "))
population  = float(input("Area Population (e.g. 500): "))
ave_occup   = float(input("Average Occupants (e.g. 3): "))
latitude    = float(input("Latitude (e.g. 37.88): "))
longitude   = float(input("Longitude (e.g. -122.23): "))

user_input = np.array([[med_inc, house_age, ave_rooms, ave_bedrms,
                         population, ave_occup, latitude, longitude]])

user_scaled = scaler.transform(user_input)
predicted_price = model.predict(user_scaled)[0]

print(f"\nEstimated House Price: ${predicted_price * 100_000:,.0f}")