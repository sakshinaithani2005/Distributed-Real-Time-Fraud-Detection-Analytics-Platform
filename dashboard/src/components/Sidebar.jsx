import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Binary, 
  Activity, 
  Network, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert as BrandIcon
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Fraud Alerts', path: '/alerts', icon: ShieldAlert, alert: true },
    { name: 'Live Prediction', path: '/predict', icon: Binary },
    { name: 'System Monitoring', path: '/system', icon: Activity },
    { name: 'Architecture', path: '/architecture', icon: Network },
  ];

  return (
    <aside 
      className={`bg-[#0e1320] border-r border-[#1e293b] flex flex-col h-screen sticky top-0 transition-all duration-300 z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#1e293b] min-h-[73px]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 shrink-0">
            <BrandIcon size={22} className="animate-pulse" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-base tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent truncate">
              FRAUD PREDICTOR
            </span>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2035]/50'
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!isCollapsed && (
              <span className="text-sm truncate">{item.name}</span>
            )}
            
            {/* Tooltip on Collapsed */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl border border-slate-800 z-30">
                {item.name}
              </div>
            )}
            
            {/* Live alert indicator for Alerts page */}
            {item.alert && !isCollapsed && (
              <span className="ml-auto flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="p-4 border-t border-[#1e293b]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-[#1e293b]/50 transition-all duration-200"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : (
            <div className="flex items-center gap-2">
              <ChevronLeft size={18} />
              <span className="text-xs">Collapse Panel</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
