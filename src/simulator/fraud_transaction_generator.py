import random
import uuid

from datetime import datetime

from simulator.normal_transaction_generator import (
    Transaction,
    MERCHANT_CATEGORIES
)


HIGH_RISK_COUNTRIES = [
    "Russia",
    "Nigeria",
    "Brazil",
    "Mexico"
]


FRAUD_SCENARIOS = [
    "amount_spike",
    "new_device",
    "country_change",
    "night_transaction",
    "combined"
]


def generate_fraud_transaction(user):

    scenario = random.choice(
        FRAUD_SCENARIOS
    )

    amount = user.avg_transaction_amount

    country = user.home_country
    city = user.home_city

    device = random.choice(
        user.devices
    )

    hour = random.randint(8, 22)

    category = random.choice(
        list(MERCHANT_CATEGORIES.keys())
    )

    merchant = random.choice(
        MERCHANT_CATEGORIES[category]
    )

    # -----------------------
    # Amount Spike
    # -----------------------

    if scenario == "amount_spike":

        amount = round(
            user.avg_transaction_amount *
            random.uniform(3, 15),
            2
        )
        amount = min(
                    amount,
                    500000
                        )

    # -----------------------
    # New Device
    # -----------------------

    elif scenario == "new_device":

        device = (
            "new_device_" +
            str(uuid.uuid4())[:8]
        )

    # -----------------------
    # Country Change
    # -----------------------

    elif scenario == "country_change":

        country = random.choice(
            HIGH_RISK_COUNTRIES
        )

    # -----------------------
    # Night Transaction
    # -----------------------

    elif scenario == "night_transaction":

        hour = random.randint(1, 4)

    # -----------------------
    # Combined Fraud
    # -----------------------

    elif scenario == "combined":

        amount = round(
            user.avg_transaction_amount *
            random.uniform(5, 20),
            2
        )
        amount = min(
                amount,
                500000
                        )

        device = (
            "new_device_" +
            str(uuid.uuid4())[:8]
        )

        country = random.choice(
            HIGH_RISK_COUNTRIES
        )

        hour = random.randint(1, 4)

    timestamp = datetime.now().replace(
        hour=hour,
        minute=random.randint(0, 59),
        second=random.randint(0, 59),
        microsecond=0
    )

    return Transaction(

    transaction_id=str(uuid.uuid4()),

    user_id=user.user_id,
    user_type=user.user_type,

    timestamp=timestamp,

    amount=amount,

    country=country,
    city=city,

    country_risk_score=user.country_risk_score,

    merchant_id=merchant,
    merchant_category=category,

    device_id=device,

    risk_score=user.risk_score,

    is_fraud=1
)

if __name__ == "__main__":

    from user_generator import generate_user

    student = generate_user(
        1,
        forced_type="student"
    )

    print(student)

    print("\nFRAUD TRANSACTIONS\n")

    for _ in range(10):

        tx = generate_fraud_transaction(
            student
        )

        print(tx)