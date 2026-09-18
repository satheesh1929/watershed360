import { 
  Intervention, 
  StreamFeature, 
  FieldEvidenceItem, 
  PriorityZone, 
  NdviDataPoint, 
  OutcomeAssessment, 
  DataProviderRecord 
} from '@/types/watershed';

export interface WellTelemetry {
  id: string;
  code: string;
  village: string;
  farmerName: string;
  latitude: number;
  longitude: number;
  depthMeters: number;
  baselineWaterTableM: number;
  currentWaterTableM: number;
  netRecoveryM: number;
  status: 'OPTIMAL' | 'RECOVERING' | 'STRESSED';
}

export interface HydrologicalBudget {
  parameter: string;
  volumeHaM: number;
  percentage: number;
  description: string;
}

export interface WatershedDefinition {
  id: string;
  name: string;
  code: string;
  basin: string;
  district: string;
  taluka: string;
  description: string;
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  stats: {
    name: string;
    code: string;
    basin: string;
    district: string;
    taluka: string;
    catchmentHa: number;
    totalInterventions: number;
    verifiedCount: number;
    meanNdviDelta: string;
    waterSpreadHa: number;
    waterSpreadDeltaPercent: number;
    estimatedStorageTcm: number;
    soilErosionAbatementPct: number;
    annualRainfallMm: number;
    rechargeRateMeters: string;
    beneficiaryFarmers: number;
    cropIntensityPct: number;
  };
  interventions: Intervention[];
  streams: StreamFeature[];
  wells: WellTelemetry[];
  priorityZones: PriorityZone[];
  evidence: FieldEvidenceItem[];
  ndviSeries: NdviDataPoint[];
  hydrologicalBudget: HydrologicalBudget[];
}

// ---------------------------------------------------------------------------
// 1. BHAVANI WATERSHED (Erode, Coimbatore, Nilgiris Foothills - Kaaveri Sub-Basin)
// ---------------------------------------------------------------------------
const bhavaniWatershed: WatershedDefinition = {
  id: 'bhavani',
  name: 'Lower Bhavani Micro-Catchment',
  code: 'TN-CAU-BHV-04',
  basin: 'Kaaveri Basin (Bhavani Sub-Catchment)',
  district: 'Erode & Coimbatore, Tamil Nadu',
  taluka: 'Sathyamangalam / Bhavanisagar / Mettupalayam',
  description: 'Foothill drainage corridors feeding Bhavanisagar Dam and Kodiveri Anicut canal networks across Coimbatore and Erode plains.',
  bounds: {
    minLat: 11.320,
    maxLat: 11.560,
    minLng: 77.020,
    maxLng: 77.300
  },
  stats: {
    name: 'Lower Bhavani Micro-Catchment',
    code: 'TN-CAU-BHV-04',
    basin: 'Kaaveri River Basin (Bhavani Tributary)',
    district: 'Erode & Coimbatore, Tamil Nadu',
    taluka: 'Sathyamangalam / Bhavanisagar',
    catchmentHa: 2420.5,
    totalInterventions: 12,
    verifiedCount: 10,
    meanNdviDelta: '+0.19',
    waterSpreadHa: 44.2,
    waterSpreadDeltaPercent: 184.5,
    estimatedStorageTcm: 34.2,
    soilErosionAbatementPct: 41.6,
    annualRainfallMm: 738.0,
    rechargeRateMeters: '+4.8m GL',
    beneficiaryFarmers: 580,
    cropIntensityPct: 162.4
  },
  interventions: [
    {
      id: 'int-01',
      code: 'CD-01',
      name: 'Sirumugai Upper Feeder Check Dam',
      type: 'Stone Masonry Check Dam',
      streamOrder: 3,
      latitude: 11.485,
      longitude: 77.085,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 5.4,
      catchmentAreaHa: 186.0,
      constructionYear: 2022,
      siltationPercent: 16,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: {
        confidence: 0.95,
        summary: 'Masonry weir crest structurally sound with 1.4m live impoundment. Silt deposition within operational limits.'
      }
    },
    {
      id: 'int-02',
      code: 'CD-02',
      name: 'Bhavanisagar Inflow Nala Bund',
      type: 'Reinforced Concrete Weir',
      streamOrder: 3,
      latitude: 11.468,
      longitude: 77.142,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 6.2,
      catchmentAreaHa: 215.0,
      constructionYear: 2023,
      siltationPercent: 22,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: {
        confidence: 0.92,
        summary: 'Effective surface retention. Stable boulder apron arrested downstream scour.'
      }
    },
    {
      id: 'int-03',
      code: 'CD-03',
      name: 'Alathukombai Cascade Check Dam',
      type: 'Cement Nala Bund (CNB)',
      streamOrder: 2,
      latitude: 11.435,
      longitude: 77.168,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 3.8,
      catchmentAreaHa: 98.0,
      constructionYear: 2022,
      siltationPercent: 18,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: {
        confidence: 0.94,
        summary: 'Spillway free from obstruction. Perennial seepage feeding downstream dug-wells.'
      }
    },
    {
      id: 'int-04',
      code: 'CD-04',
      name: 'Kodiveri Feeder Siltation Weir',
      type: 'Stone Masonry Check Dam',
      streamOrder: 3,
      latitude: 11.392,
      longitude: 77.215,
      status: 'MAINTENANCE_REQUIRED',
      capacityTcm: 4.6,
      catchmentAreaHa: 164.0,
      constructionYear: 2021,
      siltationPercent: 56,
      photoUrl: '/evidence/cd04.jpg',
      aiObservation: {
        confidence: 0.91,
        summary: 'Sediment encroachment covers 56% of live volume. Desilting scoop urgently recommended by AED.'
      }
    },
    {
      id: 'int-05',
      code: 'PT-01',
      name: 'Thoddampalayam Community Percolation Pond',
      type: 'Percolation Pond with Recharge Shaft',
      streamOrder: 2,
      latitude: 11.415,
      longitude: 77.112,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 8.5,
      catchmentAreaHa: 310.0,
      constructionYear: 2023,
      siltationPercent: 14,
      photoUrl: '/evidence/pt01.jpg',
      aiObservation: {
        confidence: 0.96,
        summary: 'Recharge shaft active. Rapid infiltration observed in surrounding agricultural open dug-wells.'
      }
    },
    {
      id: 'int-06',
      code: 'FP-01',
      name: 'Punjaipuliampatti Model Farm Pond',
      type: 'HDPE Lined Farm Pond',
      streamOrder: 1,
      latitude: 11.365,
      longitude: 77.178,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 1.2,
      catchmentAreaHa: 26.0,
      constructionYear: 2024,
      siltationPercent: 6,
      photoUrl: '/evidence/pt01.jpg',
      aiObservation: {
        confidence: 0.97,
        summary: 'Lining and silt trap functional. Dedicated micro-drip irrigation operating for turmeric and banana crops.'
      }
    },
    {
      id: 'int-07',
      code: 'CCT-01',
      name: 'Nilgiris Foothill Continuous Contour Trenches',
      type: 'Continuous Contour Trenching (CCT)',
      streamOrder: 1,
      latitude: 11.530,
      longitude: 77.065,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 2.4,
      catchmentAreaHa: 85.0,
      constructionYear: 2022,
      siltationPercent: 24,
      photoUrl: '/evidence/cct01.jpg',
      aiObservation: {
        confidence: 0.93,
        summary: 'Staggered contour trenches arrested steep foothill runoff. Dense vetiver grass established on bunds.'
      }
    },
    {
      id: 'int-08',
      code: 'CD-05',
      name: 'Kalingarayan Tributary Silt Trap',
      type: 'Concrete Check Dam',
      streamOrder: 4,
      latitude: 11.345,
      longitude: 77.265,
      status: 'PROPOSED',
      capacityTcm: 11.0,
      catchmentAreaHa: 520.0,
      constructionYear: 2026,
      siltationPercent: 0,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: {
        confidence: 0.86,
        summary: 'DPR sanctioned under WDC-PMKSY 2.0. Optimal bedrock foundation identified by PWD WRO engineers.'
      }
    },
    {
      id: 'int-09',
      code: 'LBS-01',
      name: 'Mettupalayam Ridge Gully Plugs',
      type: 'Loose Boulder Gully Plug',
      streamOrder: 1,
      latitude: 11.515,
      longitude: 77.042,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 0.6,
      catchmentAreaHa: 18.0,
      constructionYear: 2022,
      siltationPercent: 20,
      photoUrl: '/evidence/cct01.jpg',
      aiObservation: {
        confidence: 0.91,
        summary: 'Boulder keying arrested velocity along steep drainage gully.'
      }
    },
    {
      id: 'int-10',
      code: 'WAT-01',
      name: 'Sathyamangalam Water Absorption Trench',
      type: 'Water Absorption Trench (WAT)',
      streamOrder: 1,
      latitude: 11.505,
      longitude: 77.195,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 0.8,
      catchmentAreaHa: 24.0,
      constructionYear: 2023,
      siltationPercent: 12,
      photoUrl: '/evidence/cct01.jpg',
      aiObservation: {
        confidence: 0.94,
        summary: 'Contour bunding stabilized soil moisture across rabi crop parcels.'
      }
    },
    {
      id: 'int-11',
      code: 'FP-02',
      name: 'Alathur Horticultural Farm Pond',
      type: 'Earthen Farm Pond',
      streamOrder: 1,
      latitude: 11.378,
      longitude: 77.235,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 0.9,
      catchmentAreaHa: 20.0,
      constructionYear: 2024,
      siltationPercent: 8,
      photoUrl: '/evidence/pt01.jpg',
      aiObservation: {
        confidence: 0.95,
        summary: 'Micro-irrigation solar pump functioning for vegetable cultivation.'
      }
    },
    {
      id: 'int-12',
      code: 'CD-06',
      name: 'Gobichettipalayam South Nala Check Dam',
      type: 'Cement Nala Bund',
      streamOrder: 2,
      latitude: 11.355,
      longitude: 77.285,
      status: 'PROPOSED',
      capacityTcm: 4.2,
      catchmentAreaHa: 110.0,
      constructionYear: 2026,
      siltationPercent: 0,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: {
        confidence: 0.88,
        summary: 'Site cleared by Gram Sabha and sanctioned for construction post-monsoon.'
      }
    }
  ],
  streams: [
    {
      id: 'str-01',
      order: 4,
      coordinates: [
        [77.045, 11.510],
        [77.095, 11.480],
        [77.155, 11.445],
        [77.215, 11.390],
        [77.275, 11.345]
      ]
    },
    {
      id: 'str-02',
      order: 3,
      coordinates: [
        [77.065, 11.545],
        [77.085, 11.485],
        [77.155, 11.445]
      ]
    },
    {
      id: 'str-03',
      order: 3,
      coordinates: [
        [77.185, 11.520],
        [77.168, 11.435],
        [77.215, 11.390]
      ]
    },
    {
      id: 'str-04',
      order: 2,
      coordinates: [
        [77.035, 11.455],
        [77.075, 11.465],
        [77.095, 11.480]
      ]
    },
    {
      id: 'str-05',
      order: 2,
      coordinates: [
        [77.125, 11.380],
        [77.165, 11.410],
        [77.215, 11.390]
      ]
    },
    {
      id: 'str-06',
      order: 1,
      coordinates: [
        [77.030, 11.530],
        [77.065, 11.545]
      ]
    },
    {
      id: 'str-07',
      order: 1,
      coordinates: [
        [77.245, 11.465],
        [77.215, 11.425],
        [77.168, 11.435]
      ]
    },
    {
      id: 'str-08',
      order: 1,
      coordinates: [
        [77.255, 11.365],
        [77.275, 11.345]
      ]
    }
  ],
  wells: [
    { id: 'w-01', code: 'TN-DW-01', village: 'Sirumugai', farmerName: 'K. Palanisamy', latitude: 11.482, longitude: 77.088, depthMeters: 22.0, baselineWaterTableM: 15.4, currentWaterTableM: 7.8, netRecoveryM: 7.6, status: 'OPTIMAL' },
    { id: 'w-02', code: 'TN-DW-02', village: 'Bhavanisagar', farmerName: 'S. Murugesan (Panchayat Leader)', latitude: 11.465, longitude: 77.145, depthMeters: 24.5, baselineWaterTableM: 17.2, currentWaterTableM: 9.4, netRecoveryM: 7.8, status: 'OPTIMAL' },
    { id: 'w-03', code: 'TN-DW-03', village: 'Thoddampalayam', farmerName: 'P. Marimuthu', latitude: 11.412, longitude: 77.118, depthMeters: 18.0, baselineWaterTableM: 13.8, currentWaterTableM: 9.9, netRecoveryM: 3.9, status: 'RECOVERING' },
    { id: 'w-04', code: 'TN-DW-04', village: 'Kodiveri', farmerName: 'M. Selvaraj', latitude: 11.389, longitude: 77.218, depthMeters: 20.0, baselineWaterTableM: 14.5, currentWaterTableM: 7.6, netRecoveryM: 6.9, status: 'OPTIMAL' },
    { id: 'w-05', code: 'TN-DW-05', village: 'Alathukombai', farmerName: 'R. Balasubramaniam', latitude: 11.432, longitude: 77.172, depthMeters: 26.0, baselineWaterTableM: 18.6, currentWaterTableM: 11.2, netRecoveryM: 7.4, status: 'OPTIMAL' },
    { id: 'w-06', code: 'TN-DW-06', village: 'Punjaipuliampatti', farmerName: 'N. Thangavel', latitude: 11.362, longitude: 77.182, depthMeters: 21.0, baselineWaterTableM: 16.0, currentWaterTableM: 13.1, netRecoveryM: 2.9, status: 'STRESSED' },
  ],
  priorityZones: [
    {
      id: 'pz-01',
      name: 'Zone A - Sirumugai Nilgiris Foothill Slopes',
      areaHa: 64.5,
      riskLevel: 'CRITICAL',
      compositeScore: 92,
      reasons: [
        'Steep slope gradient exceeds 22% with severe sheet runoff from tea/scrub boundaries',
        'High velocity runoff threatens downstream check dam CD-01 and paddy fields',
        'RUSLE soil erosion rate estimated at 28.4 tons/Ha/year'
      ],
      recommendedAction: 'Construct Continuous Contour Trenches (CCT) + 4 Loose Boulder Gully Plugs + Vetiver hedges.'
    },
    {
      id: 'pz-02',
      name: 'Zone B - Sathyamangalam Floodplain & Canal Inflow',
      areaHa: 145.0,
      riskLevel: 'MODERATE',
      compositeScore: 56,
      reasons: [
        'Seasonal silt accumulation in Bhavani distributary channels',
        'Gentle slope (3.8%) with extensive turmeric and banana cultivation'
      ],
      recommendedAction: 'Percolation pond desilting + Broad Bed Furrow (BBF) in-situ conservation.'
    },
    {
      id: 'pz-03',
      name: 'Zone C - Alathukombai Gully Migration Corridor',
      areaHa: 78.0,
      riskLevel: 'HIGH',
      compositeScore: 82,
      reasons: [
        'Active gully headward migration at ~1.8m/year along 2nd order feeder stream',
        'Downstream check dam CD-04 currently operating at 56% silt accumulation'
      ],
      recommendedAction: 'Cascading Gabion Plugs (4 Units) + Desilting scoop at CD-04.'
    },
    {
      id: 'pz-04',
      name: 'Zone D - Lower Bhavani Canal Command Lowlands',
      areaHa: 95.0,
      riskLevel: 'LOW',
      compositeScore: 36,
      reasons: [
        'Stable slope (< 2.5%) and regulated canal discharge',
        'Minor drainage congestion during peak Northeast monsoon surges'
      ],
      recommendedAction: 'Sub-surface drainage tile maintenance and farm pond integration.'
    }
  ],
  evidence: [
    {
      id: 'ev-01',
      relatedInterventionId: 'int-01',
      caption: 'Post-Monsoon Water Impoundment at Sirumugai Check Dam (CD-01)',
      photoUrl: '/evidence/cd01.jpg',
      exif: {
        latitude: 11.48512,
        longitude: 77.08520,
        altitudeMeters: 385.0,
        bearingDeg: 145.0,
        compassDirection: 'SE',
        accuracyMeters: 1.8,
        timestamp: '2026-08-18T10:15:30Z',
        deviceModel: 'Trimble TDC600 GNSS Handheld'
      },
      aiObservation: {
        conditionSummary: 'Masonry weir crest intact with 1.4m live surface water retention. Zero downstream undercut.',
        confidence: 0.95,
        siltationPercent: 16
      }
    },
    {
      id: 'ev-02',
      relatedInterventionId: 'int-04',
      caption: 'Kodiveri Feeder Siltation Inspection at CD-04',
      photoUrl: '/evidence/cd04.jpg',
      exif: {
        latitude: 11.39245,
        longitude: 77.21510,
        altitudeMeters: 312.0,
        bearingDeg: 210.0,
        compassDirection: 'SW',
        accuracyMeters: 2.2,
        timestamp: '2026-08-20T11:45:10Z',
        deviceModel: 'Trimble TDC600 GNSS Handheld'
      },
      aiObservation: {
        conditionSummary: 'Severe sediment accumulation encroaching on 56% of weir live storage. Urgent desilting scoop logged.',
        confidence: 0.91,
        siltationPercent: 56
      }
    },
    {
      id: 'ev-03',
      relatedInterventionId: 'int-05',
      caption: 'Thoddampalayam Community Percolation Pond (PT-01)',
      photoUrl: '/evidence/pt01.jpg',
      exif: {
        latitude: 11.41508,
        longitude: 77.11215,
        altitudeMeters: 340.5,
        bearingDeg: 80.0,
        compassDirection: 'E',
        accuracyMeters: 1.9,
        timestamp: '2026-08-22T09:30:45Z',
        deviceModel: 'Trimble TDC600 GNSS Handheld'
      },
      aiObservation: {
        conditionSummary: 'Stone pitched embankments stable. Full water table head driving rapid radial aquifer infiltration.',
        confidence: 0.96,
        siltationPercent: 14
      }
    },
    {
      id: 'ev-04',
      relatedInterventionId: 'int-07',
      caption: 'Nilgiris Foothill Continuous Contour Trenches (CCT-01)',
      photoUrl: '/evidence/cct01.jpg',
      exif: {
        latitude: 11.53010,
        longitude: 77.06512,
        altitudeMeters: 510.0,
        bearingDeg: 195.0,
        compassDirection: 'S',
        accuracyMeters: 2.4,
        timestamp: '2026-08-25T14:15:20Z',
        deviceModel: 'Trimble TDC600 GNSS Handheld'
      },
      aiObservation: {
        conditionSummary: 'Staggered contour trenches stabilized foothill slopes. Healthy vetiver grass establishment across berms.',
        confidence: 0.93,
        siltationPercent: 24
      }
    }
  ],
  ndviSeries: [
    { month: 'Sep 25', ndvi: 0.32, baselineNdvi: 0.22, rainfallMm: 85.0 },
    { month: 'Oct 25', ndvi: 0.44, baselineNdvi: 0.28, rainfallMm: 165.0 },
    { month: 'Nov 25', ndvi: 0.52, baselineNdvi: 0.33, rainfallMm: 195.0 },
    { month: 'Dec 25', ndvi: 0.56, baselineNdvi: 0.35, rainfallMm: 98.0 },
    { month: 'Jan 26', ndvi: 0.51, baselineNdvi: 0.31, rainfallMm: 22.0 },
    { month: 'Feb 26', ndvi: 0.42, baselineNdvi: 0.27, rainfallMm: 12.0 },
    { month: 'Mar 26', ndvi: 0.36, baselineNdvi: 0.24, rainfallMm: 18.0 },
    { month: 'Apr 26', ndvi: 0.34, baselineNdvi: 0.21, rainfallMm: 42.0 },
    { month: 'May 26', ndvi: 0.38, baselineNdvi: 0.25, rainfallMm: 68.0 },
    { month: 'Jun 26', ndvi: 0.41, baselineNdvi: 0.28, rainfallMm: 45.0 },
    { month: 'Jul 26', ndvi: 0.45, baselineNdvi: 0.29, rainfallMm: 52.0 },
    { month: 'Aug 26', ndvi: 0.51, baselineNdvi: 0.32, rainfallMm: 78.0 }
  ],
  hydrologicalBudget: [
    { parameter: 'Total Catchment Precipitation Inflow', volumeHaM: 1786.3, percentage: 100.0, description: '2,420.5 Ha × 738mm annual rainfall (Northeast Monsoon dominated)' },
    { parameter: 'In-Situ Soil Moisture & Canopy Interception', volumeHaM: 785.9, percentage: 44.0, description: 'Sustained through CCT, horticultural bunding & paddy rootzones' },
    { parameter: 'Artificial Groundwater Aquifer Recharge', volumeHaM: 464.4, percentage: 26.0, description: 'Percolation ponds, check dams, and open well radial infiltration' },
    { parameter: 'Surface Water Harvest & Live Storage', volumeHaM: 357.2, percentage: 20.0, description: '12 civil structures yield (34.2 TCM live pool capacity)' },
    { parameter: 'Downstream Environmental Baseflow', volumeHaM: 178.6, percentage: 10.0, description: 'Regulated perennial discharge to Lower Bhavani Project canal' }
  ]
};

// ---------------------------------------------------------------------------
// 2. THAMIRABARANI BASIN (Tirunelveli, Tenkasi, Thoothukudi)
// ---------------------------------------------------------------------------
const thamirabaraniWatershed: WatershedDefinition = {
  id: 'thamirabarani',
  name: 'Upper Thamirabarani River Catchment',
  code: 'TN-THM-TNV-08',
  basin: 'Thamirabarani River Basin',
  district: 'Tirunelveli & Tenkasi, Tamil Nadu',
  taluka: 'Ambasamudram / Papanasam / Cheranmahadevi',
  description: 'Western Ghats Agasthyamalai foothill streams feeding Papanasam reservoir, Manimuthar river, and Marudur Anicut network.',
  bounds: {
    minLat: 8.640,
    maxLat: 8.860,
    minLng: 77.300,
    maxLng: 77.580
  },
  stats: {
    name: 'Upper Thamirabarani Catchment',
    code: 'TN-THM-TNV-08',
    basin: 'Thamirabarani River Basin',
    district: 'Tirunelveli & Tenkasi, Tamil Nadu',
    taluka: 'Ambasamudram / Papanasam',
    catchmentHa: 1980.0,
    totalInterventions: 10,
    verifiedCount: 9,
    meanNdviDelta: '+0.21',
    waterSpreadHa: 36.8,
    waterSpreadDeltaPercent: 165.2,
    estimatedStorageTcm: 31.5,
    soilErosionAbatementPct: 44.2,
    annualRainfallMm: 865.0,
    rechargeRateMeters: '+5.2m GL',
    beneficiaryFarmers: 510,
    cropIntensityPct: 178.5
  },
  interventions: [
    {
      id: 'thm-01',
      code: 'THM-CD-01',
      name: 'Papanasam Foothills Stream Check Dam',
      type: 'Stone Masonry Check Dam',
      streamOrder: 3,
      latitude: 8.712,
      longitude: 77.375,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 4.8,
      catchmentAreaHa: 160.0,
      constructionYear: 2022,
      siltationPercent: 14,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: { confidence: 0.96, summary: 'Structurally sound masonry weir. Perennial streamflow impounded.' }
    },
    {
      id: 'thm-02',
      code: 'THM-CD-02',
      name: 'Manimuthar Feeder Nala Bund',
      type: 'Reinforced Concrete Weir',
      streamOrder: 3,
      latitude: 8.685,
      longitude: 77.415,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 5.5,
      catchmentAreaHa: 195.0,
      constructionYear: 2023,
      siltationPercent: 18,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: { confidence: 0.94, summary: 'Apron and wing walls in optimal state with stable upstream pool.' }
    },
    {
      id: 'thm-03',
      code: 'THM-PT-01',
      name: 'Cheranmahadevi Cascade Oorani Tank',
      type: 'Traditional Oorani / Percolation Tank',
      streamOrder: 2,
      latitude: 8.680,
      longitude: 77.525,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 7.2,
      catchmentAreaHa: 260.0,
      constructionYear: 2021,
      siltationPercent: 12,
      photoUrl: '/evidence/pt01.jpg',
      aiObservation: { confidence: 0.97, summary: 'Rejuvenated tank with stone pitching. High infiltration rate into village dug-wells.' }
    },
    {
      id: 'thm-04',
      code: 'THM-CCT-01',
      name: 'Agasthyamalai Foothill Contour Trenches',
      type: 'Contour Trenching (CCT)',
      streamOrder: 1,
      latitude: 8.745,
      longitude: 77.335,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 2.1,
      catchmentAreaHa: 75.0,
      constructionYear: 2022,
      siltationPercent: 22,
      photoUrl: '/evidence/cct01.jpg',
      aiObservation: { confidence: 0.92, summary: 'Arrested steep runoff from Western Ghats buffer zone. Grass cover dense.' }
    },
    {
      id: 'thm-05',
      code: 'THM-CD-03',
      name: 'Ambasamudram Sub-Basin Silt Trap',
      type: 'Cement Nala Bund',
      streamOrder: 2,
      latitude: 8.705,
      longitude: 77.465,
      status: 'MAINTENANCE_REQUIRED',
      capacityTcm: 3.6,
      catchmentAreaHa: 130.0,
      constructionYear: 2021,
      siltationPercent: 52,
      photoUrl: '/evidence/cd04.jpg',
      aiObservation: { confidence: 0.90, summary: 'Fine sand sediment accumulation detected. Desilting scoop scheduled.' }
    }
  ],
  streams: [
    {
      id: 'thm-str-01',
      order: 4,
      coordinates: [
        [77.320, 8.735],
        [77.385, 8.710],
        [77.455, 8.695],
        [77.545, 8.675]
      ]
    },
    {
      id: 'thm-str-02',
      order: 3,
      coordinates: [
        [77.355, 8.765],
        [77.385, 8.710]
      ]
    },
    {
      id: 'thm-str-03',
      order: 2,
      coordinates: [
        [77.420, 8.655],
        [77.455, 8.695]
      ]
    }
  ],
  wells: [
    { id: 'tw-01', code: 'THM-W-01', village: 'Kallidaikurichi', farmerName: 'S. Subbiah Thevar', latitude: 8.695, longitude: 77.460, depthMeters: 19.5, baselineWaterTableM: 14.2, currentWaterTableM: 6.8, netRecoveryM: 7.4, status: 'OPTIMAL' },
    { id: 'tw-02', code: 'THM-W-02', village: 'Papanasam', farmerName: 'M. Arumugam Pillai', latitude: 8.715, longitude: 77.380, depthMeters: 16.0, baselineWaterTableM: 11.5, currentWaterTableM: 5.2, netRecoveryM: 6.3, status: 'OPTIMAL' },
    { id: 'tw-03', code: 'THM-W-03', village: 'Cheranmahadevi', farmerName: 'K. Vellapandi', latitude: 8.682, longitude: 77.530, depthMeters: 22.0, baselineWaterTableM: 15.8, currentWaterTableM: 8.4, netRecoveryM: 7.4, status: 'OPTIMAL' },
    { id: 'tw-04', code: 'THM-W-04', village: 'Mukkudal', farmerName: 'T. Sankaranarayanan', latitude: 8.730, longitude: 77.510, depthMeters: 20.5, baselineWaterTableM: 14.8, currentWaterTableM: 11.0, netRecoveryM: 3.8, status: 'RECOVERING' }
  ],
  priorityZones: [
    {
      id: 'thm-pz-01',
      name: 'Zone A - Papanasam Agasthyamalai Slopes',
      areaHa: 52.0,
      riskLevel: 'CRITICAL',
      compositeScore: 90,
      reasons: ['Slope > 24% along Western Ghats edge', 'High runoff velocity after heavy Northeast monsoon spells'],
      recommendedAction: 'Contour trenching + loose boulder check dams + afforestation.'
    },
    {
      id: 'thm-pz-02',
      name: 'Zone B - Ambasamudram Agricultural Corridor',
      areaHa: 110.0,
      riskLevel: 'MODERATE',
      compositeScore: 48,
      reasons: ['Seasonal siltation in irrigation channels', 'Paddy double-crop command area'],
      recommendedAction: 'Supply channel desilting and field bund enhancement.'
    }
  ],
  evidence: [
    {
      id: 'thm-ev-01',
      relatedInterventionId: 'thm-01',
      caption: 'Papanasam Stream Check Dam Water Impoundment',
      photoUrl: '/evidence/cd01.jpg',
      exif: {
        latitude: 8.71210,
        longitude: 77.37515,
        altitudeMeters: 245.0,
        bearingDeg: 120.0,
        compassDirection: 'SE',
        accuracyMeters: 1.5,
        timestamp: '2026-08-16T11:20:00Z',
        deviceModel: 'Trimble TDC600 GNSS'
      },
      aiObservation: { conditionSummary: 'Perennial flow impounded. Crest masonry intact.', confidence: 0.96, siltationPercent: 14 }
    },
    {
      id: 'thm-ev-02',
      relatedInterventionId: 'thm-03',
      caption: 'Cheranmahadevi Cascade Oorani Tank Verification',
      photoUrl: '/evidence/pt01.jpg',
      exif: {
        latitude: 8.68015,
        longitude: 77.52520,
        altitudeMeters: 110.0,
        bearingDeg: 75.0,
        compassDirection: 'E',
        accuracyMeters: 1.8,
        timestamp: '2026-08-21T09:45:00Z',
        deviceModel: 'Trimble TDC600 GNSS'
      },
      aiObservation: { conditionSummary: 'Traditional tank rejuvenation successful with stable bunds.', confidence: 0.97, siltationPercent: 12 }
    }
  ],
  ndviSeries: [
    { month: 'Sep 25', ndvi: 0.35, baselineNdvi: 0.24, rainfallMm: 72.0 },
    { month: 'Oct 25', ndvi: 0.48, baselineNdvi: 0.30, rainfallMm: 210.0 },
    { month: 'Nov 25', ndvi: 0.58, baselineNdvi: 0.36, rainfallMm: 260.0 },
    { month: 'Dec 25', ndvi: 0.59, baselineNdvi: 0.38, rainfallMm: 140.0 },
    { month: 'Jan 26', ndvi: 0.54, baselineNdvi: 0.33, rainfallMm: 35.0 },
    { month: 'Feb 26', ndvi: 0.46, baselineNdvi: 0.28, rainfallMm: 15.0 },
    { month: 'Mar 26', ndvi: 0.40, baselineNdvi: 0.25, rainfallMm: 25.0 },
    { month: 'Apr 26', ndvi: 0.38, baselineNdvi: 0.23, rainfallMm: 45.0 },
    { month: 'May 26', ndvi: 0.42, baselineNdvi: 0.27, rainfallMm: 60.0 },
    { month: 'Jun 26', ndvi: 0.45, baselineNdvi: 0.29, rainfallMm: 40.0 },
    { month: 'Jul 26', ndvi: 0.48, baselineNdvi: 0.31, rainfallMm: 50.0 },
    { month: 'Aug 26', ndvi: 0.53, baselineNdvi: 0.34, rainfallMm: 80.0 }
  ],
  hydrologicalBudget: [
    { parameter: 'Total Catchment Precipitation Inflow', volumeHaM: 1712.7, percentage: 100.0, description: '1,980 Ha × 865mm annual normal rainfall' },
    { parameter: 'In-Situ Soil Moisture & Canopy Interception', volumeHaM: 770.7, percentage: 45.0, description: 'Agasthyamalai forest & paddy vegetation absorption' },
    { parameter: 'Artificial Groundwater Aquifer Recharge', volumeHaM: 428.2, percentage: 25.0, description: 'Oorani cascade tanks and check dams infiltration' },
    { parameter: 'Surface Water Harvest & Live Storage', volumeHaM: 342.5, percentage: 20.0, description: '10 structures yield (31.5 TCM capacity)' },
    { parameter: 'Downstream River Discharge to Sea', volumeHaM: 171.3, percentage: 10.0, description: 'Environmental flow past Srivaikuntam Anicut' }
  ]
};

// ---------------------------------------------------------------------------
// 3. VAIGAI CATCHMENT (Theni, Madurai, Dindigul Foothills)
// ---------------------------------------------------------------------------
const vaigaiWatershed: WatershedDefinition = {
  id: 'vaigai',
  name: 'Upper Vaigai Catchment (Varushanadu)',
  code: 'TN-VAI-MDU-02',
  basin: 'Vaigai River Basin',
  district: 'Theni & Madurai, Tamil Nadu',
  taluka: 'Andipatti / Usilampatti / Periyakulam',
  description: 'Varushanadu and Megamalai foothill drainage feeding Vaigai Dam and downstream Madurai irrigation cascade tanks.',
  bounds: {
    minLat: 9.820,
    maxLat: 10.120,
    minLng: 77.480,
    maxLng: 77.820
  },
  stats: {
    name: 'Upper Vaigai Catchment',
    code: 'TN-VAI-MDU-02',
    basin: 'Vaigai River Basin',
    district: 'Theni & Madurai, Tamil Nadu',
    taluka: 'Andipatti / Usilampatti',
    catchmentHa: 2150.0,
    totalInterventions: 10,
    verifiedCount: 9,
    meanNdviDelta: '+0.18',
    waterSpreadHa: 39.5,
    waterSpreadDeltaPercent: 172.0,
    estimatedStorageTcm: 29.8,
    soilErosionAbatementPct: 39.5,
    annualRainfallMm: 712.0,
    rechargeRateMeters: '+4.5m GL',
    beneficiaryFarmers: 460,
    cropIntensityPct: 156.0
  },
  interventions: [
    {
      id: 'vai-01',
      code: 'VAI-CD-01',
      name: 'Varushanadu Stream Masonry Check Dam',
      type: 'Stone Masonry Check Dam',
      streamOrder: 3,
      latitude: 9.920,
      longitude: 77.585,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 4.5,
      catchmentAreaHa: 145.0,
      constructionYear: 2022,
      siltationPercent: 15,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: { confidence: 0.95, summary: 'Masonry weir intact. Effective post-monsoon storage.' }
    },
    {
      id: 'vai-02',
      code: 'VAI-CD-02',
      name: 'Andipatti Foothill Feeder Bund',
      type: 'Reinforced Concrete Weir',
      streamOrder: 3,
      latitude: 9.975,
      longitude: 77.640,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 5.2,
      catchmentAreaHa: 180.0,
      constructionYear: 2023,
      siltationPercent: 20,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: { confidence: 0.93, summary: 'Stable storage impoundment along seasonal tributary.' }
    },
    {
      id: 'vai-03',
      code: 'VAI-PT-01',
      name: 'Usilampatti Community Oorani Tank',
      type: 'Percolation Pond / Oorani',
      streamOrder: 2,
      latitude: 9.965,
      longitude: 77.720,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 7.8,
      catchmentAreaHa: 280.0,
      constructionYear: 2022,
      siltationPercent: 16,
      photoUrl: '/evidence/pt01.jpg',
      aiObservation: { confidence: 0.96, summary: 'Recharge shaft operational. Aquifer recovery in surrounding wells.' }
    },
    {
      id: 'vai-04',
      code: 'VAI-CCT-01',
      name: 'Megamalai Foothill Contour Trenches',
      type: 'Contour Trenching (CCT)',
      streamOrder: 1,
      latitude: 9.875,
      longitude: 77.525,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 2.2,
      catchmentAreaHa: 80.0,
      constructionYear: 2022,
      siltationPercent: 25,
      photoUrl: '/evidence/cct01.jpg',
      aiObservation: { confidence: 0.91, summary: 'Contour trenches effectively arrested slope sheet wash.' }
    },
    {
      id: 'vai-05',
      code: 'VAI-CD-03',
      name: 'Sholavandan Tributary Silt Trap',
      type: 'Cement Nala Bund',
      streamOrder: 3,
      latitude: 10.020,
      longitude: 77.780,
      status: 'MAINTENANCE_REQUIRED',
      capacityTcm: 3.9,
      catchmentAreaHa: 140.0,
      constructionYear: 2021,
      siltationPercent: 54,
      photoUrl: '/evidence/cd04.jpg',
      aiObservation: { confidence: 0.90, summary: 'Sediment encroachment covers 54% of live storage. Desilting scoop required.' }
    }
  ],
  streams: [
    {
      id: 'vai-str-01',
      order: 4,
      coordinates: [
        [77.510, 9.880],
        [77.585, 9.920],
        [77.680, 9.980],
        [77.790, 10.040]
      ]
    },
    {
      id: 'vai-str-02',
      order: 3,
      coordinates: [
        [77.560, 9.990],
        [77.640, 9.975],
        [77.680, 9.980]
      ]
    },
    {
      id: 'vai-str-03',
      order: 2,
      coordinates: [
        [77.730, 9.930],
        [77.720, 9.965],
        [77.790, 10.040]
      ]
    }
  ],
  wells: [
    { id: 'vw-01', code: 'VAI-W-01', village: 'Varushanadu', farmerName: 'M. Karuppasamy', latitude: 9.915, longitude: 77.590, depthMeters: 20.0, baselineWaterTableM: 14.8, currentWaterTableM: 8.2, netRecoveryM: 6.6, status: 'OPTIMAL' },
    { id: 'vw-02', code: 'VAI-W-02', village: 'Andipatti', farmerName: 'P. Alagarsamy (Sarpanch)', latitude: 9.972, longitude: 77.645, depthMeters: 23.5, baselineWaterTableM: 16.5, currentWaterTableM: 9.8, netRecoveryM: 6.7, status: 'OPTIMAL' },
    { id: 'vw-03', code: 'VAI-W-03', village: 'Usilampatti', farmerName: 'K. Muthiah', latitude: 9.960, longitude: 77.725, depthMeters: 18.0, baselineWaterTableM: 13.2, currentWaterTableM: 8.7, netRecoveryM: 4.5, status: 'RECOVERING' },
    { id: 'vw-04', code: 'VAI-W-04', village: 'Sholavandan', farmerName: 'V. Sundaram', latitude: 10.025, longitude: 77.785, depthMeters: 21.0, baselineWaterTableM: 15.1, currentWaterTableM: 8.5, netRecoveryM: 6.6, status: 'OPTIMAL' }
  ],
  priorityZones: [
    {
      id: 'vai-pz-01',
      name: 'Zone A - Varushanadu Steep Ridge Corridor',
      areaHa: 58.0,
      riskLevel: 'CRITICAL',
      compositeScore: 89,
      reasons: ['Slope > 20% along Western Ghats catchment', 'High runoff velocity during October cyclonic rainfall'],
      recommendedAction: 'Contour trenches (CCT) + Gully plugs + vegetative cover.'
    },
    {
      id: 'vai-pz-02',
      name: 'Zone B - Usilampatti Rainfed Plateau',
      areaHa: 130.0,
      riskLevel: 'MODERATE',
      compositeScore: 52,
      reasons: ['Hard rock granite terrain with low natural percolation', 'Traditional tank siltation'],
      recommendedAction: 'Percolation tank desilting + Recharge shafts in tank beds.'
    }
  ],
  evidence: [
    {
      id: 'vai-ev-01',
      relatedInterventionId: 'vai-01',
      caption: 'Varushanadu Stream Masonry Check Dam Impoundment',
      photoUrl: '/evidence/cd01.jpg',
      exif: {
        latitude: 9.92015,
        longitude: 77.58525,
        altitudeMeters: 290.0,
        bearingDeg: 130.0,
        compassDirection: 'SE',
        accuracyMeters: 1.8,
        timestamp: '2026-08-17T10:30:00Z',
        deviceModel: 'Trimble TDC600'
      },
      aiObservation: { conditionSummary: 'Weir structurally sound with 1.3m impoundment.', confidence: 0.95, siltationPercent: 15 }
    },
    {
      id: 'vai-ev-02',
      relatedInterventionId: 'vai-03',
      caption: 'Usilampatti Cascade Oorani Tank Verification',
      photoUrl: '/evidence/pt01.jpg',
      exif: {
        latitude: 9.96510,
        longitude: 77.72020,
        altitudeMeters: 185.0,
        bearingDeg: 90.0,
        compassDirection: 'E',
        accuracyMeters: 2.0,
        timestamp: '2026-08-22T14:15:00Z',
        deviceModel: 'Trimble TDC600'
      },
      aiObservation: { conditionSummary: 'Tank embankment restored with active percolation.', confidence: 0.96, siltationPercent: 16 }
    }
  ],
  ndviSeries: [
    { month: 'Sep 25', ndvi: 0.28, baselineNdvi: 0.20, rainfallMm: 65.0 },
    { month: 'Oct 25', ndvi: 0.42, baselineNdvi: 0.27, rainfallMm: 180.0 },
    { month: 'Nov 25', ndvi: 0.50, baselineNdvi: 0.32, rainfallMm: 195.0 },
    { month: 'Dec 25', ndvi: 0.52, baselineNdvi: 0.34, rainfallMm: 85.0 },
    { month: 'Jan 26', ndvi: 0.47, baselineNdvi: 0.30, rainfallMm: 18.0 },
    { month: 'Feb 26', ndvi: 0.39, baselineNdvi: 0.25, rainfallMm: 10.0 },
    { month: 'Mar 26', ndvi: 0.33, baselineNdvi: 0.22, rainfallMm: 15.0 },
    { month: 'Apr 26', ndvi: 0.32, baselineNdvi: 0.20, rainfallMm: 38.0 },
    { month: 'May 26', ndvi: 0.36, baselineNdvi: 0.23, rainfallMm: 55.0 },
    { month: 'Jun 26', ndvi: 0.38, baselineNdvi: 0.25, rainfallMm: 35.0 },
    { month: 'Jul 26', ndvi: 0.41, baselineNdvi: 0.26, rainfallMm: 45.0 },
    { month: 'Aug 26', ndvi: 0.46, baselineNdvi: 0.29, rainfallMm: 60.0 }
  ],
  hydrologicalBudget: [
    { parameter: 'Total Catchment Precipitation Inflow', volumeHaM: 1530.8, percentage: 100.0, description: '2,150 Ha × 712mm annual normal rainfall' },
    { parameter: 'In-Situ Soil Moisture & Canopy Interception', volumeHaM: 658.2, percentage: 43.0, description: 'Enhanced through farm bunding and horti-pastoral cover' },
    { parameter: 'Artificial Groundwater Aquifer Recharge', volumeHaM: 398.0, percentage: 26.0, description: 'Oorani tanks, recharge shafts, and check dams infiltration' },
    { parameter: 'Surface Water Harvest & Live Storage', volumeHaM: 321.5, percentage: 21.0, description: '10 structures yield (29.8 TCM capacity)' },
    { parameter: 'Downstream Flow to Vaigai Dam', volumeHaM: 153.1, percentage: 10.0, description: 'Runoff yield feeding Vaigai Reservoir storage' }
  ]
};

// ---------------------------------------------------------------------------
// 4. KAAVERI DELTA CATCHMENT (Tiruchirappalli, Thanjavur - Grand Anicut / Kallanai)
// ---------------------------------------------------------------------------
const kaaveriWatershed: WatershedDefinition = {
  id: 'kaaveri',
  name: 'Grand Anicut Kaaveri Delta Catchment',
  code: 'TN-CAU-KAV-01',
  basin: 'Kaaveri Main Delta Basin',
  district: 'Tiruchirappalli & Thanjavur, Tamil Nadu',
  taluka: 'Thiruvaiyaru / Budalur / Thiruverumbur',
  description: 'Ancient Kallanai Grand Anicut delta convergence partitioning Kaaveri, Kollidam, Vennar, and Grand Anicut canal.',
  bounds: {
    minLat: 10.740,
    maxLat: 10.960,
    minLng: 78.680,
    maxLng: 79.050
  },
  stats: {
    name: 'Grand Anicut Kaaveri Catchment',
    code: 'TN-CAU-KAV-01',
    basin: 'Kaaveri Main Delta Basin',
    district: 'Tiruchirappalli & Thanjavur, Tamil Nadu',
    taluka: 'Thiruvaiyaru / Budalur',
    catchmentHa: 2860.0,
    totalInterventions: 10,
    verifiedCount: 9,
    meanNdviDelta: '+0.23',
    waterSpreadHa: 52.4,
    waterSpreadDeltaPercent: 195.0,
    estimatedStorageTcm: 42.0,
    soilErosionAbatementPct: 36.8,
    annualRainfallMm: 920.0,
    rechargeRateMeters: '+5.6m GL',
    beneficiaryFarmers: 720,
    cropIntensityPct: 188.0
  },
  interventions: [
    {
      id: 'kav-01',
      code: 'KAV-CD-01',
      name: 'Grand Anicut Headworks Silt Trap',
      type: 'Stone Masonry Regulator & Silt Trap',
      streamOrder: 4,
      latitude: 10.835,
      longitude: 78.820,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 8.5,
      catchmentAreaHa: 420.0,
      constructionYear: 2021,
      siltationPercent: 18,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: { confidence: 0.97, summary: 'Grand Anicut regulator crest intact with monitored sediment flushing.' }
    },
    {
      id: 'kav-02',
      code: 'KAV-CD-02',
      name: 'Vennar Feeder Canal Check Dam',
      type: 'Reinforced Concrete Weir',
      streamOrder: 3,
      latitude: 10.810,
      longitude: 78.895,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 6.8,
      catchmentAreaHa: 240.0,
      constructionYear: 2023,
      siltationPercent: 14,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: { confidence: 0.95, summary: 'Hydraulic jump stabilized with active irrigation discharge.' }
    },
    {
      id: 'kav-03',
      code: 'KAV-PT-01',
      name: 'Budalur Community Cascade Oorani',
      type: 'Traditional Oorani / Percolation Tank',
      streamOrder: 2,
      latitude: 10.795,
      longitude: 78.965,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 9.2,
      catchmentAreaHa: 340.0,
      constructionYear: 2022,
      siltationPercent: 12,
      photoUrl: '/evidence/pt01.jpg',
      aiObservation: { confidence: 0.98, summary: 'Full storage pool recharge feeding surrounding village shallow aquifers.' }
    },
    {
      id: 'kav-04',
      code: 'KAV-CD-03',
      name: 'Koviladi Canal Siltation Weir',
      type: 'Stone Masonry Check Dam',
      streamOrder: 3,
      latitude: 10.855,
      longitude: 78.865,
      status: 'MAINTENANCE_REQUIRED',
      capacityTcm: 4.8,
      catchmentAreaHa: 175.0,
      constructionYear: 2021,
      siltationPercent: 55,
      photoUrl: '/evidence/cd04.jpg',
      aiObservation: { confidence: 0.91, summary: 'Heavy fine clay sediment accumulated. Desilting scoop sanctioned.' }
    }
  ],
  streams: [
    {
      id: 'kav-str-01',
      order: 4,
      coordinates: [
        [78.710, 10.850],
        [78.820, 10.835],
        [78.910, 10.815],
        [79.020, 10.790]
      ]
    },
    {
      id: 'kav-str-02',
      order: 3,
      coordinates: [
        [78.820, 10.835],
        [78.865, 10.885],
        [78.960, 10.910]
      ]
    },
    {
      id: 'kav-str-03',
      order: 3,
      coordinates: [
        [78.820, 10.835],
        [78.895, 10.810],
        [78.980, 10.765]
      ]
    }
  ],
  wells: [
    { id: 'kw-01', code: 'KAV-W-01', village: 'Kallanai', farmerName: 'R. Swaminathan', latitude: 10.838, longitude: 78.825, depthMeters: 15.0, baselineWaterTableM: 10.2, currentWaterTableM: 4.1, netRecoveryM: 6.1, status: 'OPTIMAL' },
    { id: 'kw-02', code: 'KAV-W-02', village: 'Budalur', farmerName: 'A. Thangarasu (Sarpanch)', latitude: 10.798, longitude: 78.968, depthMeters: 18.5, baselineWaterTableM: 13.5, currentWaterTableM: 6.8, netRecoveryM: 6.7, status: 'OPTIMAL' },
    { id: 'kw-03', code: 'KAV-W-03', village: 'Koviladi', farmerName: 'M. Natarajan', latitude: 10.858, longitude: 78.868, depthMeters: 14.0, baselineWaterTableM: 9.8, currentWaterTableM: 4.6, netRecoveryM: 5.2, status: 'OPTIMAL' },
    { id: 'kw-04', code: 'KAV-W-04', village: 'Thiruvaiyaru', farmerName: 'K. Govindaraj', latitude: 10.880, longitude: 78.930, depthMeters: 16.0, baselineWaterTableM: 11.2, currentWaterTableM: 7.9, netRecoveryM: 3.3, status: 'RECOVERING' }
  ],
  priorityZones: [
    {
      id: 'kav-pz-01',
      name: 'Zone A - Grand Anicut Delta Silt Accumulation',
      areaHa: 85.0,
      riskLevel: 'HIGH',
      compositeScore: 84,
      reasons: ['Heavy alluvial silt load deposition during peak flood discharge', 'Inlet channel choking risk'],
      recommendedAction: 'Automated scour sluice desilting + riparian vegetation stabilization.'
    },
    {
      id: 'kav-pz-02',
      name: 'Zone B - Budalur Rainfed Silt Trap Belt',
      areaHa: 160.0,
      riskLevel: 'MODERATE',
      compositeScore: 45,
      reasons: ['Sandy loam soil with rapid drainage', 'Cascade tank network requires inter-tank link desilting'],
      recommendedAction: 'Cascade tank supply channel clearance and recharge shaft maintenance.'
    }
  ],
  evidence: [
    {
      id: 'kav-ev-01',
      relatedInterventionId: 'kav-01',
      caption: 'Grand Anicut Delta Headworks Silt Trap Inspection',
      photoUrl: '/evidence/cd01.jpg',
      exif: {
        latitude: 10.83515,
        longitude: 78.82020,
        altitudeMeters: 75.0,
        bearingDeg: 110.0,
        compassDirection: 'E',
        accuracyMeters: 1.5,
        timestamp: '2026-08-19T09:15:00Z',
        deviceModel: 'Trimble TDC600'
      },
      aiObservation: { conditionSummary: 'Headworks sluice operational with monitored sediment flushing.', confidence: 0.97, siltationPercent: 18 }
    },
    {
      id: 'kav-ev-02',
      relatedInterventionId: 'kav-03',
      caption: 'Budalur Community Oorani Tank Verification',
      photoUrl: '/evidence/pt01.jpg',
      exif: {
        latitude: 10.79512,
        longitude: 78.96525,
        altitudeMeters: 62.0,
        bearingDeg: 85.0,
        compassDirection: 'E',
        accuracyMeters: 1.8,
        timestamp: '2026-08-23T15:30:00Z',
        deviceModel: 'Trimble TDC600'
      },
      aiObservation: { conditionSummary: 'Full storage pool recharge driving rapid shallow aquifer replenishment.', confidence: 0.98, siltationPercent: 12 }
    }
  ],
  ndviSeries: [
    { month: 'Sep 25', ndvi: 0.36, baselineNdvi: 0.25, rainfallMm: 80.0 },
    { month: 'Oct 25', ndvi: 0.54, baselineNdvi: 0.32, rainfallMm: 240.0 },
    { month: 'Nov 25', ndvi: 0.64, baselineNdvi: 0.38, rainfallMm: 290.0 },
    { month: 'Dec 25', ndvi: 0.62, baselineNdvi: 0.36, rainfallMm: 120.0 },
    { month: 'Jan 26', ndvi: 0.58, baselineNdvi: 0.33, rainfallMm: 25.0 },
    { month: 'Feb 26', ndvi: 0.49, baselineNdvi: 0.29, rainfallMm: 12.0 },
    { month: 'Mar 26', ndvi: 0.42, baselineNdvi: 0.26, rainfallMm: 15.0 },
    { month: 'Apr 26', ndvi: 0.39, baselineNdvi: 0.23, rainfallMm: 35.0 },
    { month: 'May 26', ndvi: 0.44, baselineNdvi: 0.26, rainfallMm: 50.0 },
    { month: 'Jun 26', ndvi: 0.48, baselineNdvi: 0.29, rainfallMm: 42.0 },
    { month: 'Jul 26', ndvi: 0.52, baselineNdvi: 0.31, rainfallMm: 55.0 },
    { month: 'Aug 26', ndvi: 0.59, baselineNdvi: 0.35, rainfallMm: 75.0 }
  ],
  hydrologicalBudget: [
    { parameter: 'Total Catchment Precipitation Inflow', volumeHaM: 2631.2, percentage: 100.0, description: '2,860 Ha × 920mm annual rainfall (Northeast Monsoon flood surplus)' },
    { parameter: 'In-Situ Soil Moisture & Canopy Interception', volumeHaM: 1184.0, percentage: 45.0, description: 'Delta paddy wetland rootzones and horticulture absorption' },
    { parameter: 'Artificial Groundwater Aquifer Recharge', volumeHaM: 657.8, percentage: 25.0, description: 'Cascade Oorani tanks, recharge shafts, and canal infiltration' },
    { parameter: 'Surface Water Harvest & Live Storage', volumeHaM: 526.2, percentage: 20.0, description: '10 structures yield (42.0 TCM capacity)' },
    { parameter: 'Downstream Delta Discharge to Bay of Bengal', volumeHaM: 263.1, percentage: 10.0, description: 'Surplus flood discharge through Kollidam Coleroon River' }
  ]
};

// ---------------------------------------------------------------------------
// 5. PIMPALGAON-KHADAK MICRO-CATCHMENT 4E2B5c-09 (Ahilyanagar, Maharashtra - Godavari Basin)
// Flagship Demonstration Micro-Catchment for PMKSY-WDC 2.0
// ---------------------------------------------------------------------------
const pimpalgaonWatershed: WatershedDefinition = {
  id: 'pimpalgaon',
  name: 'Micro-Catchment 4E2B5c-09 (Pimpalgaon-Khadak)',
  code: '4E2B5c-09',
  basin: 'Godavari Basin (Pravara-Mula Sub-Catchment)',
  district: 'Ahilyanagar (Ahmednagar), Maharashtra',
  taluka: 'Akole / Sangamner / Parner Semi-Arid Belt',
  description: 'Deccan trap basaltic plateau micro-catchment under PMKSY-WDC 2.0 exhibiting ridge-to-valley soil-water conservation interventions in drought-prone central Maharashtra.',
  bounds: {
    minLat: 19.120,
    maxLat: 19.260,
    minLng: 74.610,
    maxLng: 74.820
  },
  stats: {
    name: 'Micro-Catchment 4E2B5c-09',
    code: '4E2B5c-09',
    basin: 'Godavari Basin (Pravara / Mula Tributary)',
    district: 'Ahilyanagar (Ahmednagar), Maharashtra',
    taluka: 'Akole / Sangamner',
    catchmentHa: 1840.0,
    totalInterventions: 14,
    verifiedCount: 12,
    meanNdviDelta: '+0.22',
    waterSpreadHa: 38.6,
    waterSpreadDeltaPercent: 172.4,
    estimatedStorageTcm: 36.4,
    soilErosionAbatementPct: 52.8,
    annualRainfallMm: 580.0,
    rechargeRateMeters: '+4.8m GL',
    beneficiaryFarmers: 640,
    cropIntensityPct: 154.2
  },
  interventions: [
    {
      id: 'pk-cd-01',
      code: '4E-CD-01',
      name: 'Pimpalgaon Main Stream Check Dam',
      type: 'Stone Masonry Check Dam',
      streamOrder: 3,
      latitude: 19.1852,
      longitude: 74.6954,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 5.2,
      catchmentAreaHa: 210.0,
      constructionYear: 2022,
      siltationPercent: 16,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: { confidence: 0.96, summary: 'Masonry weir crest intact with 1.4m live storage pool. Downstream basalt rock apron in sound condition.' }
    },
    {
      id: 'pk-cd-02',
      code: '4E-CD-02',
      name: 'Khadakwadi Feeder Nala Bund',
      type: 'Reinforced Concrete Weir',
      streamOrder: 3,
      latitude: 19.1654,
      longitude: 74.7251,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 4.6,
      catchmentAreaHa: 185.0,
      constructionYear: 2023,
      siltationPercent: 19,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: { confidence: 0.94, summary: 'Spillway crest clear of debris. Silt level low to moderate.' }
    },
    {
      id: 'pk-cd-03',
      code: '4E-CD-03',
      name: 'Wadgaon Tributary Check Dam',
      type: 'Stone Masonry Check Dam',
      streamOrder: 2,
      latitude: 19.2150,
      longitude: 74.6652,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 3.8,
      catchmentAreaHa: 140.0,
      constructionYear: 2022,
      siltationPercent: 21,
      photoUrl: '/evidence/cd01.jpg',
      aiObservation: { confidence: 0.95, summary: 'Stable retention basin with active percolation recharge.' }
    },
    {
      id: 'pk-cd-04',
      code: '4E-CD-04',
      name: 'Mula Distributary Siltation Weir',
      type: 'Stone Masonry Check Dam',
      streamOrder: 3,
      latitude: 19.1452,
      longitude: 74.7450,
      status: 'MAINTENANCE_REQUIRED',
      capacityTcm: 4.2,
      catchmentAreaHa: 165.0,
      constructionYear: 2021,
      siltationPercent: 58,
      photoUrl: '/evidence/cd04.jpg',
      aiObservation: { confidence: 0.92, summary: 'Severe fine sediment deposition consuming 58% of storage. Mechanical desilting recommended before kharif.' }
    },
    {
      id: 'pk-fp-01',
      code: '4E-FP-01',
      name: 'Pimpalgaon Community Farm Pond',
      type: 'Lined Farm Pond',
      streamOrder: 1,
      latitude: 19.1720,
      longitude: 74.6820,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 2.5,
      catchmentAreaHa: 45.0,
      constructionYear: 2023,
      siltationPercent: 10,
      photoUrl: '/evidence/pt01.jpg',
      aiObservation: { confidence: 0.97, summary: 'Tarpaulin lining intact with full rainwater harvesting storage.' }
    },
    {
      id: 'pk-cct-01',
      code: '4E-CCT-01',
      name: 'Akole Ridge Continuous Contour Trenches',
      type: 'Continuous Contour Trench (CCT)',
      streamOrder: 1,
      latitude: 19.2305,
      longitude: 74.6402,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 6.8,
      catchmentAreaHa: 120.0,
      constructionYear: 2022,
      siltationPercent: 22,
      photoUrl: '/evidence/cct01.jpg',
      aiObservation: { confidence: 0.94, summary: 'Staggered contour bunds on 18% slope successfully halted sheet runoff. Stylosanthes and neem trees established.' }
    },
    {
      id: 'pk-lbs-01',
      code: '4E-LBS-01',
      name: 'Upper Ridge Loose Boulder Structure',
      type: 'Loose Boulder Gully Plug',
      streamOrder: 1,
      latitude: 19.2201,
      longitude: 74.6550,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 0.8,
      catchmentAreaHa: 30.0,
      constructionYear: 2023,
      siltationPercent: 28,
      photoUrl: '/evidence/cct01.jpg',
      aiObservation: { confidence: 0.91, summary: 'Basalt boulder packing stable, trapping coarse sediment in drainage head.' }
    },
    {
      id: 'pk-pt-01',
      code: '4E-PT-01',
      name: 'Khadak Community Percolation Tank',
      type: 'Earthen Percolation Tank',
      streamOrder: 2,
      latitude: 19.1802,
      longitude: 74.7081,
      status: 'VERIFIED_ACTIVE',
      capacityTcm: 8.5,
      catchmentAreaHa: 260.0,
      constructionYear: 2021,
      siltationPercent: 15,
      photoUrl: '/evidence/pt01.jpg',
      aiObservation: { confidence: 0.98, summary: 'Earthen bund pitching secure; high infiltration head benefiting surrounding borewells.' }
    }
  ],
  streams: [
    {
      id: 'pk-str-01',
      order: 4,
      coordinates: [
        [74.630, 19.235],
        [74.685, 19.195],
        [74.730, 19.165],
        [74.795, 19.135]
      ]
    },
    {
      id: 'pk-str-02',
      order: 3,
      coordinates: [
        [74.655, 19.245],
        [74.685, 19.195],
        [74.745, 19.155]
      ]
    },
    {
      id: 'pk-str-03',
      order: 3,
      coordinates: [
        [74.765, 19.220],
        [74.748, 19.155],
        [74.795, 19.135]
      ]
    },
    {
      id: 'pk-str-04',
      order: 2,
      coordinates: [
        [74.625, 19.175],
        [74.665, 19.180],
        [74.685, 19.195]
      ]
    },
    {
      id: 'pk-str-05',
      order: 2,
      coordinates: [
        [74.715, 19.230],
        [74.730, 19.185],
        [74.730, 19.165]
      ]
    },
    {
      id: 'pk-str-06',
      order: 1,
      coordinates: [
        [74.620, 19.240],
        [74.655, 19.245]
      ]
    },
    {
      id: 'pk-str-07',
      order: 1,
      coordinates: [
        [74.785, 19.215],
        [74.765, 19.220]
      ]
    }
  ],
  wells: [
    { id: 'pk-w-01', code: 'MH-AN-W01', village: 'Pimpalgaon-Khadak', farmerName: 'Babanrao Deshmukh', latitude: 19.183, longitude: 74.698, depthMeters: 24.0, baselineWaterTableM: 18.2, currentWaterTableM: 9.8, netRecoveryM: 8.4, status: 'OPTIMAL' },
    { id: 'pk-w-02', code: 'MH-AN-W02', village: 'Khadakwadi', farmerName: 'Suresh Patil', latitude: 19.168, longitude: 74.722, depthMeters: 22.5, baselineWaterTableM: 17.5, currentWaterTableM: 10.2, netRecoveryM: 7.3, status: 'OPTIMAL' },
    { id: 'pk-w-03', code: 'MH-AN-W03', village: 'Wadgaon Shani', farmerName: 'Rameshwar Ghule', latitude: 19.212, longitude: 74.668, depthMeters: 20.0, baselineWaterTableM: 15.8, currentWaterTableM: 11.4, netRecoveryM: 4.4, status: 'RECOVERING' },
    { id: 'pk-w-04', code: 'MH-AN-W04', village: 'Akole Foothills', farmerName: 'Dnyandev Tambe', latitude: 19.228, longitude: 74.645, depthMeters: 26.0, baselineWaterTableM: 21.0, currentWaterTableM: 13.5, netRecoveryM: 7.5, status: 'OPTIMAL' },
    { id: 'pk-w-05', code: 'MH-AN-W05', village: 'Mula Distributary', farmerName: 'Kashinath Walunj', latitude: 19.148, longitude: 74.742, depthMeters: 19.0, baselineWaterTableM: 14.2, currentWaterTableM: 11.8, netRecoveryM: 2.4, status: 'STRESSED' },
    { id: 'pk-w-06', code: 'MH-AN-W06', village: 'Pimpalgaon Central', farmerName: 'Anandrao Gite', latitude: 19.175, longitude: 74.690, depthMeters: 21.0, baselineWaterTableM: 16.4, currentWaterTableM: 9.1, netRecoveryM: 7.3, status: 'OPTIMAL' }
  ],
  priorityZones: [
    {
      id: 'pk-pz-01',
      name: 'Zone A - Akole Basalt Ridge Escarpment',
      areaHa: 92.5,
      riskLevel: 'CRITICAL',
      compositeScore: 94,
      reasons: [
        'Steep basalt slope (> 24%) with severe sheet erosion stripping shallow black soils',
        'High runoff velocity threatens downstream check dam CD-01 and sugarcane plots',
        'RUSLE soil loss rate estimated at 32.6 tons/Ha/year under untreated baseline'
      ],
      recommendedAction: 'Continuous Contour Trenches (CCT) + 6 Loose Boulder Gully Plugs + Stylosanthes grass seeding on berms.'
    },
    {
      id: 'pk-pz-02',
      name: 'Zone B - Khadakwadi Active Gully Migration Corridor',
      areaHa: 115.0,
      riskLevel: 'HIGH',
      compositeScore: 84,
      reasons: [
        'Headward gully advancement migrating at ~2.1m/year towards agricultural holdings',
        'Downstream siltation weir CD-04 currently choked at 58% sediment storage'
      ],
      recommendedAction: 'Cascading Gabion Plugs (5 Units) + Mechanical desilting scoop at CD-04 weir pool.'
    },
    {
      id: 'pk-pz-03',
      name: 'Zone C - Pimpalgaon Central Alluvial Valley Floor',
      areaHa: 168.0,
      riskLevel: 'MODERATE',
      compositeScore: 52,
      reasons: [
        'Low slope (< 3%) with intensive onion, pomegranate, and bajra cultivation',
        'Seasonal waterlogging during intense short-duration monsoon storm events'
      ],
      recommendedAction: 'Broad Bed Furrow (BBF) in-situ conservation + Recharge shaft connection to open dug-wells.'
    },
    {
      id: 'pk-pz-04',
      name: 'Zone D - Lower Mula Boundary Buffer',
      areaHa: 130.0,
      riskLevel: 'LOW',
      compositeScore: 32,
      reasons: [
        'Stable low-gradient terrain with regulated farm drainage',
        'Moderate groundwater table stabilization achieved'
      ],
      recommendedAction: 'Farm pond bund stabilization and agroforestry boundary plantation.'
    }
  ],
  evidence: [
    {
      id: 'pk-ev-01',
      relatedInterventionId: 'pk-cd-01',
      caption: 'Post-Monsoon Water Impoundment at Pimpalgaon Check Dam (CD-01)',
      photoUrl: '/evidence/cd01.jpg',
      exif: {
        latitude: 19.18520,
        longitude: 74.69540,
        altitudeMeters: 585.0,
        bearingDeg: 135.0,
        compassDirection: 'SE',
        accuracyMeters: 1.6,
        timestamp: '2026-08-16T09:45:00Z',
        deviceModel: 'Trimble TDC600 GNSS Handheld'
      },
      aiObservation: {
        conditionSummary: 'Masonry weir crest intact with 1.4m live surface water retention. Zero downstream undercut.',
        confidence: 0.96,
        siltationPercent: 16
      }
    },
    {
      id: 'pk-ev-02',
      relatedInterventionId: 'pk-cd-04',
      caption: 'Sediment Siltation Audit at Mula Distributary Weir (CD-04)',
      photoUrl: '/evidence/cd04.jpg',
      exif: {
        latitude: 19.14520,
        longitude: 74.74500,
        altitudeMeters: 540.0,
        bearingDeg: 215.0,
        compassDirection: 'SW',
        accuracyMeters: 2.1,
        timestamp: '2026-08-18T11:20:00Z',
        deviceModel: 'Trimble TDC600 GNSS Handheld'
      },
      aiObservation: {
        conditionSummary: 'Severe sediment accumulation encroaching on 58% of weir live storage. Urgent desilting scoop logged.',
        confidence: 0.92,
        siltationPercent: 58
      }
    },
    {
      id: 'pk-ev-03',
      relatedInterventionId: 'pk-pt-01',
      caption: 'Khadak Community Percolation Tank Headwater Storage',
      photoUrl: '/evidence/pt01.jpg',
      exif: {
        latitude: 19.18020,
        longitude: 74.70810,
        altitudeMeters: 572.0,
        bearingDeg: 75.0,
        compassDirection: 'ENE',
        accuracyMeters: 1.8,
        timestamp: '2026-08-20T10:15:00Z',
        deviceModel: 'Trimble TDC600 GNSS Handheld'
      },
      aiObservation: {
        conditionSummary: 'Stone pitched embankments stable. Full water table head driving rapid radial aquifer infiltration.',
        confidence: 0.97,
        siltationPercent: 15
      }
    },
    {
      id: 'pk-ev-04',
      relatedInterventionId: 'pk-cct-01',
      caption: 'Akole Ridge Continuous Contour Trenches (CCT-01)',
      photoUrl: '/evidence/cct01.jpg',
      exif: {
        latitude: 19.23050,
        longitude: 74.64020,
        altitudeMeters: 645.0,
        bearingDeg: 185.0,
        compassDirection: 'S',
        accuracyMeters: 2.3,
        timestamp: '2026-08-22T14:30:00Z',
        deviceModel: 'Trimble TDC600 GNSS Handheld'
      },
      aiObservation: {
        conditionSummary: 'Staggered contour trenches stabilized foothill slopes. Healthy vetiver grass establishment across berms.',
        confidence: 0.94,
        siltationPercent: 22
      }
    }
  ],
  ndviSeries: [
    { month: 'Sep 25', ndvi: 0.30, baselineNdvi: 0.20, rainfallMm: 85.0 },
    { month: 'Oct 25', ndvi: 0.46, baselineNdvi: 0.26, rainfallMm: 110.0 },
    { month: 'Nov 25', ndvi: 0.52, baselineNdvi: 0.31, rainfallMm: 15.0 },
    { month: 'Dec 25', ndvi: 0.54, baselineNdvi: 0.32, rainfallMm: 0.0 },
    { month: 'Jan 26', ndvi: 0.48, baselineNdvi: 0.28, rainfallMm: 0.0 },
    { month: 'Feb 26', ndvi: 0.39, baselineNdvi: 0.23, rainfallMm: 0.0 },
    { month: 'Mar 26', ndvi: 0.32, baselineNdvi: 0.19, rainfallMm: 8.0 },
    { month: 'Apr 26', ndvi: 0.29, baselineNdvi: 0.17, rainfallMm: 14.0 },
    { month: 'May 26', ndvi: 0.34, baselineNdvi: 0.21, rainfallMm: 32.0 },
    { month: 'Jun 26', ndvi: 0.42, baselineNdvi: 0.26, rainfallMm: 95.0 },
    { month: 'Jul 26', ndvi: 0.48, baselineNdvi: 0.28, rainfallMm: 140.0 },
    { month: 'Aug 26', ndvi: 0.53, baselineNdvi: 0.31, rainfallMm: 81.0 }
  ],
  hydrologicalBudget: [
    { parameter: 'Total Catchment Precipitation Inflow', volumeHaM: 1067.2, percentage: 100.0, description: '1,840 Ha × 580mm annual rainfall (Semi-Arid Southwest Monsoon)' },
    { parameter: 'In-Situ Soil Moisture & Deep Rootzone Absorption', volumeHaM: 458.9, percentage: 43.0, description: 'Enhanced through CCT, horticultural bunds & Vertisol clay capacity' },
    { parameter: 'Artificial Groundwater Aquifer Recharge', volumeHaM: 288.1, percentage: 27.0, description: 'Percolation tanks, check dams, and radial infiltration shafts' },
    { parameter: 'Surface Water Harvest & Live Storage Pools', volumeHaM: 213.4, percentage: 20.0, description: '14 civil interventions yield (36.4 TCM live pool volume)' },
    { parameter: 'Downstream Environmental Baseflow Discharge', volumeHaM: 106.8, percentage: 10.0, description: 'Regulated perennial discharge to Pravara / Mula canal system' }
  ]
};

// ---------------------------------------------------------------------------
// MASTER REGISTRY & COMPATIBILITY EXPORTS
// ---------------------------------------------------------------------------
export const allWatersheds: Record<string, WatershedDefinition> = {
  pimpalgaon: pimpalgaonWatershed,
  bhavani: bhavaniWatershed,
  thamirabarani: thamirabaraniWatershed,
  vaigai: vaigaiWatershed,
  kaaveri: kaaveriWatershed
};

export const tamilNaduWatersheds = allWatersheds;

export const watershedRegistry = [
  { id: 'pimpalgaon', label: 'Micro-Catchment 4E2B5c-09 (Pimpalgaon-Khadak, MH)', code: '4E2B5c-09', basin: 'Godavari Basin' },
  { id: 'bhavani', label: 'Bhavani Watershed (Erode/Coimbatore, TN)', code: 'TN-CAU-BHV-04', basin: 'Kaaveri Basin' },
  { id: 'thamirabarani', label: 'Thamirabarani Basin (Tirunelveli/Tenkasi, TN)', code: 'TN-THM-TNV-08', basin: 'Thamirabarani Basin' },
  { id: 'vaigai', label: 'Upper Vaigai Catchment (Theni/Madurai, TN)', code: 'TN-VAI-MDU-02', basin: 'Vaigai Basin' },
  { id: 'kaaveri', label: 'Kaaveri Delta (Grand Anicut/Trichy, TN)', code: 'TN-CAU-KAV-01', basin: 'Kaaveri Delta' }
];

export function getWatershedDataset(id: string = 'pimpalgaon'): WatershedDefinition {
  return allWatersheds[id] || allWatersheds.pimpalgaon;
}

// Default export aliases to maintain 100% backward compatibility
export const watershedStats = pimpalgaonWatershed.stats;
export const demoInterventions: Intervention[] = pimpalgaonWatershed.interventions;
export const demoStreams: StreamFeature[] = pimpalgaonWatershed.streams;
export const demoWells: WellTelemetry[] = pimpalgaonWatershed.wells;
export const demoPriorityZones: PriorityZone[] = pimpalgaonWatershed.priorityZones;
export const demoEvidence: FieldEvidenceItem[] = pimpalgaonWatershed.evidence;

export const demoNdviSeries: NdviDataPoint[] = bhavaniWatershed.ndviSeries;
export const demoHydrologicalBudget: HydrologicalBudget[] = bhavaniWatershed.hydrologicalBudget;

export const demoOutcomeAssessments: OutcomeAssessment[] = [
  {
    id: 'oa-01',
    category: 'VEGETATION',
    metricName: 'Mean Sentinel-2 Normalized Difference Vegetation Index (NDVI)',
    baselineValue: '0.32 (Aug 2021)',
    currentValue: '0.51 (Aug 2026)',
    netDelta: '+0.19 (+59.3%)',
    confidencePercent: 94,
    methodology: 'Sentinel-2 Level-2A Bottom-Of-Atmosphere (BOA) NIR (Band 8) and Red (Band 4) surface reflectance ratio.',
    limitations: 'Cloud cover masking applied; rain-fed seasonal flushes during Northeast Monsoon peak.'
  },
  {
    id: 'oa-02',
    category: 'WATER',
    metricName: 'Surface Water Spread & Reservoir Retention',
    baselineValue: '15.5 Ha (2021)',
    currentValue: '44.2 Ha (2026)',
    netDelta: '+28.7 Ha (+185.1%)',
    confidencePercent: 96,
    methodology: 'Normalized Difference Water Index (NDWI) thresholded on Green (B3) and NIR (B8) across micro-catchments.',
    limitations: 'Turbid sediment plumes in active check dam pools calibrated with in-situ sounding.'
  },
  {
    id: 'oa-03',
    category: 'GROUNDWATER',
    metricName: 'Open Agricultural Dug-Well Water Table Recovery',
    baselineValue: '16.8m Below Ground Level',
    currentValue: '9.2m Below Ground Level',
    netDelta: '+7.6m Lift',
    confidencePercent: 91,
    methodology: 'Tamil Nadu State Ground & Surface Water Resources Data Centre (PWD WRO) benchmark well soundings.',
    limitations: 'Pumping depression cones avoided; post-monsoon static water levels recorded in November & August.'
  },
  {
    id: 'oa-04',
    category: 'SOIL_CONSERVATION',
    metricName: 'RUSLE Estimated Soil Loss Abatement',
    baselineValue: '28.4 tons/Ha/year',
    currentValue: '11.8 tons/Ha/year',
    netDelta: '-58.4% Erosion Reduction',
    confidencePercent: 88,
    methodology: 'Revised Universal Soil Loss Equation (RUSLE = R × K × LS × C × P) using Copernicus 30m DEM slope gradient.',
    limitations: 'Rainfall erosivity factor R derived from IMD gridded daily data rather than continuous pluviograph.'
  },
  {
    id: 'oa-05',
    category: 'SOCIO_ECONOMIC',
    metricName: 'Rabi / Navarai Crop Cropping Intensity Index',
    baselineValue: '112.5%',
    currentValue: '162.4%',
    netDelta: '+49.9% Cropping Intensity',
    confidencePercent: 92,
    methodology: 'Sentinel-2 bi-temporal phenology classification verified by Tamil Nadu Agricultural Engineering Dept (AED).',
    limitations: 'Double-cropping expansion tied to sustained groundwater recharge in command village wells.'
  }
];

export const demoDataProviders: DataProviderRecord[] = [
  {
    id: 'dp-01',
    name: 'ISRO Bhuvan / TNRIS Geo-Portal',
    type: 'Cadastral & State Vector',
    status: 'CONNECTED',
    cadence: 'Daily sync',
    resolution: 'Cadastral Vector (1:10,000)',
    adapter: 'WFS / GeoServer STAC',
    lastSync: '2026-08-14T06:00:00Z',
    license: 'Open Government Data (OGD) Tamil Nadu',
    endpoint: 'https://tnris.tn.gov.in/geoserver/wfs',
    description: 'Tamil Nadu Remote Sensing Information System & ISRO Bhuvan geospatial administrative boundaries.'
  },
  {
    id: 'dp-02',
    name: 'Copernicus Sentinel-2 Level-2A',
    type: 'Multi-Spectral Satellite',
    status: 'CONNECTED',
    cadence: '5-Day Constellation',
    resolution: '10m Spatial (VNIR)',
    adapter: 'Copernicus Data Space STAC API',
    lastSync: '2026-08-12T10:30:00Z',
    license: 'CC-BY 4.0 International',
    endpoint: 'https://catalogue.dataspace.copernicus.eu/stac',
    description: 'Bottom-Of-Atmosphere (BOA) surface reflectance tiles covering Tamil Nadu river basins.'
  },
  {
    id: 'dp-03',
    name: 'Copernicus GLO-30 Digital Elevation Model',
    type: 'Hydro-Enforced DEM',
    status: 'CONNECTED',
    cadence: 'Static Reference',
    resolution: '30m Gridded Elevation',
    adapter: 'Cloud-Optimized GeoTIFF (COG)',
    lastSync: '2026-01-01T00:00:00Z',
    license: 'Copernicus Open Access',
    endpoint: 's3://copernicus-dem-30m/GLO-30-DGED/',
    description: 'Hydro-enforced DEM for Strahler drainage order extraction and slope calculations.'
  },
  {
    id: 'dp-04',
    name: 'Tamil Nadu PWD Ground & Surface Water Data Centre',
    type: 'In-Situ Observation Wells',
    status: 'CONNECTED',
    cadence: 'Monthly field sounding',
    resolution: 'Dug-well cluster telemetry',
    adapter: 'State Water Portal REST API',
    lastSync: '2026-08-01T08:00:00Z',
    license: 'PWD Water Resources Department Tamil Nadu',
    endpoint: 'https://groundwater.tn.gov.in/api/v2/telemetry',
    description: 'Sub-surface aquifer table soundings across Sathyamangalam, Ambasamudram, and Andipatti.'
  },
  {
    id: 'dp-05',
    name: 'Agricultural Engineering Dept (AED Tamil Nadu)',
    type: 'WDC-PMKSY Asset Register',
    status: 'CONNECTED',
    cadence: 'Post-construction audit',
    resolution: 'Survey GNSS geotags',
    adapter: 'WDC-PMKSY MIS Ingestion Pipeline',
    lastSync: '2026-08-10T14:15:00Z',
    license: 'TAWDEVA Official Registry',
    endpoint: 'https://tawdeva.tn.gov.in/wdc/api/v1/interventions',
    description: 'WDC-PMKSY 2.0 civil intervention sanctions, check dams, and percolation ooranis.'
  }
];
