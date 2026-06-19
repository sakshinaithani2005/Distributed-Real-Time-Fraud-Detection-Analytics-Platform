import json
import time
from dataclasses import asdict

from kafka import KafkaProducer
import sys
import os

sys.path.append(
    os.path.abspath("src")
)
from simulator.user_generator import generate_user
from simulator.normal_transaction_generator import (
    generate_normal_transaction
)
from simulator.fraud_transaction_generator import (
    generate_fraud_transaction
)
from cache.user_cache import save_user
import random

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v:
        json.dumps(v).encode("utf-8")
)

print("Producer Started")

# Pre-generate and cache 100 users in Redis
print("Initializing and caching 100 simulated users...")
users = []
for i in range(1, 101):
    user = generate_user(i)
    save_user(user)
    users.append(user)
print("Simulated users initialized.")

def transaction_to_json(tx):
    tx_dict = asdict(tx)
    tx_dict["timestamp"] = tx.timestamp.isoformat()
    return tx_dict

while True:
    user = random.choice(users)
    
    # 5% fraud rate
    if random.random() < 0.05:
        tx = generate_fraud_transaction(user)
        is_fraud = True
    else:
        tx = generate_normal_transaction(user)
        is_fraud = False

    producer.send(
        "fraud-transactions",
        transaction_to_json(tx)
    )
    producer.flush()

    print(
        f"Sent: User {tx.user_id:<3} ({user.user_type:<15}) | "
        f"Amount: ₹{tx.amount:<8} | Category: {tx.merchant_category:<15} | "
        f"Fraud: {'🚨 YES' if is_fraud else 'NO'}"
    )

    time.sleep(random.uniform(0.5, 2.0))