import { GeoDataset } from '@/types/dataset';

export const ASSAM_DATASET: GeoDataset = {
  id: 'assam-flood-assessment',
  name: 'Assam — Flood Assessment',
  location: 'Kaziranga & Brahmaputra Basin, Assam, India',
  region: 'Assam',
  country: 'India',
  domain: 'flood',
  coordinates: {
    lat: 26.5775,
    lng: 93.1711,
    zoom: 14,
    bbox: [93.1300, 26.5500, 93.2100, 26.6000],
    epsg: 'EPSG:32646', // UTM Zone 46N
  },
  acquisitionDate: '2024-05-12',
  source: 'Sentinel-2 L2A',
  cloudCover: 8.7,
  inputRes: '10 m',
  defaultTargetRes: '2.5 m equivalent',
  bands: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)'],
  thumbnailColor: '#b45309', // Amber flood sediment tint
  metrics: {
    psnr: 32.80,
    ssim: 0.9150,
    ergas: 2.85,
    sam: 3.45,
    niqe: 4.85,
    brisque: 24.2,
  },
  spectralProfile: {
    ndvi: 0.35,
    ndwi: 0.62, // High flood water index
    bands: [
      { band: 'B02', name: 'Blue', wavelengthNm: 490, observedReflectance: 0.165, enhancedReflectance: 0.164, residualDelta: -0.001 },
      { band: 'B03', name: 'Green', wavelengthNm: 560, observedReflectance: 0.192, enhancedReflectance: 0.191, residualDelta: -0.001 },
      { band: 'B04', name: 'Red', wavelengthNm: 665, observedReflectance: 0.175, enhancedReflectance: 0.174, residualDelta: -0.001 },
      { band: 'B08', name: 'NIR', wavelengthNm: 842, observedReflectance: 0.225, enhancedReflectance: 0.223, residualDelta: -0.002 },
    ],
  },
  stacMetadata: {
    id: 'S2B_MSIL2A_46REQ_20240512_ASSAM',
    stacVersion: '1.0.0',
    collection: 'sentinel-2-l2a-sharpearth-sr',
    bbox: [93.1300, 26.5500, 93.2100, 26.6000],
    properties: {
      datetime: '2024-05-12T04:55:10Z',
      platform: 'Sentinel-2B',
      instruments: ['MSI'],
      gsd: 2.5,
      'eo:cloud_cover': 8.7,
      'sharpearth:scale_factor': '4.0x',
      'sharpearth:mc_dropout_passes': 10,
      'sharpearth:mean_confidence': 81.2,
    },
    assets: {
      enhanced_cog: { href: '/api/v1/assets/assam_sr.tif', type: 'image/tiff', title: 'Enhanced COG' },
      confidence_cog: { href: '/api/v1/assets/assam_conf.tif', type: 'image/tiff', title: 'Confidence COG' },
      original_s2: { href: '/api/v1/assets/assam_s2.tif', type: 'image/tiff', title: 'Original S2' },
    },
  },
  description: 'Braided river channels of Brahmaputra River, Kaziranga floodplain inundation, and sediment plume mapping under high cloud/water uncertainty.',
};
