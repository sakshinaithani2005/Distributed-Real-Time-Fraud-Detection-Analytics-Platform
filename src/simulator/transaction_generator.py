import random
import uuid
from dataclasses import dataclass
from datetime import datetime

from simulator.user_generator import User


MERCHANT_CATEGORIES = {
    "Food": [
        "Swiggy",
        "Zomato",
        "Dominos"
    ],
    "Travel": [
        "Uber",
        "Ola",
        "MakeMyTrip"
    ],
    "Fuel": [
        "IndianOil",
        "BPCL",
        "HPCL"
    ],
    "Shopping": [
        "Amazon",
        "Flipkart",
        "Myntra"
    ],
    "Healthcare": [
        "Apollo",
        "PharmEasy",
        "1mg"
    ],
    "Entertainment": [
        "Netflix",
        "Spotify",
        "BookMyShow"
    ],
    "Business": [
        "SupplierA",
        "VendorB",
        "WholesaleC"
    ],
    "Education": [
        "Udemy",
        "Coursera",
        "Unacademy"
    ],
    "Utilities": [
        "ElectricityBoard",
        "WaterBoard",
        "InternetProvider"
    ],
    "Electronics": [
        "Croma",
        "RelianceDigital",
        "VijaySales"
    ]
}


@dataclass
class Transaction:

    transaction_id: str

    user_id: int
    user_type: str

    timestamp: datetime

    amount: float

    country: str
    city: str

    country_risk_score: float

    merchant_id: str
    merchant_category: str

    device_id: str

    risk_score: float

    is_fraud: int

def generate_transaction(user: User) -> Transaction:

    category = random.choice(
        list(MERCHANT_CATEGORIES.keys())
    )

    merchant = random.choice(
        MERCHANT_CATEGORIES[category]
    )

    amount = random.gauss(
        mu=user.avg_transaction_amount,
        sigma=user.avg_transaction_amount * 0.30
    )

    amount = max(10, round(amount, 2))

    transaction = Transaction(
        transaction_id=str(uuid.uuid4()),
        user_id=user.user_id,
        user_type=user.user_type,
        timestamp=datetime.now(),
        amount=amount,
        country=user.home_country,
        city=user.home_city,
        country_risk_score=user.country_risk_score,
        merchant_id=merchant,
        merchant_category=category,
        device_id=random.choice(user.devices),
        risk_score=user.risk_score,
        is_fraud=0
    )

    return transaction

if __name__ == "__main__":

    from user_generator import generate_user

    user = generate_user(2)

    for _ in range(10):
        tx = generate_transaction(user)
        print(tx)