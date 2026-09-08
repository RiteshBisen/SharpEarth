import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  PlusCircle,
  Activity,
  Layers,
  ShieldCheck,
  Building2,
  Sprout,
  Flame,
  ArrowUpRight,
  MapPin,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAnalysis } from '@/context/AnalysisContext';
import { ALL_DATASETS } from '@/data/datasets';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysisHistory, selectAnalysis, selectDataset } = useAnalysis();

  const handleViewAnalysis = (id: string) => {
    selectAnalysis(id);
    navigate('/app/results');
  };

  const handleSelectDataset = (id: string) => {
    selectDataset(id);
    navigate('/app/results');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">SharpEarth Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Super-resolution mapping for Earth observation imagery & uncertainty quantification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/app/new-analysis">
            <Button variant="primary" icon={<PlusCircle className="w-4 h-4" />}>
              Start New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* System Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-slate-900">
                1,420
              </span>
              <Badge variant="amber" size="sm">DEMO DATA</Badge>
            </div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Processed Tiles</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-emerald-700">
                2.5 m
              </span>
            </div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Avg Output Res</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-blue-700">
                91.4%
              </span>
            </div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Mean Confidence</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-slate-900">
                98.2%
              </span>
            </div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Validated Tiles</div>
          </div>
        </Card>
      </div>

      {/* Featured Location Datasets Catalog */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Flagship & Location Datasets</h3>
          <Link to="/app/datasets" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold">
            View All Catalog Tiles <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ALL_DATASETS.slice(0, 3).map((ds) => (
            <Card key={ds.id} className="p-4 space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {ds.domain === 'urban' && <Building2 className="w-4 h-4 text-blue-600" />}
                    {ds.domain === 'crop' && <Sprout className="w-4 h-4 text-emerald-600" />}
                    {ds.domain === 'flood' && <Flame className="w-4 h-4 text-amber-700" />}
                    <span className="text-[10px] font-semibold text-slate-500 uppercase font-mono">{ds.domain}</span>
                  </div>
                  <Badge variant="emerald" size="sm">Sentinel-2 L2A</Badge>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{ds.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{ds.location}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-blue-700 font-semibold">{ds.inputRes} → {ds.defaultTargetRes}</span>
                <Button variant="secondary" size="sm" onClick={() => handleSelectDataset(ds.id)}>
                  View Workspace
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Super-Resolution Runs</h3>
          <span className="text-xs text-slate-500 font-mono">{analysisHistory.length} active runs in history</span>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[10px] font-mono">
                <tr>
                  <th className="p-3">Analysis & Location</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Source & Scale</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {analysisHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.location}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{item.date}</td>
                    <td className="p-3">
                      <span className="text-slate-900 font-medium">{item.source}</span>
                      <div className="text-[10px] text-blue-700 font-mono">{item.inputRes} → {item.targetRes} ({item.scale})</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-700">
                      {item.confidence}%
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          item.status === 'completed'
                            ? 'emerald'
                            : item.status === 'low_confidence'
                            ? 'amber'
                            : 'slate'
                        }
                        size="sm"
                      >
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewAnalysis(item.id)}
                      >
                        View Workspace
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
