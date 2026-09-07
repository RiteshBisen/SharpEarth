import React, { useState } from 'react';
import { Download, Sliders, ShieldCheck, Layers, FileJson, Sparkles } from 'lucide-react';
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

export const ResultsWorkspacePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'swipe' | 'split' | 'confidence'>('swipe');
  const [confThreshold, setConfThreshold] = useState<number>(0.75);

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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Analysis: Urban Infrastructure — Jaipur
            </h1>
            <AIDisclaimerBadge />
          </div>
          <p className="text-xs text-slate-500 font-mono">
            Tile ID: <span className="text-blue-700 font-semibold">S2B_MSIL2A_32TQD_20240520</span> | Input: 10 m → Target: <span className="text-emerald-700 font-semibold">4 m equivalent</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" icon={<Download className="w-4 h-4" />}>
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
      <ConfidenceLayerOverlay
        confidenceThreshold={confThreshold}
        onThresholdChange={setConfThreshold}
        meanConfidence={0.885}
        lowConfidencePercentage={8.4}
      />

      {/* Multispectral Integrity Table */}
      <SpectralIntegrityTable />

      {/* Downstream Task Validation */}
      <DownstreamValidationTabs />

      {/* Export System */}
      <GeospatialExportPanel />
    </div>
  );
};
