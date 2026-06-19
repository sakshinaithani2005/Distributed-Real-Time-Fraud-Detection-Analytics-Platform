import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Predict from './pages/Predict';
import System from './pages/System';
import Architecture from './pages/Architecture';

// Initialize TanStack React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex bg-[#0b0f19] min-h-screen text-slate-100 font-sans antialiased">
          {/* Collapsible Sidebar */}
          <Sidebar />

          {/* Main Workspace */}
          <main className="flex-1 overflow-x-hidden min-h-screen">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/predict" element={<Predict />} />
                <Route path="/system" element={<System />} />
                <Route path="/architecture" element={<Architecture />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
