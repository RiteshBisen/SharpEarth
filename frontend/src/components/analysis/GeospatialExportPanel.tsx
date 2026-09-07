import React from 'react';
import { Download, FileJson, FileText, Package, Layers } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const GeospatialExportPanel: React.FC = () => {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Export Analysis Bundle & Metadata</h3>
        <span className="text-xs text-slate-500 font-mono">STAC 1.0.0 Compliant</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Enhanced Imagery COG</span>
          </div>
          <div className="text-[10px] text-slate-500">Cloud-Optimized GeoTIFF (&lt;4 m)</div>
          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
            Download COG
          </Button>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Confidence Map COG</span>
          </div>
          <div className="text-[10px] text-slate-500">Pixel-Wise MC Uncertainty Raster</div>
          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
            Download COG
          </Button>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <FileJson className="w-4 h-4 text-purple-600" />
            <span>STAC Item Metadata</span>
          </div>
          <div className="text-[10px] text-slate-500">SpatioTemporal Asset Catalog JSON</div>
          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
            Download STAC JSON
          </Button>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Complete Bundle</span>
          </div>
          <div className="text-[10px] text-slate-500">All Rasters, STAC & Report Package</div>
          <Button variant="primary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
            Download Bundle (.zip)
          </Button>
        </div>
      </div>
    </Card>
  );
};
