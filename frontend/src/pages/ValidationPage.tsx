import React from 'react';
import { CheckCircle2, BarChart3, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { MetricsGrid } from '@/components/metrics/MetricsGrid';

export const ValidationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scientific Validation Benchmarks</h1>
        <p className="text-xs text-slate-500 mt-1">Global evaluation metrics across test geographic tiles for SwinSR-GAN model validation.</p>
      </div>

      <MetricsGrid hasHRReference={true} />
    </div>
  );
};
