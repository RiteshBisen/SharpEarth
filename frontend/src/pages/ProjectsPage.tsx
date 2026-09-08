import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, PlusCircle, Building2, Sprout, Flame, Search, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAnalysis } from '@/context/AnalysisContext';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectDataset } = useAnalysis();

  const projects = [
    {
      id: 'proj-001',
      datasetId: 'jaipur-urban-core',
      name: 'Urban Infrastructure — Jaipur',
      location: 'Jaipur, Rajasthan, India',
      analysesCount: 12,
      lastUpdated: '2 hours ago',
      domain: 'urban',
      status: 'active',
    },
    {
      id: 'proj-002',
      datasetId: 'punjab-crop-monitoring',
      name: 'Crop Monitoring — Punjab',
      location: 'Ludhiana, Punjab, India',
      analysesCount: 8,
      lastUpdated: 'Yesterday',
      domain: 'crop',
      status: 'active',
    },
    {
      id: 'proj-003',
      datasetId: 'assam-flood-assessment',
      name: 'Flood Assessment — Assam',
      location: 'Kaziranga, Assam, India',
      analysesCount: 5,
      lastUpdated: '3 days ago',
      domain: 'disaster',
      status: 'active',
    },
  ];

  const handleOpenProject = (datasetId: string) => {
    selectDataset(datasetId);
    navigate('/app/results');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Geospatial Projects</h1>
          <p className="text-xs text-slate-500 mt-1">Organize and manage satellite image super-resolution analyses by project domain.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {projects.map((proj) => (
          <Card key={proj.id} className="p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {proj.domain === 'urban' && <Building2 className="w-5 h-5 text-blue-600" />}
                  {proj.domain === 'crop' && <Sprout className="w-5 h-5 text-emerald-600" />}
                  {proj.domain === 'disaster' && <Flame className="w-5 h-5 text-amber-700" />}
                  <span className="text-xs font-semibold text-slate-500 uppercase font-mono">{proj.domain}</span>
                </div>
                <Badge variant="emerald" size="sm">{proj.status}</Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{proj.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{proj.location}</p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{proj.analysesCount} Analyses</span>
                <span>{proj.lastUpdated}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => handleOpenProject(proj.datasetId)}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Open Project Workspace
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
