import React from 'react';
import { Info, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAnalysis } from '@/context/AnalysisContext';

export interface MetricsGridProps {
  hasHRReference?: boolean;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ hasHRReference = true }) => {
  const { activeAnalysis } = useAnalysis();
  const metrics = activeAnalysis.metrics;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-slate-900">Scientific Validation Metrics</h3>
          <Badge variant="blue" size="sm">
            DEMO VALIDATION
          </Badge>
        </div>
        <Badge variant={hasHRReference ? 'emerald' : 'amber'} size="sm">
          {hasHRReference ? 'Reference-Based Metrics' : 'No Reference Mode'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* PSNR */}
        <Card className="p-4 space-y-1.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono">PSNR (Decibels)</div>
          <div className="text-xl font-bold font-mono text-blue-700">
            {hasHRReference && metrics?.psnr ? `${metrics.psnr.toFixed(2)} dB` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500 font-sans">Peak Signal-to-Noise</div>
        </Card>

        {/* SSIM */}
        <Card className="p-4 space-y-1.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono">SSIM (Structural)</div>
          <div className="text-xl font-bold font-mono text-emerald-700">
            {hasHRReference && metrics?.ssim ? metrics.ssim.toFixed(4) : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500 font-sans">Structural Similarity</div>
        </Card>

        {/* ERGAS */}
        <Card className="p-4 space-y-1.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono">ERGAS (Distortion)</div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {hasHRReference && metrics?.ergas ? metrics.ergas.toFixed(2) : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500 font-sans">Synthesis Error</div>
        </Card>

        {/* SAM */}
        <Card className="p-4 space-y-1.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono">SAM (Spectral Angle)</div>
          <div className="text-xl font-bold font-mono text-purple-700">
            {hasHRReference && metrics?.sam ? `${metrics.sam.toFixed(2)}°` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500 font-sans">Vector Angle Distortion</div>
        </Card>

        {/* NIQE */}
        <Card className="p-4 space-y-1.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono">NIQE (Perceptual)</div>
          <div className="text-xl font-bold font-mono text-amber-700">{metrics.niqe.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500 font-sans">No-Ref Naturalness</div>
        </Card>

        {/* BRISQUE */}
        <Card className="p-4 space-y-1.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono">BRISQUE (Quality)</div>
          <div className="text-xl font-bold font-mono text-blue-800">{metrics.brisque.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500 font-sans">Spatial Quality Score</div>
        </Card>
      </div>
    </div>
  );
};
