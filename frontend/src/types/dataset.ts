export type SceneDomain = 'urban' | 'crop' | 'coastal' | 'flood' | 'infrastructure';

export interface Coordinates {
  lat: number;
  lng: number;
  zoom: number;
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  epsg: string;
}

export interface ValidationMetrics {
  psnr: number;          // Peak Signal-to-Noise Ratio (dB)
  ssim: number;          // Structural Similarity Index
  ergas: number;         // Relative Dimensionless Global Error
  sam: number;           // Spectral Angle Mapper (degrees)
  niqe: number;          // Natural Image Quality Evaluator
  brisque: number;       // Blind/Referenceless Image Spatial Quality Evaluator
  footprintIoU?: number; // Downstream building footprint segmentation mIoU
  cropIoU?: number;      // Downstream crop boundary classification mIoU
}

export interface SpectralBandInfo {
  band: string;
  name: string;
  wavelengthNm: number;
  observedReflectance: number; // Sentinel-2 10m
  enhancedReflectance: number; // SwinSR-GAN <4m
  residualDelta: number;
}

export interface SpectralProfile {
  ndvi: number; // Normalized Difference Vegetation Index (-1 to +1)
  ndwi: number; // Normalized Difference Water Index (-1 to +1)
  bands: SpectralBandInfo[];
}

export interface STACItemMetadata {
  id: string;
  stacVersion: string;
  collection: string;
  bbox: [number, number, number, number];
  properties: {
    datetime: string;
    platform: string;
    instruments: string[];
    gsd: number;
    'eo:cloud_cover': number;
    'sharpearth:scale_factor': string;
    'sharpearth:mc_dropout_passes': number;
    'sharpearth:mean_confidence': number;
  };
  assets: {
    enhanced_cog: { href: string; type: string; title: string };
    confidence_cog: { href: string; type: string; title: string };
    original_s2: { href: string; type: string; title: string };
  };
}

export interface GeoDataset {
  id: string;
  name: string;
  location: string;
  region: string;
  country: string;
  domain: SceneDomain;
  coordinates: Coordinates;
  acquisitionDate: string;
  source: string;
  cloudCover: number;
  inputRes: string;
  defaultTargetRes: string;
  bands: string[];
  thumbnailColor: string; // Theme indicator for raster engine
  metrics: ValidationMetrics;
  spectralProfile: SpectralProfile;
  stacMetadata: STACItemMetadata;
  description: string;
}

export interface AnalysisConfig {
  targetRes: number;         // 2.5, 3.0, 4.0
  mcPasses: number;          // 3..20
  confThreshold: number;     // 0.50..0.95
  cloudMasking: boolean;
  modelArch: 'SwinSR-GAN' | 'RRDB-Net';
}

export interface AnalysisRecord {
  id: string;
  datasetId: string;
  title: string;
  location: string;
  date: string;
  source: string;
  inputRes: string;
  targetRes: string;
  scale: string;
  confidence: number;
  lowConfidencePercentage: number;
  status: 'completed' | 'processing' | 'low_confidence' | 'failed';
  timestamp: string;
  metrics: ValidationMetrics;
  spectralProfile: SpectralProfile;
  config: AnalysisConfig;
  stacMetadata: STACItemMetadata;
}
