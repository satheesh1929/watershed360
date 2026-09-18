'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Layers, 
  Activity, 
  Droplet, 
  ShieldCheck, 
  ArrowUpRight,
  Sparkles,
  Award,
  RefreshCw,
  CheckCircle2,
  Cpu,
  BarChart3,
  Search,
  Terminal,
  Users,
  Compass,
  Zap,
  Globe
} from 'lucide-react';
import { 
  getWatershedDataset,
  demoInterventions as defaultInterventions, 
  demoPriorityZones as defaultPriorityZones, 
  demoEvidence as defaultEvidence, 
  demoNdviSeries as defaultNdviSeries, 
  watershedStats as defaultStats,
  demoWells as defaultWells,
  demoHydrologicalBudget as defaultHydrologicalBudget
} from '@/data/demoWatershedData';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Area
} from 'recharts';

interface DashboardOverviewProps {
  onSelectFeature: (id: string) => void;
  onViewAllInterventions: () => void;
  onNavigateTab?: (tab: string) => void;
  currentRole?: 'officer' | 'field' | 'analyst';
  watershedId?: string;
}

export default function DashboardOverview({ 
  onSelectFeature, 
  onViewAllInterventions,
  onNavigateTab,
  currentRole = 'officer',
  watershedId = 'bhavani'
}: DashboardOverviewProps) {
  const [mounted, setMounted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeWellFilter, setActiveWellFilter] = useState<string>('ALL');

  const dataset = getWatershedDataset(watershedId);
  const watershedStats = dataset.stats;
  const demoInterventions = dataset.interventions;
  const demoPriorityZones = dataset.priorityZones;
  const demoEvidence = dataset.evidence;
  const demoNdviSeries = dataset.ndviSeries;
  const demoWells = dataset.wells;
  const demoHydrologicalBudget = dataset.hydrologicalBudget;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Streaming Live Terminal Logs
  const [logIndex, setLogIndex] = useState(0);
  const liveLogs = [
    { time: '11:12:04 UTC', tag: 'SENTINEL-2', msg: `Band 8 (NIR) & Band 4 (Red) BOA tiles calibrated for ${watershedStats.name} (${watershedStats.code}).` },
    { time: '11:12:15 UTC', tag: 'YOLOv9', msg: `Field photo audit: ${demoEvidence[0]?.caption || 'Check Dam'} structure intact. Action logged in TAWDEVA ledger.` },
    { time: '11:12:28 UTC', tag: 'POSTGIS', msg: `R-Tree spatial index validated: ${demoInterventions.length} civil structures intersecting Strahler stream orders 1-4.` },
    { time: '11:12:42 UTC', tag: 'HYDRO-GW', msg: `Well ${demoWells[0]?.code || 'DW-01'} telemetry sync: ${demoWells[0]?.netRecoveryM ? '+' + demoWells[0].netRecoveryM + 'm' : '+4.2m'} water table recovery recorded in ${demoWells[0]?.village || 'Command Village'}.` },
    { time: '11:13:01 UTC', tag: 'IMD-GRID', msg: `Daily precipitation raster updated: Tamil Nadu IMD AWS normal at ${watershedStats.annualRainfallMm} mm.` },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % liveLogs.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [liveLogs.length]);

  const verifiedInterventions = demoInterventions.filter(i => i.status === 'VERIFIED_ACTIVE').length;
  const criticalZones = demoPriorityZones.filter(z => z.riskLevel === 'CRITICAL' || z.riskLevel === 'HIGH').length;

  const handleRunDiagnostic = () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanComplete(true);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Watershed Intelligence Briefing */}
      <div className="border border-[#233041] rounded-2xl p-6 bg-gradient-to-r from-[#131A24] via-[#182230] to-[#131A24] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#2DD4BF]/10 via-[#38BDF8]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2DD4BF]"></span>
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#F1F5F9] tracking-tight font-sans">
                {watershedStats.name} Intelligence Briefing
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 text-xs font-mono font-bold text-[#2DD4BF]">
                {watershedStats.code}
              </span>
              <span className="demo-badge">
                <Sparkles className="w-3 h-3" /> CALIBRATED GIS FIXTURE
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-[#94A3B8] font-mono leading-relaxed">
              {watershedStats.district} • Catchment Area: <span className="text-[#F1F5F9] font-bold">{watershedStats.catchmentHa} Ha</span> • Ingestion: <span className="text-[#2DD4BF]">Sentinel-2 (10m L2A)</span> • Elevation: Copernicus 30m DEM
            </p>

            {/* Role-tailored alert tag */}
            <div className="pt-1 flex items-center gap-2 text-xs font-mono">
              <span className="text-[#94A3B8]">Active Persona:</span>
              <span className="text-[#2DD4BF] font-bold uppercase bg-[#0B0F15] px-2.5 py-0.5 rounded-lg border border-[#233041]">
                {currentRole === 'officer' ? 'District Executive Officer' : currentRole === 'field' ? 'Field Ground-Truth Engineer' : 'GIS Remote Sensing Analyst'}
              </span>
              <span className="text-[#64748B] hidden sm:inline">•</span>
              <span className="text-[#94A3B8] hidden sm:inline">
                {currentRole === 'officer' ? 'Executive overview: Beneficiaries, budgets & policy outcomes' : currentRole === 'field' ? 'Field operations: Siltation triage & GNSS mobile photo audits' : 'Spatial analytics: Sentinel-2 BOA bands, Strahler streams & DEM'}
              </span>
            </div>
          </div>

          {/* Real-time Diagnostic Scanner Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleRunDiagnostic}
              disabled={isScanning}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                isScanning 
                  ? 'bg-[#182230] text-[#2DD4BF] border border-[#2DD4BF]/40 cursor-wait' 
                  : scanComplete
                  ? 'bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981]'
                  : 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] hover:brightness-110 shadow-[#2DD4BF]/20 active:scale-95'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-[#2DD4BF]' : ''}`} />
              {isScanning ? `Scanning Sentinel-2 Bands (${scanProgress}%)...` : scanComplete ? 'Diagnostic Complete (100% OK)' : 'Run Multi-Spectral Diagnostic'}
            </button>
          </div>
        </div>

        {/* Scan Results Toast Notification */}
        {scanComplete && (
          <div className="mt-4 p-3.5 bg-[#10B981]/15 border border-[#10B981]/40 rounded-xl flex items-center justify-between text-xs font-mono text-[#10B981] animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Multi-spectral telemetry scan passed: 12 structures georeferenced • Mean NDVI +0.17 verified • 6 open wells monitored • 0 data anomalies.</span>
            </div>
            <button 
              onClick={() => setScanComplete(false)} 
              className="text-[#94A3B8] hover:text-[#F1F5F9] text-[11px]"
            >
              DISMISS
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Role-Based Workbench Strip (Customized by Persona Selector) */}
      <div className="glass-panel-glow rounded-2xl p-4 border border-[#2DD4BF]/30 transition-all">
        {currentRole === 'officer' && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2DD4BF]/15 text-[#2DD4BF] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#F1F5F9] font-sans block">Executive Decision Summary</span>
                <span className="text-[#94A3B8]">WDC-PMKSY 2.0 micro-watershed allocation: ₹28.40 Lakhs (demo estimate) for 420 beneficiary farmers.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => onNavigateTab && onNavigateTab('priority')} 
                className="px-3 py-1.5 rounded-lg bg-[#2DD4BF] text-[#0B0F15] font-bold hover:brightness-110 transition-all"
              >
                View Sanction Plan
              </button>
              <button 
                onClick={() => onNavigateTab && onNavigateTab('assessment')} 
                className="px-3 py-1.5 rounded-lg bg-[#182230] text-[#F1F5F9] border border-[#233041] hover:bg-[#1E2C3D] transition-all"
              >
                Impact Scorecard
              </button>
            </div>
          </div>
        )}

        {currentRole === 'field' && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#F43F5E]/15 text-[#F43F5E] shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#F1F5F9] font-sans block">Field Operations Triage Alert</span>
                <span className="text-[#94A3B8]">Check Dam CD-04 at 54% siltation requires desilting • 4 geotagged photo audits pending verification.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => onSelectFeature('int-04')} 
                className="px-3 py-1.5 rounded-lg bg-[#F43F5E] text-white font-bold hover:brightness-110 transition-all"
              >
                Inspect CD-04
              </button>
              <button 
                onClick={() => onNavigateTab && onNavigateTab('evidence')} 
                className="px-3 py-1.5 rounded-lg bg-[#182230] text-[#F1F5F9] border border-[#233041] hover:bg-[#1E2C3D] transition-all"
              >
                Audit Photos
              </button>
            </div>
          </div>
        )}

        {currentRole === 'analyst' && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#F1F5F9] font-sans block">GIS Remote Sensing Parameters</span>
                <span className="text-[#94A3B8]">Sentinel-2 BOA (B08 NIR 842nm / B04 Red 665nm) • NDVI Δ: +0.17 • Strahler Orders: 1–4 indexed.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => onNavigateTab && onNavigateTab('explorer')} 
                className="px-3 py-1.5 rounded-lg bg-[#38BDF8] text-[#0B0F15] font-bold hover:brightness-110 transition-all"
              >
                Open GIS Map
              </button>
              <button 
                onClick={() => onNavigateTab && onNavigateTab('sources')} 
                className="px-3 py-1.5 rounded-lg bg-[#182230] text-[#F1F5F9] border border-[#233041] hover:bg-[#1E2C3D] transition-all"
              >
                STAC Schemas
              </button>
            </div>
          </div>
        )}
      </div>

      {/* KPI Highlight Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Structures */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1">
            <span>CIVIL STRUCTURES</span>
            <div className="p-2 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF] group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-extrabold text-[#F1F5F9]">{watershedStats.totalInterventions}</span>
            <span className="text-xs font-mono font-semibold text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded">
              12 Geolocated
            </span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-[#94A3B8] flex items-center justify-between border-t border-[#233041] pt-2.5">
            <span>Verified Active:</span>
            <span className="text-[#2DD4BF] font-bold">{verifiedInterventions} of {watershedStats.totalInterventions} ({Math.round(verifiedInterventions/watershedStats.totalInterventions*100)}%)</span>
          </div>
        </div>

        {/* NDVI Biomass */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1">
            <span>BIOMASS ACCRETION (ΔNDVI)</span>
            <div className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981] group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-extrabold text-[#10B981]">{watershedStats.meanNdviDelta}</span>
            <span className="text-xs font-mono text-[#F1F5F9] font-medium">(0.48 vs 0.31)</span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-[#94A3B8] flex items-center justify-between border-t border-[#233041] pt-2.5">
            <span>Canopy Increase:</span>
            <span className="text-[#10B981] font-bold">+54.8% Greening Index</span>
          </div>
        </div>

        {/* Water Surface Spread */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1">
            <span>WATER RETENTION</span>
            <div className="p-2 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] group-hover:scale-110 transition-transform">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-extrabold text-[#38BDF8]">{watershedStats.waterSpreadHa} Ha</span>
            <span className="text-xs font-mono font-semibold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded">
              +{watershedStats.waterSpreadDeltaPercent}%
            </span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-[#94A3B8] flex items-center justify-between border-t border-[#233041] pt-2.5">
            <span>Storage Capacity:</span>
            <span className="text-[#F1F5F9] font-bold">{watershedStats.estimatedStorageTcm} TCM Total</span>
          </div>
        </div>

        {/* Groundwater Recovery & Farmers */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-1">
            <span>GROUNDWATER TABLE</span>
            <div className="p-2 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-extrabold text-[#F59E0B]">{watershedStats.rechargeRateMeters}</span>
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
              420 Farmers
            </span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-[#94A3B8] flex items-center justify-between border-t border-[#233041] pt-2.5">
            <span>Crop Intensity:</span>
            <span className="text-[#F59E0B] font-bold">{watershedStats.cropIntensityPct}% Rabi Season</span>
          </div>
        </div>
      </div>

      {/* Live Ingestion Telemetry Terminal & Event Stream */}
      <div className="bg-[#0B0F15] border border-[#233041] rounded-2xl p-4 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between pb-2 border-b border-[#233041] mb-2 text-[10px] text-[#94A3B8] font-bold uppercase">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>SRISHTI-DRISHTI / Geospatial Telemetry Feed (Demo Stand-in)</span>
          </div>
          <span className="text-[#10B981] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span> STREAMING (3.5s REFRESH)
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#F1F5F9]">
          <span className="text-[#94A3B8]">{liveLogs[logIndex].time}</span>
          <span className="px-2 py-0.5 rounded bg-[#182230] text-[#2DD4BF] font-bold border border-[#233041]">
            [{liveLogs[logIndex].tag}]
          </span>
          <span className="truncate">{liveLogs[logIndex].msg}</span>
        </div>
      </div>

      {/* Main Row: Phenology Chart + Multi-Criteria Priority Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NDVI & Precipitation Trend Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-[#F1F5F9] flex items-center gap-2 font-sans">
                <Activity className="w-4 h-4 text-[#2DD4BF]" />
                12-Month Multi-Spectral Biomass vs. Rainfall Phenology
              </h2>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                Sentinel-2 10m BOA NDVI (Band 8/4) vs. IMD 0.25° Gridded Rainfall Series
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono shrink-0">
              <span className="flex items-center gap-1.5 text-[#10B981]">
                <span className="w-3 h-1 bg-[#10B981] rounded-full"></span> 2025-26 Current
              </span>
              <span className="flex items-center gap-1.5 text-[#94A3B8]">
                <span className="w-3 h-0.5 bg-[#94A3B8] border-dashed"></span> 2021 Baseline
              </span>
              <span className="flex items-center gap-1.5 text-[#38BDF8]">
                <span className="w-2.5 h-2 bg-[#38BDF8]/40 border border-[#38BDF8] rounded-sm"></span> Rain (mm)
              </span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={demoNdviSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#233041" strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#94A3B8" 
                    fontSize={11} 
                    tickLine={false} 
                    fontFamily="IBM Plex Mono" 
                  />
                  <YAxis 
                    yAxisId="ndvi" 
                    domain={[0.15, 0.7]} 
                    stroke="#10B981" 
                    fontSize={11} 
                    tickLine={false} 
                    fontFamily="IBM Plex Mono" 
                    tickFormatter={(v) => v.toFixed(2)}
                  />
                  <YAxis 
                    yAxisId="rain" 
                    orientation="right" 
                    domain={[0, 240]} 
                    stroke="#38BDF8" 
                    fontSize={11} 
                    tickLine={false} 
                    fontFamily="IBM Plex Mono" 
                    tickFormatter={(v) => `${v}mm`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#131A24', 
                      borderColor: '#233041', 
                      borderRadius: '10px',
                      fontFamily: 'IBM Plex Mono',
                      fontSize: '12px',
                      color: '#F1F5F9',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }} 
                  />
                  <Bar 
                    yAxisId="rain" 
                    dataKey="rainfallMm" 
                    fill="#38BDF8" 
                    opacity={0.35} 
                    barSize={18} 
                    radius={[4, 4, 0, 0]} 
                    name="Precipitation" 
                  />
                  <Area 
                    yAxisId="ndvi" 
                    type="monotone" 
                    dataKey="ndvi" 
                    stroke="#10B981" 
                    strokeWidth={3} 
                    fill="url(#ndviGradient)" 
                    name="NDVI 2025-26" 
                  />
                  <Line 
                    yAxisId="ndvi" 
                    type="monotone" 
                    dataKey="baselineNdvi" 
                    stroke="#94A3B8" 
                    strokeDasharray="4 4" 
                    strokeWidth={2} 
                    dot={false} 
                    name="Baseline 2021" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#64748B]">
                Initializing phenology telemetry...
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#233041] flex flex-wrap items-center justify-between text-xs font-mono text-[#94A3B8] gap-2">
            <span>Peak Post-Monsoon Greening: <span className="text-[#10B981] font-bold">October (NDVI 0.61)</span></span>
            <span className="text-[#2DD4BF]">Hydrological Lag: ~21 Days Surface Infiltration</span>
          </div>
        </div>

        {/* Priority Triage List */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-[#F1F5F9] flex items-center gap-2 font-sans">
                <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                Priority Zone Triage
              </h2>
              <span className="text-[10px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded border border-[#2DD4BF]/30">
                MCDA RANKED
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono mb-4">
              Ranked by slope gradient, soil erosion potential, and vegetative deficit.
            </p>

            <div className="space-y-3">
              {demoPriorityZones.slice(0, 3).map((zone) => (
                <div 
                  key={zone.id}
                  className="p-3.5 rounded-xl bg-[#0B0F15]/80 border border-[#233041] hover:border-[#2DD4BF] transition-all cursor-pointer group hover:scale-[1.02]"
                  onClick={() => onSelectFeature(zone.id)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#F1F5F9] font-sans group-hover:text-[#2DD4BF] transition-colors">{zone.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                      zone.riskLevel === 'CRITICAL' ? 'bg-[#F43F5E]/20 text-[#F43F5E] border-[#F43F5E]/40' :
                      zone.riskLevel === 'HIGH' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40' :
                      'bg-[#2DD4BF]/20 text-[#2DD4BF] border-[#2DD4BF]/40'
                    }`}>
                      {zone.riskLevel} ({zone.compositeScore})
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] line-clamp-1 mb-2">
                    {zone.recommendedAction}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                    <span>Area: {zone.areaHa} Ha</span>
                    <span className="text-[#2DD4BF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-bold">
                      Inspect GIS <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={onViewAllInterventions}
            className="w-full mt-4 py-2.5 px-3 rounded-xl bg-[#182230] hover:bg-[#1E2C3D] border border-[#233041] text-xs font-mono font-bold text-[#F1F5F9] transition-all text-center flex items-center justify-center gap-1.5 hover:border-[#2DD4BF]/40"
          >
            <span>View Full 12-Asset Ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#2DD4BF]" />
          </button>
        </div>
      </div>

      {/* Groundwater Open Dug-Well Telemetry Table */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#233041]">
          <div>
            <h2 className="text-base font-bold text-[#F1F5F9] flex items-center gap-2 font-sans">
              <Droplet className="w-4 h-4 text-[#38BDF8]" />
              Groundwater Open Dug-Well Telemetry Network
            </h2>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Benchmark agricultural dug wells cross-referenced with percolation tank PT-01 and check dams
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-[#0B0F15] border border-[#233041] text-xs font-mono text-[#10B981] font-bold">
            MEAN WATER TABLE RECOVERY: +4.4m
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {demoWells.map((well) => (
            <div key={well.id} className="p-3.5 bg-[#0B0F15] rounded-xl border border-[#233041] space-y-2 hover:border-[#2DD4BF]/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2DD4BF] text-xs">{well.code} • {well.village}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  well.status === 'OPTIMAL' ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30' :
                  well.status === 'RECOVERING' ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30' :
                  'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                }`}>
                  {well.status}
                </span>
              </div>
              <div className="text-[11px] text-[#F1F5F9] font-sans font-medium">
                Beneficiary: {well.farmerName}
              </div>
              <div className="space-y-1 text-[11px] text-[#94A3B8]">
                <div className="flex justify-between">
                  <span>Baseline Level (2021):</span>
                  <span>{well.baselineWaterTableM}m GL</span>
                </div>
                <div className="flex justify-between font-bold text-[#F1F5F9]">
                  <span>Current Level (2026):</span>
                  <span className="text-[#2DD4BF]">{well.currentWaterTableM}m GL</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#233041] text-[#10B981] font-bold">
                  <span>Net Recovery:</span>
                  <span>+{well.netRecoveryM} meters</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hydrological Catchment Water Balance Budget */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
          <div>
            <h2 className="text-base font-bold text-[#F1F5F9] flex items-center gap-2 font-sans">
              <Globe className="w-4 h-4 text-[#2DD4BF]" />
              Annual Catchment Hydrological Balance Budget (1,149.7 Ha-m)
            </h2>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Demonstration partitioning of normal annual rainfall across recharge, storage, and baseflow
            </p>
          </div>
        </div>

        {/* Visual Partitioning Bar */}
        <div className="h-4 rounded-full overflow-hidden flex bg-[#0B0F15] p-0.5 gap-0.5">
          <div className="bg-[#10B981] h-full rounded-l-full" style={{ width: '42%' }} title="Soil Moisture: 42%" />
          <div className="bg-[#2DD4BF] h-full" style={{ width: '24%' }} title="Aquifer Recharge: 24%" />
          <div className="bg-[#38BDF8] h-full" style={{ width: '21%' }} title="Live Storage: 21%" />
          <div className="bg-[#64748B] h-full rounded-r-full" style={{ width: '13%' }} title="Baseflow: 13%" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041]">
            <div className="flex items-center gap-1.5 text-[#10B981] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
              <span>Soil Moisture (42%)</span>
            </div>
            <div className="text-lg font-bold text-[#F1F5F9] mt-1">482.8 Ha-m</div>
            <div className="text-[10px] text-[#94A3B8]">CCT & In-situ Retention</div>
          </div>

          <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041]">
            <div className="flex items-center gap-1.5 text-[#2DD4BF] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]"></span>
              <span>Aquifer Recharge (24%)</span>
            </div>
            <div className="text-lg font-bold text-[#F1F5F9] mt-1">275.9 Ha-m</div>
            <div className="text-[10px] text-[#94A3B8]">Percolation Tanks</div>
          </div>

          <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041]">
            <div className="flex items-center gap-1.5 text-[#38BDF8] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span>
              <span>Harvested Storage (21%)</span>
            </div>
            <div className="text-lg font-bold text-[#F1F5F9] mt-1">241.4 Ha-m</div>
            <div className="text-[10px] text-[#94A3B8]">28.6 TCM Structures</div>
          </div>

          <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041]">
            <div className="flex items-center gap-1.5 text-[#64748B] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]"></span>
              <span>Pravara Baseflow (13%)</span>
            </div>
            <div className="text-lg font-bold text-[#F1F5F9] mt-1">149.6 Ha-m</div>
            <div className="text-[10px] text-[#94A3B8]">Downstream River Flow</div>
          </div>
        </div>
      </div>
    </div>
  );
}
