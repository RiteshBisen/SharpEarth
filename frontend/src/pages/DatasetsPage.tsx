import React from 'react';
import { Database, Search, Filter, Globe, Layers } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const DatasetsPage: React.FC = () => {
  const datasets = [
    { id: 'DS-001', name: 'Sentinel-2 L2A Jaipur Core', tile: '32TQD', cloud: '4.2%', res: '10 m', bands: 'RGB + NIR' },
    { id: 'DS-002', name: 'Sentinel-2 L2A Punjab Fields', tile: '43RQS', cloud: '2.1%', res: '10 m', bands: 'RGB + NIR' },
    { id: 'DS-003', name: 'Sentinel-2 L2A Assam River', tile: '46REQ', cloud: '8.7%', res: '10 m', bands: 'RGB + NIR' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Earth Observation Datasets</h1>
        <p className="text-xs text-slate-500 mt-1">Browse Sentinel-2 L2A catalog tiles and pre-processed satellite rasters.</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[10px] font-mono">
            <tr>
              <th className="p-3.5">Dataset Name & Tile ID</th>
              <th className="p-3.5">Satellite</th>
              <th className="p-3.5">Resolution</th>
              <th className="p-3.5">Cloud Cover</th>
              <th className="p-3.5">Bands</th>
              <th className="p-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {datasets.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-sans font-bold text-slate-900">{d.name} <span className="block text-[10px] text-slate-500 font-mono">{d.tile}</span></td>
                <td className="p-3.5 text-slate-600 font-sans">Sentinel-2 L2A</td>
                <td className="p-3.5 text-blue-700 font-bold">{d.res}</td>
                <td className="p-3.5 text-slate-700">{d.cloud}</td>
                <td className="p-3.5 text-slate-600 font-sans">{d.bands}</td>
                <td className="p-3.5 text-right"><Badge variant="emerald" size="sm">Indexed</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
