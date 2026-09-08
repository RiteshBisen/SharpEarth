import { GeoDataset } from '@/types/dataset';

export const PUNJAB_DATASET: GeoDataset = {
  id: 'punjab-crop-monitoring',
  name: 'Punjab — Crop Monitoring',
  location: 'Ludhiana Agricultural Belt, Punjab, India',
  region: 'Punjab',
  country: 'India',
  domain: 'crop',
  coordinates: {
    lat: 30.9010,
    lng: 75.8573,
    zoom: 14,
    bbox: [75.8200, 30.8800, 75.8900, 30.9200],
    epsg: 'EPSG:32643',
  },
  acquisitionDate: '2024-05-18',
  source: 'Sentinel-2 L2A',
  cloudCover: 1.8,
  inputRes: '10 m',
  defaultTargetRes: '3.0 m equivalent',
  bands: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)'],
  thumbnailColor: '#15803d', // Lush emerald crop green tint
  metrics: {
    psnr: 36.85,
    ssim: 0.9620,
    ergas: 1.75,
    sam: 1.95,
    niqe: 3.52,
    brisque: 13.4,
    cropIoU: 94.1,
  },
  spectralProfile: {
    ndvi: 0.82, // Very strong wheat/paddy crop NDVI signature
    ndwi: -0.18,
    bands: [
      { band: 'B02', name: 'Blue', wavelengthNm: 490, observedReflectance: 0.052, enhancedReflectance: 0.051, residualDelta: -0.001 },
      { band: 'B03', name: 'Green', wavelengthNm: 560, observedReflectance: 0.098, enhancedReflectance: 0.097, residualDelta: -0.001 },
      { band: 'B04', name: 'Red', wavelengthNm: 665, observedReflectance: 0.064, enhancedReflectance: 0.063, residualDelta: -0.001 },
      { band: 'B08', name: 'NIR', wavelengthNm: 842, observedReflectance: 0.648, enhancedReflectance: 0.646, residualDelta: -0.002 },
    ],
  },
  stacMetadata: {
    id: 'S2A_MSIL2A_43RQS_20240518_PUNJAB',
    stacVersion: '1.0.0',
    collection: 'sentinel-2-l2a-sharpearth-sr',
    bbox: [75.8200, 30.8800, 75.8900, 30.9200],
    properties: {
      datetime: '2024-05-18T05:38:22Z',
      platform: 'Sentinel-2A',
      instruments: ['MSI'],
      gsd: 3.0,
      'eo:cloud_cover': 1.8,
      'sharpearth:scale_factor': '3.3x',
      'sharpearth:mc_dropout_passes': 10,
      'sharpearth:mean_confidence': 94.8,
    },
    assets: {
      enhanced_cog: { href: '/api/v1/assets/punjab_sr.tif', type: 'image/tiff', title: 'Enhanced COG' },
      confidence_cog: { href: '/api/v1/assets/punjab_conf.tif', type: 'image/tiff', title: 'Confidence COG' },
      original_s2: { href: '/api/v1/assets/punjab_s2.tif', type: 'image/tiff', title: 'Original S2' },
    },
  },
  description: 'Intensive agricultural landscape in Ludhiana district showing crop field boundaries, irrigation canal networks, and crop vigor variations.',
};
