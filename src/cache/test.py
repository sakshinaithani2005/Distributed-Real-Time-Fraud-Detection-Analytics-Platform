import sys
import os

sys.path.append(
    os.path.abspath("src")
)
from cache.device_tracker import (
    is_new_device
)

from simulator.user_generator import generate_user

from cache.user_cache import (
    save_user,
    get_user
)

user = generate_user(
    1,
    forced_type="student"
)

save_user(user)

print(
    get_user(1)
)
print(
    is_new_device(
        1,
        "device_1"
    )
)

print(
    is_new_device(
        1,
        "device_1"
    )
)

print(
    is_new_device(
        1,
        "device_2"
    )
)