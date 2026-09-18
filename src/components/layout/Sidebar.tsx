'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Camera, 
  Sparkles,
  FileText,
  Radio,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const primaryNavItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: LayoutDashboard, 
      tag: 'PIPELINE', 
      desc: 'Executive briefing' 
    },
    { 
      id: 'gis', 
      label: 'Watershed GIS', 
      icon: Map, 
      tag: 'SPATIAL', 
      desc: 'Layers, assets & DEM' 
    },
    { 
      id: 'research', 
      label: 'Research & Vision', 
      icon: Camera, 
      tag: 'FLAGSHIP', 
      desc: 'Geotags & multimodal' 
    },
    { 
      id: 'analysis', 
      label: 'Change Analysis', 
      icon: Layers, 
      tag: 'SENTINEL-2', 
      desc: 'Bi-temporal swipe' 
    },
    { 
      id: 'impact', 
      label: 'Impact Evaluation', 
      icon: ShieldCheck, 
      tag: 'ATTRIBUTION', 
      desc: 'Intervention vs control' 
    },
    { 
      id: 'survey', 
      label: 'Field Survey', 
      icon: Radio, 
      tag: 'VALIDATION', 
      desc: 'Mobile audit form' 
    },
    { 
      id: 'rusle', 
      label: 'Scientific RUSLE', 
      icon: Layers, 
      tag: 'MODELING', 
      desc: 'Soil loss & MCDA' 
    },
    { 
      id: 'validation', 
      label: 'Validation Bench', 
      icon: ShieldCheck, 
      tag: 'ACCURACY', 
      desc: 'Confusion matrix & IoU' 
    },
    { 
      id: 'reports', 
      label: 'Assessment Reports', 
      icon: FileText, 
      tag: 'DOSSIER', 
      desc: 'Dossier & provenance' 
    },
    { 
      id: 'copilot', 
      label: 'AI Copilot', 
      icon: Sparkles, 
      tag: 'GEMINI', 
      desc: 'Grounded intelligence' 
    }
  ];

  return (
    <aside className="hidden md:flex w-64 bg-[#131A24]/95 backdrop-blur-xl border-r border-[#233041] flex-col justify-between select-none py-4 px-3 shrink-0 overflow-y-auto">
      {/* Navigation Menu */}
      <nav className="space-y-1">
        <div className="px-3 py-1 text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider flex items-center justify-between">
          <span>Analytical Modules</span>
          <span className="flex items-center gap-1 text-[9px] text-[#2DD4BF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
            10 ACTIVE
          </span>
        </div>

        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all duration-150 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#182230] to-[#1E2C3D] text-[#2DD4BF] font-bold border border-[#2DD4BF]/40 shadow-lg shadow-[#2DD4BF]/10'
                  : 'text-[#94A3B8] hover:bg-[#182230]/70 hover:text-[#F1F5F9]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  isActive 
                    ? 'bg-[#2DD4BF]/20 text-[#2DD4BF]' 
                    : 'bg-[#0B0F15] text-[#94A3B8] group-hover:text-[#F1F5F9]'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left truncate">
                  <div className={`font-semibold leading-tight truncate ${isActive ? 'text-[#F1F5F9]' : 'text-[#94A3B8] group-hover:text-[#F1F5F9]'}`}>
                    {item.label}
                  </div>
                  <div className="text-[9px] text-[#64748B] truncate">
                    {item.desc}
                  </div>
                </div>
              </div>
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ml-1 ${
                isActive 
                  ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/40' 
                  : 'bg-[#0B0F15] text-[#64748B]'
              }`}>
                {item.tag}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Grounding & Data Classification Pill */}
      <div className="pt-3 border-t border-[#233041] space-y-2">
        <div className="bg-[#0B0F15]/90 p-3 rounded-xl border border-[#233041] space-y-2 text-[11px] font-mono">
          <div className="flex items-center justify-between text-[10px] text-[#94A3B8] font-bold uppercase pb-1 border-b border-[#233041]">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-[#2DD4BF] animate-pulse" />
              Data Pipeline
            </span>
            <span className="text-[#10B981] font-mono">CALIBRATED</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">Satellite:</span>
            <span className="text-[#2DD4BF] font-semibold">Sentinel-2 (10m)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">Elevation DEM:</span>
            <span className="text-[#F1F5F9] font-medium">Copernicus 30m</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">Ground Truth:</span>
            <span className="text-[#F59E0B] font-semibold">Srishti-Drishti</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">AI Reasoning:</span>
            <span className="text-[#A855F7] font-semibold">Gemini 2.5 Flash</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

