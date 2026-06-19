import sys
import os
# Add 'src' and 'src/simulator' to path to resolve both relative and absolute imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

import csv
import random

from user_generator import generate_user
from normal_transaction_generator import generate_normal_transaction
from fraud_transaction_generator import generate_fraud_transaction


NUM_USERS = 10000
FRAUD_RATE = 0.05


def transaction_to_row(tx):

    return [

        tx.transaction_id,

        tx.user_id,
        tx.user_type,

        tx.timestamp,

        tx.amount,

        tx.country,
        tx.city,

        tx.country_risk_score,

        tx.merchant_id,
        tx.merchant_category,

        tx.device_id,

        tx.risk_score,

        tx.is_fraud
    ]
def generate_dataset():

    with open(
        "transactions.csv",
        "w",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.writer(file)

        writer.writerow([

                        "transaction_id",

                        "user_id",
                        "user_type",

                        "timestamp",

                        "amount",

                        "country",
                        "city",

                        "country_risk_score",

                        "merchant_id",
                        "merchant_category",

                        "device_id",

                        "risk_score",

                        "is_fraud"
                    ])

        for user_id in range(
            1,
            NUM_USERS + 1
        ):

            user = generate_user(user_id)

            tx_count = user.transactions_per_day

            for _ in range(tx_count):

                if random.random() < FRAUD_RATE:

                    tx = generate_fraud_transaction(
                        user
                    )

                else:

                    tx = generate_normal_transaction(user)
                        
                    

                writer.writerow(
                    transaction_to_row(tx)
                )

            if user_id % 1000 == 0:

                print(
                    f"Processed {user_id} users..."
                )


import pandas as pd

if __name__ == "__main__":

    generate_dataset()

    print(
        "\nDataset Generated Successfully"
    )

    df = pd.read_csv(
        "transactions.csv"
    )

    print(
        "\nRows:",
        len(df)
    )

    print(
        "Max Amount:",
        df["amount"].max()
    )

    print(
        "Fraud %:",
        round(
            df["is_fraud"].mean() * 100,
            2
        )
    )