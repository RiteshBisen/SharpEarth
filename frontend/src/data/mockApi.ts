import { GeoDataset, AnalysisRecord, AnalysisConfig } from '@/types/dataset';
import { ALL_DATASETS, getDatasetById } from './datasets';

// Initial pre-populated analysis history matching real geospatial locations
const INITIAL_ANALYSIS_HISTORY: AnalysisRecord[] = [
  {
    id: 'ANL-JPR-CORE-001',
    datasetId: 'jaipur-urban-core',
    title: 'Jaipur Urban Core Footprints',
    location: 'Jaipur (26.9124° N, 75.7873° E)',
    date: '2024-05-20',
    source: 'Sentinel-2 L2A',
    inputRes: '10 m',
    targetRes: '2.5 m equivalent',
    scale: '4.0x',
    confidence: 91.4,
    lowConfidencePercentage: 6.8,
    status: 'completed',
    timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    metrics: getDatasetById('jaipur-urban-core').metrics,
    spectralProfile: getDatasetById('jaipur-urban-core').spectralProfile,
    config: {
      targetRes: 2.5,
      mcPasses: 10,
      confThreshold: 0.75,
      cloudMasking: true,
      modelArch: 'SwinSR-GAN',
    },
    stacMetadata: getDatasetById('jaipur-urban-core').stacMetadata,
  },
  {
    id: 'ANL-PJB-CROP-002',
    datasetId: 'punjab-crop-monitoring',
    title: 'Ludhiana Wheat Field NDVI',
    location: 'Punjab (30.9010° N, 75.8573° E)',
    date: '2024-05-18',
    source: 'Sentinel-2 L2A',
    inputRes: '10 m',
    targetRes: '3.0 m equivalent',
    scale: '3.3x',
    confidence: 94.8,
    lowConfidencePercentage: 3.2,
    status: 'completed',
    timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    metrics: getDatasetById('punjab-crop-monitoring').metrics,
    spectralProfile: getDatasetById('punjab-crop-monitoring').spectralProfile,
    config: {
      targetRes: 3.0,
      mcPasses: 10,
      confThreshold: 0.75,
      cloudMasking: true,
      modelArch: 'SwinSR-GAN',
    },
    stacMetadata: getDatasetById('punjab-crop-monitoring').stacMetadata,
  },
  {
    id: 'ANL-ASM-FLD-003',
    datasetId: 'assam-flood-assessment',
    title: 'Brahmaputra Flood Boundary',
    location: 'Assam (26.5775° N, 93.1711° E)',
    date: '2024-05-12',
    source: 'Sentinel-2 L2A',
    inputRes: '10 m',
    targetRes: '2.5 m equivalent',
    scale: '4.0x',
    confidence: 81.2,
    lowConfidencePercentage: 14.5,
    status: 'low_confidence',
    timestamp: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    metrics: getDatasetById('assam-flood-assessment').metrics,
    spectralProfile: getDatasetById('assam-flood-assessment').spectralProfile,
    config: {
      targetRes: 2.5,
      mcPasses: 10,
      confThreshold: 0.75,
      cloudMasking: true,
      modelArch: 'SwinSR-GAN',
    },
    stacMetadata: getDatasetById('assam-flood-assessment').stacMetadata,
  },
];

let analysisHistoryStore: AnalysisRecord[] = [...INITIAL_ANALYSIS_HISTORY];

export const mockApi = {
  // GET /api/v1/datasets
  async getDatasets(): Promise<GeoDataset[]> {
    return Promise.resolve([...ALL_DATASETS]);
  },

  // GET /api/v1/datasets/{id}
  async getDataset(id: string): Promise<GeoDataset> {
    return Promise.resolve(getDatasetById(id));
  },

  // GET /api/v1/analyses
  async getAnalysisHistory(): Promise<AnalysisRecord[]> {
    return Promise.resolve([...analysisHistoryStore]);
  },

  // GET /api/v1/analyses/{id}
  async getAnalysis(id: string): Promise<AnalysisRecord | undefined> {
    return Promise.resolve(analysisHistoryStore.find((a) => a.id === id));
  },

  // POST /api/v1/analyses
  async createAnalysis(datasetId: string, config: AnalysisConfig): Promise<AnalysisRecord> {
    const dataset = getDatasetById(datasetId);

    // Calculate dynamic demo metrics based on scale and passes
    const scaleRatio = 10 / config.targetRes; // e.g. 4.0x for 2.5m, 3.3x for 3.0m
    const basePsnr = dataset.metrics.psnr;
    const baseSsim = dataset.metrics.ssim;

    // Adjust metrics slightly based on target resolution
    const psnr = Number((basePsnr + (4.0 - config.targetRes) * 0.4).toFixed(2));
    const ssim = Number((baseSsim + (4.0 - config.targetRes) * 0.008).toFixed(4));

    // Calculate mean confidence based on MC-Dropout passes (more passes -> lower variance estimate)
    const meanConf = Number(Math.min(96.5, Math.max(78.0, dataset.stacMetadata.properties['sharpearth:mean_confidence'] + (config.mcPasses - 10) * 0.3)).toFixed(1));
    const lowConfPct = Number(Math.max(2.0, (100 - meanConf) * 0.8).toFixed(1));

    const newRecord: AnalysisRecord = {
      id: `ANL-${dataset.id.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      datasetId: dataset.id,
      title: `${dataset.name} SR Run`,
      location: dataset.location,
      date: new Date().toISOString().split('T')[0],
      source: dataset.source,
      inputRes: dataset.inputRes,
      targetRes: `${config.targetRes} m equivalent`,
      scale: `${scaleRatio.toFixed(1)}x`,
      confidence: meanConf,
      lowConfidencePercentage: lowConfPct,
      status: (meanConf > 85 ? 'completed' : 'low_confidence') as 'completed' | 'low_confidence',
      timestamp: new Date().toISOString(),
      metrics: {
        ...dataset.metrics,
        psnr,
        ssim,
      },
      spectralProfile: dataset.spectralProfile,
      config,
      stacMetadata: {
        ...dataset.stacMetadata,
        properties: {
          ...dataset.stacMetadata.properties,
          gsd: config.targetRes,
          'sharpearth:scale_factor': `${scaleRatio.toFixed(1)}x`,
          'sharpearth:mc_dropout_passes': config.mcPasses,
          'sharpearth:mean_confidence': meanConf,
        },
      },
    };

    analysisHistoryStore = [newRecord, ...analysisHistoryStore];
    return Promise.resolve(newRecord);
  },

  // Helper for generating downloadable files
  downloadFile(content: string | Blob, filename: string, mimeType: string) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
