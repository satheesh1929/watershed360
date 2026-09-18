import {
  tamilNaduWatersheds,
  getWatershedDataset,
  demoDataProviders,
  WellTelemetry,
  HydrologicalBudget
} from '@/data/demoWatershedData';

export interface WatershedContext {
  metadata: ReturnType<typeof getWatershedDataset>['stats'];
  interventions: Array<{
    code: string;
    name: string;
    type: string;
    streamOrder: number;
    coordinates: [number, number];
    status: string;
    siltationPercent: number;
    capacityTcm: number;
    constructionYear: number;
  }>;
  openWells: WellTelemetry[];
  priorityZones: ReturnType<typeof getWatershedDataset>['priorityZones'];
  ndviPhenology: ReturnType<typeof getWatershedDataset>['ndviSeries'];
  waterBalance: HydrologicalBudget[];
  fieldEvidenceRecords: Array<{
    id: string;
    caption: string;
    exif: ReturnType<typeof getWatershedDataset>['evidence'][0]['exif'];
    aiObservation: ReturnType<typeof getWatershedDataset>['evidence'][0]['aiObservation'];
  }>;
  dataSources: Array<{
    name: string;
    type: string;
    status: string;
    resolution: string;
  }>;
  governanceNote: string;
}

/**
 * Returns structured, grounded context for the Gemini AI Copilot for any active watershed
 */
export async function getWatershedContext(watershedId: string = 'pimpalgaon'): Promise<WatershedContext> {
  const dataset = getWatershedDataset(watershedId);

  return {
    metadata: dataset.stats,
    interventions: dataset.interventions.map(item => ({
      code: item.code,
      name: item.name,
      type: item.type,
      streamOrder: item.streamOrder,
      coordinates: [item.latitude, item.longitude],
      status: item.status,
      siltationPercent: item.siltationPercent,
      capacityTcm: item.capacityTcm,
      constructionYear: item.constructionYear,
    })),
    openWells: dataset.wells,
    priorityZones: dataset.priorityZones,
    ndviPhenology: dataset.ndviSeries,
    waterBalance: dataset.hydrologicalBudget,
    fieldEvidenceRecords: dataset.evidence.map(item => ({
      id: item.id,
      caption: item.caption,
      exif: item.exif,
      aiObservation: item.aiObservation,
    })),
    dataSources: demoDataProviders.map(p => ({
      name: p.name,
      type: p.type,
      status: p.status,
      resolution: p.resolution,
    })),
    governanceNote: `WATERSHED360 provides an analytical geospatial intelligence layer for ${dataset.name} (${dataset.code}) in ${dataset.district} under PMKSY-WDC 2.0. Integrated Sentinel-2 10m BOA surface reflectance and Copernicus GLO-30 DEM calibrate in-situ hydrological telemetry with transparent empirical models.`
  };
}
