import React from 'react';
import { Download, FileJson, FileText, Package, Layers } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAnalysis } from '@/context/AnalysisContext';

export const GeospatialExportPanel: React.FC = () => {
  const { activeAnalysis, exportArtifact } = useAnalysis();

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-slate-900">Export Analysis Bundle & Metadata</h3>
          <p className="text-xs text-slate-500 font-mono">
            Analysis ID: <span className="text-blue-700 font-semibold">{activeAnalysis.id}</span> | Target Res: <span className="text-emerald-700 font-semibold">{activeAnalysis.targetRes}</span>
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          STAC 1.0.0 Spec
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between hover:border-blue-300 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Enhanced Imagery COG</span>
          </div>
          <div className="text-[10px] text-slate-500">Cloud-Optimized GeoTIFF ({activeAnalysis.targetRes})</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportArtifact('cog')}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Download COG
          </Button>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between hover:border-amber-300 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Confidence Map COG</span>
          </div>
          <div className="text-[10px] text-slate-500">Pixel-Wise MC Uncertainty Raster</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportArtifact('confidence')}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Download COG
          </Button>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <FileJson className="w-4 h-4 text-purple-600" />
            <span>STAC Item Metadata</span>
          </div>
          <div className="text-[10px] text-slate-500">SpatioTemporal Asset Catalog JSON</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportArtifact('stac')}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Download STAC JSON
          </Button>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Complete Bundle</span>
          </div>
          <div className="text-[10px] text-slate-500">Rasters, STAC & Report Package</div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => exportArtifact('bundle')}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Download Bundle (.json)
          </Button>
        </div>
      </div>
    </Card>
  );
};
