import React, { useState } from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export const AIDisclaimerBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-full text-xs font-bold text-amber-900 shadow-2xs transition-all cursor-pointer"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>AI-ENHANCED — NOT OBSERVED</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Scientific Disclaimer & Transparency"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-950">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm mb-1 text-amber-900">
                Inferred High-Resolution Spatial Detail
              </span>
              SharpEarth reconstructs high-resolution spatial detail (&lt;4 m equivalent resolution) using a hybrid deep-learning model (SwinSR-GAN). Reconstructed features are inferred from the 10 m input imagery and training data and are <strong>not directly observed satellite measurements</strong>.
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Usage Guidance</h4>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
              <li>Confidence varies spatially across every processed raster tile.</li>
              <li>Always cross-check low-confidence regions before making critical operational decisions.</li>
              <li>Radiometric and spectral integrity checks are conducted to preserve physical surface reflectance consistency.</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};
