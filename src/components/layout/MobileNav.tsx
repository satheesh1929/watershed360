'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Camera, 
  Sparkles, 
  FileText 
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'gis', label: 'GIS Map', icon: Map },
    { id: 'evidence', label: 'Evidence', icon: Camera },
    { id: 'copilot', label: 'AI Copilot', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F1622]/95 backdrop-blur-2xl border-t border-[#233041] px-1 py-1.5 flex md:hidden items-center justify-around shadow-2xl select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id || 
          (item.id === 'overview' && activeTab === 'dashboard') ||
          (item.id === 'gis' && (activeTab === 'explorer' || activeTab === 'interventions' || activeTab === 'priority')) ||
          (item.id === 'reports' && (activeTab === 'analysis' || activeTab === 'assessment'));

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 relative ${
              isActive 
                ? 'text-[#2DD4BF]' 
                : 'text-[#94A3B8] active:text-[#F1F5F9]'
            }`}
          >
            {/* Active pill indicator background */}
            {isActive && (
              <span className="absolute inset-x-2 inset-y-1 bg-[#2DD4BF]/10 rounded-xl border border-[#2DD4BF]/30 -z-10 animate-fadeIn" />
            )}

            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-[#2DD4BF]' : ''}`} />
              {isActive && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              )}
            </div>

            <span className={`text-[10px] font-mono mt-1 tracking-tight leading-none ${
              isActive ? 'font-bold text-[#F1F5F9]' : 'text-[#94A3B8]'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
