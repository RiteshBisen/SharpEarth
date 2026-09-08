import { GeoDataset } from '@/types/dataset';

export const MUMBAI_DATASET: GeoDataset = {
  id: 'mumbai-coastal-urban',
  name: 'Mumbai — Dense Urban & Coastal',
  location: 'BKC & Bandra Coast, Mumbai, India',
  region: 'Maharashtra',
  country: 'India',
  domain: 'coastal',
  coordinates: {
    lat: 19.0760,
    lng: 72.8777,
    zoom: 15,
    bbox: [72.8500, 19.0550, 72.9000, 19.0950],
    epsg: 'EPSG:32643',
  },
  acquisitionDate: '2024-05-18',
  source: 'Sentinel-2 L2A',
  cloudCover: 4.8,
  inputRes: '10 m',
  defaultTargetRes: '2.5 m equivalent',
  bands: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)'],
  thumbnailColor: '#0f766e', // Deep Teal coastal marine tint
  metrics: {
    psnr: 33.95,
    ssim: 0.9290,
    ergas: 2.52,
    sam: 3.12,
    niqe: 4.35,
    brisque: 19.8,
    footprintIoU: 85.2,
  },
  spectralProfile: {
    ndvi: 0.15,
    ndwi: 0.42, // Strong marine NDWI signature
    bands: [
      { band: 'B02', name: 'Blue', wavelengthNm: 490, observedReflectance: 0.182, enhancedReflectance: 0.181, residualDelta: -0.001 },
      { band: 'B03', name: 'Green', wavelengthNm: 560, observedReflectance: 0.205, enhancedReflectance: 0.204, residualDelta: -0.001 },
      { band: 'B04', name: 'Red', wavelengthNm: 665, observedReflectance: 0.190, enhancedReflectance: 0.189, residualDelta: -0.001 },
      { band: 'B08', name: 'NIR', wavelengthNm: 842, observedReflectance: 0.210, enhancedReflectance: 0.208, residualDelta: -0.002 },
    ],
  },
  stacMetadata: {
    id: 'S2B_MSIL2A_43QKD_20240518_MUMBAI',
    stacVersion: '1.0.0',
    collection: 'sentinel-2-l2a-sharpearth-sr',
    bbox: [72.8500, 19.0550, 72.9000, 19.0950],
    properties: {
      datetime: '2024-05-18T05:42:18Z',
      platform: 'Sentinel-2B',
      instruments: ['MSI'],
      gsd: 2.5,
      'eo:cloud_cover': 4.8,
      'sharpearth:scale_factor': '4.0x',
      'sharpearth:mc_dropout_passes': 10,
      'sharpearth:mean_confidence': 86.4,
    },
    assets: {
      enhanced_cog: { href: '/api/v1/assets/mumbai_sr.tif', type: 'image/tiff', title: 'Enhanced COG' },
      confidence_cog: { href: '/api/v1/assets/mumbai_conf.tif', type: 'image/tiff', title: 'Confidence COG' },
      original_s2: { href: '/api/v1/assets/mumbai_s2.tif', type: 'image/tiff', title: 'Original S2' },
    },
  },
  description: 'Ultra-dense coastal urban environment, Bandra-Worli Sea Link alignment, mangrove estuarine interface, and BKC financial precinct.',
};
