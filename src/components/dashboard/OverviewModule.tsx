'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ArrowRight, 
  Layers, 
  Map, 
  TrendingUp, 
  Droplet, 
  ShieldCheck, 
  Compass, 
  Camera, 
  Sparkles, 
  FileText,
  AlertTriangle,
  Upload,
  Cpu,
  BarChart3,
  CheckCircle2,
  Clock,
  ExternalLink,
  Activity,
  Zap
} from 'lucide-react';
import { getWatershedDataset } from '@/data/demoWatershedData';
import DashboardOverview from './DashboardOverview';

interface OverviewModuleProps {
  onOpenGis: () => void;
  onNavigateTab: (tab: string) => void;
  onSelectFeature?: (id: string) => void;
  currentRole?: 'officer' | 'field' | 'analyst';
  watershedId?: string;
}

export default function OverviewModule({ 
  onOpenGis, 
  onNavigateTab, 
  onSelectFeature,
  currentRole = 'officer',
  watershedId = 'bhavani'
}: OverviewModuleProps) {
  const [subView, setSubView] = useState<'telemetry' | 'pipeline'>('telemetry');
  const dataset = getWatershedDataset(watershedId);
  const watershedStats = dataset.stats;
  const demoEvidence = dataset.evidence;
  const demoInterventions = dataset.interventions;

  return (
    <div id="overview-top" className="space-y-6 animate-fadeIn max-w-[1400px] mx-auto pb-12">
      {/* Top Navigation & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131A24] border border-[#233041] rounded-2xl p-2.5 sm:px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSubView('telemetry')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
              subView === 'telemetry'
                ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] shadow-lg shadow-[#2DD4BF]/20'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#182230]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Catchment Telemetry & Hydrology</span>
          </button>

          <button
            onClick={() => setSubView('pipeline')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
              subView === 'pipeline'
                ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] shadow-lg shadow-[#2DD4BF]/20'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#182230]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>4-Stage Architecture & Methodology</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>{watershedStats.code} • WDC-PMKSY 2.0</span>
        </div>
      </div>

      {/* Subview 1: Catchment Telemetry Dashboard */}
      {subView === 'telemetry' && (
        <DashboardOverview 
          onSelectFeature={onSelectFeature || onOpenGis}
          onViewAllInterventions={onOpenGis}
          onNavigateTab={onNavigateTab}
          currentRole={currentRole}
          watershedId={watershedId}
        />
      )}

      {/* Subview 2: Operational Architecture & Methodology */}
      {subView === 'pipeline' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Header & Context Strip */}
          <div className="border-b border-[#233041] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-2xl bg-[#0B0F15] border border-[#2DD4BF]/50 flex items-center justify-center shadow-lg shadow-[#2DD4BF]/20 overflow-hidden shrink-0 group">
                  <Image 
                    src="/watershed360_logo.jpg" 
                    alt="Watershed360 Official Logo"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F5F9] font-sans">
                      WATERSHED<span className="text-[#2DD4BF]">360</span>
                    </h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-[#2DD4BF] font-semibold">
                      PMKSY-WDC 2.0
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                    Geospatial Intelligence for Watershed Development
                  </p>
                  <p className="text-[10px] text-[#2DD4BF]/80 font-mono tracking-wider uppercase mt-0.5">
                    People • Land • Water • A Sustainable Tomorrow
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-xl bg-[#131A24] border border-[#233041] flex items-center gap-2">
                <span className="text-[#94A3B8]">Selected Catchment:</span>
                <span className="text-[#F1F5F9] font-bold">{watershedStats.code}</span>
                <span className="text-[#64748B]">({watershedStats.district})</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-[#0B0F15] border border-[#2DD4BF]/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span className="text-[#2DD4BF] font-bold">Calibrated Sample Fixture</span>
              </div>

              <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Updated: Aug 2026</span>
              </div>
            </div>
          </div>

          {/* Prominent Hero & Value Proposition */}
          <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-[#233041] relative overflow-hidden bg-gradient-to-br from-[#131A24] via-[#101E2E] to-[#0B0F15]">
            <div className="max-w-3xl space-y-3 sm:space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase text-[#2DD4BF] bg-[#2DD4BF]/10 px-2.5 py-1 rounded-full border border-[#2DD4BF]/20">
                <Sparkles className="w-3.5 h-3.5" /> End-to-End Decision Pipeline
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#F1F5F9] tracking-tight font-sans leading-snug">
                Transform watershed data into actionable development insights.
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#94A3B8] font-mono leading-relaxed">
                WATERSHED360 overlays analytical modeling on top of existing SRISHTI-DRISHTI records — translating multi-spectral satellite imagery, DEM topography, and field photos into verified outcomes and prioritized civil interventions.
              </p>
              
              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onOpenGis}
                  className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-mono font-bold text-xs sm:text-sm hover:brightness-110 shadow-xl shadow-[#2DD4BF]/20 flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>Open Watershed Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigateTab('reports')}
                  className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl bg-[#182230] hover:bg-[#1E2C3D] border border-[#233041] text-[#F1F5F9] font-mono font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#2DD4BF]" />
                  <span>View Impact Report</span>
                </button>
              </div>
            </div>

            {/* Decorative background grid */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#2DD4BF]/5 to-transparent pointer-events-none hidden lg:block" />
          </div>

          {/* 4-Step Practical Workflow Bar: Input -> Processing -> Output -> Decision */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#94A3B8] uppercase font-bold tracking-wider px-1">
              The 4-Stage Operational Architecture
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
              {/* Step 1: Input */}
              <div className="glass-card rounded-2xl p-5 border border-[#233041] space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded">STEP 01</span>
                  <Upload className="w-4 h-4 text-[#38BDF8]" />
                </div>
                <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">Input Data Layer</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Connect or upload micro-catchment cadastral boundaries, SRISHTI-DRISHTI records, Copernicus Sentinel-2 (10m BOA), and 30m DEM elevation.
                </p>
              </div>

              {/* Step 2: Processing */}
              <div className="glass-card rounded-2xl p-5 border border-[#233041] space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded">STEP 02</span>
                  <Cpu className="w-4 h-4 text-[#2DD4BF]" />
                </div>
                <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">Spatial & AI Processing</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Compute Strahler stream orders (1–4), multi-temporal NDVI/NDWI reflectance change, RUSLE soil loss, and Gemini vision photo validation.
                </p>
              </div>

              {/* Step 3: Output */}
              <div className="glass-card rounded-2xl p-5 border border-[#233041] space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">STEP 03</span>
                  <BarChart3 className="w-4 h-4 text-[#10B981]" />
                </div>
                <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">Traceable Outputs</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Generate interactive bi-temporal swipe maps, groundwater dug-well telemetry charts, structure siltation health gauges, and audit trails.
                </p>
              </div>

              {/* Step 4: Decision */}
              <div className="glass-card rounded-2xl p-5 border border-[#233041] space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded">STEP 04</span>
                  <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">Informed Decisions</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Execute MCDA sub-catchment prioritization, synthesize civil remediation packages (CCT, desilting), and produce 1-click evaluation dossiers.
                </p>
              </div>
            </div>
          </div>

          {/* 4-Tier Data Classification Legend */}
          <div className="bg-[#0B0F15] rounded-xl border border-[#233041] p-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
            <span className="text-[#94A3B8] uppercase font-bold text-[10px]">Data Integrity Standard:</span>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-[#10B981]">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Measured Data
              </span>
              <span className="flex items-center gap-1.5 text-[#A855F7]">
                <span className="w-2 h-2 rounded-full bg-[#A855F7]"></span> AI Interpretation
              </span>
              <span className="flex items-center gap-1.5 text-[#F59E0B]">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> Proposed Recommendation
              </span>
              <span className="flex items-center gap-1.5 text-[#64748B]">
                <span className="w-2 h-2 rounded-full bg-[#64748B]"></span> Not Yet Connected
              </span>
            </div>
          </div>

          {/* Overview Outputs: Traceable Key Metrics Cards */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#94A3B8] uppercase font-bold tracking-wider px-1">
              Core Catchment Indicators (Traceable to Source)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
              {/* Card 1: Area */}
              <div className="glass-card rounded-2xl p-5 border border-[#233041] flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
                    <span>WATERSHED AREA</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                      MEASURED
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#F1F5F9] font-sans">
                    {watershedStats.catchmentHa} <span className="text-xs font-mono text-[#94A3B8]">Ha</span>
                  </div>
                </div>
                <div className="text-[10px] text-[#94A3B8] border-t border-[#233041] pt-2 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Source:</span>
                    <span className="text-[#F1F5F9]">National Watershed Atlas</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Boundary:</span>
                    <span className="text-[#2DD4BF]">Cadastral Vector (2021)</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Interventions */}
              <div className="glass-card rounded-2xl p-5 border border-[#233041] flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
                    <span>CIVIL ASSETS</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                      MEASURED
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#F1F5F9] font-sans">
                    {watershedStats.totalInterventions} <span className="text-xs font-mono text-[#94A3B8]">Structures</span>
                  </div>
                </div>
                <div className="text-[10px] text-[#94A3B8] border-t border-[#233041] pt-2 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Source:</span>
                    <span className="text-[#F1F5F9]">SRISHTI Sanctioned MIS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-[#10B981]">12 Geocoded (Aug 2026)</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Water Spread */}
              <div className="glass-card rounded-2xl p-5 border border-[#233041] flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
                    <span>WATER SPREAD</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                      MEASURED
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#38BDF8] font-sans">
                    {watershedStats.waterSpreadHa} <span className="text-xs font-mono text-[#94A3B8]">Ha</span>
                  </div>
                </div>
                <div className="text-[10px] text-[#94A3B8] border-t border-[#233041] pt-2 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Source:</span>
                    <span className="text-[#F1F5F9]">Sentinel-2 NDWI</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delta:</span>
                    <span className="text-[#10B981]">+{watershedStats.waterSpreadDeltaPercent}% Live Pool</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Vegetation */}
              <div className="glass-card rounded-2xl p-5 border border-[#233041] flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
                    <span>MEAN NDVI</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                      MEASURED
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#10B981] font-sans">
                    {watershedStats.meanNdviDelta}
                  </div>
                </div>
                <div className="text-[10px] text-[#94A3B8] border-t border-[#233041] pt-2 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Source:</span>
                    <span className="text-[#F1F5F9]">Sentinel-2 (10m L2A)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Baseline:</span>
                    <span className="text-[#10B981]">0.31 (2021) → 0.48 (2026)</span>
                  </div>
                </div>
              </div>

              {/* Card 5: Field Evidence */}
              <div className="glass-card rounded-2xl p-5 border border-[#233041] flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
                    <span>FIELD EVIDENCE</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#A855F7]/15 text-[#A855F7] border border-[#A855F7]/30">
                      AI + AUDIT
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#A855F7] font-sans">
                    {demoEvidence.length} <span className="text-xs font-mono text-[#94A3B8]">Audits</span>
                  </div>
                </div>
                <div className="text-[10px] text-[#94A3B8] border-t border-[#233041] pt-2 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Pipeline:</span>
                    <span className="text-[#F1F5F9]">SRISHTI + Gemini Vision</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Review:</span>
                    <span className="text-[#10B981]">3 Verified • 1 Triage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Honest Connection Status Strip */}
          <div className="p-4 rounded-2xl bg-[#0B0F15] border border-[#233041] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#F1F5F9] font-bold block">Primary System of Record: ISRO Bhuvan / SRISHTI-DRISHTI</span>
                <span className="text-[#94A3B8] text-[11px]">Direct national portal connection is pending administrative credentials. Calibrated open fixtures (Copernicus Sentinel-2, 30m DEM) active.</span>
              </div>
            </div>
            <button
              onClick={onOpenGis}
              className="px-4 py-2 rounded-xl bg-[#182230] hover:bg-[#1E2C3D] border border-[#233041] text-[#2DD4BF] font-bold transition-all text-xs shrink-0 flex items-center gap-1.5"
            >
              <span>Launch GIS View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
