import React, { useState } from 'react';
import {
  MapPin,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  Info,
  Globe,
  ChevronDown,
  ChevronRight,
  Layers,
  Building2,
  Sprout,
  Flame,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { ProcessingPipelineModal } from '@/components/analysis/ProcessingPipelineModal';
import { useAnalysis } from '@/context/AnalysisContext';
import { ALL_DATASETS } from '@/data/datasets';

export const NewAnalysisPage: React.FC = () => {
  const { activeDataset, selectDataset, configuration, updateConfiguration } = useAnalysis();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessingOpen, setIsProcessingOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const wizardSteps = [
    { id: 1, name: 'Location & Dataset', icon: MapPin },
    { id: 2, name: 'Resolution Scale', icon: Sliders },
    { id: 3, name: 'Quality & Uncertainty', icon: ShieldCheck },
    { id: 4, name: 'Review & Run', icon: CheckCircle2 },
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

      {/* STEP 1: Area & Location Selection */}
      {currentStep === 1 && (
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 1 — Select Location & Dataset</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose a location-specific Sentinel-2 L2A raster dataset from our catalog.
              </p>
            </div>
            <Badge variant="blue" size="sm">
              Selected: {activeDataset.name}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {ALL_DATASETS.map((ds) => {
              const isSelected = activeDataset.id === ds.id;
              const isJaipurFlagship = ds.id.includes('jaipur');

              return (
                <button
                  key={ds.id}
                  onClick={() => selectDataset(ds.id)}
                  className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-500 text-blue-950 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: ds.thumbnailColor }}
                      />
                      <span className="font-bold text-xs text-slate-900">{ds.name}</span>
                    </div>

                    {isJaipurFlagship && (
                      <Badge variant="amber" size="sm">
                        Flagship Demo
                      </Badge>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2">{ds.description}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100 font-mono">
                    <span>{ds.location}</span>
                    <span className="text-blue-700 font-semibold">{ds.inputRes} → {ds.defaultTargetRes}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              variant="primary"
              onClick={() => setCurrentStep(2)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Next: Resolution Scale
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Enhancement Scale & Model Configuration */}
      {currentStep === 2 && (
        <Card className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Step 2 — Target Spatial Resolution & Model</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select output spatial resolution scale factor for the SwinSR-GAN generator.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[2.5, 3.0, 4.0].map((res) => {
              const isSelected = configuration.targetRes === res;

              return (
                <button
                  key={res}
                  onClick={() => updateConfiguration({ targetRes: res })}
                  className={`p-4 rounded-xl border text-center space-y-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xl font-bold font-mono text-slate-900">{res} m</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {(10 / res).toFixed(1)}x Upsampling Scale
                  </div>
                </button>
              );
            })}
          </div>

          {/* Advanced ML Collapsible */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-medium text-blue-600 flex items-center gap-1.5 hover:underline"
            >
              {showAdvanced ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span>Advanced ML Model Weights Configuration</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Model Architecture</label>
                    <select
                      value={configuration.modelArch}
                      onChange={(e) => updateConfiguration({ modelArch: e.target.value as any })}
                      className="w-full bg-white border border-slate-300 p-2 rounded text-slate-800 font-mono"
                    >
                      <option value="SwinSR-GAN">SwinSR-GAN (Hybrid Swin + RRDB)</option>
                      <option value="RRDB-Net">RRDB-Net (Residual-in-Residual)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1 font-semibold">Cloud Masking (SCL Filter)</label>
                    <button
                      onClick={() => updateConfiguration({ cloudMasking: !configuration.cloudMasking })}
                      className={`w-full p-2 rounded border font-mono font-semibold text-left ${
                        configuration.cloudMasking ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {configuration.cloudMasking ? 'Enabled (Mask SCL Class 8,9,10)' : 'Disabled'}
                    </button>
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
            <p className="text-xs text-slate-500 mt-0.5">
              Configure stochastic forward passes and manual review risk cutoff threshold.
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Uncertainty Calibration</span>
              Higher stochastic passes increase variance estimate precision across edge structures, cloud shadows, and ambiguous textures.
            </div>
          </div>

          <div className="space-y-5">
            <Slider
              label="Monte-Carlo Dropout Forward Passes (N)"
              valueDisplay={`${configuration.mcPasses} Passes`}
              min={3}
              max={20}
              step={1}
              value={configuration.mcPasses}
              onChange={(val) => updateConfiguration({ mcPasses: val })}
            />

            <Slider
              label="Confidence Threshold Cutoff (Manual Review Limit)"
              valueDisplay={`${(configuration.confThreshold * 100).toFixed(0)}%`}
              min={0.50}
              max={0.95}
              step={0.05}
              value={configuration.confThreshold}
              onChange={(val) => updateConfiguration({ confThreshold: val })}
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
            <p className="text-xs text-slate-500 mt-0.5">
              Verify parameters before executing PyTorch SwinSR-GAN super-resolution.
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-mono">Target Location</span>
                <span className="font-bold text-slate-900">{activeDataset.name}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-mono">Input Resolution</span>
                <span className="font-semibold text-slate-900 font-mono">10.0 m</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-mono">Target Resolution</span>
                <span className="font-semibold text-blue-700 font-mono">{configuration.targetRes} m equivalent</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-mono">Bands Processed</span>
                <span className="font-semibold text-slate-900">RGB + NIR (4 Bands)</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-mono">Cloud Masking</span>
                <Badge variant={configuration.cloudMasking ? 'emerald' : 'slate'} size="sm">
                  {configuration.cloudMasking ? 'Enabled (SCL)' : 'Disabled'}
                </Badge>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-mono">MC Dropout Passes</span>
                <span className="font-semibold text-blue-700 font-mono">N = {configuration.mcPasses}</span>
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
        tileId={activeDataset.stacMetadata.id}
        datasetId={activeDataset.id}
      />
    </div>
  );
};
