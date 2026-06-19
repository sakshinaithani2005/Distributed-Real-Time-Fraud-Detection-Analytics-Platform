import json

from cache.redis_client import (
    redis_client
)


def save_user(user):

    redis_client.set(

        f"user:{user.user_id}",

        json.dumps(
            {
                "user_type":
                user.user_type,

                "avg_amount":
                user.avg_transaction_amount,

                "home_country":
                user.home_country,

                "risk_score":
                user.risk_score
            }
        )
    )

    if user.devices:
        redis_client.sadd(
            f"devices:{user.user_id}",
            *user.devices
        )


def get_user(user_id):

    data = redis_client.get(
        f"user:{user_id}"
    )

    if data:

        return json.loads(
            data
        )

    return None
def get_avg_amount(
    user_id
):

    user = get_user(
        user_id
    )

    return user[
        "avg_amount"
    ]


def get_home_country(
    user_id
):

    user = get_user(
        user_id
    )

    return user[
        "home_country"
    ]
def get_user_profile(user_id):

    return get_user(user_id)