import React, { useState } from 'react';
import { 
  Play, 
  Layers, 
  Cpu, 
  Database, 
  Terminal, 
  Monitor, 
  Zap, 
  ArrowDown, 
  Cpu as ModelIcon,
  MessageSquare
} from 'lucide-react';

export default function Architecture() {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      id: 1,
      title: 'Transaction Generator',
      subtitle: 'Python Transaction Simulator',
      desc: 'Simulates normal user spendings and coordinates 5% anomalous spikes, new device configurations, and overnight transactions.',
      icon: Play,
      color: 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]',
      tech: 'Python (random, dataclasses)'
    },
    {
      id: 2,
      title: 'Kafka Broker',
      subtitle: 'Event Ingestion Hub',
      desc: 'Publishes streaming data to the "fraud-transactions" event topic. Decouples production generation from downstream evaluation loops.',
      icon: MessageSquare,
      color: 'border-violet-500/20 text-violet-400 bg-violet-500/5',
      glow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]',
      tech: 'Confluent Platform cp-kafka'
    },
    {
      id: 3,
      title: 'Fraud Detector',
      subtitle: 'Python Streaming Consumer',
      desc: 'Listens to the Kafka event log in a continuous polling loop, reading JSON structures and initiating the prediction pipeline.',
      icon: Layers,
      color: 'border-pink-500/20 text-pink-400 bg-pink-500/5',
      glow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)]',
      tech: 'Python kafka-python consumer'
    },
    {
      id: 4,
      title: 'Redis Feature Store',
      subtitle: 'Low-latency Cache Query',
      desc: 'Resolves historical profiles (average spending limits, trusted devices, geolocation contexts) in under 2ms to enrich features.',
      icon: Database,
      color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      tech: 'Redis (Alpine Image)'
    },
    {
      id: 5,
      title: 'XGBoost ML Model',
      subtitle: 'Classifier Evaluation',
      desc: 'Receives the 11 ensembled features and classifies the transaction. Employs gradient boosted decision trees for prediction.',
      icon: ModelIcon,
      color: 'border-amber-500/20 text-amber-400 bg-amber-500/5',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      tech: 'XGBoost (Classifier v2.0)'
    },
    {
      id: 6,
      title: 'Fraud Alert Service',
      subtitle: 'Notification Dispatcher',
      desc: 'If model output surpasses the 80% fraud probability threshold, the event is immediately saved back to Redis alert lists.',
      icon: Zap,
      color: 'border-rose-500/20 text-rose-400 bg-rose-500/5',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]',
      tech: 'Python Cache Service'
    },
    {
      id: 7,
      title: 'FastAPI Web Server',
      subtitle: 'REST Core APIs',
      desc: 'Serves real-time analytical metrics to the web browser and enables custom prediction submissions from manual analysts.',
      icon: Terminal,
      color: 'border-blue-500/20 text-blue-400 bg-blue-500/5',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]',
      tech: 'FastAPI & Uvicorn Server'
    },
    {
      id: 8,
      title: 'React Dashboard',
      subtitle: 'Incident Response Console',
      desc: 'Aggregates statistics and feeds telemetry widgets, enabling immediate threat containment (blocking accounts).',
      icon: Monitor,
      color: 'border-cyan-400 text-cyan-400 bg-cyan-500/10',
      glow: 'shadow-[0_0_20px_rgba(34,211,238,0.25)]',
      tech: 'React, Tailwind CSS, Recharts'
    }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#1e293b] pb-6 text-center">
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
          Platform Architecture
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Streaming data pipeline topology and model orchestration flowchart.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5 items-start">
        {/* Visual Pipeline */}
        <div className="lg:col-span-3 flex flex-col items-center py-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;

            return (
              <React.Fragment key={step.id}>
                {/* Node Card */}
                <div 
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                  className={`w-full max-w-sm bg-[#0e1320] border rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer ${
                    isActive ? `border-cyan-400 scale-[1.03] ${step.glow}` : 'border-[#1e293b]'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${step.color}`}>
                    <Icon size={22} className={isActive ? 'animate-pulse' : ''} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-sm text-slate-200 truncate">{step.title}</h3>
                      <span className="text-[9px] font-mono text-slate-500">0{step.id}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{step.subtitle}</p>
                  </div>
                </div>

                {/* Animated Arrow Connector (not shown after the last item) */}
                {idx < steps.length - 1 && (
                  <div className="py-2.5 flex flex-col items-center justify-center">
                    <svg className="h-8 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                        className={`stroke-slate-800 ${isActive ? 'stroke-cyan-500 animate-bounce' : ''}`}
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Detailed Description Side Panel */}
        <div className="lg:col-span-2 lg:sticky lg:top-24 bg-[#0e1320] border border-[#1e293b] p-6 rounded-2xl min-h-[300px] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-200 border-b border-[#1e293b] pb-3 mb-4 flex items-center gap-2">
              <Zap className="text-cyan-400" size={16} />
              Component Inspector
            </h3>
            
            {activeStep ? (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    Node 0{activeStep} Details
                  </span>
                  <h4 className="text-lg font-bold text-slate-200">{steps[activeStep - 1].title}</h4>
                  <span className="text-xs text-slate-500 italic">{steps[activeStep - 1].subtitle}</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {steps[activeStep - 1].desc}
                </p>
                <div className="bg-[#161f30]/40 border border-[#1e293b] p-3.5 rounded-xl text-xs space-y-1">
                  <span className="text-slate-500 uppercase font-bold tracking-wider text-[9px]">Technologies</span>
                  <div className="text-cyan-300 font-mono font-medium">{steps[activeStep - 1].tech}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-3">
                <HelpIcon size={36} className="mx-auto text-slate-700 animate-pulse" />
                <p className="text-sm font-semibold">Hover over any pipeline block</p>
                <p className="text-xs text-slate-600 max-w-[200px] mx-auto">
                  Trace telemetry coordinates and read technical details of each stack component.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-[#1e293b]/70 pt-4 mt-6 text-xs text-slate-500 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Real-time event flow visualizer active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpIcon({ className, size }) {
  return (
    <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
