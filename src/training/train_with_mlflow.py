import pandas as pd
import mlflow
import mlflow.sklearn
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score
)

from xgboost import XGBClassifier


# -----------------------
# Load Data
# -----------------------

df = pd.read_csv(
    "transactions_features.csv"
)

# Encode Categories

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

    "is_night_transaction"
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

# -----------------------
# MLflow Experiment
# -----------------------

mlflow.set_experiment(
    "Fraud_Detection_XGBoost"
)

with mlflow.start_run():

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

    precision = precision_score(
        y_test,
        preds
    )

    recall = recall_score(
        y_test,
        preds
    )

    f1 = f1_score(
        y_test,
        preds
    )

    mlflow.log_param(
        "n_estimators",
        200
    )

    mlflow.log_param(
        "max_depth",
        6
    )

    mlflow.log_param(
        "learning_rate",
        0.1
    )

    mlflow.log_metric(
        "precision",
        precision
    )

    mlflow.log_metric(
        "recall",
        recall
    )

    mlflow.log_metric(
        "f1_score",
        f1
    )

    mlflow.sklearn.log_model(
        model,
        "xgboost_model"
    )

    joblib.dump(
        model,
        "fraud_model.pkl"
    )

    print("\nPrecision:", precision)
    print("Recall:", recall)
    print("F1:", f1)

print("\nMLflow Run Saved")