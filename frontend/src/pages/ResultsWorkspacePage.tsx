import React, { useState } from 'react';
import { Download, Sliders, ShieldCheck, Layers, FileJson, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { AIDisclaimerBadge } from '@/components/common/AIDisclaimerBadge';
import { SwipeComparisonViewer } from '@/components/map/SwipeComparisonViewer';
import { ConfidenceLayerOverlay } from '@/components/map/ConfidenceLayerOverlay';
import { MetricsGrid } from '@/components/metrics/MetricsGrid';
import { SpectralIntegrityTable } from '@/components/metrics/SpectralIntegrityTable';
import { DownstreamValidationTabs } from '@/components/metrics/DownstreamValidationTabs';
import { GeospatialExportPanel } from '@/components/analysis/GeospatialExportPanel';
import { useAnalysis } from '@/context/AnalysisContext';

export const ResultsWorkspacePage: React.FC = () => {
  const { activeDataset, activeAnalysis, exportArtifact } = useAnalysis();
  const [viewMode, setViewMode] = useState<'swipe' | 'split' | 'confidence'>('swipe');

  const viewTabs = [
    { id: 'swipe', label: 'Interactive Swipe (Original ↔ Enhanced)' },
    { id: 'split', label: 'Side-by-Side Split View' },
    { id: 'confidence', label: 'Monte-Carlo Uncertainty Layer' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Workspace Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Analysis: {activeAnalysis.title || activeDataset.name}</span>
            </h1>
            <AIDisclaimerBadge />
            <Badge variant="amber" size="sm">
              DEMO DATA
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-mono">
            Location: <span className="text-slate-900 font-semibold">{activeDataset.location}</span> | Tile ID: <span className="text-blue-700 font-semibold">{activeAnalysis.stacMetadata?.id || activeDataset.stacMetadata.id}</span> | Input: <span className="text-slate-900">{activeAnalysis.inputRes}</span> → Target: <span className="text-emerald-700 font-bold">{activeAnalysis.targetRes} ({activeAnalysis.scale})</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => exportArtifact('bundle')}
            icon={<Download className="w-4 h-4" />}
          >
            Export Result Bundle
          </Button>
        </div>
      </div>

      {/* Main Interactive Map & Comparison Viewport */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Tabs tabs={viewTabs} activeTab={viewMode} onChange={(id) => setViewMode(id as any)} />
        </div>

        <SwipeComparisonViewer mode={viewMode} />
      </div>

      {/* Scientific Validation Metrics */}
      <MetricsGrid hasHRReference={true} />

      {/* Monte-Carlo Confidence Overlay & Manual Review Risk Analysis */}
      <ConfidenceLayerOverlay />

      {/* Multispectral Integrity Table */}
      <SpectralIntegrityTable />

      {/* Downstream Task Validation */}
      <DownstreamValidationTabs />

      {/* Export System */}
      <GeospatialExportPanel />
    </div>
  );
};
