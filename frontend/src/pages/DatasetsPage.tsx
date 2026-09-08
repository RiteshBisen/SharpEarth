import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Search, Filter, Globe, Layers, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAnalysis } from '@/context/AnalysisContext';
import { ALL_DATASETS } from '@/data/datasets';

export const DatasetsPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectDataset } = useAnalysis();

  const handleSelectAndOpen = (id: string) => {
    selectDataset(id);
    navigate('/app/results');
  };

  const handleSelectAndConfigure = (id: string) => {
    selectDataset(id);
    navigate('/app/new-analysis');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Earth Observation Datasets Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Browse Sentinel-2 L2A catalog tiles and location-specific satellite rasters.</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[10px] font-mono">
            <tr>
              <th className="p-3.5">Dataset Name & Location</th>
              <th className="p-3.5">STAC Tile ID</th>
              <th className="p-3.5">Satellite & Res</th>
              <th className="p-3.5">Cloud Cover</th>
              <th className="p-3.5">Target Res</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {ALL_DATASETS.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.thumbnailColor }} />
                    <span className="font-bold text-slate-900">{d.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono pl-4">{d.location}</div>
                </td>
                <td className="p-3.5 font-mono text-slate-600 text-[11px]">{d.stacMetadata.id}</td>
                <td className="p-3.5 font-mono text-slate-600">
                  <span className="text-slate-900 font-semibold">{d.source}</span> (10 m)
                </td>
                <td className="p-3.5 font-mono text-slate-700">{d.cloudCover}%</td>
                <td className="p-3.5 font-mono text-blue-700 font-bold">{d.defaultTargetRes}</td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleSelectAndConfigure(d.id)}>
                      Configure
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleSelectAndOpen(d.id)}>
                      View Workspace
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
