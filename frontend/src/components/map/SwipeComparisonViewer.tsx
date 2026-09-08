import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Eye, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAnalysis } from '@/context/AnalysisContext';
import { getSatelliteRasterDataUrl } from '@/services/satelliteRasterGenerator';

export interface SwipeComparisonViewerProps {
  mode?: 'swipe' | 'split' | 'confidence' | 'reference';
  confidenceThreshold?: number;
}

export const SwipeComparisonViewer: React.FC<SwipeComparisonViewerProps> = ({
  mode = 'swipe',
  confidenceThreshold = 0.75,
}) => {
  const { activeDataset, activeAnalysis } = useAnalysis();

  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullWidth, setIsFullWidth] = useState<boolean>(false);
  const [subMode, setSubMode] = useState<'enhanced' | 'degraded' | 'reference'>('enhanced');

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate location-matched satellite raster Data URLs for active dataset
  const enhancedRasterUrl = useMemo(
    () => getSatelliteRasterDataUrl(activeDataset, 'enhanced'),
    [activeDataset.id]
  );

  const originalRasterUrl = useMemo(
    () => getSatelliteRasterDataUrl(activeDataset, 'original'),
    [activeDataset.id]
  );

  const degradedRasterUrl = useMemo(
    () => getSatelliteRasterDataUrl(activeDataset, 'degraded'),
    [activeDataset.id]
  );

  const confidenceRasterUrl = useMemo(
    () => getSatelliteRasterDataUrl(activeDataset, 'confidence'),
    [activeDataset.id]
  );

  const handleMouseDown = () => setIsDragging(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging && e.type !== 'touchmove') return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  const formattedCoords = `${activeDataset.coordinates.lat.toFixed(4)}° N, ${activeDataset.coordinates.lng.toFixed(4)}° E | ${activeDataset.coordinates.epsg}`;

  return (
    <div className="space-y-3">
      {/* Top Map Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs">
        <div className="flex items-center gap-3">
          <Badge variant="blue" size="sm">
            Mode: {mode.toUpperCase()}
          </Badge>

          <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-none">
            {activeDataset.name}
          </span>

          <span className="text-slate-500 font-mono hidden md:inline text-[11px]">
            {formattedCoords}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-mode selector when in reference mode */}
          {mode === 'confidence' && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              <span>Risk Cutoff:</span>
              <span className="font-bold text-blue-700">{(confidenceThreshold * 100).toFixed(0)}%</span>
            </div>
          )}

          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullWidth(!isFullWidth)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Toggle Height"
            >
              {isFullWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Container */}
      {mode === 'split' ? (
        /* Side-by-Side Split View Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative h-[420px] rounded-2xl border border-slate-200 overflow-hidden bg-slate-900">
            <img
              src={originalRasterUrl}
              alt="Original Sentinel-2 10m"
              className="w-full h-full object-cover transition-transform duration-100"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
              Original Sentinel-2 (10 m Observed)
            </div>
          </div>

          <div className="relative h-[420px] rounded-2xl border border-slate-200 overflow-hidden bg-slate-900">
            <img
              src={enhancedRasterUrl}
              alt="AI-Enhanced <4m"
              className="w-full h-full object-cover transition-transform duration-100"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            <div className="absolute top-3 right-3 bg-blue-600/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
              AI-Enhanced ({activeAnalysis.targetRes})
            </div>
          </div>
        </div>
      ) : mode === 'confidence' ? (
        /* Monte-Carlo Confidence Heat Map View */
        <div className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 select-none ${isFullWidth ? 'h-[620px]' : 'h-[460px]'}`}>
          <img
            src={confidenceRasterUrl}
            alt="Monte-Carlo Confidence Map"
            className="w-full h-full object-cover transition-transform duration-100"
            style={{ transform: `scale(${zoomLevel})` }}
          />

          <div className="absolute top-4 left-4 bg-slate-900/90 text-white backdrop-blur-md border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Monte-Carlo Uncertainty Layer (N = {activeAnalysis.config.mcPasses})</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 text-xs shadow-lg space-y-2">
            <div className="font-bold text-slate-900 flex items-center justify-between gap-4">
              <span>Confidence Heat Map Key</span>
              <span className="font-mono text-blue-700 font-semibold">{activeAnalysis.confidence}% Mean</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-600" />
                <span>High Confidence (90-98%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500" />
                <span>Risk Region (&lt;{(confidenceThreshold * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Swipe Mode (Default) */
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 select-none ${
            isFullWidth ? 'h-[620px]' : 'h-[460px]'
          }`}
        >
          {/* Base Layer: AI-Enhanced Output */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-100"
            style={{
              backgroundImage: `url('${enhancedRasterUrl}')`,
              transform: `scale(${zoomLevel})`,
            }}
          >
            <div className="absolute top-4 right-4 bg-blue-600/90 text-white backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold shadow-sm border border-blue-400">
              AI-ENHANCED — NOT OBSERVED ({activeAnalysis.targetRes})
            </div>
          </div>

          {/* Clipped Layer: Original Sentinel-2 10m */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden bg-cover bg-center transition-transform duration-100 border-r-2 border-blue-500 shadow-xl"
            style={{
              width: `${sliderPos}%`,
              backgroundImage: `url('${originalRasterUrl}')`,
              transform: `scale(${zoomLevel})`,
            }}
          >
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 px-3.5 py-1 rounded-full text-xs font-semibold shadow-sm">
              Original Sentinel-2 (10 m Observed)
            </div>
          </div>

          {/* Swipe Divider Handle */}
          <div
            className="absolute top-0 bottom-0 z-20 cursor-ew-resize flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white -ml-4 hover:scale-110 transition-transform">
              ↔
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
