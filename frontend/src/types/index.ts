export interface Project {
  id: string;
  name: string;
  location: string;
  analysesCount: number;
  lastUpdated: string;
  domain: 'urban' | 'crop' | 'disaster';
  status: 'active' | 'archived';
}

export interface AnalysisItem {
  id: string;
  title: string;
  location: string;
  date: string;
  source: string;
  inputRes: string;
  targetRes: string;
  confidence: number;
  status: 'completed' | 'processing' | 'validation_required' | 'low_confidence' | 'failed';
  metrics?: {
    psnr?: number;
    ssim?: number;
    ergas?: number;
    sam?: number;
    niqe: number;
    brisque: number;
  };
}

export interface SystemMetrics {
  processedTiles: number;
  averageResolution: string;
  averageConfidence: number;
  validatedTilesPercentage: number;
  isDemoData: boolean;
}
