import { GeoDataset } from '@/types/dataset';
import { JAIPUR_DATASETS } from './jaipur';
import { DELHI_DATASET } from './delhi';
import { MUMBAI_DATASET } from './mumbai';
import { PUNJAB_DATASET } from './punjab';
import { ASSAM_DATASET } from './assam';

export const ALL_DATASETS: GeoDataset[] = [
  ...JAIPUR_DATASETS,
  DELHI_DATASET,
  MUMBAI_DATASET,
  PUNJAB_DATASET,
  ASSAM_DATASET,
];

export const DEFAULT_DATASET: GeoDataset = JAIPUR_DATASETS[0]; // Jaipur Urban Core (Flagship Demo)

export function getDatasetById(id: string): GeoDataset {
  return ALL_DATASETS.find((d) => d.id === id) || DEFAULT_DATASET;
}
