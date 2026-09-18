'use client';

import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Map, 
  ArrowLeftRight, 
  Camera, 
  AlertTriangle, 
  ShieldCheck, 
  Layers,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function GuidedTourModal({ isOpen, onClose, onNavigateTab }: GuidedTourModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to Watershed360',
      subtitle: 'Analytical Intelligence Layer on Top of SRISHTI-DRISHTI',
      icon: Compass,
      color: '#2DD4BF',
      tab: 'dashboard',
      content: 'SRISHTI-DRISHTI already collects and displays watershed data. WATERSHED360 is the analytical layer that turns it into actionable before/after evidence of what is working — so a watershed officer can see the change, not just the imagery.',
      highlights: [
        'Analytical overlay on top of existing SRISHTI-DRISHTI data pipeline',
        'Multi-Spectral Sentinel-2 (10m VNIR) & Copernicus 30m DEM (dev stand-ins)',
        'Simple, modern dashboard for visualizing multi-temporal outcomes'
      ]
    },
    {
      title: 'Flagship: Bi-Temporal Change Analysis',
      subtitle: 'Draggable Multi-Spectral Surface Reflectance & Water Body Comparison',
      icon: ArrowLeftRight,
      color: '#10B981',
      tab: 'analysis',
      content: 'The centerpiece of WATERSHED360: compare pre-intervention baseline (2021) versus post-treatment outcome (2026) across NDVI Biomass, Sentinel-2 True Color, and NDWI Water Index with interactive split swipe slider and side-by-side spectral metrics.',
      highlights: [
        '+0.17 Mean NDVI accretion (+54.8% vegetative canopy recovery)',
        '+24.4 Ha surface water spread expansion (+171.8%)',
        'Interactive before/after swipe revealing restored gully streams and ponds'
      ]
    },
    {
      title: 'Dense Instrument GIS Explorer',
      subtitle: 'Dynamic Cartography with Elevation Contours & Temporal Scrubber',
      icon: Map,
      color: '#38BDF8',
      tab: 'explorer',
      content: 'Explore Micro-Catchment 4E2B5c-09 with full vector overlays: Strahler drainage orders with animated downstream flow, elevation contours (620m–700m MSL), priority zones, water impoundments, and an interactive 2021-2026 temporal timeline scrubber.',
      highlights: [
        'Live stream currents animated along hydraulic paths',
        'Interactive structure inspector with technical parameters and siltation tracking',
        'Docked time scrubber and legend panels with zero UI clipping'
      ]
    },
    {
      title: 'SRISHTI-DRISHTI Field Evidence',
      subtitle: 'Cross-Referencing Geo-Tagged Field Records with AI Telemetry (Demo Model)',
      icon: Camera,
      color: '#F59E0B',
      tab: 'evidence',
      content: 'WATERSHED360 consumes and cross-references SRISHTI-DRISHTI geo-tagged field records against satellite observations. The integrated AI vision model demonstrates automated siltation assessment and structural condition diagnosis.',
      highlights: [
        'Sub-3m GNSS precision audit trail display',
        'AI-assisted masonry & sediment segmentation (demo model)',
        'Human-in-the-loop auditor verification actions'
      ]
    },
    {
      title: 'Multi-Criteria Priority Intelligence',
      subtitle: 'Transparent Composite Vulnerability Scoring & Intervention Planning',
      icon: AlertTriangle,
      color: '#F43F5E',
      tab: 'priority',
      content: 'Identify erosion hotspots and vulnerable slopes before failure occurs. Adjust MCDA weighting factors (Slope, Soil Loss, NDVI Deficit, Stream Distance) to dynamically re-rank sub-catchment priority zones with instant remediation recommendations.',
      highlights: [
        'Transparent composite ranking (0-100 score)',
        'Actionable civil engineering recommendations (CCT, Gabions, Desilting)',
        'Direct 1-click location highlight in GIS map'
      ]
    },
    {
      title: 'Scientific Impact Scorecard & Provenance',
      subtitle: 'Rigorous Demonstration Indicators with Zero Fabricated Data Guarantee',
      icon: ShieldCheck,
      color: '#2DD4BF',
      tab: 'assessment',
      content: 'Every single metric (Biomass, Water Table Recovery, RUSLE Soil Loss, Crop Intensity) is documented with mathematical methodology, data resolution, confidence intervals, and known limitations in accordance with scientific peer standards.',
      highlights: [
        'Full data provenance registry with SRISHTI-DRISHTI as primary input target',
        'Automated 1-click printable Executive Catchment Dossier',
        '100% compliant with MoRD / WDC-PMKSY guidelines'
      ]
    }
  ];

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;

  const handleGoToStep = (index: number) => {
    setCurrentStep(index);
    onNavigateTab(tourSteps[index].tab);
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      handleGoToStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      handleGoToStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#131A24] border border-[#2DD4BF]/40 rounded-xl max-w-2xl w-full p-6 shadow-2xl shadow-[#2DD4BF]/15 relative overflow-hidden">
        {/* Glow background accent */}
        <div 
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: step.color }}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#233041] relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#0B0F15] border border-[#233041]" style={{ color: step.color }}>
              <StepIcon className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2DD4BF]">
                JURY SPOTLIGHT TOUR • STEP {currentStep + 1} OF {tourSteps.length}
              </span>
              <h3 className="text-base font-bold text-[#F1F5F9] font-sans">
                {step.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] rounded-lg hover:bg-[#1E2C3D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-4 relative z-10">
          <p className="text-xs font-mono font-medium text-[#2DD4BF]">
            {step.subtitle}
          </p>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            {step.content}
          </p>

          <div className="bg-[#0B0F15] border border-[#233041] rounded-lg p-3.5 space-y-2">
            <div className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase">
              Key Technical Innovations
            </div>
            <ul className="space-y-1.5 text-xs text-[#F1F5F9] font-sans">
              {step.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-[#233041] flex items-center justify-between relative z-10">
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => handleGoToStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep ? 'w-6 bg-[#2DD4BF]' : 'w-2 bg-[#233041] hover:bg-[#94A3B8]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-3 py-1.5 rounded-lg border border-[#233041] flex items-center gap-1 transition-colors ${
                currentStep === 0
                  ? 'opacity-40 cursor-not-allowed text-[#94A3B8]'
                  : 'bg-[#182230] text-[#F1F5F9] hover:bg-[#1E2C3D]'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-bold hover:brightness-110 shadow-lg shadow-[#2DD4BF]/20 flex items-center gap-1 transition-all"
            >
              {currentStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next Stage'} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
