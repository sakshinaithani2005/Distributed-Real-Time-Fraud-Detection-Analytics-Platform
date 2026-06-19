import sys
import os

sys.path.append(
    os.path.abspath("src")
)

from cache.user_cache import (
    get_user_profile
)

from cache.device_tracker import (
    is_new_device
)

from features.realtime_features import (
    amount_vs_avg,
    country_changed
)


def build_behavior_features(tx):

    profile = get_user_profile(
        tx["user_id"]
    )
    print(
    "PROFILE:",
    profile
)
    if not profile:

        return {
            "new_device_flag": 0,
            "amount_vs_avg": 1,
            "country_changed": 0
        }

    return {

        "new_device_flag":
        is_new_device(
            tx["user_id"],
            tx["device_id"]
        ),

        "amount_vs_avg":
        amount_vs_avg(
            tx["amount"],
            profile["avg_amount"]
        ),

        "country_changed":
        country_changed(
            tx["country"],
            profile["home_country"]
        )
    }
