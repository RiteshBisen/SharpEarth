import React from 'react';
import { Layers, Activity, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const SpectralIntegrityTable: React.FC = () => {
  const bands = [
    { name: 'Red (B4)', inputVal: '0.183', enhancedVal: '0.181', delta: '-1.1%', status: 'optimal' },
    { name: 'Green (B3)', inputVal: '0.217', enhancedVal: '0.220', delta: '+1.4%', status: 'optimal' },
    { name: 'Blue (B2)', inputVal: '0.145', enhancedVal: '0.146', delta: '+0.7%', status: 'optimal' },
    { name: 'NIR (B8)', inputVal: '0.512', enhancedVal: '0.509', delta: '-0.6%', status: 'optimal' },
  ];

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Multispectral Integrity & Reflectance Delta</h3>
        </div>
        <Badge variant="emerald" size="sm">Spectral Consistency Passed</Badge>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 font-semibold text-[10px] font-mono">
            <tr>
              <th className="p-3">Band Name</th>
              <th className="p-3">Input Observed (10 m)</th>
              <th className="p-3">AI-Enhanced (4.0 m)</th>
              <th className="p-3">Reflectance Delta (Δ)</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {bands.map((b) => (
              <tr key={b.name} className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-sans font-semibold text-slate-900">{b.name}</td>
                <td className="p-3 text-slate-600">{b.inputVal}</td>
                <td className="p-3 text-blue-700 font-bold">{b.enhancedVal}</td>
                <td className="p-3 text-emerald-700 font-semibold">{b.delta}</td>
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

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>NDVI Index Drift: <strong className="text-slate-900">0.003</strong> | NDWI Index Drift: <strong className="text-slate-900">0.001</strong></span>
        </div>
        <Badge variant="blue" size="sm">SAM Angular Loss &lt; 3.0°</Badge>
      </div>
    </Card>
  );
};
