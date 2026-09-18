'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import OverviewModule from '@/components/dashboard/OverviewModule';
import WatershedExplorer from '@/components/explorer/WatershedExplorer';
import EvidenceModule from '@/components/evidence/EvidenceModule';
import CopilotModule from '@/components/ai/CopilotModule';
import ImpactReportsModule from '@/components/reports/ImpactReportsModule';
import ExecutiveReportModal from '@/components/common/ExecutiveReportModal';
import GuidedTourModal from '@/components/common/GuidedTourModal';
import SoftwareAccessModal from '@/components/access/SoftwareAccessModal';
import WatershedCopilot from '@/components/ai/WatershedCopilot';
import LoadingSplash from '@/components/common/LoadingSplash';
import MobileNav from '@/components/layout/MobileNav';
import { Sparkles, X } from 'lucide-react';
import { getWatershedDataset } from '@/data/demoWatershedData';

// Newly Integrated Flagship & Scientific Modules
import ResearchImageAnalysisModule from '@/components/research/ResearchImageAnalysisModule';
import BeforeAfterSwipe from '@/components/analysis/BeforeAfterSwipe';
import ImpactAssessmentModule from '@/components/assessment/ImpactAssessmentModule';
import FieldSurveyWorkspace from '@/components/field/FieldSurveyWorkspace';
import RusleModelStudio from '@/components/scientific/RusleModelStudio';
import ResearchValidationWorkbench from '@/components/validation/ResearchValidationWorkbench';
import AssessmentReportGenerator from '@/components/reports/AssessmentReportGenerator';

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showReplayVideo, setShowReplayVideo] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [currentRole, setCurrentRole] = useState<'officer' | 'field' | 'analyst'>('officer');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWatershedId, setSelectedWatershedId] = useState<string>('pimpalgaon');

  const currentWatershed = getWatershedDataset(selectedWatershedId);
  
  // Sub-tabs
  const [gisSubTab, setGisSubTab] = useState<'map' | 'table' | 'priority'>('map');
  const [reportsSubTab, setReportsSubTab] = useState<'swipe' | 'assessment' | 'dossier' | 'sources'>('swipe');

  // Modals
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isSoftwareAccessOpen, setIsSoftwareAccessOpen] = useState<boolean>(false);
  const [isCopilotDrawerOpen, setIsCopilotDrawerOpen] = useState<boolean>(false);

  const handleSelectFeature = (id: string) => {
    setSelectedFeatureId(id);
    setActiveTab('gis');
    setGisSubTab('map');
  };

  const handleNavigateTab = (tab: string) => {
    if (tab === 'dashboard' || tab === 'overview') {
      setActiveTab('overview');
    } else if (tab === 'explorer' || tab === 'gis') {
      setActiveTab('gis');
      setGisSubTab('map');
    } else if (tab === 'interventions' || tab === 'assets') {
      setActiveTab('gis');
      setGisSubTab('table');
    } else if (tab === 'priority') {
      setActiveTab('gis');
      setGisSubTab('priority');
    } else if (tab === 'research' || tab === 'evidence') {
      setActiveTab('research');
    } else if (tab === 'analysis' || tab === 'swipe') {
      setActiveTab('analysis');
    } else if (tab === 'impact' || tab === 'assessment') {
      setActiveTab('impact');
    } else if (tab === 'survey') {
      setActiveTab('survey');
    } else if (tab === 'rusle') {
      setActiveTab('rusle');
    } else if (tab === 'validation') {
      setActiveTab('validation');
    } else if (tab === 'reports' || tab === 'dossier' || tab === 'sources') {
      setActiveTab('reports');
    } else if (tab === 'copilot') {
      setActiveTab('copilot');
    } else {
      setActiveTab('overview');
    }
  };

  const mainRef = useRef<HTMLElement>(null);

  // Guarantee that when loading completes, the viewport is firmly anchored at the Header
  const handleLoadingComplete = () => {
    setIsLoading(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (mainRef.current) {
        mainRef.current.scrollTop = 0;
      }
      const headerEl = document.getElementById('watershed360-header');
      if (headerEl) {
        headerEl.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }, 40);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F15] text-[#F1F5F9] relative overflow-x-hidden">
      {/* High-Tech Geospatial Splash Loading Screen with Demo Video */}
      {isLoading && (
        <LoadingSplash onComplete={handleLoadingComplete} />
      )}

      {/* Top Fixed Header */}
      <Header 
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        isDemoMode={isDemoMode}
        onToggleDemo={() => setIsDemoMode(!isDemoMode)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenSoftwareAccess={() => setIsSoftwareAccessOpen(true)}
        onOpenCopilot={() => setActiveTab('copilot')}
        onOpenVideo={() => setShowReplayVideo(true)}
        onSelectFeature={handleSelectFeature}
        selectedWatershedId={selectedWatershedId}
        onSelectWatershed={setSelectedWatershedId}
      />

      {/* Main App Body with Sidebar + Dynamic Stage */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Rail (Desktop) */}
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleNavigateTab} 
        />

        {/* Dynamic Main Stage - ref anchored to top */}
        <main ref={mainRef} id="main-content-stage" className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pb-24 md:pb-20">
          <div className="max-w-[1700px] mx-auto">
            {/* 1. Overview Module */}
            {(activeTab === 'overview' || activeTab === 'dashboard') && (
              <OverviewModule 
                onOpenGis={() => {
                  setActiveTab('gis');
                  setGisSubTab('map');
                }}
                onNavigateTab={handleNavigateTab}
                onSelectFeature={handleSelectFeature}
                currentRole={currentRole}
                watershedId={selectedWatershedId}
              />
            )}

            {/* 2. Watershed GIS Module */}
            {(activeTab === 'gis' || activeTab === 'explorer' || activeTab === 'interventions' || activeTab === 'priority') && (
              <WatershedExplorer 
                initialSelectedId={selectedFeatureId}
                initialSubTab={gisSubTab}
                onSelectFeature={setSelectedFeatureId}
                watershedId={selectedWatershedId}
              />
            )}

            {/* 3. Research & Geo-Coded Image Analysis Module [FLAGSHIP] */}
            {(activeTab === 'research' || activeTab === 'evidence') && (
              <ResearchImageAnalysisModule 
                watershedId={selectedWatershedId}
                onNavigateTab={handleNavigateTab}
                onLocateOnMap={(lat, lng, assetId) => {
                  if (assetId) setSelectedFeatureId(assetId);
                  setActiveTab('gis');
                  setGisSubTab('map');
                }}
              />
            )}

            {/* 4. Bi-Temporal Change Analysis Module */}
            {activeTab === 'analysis' && (
              <BeforeAfterSwipe watershedId={selectedWatershedId} />
            )}

            {/* 5. Intervention Impact Assessment Module */}
            {activeTab === 'impact' && (
              <ImpactAssessmentModule 
                watershedId={selectedWatershedId}
                onSelectIntervention={handleSelectFeature}
              />
            )}

            {/* 6. Field Data Collection Survey */}
            {activeTab === 'survey' && (
              <FieldSurveyWorkspace 
                watershedId={selectedWatershedId}
              />
            )}

            {/* 7. Scientific RUSLE Modeling Studio */}
            {activeTab === 'rusle' && (
              <RusleModelStudio watershedId={selectedWatershedId} />
            )}

            {/* 8. Research Validation Workbench */}
            {activeTab === 'validation' && (
              <ResearchValidationWorkbench />
            )}

            {/* 9. Assessment Report Generator */}
            {activeTab === 'reports' && (
              <AssessmentReportGenerator 
                watershedId={selectedWatershedId}
              />
            )}

            {/* 10. AI Copilot Module */}
            {activeTab === 'copilot' && (
              <CopilotModule 
                onNavigateTab={handleNavigateTab}
                onSelectFeature={handleSelectFeature}
                watershedId={selectedWatershedId}
              />
            )}
          </div>
        </main>
      </div>

      {/* Demo Video Replay Modal */}
      {showReplayVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border-2 border-[#2DD4BF] shadow-2xl bg-black">
            <button
              onClick={() => setShowReplayVideo(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#0B0F15]/80 hover:bg-[#2DD4BF] hover:text-[#0B0F15] text-[#F1F5F9] transition-colors border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src="/demo-video.mp4"
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Native Mobile Bottom Navigation Bar (< md) */}
      <MobileNav 
        activeTab={activeTab}
        onTabChange={handleNavigateTab}
      />

      {/* Floating AI Copilot Trigger Button (Positioned above mobile bottom bar) */}
      <button
        onClick={() => setIsCopilotDrawerOpen(true)}
        className="fixed bottom-20 md:bottom-12 right-4 md:right-6 z-40 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#2DD4BF] via-[#06B6D4] to-[#38BDF8] text-[#0B0F15] font-mono font-bold text-xs shadow-2xl shadow-[#2DD4BF]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group border border-white/20"
      >
        <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0B0F15] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-[#0B0F15]"></span>
        </span>
        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin-slow" />
        <span className="text-[11px] sm:text-xs">Quick AI Copilot</span>
      </button>

      {/* Full-Stack Gemini AI Copilot Drawer */}
      <WatershedCopilot 
        isOpen={isCopilotDrawerOpen}
        onClose={() => setIsCopilotDrawerOpen(false)}
        onNavigateTab={handleNavigateTab}
        onSelectFeature={handleSelectFeature}
        watershedId={selectedWatershedId}
      />

      {/* Presentation Modals */}
      <GuidedTourModal 
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={handleNavigateTab}
      />

      <ExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        watershedId={selectedWatershedId}
      />

      <SoftwareAccessModal
        isOpen={isSoftwareAccessOpen}
        onClose={() => setIsSoftwareAccessOpen(false)}
        onLaunchLeafletMode={() => {
          setActiveTab('gis');
        }}
      />

      {/* Global Status Footer Strip (Desktop only - mobile uses clean bottom dock) */}
      <footer className="hidden md:flex h-8 bg-[#131A24]/95 backdrop-blur border-t border-[#233041] px-4 items-center justify-between text-[11px] font-mono text-[#94A3B8] select-none fixed bottom-0 left-0 right-0 z-40 shadow-lg">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#2DD4BF] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse"></span>
            WATERSHED360 GEOSPATIAL INTELLIGENCE PLATFORM
          </span>
          <span className="hidden sm:inline text-[#233041]">|</span>
          <span className="hidden sm:inline">PROJECTION: EPSG:4326 (WGS 84)</span>
          <span className="hidden md:inline text-[#233041]">|</span>
          <span className="hidden md:inline">CATCHMENT: {currentWatershed.stats.code} ({currentWatershed.stats.catchmentHa.toLocaleString()} Ha • {currentWatershed.stats.name})</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSoftwareAccessOpen(true)} 
            className="text-[#2DD4BF] hover:underline font-bold"
          >
            SOFTWARE ACCESS HUB
          </button>
          <span className="text-[#233041]">|</span>
          <span className="text-[#F59E0B] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
            CALIBRATED SAMPLE FIXTURE
          </span>
          <span className="text-[#233041]">|</span>
          <span className="text-[#F1F5F9]">PMKSY-WDC 2.0</span>
        </div>
      </footer>
    </div>
  );
}

