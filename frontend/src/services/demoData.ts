import { Project, AnalysisItem, SystemMetrics } from '@/types';

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'Urban Infrastructure — Jaipur',
    location: 'Jaipur, Rajasthan, India',
    analysesCount: 12,
    lastUpdated: '2 hours ago',
    domain: 'urban',
    status: 'active',
  },
  {
    id: 'proj-002',
    name: 'Crop Monitoring — Punjab',
    location: 'Ludhiana, Punjab, India',
    analysesCount: 8,
    lastUpdated: 'Yesterday',
    domain: 'crop',
    status: 'active',
  },
  {
    id: 'proj-003',
    name: 'Flood Assessment — Assam',
    location: 'Kaziranga, Assam, India',
    analysesCount: 5,
    lastUpdated: '3 days ago',
    domain: 'disaster',
    status: 'active',
  },
];

export const DEMO_ANALYSES: AnalysisItem[] = [
  {
    id: 'ANL-32TQD-001',
    title: 'Jaipur Urban Core Footprints',
    location: 'Jaipur (26.9124° N, 75.7873° E)',
    date: '2024-05-20',
    source: 'Sentinel-2 L2A',
    inputRes: '10 m',
    targetRes: '4 m equivalent',
    confidence: 88.5,
    status: 'completed',
    metrics: {
      psnr: 34.82,
      ssim: 0.9412,
      ergas: 2.31,
      sam: 2.84,
      niqe: 4.12,
      brisque: 18.5,
    },
  },
  {
    id: 'ANL-43RQS-002',
    title: 'Ludhiana Wheat Field NDVI',
    location: 'Punjab (30.9010° N, 75.8573° E)',
    date: '2024-05-18',
    source: 'Sentinel-2 L2A',
    inputRes: '10 m',
    targetRes: '4 m equivalent',
    confidence: 91.2,
    status: 'completed',
    metrics: {
      psnr: 36.15,
      ssim: 0.958,
      ergas: 1.95,
      sam: 2.12,
      niqe: 3.85,
      brisque: 15.2,
    },
  },
  {
    id: 'ANL-46REQ-003',
    title: 'Brahmaputra Flood Boundary',
    location: 'Assam (26.5775° N, 93.1711° E)',
    date: '2024-05-12',
    source: 'Sentinel-2 L2A',
    inputRes: '10 m',
    targetRes: '4 m equivalent',
    confidence: 74.8,
    status: 'low_confidence',
    metrics: {
      niqe: 5.45,
      brisque: 28.4,
    },
  },
];

export const DEMO_SYSTEM_METRICS: SystemMetrics = {
  processedTiles: 1420,
  averageResolution: '4 m',
  averageConfidence: 88.4,
  validatedTilesPercentage: 98.2,
  isDemoData: true,
};
