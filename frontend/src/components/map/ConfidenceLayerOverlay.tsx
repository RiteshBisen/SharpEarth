import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { useAnalysis } from '@/context/AnalysisContext';

export interface ConfidenceLayerOverlayProps {
  confidenceThreshold?: number;
  onThresholdChange?: (value: number) => void;
  meanConfidence?: number;
  lowConfidencePercentage?: number;
}

export const ConfidenceLayerOverlay: React.FC<ConfidenceLayerOverlayProps> = ({
  confidenceThreshold: propThreshold,
  onThresholdChange,
  meanConfidence: propMean,
  lowConfidencePercentage: propLowPct,
}) => {
  const { activeAnalysis, configuration, updateConfiguration } = useAnalysis();

  const threshold = propThreshold ?? configuration.confThreshold;
  const meanConf = propMean ?? activeAnalysis.confidence; // integer 0..100
  const formattedMean = meanConf > 1 ? meanConf.toFixed(1) : (meanConf * 100).toFixed(1);
  const lowPct = propLowPct ?? activeAnalysis.lowConfidencePercentage;

  const handleSliderChange = (val: number) => {
    if (onThresholdChange) onThresholdChange(val);
    updateConfiguration({ confThreshold: val });
  };

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900">Monte-Carlo Pixel Confidence Analysis</h3>
        </div>
        <Badge variant={lowPct > 12 ? 'amber' : 'emerald'} size="sm">
          {lowPct > 12 ? 'High Manual Review Required' : 'Confidence Passed'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Mean Tile Confidence</div>
          <div className="text-xl font-bold font-mono text-blue-700">{formattedMean}%</div>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Low Confidence Area</div>
          <div className="text-xl font-bold font-mono text-amber-700">{lowPct.toFixed(1)}%</div>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Review Cutoff Limit</div>
          <div className="text-xl font-bold font-mono text-slate-900">{(threshold * 100).toFixed(0)}%</div>
        </div>
      </div>

      <Slider
        label="Highlight Detail Above Cutoff Threshold"
        valueDisplay={`${(threshold * 100).toFixed(0)}%`}
        min={0.50}
        max={0.95}
        step={0.05}
        value={threshold}
        onChange={handleSliderChange}
      />

      <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-slate-700 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          Confidence indicates how consistently SwinSR-GAN reconstructs spatial detail across <span className="font-bold text-blue-800 font-mono">N = {activeAnalysis.config.mcPasses} stochastic MC-Dropout passes</span>. Low-confidence pixels below the {(threshold * 100).toFixed(0)}% cutoff threshold require manual review.
        </div>
      </div>
    </Card>
  );
};
