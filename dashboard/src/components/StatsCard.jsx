import React from 'react';

export default function StatsCard({ title, value, change, trend, icon: Icon, color = 'cyan', delay = 0, loading = false }) {
  const colorMap = {
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      gradient: 'from-cyan-500/5 to-transparent'
    },
    emerald: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      gradient: 'from-emerald-500/5 to-transparent'
    },
    rose: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      gradient: 'from-rose-500/5 to-transparent'
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      gradient: 'from-amber-500/5 to-transparent'
    },
    violet: {
      text: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      gradient: 'from-violet-500/5 to-transparent'
    }
  };

  const scheme = colorMap[color] || colorMap.cyan;

  if (loading) {
    return (
      <div className="bg-[#0e1320] border border-[#1e293b] rounded-2xl p-6 h-32 animate-pulse flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="h-4 w-24 bg-[#1e293b] rounded"></div>
          <div className="h-8 w-8 bg-[#1e293b] rounded-lg"></div>
        </div>
        <div className="h-8 w-36 bg-[#1e293b] rounded"></div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-[#0e1320] border border-[#1e293b] rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-slate-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] group flex flex-col justify-between bg-gradient-to-br ${scheme.gradient} animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-semibold text-slate-400 tracking-wide uppercase">{title}</span>
        <div className={`p-2.5 rounded-xl ${scheme.bg} ${scheme.text} group-hover:scale-110 transition-transform duration-200`}>
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-auto">
        <h3 className="text-2xl font-bold text-slate-100 tracking-tight">{value}</h3>
        {change && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
            trend === 'up' 
              ? 'text-rose-400 bg-rose-500/10' 
              : 'text-emerald-400 bg-emerald-500/10'
          }`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
