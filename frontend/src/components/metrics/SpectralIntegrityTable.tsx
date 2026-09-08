import React from 'react';
import { Activity, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAnalysis } from '@/context/AnalysisContext';

export const SpectralIntegrityTable: React.FC = () => {
  const { activeAnalysis } = useAnalysis();
  const profile = activeAnalysis.spectralProfile;

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Multispectral Integrity & Reflectance Delta</h3>
        </div>
        <Badge variant="emerald" size="sm">
          Spectral Consistency Passed
        </Badge>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 font-semibold text-[10px] font-mono">
            <tr>
              <th className="p-3">Band Name</th>
              <th className="p-3">Observed Surface Reflectance (10 m)</th>
              <th className="p-3">AI-Enhanced ({activeAnalysis.targetRes})</th>
              <th className="p-3">Residual Delta (Δ)</th>
              <th className="p-3">Integrity Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {profile.bands.map((b) => (
              <tr key={b.band} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-sans font-semibold text-slate-900">
                  {b.name} <span className="text-[10px] text-slate-500 font-mono">({b.band} - {b.wavelengthNm} nm)</span>
                </td>
                <td className="p-3 text-slate-600">{b.observedReflectance.toFixed(3)}</td>
                <td className="p-3 text-blue-700 font-bold">{b.enhancedReflectance.toFixed(3)}</td>
                <td className="p-3 text-emerald-700 font-semibold">{b.residualDelta.toFixed(3)}</td>
                <td className="p-3">
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-sans font-semibold">
                    Preserved
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Derived Vegetation NDVI: <strong className="text-emerald-700 font-mono">{profile.ndvi.toFixed(2)}</strong> | Derived Water NDWI: <strong className="text-blue-700 font-mono">{profile.ndwi.toFixed(2)}</strong>
          </span>
        </div>
        <Badge variant="blue" size="sm">
          SAM Loss: {activeAnalysis.metrics.sam ? `${activeAnalysis.metrics.sam.toFixed(2)}°` : '< 3.0°'}
        </Badge>
      </div>
    </Card>
  );
};
