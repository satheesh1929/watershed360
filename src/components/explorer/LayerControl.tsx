'use client';

import React from 'react';
import { LayerState } from '@/types/watershed';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  MapPin, 
  Camera, 
  AlertTriangle, 
  Activity, 
  Droplet,
  Compass,
  Mountain
} from 'lucide-react';

interface LayerControlProps {
  layers: LayerState;
  onToggleLayer: (key: keyof LayerState) => void;
  onBaseMapChange: (baseMap: 'dark' | 'satellite' | 'topo') => void;
}

export default function LayerControl({
  layers,
  onToggleLayer,
  onBaseMapChange
}: LayerControlProps) {
  const layerItems = [
    { key: 'boundary' as keyof LayerState, label: 'Catchment Perimeter', icon: Compass, color: '#2DD4BF' },
    { key: 'drainageNetwork' as keyof LayerState, label: 'Stream Drainage (Strahler)', icon: Droplet, color: '#38BDF8' },
    { key: 'interventions' as keyof LayerState, label: 'Civil Structures (Assets)', icon: MapPin, color: '#2DD4BF' },
    { key: 'vegetationHealth' as keyof LayerState, label: 'NDVI Vegetation Canopy', icon: Activity, color: '#10B981' },
    { key: 'priorityZones' as keyof LayerState, label: 'Erosion Hotspot Zones', icon: AlertTriangle, color: '#F43F5E' },
    { key: 'fieldPhotos' as keyof LayerState, label: 'Geocoded Ground Photos', icon: Camera, color: '#38BDF8' },
    { key: 'elevationContours' as keyof LayerState, label: 'Topography Contours (DEM)', icon: Mountain, color: '#94A3B8' },
  ];

  return (
    <div className="w-64 bg-[#131A24]/95 backdrop-blur-xl border-r border-[#233041] flex flex-col justify-between p-4 select-none h-full overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#233041] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2DD4BF]" />
            <span className="text-xs font-bold text-[#F1F5F9] font-sans">GIS Layer Stack</span>
          </div>
          <span className="text-[10px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded border border-[#2DD4BF]/30">
            ACTIVE
          </span>
        </div>

        {/* Vector Overlays */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold px-1 mb-1">
            Raster & Vector Overlays
          </div>
          {layerItems.map((item) => {
            const Icon = item.icon;
            const isVisible = Boolean(layers[item.key]);

            return (
              <button
                key={item.key}
                onClick={() => onToggleLayer(item.key)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-mono transition-all ${
                  isVisible
                    ? 'bg-[#182230] text-[#F1F5F9] border border-[#233041] shadow-sm'
                    : 'text-[#64748B] hover:bg-[#0B0F15] opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shadow-sm" 
                    style={{ backgroundColor: item.color, boxShadow: isVisible ? `0 0 8px ${item.color}` : 'none' }}
                  />
                  <span className="truncate text-left text-[11px] font-medium">{item.label}</span>
                </div>
                {isVisible ? (
                  <Eye className="w-3.5 h-3.5 text-[#2DD4BF]" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-[#64748B]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Basemap Switcher */}
        <div className="pt-3 border-t border-[#233041]">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold px-1 mb-2">
            Cartographic Canvas
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
            {(['dark', 'satellite', 'topo'] as const).map((bm) => (
              <button
                key={bm}
                onClick={() => onBaseMapChange(bm)}
                className={`py-1.5 px-1 rounded-lg capitalize text-center transition-all border ${
                  layers.baseMap === bm
                    ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] text-[#2DD4BF] font-bold shadow-sm'
                    : 'bg-[#0B0F15] border-[#233041] text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {bm === 'dark' ? 'HUD' : bm === 'satellite' ? 'Sat' : 'DEM'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coordinate reference info */}
      <div className="pt-3 border-t border-[#233041] text-[10px] font-mono text-[#94A3B8] space-y-1">
        <div className="flex justify-between">
          <span>Projection:</span>
          <span className="text-[#F1F5F9]">EPSG:4326 (WGS84)</span>
        </div>
        <div className="flex justify-between">
          <span>Resolution:</span>
          <span className="text-[#2DD4BF] font-semibold">10m VNIR Sentinel</span>
        </div>
      </div>
    </div>
  );
}
