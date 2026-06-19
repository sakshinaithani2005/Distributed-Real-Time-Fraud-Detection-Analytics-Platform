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

    "Entertainment": [
        "Netflix",
        "Spotify",
        "BookMyShow"
    ],

    "Education": [
        "Udemy",
        "Coursera",
        "Unacademy"
    ],

    "Shopping": [
        "Amazon",
        "Flipkart",
        "Myntra"
    ],

    "Fuel": [
        "IndianOil",
        "HPCL",
        "BPCL"
    ],

    "Utilities": [
        "ElectricityBoard",
        "WaterBoard",
        "InternetProvider"
    ],

    "Travel": [
        "Uber",
        "Ola",
        "MakeMyTrip"
    ],

    "Business": [
        "SupplierA",
        "VendorB",
        "WholesaleC"
    ],

    "Healthcare": [
        "Apollo",
        "1mg",
        "PharmEasy"
    ],

    "Electronics": [
        "Croma",
        "RelianceDigital",
        "VijaySales"
    ]
}


CATEGORY_WEIGHTS = {

    "student": {
        "Food": 0.45,
        "Entertainment": 0.25,
        "Shopping": 0.20,
        "Education": 0.10
    },

    "employee": {
        "Food": 0.30,
        "Fuel": 0.25,
        "Utilities": 0.20,
        "Shopping": 0.15,
        "Travel": 0.10
    },

    "business_owner": {
        "Business": 0.50,
        "Travel": 0.20,
        "Fuel": 0.20,
        "Shopping": 0.10
    },

    "high_net_worth": {
        "Travel": 0.30,
        "Electronics": 0.25,
        "Shopping": 0.25,
        "Healthcare": 0.20
    }
}


CATEGORY_AMOUNT_RANGES = {

    "student": {
        "Food": (0.05, 0.20),
        "Entertainment": (0.10, 0.20),
        "Education": (0.15, 0.30),
        "Shopping": (0.20, 0.80)
    },

    "employee": {
        "Food": (0.10, 0.30),
        "Fuel": (0.10, 0.40),
        "Utilities": (0.20, 0.50),
        "Shopping": (0.30, 1.20),
        "Travel": (0.30, 1.00)
    },

    "business_owner": {
        "Business": (0.50, 2.50),
        "Travel": (0.20, 1.00),
        "Fuel": (0.10, 0.40),
        "Shopping": (0.30, 1.00)
    },

    "high_net_worth": {
        "Travel": (0.50, 2.00),
        "Electronics": (1.00, 5.00),
        "Shopping": (0.50, 3.00),
        "Healthcare": (0.50, 2.00)
    }
}


TIME_WINDOWS = {

    "student": [
        (8, 10),
        (12, 14),
        (18, 20),
        (20, 23)
    ],

    "employee": [
        (7, 9),
        (12, 14),
        (18, 20),
        (20, 22)
    ],

    "business_owner": [
        (8, 11),
        (12, 15),
        (15, 18)
    ],

    "high_net_worth": [
        (0, 23)
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

def generate_timestamp(user_type):

    window = random.choice(
        TIME_WINDOWS[user_type]
    )

    hour = random.randint(
        window[0],
        window[1]
    )

    minute = random.randint(0, 59)

    second = random.randint(0, 59)

    now = datetime.now()

    return now.replace(
        hour=hour,
        minute=minute,
        second=second,
        microsecond=0
    )


def select_category(user_type):

    categories = list(
        CATEGORY_WEIGHTS[user_type].keys()
    )

    weights = list(
        CATEGORY_WEIGHTS[user_type].values()
    )

    return random.choices(
        categories,
        weights=weights,
        k=1
    )[0]


def generate_amount(user, category):

    low, high = CATEGORY_AMOUNT_RANGES[
        user.user_type
    ][category]

    multiplier = random.uniform(
        low,
        high
    )

    amount = (
        user.avg_transaction_amount
        * multiplier
    )

    amount = min(
        amount,
        user.avg_transaction_amount * 3
    )

    amount = max(
        amount,
        10
    )

    return round(
        amount,
        2
    )

def generate_normal_transaction(
    user: User
):

    category = select_category(
        user.user_type
    )

    merchant = random.choice(
        MERCHANT_CATEGORIES[category]
    )

    amount = generate_amount(
        user,
        category
    )

    timestamp = generate_timestamp(
        user.user_type
    )

    return Transaction(

        transaction_id=str(uuid.uuid4()),

        user_id=user.user_id,
        user_type=user.user_type,

        timestamp=timestamp,

        amount=amount,

        country=user.home_country,
        city=user.home_city,

        country_risk_score=user.country_risk_score,

        merchant_id=merchant,
        merchant_category=category,

        device_id=random.choice(
            user.devices
        ),

        risk_score=user.risk_score,

        is_fraud=0
    )
if __name__ == "__main__":

    from user_generator import generate_user

    student = generate_user(
        1,
        forced_type="student"
    )

    print(student)

    print()

    for _ in range(20):

        tx = generate_normal_transaction(
            student
        )

        print(
            tx.timestamp.time(),
            tx.merchant_category,
            tx.amount
        )