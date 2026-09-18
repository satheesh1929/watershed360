'use client';

import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  TrendingUp, 
  Droplets, 
  Leaf, 
  Sparkles, 
  Eye, 
  Info, 
  Layers, 
  MapPin, 
  Maximize2, 
  Scan, 
  Compass,
  Calendar,
  CloudSun,
  Sliders,
  AlertTriangle,
  FileSpreadsheet,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { getWatershedDataset } from '@/data/demoWatershedData';
import DataBadge from '@/components/common/DataBadge';

interface BeforeAfterSwipeProps {
  watershedId?: string;
}

export default function BeforeAfterSwipe({ watershedId = 'pimpalgaon' }: BeforeAfterSwipeProps) {
  const dataset = getWatershedDataset(watershedId);
  
  // View & Layout State
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'TRUE_COLOR' | 'NDVI' | 'WATER'>('TRUE_COLOR');
  const [displayLayout, setDisplayLayout] = useState<'swipe' | 'side-by-side' | 'difference' | 'lulc'>('swipe');
  const [showGisOverlay, setShowGisOverlay] = useState<boolean>(true);
  const [selectedSeason, setSelectedSeason] = useState<'MONSOON' | 'POST_MONSOON' | 'SUMMER'>('MONSOON');
  const [hoveredCoords, setHoveredCoords] = useState<{ x: number; y: number; lat: string; lng: string } | null>(null);

  // NDWI Water Classification Threshold Slider
  const [ndwiThreshold, setNdwiThreshold] = useState<number>(0.12);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    const latSpan = dataset.bounds.maxLat - dataset.bounds.minLat;
    const lngSpan = dataset.bounds.maxLng - dataset.bounds.minLng;
    const lat = (dataset.bounds.maxLat - (y / 100) * latSpan).toFixed(4);
    const lng = (dataset.bounds.minLng + (x / 100) * lngSpan).toFixed(4);
    setHoveredCoords({ x, y, lat, lng });
  };

  const getOutcomeImageSrc = () => {
    if (viewMode === 'NDVI') {
      return '/satellite/sentinel2_ndvi_analysis.jpg';
    }
    return '/satellite/sentinel2_post_2026.jpg';
  };

  // Dynamic calculation of water spread based on threshold
  const calculatedWaterHa = (dataset.stats.waterSpreadHa * (1 + (0.12 - ndwiThreshold) * 0.4)).toFixed(1);

  // LULC Transition Matrix Data
  const lulcClasses = [
    { name: 'Agriculture (Single Crop)', baselineHa: 680, outcomeHa: 410, netDelta: -270, color: '#EAB308' },
    { name: 'Agriculture (Double Crop)', baselineHa: 340, outcomeHa: 780, netDelta: +440, color: '#10B981' },
    { name: 'Riparian / Scrub Cover', baselineHa: 220, outcomeHa: 310, netDelta: +90, color: '#059669' },
    { name: 'Barren Basalt / Fallow', baselineHa: 440, outcomeHa: 180, netDelta: -260, color: '#F43F5E' },
    { name: 'Surface Water Bodies', baselineHa: 14, outcomeHa: 38, netDelta: +24, color: '#0284C7' },
    { name: 'Settlement & Roads', baselineHa: 146, outcomeHa: 152, netDelta: +6, color: '#94A3B8' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Panel */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
              Scientific Bi-Temporal Satellite Change Analysis
            </h2>
            <DataBadge status="VERIFIED" source="Sentinel-2 L2A (10m BOA)" compact />
          </div>
          <p className="text-xs text-[#94A3B8] font-mono">
            Bi-temporal surface reflectance comparison across {dataset.stats.name} ({dataset.stats.code} • {dataset.stats.catchmentHa.toLocaleString()} Ha • {dataset.stats.district}).
          </p>
        </div>

        {/* Season Selector & Quality Metadata */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex items-center bg-[#0B0F15] p-1 rounded-xl border border-[#233041]">
            <button
              onClick={() => setSelectedSeason('MONSOON')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSeason === 'MONSOON' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              Kharif / Monsoon
            </button>
            <button
              onClick={() => setSelectedSeason('POST_MONSOON')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSeason === 'POST_MONSOON' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              Rabi / Post-Monsoon
            </button>
            <button
              onClick={() => setSelectedSeason('SUMMER')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSeason === 'SUMMER' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              Zaid / Summer
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B0F15] border border-[#233041] text-[#94A3B8]">
            <CloudSun className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Cloud Cover: &lt; 1.2%</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Spectral Band Mode, Layout Switcher, and Overlay */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131A24] p-3 rounded-2xl border border-[#233041] font-mono text-xs">
        <div className="flex items-center gap-2">
          {/* GIS Vector Overlay Toggle */}
          <button
            onClick={() => setShowGisOverlay(!showGisOverlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all border ${
              showGisOverlay
                ? 'bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8] font-bold'
                : 'bg-[#0B0F15] border-[#233041] text-[#94A3B8]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>GIS Overlays: {showGisOverlay ? 'ON' : 'OFF'}</span>
          </button>

          {/* Layout Mode */}
          <div className="flex items-center gap-1 bg-[#0B0F15] p-1 rounded-xl border border-[#233041]">
            <button
              onClick={() => setDisplayLayout('swipe')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                displayLayout === 'swipe' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              Swipe Arena
            </button>
            <button
              onClick={() => setDisplayLayout('side-by-side')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                displayLayout === 'side-by-side' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setDisplayLayout('difference')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                displayLayout === 'difference' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              Δ NDVI Map
            </button>
            <button
              onClick={() => setDisplayLayout('lulc')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                displayLayout === 'lulc' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              LULC Matrix
            </button>
          </div>
        </div>

        {/* Spectral Band Mode */}
        <div className="flex items-center gap-1 bg-[#0B0F15] p-1 rounded-xl border border-[#233041]">
          {(['TRUE_COLOR', 'NDVI', 'WATER'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === mode 
                  ? 'bg-[#182230] text-[#2DD4BF] font-bold border border-[#2DD4BF]/40' 
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              {mode === 'TRUE_COLOR' ? 'RGB Natural' : mode === 'NDVI' ? 'NDVI Vegetation' : 'NDWI Water Spread'}
            </button>
          ))}
        </div>
      </div>

      {/* Swipe Mode */}
      {displayLayout === 'swipe' && (
        <div className="space-y-4">
          <div 
            className="relative w-full h-[520px] bg-[#0B0F15] border border-[#233041] rounded-2xl overflow-hidden select-none shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredCoords(null)}
          >
            {/* Left Layer: 2021 Pre-Intervention Imagery */}
            <div className="absolute inset-0">
              <img 
                src="/satellite/sentinel2_pre_2021.jpg" 
                alt="2021 Baseline Sentinel-2" 
                className="w-full h-full object-cover"
              />
              
              {showGisOverlay && (
                <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full pointer-events-none opacity-70">
                  <path d="M 120 280 Q 280 250 480 260 T 720 180" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="6 3" />
                  <ellipse cx="620" cy="200" rx="30" ry="16" fill="#F43F5E" opacity="0.2" stroke="#F43F5E" strokeWidth="1.5" />
                  <text x="590" y="204" fill="#F43F5E" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="bold">14.2 Ha Water</text>
                </svg>
              )}

              <div className="absolute top-4 left-4 z-20 bg-[#0B0F15]/90 border border-[#F43F5E]/50 px-3.5 py-2 rounded-xl font-mono shadow-2xl backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F43F5E] animate-pulse" />
                  <span className="text-xs font-bold text-[#F43F5E]">2021 PRE-INTERVENTION BASELINE</span>
                </div>
                <div className="text-[10px] text-[#94A3B8] mt-0.5">
                  Sentinel-2 L2A • Mean NDVI: <span className="text-[#F1F5F9] font-bold">0.31</span> • Water: <span className="text-[#F1F5F9] font-bold">14.2 Ha</span>
                </div>
              </div>
            </div>

            {/* Right Layer: 2026 Outcome Imagery (Clipped) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img 
                src={getOutcomeImageSrc()} 
                alt="2026 Outcome Sentinel-2" 
                className="w-full h-full object-cover"
              />

              {showGisOverlay && (
                <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full pointer-events-none opacity-85">
                  <path d="M 120 280 Q 280 250 480 260 T 720 180" fill="none" stroke="#38BDF8" strokeWidth="3" />
                  <circle cx="280" cy="255" r="5" fill="#0B0F15" stroke="#2DD4BF" strokeWidth="2" />
                  <text x="250" y="240" fill="#2DD4BF" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="bold">CD-01 Basin</text>

                  <circle cx="480" cy="260" r="5" fill="#0B0F15" stroke="#2DD4BF" strokeWidth="2" />
                  <text x="450" y="245" fill="#2DD4BF" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="bold">CD-04 Desilted</text>

                  <ellipse cx="620" cy="200" rx="55" ry="30" fill="#38BDF8" opacity="0.3" stroke="#38BDF8" strokeWidth="2" />
                  <text x="585" y="204" fill="#F1F5F9" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="bold">{calculatedWaterHa} Ha (+172%)</text>
                </svg>
              )}

              <div className="absolute top-4 right-4 z-20 bg-[#0B0F15]/90 border border-[#2DD4BF]/50 px-3.5 py-2 rounded-xl font-mono shadow-2xl backdrop-blur text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs font-bold text-[#2DD4BF]">2026 POST-INTERVENTION OUTCOME</span>
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
                </div>
                <div className="text-[10px] text-[#94A3B8] mt-0.5">
                  Sentinel-2 L2A • Mean NDVI: <span className="text-[#10B981] font-bold">0.53 (+0.22 Δ)</span> • Water: <span className="text-[#38BDF8] font-bold">{calculatedWaterHa} Ha</span>
                </div>
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-[#2DD4BF] cursor-ew-resize flex items-center justify-center z-30 shadow-[0_0_25px_#2DD4BF]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-10 h-10 rounded-full bg-[#0B0F15] border-2 border-[#2DD4BF] text-[#2DD4BF] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>

            {/* Live Hover Coordinates Inspector HUD */}
            {hoveredCoords && (
              <div className="absolute bottom-4 left-4 z-30 bg-[#0B0F15]/95 border border-[#233041] px-3.5 py-2 rounded-xl font-mono text-xs text-[#94A3B8] shadow-lg backdrop-blur space-y-0.5">
                <div className="text-[10px] text-[#2DD4BF] font-bold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>GNSS: {hoveredCoords.lat}°N, {hoveredCoords.lng}°E</span>
                </div>
                <div className="text-[#F1F5F9]">
                  {sliderPosition > hoveredCoords.x ? (
                    <span className="text-[#F43F5E] font-bold">2021 Baseline: Bare Arid Soil (NDVI 0.28)</span>
                  ) : (
                    <span className="text-[#10B981] font-bold">2026 Outcome: Rejuvenated Canopy (NDVI 0.53 • +89% Δ)</span>
                  )}
                </div>
              </div>
            )}

            <input 
              type="range" 
              min="5" 
              max="95" 
              value={sliderPosition} 
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full"
            />
          </div>

          {/* NDWI Water Threshold Calibration Slider */}
          <div className="p-4 bg-[#131A24] border border-[#233041] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#38BDF8]" />
              <div>
                <span className="font-bold text-[#F1F5F9]">NDWI Water Classification Threshold:</span>
                <span className="text-[#38BDF8] font-bold ml-2">{ndwiThreshold.toFixed(2)}</span>
                <p className="text-[10px] text-[#94A3B8]">
                  Threshold formula: NDWI = (B3 - B8) / (B3 + B8) &gt; {ndwiThreshold.toFixed(2)} indicates open surface water.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-64">
              <span className="text-[10px] text-[#94A3B8]">0.00</span>
              <input
                type="range"
                min="0.00"
                max="0.30"
                step="0.02"
                value={ndwiThreshold}
                onChange={(e) => setNdwiThreshold(Number(e.target.value))}
                className="w-full accent-[#38BDF8] cursor-pointer"
              />
              <span className="text-[10px] text-[#94A3B8]">0.30</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#94A3B8]">Resulting Classified Spread:</span>
              <div className="text-sm font-bold text-[#38BDF8]">{calculatedWaterHa} Ha</div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Mode */}
      {displayLayout === 'side-by-side' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl overflow-hidden border border-[#F43F5E]/40 flex flex-col">
            <div className="p-3.5 bg-[#0B0F15] border-b border-[#233041] flex items-center justify-between font-mono text-xs">
              <span className="text-[#F43F5E] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F43F5E]" /> 2021 Pre-Intervention Baseline
              </span>
              <span className="text-[#94A3B8]">Sentinel-2 L2A • NDVI 0.31</span>
            </div>
            <div className="h-[420px] bg-[#0B0F15] relative">
              <img src="/satellite/sentinel2_pre_2021.jpg" alt="2021" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-[#2DD4BF]/40 flex flex-col">
            <div className="p-3.5 bg-[#0B0F15] border-b border-[#233041] flex items-center justify-between font-mono text-xs">
              <span className="text-[#2DD4BF] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" /> 2026 Post-Intervention Outcome
              </span>
              <span className="text-[#10B981] font-bold">Sentinel-2 L2A • NDVI 0.53 ({dataset.stats.meanNdviDelta})</span>
            </div>
            <div className="h-[420px] bg-[#0B0F15] relative">
              <img src={getOutcomeImageSrc()} alt="2026" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* Difference Map Mode */}
      {displayLayout === 'difference' && (
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#233041]">
            <div>
              <h3 className="text-sm font-bold text-[#F1F5F9] font-sans flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2DD4BF]" />
                Sentinel-2 Calibrated ΔNDVI Spectral Difference Layer
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                Per-pixel Band 8 (NIR) - Band 4 (Red) computed index difference over {dataset.stats.catchmentHa.toLocaleString()} Ha.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-[#0B0F15] border border-[#233041] text-xs font-mono text-[#10B981] font-bold">
              MEAN CATCHMENT ΔNDVI: {dataset.stats.meanNdviDelta}
            </span>
          </div>

          <div className="h-[460px] w-full rounded-xl overflow-hidden border border-[#233041] relative">
            <img src="/satellite/sentinel2_ndvi_analysis.jpg" alt="NDVI Chloropleth" className="w-full h-full object-cover" />
          </div>

          {/* Color Ramp Legend */}
          <div className="bg-[#0B0F15] rounded-xl border border-[#233041] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            <span className="text-[#94A3B8] text-[10px] uppercase font-bold">ΔNDVI Color Ramp:</span>
            <div className="flex items-center gap-2 w-full max-w-md">
              <span className="text-[10px] text-[#F43F5E]">&lt;0.0 Loss</span>
              <div className="flex-1 h-3 rounded-full bg-gradient-to-r from-[#F43F5E] via-[#F59E0B] via-[#34D399] to-[#047857]" />
              <span className="text-[10px] text-[#10B981]">&gt;+0.3 Dense Flush</span>
            </div>
            <span className="text-[#38BDF8] text-[10px] font-bold">Deep Blue: Water Impoundment (NDWI &gt; 0.12)</span>
          </div>
        </div>
      )}

      {/* LULC Transition Matrix Mode */}
      {displayLayout === 'lulc' && (
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
            <div>
              <h3 className="text-sm font-bold text-[#F1F5F9] font-sans flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#2DD4BF]" />
                Land-Use / Land-Cover (LULC) Classification Transition Matrix (2021 vs 2026)
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                Multi-spectral phenological transition across {dataset.stats.catchmentHa} Ha in {dataset.stats.name}.
              </p>
            </div>
            <DataBadge status="MODELED" compact />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0B0F15] text-[#94A3B8] border-b border-[#233041]">
                <tr>
                  <th className="p-3">LULC Land-Cover Class</th>
                  <th className="p-3">2021 Baseline Area</th>
                  <th className="p-3">2026 Outcome Area</th>
                  <th className="p-3">Net Delta (Ha)</th>
                  <th className="p-3">Percentage Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#233041]">
                {lulcClasses.map((item, idx) => {
                  const pct = ((item.netDelta / item.baselineHa) * 100).toFixed(1);
                  return (
                    <tr key={idx} className="hover:bg-[#182230]/50 transition-colors">
                      <td className="p-3 font-semibold text-[#F1F5F9] flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </td>
                      <td className="p-3 text-[#94A3B8]">{item.baselineHa} Ha</td>
                      <td className="p-3 text-[#F1F5F9] font-bold">{item.outcomeHa} Ha</td>
                      <td className={`p-3 font-bold ${item.netDelta >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                        {item.netDelta >= 0 ? `+${item.netDelta}` : item.netDelta} Ha
                      </td>
                      <td className={`p-3 font-bold ${item.netDelta >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                        {item.netDelta >= 0 ? `+${pct}%` : `${pct}%`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 12-Month Pixel Time-Series Trajectory with IMD Rainfall */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#233041]">
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9] font-sans flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#2DD4BF]" />
              12-Month Multi-Spectral Phenology vs IMD Monthly Precipitation
            </h3>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Demonstrates the temporal coupling of precipitation flushes with vegetation canopy response.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              Outcome NDVI (2025-26)
            </span>
            <span className="flex items-center gap-1.5 text-[#F43F5E]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
              Baseline NDVI (2020-21)
            </span>
            <span className="flex items-center gap-1.5 text-[#38BDF8]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
              Rainfall (mm)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataset.ndviSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#233041" opacity={0.5} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} fontFamily="monospace" />
              <YAxis yAxisId="left" stroke="#10B981" domain={[0, 0.8]} fontSize={11} fontFamily="monospace" />
              <YAxis yAxisId="right" orientation="right" stroke="#38BDF8" domain={[0, 250]} fontSize={11} fontFamily="monospace" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B0F15', border: '1px solid #233041', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
              />
              <Area yAxisId="left" type="monotone" dataKey="ndvi" name="2026 NDVI" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
              <Area yAxisId="left" type="monotone" dataKey="baselineNdvi" name="2021 Baseline NDVI" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2" />
              <Area yAxisId="right" type="monotone" dataKey="rainfallMm" name="Rainfall (mm)" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.15} strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scientific Limitation & Provenance Card */}
      <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl space-y-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#F59E0B] font-bold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          SCIENTIFIC CAUSALITY DISCLAIMER & ENVIRONMENTAL FACTORS
        </div>
        <p className="text-[#F1F5F9] leading-relaxed text-[11px]">
          Increased Normalized Difference Vegetation Index (NDVI) is an indicator of green canopy biomass and surface moisture, but does <strong>not</strong> constitute direct proof of deep aquifer recharge, sustained crop yields, or intervention success in isolation. Canopy flushes are heavily coupled with Southwest/Northeast monsoon rainfall distribution. Attribution of vegetation growth to civil structures requires concurrent comparison with untreated control sites and dug-well groundwater telemetry.
        </p>
      </div>
    </div>
  );
}
