import React from 'react';
import { Settings, Cpu, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage compute environment and default pipeline configurations.</p>
      </div>

      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">API Connection & Hardware</h3>
        <div className="text-xs text-slate-600 space-y-2">
          <div>FastAPI Backend Endpoint: <span className="font-mono text-blue-700 font-semibold">http://localhost:8000</span></div>
          <div>PyTorch Hardware Target: <span className="font-mono text-emerald-700 font-semibold">CUDA GPU (NVIDIA A10G)</span></div>
        </div>
      </Card>
    </div>
  );
};
