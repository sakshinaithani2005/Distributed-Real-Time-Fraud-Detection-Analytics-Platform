import sys
import os
import joblib
import numpy as np
from datetime import datetime
from fastapi.responses import HTMLResponse

from fastapi.templating import Jinja2Templates

from fastapi.staticfiles import StaticFiles

from fastapi import Request
sys.path.append(
    os.path.abspath("src")
)

from fastapi import FastAPI
from pydantic import BaseModel

from cache.user_cache import get_user

from cache.fraud_alerts import (
    get_fraud_alerts,
    save_fraud_alert
)

from features.behavior_service import (
    build_behavior_features
)
# ==========================
# FastAPI App
# ==========================

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Fraud Detection API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/static",
    StaticFiles(
        directory="src/frontend/static"
    ),
    name="static"
)

templates = Jinja2Templates(
    directory="src/frontend/templates"
)
# ==========================
# Load Model
# ==========================

model = joblib.load(
    "fraud_model_v2.pkl"
)

print(
    "Model Loaded Successfully"
)

# ==========================
# Encodings Used In Training
# ==========================

merchant_mapping = {
    "Business": 0,
    "Education": 1,
    "Electronics": 2,
    "Entertainment": 3,
    "Food": 4,
    "Fuel": 5,
    "Healthcare": 6,
    "Shopping": 7,
    "Travel": 8,
    "Utilities": 9
}

user_type_mapping = {
    "business_owner": 0,
    "employee": 1,
    "high_net_worth": 2,
    "student": 3
}


# ==========================
# Request Model
# ==========================

class PredictionRequest(BaseModel):

    user_id: int

    amount: float

    country: str

    country_risk_score: float

    merchant_category: str

    device_id: str


# ==========================
# Routes
# ==========================

@app.get("/")
def root():

    return {
        "message":
        "Fraud Detection Platform Running"
    }


@app.get("/health")
def health():

    return {
        "status":
        "healthy"
    }

@app.get(
    "/fraud-alerts"
)
def fraud_alerts():

    return get_fraud_alerts()

@app.get("/user/{user_id}")
def get_user_details(
    user_id: int
):

    user = get_user(
        user_id
    )

    if not user:

        return {
            "error":
            "User not found"
        }

    return user


@app.post("/predict")
def predict(
    request: PredictionRequest
):

    user = get_user(
        request.user_id
    )

    if not user:

        return {
            "error":
            "User not found"
        }

    amount_log = np.log1p(
        request.amount
    )

    is_high_risk_country = int(
        request.country_risk_score > 0.5
    )

    current_hour = (
        datetime.now().hour
    )

    is_night_transaction = int(
        0 <= current_hour <= 5
    )

    user_type_encoded = (
        user_type_mapping[
            user["user_type"]
        ]
    )

    merchant_encoded = (
        merchant_mapping[
            request.merchant_category
        ]
    )

    # Get the user's risk score from the cached user profile
    risk_score = user.get("risk_score", 0.5)

    # Build behavioral features
    tx_dict = {
        "user_id": request.user_id,
        "amount": request.amount,
        "country": request.country,
        "device_id": request.device_id
    }
    behavior = build_behavior_features(tx_dict)

    # 11 features aligned with V2 model training
    features = [[
        request.amount,
        amount_log,
        request.country_risk_score,
        risk_score,
        merchant_encoded,
        user_type_encoded,
        is_high_risk_country,
        is_night_transaction,
        behavior["amount_vs_avg"],
        behavior["new_device_flag"],
        behavior["country_changed"]
    ]]

    fraud_prob = (
        model.predict_proba(
            features
        )[0][1]
    )

    # If predicted as high probability of fraud, save alert
    if fraud_prob > 0.80:
        alert = {
            "user_id": request.user_id,
            "amount": request.amount,
            "merchant": request.merchant_category,
            "fraud_probability": round(float(fraud_prob), 4)
        }
        save_fraud_alert(alert)

    return {

        "fraud_probability":
        round(
            float(fraud_prob),
            4
        ),

        "risk":
        (
            "HIGH"
            if fraud_prob > 0.8
            else "LOW"
        ),

        "user_type":
        user["user_type"],

        "amount":
        request.amount,

        "merchant_category":
        request.merchant_category
    }
@app.get(
    "/dashboard",
    response_class=HTMLResponse
)
def dashboard(
    request: Request
):

    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request
        }
    )


@app.get(
    "/alerts",
    response_class=HTMLResponse
)
def alerts_page(
    request: Request
):

    return templates.TemplateResponse(
        "alerts.html",
        {
            "request": request
        }
    )


@app.get(
    "/predict-page",
    response_class=HTMLResponse
)
def predict_page(
    request: Request
):

    return templates.TemplateResponse(
        "predict.html",
        {
            "request": request
        }
    )


@app.get(
    "/status-page",
    response_class=HTMLResponse
)
def status_page(
    request: Request
):

    return templates.TemplateResponse(
        "status.html",
        {
            "request": request
        }
    )
@app.get("/dashboard-stats")
def dashboard_stats():

    alerts = get_fraud_alerts()

    return {

        "total_users": 10000,

        "total_transactions": 95621,

        "fraud_alerts": len(alerts),

        "fraud_rate": round(
            len(alerts) * 100 / 95621,
            2
        )
    }