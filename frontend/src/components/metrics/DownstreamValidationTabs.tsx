import React, { useState } from 'react';
import { Building2, Sprout, Milestone, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';

export const DownstreamValidationTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('classification');

  const tabItems = [
    { id: 'classification', label: 'Classification Accuracy', icon: <Sprout className="w-3.5 h-3.5" /> },
    { id: 'roads', label: 'Road Network', icon: <Milestone className="w-3.5 h-3.5" /> },
    { id: 'buildings', label: 'Building Footprints', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'change', label: 'Change Detection', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  return (
    <Card className="space-y-5 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900">Downstream Workflow Utility Validation</h3>
        <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === 'classification' && (
        <div className="space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Random Forest Overall Accuracy</span>
              <div className="text-xl font-bold font-mono text-emerald-700">94.2%</div>
              <div className="text-[10px] text-slate-500">Evaluated on 4 Land-Cover Classes</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Cohen's Kappa Coefficient</span>
              <div className="text-xl font-bold font-mono text-blue-700">0.892</div>
              <div className="text-[10px] text-slate-500">High Inter-Rater Agreement</div>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Land-cover classification performance evaluated using a Random Forest classifier trained on spectral features. The AI-enhanced raster improves urban boundary discrimination without introducing spectral classification errors.
          </p>
        </div>
      )}

      {activeTab === 'roads' && (
        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="font-medium text-slate-900">Road Edge Gradient Continuity Score</span>
            <span className="font-mono font-bold text-blue-700 text-sm">0.88 / 1.0</span>
          </div>
          <p className="text-slate-600">Linear feature continuity verified against OpenStreetMap (OSM) road vector network geometries.</p>
        </div>
      )}

      {activeTab === 'buildings' && (
        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="font-medium text-slate-900">Building Footprint Shape Consistency</span>
            <span className="font-mono font-bold text-emerald-700 text-sm">0.91 / 1.0</span>
          </div>
          <p className="text-slate-600">Cadastral polygon overlap check shows sharp structural edge preservation without blur artifacts.</p>
        </div>
      )}

      {activeTab === 'change' && (
        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="font-medium text-slate-900">False Temporal Change Anomaly Risk</span>
            <Badge variant="emerald" size="sm">No False Changes Introduced</Badge>
          </div>
          <p className="text-slate-600">Multi-temporal consistency check across paired dates confirms super-resolution does not introduce artificial temporal changes.</p>
        </div>
      )}
    </Card>
  );
};
