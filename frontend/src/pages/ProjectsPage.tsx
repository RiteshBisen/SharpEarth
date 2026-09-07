import React from 'react';
import { FolderKanban, PlusCircle, Building2, Sprout, Flame, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DEMO_PROJECTS } from '@/services/demoData';

export const ProjectsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Geospatial Projects</h1>
          <p className="text-xs text-slate-500 mt-1">Organize and manage satellite image super-resolution analyses by project domain.</p>
        </div>
        <Button variant="primary" icon={<PlusCircle className="w-4 h-4" />}>
          Create New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {DEMO_PROJECTS.map((proj) => (
          <Card key={proj.id} className="p-5 space-y-4 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {proj.domain === 'urban' && <Building2 className="w-5 h-5 text-blue-600" />}
                {proj.domain === 'crop' && <Sprout className="w-5 h-5 text-emerald-600" />}
                {proj.domain === 'disaster' && <Flame className="w-5 h-5 text-amber-700" />}
                <span className="text-xs font-semibold text-slate-500 uppercase">{proj.domain}</span>
              </div>
              <Badge variant="emerald" size="sm">{proj.status}</Badge>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">{proj.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{proj.location}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 font-mono">
              <span>{proj.analysesCount} Analyses</span>
              <span>Updated {proj.lastUpdated}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
