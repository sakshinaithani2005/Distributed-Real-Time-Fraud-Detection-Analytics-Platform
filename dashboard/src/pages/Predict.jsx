import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { postPredict } from '../services/api';
import { 
  ShieldAlert, 
  ShieldCheck, 
  HelpCircle, 
  Settings, 
  Cpu, 
  Send,
  Loader2,
  Lock,
  Eye,
  AlertTriangle
} from 'lucide-react';

export default function Predict() {
  const [userId, setUserId] = useState('1');
  const [amount, setAmount] = useState('500');
  const [merchantCategory, setMerchantCategory] = useState('Shopping');
  const [countryRiskScore, setCountryRiskScore] = useState(0.2);
  const [deviceId, setDeviceId] = useState('device_chrome_linux');
  const [country, setCountry] = useState('India');

  const merchantCategories = [
    'Food',
    'Entertainment',
    'Education',
    'Shopping',
    'Fuel',
    'Utilities',
    'Travel',
    'Business',
    'Healthcare',
    'Electronics'
  ];

  const mutation = useMutation({
    mutationFn: postPredict,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId || !amount) return;
    mutation.mutate({
      userId,
      amount,
      merchantCategory,
      countryRiskScore,
      deviceId,
      country
    });
  };

  const getRecommendation = (prob) => {
    if (prob >= 0.85) {
      return {
        label: 'BLOCK TRANSACTION & ALERT SOC',
        desc: 'This transaction exhibits patterns indicative of high-risk account takeover or automated fraud simulation. We recommend holding funds and notifying security operations.',
        color: 'text-rose-400',
        borderColor: 'border-rose-500/30',
        bgColor: 'bg-rose-500/5',
        icon: Lock,
      };
    } else if (prob >= 0.50) {
      return {
        label: 'REQUEST MULTI-FACTOR VERIFICATION',
        desc: 'Slight anomalies detected in transaction value compared to demographic averages. Transaction allowed pending SMS/email authentication verification.',
        color: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        bgColor: 'bg-amber-500/5',
        icon: Eye,
      };
    } else {
      return {
        label: 'APPROVE TRANSACTION',
        desc: 'Low-risk scores across device metadata, country risk profile, and transaction frequency. Approved automatically by XGBoost pipeline.',
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bgColor: 'bg-emerald-500/5',
        icon: ShieldCheck,
      };
    }
  };

  const hasResult = mutation.isSuccess;
  const result = mutation.data;
  const probability = result?.fraud_probability || 0;
  const recommendation = getRecommendation(probability);

  // SVG Gauge calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability * circumference);

  const getGaugeColor = (prob) => {
    if (prob >= 0.85) return 'stroke-rose-500';
    if (prob >= 0.50) return 'stroke-amber-500';
    return 'stroke-emerald-500';
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#1e293b] pb-6">
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
          Real-Time Decision Simulator
        </h1>
        <p className="text-sm text-slate-400">
          Simulate a transaction request through our distributed model pipelines.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Input Form Card */}
        <div className="bg-[#0e1320] border border-[#1e293b] p-6 rounded-2xl lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1e293b] pb-4">
            <Settings className="text-cyan-400 animate-spin-slow" size={20} />
            <h2 className="text-base font-bold text-slate-200">Transaction Parameters</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* User ID */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">User ID</label>
                <input
                  type="number"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. 1024"
                  className="w-full bg-[#161f30] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full bg-[#161f30] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Merchant Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Merchant Category</label>
                <select
                  value={merchantCategory}
                  onChange={(e) => setMerchantCategory(e.target.value)}
                  className="w-full bg-[#161f30] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                >
                  {merchantCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Transaction Country */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Russia"
                  className="w-full bg-[#161f30] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Slider for Country Risk Score */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Country Risk Coefficient
                </label>
                <span className="text-xs font-mono text-cyan-400 font-bold">{countryRiskScore.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={countryRiskScore}
                onChange={(e) => setCountryRiskScore(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.0 (Safe / Domestic)</span>
                <span>0.5 (Medium / Offshore)</span>
                <span>1.0 (High Risk / Non-Cooperative)</span>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Device ID */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Device Signature</label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="e.g. device_chrome_win"
                  className="w-full bg-[#161f30] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3.5 px-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-t border-cyan-300/30"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Computing Model Probabilities...</span>
                </>
              ) : (
                <>
                  <Send size={16} className="text-slate-950" />
                  <span>Initiate Model Inference</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results Card */}
        <div className="bg-[#0e1320] border border-[#1e293b] p-6 rounded-2xl lg:col-span-2 flex flex-col justify-between min-h-[400px]">
          <div className="flex items-center gap-3 border-b border-[#1e293b] pb-4">
            <Cpu className="text-cyan-400" size={20} />
            <h2 className="text-base font-bold text-slate-200">XGBoost Evaluation</h2>
          </div>

          {!hasResult && !mutation.isPending && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <HelpCircle size={48} className="text-slate-700 animate-pulse" />
              <p className="text-sm font-semibold text-slate-400">Decision Telemetry Empty</p>
              <p className="text-xs text-slate-500 max-w-[200px]">
                Submit the form on the left to start live model inference.
              </p>
            </div>
          )}

          {mutation.isPending && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3 animate-pulse">
              <Loader2 size={48} className="text-cyan-400 animate-spin" />
              <p className="text-sm font-semibold text-slate-300">Consulting Feature Store...</p>
              <p className="text-xs text-slate-500">Querying Redis profiles and constructing telemetry arrays.</p>
            </div>
          )}

          {hasResult && !mutation.isPending && (
            <div className="flex-1 flex flex-col justify-between space-y-6 pt-4 animate-fade-in">
              {/* Circular Gauge */}
              <div className="flex justify-center items-center py-4">
                <div className="relative flex items-center justify-center">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      className="stroke-[#161f30] fill-transparent"
                      strokeWidth="10"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      className={`fill-transparent transition-all duration-500 ${getGaugeColor(probability)}`}
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">FRAUD PROB</span>
                    <span className="text-3xl font-extrabold text-slate-100 font-mono">
                      {(probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendation Banner */}
              <div className={`p-4 border rounded-xl flex items-start gap-3.5 ${recommendation.bgColor} ${recommendation.borderColor}`}>
                <recommendation.icon className={`shrink-0 mt-0.5 ${recommendation.color}`} size={18} />
                <div className="space-y-1">
                  <div className={`text-xs font-extrabold uppercase tracking-wider ${recommendation.color}`}>
                    {recommendation.label}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {recommendation.desc}
                  </p>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#161f30]/40 p-4 border border-[#1e293b]/50 rounded-xl font-mono">
                <div>
                  <span className="block text-slate-500 uppercase tracking-wide text-[10px]">Model Version</span>
                  <span className="text-slate-300 font-bold">XGBoost Classifier v2</span>
                </div>
                <div>
                  <span className="block text-slate-500 uppercase tracking-wide text-[10px]">Classification</span>
                  <span className={`font-bold ${result.risk === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {result.risk} RISK
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
