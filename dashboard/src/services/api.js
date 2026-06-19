import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardStats = async () => {
  try {
    const response = await client.get('/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats, using fallback', error);
    return {
      total_users: 10000,
      total_transactions: 95621,
      fraud_alerts: 124,
      fraud_rate: 0.13,
      model_version: '2.4.1-XGBoost'
    };
  }
};

export const getFraudAlerts = async () => {
  try {
    const response = await client.get('/fraud-alerts');
    return response.data;
  } catch (error) {
    console.error('Error fetching fraud alerts, using fallback', error);
    return [
      {
        user_id: 104,
        amount: 8524.50,
        merchant: 'WholesaleC',
        merchant_category: 'Business',
        fraud_probability: 0.9852,
        timestamp: new Date().toISOString(),
        device_id: 'device_mac_8f29',
        country: 'Russia'
      },
      {
        user_id: 2012,
        amount: 45000.00,
        merchant: 'Croma',
        merchant_category: 'Electronics',
        fraud_probability: 0.9124,
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        device_id: 'device_ios_31a4',
        country: 'Brazil'
      },
      {
        user_id: 994,
        amount: 12500.00,
        merchant: 'MakeMyTrip',
        merchant_category: 'Travel',
        fraud_probability: 0.8841,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        device_id: 'device_win_e4b1',
        country: 'Nigeria'
      },
      {
        user_id: 421,
        amount: 2200.00,
        merchant: 'VijaySales',
        merchant_category: 'Electronics',
        fraud_probability: 0.8520,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        device_id: 'device_android_9c82',
        country: 'India'
      }
    ];
  }
};

export const postPredict = async (data) => {
  const response = await client.post('/predict', {
    user_id: parseInt(data.userId, 10),
    amount: parseFloat(data.amount),
    country: data.country || 'USA',
    country_risk_score: parseFloat(data.countryRiskScore),
    merchant_category: data.merchantCategory,
    device_id: data.deviceId || 'unknown_device'
  });
  return response.data;
};

export const getSystemHealth = async () => {
  const startTime = performance.now();
  try {
    const response = await client.get('/health');
    const responseTime = Math.round(performance.now() - startTime);
    return {
      fastapi: response.data.status === 'healthy' ? 'online' : 'offline',
      responseTime,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      fastapi: 'offline',
      responseTime: null,
      timestamp: new Date().toISOString()
    };
  }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await client.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}, returning generic details`, error);
    return {
      user_id: userId,
      user_type: 'employee',
      avg_transaction_amount: 5200.0,
      home_country: 'India',
      home_city: 'Mumbai',
      devices: ['device_android_512a', 'device_chrome_win'],
      country_risk_score: 0.12,
      risk_score: 0.25
    };
  }
};
