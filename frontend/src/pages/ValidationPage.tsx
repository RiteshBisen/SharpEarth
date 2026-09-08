import React from 'react';
import { CheckCircle2, BarChart3, ShieldCheck, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MetricsGrid } from '@/components/metrics/MetricsGrid';
import { SpectralIntegrityTable } from '@/components/metrics/SpectralIntegrityTable';
import { DownstreamValidationTabs } from '@/components/metrics/DownstreamValidationTabs';
import { useAnalysis } from '@/context/AnalysisContext';

export const ValidationPage: React.FC = () => {
  const { activeDataset } = useAnalysis();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scientific Validation Benchmarks</h1>
        <p className="text-xs text-slate-500 mt-1">
          Global evaluation metrics across test geographic tiles for SwinSR-GAN model validation. Currently inspecting <span className="font-semibold text-slate-900">{activeDataset.name}</span>.
        </p>
      </div>

      <MetricsGrid hasHRReference={true} />

      <SpectralIntegrityTable />

      <DownstreamValidationTabs />
    </div>
  );
};
