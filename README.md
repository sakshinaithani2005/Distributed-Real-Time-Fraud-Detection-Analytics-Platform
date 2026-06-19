# Distributed Real-Time Fraud Detection & Analytics Platform

This platform is a production-grade, end-to-end fintech solution designed to detect fraudulent credit card transactions in real-time. It streams generated transactions, enriches them with user profiles, performs machine learning inference using a trained XGBoost model, and visualizes live alerts in a sleek, Datadog-inspired Security Operations Center (SOC) dashboard.

---

## System Architecture

The platform follows a modern, decoupled lambda/kappa-style streaming architecture:

```
+--------------------------+
|  Transaction Generator   |  <--- Python simulator generating normal & fraud txn scenarios
+--------------------------+
             |
             v  (Publishes events)
+--------------------------+
|       Apache Kafka       |  <--- Topic: "fraud-transactions" event queue
+--------------------------+
             |
             v  (Polls & Consumes events in real-time)
+--------------------------+
|   Fraud Detector Loop    |  <--- Python consumer
+--------------------------+
      /              \
     / (Fetches 2ms   \ (Runs 11-feature inference)
    v  User Profile)   v
+-----------+    +---------------+
|   Redis   |    |    XGBoost    |  <--- Trained Booster model (v2)
|  Cache    |    |  Classifier   |
+-----------+    +---------------+
     \               /
      \             / (Saves alert if Fraud Probability > 80%)
       v           v
+--------------------------+
|  Redis Alerts Key Store  |
+--------------------------+
             |
             v  (Queries telemetry & stats)
+--------------------------+
|    FastAPI Web Server    |
+--------------------------+
             |
             v  (Consumes stats and live alerts)
+--------------------------+
|   React SOC Dashboard    |  <--- React + Vite + Tailwind CSS console
+--------------------------+
```

### Flow Details:
1. **Simulation Ingestion:** The python generator streams transactions to a Kafka cluster representing standard card holder telemetry mixed with 5% anomalous fraud patterns (spikes, night transactions, geolocational shifts).
2. **Feature Enrichment:** The streaming consumer catches the transaction, fetches the holder's historical aggregates (average amount, geolocational signatures, trusted device sets) from **Redis** in under **2ms**, and checks for anomalies.
3. **Inference Pipeline:** An 11-feature behavioral array (including `amount_vs_avg`, `new_device_flag`, `country_changed`) is passed to an **XGBoost Classifier**.
4. **Immediate Alerting:** If the probability of fraud surpasses **80%**, a threat alert is written to Redis and streamed to the browser via **FastAPI** web sockets or polling endpoints.

---

## Repository Folder Structure

```
.
├── dashboard/                 # React + Vite + Tailwind CSS Frontend SPA
│   ├── src/
│   │   ├── components/        # Sidebar navigation & Stats metric cards
│   │   ├── pages/             # Dashboard, Alerts, Predict Form, Telemetry, and Architecture
│   │   ├── services/          # api.js (Axios client to FastAPI)
│   │   ├── App.jsx            # Main SPA router and TanStack query client
│   │   └── main.jsx           # Entry point
│   ├── vite.config.js         # Vite configuration with Tailwind CSS v4 compiler
│   └── package.json           # Node packages configurations
├── docker/                    # Infrastructure orchestrator
│   └── docker-compose.yml     # Launches Kafka, Zookeeper, and Redis images
├── kafka/                     # Kafka consumer & producer client code
│   ├── producer.py            # Simulated transaction stream generator
│   └── fraud_detector.py      # Real-time transaction consumer & model evaluation
├── src/                       # Backend Source Code (Python)
│   ├── api/                   # FastAPI Web server hosting prediction & stats endpoints
│   ├── cache/                 # Redis key-value helpers and alert recorders
│   ├── features/              # Feature engineering service comparing telemetry
│   ├── simulator/             # User demographics and transaction templates
│   └── training/              # ML training scripts and MLflow integration files
├── .gitignore                 # Root git ignores for envs, CSVs, and model binaries
├── fraud_model_v2.pkl         # Trained serialized XGBoost Classifier model binary
├── requirements.txt           # Python backend dependencies list
└── README.md                  # System instruction handbook
```

---

## Step-by-Step Running Instructions

Follow these steps in order to start and run the entire real-time fraud detection pipeline:

### Step 1: Start Redis and Kafka Services
If you have Docker installed, run the services using the provided Docker Compose configuration:
```bash
docker compose -f docker/docker-compose.yml up -d
```
*(Ensure your local Redis server and Kafka broker are running on ports `6379` and `9092` respectively.)*

### Step 2: Initialize Virtual Environment & Install Dependencies
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install required packages
pip install -r requirements.txt
```

### Step 3: Populate the Redis Cache
Pre-load the Redis cache with the metadata profiles of simulated users (e.g. average transaction values, geolocational contexts, trusted device sets) from the transaction history:
```bash
venv/bin/python src/cache/initialize_cache.py
```

### Step 4: Run the Fraud Detection API
Start the FastAPI server which exposes prediction endpoints and feeds the dashboard metrics:
```bash
venv/bin/uvicorn src.api.app:app --host 0.0.0.0 --port 8000 --reload
```
You can view the interactive Swagger API documentation at: [http://localhost:8000/docs](http://localhost:8000/docs)

### Step 5: Start the Real-Time Kafka Consumer (Fraud Detector)
Open a new terminal window, activate the virtual environment, and run the real-time detector. It consumes streamed transactions, queries Redis, structures behavioral features, runs model inference, and writes high-risk alerts to Redis:
```bash
venv/bin/python kafka/fraud_detector.py
```

### Step 6: Start the Real-Time Kafka Producer (Transaction Simulator)
Open another terminal window, activate the virtual environment, and start streaming simulated credit card transactions:
```bash
venv/bin/python kafka/producer.py
```

### Step 7: Start the React Frontend Dashboard
Open a new terminal window, navigate to the `dashboard` directory, **configure the Node.js PATH (mandatory to avoid Windows Node.js paths inside WSL)**, and start the Vite development server:
```bash
cd dashboard

# IMPORTANT: You MUST run this PATH export in your new terminal window!
# If you don't, WSL will default to Windows Node.js (CMD.EXE / 'vite' not recognized error).
export PATH=/home/sakshi/node-v22.12.0-linux-x64/bin:$PATH

# Run the local Vite development server
npm run dev
```
The modern SOC monitoring console will now be live at: [http://localhost:5173](http://localhost:5173)

---

## Testing the API Prediction Endpoint Manually

You can manually trigger a real-time prediction using `curl` against the FastAPI endpoint:

```bash
curl -X POST http://localhost:8000/predict \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": 1,
       "amount": 2500.00,
       "country": "Russia",
       "country_risk_score": 0.8,
       "merchant_category": "Electronics",
       "device_id": "new_device_xyz123"
     }'
```

This request queries Redis for User 1's profile, determines if this is a new device or a country change, structures the 11 behavioral features, runs model inference, and returns the predicted fraud probability.

---

## Applications of this System

* **Fintech & Banking SOCs:** Serves as a real-time monitoring console for credit card fraud operations, highlighting sudden anomalies for card-not-present (CNP) fraud.
* **Merchant Acquiring Risk Gateways:** Evaluates incoming payment API payloads against cardholder patterns before routing them to card networks.
* **Account Takeover (ATO) Safeguard:** Blocks account logins and transactions coming from unknown device footprints or impossible geolocational shifts.

---

## Future Work & Scaling

* **Stream Processing Engines:** Migrate the consumer loop to **Apache Flink** or **Apache Spark Streaming** for sliding window counts and advanced session aggregations.
* **Model Registry & Auto-retraining:** Integrate **MLflow Model Registry** to automate shadow-model deployments when model drift is detected.
* **Kafka Schema Registry:** Adopt **Apache Avro** serialization with Schema Registry to ensure strong interface contracts between producers and consumers.
* **Incident Management Integration:** Connect the alerts database to webhook triggers for **PagerDuty**, **Slack**, or **Jira** to automate ticketing when critical alerts are generated.
