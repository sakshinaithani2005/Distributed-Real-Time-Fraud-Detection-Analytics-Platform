import os 
import sys
sys.path.append(
    os.path.abspath("src")
)
from cache.redis_client import (
    redis_client
)


def is_new_device(
    user_id,
    device_id
):

    key = f"devices:{user_id}"

    known_devices = (
        redis_client.smembers(key)
    )

    if device_id in known_devices:

        return 0

    redis_client.sadd(
        key,
        device_id
    )

    return 1
