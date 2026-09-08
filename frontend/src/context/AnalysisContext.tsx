import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { GeoDataset, AnalysisRecord, AnalysisConfig } from '@/types/dataset';
import { DEFAULT_DATASET, getDatasetById } from '@/data/datasets';
import { mockApi } from '@/data/mockApi';

interface AnalysisContextType {
  activeDataset: GeoDataset;
  activeAnalysis: AnalysisRecord;
  analysisHistory: AnalysisRecord[];
  configuration: AnalysisConfig;
  isLoading: boolean;
  selectDataset: (id: string) => void;
  selectAnalysis: (id: string) => void;
  updateConfiguration: (config: Partial<AnalysisConfig>) => void;
  startAnalysis: (datasetId?: string, customConfig?: AnalysisConfig) => Promise<AnalysisRecord>;
  exportArtifact: (type: 'cog' | 'confidence' | 'stac' | 'bundle' | 'report') => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeDataset, setActiveDataset] = useState<GeoDataset>(DEFAULT_DATASET);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisRecord[]>([]);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [configuration, setConfiguration] = useState<AnalysisConfig>({
    targetRes: 2.5,
    mcPasses: 10,
    confThreshold: 0.75,
    cloudMasking: true,
    modelArch: 'SwinSR-GAN',
  });

  // Load initial history from mock API
  useEffect(() => {
    mockApi.getAnalysisHistory().then((history) => {
      setAnalysisHistory(history);
      if (history.length > 0) {
        setActiveAnalysisId(history[0].id);
      }
      setIsLoading(false);
    });
  }, []);

  // Compute active analysis object based on active ID or fallback to latest matching active dataset
  const activeAnalysis = useMemo((): AnalysisRecord => {
    const found = analysisHistory.find((a) => a.id === activeAnalysisId);
    if (found) return found;

    // Fallback if not selected
    if (analysisHistory.length > 0) {
      return analysisHistory[0];
    }

    // Synthesize default record
    return {
      id: 'ANL-INIT-001',
      datasetId: activeDataset.id,
      title: `${activeDataset.name} SR Run`,
      location: activeDataset.location,
      date: activeDataset.acquisitionDate,
      source: activeDataset.source,
      inputRes: activeDataset.inputRes,
      targetRes: activeDataset.defaultTargetRes,
      scale: '4.0x',
      confidence: activeDataset.stacMetadata.properties['sharpearth:mean_confidence'],
      lowConfidencePercentage: 8.4,
      status: 'completed',
      timestamp: new Date().toISOString(),
      metrics: activeDataset.metrics,
      spectralProfile: activeDataset.spectralProfile,
      config: configuration,
      stacMetadata: activeDataset.stacMetadata,
    };
  }, [analysisHistory, activeAnalysisId, activeDataset, configuration]);

  const selectDataset = (id: string) => {
    const ds = getDatasetById(id);
    setActiveDataset(ds);

    // Look for matching analysis in history
    const existing = analysisHistory.find((a) => a.datasetId === ds.id);
    if (existing) {
      setActiveAnalysisId(existing.id);
    } else {
      // Create lightweight initial record for this dataset
      mockApi.createAnalysis(ds.id, configuration).then((newRecord) => {
        setAnalysisHistory((prev) => [newRecord, ...prev]);
        setActiveAnalysisId(newRecord.id);
      });
    }
  };

  const selectAnalysis = (id: string) => {
    const found = analysisHistory.find((a) => a.id === id);
    if (found) {
      setActiveAnalysisId(found.id);
      const ds = getDatasetById(found.datasetId);
      setActiveDataset(ds);
      setConfiguration(found.config);
    }
  };

  const updateConfiguration = (newConfig: Partial<AnalysisConfig>) => {
    setConfiguration((prev) => ({ ...prev, ...newConfig }));
  };

  const startAnalysis = async (datasetId?: string, customConfig?: AnalysisConfig): Promise<AnalysisRecord> => {
    const targetDatasetId = datasetId || activeDataset.id;
    const targetConfig = customConfig || configuration;

    setIsLoading(true);
    const newRecord = await mockApi.createAnalysis(targetDatasetId, targetConfig);
    setAnalysisHistory((prev) => [newRecord, ...prev]);
    setActiveAnalysisId(newRecord.id);
    setActiveDataset(getDatasetById(targetDatasetId));
    setIsLoading(false);
    return newRecord;
  };

  const exportArtifact = (type: 'cog' | 'confidence' | 'stac' | 'bundle' | 'report') => {
    const ds = activeDataset;
    const anl = activeAnalysis;

    if (type === 'stac') {
      const stacJson = JSON.stringify(anl.stacMetadata, null, 2);
      mockApi.downloadFile(stacJson, `${anl.id}_STAC_item.json`, 'application/json');
    } else if (type === 'cog') {
      const cogHeader = `CLOUD-OPTIMIZED GEOTIFF DEMO ARTIFACT\n------------------------------------\nAnalysis ID: ${anl.id}\nLocation: ${anl.location}\nBounding Box: ${anl.stacMetadata.bbox.join(', ')}\nSpatial Resolution: ${anl.targetRes}\nScale Factor: ${anl.scale}\nBands: RGB+NIR\nData Provider: Sentinel-2 L2A (SwinSR-GAN Super-Resolution)\nTimestamp: ${anl.timestamp}\nStatus: DEMO DATA (AI-ENHANCED - NOT OBSERVED)\n`;
      mockApi.downloadFile(cogHeader, `${anl.id}_enhanced_2.5m_COG.tif`, 'text/plain');
    } else if (type === 'confidence') {
      const confHeader = `MONTE-CARLO UNCERTAINTY RASTER ARTIFACT\n------------------------------------\nAnalysis ID: ${anl.id}\nMonte-Carlo Forward Passes: ${anl.config.mcPasses}\nMean Confidence: ${anl.confidence}%\nLow Confidence Pixel Percentage: ${anl.lowConfidencePercentage}%\nThreshold Cutoff: ${(anl.config.confThreshold * 100).toFixed(0)}%\nStatus: DEMO DATA (SPATIALLY ALIGNED UNCERTAINTY MAP)\n`;
      mockApi.downloadFile(confHeader, `${anl.id}_confidence_map.tif`, 'text/plain');
    } else if (type === 'report') {
      const reportJson = JSON.stringify(
        {
          analysisId: anl.id,
          title: anl.title,
          location: anl.location,
          date: anl.date,
          inputRes: anl.inputRes,
          targetRes: anl.targetRes,
          metrics: anl.metrics,
          spectralIntegrity: anl.spectralProfile,
          disclaimer: 'DEMO VALIDATION METRICS - SharpEarth Geospatial AI',
        },
        null,
        2
      );
      mockApi.downloadFile(reportJson, `${anl.id}_validation_report.json`, 'application/json');
    } else if (type === 'bundle') {
      const bundleManifest = JSON.stringify(
        {
          package: 'SharpEarth Geospatial Analysis Bundle',
          analysisId: anl.id,
          dataset: ds.name,
          location: ds.location,
          filesIncluded: [
            `${anl.id}_enhanced_2.5m_COG.tif`,
            `${anl.id}_confidence_map.tif`,
            `${anl.id}_STAC_item.json`,
            `${anl.id}_validation_report.json`,
          ],
          timestamp: new Date().toISOString(),
        },
        null,
        2
      );
      mockApi.downloadFile(bundleManifest, `${anl.id}_bundle_manifest.json`, 'application/json');
    }
  };

  return (
    <AnalysisContext.Provider
      value={{
        activeDataset,
        activeAnalysis,
        analysisHistory,
        configuration,
        isLoading,
        selectDataset,
        selectAnalysis,
        updateConfiguration,
        startAnalysis,
        exportArtifact,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
