import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  ArrowRight,
  Layers,
  Cpu,
  BarChart3,
  ShieldCheck,
  Building2,
  Sprout,
  Flame,
  Play,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  Sparkles,
  Activity,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* Light Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-2xs w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
              <Globe className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 font-sans">
              SharpEarth
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#pipeline" className="hover:text-blue-600 transition-colors">Pipeline</a>
            <a href="#capabilities" className="hover:text-blue-600 transition-colors">Capabilities</a>
            <a href="#workflows" className="hover:text-blue-600 transition-colors">Domain Workflows</a>
            <a href="#validation" className="hover:text-blue-600 transition-colors">Scientific Validation</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/app/results">
              <Button variant="secondary" size="sm">View Demo</Button>
            </Link>
            <Link to="/app/new-analysis">
              <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                Start Analysis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section — 2-Column Responsive Full Width */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Sentinel-2 L2A Deep Learning Super-Resolution</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Super-resolution mapping for Earth observation imagery.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Transform free 10 m Sentinel-2 multispectral imagery into high-fidelity <strong className="text-slate-900">&lt;4 m equivalent resolution</strong> outputs using SwinSR-GAN — complete with pixel-level uncertainty quantification and multispectral integrity validation.
            </p>

            {/* Scientific Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>4-Band RGB+NIR Reflectance Preserved</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Monte-Carlo Pixel Uncertainty Maps</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>PSNR, SSIM & Spectral Angle Metrics</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cloud-Optimized GeoTIFF & STAC Export</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link to="/app/new-analysis">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-xs font-bold" icon={<ArrowRight className="w-4 h-4" />}>
                  Configure New Analysis
                </Button>
              </Link>
              <Link to="/app/results">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-xs font-bold" icon={<Play className="w-3.5 h-3.5 fill-slate-700" />}>
                  Explore Results Workspace
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Preview Card */}
          <div className="lg:col-span-5">
            <Card className="p-4 bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">Tile S2B_32TQD — Jaipur Urban</span>
                </div>
                <Badge variant="amber" size="sm">AI-ENHANCED — NOT OBSERVED</Badge>
              </div>

              {/* Image Split Mock Preview */}
              <div className="relative h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop"
                  alt="Satellite Preview"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Badge Bar */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-200 text-[10px] font-mono font-bold text-slate-900 shadow-2xs">
                  10 m Observed → 4 m Reconstructed
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-900/90 text-emerald-400 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono font-bold shadow-2xs">
                  Mean Confidence: 88.5%
                </div>
              </div>

              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-[9px] text-slate-500 uppercase">PSNR</div>
                  <div className="text-xs font-bold text-blue-700">34.82 dB</div>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-[9px] text-slate-500 uppercase">SSIM</div>
                  <div className="text-xs font-bold text-emerald-700">0.9412</div>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-[9px] text-slate-500 uppercase">SAM Loss</div>
                  <div className="text-xs font-bold text-purple-700">2.84°</div>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </section>

      {/* System Pipeline Section — Full Width Grid */}
      <section id="pipeline" className="py-14 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="text-[11px] font-mono font-semibold text-blue-600 uppercase tracking-wider">
              Reproducible Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">End-to-End Super-Resolution Pipeline</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              From Sentinel-2 L2A tile acquisition to Monte-Carlo uncertainty estimation and COG/STAC packaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 space-y-3 border-l-4 border-l-slate-400">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>STAGE 01</span>
                <Badge variant="slate" size="sm">Input Raster</Badge>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Sentinel-2 L2A Acquisition</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingests 10 m surface reflectance bands (B2, B3, B4, B8) with Scene Classification Layer (SCL) cloud/shadow filtering and sub-pixel co-registration.
              </p>
            </Card>

            <Card className="p-5 space-y-3 border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>STAGE 02</span>
                <Badge variant="blue" size="sm">Deep Learning</Badge>
              </div>
              <h3 className="text-sm font-bold text-slate-900">SwinSR-GAN Reconstruction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hybrid generator combining Residual-in-Residual Dense Blocks (RRDB) for local texture recovery with Swin Transformer windowed attention for spatial context.
              </p>
            </Card>

            <Card className="p-5 space-y-3 border-l-4 border-l-emerald-600">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>STAGE 03</span>
                <Badge variant="emerald" size="sm">Quality & COG</Badge>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Uncertainty & Package Export</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Computes pixel-wise variance across N=10 MC-Dropout passes. Exports Cloud-Optimized GeoTIFF (COG) rasters with STAC 1.0.0 metadata.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Capabilities Section — 4 Column Wide Grid */}
      <section id="capabilities" className="py-16 border-t border-slate-200 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="text-[11px] font-mono font-semibold text-blue-600 uppercase tracking-wider">
              Scientific Transparency
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Built for Enterprise Geospatial Analytics</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              SharpEarth explicitly treats reconstructed high-resolution detail as inferred, ensuring full scientific transparency across all workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="p-5 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">SwinSR-GAN Generator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dual-branch network topology trained on co-registered Sentinel-2 and high-resolution reference pairs.
              </p>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Uncertainty Quantification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monte-Carlo Dropout stochastic inference flags low-confidence regions requiring analyst verification.
              </p>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-800">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Scientific Metrics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates PSNR, SSIM, ERGAS synthesis error, SAM spectral angle distortion, and NIQE no-reference quality score.
              </p>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Downstream Validation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates Random Forest land-cover classification accuracy, Cohen's Kappa score, and road network continuity.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Domain Workflows */}
      <section id="workflows" className="py-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="text-[11px] font-mono font-semibold text-blue-600 uppercase tracking-wider">
              Geospatial Use Cases
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Domain-Specific Applications</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Customized super-resolution outputs for urban planning, precision agriculture, and emergency response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Urban & Infrastructure</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enhance building footprint boundaries and road vector continuity for municipal GIS mapping and growth tracking at 4 m spatial scale.
              </p>
              <div className="pt-2">
                <Badge variant="blue" size="sm">Building Footprints & Roads</Badge>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Precision Agriculture</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Analyze sub-field NDVI and NDWI vegetation index variation without losing physical reflectance calibration or introducing spectral drift.
              </p>
              <div className="pt-2">
                <Badge variant="emerald" size="sm">Sub-Field Crop Analytics</Badge>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Disaster Assessment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Delineate flood inundation edges and wildfire burn scar boundaries with explicit uncertainty flags to inform rapid emergency response.
              </p>
              <div className="pt-2">
                <Badge variant="amber" size="sm">Flood & Burn Delineation</Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-xs text-slate-600 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>© 2026 SharpEarth Geospatial AI Engineering. All rights reserved.</div>
          <div className="font-semibold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>AI-ENHANCED — NOT OBSERVED</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
