from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(

    "fraud-transactions",

    bootstrap_servers="localhost:9092",

    value_deserializer=lambda m:
        json.loads(
            m.decode("utf-8")
        )
)

print("Listening...\n")

for message in consumer:

    tx = message.value

    print(tx)