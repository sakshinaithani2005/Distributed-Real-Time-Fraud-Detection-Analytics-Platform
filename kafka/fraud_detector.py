import json
import joblib
import pandas as pd
import numpy as np
from kafka import KafkaConsumer
import sys
import os

sys.path.append(
    os.path.abspath("src")
)
from cache.fraud_alerts import (
    save_fraud_alert
)

from features.behavior_service import (
    build_behavior_features
)

# Load trained model
model = joblib.load(
    "fraud_model_v2.pkl"
)

consumer = KafkaConsumer(

    "fraud-transactions",

    bootstrap_servers="localhost:9092",

    value_deserializer=lambda m:
        json.loads(
            m.decode("utf-8")
        )
)

print("Fraud Detector Started...\n")



def prepare_features(tx):

    amount = tx["amount"]

    amount_log = np.log1p(
        amount
    )
    
    is_high_risk_country = int(
        tx["country_risk_score"] > 0.5
    )

    hour = pd.to_datetime(
        tx["timestamp"]
    ).hour

    is_night_transaction = int(
        0 <= hour <= 5
    )

    merchant_mapping = {

        "Business": 0,
        "Education": 1,
        "Electronics": 2,
        "Entertainment": 3,
        "Food": 4,
        "Fuel": 5,
        "Healthcare": 6,
        "Shopping": 7,
        "Travel": 8,
        "Utilities": 9
    }

    user_mapping = {

        "business_owner": 0,
        "employee": 1,
        "high_net_worth": 2,
        "student": 3
    }

    behavior = build_behavior_features(
        tx
    )

    return [[

        amount,

        amount_log,

        tx["country_risk_score"],

        tx["risk_score"],

        merchant_mapping.get(
            tx["merchant_category"],
            0
        ),

        user_mapping.get(
            tx["user_type"],
            0
        ),

        is_high_risk_country,

        is_night_transaction,

        behavior["amount_vs_avg"],

        behavior["new_device_flag"],

        behavior["country_changed"]
    ]]



for message in consumer:

    tx = message.value

    behavior = build_behavior_features(
    tx
    )

    features = prepare_features(
        tx
    )

    fraud_prob = model.predict_proba(
        features
    )[0][1]

    print("\nTransaction Received")
    print(
        f"Amount: ₹{tx['amount']}"
    )

    print(
        f"Merchant: {tx['merchant_category']}"
    )

    print(
        f"Fraud Probability: {fraud_prob:.4f}"
    )
    print(
    f"Amount vs Avg: {behavior['amount_vs_avg']}"
    )

    print(
        f"New Device: {behavior['new_device_flag']}"
    )

    print(
        f"Country Changed: {behavior['country_changed']}"
    )

    if fraud_prob > 0.80:

        print(
            "🚨 FRAUD ALERT 🚨"
        )

        alert = {

            "user_id":
            tx["user_id"],

            "amount":
            tx["amount"],

            "merchant":
            tx["merchant_category"],

            "fraud_probability":
            round(
                float(fraud_prob),
                4
            )
        }

        save_fraud_alert(
            alert
        )