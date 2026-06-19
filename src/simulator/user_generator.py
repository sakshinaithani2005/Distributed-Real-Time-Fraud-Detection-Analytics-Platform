import random
import uuid
from dataclasses import dataclass

from simulator.country_config import COUNTRIES


@dataclass
class User:
    user_id: int
    user_type: str

    home_country: str
    home_city: str
    country_risk_score: float

    avg_transaction_amount: float
    transactions_per_day: int

    devices: list[str]

    risk_profile: str
    risk_score: float


USER_DISTRIBUTION = {
    "student": 0.30,
    "employee": 0.55,
    "business_owner": 0.10,
    "high_net_worth": 0.05
}


CITIES = {
    "India": ["Delhi", "Mumbai", "Bangalore"],
    "USA": ["New York", "Chicago", "Los Angeles"],
    "UK": ["London", "Manchester"],
    "Germany": ["Berlin", "Munich"],
    "Canada": ["Toronto", "Vancouver"],
    "Brazil": ["Sao Paulo", "Rio"],
    "Mexico": ["Mexico City", "Guadalajara"],
    "Russia": ["Moscow", "Saint Petersburg"],
    "Nigeria": ["Lagos", "Abuja"],
    "South Africa": ["Cape Town", "Johannesburg"]
}


def generate_devices(count):
    return [
        str(uuid.uuid4())[:8]
        for _ in range(count)
    ]


def generate_user(
    user_id: int,
    forced_type: str = None
) -> User:

    # For testing specific user types
    if forced_type:
        user_type = forced_type

    # For normal random generation
    else:
        user_type = random.choices(
            population=list(USER_DISTRIBUTION.keys()),
            weights=list(USER_DISTRIBUTION.values()),
            k=1
        )[0]

    country = random.choice(
        list(COUNTRIES.keys())
    )

    city = random.choice(
        CITIES[country]
    )

    country_risk_score = COUNTRIES[country]

    if user_type == "student":

        avg_amount = random.randint(
            100,
            2000
        )

        tx_per_day = random.randint(
            1,
            8
        )

        device_count = random.randint(
            1,
            2
        )

    elif user_type == "employee":

        avg_amount = random.randint(
            500,
            10000
        )

        tx_per_day = random.randint(
            2,
            15
        )

        device_count = random.randint(
            1,
            3
        )

    elif user_type == "business_owner":

        avg_amount = random.randint(
            1000,
            50000
        )

        tx_per_day = random.randint(
            10,
            50
        )

        device_count = random.randint(
            2,
            5
        )

    elif user_type == "high_net_worth":

        avg_amount = random.randint(
            5000,
            100000
        )

        tx_per_day = random.randint(
            1,
            20
        )

        device_count = random.randint(
            3,
            8
        )

    else:
        raise ValueError(
            f"Unknown user type: {user_type}"
        )

    risk_score = round(
        random.uniform(0, 1),
        2
    )

    if risk_score < 0.33:
        risk_profile = "LOW"
    elif risk_score < 0.66:
        risk_profile = "MEDIUM"
    else:
        risk_profile = "HIGH"

    return User(
        user_id=user_id,
        user_type=user_type,

        home_country=country,
        home_city=city,
        country_risk_score=country_risk_score,

        avg_transaction_amount=avg_amount,
        transactions_per_day=tx_per_day,

        devices=generate_devices(device_count),

        risk_profile=risk_profile,
        risk_score=risk_score
    )

def get_preferred_categories(user_type):

    preferences = {
        "student": [
            "Food",
            "Entertainment",
            "Education",
            "Shopping"
        ],

        "employee": [
            "Food",
            "Fuel",
            "Utilities",
            "Shopping",
            "Travel"
        ],

        "business_owner": [
            "Business",
            "Travel",
            "Fuel"
        ],

        "high_net_worth": [
            "Travel",
            "Electronics",
            "Shopping",
            "Healthcare"
        ]
    }

    return preferences[user_type]


if __name__ == "__main__":

    student = generate_user(
        1,
        forced_type="student"
    )

    employee = generate_user(
        2,
        forced_type="employee"
    )

    business = generate_user(
        3,
        forced_type="business_owner"
    )

    hnw = generate_user(
        4,
        forced_type="high_net_worth"
    )

    print("\n===== STUDENT =====")
    print(student)

    print("\n===== EMPLOYEE =====")
    print(employee)

    print("\n===== BUSINESS OWNER =====")
    print(business)

    print("\n===== HIGH NET WORTH =====")
    print(hnw)