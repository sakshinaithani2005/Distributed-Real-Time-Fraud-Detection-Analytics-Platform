import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from xgboost import XGBClassifier

import joblib


df = pd.read_csv(
    "transactions_features_v2.csv"
)

# Encode merchant category

df["merchant_category"] = (
    df["merchant_category"]
    .astype("category")
    .cat.codes
)

df["user_type"] = (
    df["user_type"]
    .astype("category")
    .cat.codes
)

features = [

    "amount",

    "amount_log",

    "country_risk_score",

    "risk_score",

    "merchant_category",

    "user_type",

    "is_high_risk_country",

    "is_night_transaction",

    "amount_vs_avg",

    "new_device_flag",

    "country_changed"
]

X = df[features]

y = df["is_fraud"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    random_state=42
)

model.fit(
    X_train,
    y_train
)

preds = model.predict(
    X_test
)

print(
    classification_report(
        y_test,
        preds
    )
)

joblib.dump(
    model,
    "fraud_model_v2.pkl"
)
print(
    "\nModel Saved Successfully"
)