import React, { useState } from 'react';
import {
  MapPin,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Layers,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Info,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { ProcessingPipelineModal } from '@/components/analysis/ProcessingPipelineModal';

export const NewAnalysisPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessingOpen, setIsProcessingOpen] = useState(false);

  // Form State
  const [dataSource, setDataSource] = useState<'sample' | 'upload' | 'aoi'>('sample');
  const [tileId, setTileId] = useState('S2B_MSIL2A_32TQD_20240520');
  const [targetRes, setTargetRes] = useState<number>(4.0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mcPasses, setMcPasses] = useState<number>(10);
  const [confThreshold, setConfThreshold] = useState<number>(0.75);

  const wizardSteps = [
    { id: 1, name: 'Area & Data', icon: MapPin },
    { id: 2, name: 'Enhancement', icon: Sliders },
    { id: 3, name: 'Quality & Uncertainty', icon: ShieldCheck },
    { id: 4, name: 'Review', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configure New Analysis</h1>
        <p className="text-xs text-slate-500 mt-1">
          Set up Sentinel-2 super-resolution pipeline parameters and uncertainty quantification.
        </p>
      </div>

      {/* Step Stepper Header */}
      <div className="grid grid-cols-4 gap-2 bg-slate-100 p-1.5 border border-slate-200 rounded-xl">
        {wizardSteps.map((step) => {
          const isActive = currentStep === step.id;
          const isDone = currentStep > step.id;

          return (
            <button
              key={step.id}
              onClick={() => isDone && setCurrentStep(step.id)}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDone
                  ? 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 cursor-pointer'
                  : 'text-slate-400 cursor-not-allowed'
              }`}
            >
              <step.icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{step.name}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: Area & Data Selection */}
      {currentStep === 1 && (
        <Card className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Step 1 — Input Data & Region Selection</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select a Sentinel-2 L2A raster or specify geographic Area of Interest (AOI).</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setDataSource('sample')}
              className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                dataSource === 'sample'
                  ? 'bg-blue-50/70 border-blue-600 text-blue-950'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Globe className="w-5 h-5 text-blue-600" />
              <div className="font-bold text-xs text-slate-900">Sample Scene</div>
              <div className="text-[10px] text-slate-500">Pre-cached Sentinel-2 32TQD Jaipur tile</div>
            </button>

            <button
              onClick={() => setDataSource('upload')}
              className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                dataSource === 'upload'
                  ? 'bg-blue-50/70 border-blue-600 text-blue-950'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Upload className="w-5 h-5 text-emerald-600" />
              <div className="font-bold text-xs text-slate-900">Upload GeoTIFF</div>
              <div className="text-[10px] text-slate-500">Upload 10 m Sentinel-2 multispectral raster</div>
            </button>

            <button
              onClick={() => setDataSource('aoi')}
              className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                dataSource === 'aoi'
                  ? 'bg-blue-50/70 border-blue-600 text-blue-950'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <MapPin className="w-5 h-5 text-amber-600" />
              <div className="font-bold text-xs text-slate-900">Interactive AOI Map</div>
              <div className="text-[10px] text-slate-500">Draw bounding box / upload GeoJSON</div>
            </button>
          </div>

          {dataSource === 'sample' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">Select Sample Tile ID</label>
              <select
                value={tileId}
                onChange={(e) => setTileId(e.target.value)}
                className="w-full bg-white border border-slate-300 text-xs text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-blue-600"
              >
                <option value="S2B_MSIL2A_32TQD_20240520">Jaipur Urban Core (Tile 32TQD - 2024-05-20)</option>
                <option value="S2A_MSIL2A_43RQS_20240518">Punjab Wheat Agricultural (Tile 43RQS - 2024-05-18)</option>
                <option value="S2B_MSIL2A_46REQ_20240512">Assam Brahmaputra River (Tile 46REQ - 2024-05-12)</option>
              </select>
            </div>
          )}

          {dataSource === 'upload' && (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3 hover:border-slate-400 transition-colors bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-medium text-slate-700">Drag & drop Sentinel-2 GeoTIFF (.tif) here</div>
              <div className="text-[10px] text-slate-500">Supports 4-band RGB+NIR surface reflectance rasters</div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={() => setCurrentStep(2)} icon={<ArrowRight className="w-4 h-4" />}>
              Next: Enhancement Config
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Enhancement Scale & Model Configuration */}
      {currentStep === 2 && (
        <Card className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Step 2 — Target Spatial Resolution & Model</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select output spatial resolution factor for the SwinSR-GAN generator.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[2.5, 3.0, 4.0].map((res) => (
              <button
                key={res}
                onClick={() => setTargetRes(res)}
                className={`p-4 rounded-xl border text-center space-y-1 transition-all cursor-pointer ${
                  targetRes === res
                    ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="text-xl font-bold font-mono text-slate-900">{res} m</div>
                <div className="text-[10px] text-slate-500">
                  {res === 4.0 ? 'Default Target (<4 m Scale)' : `${(10 / res).toFixed(1)}x Scale`}
                </div>
              </button>
            ))}
          </div>

          {/* Advanced ML Collapsible */}
          <div className="pt-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-medium text-blue-600 flex items-center gap-1.5 hover:underline"
            >
              {showAdvanced ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span>Advanced ML Architecture Configuration</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-600 block mb-1">RRDB Trunk Blocks</label>
                    <input type="number" defaultValue={4} readOnly className="w-full bg-white border border-slate-300 p-2 rounded text-slate-800 font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Swin Transformer Blocks</label>
                    <input type="number" defaultValue={2} readOnly className="w-full bg-white border border-slate-300 p-2 rounded text-slate-800 font-mono" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setCurrentStep(3)} icon={<ArrowRight className="w-4 h-4" />}>
              Next: Uncertainty & Risk
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Quality & Uncertainty Quantification */}
      {currentStep === 3 && (
        <Card className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Step 3 — Monte-Carlo Uncertainty Quantification</h3>
            <p className="text-xs text-slate-500 mt-0.5">Configure stochastic inference passes and manual review risk cutoff.</p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Uncertainty Calibration</span>
              Higher uncertainty indicates regions where reconstructed detail may be less reliable across stochastic forward passes.
            </div>
          </div>

          <div className="space-y-5">
            <Slider
              label="Monte-Carlo Dropout Forward Passes (N)"
              valueDisplay={`${mcPasses} Passes`}
              min={3}
              max={20}
              step={1}
              value={mcPasses}
              onChange={setMcPasses}
            />

            <Slider
              label="Confidence Threshold Cutoff (Manual Review Limit)"
              valueDisplay={`${(confThreshold * 100).toFixed(0)}%`}
              min={0.50}
              max={0.95}
              step={0.05}
              value={confThreshold}
              onChange={setConfThreshold}
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setCurrentStep(4)} icon={<ArrowRight className="w-4 h-4" />}>
              Next: Final Review
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: Review & Run Super-Resolution */}
      {currentStep === 4 && (
        <Card className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Step 4 — Final Analysis Review</h3>
            <p className="text-xs text-slate-500 mt-0.5">Verify parameters before executing PyTorch SwinSR-GAN super-resolution.</p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Source Raster</span>
                <span className="font-semibold text-slate-900">Sentinel-2 L2A</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Input Resolution</span>
                <span className="font-semibold text-slate-900 font-mono">10.0 m</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Target Resolution</span>
                <span className="font-semibold text-blue-700 font-mono">{targetRes} m equivalent</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Bands Processed</span>
                <span className="font-semibold text-slate-900">RGB + NIR (4 Bands)</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Cloud Masking</span>
                <Badge variant="emerald" size="sm">Enabled (SCL)</Badge>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block">MC Dropout Passes</span>
                <span className="font-semibold text-blue-700 font-mono">N = {mcPasses}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStep(3)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsProcessingOpen(true)}
              icon={<CheckCircle2 className="w-5 h-5" />}
            >
              Run Super-Resolution
            </Button>
          </div>
        </Card>
      )}

      {/* Processing Pipeline Modal */}
      <ProcessingPipelineModal
        isOpen={isProcessingOpen}
        onClose={() => setIsProcessingOpen(false)}
        tileId={tileId}
      />
    </div>
  );
};

