import pandas as pd

print("Loading dataset...")

df = pd.read_csv(
    "transactions_features.csv"
)

print(
    f"Rows Loaded: {len(df)}"
)

# ==========================
# Amount vs Avg
# ==========================

print(
    "Creating amount_vs_avg..."
)

user_avg = (
    df.groupby("user_id")["amount"]
    .mean()
)

df["user_avg_amount"] = (
    df["user_id"]
    .map(user_avg)
)

df["amount_vs_avg"] = (
    df["amount"] /
    df["user_avg_amount"]
)

# ==========================
# New Device Flag
# ==========================

print(
    "Creating new_device_flag..."
)

df["timestamp"] = pd.to_datetime(
    df["timestamp"]
)

df = df.sort_values(
    ["user_id", "timestamp"]
)

seen_devices = {}

new_device_flags = []

for _, row in df.iterrows():

    user_id = row["user_id"]

    device = row["device_id"]

    if user_id not in seen_devices:

        seen_devices[user_id] = set()

    if device in seen_devices[user_id]:

        new_device_flags.append(0)

    else:

        new_device_flags.append(1)

        seen_devices[user_id].add(
            device
        )

df["new_device_flag"] = (
    new_device_flags
)

# ==========================
# Country Changed
# ==========================

print(
    "Creating country_changed..."
)

home_country = (

    df.groupby("user_id")["country"]

    .agg(
        lambda x:
        x.mode()[0]
    )
)

df["home_country"] = (

    df["user_id"]

    .map(home_country)
)

df["country_changed"] = (

    df["country"]

    !=

    df["home_country"]

).astype(int)

# ==========================
# Cleanup
# ==========================

df.drop(
    columns=[
        "user_avg_amount",
        "home_country"
    ],
    inplace=True
)

# ==========================
# Save
# ==========================

df.to_csv(

    "transactions_features_v2.csv",

    index=False
)

print(
    "\nV2 Dataset Created Successfully"
)

print(
    f"Rows: {len(df)}"
)

print(
    "\nNew Columns Added:"
)

print(
    [
        "amount_vs_avg",
        "new_device_flag",
        "country_changed"
    ]
)