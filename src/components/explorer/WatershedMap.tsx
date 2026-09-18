'use client';

import React, { useState } from 'react';
import { LayerState, Intervention, PriorityZone, StreamFeature, FieldEvidenceItem } from '@/types/watershed';
import { 
  demoInterventions, 
  demoStreams, 
  demoPriorityZones, 
  demoEvidence 
} from '@/data/demoWatershedData';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Navigation,
  Layers,
  MapPin,
  Camera
} from 'lucide-react';

interface WatershedMapProps {
  layers: LayerState;
  selectedYear: number;
  selectedFeatureId: string | null;
  onSelectFeature: (id: string | null) => void;
  interventions?: Intervention[];
  streams?: StreamFeature[];
  priorityZones?: PriorityZone[];
  evidence?: FieldEvidenceItem[];
  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  catchmentCode?: string;
}

export default function WatershedMap({
  layers,
  selectedYear,
  selectedFeatureId,
  onSelectFeature,
  interventions = demoInterventions,
  streams = demoStreams,
  priorityZones = demoPriorityZones,
  evidence = demoEvidence,
  bounds,
  catchmentCode = 'TN-CAU-BHV-04'
}: WatershedMapProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredIntervention, setHoveredIntervention] = useState<Intervention | null>(null);
  const [hoveredZone, setHoveredZone] = useState<PriorityZone | null>(null);

  // Compute dynamic bounds for Tamil Nadu watersheds
  const minLat = bounds?.minLat ?? (interventions.length > 0 ? Math.min(...interventions.map(i => i.latitude)) - 0.04 : 11.320);
  const maxLat = bounds?.maxLat ?? (interventions.length > 0 ? Math.max(...interventions.map(i => i.latitude)) + 0.04 : 11.560);
  const minLng = bounds?.minLng ?? (interventions.length > 0 ? Math.min(...interventions.map(i => i.longitude)) - 0.04 : 77.020);
  const maxLng = bounds?.maxLng ?? (interventions.length > 0 ? Math.max(...interventions.map(i => i.longitude)) + 0.04 : 77.300);

  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number }>({ 
    lat: (minLat + maxLat) / 2, 
    lng: (minLng + maxLng) / 2 
  });

  // Convert geodetic coordinates to SVG coordinates (0-800 X, 0-600 Y)
  const project = (lng: number, lat: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    const y = 570 - ((lat - minLat) / (maxLat - minLat)) * 540;
    return { x, y };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / (rect.width / 800);
    const rawY = (e.clientY - rect.top) / (rect.height / 600);

    const x = Math.max(30, Math.min(770, rawX));
    const y = Math.max(30, Math.min(570, rawY));

    const lng = minLng + ((x - 30) / 740) * (maxLng - minLng);
    const lat = minLat + ((570 - y) / 540) * (maxLat - minLat);
    setMouseCoords({ lat, lng });
  };

  const filteredInterventions = interventions.filter((item) => {
    return item.constructionYear <= selectedYear;
  });

  // Calculate year progress for dynamic greening and water spread
  const yearProgress = Math.max(0, Math.min(1, (selectedYear - 2021) / 5)); // 0 (2021) to 1.0 (2026)

  // Geodetic boundary polygons for the 4 priority zones dynamically scaled
  const dLng = maxLng - minLng;
  const dLat = maxLat - minLat;
  const priorityZonePolygons: Record<string, [number, number][]> = {
    'pz-01': [
      [minLng + dLng * 0.15, minLat + dLat * 0.72],
      [minLng + dLng * 0.38, minLat + dLat * 0.88],
      [minLng + dLng * 0.42, minLat + dLat * 0.65],
      [minLng + dLng * 0.20, minLat + dLat * 0.58]
    ],
    'pz-02': [
      [minLng + dLng * 0.35, minLat + dLat * 0.48],
      [minLng + dLng * 0.60, minLat + dLat * 0.55],
      [minLng + dLng * 0.58, minLat + dLat * 0.32],
      [minLng + dLng * 0.32, minLat + dLat * 0.25]
    ],
    'pz-03': [
      [minLng + dLng * 0.50, minLat + dLat * 0.68],
      [minLng + dLng * 0.75, minLat + dLat * 0.76],
      [minLng + dLng * 0.72, minLat + dLat * 0.52],
      [minLng + dLng * 0.48, minLat + dLat * 0.45]
    ],
    'pz-04': [
      [minLng + dLng * 0.55, minLat + dLat * 0.35],
      [minLng + dLng * 0.78, minLat + dLat * 0.45],
      [minLng + dLng * 0.82, minLat + dLat * 0.20],
      [minLng + dLng * 0.52, minLat + dLat * 0.15]
    ],
    'thm-pz-01': [
      [minLng + dLng * 0.15, minLat + dLat * 0.72],
      [minLng + dLng * 0.42, minLat + dLat * 0.85],
      [minLng + dLng * 0.38, minLat + dLat * 0.58],
      [minLng + dLng * 0.18, minLat + dLat * 0.55]
    ],
    'thm-pz-02': [
      [minLng + dLng * 0.45, minLat + dLat * 0.50],
      [minLng + dLng * 0.75, minLat + dLat * 0.55],
      [minLng + dLng * 0.70, minLat + dLat * 0.30],
      [minLng + dLng * 0.40, minLat + dLat * 0.25]
    ],
    'vai-pz-01': [
      [minLng + dLng * 0.15, minLat + dLat * 0.72],
      [minLng + dLng * 0.45, minLat + dLat * 0.85],
      [minLng + dLng * 0.40, minLat + dLat * 0.55],
      [minLng + dLng * 0.18, minLat + dLat * 0.50]
    ],
    'vai-pz-02': [
      [minLng + dLng * 0.50, minLat + dLat * 0.55],
      [minLng + dLng * 0.80, minLat + dLat * 0.60],
      [minLng + dLng * 0.75, minLat + dLat * 0.30],
      [minLng + dLng * 0.45, minLat + dLat * 0.25]
    ],
    'kav-pz-01': [
      [minLng + dLng * 0.25, minLat + dLat * 0.70],
      [minLng + dLng * 0.60, minLat + dLat * 0.80],
      [minLng + dLng * 0.55, minLat + dLat * 0.50],
      [minLng + dLng * 0.22, minLat + dLat * 0.45]
    ],
    'kav-pz-02': [
      [minLng + dLng * 0.55, minLat + dLat * 0.50],
      [minLng + dLng * 0.85, minLat + dLat * 0.55],
      [minLng + dLng * 0.80, minLat + dLat * 0.25],
      [minLng + dLng * 0.50, minLat + dLat * 0.20]
    ]
  };

  return (
    <div className="relative w-full h-full bg-[#0B0F15] overflow-hidden flex items-center justify-center select-none">
      {/* Top Left HUD: Catchment Header Bar (Single Non-Overlapping Element) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="bg-[#131A24]/95 backdrop-blur border border-[#233041] px-3.5 py-1.5 rounded-xl text-xs font-mono text-[#94A3B8] shadow-2xl flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] animate-pulse"></span>
          <span className="text-[#2DD4BF] font-bold">{catchmentCode}</span>
          <span className="text-[#233041]">|</span>
          <span className="text-[#38BDF8] font-bold">{layers.baseMap.toUpperCase()} GIS VIEW</span>
          <span className="text-[#233041]">|</span>
          <span className="text-[#F1F5F9] font-bold">{selectedYear} CADASTRE</span>
        </div>
      </div>

      {/* Top Right HUD: Real-time Cursor Coordinates */}
      <div className="absolute top-4 right-4 z-20 bg-[#131A24]/95 backdrop-blur border border-[#233041] px-3.5 py-1.5 rounded-xl text-xs font-mono text-[#94A3B8] shadow-2xl flex items-center gap-2">
        <Navigation className="w-3.5 h-3.5 text-[#2DD4BF]" />
        <span>LAT: <span className="text-[#F1F5F9] font-bold">{mouseCoords.lat.toFixed(5)}°N</span></span>
        <span className="text-[#233041]">|</span>
        <span>LNG: <span className="text-[#F1F5F9] font-bold">{mouseCoords.lng.toFixed(5)}°E</span></span>
      </div>

      {/* Pan / Zoom Control Dock */}
      <div className="absolute top-16 right-4 z-20 flex flex-col gap-1.5 bg-[#131A24]/95 backdrop-blur border border-[#233041] p-1.5 rounded-xl shadow-2xl">
        <button 
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
          className="p-2 hover:bg-[#1E2C3D] text-[#F1F5F9] rounded-lg transition-colors active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
          className="p-2 hover:bg-[#1E2C3D] text-[#F1F5F9] rounded-lg transition-colors active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setZoomLevel(1)}
          className="p-2 hover:bg-[#1E2C3D] text-[#2DD4BF] rounded-lg transition-colors active:scale-95"
          title="Reset Zoom"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Cartographic SVG Canvas */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full cursor-crosshair transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoomLevel})` }}
        onMouseMove={handleMouseMove}
        onClick={() => onSelectFeature(null)}
      >
        <defs>
          {/* Cartographic Coordinate Grid */}
          <pattern id="gisGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#182230" strokeWidth="0.75" />
          </pattern>
          <pattern id="gisSubgrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#121822" strokeWidth="0.4" />
          </pattern>

          {/* Topographic Terrain Gradients */}
          <linearGradient id="topoReliefDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#182230" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#121A24" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0B1017" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="topoReliefSat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E2E28" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#182820" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0E1A14" stopOpacity="0.95" />
          </linearGradient>

          {/* Dynamic NDVI Greening Canopy that advances by year */}
          <radialGradient id="valleyGreening" cx="45%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.15 + yearProgress * 0.35} />
            <stop offset="70%" stopColor="#10B981" stopOpacity={0.05 + yearProgress * 0.15} />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="ridgeGreening" cx="60%" cy="50%" r="45%">
            <stop offset="0%" stopColor="#059669" stopOpacity={0.12 + yearProgress * 0.30} />
            <stop offset="70%" stopColor="#059669" stopOpacity={0.04 + yearProgress * 0.12} />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>

          <clipPath id="catchmentBoundaryClip">
            <polygon points="110,90 310,50 560,95 700,230 735,410 610,525 380,555 180,500 85,335 100,180" />
          </clipPath>
        </defs>

        {/* Map Background Canvas */}
        <rect width="800" height="600" fill="#0B0F15" />
        <rect width="800" height="600" fill="url(#gisSubgrid)" />
        <rect width="800" height="600" fill="url(#gisGrid)" />

        {/* Real Sentinel-2 Satellite Ortho Image Layer */}
        {layers.baseMap === 'satellite' && (
          <g clipPath="url(#catchmentBoundaryClip)">
            <image 
              href={selectedYear <= 2022 ? "/satellite/sentinel2_pre_2021.jpg" : "/satellite/sentinel2_post_2026.jpg"}
              x="85"
              y="50"
              width="650"
              height="505"
              preserveAspectRatio="none"
              opacity="0.88"
            />
          </g>
        )}

        {/* Catchment Watershed Boundary Polygon */}
        {layers.boundary && (
          <g>
            <polygon
              points="110,90 310,50 560,95 700,230 735,410 610,525 380,555 180,500 85,335 100,180"
              fill={layers.baseMap === 'satellite' ? 'none' : 'url(#topoReliefDark)'}
              stroke="#2DD4BF"
              strokeWidth="2.2"
              strokeDasharray="6 3"
              opacity="0.95"
            />
          </g>
        )}

        {/* Topographic Elevation Contours (600m - 700m MSL) */}
        {layers.elevationContours !== false && (
          <g opacity="0.4" fill="none">
            {/* 700m Ridge Contour */}
            <path
              d="M 150 120 Q 290 80 520 125 Q 650 220 680 370 Q 560 470 350 490 Q 190 440 120 290 Z"
              stroke="#64748B"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <text x="160" y="125" fill="#64748B" fontSize="8" fontFamily="IBM Plex Mono">700m</text>

            {/* 660m Mid-Slope Contour */}
            <path
              d="M 190 155 Q 310 125 490 165 Q 615 255 645 365 Q 540 445 365 455 Q 220 405 160 270 Z"
              stroke="#64748B"
              strokeWidth="1.2"
            />
            <text x="200" y="160" fill="#64748B" fontSize="8" fontFamily="IBM Plex Mono">660m</text>

            {/* 620m Valley Contour */}
            <path
              d="M 250 205 Q 340 185 460 215 Q 560 290 580 360 Q 495 405 380 415 Q 275 360 220 275 Z"
              stroke="#64748B"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <text x="260" y="210" fill="#64748B" fontSize="8" fontFamily="IBM Plex Mono">620m (Valley)</text>
          </g>
        )}

        {/* Dynamic NDVI Vegetation Canopy Layer */}
        {layers.vegetationHealth && (
          <g>
            <ellipse cx="360" cy="310" rx={140 + yearProgress * 40} ry={90 + yearProgress * 30} fill="url(#valleyGreening)" />
            <ellipse cx="510" cy="270" rx={100 + yearProgress * 30} ry={70 + yearProgress * 25} fill="url(#ridgeGreening)" />
            
            {/* Continuous Contour Trench (CCT) Vegetative Berms */}
            {selectedYear >= 2023 && (
              <g stroke="#10B981" strokeWidth="1.5" strokeDasharray="5 3" fill="none" opacity={0.4 + yearProgress * 0.5}>
                <path d="M 170 140 Q 290 100 450 145" />
                <path d="M 180 160 Q 300 120 460 165" />
                <path d="M 190 180 Q 310 140 470 185" />
              </g>
            )}
          </g>
        )}

        {/* Priority Zones (Erosion & Vulnerability) */}
        {layers.priorityZones && (
          <g>
            {priorityZones.map((zone) => {
              const coords = priorityZonePolygons[zone.id];
              if (!coords) return null;
              const pointsStr = coords
                .map(c => {
                  const pt = project(c[0], c[1]);
                  return `${pt.x},${pt.y}`;
                })
                .join(' ');

              const isSelected = selectedFeatureId === zone.id;
              const color = zone.riskLevel === 'CRITICAL' ? '#F43F5E' : zone.riskLevel === 'HIGH' ? '#F59E0B' : '#2DD4BF';
              const labelPt = project(coords[0][0], coords[0][1]);

              return (
                <g 
                  key={zone.id}
                  className="cursor-pointer transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFeature(zone.id);
                  }}
                  onMouseEnter={() => setHoveredZone(zone)}
                  onMouseLeave={() => setHoveredZone(null)}
                >
                  <polygon
                    points={pointsStr}
                    fill={color}
                    opacity={isSelected ? '0.35' : '0.18'}
                    stroke={color}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    strokeDasharray={isSelected ? 'none' : '5 2'}
                  />
                  <text 
                    x={labelPt.x + 8} 
                    y={labelPt.y + 14} 
                    fill={color} 
                    fontSize="9" 
                    fontFamily="IBM Plex Mono" 
                    fontWeight="bold"
                    className="select-none pointer-events-none"
                  >
                    {zone.name.split(' - ')[0]} ({zone.compositeScore}/100)
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Strahler Drainage Stream Hierarchy */}
        {layers.drainageNetwork && (
          <g>
            {streams.map((stream) => {
              const pointsStr = stream.coordinates
                .map((coord: [number, number]) => {
                  const projected = project(coord[0], coord[1]);
                  return `${projected.x},${projected.y}`;
                })
                .join(' ');

              // Cartographic line weight and color based on Strahler stream order
              const strokeWidth = stream.order === 4 ? 4.5 : stream.order === 3 ? 3.0 : stream.order === 2 ? 2.0 : 1.2;
              const strokeColor = stream.order === 4 ? '#38BDF8' : stream.order === 3 ? '#0284C7' : stream.order === 2 ? '#0369A1' : '#075985';

              return (
                <g key={stream.id}>
                  {/* Outer glow on main river */}
                  {stream.order >= 3 && (
                    <polyline
                      points={pointsStr}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth + 2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.3}
                    />
                  )}
                  {/* Primary stream line */}
                  <polyline
                    points={pointsStr}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.9}
                  />
                </g>
              );
            })}

            {/* Stream Order Annotation */}
            <text x="610" y="445" fill="#38BDF8" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="bold">
              Main Stem (Strahler Order 4) →
            </text>
          </g>
        )}

        {/* Dynamic Water Bodies & Impoundment Pools (Grow with Year) */}
        {layers.waterBodies && (
          <g>
            {/* CD-01 Pool */}
            {selectedYear >= 2022 && (() => {
              const item = filteredInterventions.find(i => i.code === 'CD-01');
              if (!item) return null;
              const pt = project(item.longitude, item.latitude);
              return (
                <ellipse 
                  cx={pt.x - 4} 
                  cy={pt.y - 8} 
                  rx={16 + yearProgress * 14} 
                  ry={9 + yearProgress * 7} 
                  fill="#38BDF8" 
                  opacity="0.8" 
                  stroke="#0284C7" 
                  strokeWidth="1"
                />
              );
            })()}

            {/* CD-02 Main Pool */}
            {selectedYear >= 2023 && (() => {
              const item = filteredInterventions.find(i => i.code === 'CD-02');
              if (!item) return null;
              const pt = project(item.longitude, item.latitude);
              return (
                <ellipse 
                  cx={pt.x - 6} 
                  cy={pt.y - 10} 
                  rx={24 + yearProgress * 20} 
                  ry={13 + yearProgress * 11} 
                  fill="#38BDF8" 
                  opacity="0.85" 
                  stroke="#0284C7" 
                  strokeWidth="1.2"
                />
              );
            })()}

            {/* PT-01 Percolation Tank */}
            {selectedYear >= 2023 && (() => {
              const item = filteredInterventions.find(i => i.code === 'PT-01');
              if (!item) return null;
              const pt = project(item.longitude, item.latitude);
              return (
                <ellipse 
                  cx={pt.x} 
                  cy={pt.y} 
                  rx={22 + yearProgress * 18} 
                  ry={13 + yearProgress * 10} 
                  fill="#0284C7" 
                  opacity="0.75" 
                  stroke="#38BDF8" 
                  strokeWidth="1"
                />
              );
            })()}

            {/* FP-01 Farm Pond */}
            {selectedYear >= 2024 && (() => {
              const item = filteredInterventions.find(i => i.code === 'FP-01');
              if (!item) return null;
              const pt = project(item.longitude, item.latitude);
              return (
                <rect 
                  x={pt.x - 10} 
                  y={pt.y - 8} 
                  width="20" 
                  height="15" 
                  rx="3" 
                  fill="#38BDF8" 
                  opacity="0.9" 
                  stroke="#2DD4BF" 
                  strokeWidth="1" 
                />
              );
            })()}
          </g>
        )}

        {/* Civil Interventions Geo-Markers */}
        {layers.interventions && (
          <g>
            {filteredInterventions.map((item) => {
              const pt = project(item.longitude, item.latitude);
              const isSelected = selectedFeatureId === item.id;
              const color = item.status === 'VERIFIED_ACTIVE' ? '#2DD4BF' : item.status === 'MAINTENANCE_REQUIRED' ? '#F43F5E' : '#F59E0B';

              return (
                <g
                  key={item.id}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  className="cursor-pointer transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFeature(item.id);
                  }}
                  onMouseEnter={() => setHoveredIntervention(item)}
                  onMouseLeave={() => setHoveredIntervention(null)}
                >
                  {/* Pulsing Selection Ring */}
                  {isSelected && (
                    <>
                      <circle r="18" fill={color} opacity="0.25" className="animate-ping" />
                      <circle r="13" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
                    </>
                  )}

                  {/* Clean GIS Structure Pin */}
                  <circle
                    r={isSelected ? '9' : '6.5'}
                    fill="#0B0F15"
                    stroke={color}
                    strokeWidth={isSelected ? '2.5' : '2'}
                  />
                  <circle r={isSelected ? '4' : '3'} fill={color} />

                  {/* Code Label Tag */}
                  {(isSelected || item.streamOrder >= 3 || item.code === 'CD-05') && (
                    <g transform="translate(10, 4)">
                      <rect 
                        x="-2" 
                        y="-10" 
                        width={item.code.length * 7 + 10} 
                        height="15" 
                        rx="3" 
                        fill="#131A24" 
                        stroke={color} 
                        strokeWidth="0.8" 
                        opacity="0.95"
                      />
                      <text
                        x="3"
                        y="1"
                        fill="#F1F5F9"
                        fontSize="9"
                        fontFamily="IBM Plex Mono"
                        fontWeight="bold"
                        className="select-none pointer-events-none"
                      >
                        {item.code}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* Field Photo GPS Capture Points */}
        {layers.fieldPhotos && (
          <g>
            {evidence.map((ev) => {
              const pt = project(ev.exif.longitude, ev.exif.latitude);

              return (
                <g
                  key={ev.id}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFeature(ev.relatedInterventionId);
                  }}
                >
                  <circle r="4" fill="#0B0F15" stroke="#38BDF8" strokeWidth="1.5" />
                  <circle r="1.5" fill="#38BDF8" />
                </g>
              );
            })}
          </g>
        )}

        {/* Cartographic Scale Bar (Bottom Left) */}
        <g transform="translate(45, 560)" fontFamily="IBM Plex Mono" fontSize="9" fill="#94A3B8">
          <line x1="0" y1="0" x2="100" y2="0" stroke="#94A3B8" strokeWidth="2" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="50" y1="-3" x2="50" y2="3" stroke="#94A3B8" strokeWidth="1" />
          <line x1="100" y1="-4" x2="100" y2="4" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="0" y="-8">0</text>
          <text x="42" y="-8">500m</text>
          <text x="92" y="-8">1 km</text>
        </g>

        {/* Cartographic True North Rose (Top Right) */}
        <g transform="translate(740, 75)" opacity="0.8">
          <circle r="16" fill="#131A24" stroke="#233041" strokeWidth="1" />
          <polygon points="740,63 743,75 740,73 737,75" transform="translate(-740, -75)" fill="#2DD4BF" />
          <polygon points="740,87 743,75 740,77 737,75" transform="translate(-740, -75)" fill="#64748B" />
          <text x="-3" y="-6" fill="#2DD4BF" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="bold">N</text>
        </g>
      </svg>

      {/* Hover Tooltip Popup for Civil Intervention */}
      {hoveredIntervention && (
        <div 
          className="absolute pointer-events-none z-30 bg-[#131A24]/95 backdrop-blur border border-[#2DD4BF] p-3.5 rounded-xl shadow-2xl text-xs font-mono max-w-xs animate-fadeIn"
          style={{ top: '65px', left: '20px' }}
        >
          <div className="font-bold text-[#F1F5F9] text-xs font-sans">{hoveredIntervention.name}</div>
          <div className="text-[10px] text-[#2DD4BF] font-mono font-bold mt-0.5">{hoveredIntervention.code} • Strahler Order {hoveredIntervention.streamOrder}</div>
          <div className="text-[11px] text-[#94A3B8] mt-1 flex justify-between">
            <span>Live Cap: {hoveredIntervention.capacityTcm} TCM</span>
            <span>Silt: <span className={hoveredIntervention.siltationPercent > 40 ? 'text-[#F43F5E] font-bold' : 'text-[#F1F5F9]'}>{hoveredIntervention.siltationPercent}%</span></span>
          </div>
          <div className="mt-1 pt-1.5 border-t border-[#233041] flex items-center justify-between text-[10px]">
            <span className="text-[#94A3B8]">Health Status:</span>
            <span className={`font-bold ${hoveredIntervention.status === 'VERIFIED_ACTIVE' ? 'text-[#2DD4BF]' : 'text-[#F43F5E]'}`}>
              {hoveredIntervention.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}

      {/* Hover Tooltip Popup for Priority Zone */}
      {hoveredZone && (
        <div 
          className="absolute pointer-events-none z-30 bg-[#131A24]/95 backdrop-blur border border-[#F59E0B] p-3.5 rounded-xl shadow-2xl text-xs font-mono max-w-xs animate-fadeIn"
          style={{ top: '65px', left: '20px' }}
        >
          <div className="font-bold text-[#F1F5F9] text-xs font-sans">{hoveredZone.name}</div>
          <div className="text-[10px] text-[#F59E0B] font-mono font-bold mt-0.5">Vulnerability Score: {hoveredZone.compositeScore}/100 • {hoveredZone.riskLevel}</div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Area: <span className="text-[#F1F5F9] font-bold">{hoveredZone.areaHa} Ha</span></div>
          <div className="mt-1 pt-1.5 border-t border-[#233041] text-[10px] text-[#2DD4BF]">
            Recommendation: {hoveredZone.recommendedAction}
          </div>
        </div>
      )}
    </div>
  );
}
