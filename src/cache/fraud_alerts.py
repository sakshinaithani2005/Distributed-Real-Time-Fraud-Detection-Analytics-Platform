import redis
import json

r = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)


def save_fraud_alert(alert):

    r.lpush(
        "fraud_alerts",
        json.dumps(alert)
    )


def get_fraud_alerts(limit=50):

    alerts = r.lrange(
        "fraud_alerts",
        0,
        limit - 1
    )

    return [
        json.loads(a)
        for a in alerts
    ]