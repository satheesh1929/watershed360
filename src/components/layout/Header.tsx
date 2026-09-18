'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Sparkles,
  Compass,
  Award,
  ChevronDown,
  MapPin,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  Laptop,
  Terminal,
  Download,
  Menu,
  X,
  SlidersHorizontal,
  Play
} from 'lucide-react';
import { 
  demoInterventions, 
  demoPriorityZones,
  watershedRegistry,
  getWatershedDataset 
} from '@/data/demoWatershedData';

interface HeaderProps {
  currentRole: 'officer' | 'field' | 'analyst';
  onRoleChange: (role: 'officer' | 'field' | 'analyst') => void;
  isDemoMode: boolean;
  onToggleDemo: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenTour: () => void;
  onOpenReport: () => void;
  onOpenSoftwareAccess?: () => void;
  onOpenCopilot?: () => void;
  onOpenVideo?: () => void;
  onSelectFeature?: (id: string) => void;
  selectedWatershedId?: string;
  onSelectWatershed?: (id: string) => void;
}

export default function Header({
  currentRole,
  onRoleChange,
  isDemoMode,
  onToggleDemo,
  searchQuery,
  onSearchChange,
  onOpenTour,
  onOpenReport,
  onOpenSoftwareAccess,
  onOpenCopilot,
  onOpenVideo,
  onSelectFeature,
  selectedWatershedId = 'pimpalgaon',
  onSelectWatershed,
}: HeaderProps) {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showWatershedMenu, setShowWatershedMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const watershedMenuRef = useRef<HTMLDivElement>(null);

  const currentWatershed = getWatershedDataset(selectedWatershedId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (watershedMenuRef.current && !watershedMenuRef.current.contains(event.target as Node)) {
        setShowWatershedMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAssets = searchQuery.trim() ? currentWatershed.interventions.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.type.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const filteredZones = searchQuery.trim() ? currentWatershed.priorityZones.filter(z => 
    z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    z.riskLevel.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const hasSearchResults = filteredAssets.length > 0 || filteredZones.length > 0;

  return (
    <header id="watershed360-header" className="h-16 bg-[#131A24]/90 backdrop-blur-xl border-b border-[#233041] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 select-none shadow-lg shadow-black/20">
      {/* Brand & Catchment Identity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Official Emblem Logo */}
          <div className="relative w-10 h-10 rounded-xl bg-[#0B0F15] border border-[#2DD4BF]/50 flex items-center justify-center shadow-lg shadow-[#2DD4BF]/20 overflow-hidden shrink-0 group">
            <Image 
              src="/watershed360_logo.jpg" 
              alt="Watershed360 Official Logo"
              width={40}
              height={40}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-[#F1F5F9] via-[#E2E8F0] to-[#94A3B8] bg-clip-text text-transparent">
                WATERSHED<span className="text-[#2DD4BF]">360</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-[#2DD4BF] font-semibold">
                SIH26015
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#94A3B8] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse"></span>
              WDC-PMKSY 2.0 • TAWDEVA / AED Tamil Nadu
            </div>
          </div>
        </div>

        {/* Tamil Nadu Catchment Switcher Dropdown (Desktop/Tablet) */}
        <div ref={watershedMenuRef} className="relative hidden xl:block pl-4 border-l border-[#233041]">
          <button
            onClick={() => setShowWatershedMenu(!showWatershedMenu)}
            className="flex items-center gap-2.5 text-xs font-mono bg-[#0B0F15] hover:bg-[#182230] px-3 py-1.5 rounded-xl border border-[#233041] hover:border-[#2DD4BF]/50 transition-all text-left group"
          >
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse"></span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#2DD4BF] font-bold">{currentWatershed.stats.code}</span>
                <span className="text-[#F1F5F9] font-medium">• {currentWatershed.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform ${showWatershedMenu ? 'rotate-180 text-[#2DD4BF]' : ''}`} />
              </div>
              <div className="text-[10px] text-[#94A3B8]">
                {currentWatershed.stats.district} • {currentWatershed.stats.catchmentHa.toLocaleString()} Ha
              </div>
            </div>
          </button>

          {showWatershedMenu && (
            <div className="absolute top-full left-4 mt-2 w-84 bg-[#131A24] border border-[#233041] rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
              <div className="text-[10px] uppercase font-mono font-bold text-[#94A3B8] px-3 py-1.5 border-b border-[#233041] flex items-center justify-between">
                <span>Select Tamil Nadu Watershed</span>
                <span className="text-[#2DD4BF]">4 River Basins</span>
              </div>
              <div className="space-y-1 mt-1">
                {watershedRegistry.map(w => {
                  const ws = getWatershedDataset(w.id);
                  const isSelected = selectedWatershedId === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => {
                        if (onSelectWatershed) onSelectWatershed(w.id);
                        setShowWatershedMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between font-mono text-xs ${
                        isSelected 
                          ? 'bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 text-[#F1F5F9]' 
                          : 'hover:bg-[#182230] text-[#94A3B8] hover:text-[#F1F5F9]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-[#F1F5F9]">
                          <span className={isSelected ? 'text-[#2DD4BF]' : 'text-[#64748B]'}>{ws.stats.code}</span>
                          <span>{ws.name}</span>
                        </div>
                        <div className="text-[10px] text-[#94A3B8] mt-0.5">
                          {ws.stats.district} ({ws.stats.catchmentHa.toLocaleString()} Ha)
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#2DD4BF] mt-1.5"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Interactive Search Bar */}
      <div ref={searchRef} className="flex-1 max-w-md mx-4 hidden md:block relative">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setShowSearchDropdown(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSearchDropdown(true);
            }}
            placeholder="Quick search assets (e.g., CD-04, Check Dam, Zone A)..."
            className="w-full bg-[#0B0F15]/90 border border-[#233041] rounded-xl px-9 py-2 text-xs font-mono text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF]/40 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-[10px] font-mono text-[#94A3B8] hover:text-[#F1F5F9] absolute right-3 top-1/2 -translate-y-1/2 bg-[#182230] px-1.5 py-0.5 rounded border border-[#233041]"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Search Autocomplete Dropdown */}
        {showSearchDropdown && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#131A24] border border-[#233041] rounded-xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto space-y-2 font-mono text-xs">
            {hasSearchResults ? (
              <>
                {filteredAssets.length > 0 && (
                  <div>
                    <div className="text-[10px] text-[#2DD4BF] uppercase font-bold px-2 py-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Civil Structures ({filteredAssets.length})
                    </div>
                    {filteredAssets.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (onSelectFeature) onSelectFeature(item.id);
                          setShowSearchDropdown(false);
                        }}
                        className="px-2.5 py-2 rounded-lg hover:bg-[#1E2C3D] cursor-pointer flex items-center justify-between text-[#F1F5F9] transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-xs text-[#2DD4BF]">{item.code} • {item.name}</div>
                          <div className="text-[10px] text-[#94A3B8]">{item.type} • Order {item.streamOrder}</div>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          item.status === 'VERIFIED_ACTIVE' ? 'bg-[#2DD4BF]/15 text-[#2DD4BF]' : 'bg-[#F43F5E]/15 text-[#F43F5E]'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {filteredZones.length > 0 && (
                  <div className="pt-2 border-t border-[#233041]">
                    <div className="text-[10px] text-[#F59E0B] uppercase font-bold px-2 py-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Priority Zones ({filteredZones.length})
                    </div>
                    {filteredZones.map(zone => (
                      <div
                        key={zone.id}
                        onClick={() => {
                          if (onSelectFeature) onSelectFeature(zone.id);
                          setShowSearchDropdown(false);
                        }}
                        className="px-2.5 py-2 rounded-lg hover:bg-[#1E2C3D] cursor-pointer flex items-center justify-between text-[#F1F5F9] transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-xs">{zone.name}</div>
                          <div className="text-[10px] text-[#94A3B8]">{zone.areaHa} Ha • Score: {zone.compositeScore}/100</div>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[#F59E0B]/15 text-[#F59E0B]">
                          {zone.riskLevel}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 text-center text-[#94A3B8] text-xs">
                No matching structures or zones found for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Action Tools: Desktop Tools + Mobile Drawer Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="md:hidden p-2 rounded-xl bg-[#182230] border border-[#233041] text-[#94A3B8] active:text-[#2DD4BF]"
          title="Search Assets"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* AI Copilot Button (Hidden on very small mobile, accessible via bottom nav) */}
        {onOpenCopilot && (
          <button
            onClick={onOpenCopilot}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#2DD4BF]/15 hover:bg-[#2DD4BF]/25 border border-[#2DD4BF]/50 text-[#2DD4BF] text-xs font-mono font-bold transition-all shadow-md shadow-[#2DD4BF]/15 hover:scale-105 active:scale-95"
            title="Ask WATERSHED360 AI Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF] animate-spin-slow" />
            <span className="hidden lg:inline">AI Copilot</span>
          </button>
        )}

        {/* Demo Video Replay Button */}
        {onOpenVideo && (
          <button
            onClick={onOpenVideo}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182230] hover:bg-[#233041] border border-[#233041] text-[#2DD4BF] text-xs font-mono font-bold transition-all shadow-sm"
            title="Watch Cinematic Field Demo Video"
          >
            <Play className="w-3.5 h-3.5 fill-[#2DD4BF]" />
            <span>Demo Video</span>
          </button>
        )}

        {/* Judges' Guided Tour Button (Desktop) */}
        <button
          onClick={onOpenTour}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#2DD4BF]/20 to-[#06B6D4]/20 hover:from-[#2DD4BF]/30 hover:to-[#06B6D4]/30 border border-[#2DD4BF]/40 text-[#2DD4BF] text-xs font-mono font-bold transition-all shadow-sm shadow-[#2DD4BF]/20"
          title="Start Judges' Showcase Walkthrough"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Judges' Tour</span>
        </button>

        {/* Executive Dossier Report Modal Trigger (Desktop) */}
        <button
          onClick={onOpenReport}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182230] hover:bg-[#1E2C3D] border border-[#233041] text-[#F1F5F9] text-xs font-mono font-medium transition-colors"
          title="Open Executive Dossier & Printable Brief"
        >
          <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Dossier</span>
        </button>

        {/* Role Switcher (Desktop) */}
        <div className="hidden xl:flex items-center bg-[#0B0F15] p-1 rounded-xl border border-[#233041] text-xs font-mono">
          <button
            onClick={() => onRoleChange('officer')}
            className={`px-2 py-1 rounded-lg transition-all ${
              currentRole === 'officer' 
                ? 'bg-[#182230] text-[#2DD4BF] font-bold shadow-sm' 
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            Officer
          </button>
          <button
            onClick={() => onRoleChange('field')}
            className={`px-2 py-1 rounded-lg transition-all ${
              currentRole === 'field' 
                ? 'bg-[#182230] text-[#2DD4BF] font-bold shadow-sm' 
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            Field
          </button>
          <button
            onClick={() => onRoleChange('analyst')}
            className={`px-2 py-1 rounded-lg transition-all ${
              currentRole === 'analyst' 
                ? 'bg-[#182230] text-[#2DD4BF] font-bold shadow-sm' 
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            Analyst
          </button>
        </div>

        {/* Demo Mode Indicator & Adapter Toggle (Desktop) */}
        <button
          onClick={onToggleDemo}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            isDemoMode 
              ? 'bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#F59E0B]' 
              : 'bg-[#2DD4BF]/10 border-[#2DD4BF]/40 text-[#2DD4BF]'
          }`}
          title="Telemetry Ingestion Mode: Calibrated Sample Fixture"
        >
          <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-[#F59E0B] animate-pulse' : 'bg-[#2DD4BF]'}`} />
          <span className="font-bold">{isDemoMode ? 'Fixture' : 'Ready'}</span>
        </button>

        {/* Mobile Quick Drawer Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-[#182230] border border-[#233041] text-[#2DD4BF] active:scale-95 transition-all"
          title="Open Quick Tools Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Search Bar Dropdown Overlay */}
      {isMobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#0B0F15]/95 border-b border-[#233041] p-3 z-50 md:hidden animate-fadeIn">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              autoFocus
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search assets (e.g., CD-04, Check Dam)..."
              className="w-full bg-[#131A24] border border-[#233041] rounded-xl px-9 py-2.5 text-xs font-mono text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#2DD4BF]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-[10px] font-mono text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 bg-[#182230] px-1.5 py-0.5 rounded"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Mobile Search Results */}
          {hasSearchResults && searchQuery.trim() && (
            <div className="mt-2 bg-[#131A24] border border-[#233041] rounded-xl p-2 max-h-60 overflow-y-auto space-y-2 text-xs font-mono">
              {filteredAssets.length > 0 && (
                <div>
                  <div className="text-[10px] text-[#2DD4BF] uppercase font-bold px-2 py-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Civil Structures ({filteredAssets.length})
                  </div>
                  {filteredAssets.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (onSelectFeature) onSelectFeature(item.id);
                        setIsMobileSearchOpen(false);
                      }}
                      className="p-2 rounded-lg hover:bg-[#1E2C3D] flex items-center justify-between text-[#F1F5F9]"
                    >
                      <div>
                        <div className="font-semibold text-[#2DD4BF]">{item.code} • {item.name}</div>
                        <div className="text-[10px] text-[#94A3B8]">{item.type}</div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#2DD4BF]/20 text-[#2DD4BF]">
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {filteredZones.length > 0 && (
                <div className="pt-2 border-t border-[#233041]">
                  <div className="text-[10px] text-[#F59E0B] uppercase font-bold px-2 py-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Priority Zones ({filteredZones.length})
                  </div>
                  {filteredZones.map(zone => (
                    <div
                      key={zone.id}
                      onClick={() => {
                        if (onSelectFeature) onSelectFeature(zone.id);
                        setIsMobileSearchOpen(false);
                      }}
                      className="p-2 rounded-lg hover:bg-[#1E2C3D] flex items-center justify-between text-[#F1F5F9]"
                    >
                      <div>
                        <div className="font-semibold text-xs">{zone.name}</div>
                        <div className="text-[10px] text-[#94A3B8]">{zone.areaHa} Ha • Score: {zone.compositeScore}/100</div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[#F59E0B]/15 text-[#F59E0B]">
                        {zone.riskLevel}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Quick Tools Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-black/70 backdrop-blur-md md:hidden animate-fadeIn flex flex-col justify-end">
          <div className="bg-[#131A24] border-t border-[#233041] rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            {/* Header / Catchment */}
            <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
              <div>
                <div className="text-xs font-mono font-bold text-[#2DD4BF]">{currentWatershed.stats.code} • {currentWatershed.name}</div>
                <div className="text-[10px] text-[#94A3B8] font-mono">{currentWatershed.stats.district} • {currentWatershed.stats.catchmentHa.toLocaleString()} Ha</div>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg bg-[#0B0F15] text-[#94A3B8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tamil Nadu Basin Selector (Mobile) */}
            <div>
              <div className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-2">Tamil Nadu River Basin</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {watershedRegistry.map(w => {
                  const ws = getWatershedDataset(w.id);
                  const isSelected = selectedWatershedId === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => {
                        if (onSelectWatershed) onSelectWatershed(w.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected 
                          ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] text-[#2DD4BF] font-bold' 
                          : 'bg-[#0B0F15] border-[#233041] text-[#94A3B8]'
                      }`}
                    >
                      <div className="font-bold truncate">{ws.stats.code}</div>
                      <div className="text-[10px] text-[#94A3B8] truncate">{ws.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Switcher */}
            <div>
              <div className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-2">Active Persona</div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  onClick={() => { onRoleChange('officer'); setIsMobileMenuOpen(false); }}
                  className={`py-2 rounded-xl text-center border transition-all ${
                    currentRole === 'officer' ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] text-[#2DD4BF] font-bold' : 'bg-[#0B0F15] border-[#233041] text-[#94A3B8]'
                  }`}
                >
                  Officer
                </button>
                <button
                  onClick={() => { onRoleChange('field'); setIsMobileMenuOpen(false); }}
                  className={`py-2 rounded-xl text-center border transition-all ${
                    currentRole === 'field' ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] text-[#2DD4BF] font-bold' : 'bg-[#0B0F15] border-[#233041] text-[#94A3B8]'
                  }`}
                >
                  Field Eng
                </button>
                <button
                  onClick={() => { onRoleChange('analyst'); setIsMobileMenuOpen(false); }}
                  className={`py-2 rounded-xl text-center border transition-all ${
                    currentRole === 'analyst' ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] text-[#2DD4BF] font-bold' : 'bg-[#0B0F15] border-[#233041] text-[#94A3B8]'
                  }`}
                >
                  Analyst
                </button>
              </div>
            </div>

            {/* Mobile Actions Grid */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                onClick={() => { onOpenTour(); setIsMobileMenuOpen(false); }}
                className="p-3 rounded-xl bg-gradient-to-r from-[#2DD4BF]/20 to-[#06B6D4]/20 border border-[#2DD4BF]/40 text-[#2DD4BF] font-bold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Judges' Tour</span>
              </button>

              <button
                onClick={() => { onOpenReport(); setIsMobileMenuOpen(false); }}
                className="p-3 rounded-xl bg-[#182230] border border-[#233041] text-[#F1F5F9] font-medium flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-[#F59E0B]" />
                <span>Impact Dossier</span>
              </button>
            </div>

            {onOpenSoftwareAccess && (
              <button
                onClick={() => { onOpenSoftwareAccess(); setIsMobileMenuOpen(false); }}
                className="w-full p-3 rounded-xl bg-[#182230] border border-[#233041] text-[#2DD4BF] font-mono text-xs flex items-center justify-center gap-2 font-bold"
              >
                <Laptop className="w-4 h-4" />
                <span>Software Access Hub (QGIS/GeoPandas)</span>
              </button>
            )}

            {/* Status Footer */}
            <div className="pt-2 border-t border-[#233041] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                Calibrated Fixture
              </span>
              <span>PMKSY-WDC 2.0</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

