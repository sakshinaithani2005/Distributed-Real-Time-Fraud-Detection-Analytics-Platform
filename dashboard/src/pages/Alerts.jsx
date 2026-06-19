import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFraudAlerts, getUserDetails } from '../services/api';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X, 
  User as UserIcon, 
  MapPin, 
  Monitor, 
  AlertTriangle,
  RefreshCw,
  Calendar,
  Layers,
  DollarSign
} from 'lucide-react';

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [merchantFilter, setMerchantFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [sortBy, setSortBy] = useState('probability-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const itemsPerPage = 6;

  // Auto-refresh alerts every 5 seconds
  const { data: alerts = [], isLoading, isRefetching } = useQuery({
    queryKey: ['fraudAlerts'],
    queryFn: getFraudAlerts,
    refetchInterval: 5000,
  });

  // Fetch detailed user profile when alert row is inspected
  const { data: userProfile, isLoading: userLoading } = useQuery({
    queryKey: ['userDetails', selectedAlert?.user_id],
    queryFn: () => getUserDetails(selectedAlert?.user_id),
    enabled: !!selectedAlert?.user_id,
  });

  // Calculate risk level string based on probability
  const getRiskDetails = (prob) => {
    if (prob >= 0.90) return { label: 'CRITICAL', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    if (prob >= 0.70) return { label: 'HIGH', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    return { label: 'MEDIUM', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
  };

  // 1. Filter Logic
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.user_id?.toString().includes(searchTerm) || 
                          alert.merchant?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMerchant = merchantFilter === '' || 
                            alert.merchant?.toLowerCase() === merchantFilter.toLowerCase() ||
                            alert.merchant_category?.toLowerCase() === merchantFilter.toLowerCase();
    
    const riskDetails = getRiskDetails(alert.fraud_probability);
    const matchesRisk = riskFilter === '' || riskDetails.label === riskFilter;

    return matchesSearch && matchesMerchant && matchesRisk;
  });

  // 2. Sort Logic
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortBy === 'probability-desc') return b.fraud_probability - a.fraud_probability;
    if (sortBy === 'probability-asc') return a.fraud_probability - b.fraud_probability;
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  // 3. Pagination Logic
  const totalPages = Math.ceil(sortedAlerts.length / itemsPerPage);
  const paginatedAlerts = sortedAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueMerchants = Array.from(new Set(alerts.map(a => a.merchant).filter(Boolean)));

  const handleRowClick = (alert) => {
    setSelectedAlert(alert);
    setDrawerOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 relative overflow-hidden min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#1e293b] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            SOC Alerts Center
            {isRefetching && <RefreshCw className="h-4 w-4 text-cyan-400 animate-spin" />}
          </h1>
          <p className="text-sm text-slate-400">
            Investigate real-time high-risk and fraudulent transaction events.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid gap-4 md:grid-cols-4 bg-[#0e1320] border border-[#1e293b] p-5 rounded-2xl">
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search User ID or Merchant..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-[#161f30] border border-[#1e293b] rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Filter Merchant */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Filter size={18} />
          </span>
          <select
            value={merchantFilter}
            onChange={(e) => { setMerchantFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-[#161f30] border border-[#1e293b] rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
          >
            <option value="">All Merchants</option>
            {uniqueMerchants.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Filter Risk Level */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <AlertTriangle size={18} />
          </span>
          <select
            value={riskFilter}
            onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-[#161f30] border border-[#1e293b] rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
          >
            <option value="">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk (90%+)</option>
            <option value="HIGH">High Risk (70%-90%)</option>
            <option value="MEDIUM">Medium Risk (&lt;70%)</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <ArrowUpDown size={18} />
          </span>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); }}
            className="w-full bg-[#161f30] border border-[#1e293b] rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
          >
            <option value="probability-desc">Probability (Highest First)</option>
            <option value="probability-asc">Probability (Lowest First)</option>
            <option value="amount-desc">Amount (Highest First)</option>
            <option value="amount-asc">Amount (Lowest First)</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#0e1320] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161f30]/40 border-b border-[#1e293b] text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 pl-6">User ID</th>
                <th className="p-4">Merchant Name</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Risk Probability</th>
                <th className="p-4">Risk Classification</th>
                <th className="p-4">Trigger Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/70 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 animate-pulse font-medium">
                    Loading security feed...
                  </td>
                </tr>
              ) : paginatedAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="text-slate-600" size={36} />
                      <span className="font-semibold text-slate-400">No matching threat alerts found</span>
                      <span className="text-xs text-slate-500">Try adjusting your filters or search constraints.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAlerts.map((alert, idx) => {
                  const risk = getRiskDetails(alert.fraud_probability);
                  return (
                    <tr 
                      key={idx} 
                      onClick={() => handleRowClick(alert)}
                      className="hover:bg-[#161f30]/30 transition-all duration-150 cursor-pointer group"
                    >
                      <td className="p-4 pl-6 font-mono text-slate-400 group-hover:text-cyan-400 transition-colors">
                        #{alert.user_id}
                      </td>
                      <td className="p-4 font-semibold text-slate-200">{alert.merchant}</td>
                      <td className="p-4 font-mono font-medium text-slate-300">₹{alert.amount?.toLocaleString()}</td>
                      <td className="p-4 font-mono text-cyan-400 font-bold">
                        {(alert.fraud_probability * 100).toFixed(2)}%
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${risk.color}`}>
                          {risk.label}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500 font-mono">
                        {new Date(alert.timestamp || new Date()).toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-[#161f30]/20 border-t border-[#1e293b] p-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3.5 py-1.5 rounded-lg border border-[#1e293b] bg-[#161f30] text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-50 transition"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3.5 py-1.5 rounded-lg border border-[#1e293b] bg-[#161f30] text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-out Drawer Panel */}
      {drawerOpen && selectedAlert && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Slider content */}
          <div className="relative w-full max-w-md bg-[#0b0f19] border-l border-[#1e293b] h-full shadow-2xl flex flex-col z-10 transition-transform duration-300">
            {/* Header */}
            <div className="p-6 border-b border-[#1e293b] flex items-center justify-between bg-[#0e1320]">
              <div>
                <h2 className="text-lg font-bold text-slate-200">Incident Details</h2>
                <span className="text-xs text-slate-400 font-mono">USER PROFILE INSPECTOR</span>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Score section */}
              <div className="bg-[#0e1320] border border-[#1e293b] rounded-2xl p-5 text-center space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fraud Probability Score</span>
                <div className="text-4xl font-extrabold text-rose-500 font-mono">
                  {(selectedAlert.fraud_probability * 100).toFixed(2)}%
                </div>
                <div className="flex justify-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border ${
                    getRiskDetails(selectedAlert.fraud_probability).color
                  }`}>
                    {getRiskDetails(selectedAlert.fraud_probability).label} RISK TARGET
                  </span>
                </div>
              </div>

              {/* Transaction details card */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign size={14} /> Transaction Telemetry
                </h4>
                <div className="bg-[#0e1320] border border-[#1e293b] rounded-xl p-4 divide-y divide-[#1e293b]/70 text-sm space-y-3">
                  <div className="flex justify-between pb-3">
                    <span className="text-slate-500">Transaction ID</span>
                    <span className="font-mono text-slate-300">tx_mock_123490</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500">Amount</span>
                    <span className="font-semibold text-slate-200">₹{selectedAlert.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500">Merchant Name</span>
                    <span className="text-slate-300 font-medium">{selectedAlert.merchant}</span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-slate-500">Merchant Category</span>
                    <span className="text-slate-300 font-medium">{selectedAlert.merchant_category || 'Electronics'}</span>
                  </div>
                </div>
              </div>

              {/* User details card */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <UserIcon size={14} /> User Profile Cache
                </h4>
                <div className="bg-[#0e1320] border border-[#1e293b] rounded-xl p-4 text-sm">
                  {userLoading ? (
                    <div className="text-slate-500 animate-pulse text-center py-4">
                      Loading profiles from Redis...
                    </div>
                  ) : userProfile ? (
                    <div className="divide-y divide-[#1e293b]/70 space-y-3">
                      <div className="flex justify-between pb-3">
                        <span className="text-slate-500">User ID</span>
                        <span className="font-mono text-slate-300">#{userProfile.user_id}</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-slate-500">Segment / Type</span>
                        <span className="text-slate-300 font-medium capitalize">{userProfile.user_type}</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-slate-500">Avg Txn Amount</span>
                        <span className="text-slate-300 font-medium">₹{userProfile.avg_transaction_amount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-slate-500">Profile Risk Score</span>
                        <span className="text-slate-300 font-mono font-medium">{userProfile.risk_score}</span>
                      </div>
                      <div className="flex justify-between pt-3">
                        <span className="text-slate-500">Origin Location</span>
                        <span className="text-slate-300 flex items-center gap-1">
                          <MapPin size={12} className="text-slate-500" />
                          {userProfile.home_city}, {userProfile.home_country}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 text-center py-4">
                      Failed to fetch profile details.
                    </div>
                  )}
                </div>
              </div>

              {/* Device and context details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Monitor size={14} /> Device & Country Context
                </h4>
                <div className="bg-[#0e1320] border border-[#1e293b] rounded-xl p-4 divide-y divide-[#1e293b]/70 text-sm space-y-3">
                  <div className="flex justify-between pb-3">
                    <span className="text-slate-500">Device ID</span>
                    <span className="font-mono text-xs text-slate-400 truncate max-w-[200px]">
                      {selectedAlert.device_id || 'new_device_8fa2'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3">
                    <span className="text-slate-500">Txn Country</span>
                    <span className="text-slate-300 flex items-center gap-1">
                      <MapPin size={12} className="text-rose-400" />
                      {selectedAlert.country || 'Russia'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-6 border-t border-[#1e293b] bg-[#0e1320] flex gap-3">
              <button 
                onClick={() => {
                  alert(`Containment successfully triggered for User #${selectedAlert.user_id}. Account temporarily suspended.`);
                  setDrawerOpen(false);
                }}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-sm transition duration-150"
              >
                Block Account
              </button>
              <button 
                onClick={() => {
                  alert(`Transaction marked as false positive for User #${selectedAlert.user_id}.`);
                  setDrawerOpen(false);
                }}
                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm border border-slate-700 transition duration-150"
              >
                Whitelist Txn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
