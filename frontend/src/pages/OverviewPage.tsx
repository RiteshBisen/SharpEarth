import React from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DEMO_PROJECTS, DEMO_ANALYSES, DEMO_SYSTEM_METRICS } from '@/services/demoData';

export const OverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">SharpEarth</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Super-resolution mapping for Earth observation imagery.
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
                {DEMO_SYSTEM_METRICS.processedTiles.toLocaleString()}
              </span>
              {DEMO_SYSTEM_METRICS.isDemoData && (
                <Badge variant="amber" size="sm">Demo Data</Badge>
              )}
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
                {DEMO_SYSTEM_METRICS.averageResolution}
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
                {DEMO_SYSTEM_METRICS.averageConfidence}%
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
                {DEMO_SYSTEM_METRICS.validatedTilesPercentage}%
              </span>
            </div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Validated Tiles</div>
          </div>
        </Card>
      </div>

      {/* Active Projects */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active Projects</h3>
          <Link to="/app/projects" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold">
            View All Projects <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_PROJECTS.map((proj) => (
            <Card key={proj.id} className="p-4 space-y-3 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {proj.domain === 'urban' && <Building2 className="w-4 h-4 text-blue-600" />}
                  {proj.domain === 'crop' && <Sprout className="w-4 h-4 text-emerald-600" />}
                  {proj.domain === 'disaster' && <Flame className="w-4 h-4 text-amber-700" />}
                  <span className="text-[10px] font-semibold text-slate-500 uppercase font-mono">{proj.domain}</span>
                </div>
                <Badge variant={proj.status === 'active' ? 'emerald' : 'slate'} size="sm">
                  {proj.status}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{proj.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{proj.location}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2.5 border-t border-slate-100 font-mono">
                <span>{proj.analysesCount} Analyses</span>
                <span>{proj.lastUpdated}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Analyses</h3>
          <span className="text-xs text-slate-500">3 recent Sentinel-2 super-resolution runs</span>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[10px] font-mono">
                <tr>
                  <th className="p-3">Analysis & Location</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Source & Res</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {DEMO_ANALYSES.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.location}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{item.date}</td>
                    <td className="p-3">
                      <span className="text-slate-900 font-medium">{item.source}</span>
                      <div className="text-[10px] text-blue-700 font-mono">{item.inputRes} → {item.targetRes}</div>
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
                      <Link to="/app/results">
                        <Button variant="secondary" size="sm">View Workspace</Button>
                      </Link>
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
