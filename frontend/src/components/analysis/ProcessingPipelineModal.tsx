import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Loader2,
  Cpu,
  Terminal,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface ProcessingPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  tileId: string;
}

export const ProcessingPipelineModal: React.FC<ProcessingPipelineModalProps> = ({
  isOpen,
  onClose,
  tileId,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showLogs, setShowLogs] = useState(false);

  const steps = [
    { title: 'Data acquisition', desc: 'Sentinel-2 L2A tile fetched' },
    { title: 'Cloud & shadow masking', desc: 'SCL + s2cloudless filter' },
    { title: 'Sub-pixel co-registration', desc: 'Phase correlation alignment' },
    { title: 'Patch extraction', desc: 'Overlapping 64x64 patches' },
    { title: 'SwinSR-GAN inference', desc: 'RRDB + Swin Transformer 4x upsampling' },
    { title: 'Uncertainty estimation', desc: 'MC-Dropout stochastic passes (N=10)' },
    { title: 'Scientific validation', desc: 'PSNR, SSIM, ERGAS, SAM calculation' },
    { title: 'COG & STAC packaging', desc: 'Preserving CRS & GeoTransform' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen]);

  const isComplete = currentStep === steps.length - 1;
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);

  const handleFinish = () => {
    onClose();
    navigate('/app/results');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Processing Super-Resolution Analysis" maxWidth="xl">
      <div className="space-y-6">
        {/* Status Bar Header */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <div className="text-xs text-slate-500 font-mono">Target Tile ID: <span className="text-blue-700 font-bold">{tileId}</span></div>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">
              {isComplete ? 'Analysis Pipeline Completed' : `Executing Stage: ${steps[currentStep].title}`}
            </div>
          </div>
          <Badge variant={isComplete ? 'emerald' : 'blue'}>
            {isComplete ? 'Ready' : `${progressPercent}%`}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist */}
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {steps.map((step, idx) => {
            const isStepDone = idx < currentStep || isComplete;
            const isStepCurrent = idx === currentStep && !isComplete;

            return (
              <div
                key={step.title}
                className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
                  isStepDone
                    ? 'bg-white border-slate-200 text-slate-700'
                    : isStepCurrent
                    ? 'bg-blue-50 border-blue-200 text-blue-950 font-medium shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isStepDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isStepCurrent ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-900">{step.title}</div>
                    <div className="text-[10px] text-slate-500">{step.desc}</div>
                  </div>
                </div>

                {isStepCurrent && <Badge variant="blue" size="sm">Active</Badge>}
              </div>
            );
          })}
        </div>

        {/* Log Viewer Toggle */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-medium"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{showLogs ? 'Hide Technical Logs' : 'View Technical Logs'}</span>
          </button>

          {isComplete && (
            <Button variant="primary" onClick={handleFinish} icon={<ArrowRight className="w-4 h-4" />}>
              Open Results Workspace
            </Button>
          )}
        </div>

        {/* Technical Logs Box */}
        {showLogs && (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-mono text-emerald-400 max-h-36 overflow-y-auto space-y-1">
            <div>[INFO] PyTorch CUDA Device: NVIDIA A10G (24GB)</div>
            <div>[INFO] Loading SwinSR-GAN weights from configs/sharpearth_swinsr_gan.pth</div>
            <div>[INFO] Performing 10 MC-Dropout stochastic forward passes...</div>
            <div>[INFO] Pixel-wise variance mean: 0.0124 | Normalized confidence: 88.5%</div>
            <div>[INFO] Exported Cloud-Optimized GeoTIFF: data/processed/demo_32tqd_SR_COG.tif</div>
            <div>[INFO] STAC Item JSON written: data/processed/demo_32tqd_STAC.json</div>
          </div>
        )}
      </div>
    </Modal>
  );
};
