import React from 'react';
import { Info, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface MetricsGridProps {
  metrics?: {
    psnr?: number;
    ssim?: number;
    ergas?: number;
    sam?: number;
    niqe: number;
    brisque: number;
  };
  hasHRReference?: boolean;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  metrics = { niqe: 4.12, brisque: 18.5, psnr: 34.82, ssim: 0.9412, ergas: 2.31, sam: 2.84 },
  hasHRReference = true,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Scientific Validation Metrics</h3>
        <Badge variant={hasHRReference ? 'emerald' : 'amber'} size="sm">
          {hasHRReference ? 'HR Reference Available' : 'No Reference Mode'}
        </Badge>
      </div>

      {!hasHRReference && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-950 block mb-0.5">Reference Imagery Unavailable</span>
            No co-located high-resolution reference imagery was available for this geographic tile. Reference-based accuracy metrics (PSNR, SSIM, ERGAS, SAM) are therefore not reported to preserve scientific rigor.
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* PSNR */}
        <Card className="p-4 space-y-1.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">PSNR (Decibels)</div>
          <div className="text-xl font-bold font-mono text-blue-700">
            {hasHRReference && metrics?.psnr ? `${metrics.psnr.toFixed(2)} dB` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500">Peak Signal-to-Noise</div>
        </Card>

        {/* SSIM */}
        <Card className="p-4 space-y-1.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">SSIM (Structural)</div>
          <div className="text-xl font-bold font-mono text-emerald-700">
            {hasHRReference && metrics?.ssim ? metrics.ssim.toFixed(4) : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500">Structural Similarity</div>
        </Card>

        {/* ERGAS */}
        <Card className="p-4 space-y-1.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">ERGAS (Distortion)</div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {hasHRReference && metrics?.ergas ? metrics.ergas.toFixed(2) : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500">Synthesis Error</div>
        </Card>

        {/* SAM */}
        <Card className="p-4 space-y-1.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">SAM (Spectral Angle)</div>
          <div className="text-xl font-bold font-mono text-purple-700">
            {hasHRReference && metrics?.sam ? `${metrics.sam.toFixed(2)}°` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500">Vector Angle Distortion</div>
        </Card>

        {/* NIQE */}
        <Card className="p-4 space-y-1.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-sans">NIQE (Perceptual)</div>
          <div className="text-xl font-bold font-mono text-amber-700">{metrics.niqe.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500">No-Ref Naturalness</div>
        </Card>

        {/* BRISQUE */}
        <Card className="p-4 space-y-1.5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-sans">BRISQUE (Quality)</div>
          <div className="text-xl font-bold font-mono text-blue-800">{metrics.brisque.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500">Spatial Quality Score</div>
        </Card>
      </div>
    </div>
  );
};
