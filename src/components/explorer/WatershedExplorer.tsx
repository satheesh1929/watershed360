'use client';

import React, { useState, useEffect } from 'react';
import WatershedMap from './WatershedMap';
import LayerControl from './LayerControl';
import MapLegend from './MapLegend';
import TimeSlider from './TimeSlider';
import FeatureInspector from './FeatureInspector';
import InterventionTable from '@/components/interventions/InterventionTable';
import PriorityIntelligence from '@/components/priority/PriorityIntelligence';
import { LayerState, Intervention } from '@/types/watershed';
import { demoInterventions, demoPriorityZones, getWatershedDataset } from '@/data/demoWatershedData';
import { 
  Layers, 
  X, 
  Map, 
  Table, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Sliders,
  Sparkles
} from 'lucide-react';

interface WatershedExplorerProps {
  initialSelectedId?: string | null;
  initialSubTab?: 'map' | 'table' | 'priority';
  onSelectFeature?: (id: string | null) => void;
  watershedId?: string;
}

export default function WatershedExplorer({ 
  initialSelectedId, 
  initialSubTab = 'map',
  onSelectFeature,
  watershedId = 'bhavani'
}: WatershedExplorerProps) {
  const dataset = getWatershedDataset(watershedId);
  const [viewMode, setViewMode] = useState<'map' | 'table' | 'priority'>(initialSubTab);
  const [interventions, setInterventions] = useState<Intervention[]>(dataset.interventions);
  const [verificationToast, setVerificationToast] = useState<string | null>(null);

  useEffect(() => {
    setInterventions(dataset.interventions);
  }, [watershedId]);

  const [layers, setLayers] = useState<LayerState>({
    boundary: true,
    drainageNetwork: true,
    interventions: true,
    vegetationHealth: true,
    waterBodies: true,
    elevationContours: true,
    priorityZones: true,
    fieldPhotos: true,
    baseMap: 'dark',
  });

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedInterventionId, setSelectedInterventionId] = useState<string | null>(initialSelectedId || null);
  const [isMobileLayerDrawerOpen, setIsMobileLayerDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialSelectedId !== undefined) {
      setSelectedInterventionId(initialSelectedId);
      if (initialSelectedId) {
        setViewMode('map');
      }
    }
  }, [initialSelectedId]);

  useEffect(() => {
    if (initialSubTab) {
      setViewMode(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSelectFeature = (id: string | null) => {
    setSelectedInterventionId(id);
    if (onSelectFeature) {
      onSelectFeature(id);
    }
  };

  const handleVerifyIntervention = (status: 'VERIFIED_ACTIVE' | 'MAINTENANCE_REQUIRED') => {
    if (!selectedInterventionId) return;
    setInterventions(prev => 
      prev.map(item => 
        item.id === selectedInterventionId ? { ...item, status } : item
      )
    );
    const item = interventions.find(i => i.id === selectedInterventionId);
    const label = item ? item.code : selectedInterventionId;
    setVerificationToast(`Asset ${label} status updated to ${status}. Verification logged in WDC-PMKSY ledger.`);
    setTimeout(() => {
      setVerificationToast(null);
    }, 4500);
  };

  const selectedIntervention = interventions.find((i) => i.id === selectedInterventionId);
  const selectedZone = dataset.priorityZones.find((z) => z.id === selectedInterventionId);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Sub-Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131A24] border border-[#233041] rounded-2xl p-2.5 sm:px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
              viewMode === 'map'
                ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] shadow-lg shadow-[#2DD4BF]/20'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#182230]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Spatial Map (GIS)</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
              viewMode === 'table'
                ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] shadow-lg shadow-[#2DD4BF]/20'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#182230]'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Asset Ledger ({interventions.length})</span>
          </button>

          <button
            onClick={() => setViewMode('priority')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
              viewMode === 'priority'
                ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] shadow-lg shadow-[#2DD4BF]/20'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#182230]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Priority MCDA Studio</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>Catchment: {dataset.stats.code} ({dataset.stats.catchmentHa.toLocaleString()} Ha • {dataset.stats.name})</span>
        </div>
      </div>

      {/* Verification Toast Banner */}
      {verificationToast && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] px-4 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>{verificationToast}</span>
          </div>
          <button 
            onClick={() => setVerificationToast(null)}
            className="text-[#10B981] hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* View Mode 1: Table View */}
      {viewMode === 'table' && (
        <InterventionTable 
          interventions={interventions}
          onSelectFeature={(id) => {
            handleSelectFeature(id);
            setViewMode('map');
          }}
        />
      )}

      {/* View Mode 2: Priority MCDA View */}
      {viewMode === 'priority' && (
        <PriorityIntelligence 
          priorityZones={dataset.priorityZones}
          onSelectZone={(id) => {
            handleSelectFeature(id);
            setViewMode('map');
          }}
        />
      )}

      {/* View Mode 3: Interactive Spatial GIS Map View */}
      {viewMode === 'map' && (
        <div className="relative w-full h-[calc(100vh-190px)] sm:h-[calc(100vh-180px)] rounded-2xl overflow-hidden border border-[#233041] bg-[#0B0F15] flex shadow-2xl animate-fadeIn">
          {/* Desktop Layer Control Panel */}
          <div className="hidden md:block h-full shrink-0">
            <LayerControl 
              layers={layers} 
              onToggleLayer={(k) => setLayers(prev => ({ ...prev, [k]: !prev[k] }))} 
              onBaseMapChange={(m) => setLayers(prev => ({ ...prev, baseMap: m }))} 
            />
          </div>

          {/* Main Map Viewport */}
          <div className="relative flex-1 h-full overflow-hidden">
            {/* Mobile Floating Layer Stack Trigger */}
            <button
              onClick={() => setIsMobileLayerDrawerOpen(true)}
              className="md:hidden absolute top-3 left-3 z-20 px-3 py-2 rounded-xl bg-[#131A24]/95 border border-[#2DD4BF]/50 text-[#2DD4BF] text-xs font-mono font-bold flex items-center gap-1.5 shadow-xl backdrop-blur-md active:scale-95 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Layers</span>
            </button>

            <WatershedMap 
              layers={layers}
              selectedYear={selectedYear}
              selectedFeatureId={selectedInterventionId}
              interventions={interventions}
              streams={dataset.streams}
              priorityZones={dataset.priorityZones}
              evidence={dataset.evidence}
              bounds={dataset.bounds}
              catchmentCode={dataset.stats.code}
              onSelectFeature={handleSelectFeature}
            />

            {/* Floating Time Slider Docked on Bottom */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 sm:w-[380px]">
              <TimeSlider selectedYear={selectedYear} onYearChange={setSelectedYear} />
            </div>

            {/* Legend Docked on Right (Desktop/Tablet) */}
            <div className="hidden sm:block absolute bottom-4 right-4 z-20">
              <MapLegend />
            </div>
          </div>

          {/* Mobile Layer Control Bottom Sheet Drawer */}
          {isMobileLayerDrawerOpen && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden flex flex-col justify-end animate-fadeIn">
              <div className="bg-[#131A24] border-t border-[#233041] rounded-t-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-[#233041] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#2DD4BF]" />
                    <span className="text-sm font-bold text-[#F1F5F9] font-sans">GIS Layer Stack</span>
                  </div>
                  <button 
                    onClick={() => setIsMobileLayerDrawerOpen(false)}
                    className="p-1 rounded-lg bg-[#0B0F15] text-[#94A3B8]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <LayerControl 
                    layers={layers} 
                    onToggleLayer={(k) => setLayers(prev => ({ ...prev, [k]: !prev[k] }))} 
                    onBaseMapChange={(m) => setLayers(prev => ({ ...prev, baseMap: m }))} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Intervention Feature Inspector Drawer */}
          {selectedIntervention && (
            <FeatureInspector 
              feature={selectedIntervention}
              onClose={() => handleSelectFeature(null)}
              onVerify={handleVerifyIntervention}
            />
          )}

          {/* Priority Zone Inspector Drawer */}
          {selectedZone && !selectedIntervention && (
            <div className="fixed inset-x-0 bottom-0 max-h-[85vh] md:max-h-full rounded-t-3xl md:rounded-none md:relative md:inset-auto md:w-96 bg-[#131A24]/95 backdrop-blur-xl border-t md:border-t-0 md:border-l border-[#233041] flex flex-col justify-between p-4 sm:p-5 overflow-y-auto z-50 md:z-30 select-none shadow-2xl animate-fadeIn">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-[#233041]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#F43F5E] bg-[#F43F5E]/10 px-2.5 py-0.5 rounded-lg border border-[#F43F5E]/30">
                        {selectedZone.id.toUpperCase()}
                      </span>
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                        selectedZone.riskLevel === 'CRITICAL' ? 'bg-[#F43F5E]/20 text-[#F43F5E]' :
                        selectedZone.riskLevel === 'HIGH' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                        'bg-[#38BDF8]/20 text-[#38BDF8]'
                      }`}>
                        {selectedZone.riskLevel} VULNERABILITY
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#F1F5F9] font-sans mt-2 leading-snug">
                      {selectedZone.name}
                    </h3>
                    <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
                      Sub-Catchment Area: {selectedZone.areaHa} Ha
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSelectFeature(null)}
                    className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] rounded-lg hover:bg-[#1E2C3D] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Composite Vulnerability Metric */}
                <div className="p-3.5 rounded-xl bg-[#0B0F15] border border-[#233041] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">MCDA Vulnerability Score:</span>
                    <span className="text-lg font-bold text-[#F43F5E]">{selectedZone.compositeScore}/100</span>
                  </div>
                  <div className="w-full bg-[#182230] h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedZone.compositeScore >= 75 ? 'bg-gradient-to-r from-[#F59E0B] to-[#F43F5E]' :
                        selectedZone.compositeScore >= 50 ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                      }`}
                      style={{ width: `${selectedZone.compositeScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#64748B] font-mono">
                    Multi-criteria evaluation of DEM slope gradient, vegetation deficit, and drainage proximity.
                  </p>
                </div>

                {/* Risk Reasons */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-[#F1F5F9] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" /> Contributing Risk Factors:
                  </span>
                  <div className="space-y-1.5">
                    {selectedZone.reasons.map((reason, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#0B0F15] border border-[#233041] text-[11px] font-mono text-[#94A3B8] leading-relaxed flex items-start gap-2">
                        <span className="text-[#F59E0B] font-bold mt-0.5">•</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Action */}
                <div className="p-3.5 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-[#2DD4BF] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" /> Recommended Engineering Action:
                  </span>
                  <p className="text-xs font-mono text-[#F1F5F9] leading-relaxed">
                    {selectedZone.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#233041] space-y-2 mt-4">
                <button
                  onClick={() => setViewMode('priority')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-mono font-bold text-xs hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-[#2DD4BF]/20 transition-all active:scale-95"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Open in MCDA Studio</span>
                </button>
                <button
                  onClick={() => handleSelectFeature(null)}
                  className="w-full py-2 rounded-xl bg-[#182230] hover:bg-[#1E2C3D] text-[#94A3B8] text-xs font-mono transition-colors"
                >
                  Dismiss Inspector
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
