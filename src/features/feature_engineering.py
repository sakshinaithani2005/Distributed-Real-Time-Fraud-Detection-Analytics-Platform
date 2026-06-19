import pandas as pd

df = pd.read_csv("transactions.csv")
import numpy as np

df["amount_log"] = np.log1p(
    df["amount"]
)

df["is_high_risk_country"] = (
    df["country_risk_score"] > 0.5
).astype(int)

hours = pd.to_datetime(
    df["timestamp"]
).dt.hour

df["is_night_transaction"] = (
    (hours >= 0) &
    (hours <= 5)
).astype(int)

df.to_csv(
    "transactions_features.csv",
    index=False
)