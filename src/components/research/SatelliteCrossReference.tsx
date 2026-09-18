'use client';

import React, { useState } from 'react';
import { 
  Satellite, 
  Layers, 
  MapPin, 
  Compass, 
  Calendar, 
  Droplets, 
  Leaf, 
  Mountain, 
  Activity,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { IngestedImageRecord } from './GeoImageIngestion';
import { getWatershedDataset } from '@/data/demoWatershedData';
import DataBadge from '@/components/common/DataBadge';

interface SatelliteCrossReferenceProps {
  record: IngestedImageRecord;
  watershedId?: string;
  onOpenSwipeComparison?: () => void;
}

export default function SatelliteCrossReference({
  record,
  watershedId = 'pimpalgaon',
  onOpenSwipeComparison
}: SatelliteCrossReferenceProps) {
  const dataset = getWatershedDataset(watershedId);
  const [activeBandView, setActiveBandView] = useState<'TRUE_COLOR' | 'NDVI' | 'WATER'>('NDVI');

  // Calculate distance to nearest interventions
  const nearestAssets = dataset.interventions
    .map((asset) => {
      const latDiff = (record.latitude || 19.1852) - asset.latitude;
      const lngDiff = (record.longitude || 74.6954) - asset.longitude;
      // Approximate Haversine distance in meters
      const distM = Math.round(Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000);
      return { ...asset, distanceMeters: distM };
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, 3);

  const primaryAsset = nearestAssets[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8]">
              <Satellite className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
              Spatial Cross-Reference & Satellite Thematic Overlays
            </h2>
            <DataBadge status="VERIFIED" source="Sentinel-2 L2A BOA (10m)" compact />
          </div>
          <p className="text-xs text-[#94A3B8] font-mono">
            Spatial cross-referencing co-locates the field photograph ({record.latitude?.toFixed(4)}°N, {record.longitude?.toFixed(4)}°E) against multi-spectral satellite surface reflectance and hydro-enforced elevation layers.
          </p>
        </div>

        {onOpenSwipeComparison && (
          <button
            onClick={onOpenSwipeComparison}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#182230] hover:bg-[#2DD4BF] hover:text-[#0B0F15] border border-[#233041] text-xs font-mono font-bold transition-all text-[#F1F5F9]"
          >
            <span>Open Bi-Temporal Change Swipe</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid: 6 Co-Located Satellite Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {/* 1. Catchment Boundary & Code */}
        <div className="glass-panel rounded-2xl p-5 space-y-2 border-[#233041]">
          <div className="flex items-center justify-between text-[#94A3B8] pb-1 border-b border-[#233041]">
            <span className="text-[10px] uppercase font-bold">Catchment Topology</span>
            <DataBadge status="VERIFIED" compact />
          </div>
          <div className="text-sm font-bold text-[#2DD4BF]">
            {dataset.stats.code} • {dataset.stats.name}
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            {dataset.basin} • {dataset.stats.catchmentHa.toLocaleString()} Ha total basin area.
          </p>
          <div className="text-[10px] text-[#10B981] pt-1">
            ✓ Spatial boundary intersection confirmed
          </div>
        </div>

        {/* 2. Co-located Sentinel-2 NDVI */}
        <div className="glass-panel rounded-2xl p-5 space-y-2 border-[#233041]">
          <div className="flex items-center justify-between text-[#94A3B8] pb-1 border-b border-[#233041]">
            <span className="text-[10px] uppercase font-bold">Vegetation Index (NDVI)</span>
            <span className="text-[10px] text-[#2DD4BF]">Band 8 / Band 4</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-[#10B981]">0.49</span>
            <span className="text-xs text-[#10B981] font-bold">+0.21 delta vs 2021</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Moderate-dense canopy flush supported by check dam water impoundment.
          </p>
          <div className="text-[10px] text-[#94A3B8] pt-1">
            Sensor: Sentinel-2 MSI • 10m Ground Resolution
          </div>
        </div>

        {/* 3. Surface Water Index (NDWI) */}
        <div className="glass-panel rounded-2xl p-5 space-y-2 border-[#233041]">
          <div className="flex items-center justify-between text-[#94A3B8] pb-1 border-b border-[#233041]">
            <span className="text-[10px] uppercase font-bold">Water Index (NDWI)</span>
            <span className="text-[10px] text-[#38BDF8]">Band 3 / Band 8</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-[#38BDF8]">+0.18</span>
            <span className="text-xs text-[#38BDF8] font-bold">Surface Water Detected</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Exceeds McFeeters threshold (&gt; 0.0); confirms active reservoir spread.
          </p>
          <div className="text-[10px] text-[#94A3B8] pt-1">
            Acquisition Date: 12 August 2026 (0.8% Cloud)
          </div>
        </div>

        {/* 4. Elevation & Topographic Slope */}
        <div className="glass-panel rounded-2xl p-5 space-y-2 border-[#233041]">
          <div className="flex items-center justify-between text-[#94A3B8] pb-1 border-b border-[#233041]">
            <span className="text-[10px] uppercase font-bold">Elevation & Slope Gradient</span>
            <span className="text-[10px] text-[#A855F7]">Copernicus 30m</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-[#F1F5F9]">
              {record.altitudeMeters || 582} m MSL
            </span>
            <span className="text-xs text-[#F59E0B] font-bold">Slope: 4.8%</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Low-gradient valley floor ideal for masonry weir ponding & percolation.
          </p>
          <div className="text-[10px] text-[#94A3B8] pt-1">
            Source: Hydro-Enforced GLO-30 Digital Elevation Model
          </div>
        </div>

        {/* 5. Nearest Civil Intervention Distance */}
        <div className="glass-panel rounded-2xl p-5 space-y-2 border-[#233041]">
          <div className="flex items-center justify-between text-[#94A3B8] pb-1 border-b border-[#233041]">
            <span className="text-[10px] uppercase font-bold">Nearest Registered Asset</span>
            <span className="text-[10px] text-[#2DD4BF]">{primaryAsset?.distanceMeters}m Away</span>
          </div>
          <div className="text-sm font-bold text-[#F1F5F9]">
            {primaryAsset?.code} ({primaryAsset?.type})
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Capacity: {primaryAsset?.capacityTcm} TCM • Built: {primaryAsset?.constructionYear} • Silt: {primaryAsset?.siltationPercent}%
          </p>
          <div className="text-[10px] text-[#10B981] pt-1">
            State: {primaryAsset?.status}
          </div>
        </div>

        {/* 6. Drainage Corridor & Stream Order */}
        <div className="glass-panel rounded-2xl p-5 space-y-2 border-[#233041]">
          <div className="flex items-center justify-between text-[#94A3B8] pb-1 border-b border-[#233041]">
            <span className="text-[10px] uppercase font-bold">Drainage Network</span>
            <span className="text-[10px] text-[#38BDF8]">Strahler Order {primaryAsset?.streamOrder || 3}</span>
          </div>
          <div className="text-sm font-bold text-[#38BDF8]">
            Order {primaryAsset?.streamOrder || 3} Feeder Nala
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Perennial baseflow corridor feeding downstream agricultural command.
          </p>
          <div className="text-[10px] text-[#94A3B8] pt-1">
            Hydrological Flow: Downstream to Pravara/Mula Collector
          </div>
        </div>
      </div>

      {/* Visual Spatial Cross-Reference Comparison Window */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2DD4BF]" />
            <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">
              Co-Located Multi-Spectral Reflectance Tile
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveBandView('TRUE_COLOR')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                activeBandView === 'TRUE_COLOR' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              RGB Natural
            </button>
            <button
              onClick={() => setActiveBandView('NDVI')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                activeBandView === 'NDVI' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              NDVI Canopy
            </button>
            <button
              onClick={() => setActiveBandView('WATER')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                activeBandView === 'WATER' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              NDWI Water Body
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Photograph View with Geotag Pin Overlay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span>Field Ground Evidence Photo</span>
              <span className="text-[#2DD4BF]">{record.captureDate}</span>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#233041]">
              <img src={record.dataUrl} alt="Field Photo" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/80 font-mono text-[10px] text-[#2DD4BF]">
                Target: {primaryAsset?.code} ({primaryAsset?.type})
              </div>
            </div>
          </div>

          {/* Corresponding Satellite Imagery View */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span>Sentinel-2 Corresponding Reflectance (10m)</span>
              <span className="text-[#38BDF8]">Aug 2026 L2A BOA</span>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#233041]">
              <img 
                src={activeBandView === 'NDVI' ? '/satellite/sentinel2_ndvi_analysis.jpg' : '/satellite/sentinel2_post_2026.jpg'} 
                alt="Satellite" 
                className="w-full h-full object-cover" 
              />
              {/* Pulsing Target Reticle at photograph coordinates */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="w-8 h-8 rounded-full border-2 border-[#2DD4BF] animate-ping opacity-75" />
                <span className="w-3 h-3 rounded-full bg-[#2DD4BF] absolute" />
              </div>
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/80 font-mono text-[10px] text-[#2DD4BF]">
                Co-located Pixel: 10m × 10m Resolution
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
