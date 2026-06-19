import pandas as pd
import json
import redis
import sys
import os

# Ensure src is in python path
sys.path.append(os.path.abspath("src"))

def initialize_redis():
    print("Connecting to Redis...")
    r = redis.Redis(
        host="localhost",
        port=6379,
        decode_responses=True
    )
    
    csv_path = "transactions.csv"
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found. Please run dataset generator first.")
        return

    print(f"Loading {csv_path}...")
    df = pd.read_csv(csv_path)

    print("Computing user profiles and devices...")
    # Group transactions by user_id
    grouped = df.groupby("user_id")

    # Clear existing user/device data to avoid stale cache
    print("Clearing existing user and device keys from Redis...")
    keys_to_del = r.keys("user:*") + r.keys("devices:*")
    if keys_to_del:
        r.delete(*keys_to_del)

    count = 0
    for user_id, group in grouped:
        user_type = group["user_type"].iloc[0]
        avg_amount = float(group["amount"].mean())
        # Find home country (mode)
        home_country = group["country"].mode().iloc[0]
        risk_score = float(group["risk_score"].iloc[0])

        # Get devices used in non-fraudulent transactions
        normal_txs = group[group["is_fraud"] == 0]
        if len(normal_txs) > 0:
            devices = list(normal_txs["device_id"].unique())
        else:
            # Fallback if no normal transactions exist
            devices = list(group["device_id"].unique())
            # Exclude transient "new_device_" strings if possible
            devices = [d for d in devices if not d.startswith("new_device_")]

        # Save user profile
        user_key = f"user:{user_id}"
        user_data = {
            "user_type": user_type,
            "avg_amount": round(avg_amount, 2),
            "home_country": home_country,
            "risk_score": round(risk_score, 2)
        }
        r.set(user_key, json.dumps(user_data))

        # Save registered devices in Redis Set
        device_key = f"devices:{user_id}"
        if devices:
            r.sadd(device_key, *devices)

        count += 1
        if count % 1000 == 0:
            print(f"Cached {count} user profiles...")

    print(f"\nSuccessfully populated Redis with {count} user profiles and device sets.")

if __name__ == "__main__":
    initialize_redis()
