import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface SwipeComparisonViewerProps {
  originalSrc?: string;
  enhancedSrc?: string;
  confidenceSrc?: string;
  mode?: 'swipe' | 'split' | 'confidence';
}

export const SwipeComparisonViewer: React.FC<SwipeComparisonViewerProps> = ({
  mode = 'swipe',
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullWidth, setIsFullWidth] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="space-y-3">
      {/* Top Map Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs">
        <div className="flex items-center gap-3">
          <Badge variant="blue" size="sm">
            Mode: {mode.toUpperCase()}
          </Badge>
          <span className="text-slate-600 font-mono hidden sm:inline text-[11px]">
            Coordinates: 26.9124° N, 75.7873° E | EPSG:32632
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullWidth(!isFullWidth)}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            title="Toggle Full Width"
          >
            {isFullWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 select-none ${
          isFullWidth ? 'h-[650px]' : 'h-[460px]'
        }`}
      >
        {/* Layer 1: AI-Enhanced Image (Full Base) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop')`,
            transform: `scale(${zoomLevel})`,
          }}
        >
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
            AI-Enhanced (&lt;4 m Equivalent)
          </div>
        </div>

        {/* Layer 2: Original 10m Sentinel-2 Image (Clipped Left) */}
        {mode === 'swipe' && (
          <div
            className="absolute inset-y-0 left-0 overflow-hidden bg-cover bg-center transition-transform duration-100 border-r-2 border-blue-600 shadow-md"
            style={{
              width: `${sliderPos}%`,
              backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600&auto=format&fit=crop')`,
              filter: 'blur(3.5px) contrast(0.9)',
              transform: `scale(${zoomLevel})`,
            }}
          >
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
              Original Sentinel-2 (10 m Observed)
            </div>
          </div>
        )}

        {/* Swipe Divider Handle */}
        {mode === 'swipe' && (
          <div
            className="absolute top-0 bottom-0 z-20 cursor-ew-resize flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white -ml-4 hover:scale-110 transition-transform">
              ↔
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
