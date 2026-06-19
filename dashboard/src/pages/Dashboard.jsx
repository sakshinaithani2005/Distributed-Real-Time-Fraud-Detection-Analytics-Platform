import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getDashboardStats, 
  getFraudAlerts 
} from '../services/api';
import StatsCard from '../components/StatsCard';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Percent, 
  Cpu,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie, 
  Legend,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart
} from 'recharts';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    refetchInterval: 5000,
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['recentAlerts'],
    queryFn: getFraudAlerts,
    refetchInterval: 5000,
  });

  // Mock aggregates for high-fidelity interactive visualization
  const txRatioData = [
    { name: 'Legitimate', value: 95.0, color: '#10b981' },
    { name: 'Fraudulent', value: 5.0, color: '#f43f5e' }
  ];

  const categoryData = [
    { category: 'Food', count: 12, amt: 4500 },
    { category: 'Travel', count: 34, amt: 29000 },
    { category: 'Electronics', count: 28, amt: 18500 },
    { category: 'Shopping', count: 22, amt: 12000 },
    { category: 'Business', count: 15, amt: 48000 },
    { category: 'Healthcare', count: 8, amt: 9000 }
  ];

  const userTypeData = [
    { subject: 'Business Owner', Fraud: 45, fullMark: 100 },
    { subject: 'Employee', Fraud: 25, fullMark: 100 },
    { subject: 'High Net Worth', Fraud: 85, fullMark: 100 },
    { subject: 'Student', Fraud: 15, fullMark: 100 }
  ];

  const trendData = [
    { time: '00:00', rate: 2.1, volume: 1500 },
    { time: '04:00', rate: 3.5, volume: 800 },
    { time: '08:00', rate: 1.2, volume: 2200 },
    { time: '12:00', rate: 4.8, volume: 3400 },
    { time: '16:00', rate: 5.2, volume: 2900 },
    { time: '20:00', rate: 2.8, volume: 1900 }
  ];

  return (
    <div className="space-y-8 animate-fade-in p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-[#1e293b] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Security Operations Center (SOC)
          </h1>
          <p className="text-sm text-slate-400">
            Real-time streaming telemetry and predictive model inference.
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-300">STREAM ACTIVE</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard 
          title="Total Inspected Users" 
          value={statsLoading ? 'Loading...' : stats?.total_users?.toLocaleString()}
          change="+12% MoM"
          trend="down"
          icon={Users}
          color="cyan"
          delay={100}
        />
        <StatsCard 
          title="Processed Txns" 
          value={statsLoading ? 'Loading...' : stats?.total_transactions?.toLocaleString()}
          change="+8.4% / hr"
          trend="down"
          icon={Activity}
          color="violet"
          delay={200}
        />
        <StatsCard 
          title="Total Fraud Alerts" 
          value={statsLoading ? 'Loading...' : stats?.fraud_alerts}
          change="+4.2% / hr"
          trend="up"
          icon={AlertTriangle}
          color="rose"
          delay={300}
        />
        <StatsCard 
          title="System Fraud Rate" 
          value={statsLoading ? 'Loading...' : `${stats?.fraud_rate}%`}
          change="-0.04% vs 24h"
          trend="down"
          icon={Percent}
          color="amber"
          delay={400}
        />
        <StatsCard 
          title="Inference Pipeline" 
          value={statsLoading ? 'Loading...' : (stats?.model_version || 'v2.0-XGB')}
          change="MLflow active"
          trend="down"
          icon={Cpu}
          color="emerald"
          delay={500}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {/* Risk Trend Chart */}
        <div className="bg-[#0e1320] border border-[#1e293b] rounded-2xl p-5 xl:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-200">System Risk Trend</h3>
            <span className="text-xs text-slate-400">Rate vs Volume</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="rate" stroke="#c084fc" fillOpacity={1} fill="url(#colorRate)" name="Fraud Rate (%)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fraud vs Legitimate */}
        <div className="bg-[#0e1320] border border-[#1e293b] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-200">Volume Ratio</h3>
            <span className="text-xs text-slate-400">Total inspects</span>
          </div>
          <div className="h-64 flex flex-col justify-center">
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={txRatioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {txRatioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-400">Legit (95%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-400">Fraud (5%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fraud by User Type */}
        <div className="bg-[#0e1320] border border-[#1e293b] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-200">Demographic Profile</h3>
            <span className="text-xs text-slate-400">Risk rating</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={userTypeData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="Risk Index" dataKey="Fraud" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fraud by Merchant */}
        <div className="bg-[#0e1320] border border-[#1e293b] rounded-2xl p-5 xl:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-200">Fraud by Merchant Category</h3>
            <span className="text-xs text-slate-400">Exposure amount</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="amt" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Exposure (₹)">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#38bdf8' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts Panel */}
        <div className="bg-[#0e1320] border border-[#1e293b] rounded-2xl p-5 xl:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-200">Critical Threat Alert Stream</h3>
              <p className="text-xs text-slate-400">Immediate containment required</p>
            </div>
            <span className="text-xs bg-rose-500/10 text-rose-400 font-semibold px-2 py-0.5 rounded-md border border-rose-500/20">
              LIVE BROADCAST
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e293b] text-xs font-semibold text-slate-400">
                  <th className="pb-3">User ID</th>
                  <th className="pb-3">Merchant</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Probability</th>
                  <th className="pb-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b] text-sm text-slate-300">
                {alertsLoading ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-500 animate-pulse">
                      Analyzing stream patterns...
                    </td>
                  </tr>
                ) : alerts?.slice(0, 4).map((alert, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/30 transition-colors duration-150">
                    <td className="py-3.5 font-mono text-slate-400">{alert.user_id}</td>
                    <td className="py-3.5">{alert.merchant}</td>
                    <td className="py-3.5 font-semibold text-slate-200">₹{alert.amount?.toLocaleString()}</td>
                    <td className="py-3.5 font-mono text-cyan-400 font-medium">
                      {(alert.fraud_probability * 100).toFixed(2)}%
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                        alert.fraud_probability > 0.90 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {alert.fraud_probability > 0.90 ? 'CRITICAL' : 'HIGH'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
