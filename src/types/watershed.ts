export type ModuleTab = 
  | 'dashboard'
  | 'explorer'
  | 'analysis'
  | 'evidence'
  | 'interventions'
  | 'priority'
  | 'assessment'
  | 'sources';

export type UserRole = 
  | 'officer'
  | 'field'
  | 'analyst';

export type InterventionStatus = 
  | 'VERIFIED_ACTIVE'
  | 'MAINTENANCE_REQUIRED'
  | 'PROPOSED'
  | 'INTACT'
  | 'SILTED';

export interface Intervention {
  id: string;
  code: string;
  name: string;
  type: string;
  streamOrder: number;
  latitude: number;
  longitude: number;
  status: InterventionStatus;
  capacityTcm: number;
  catchmentAreaHa: number;
  constructionYear: number;
  siltationPercent: number;
  photoUrl?: string;
  aiObservation?: {
    confidence: number;
    summary: string;
  };
}

export interface StreamFeature {
  id: string;
  order: number;
  coordinates: [number, number][]; // [longitude, latitude]
}

export interface FieldEvidenceItem {
  id: string;
  relatedInterventionId: string;
  caption: string;
  photoUrl: string;
  exif: {
    latitude: number;
    longitude: number;
    altitudeMeters: number;
    bearingDeg: number;
    compassDirection: string;
    accuracyMeters: number;
    timestamp: string;
    deviceModel: string;
  };
  aiObservation: {
    conditionSummary: string;
    confidence: number;
    siltationPercent: number;
  };
}

export interface PriorityZone {
  id: string;
  name: string;
  areaHa: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  compositeScore: number;
  reasons: string[];
  recommendedAction: string;
}

export interface NdviDataPoint {
  month: string;
  ndvi: number;
  baselineNdvi: number;
  rainfallMm: number;
}

export interface OutcomeAssessment {
  id: string;
  category: string;
  metricName: string;
  baselineValue: string;
  currentValue: string;
  netDelta: string;
  confidencePercent: number;
  methodology: string;
  limitations: string;
}

export interface DataProviderRecord {
  id: string;
  name: string;
  type: string;
  status: 'CONNECTED' | 'CONFIGURED' | 'PENDING_CREDENTIALS' | 'DEGRADED';
  cadence: string;
  description: string;
  resolution: string;
  adapter: string;
  lastSync: string;
  license: string;
  endpoint: string;
}

export interface LayerState {
  boundary: boolean;
  drainageNetwork: boolean;
  interventions: boolean;
  vegetationHealth: boolean;
  waterBodies: boolean;
  elevationContours: boolean;
  priorityZones: boolean;
  fieldPhotos: boolean;
  baseMap: 'dark' | 'satellite' | 'topo';
}
