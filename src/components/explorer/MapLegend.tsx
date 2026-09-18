'use client';

import React from 'react';

export default function MapLegend() {
  return (
    <div className="absolute bottom-6 right-6 z-20 bg-[#131A24]/95 backdrop-blur-xl border border-[#233041] rounded-2xl p-3.5 max-w-xs text-xs font-mono select-none shadow-2xl">
      <div className="font-bold text-[#F1F5F9] mb-2 text-[11px] border-b border-[#233041] pb-1.5 flex items-center justify-between">
        <span>CARTOGRAPHY LEGEND</span>
        <span className="text-[9px] text-[#2DD4BF] font-mono font-bold">STRAHLER</span>
      </div>

      {/* Stream Orders */}
      <div className="space-y-1.5 mb-2.5">
        <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Drainage Hierarchy</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#0284C7]/60"></span>
            <span className="text-[#94A3B8]">Order 1 (Rill)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#0284C7]"></span>
            <span className="text-[#94A3B8]">Order 2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 bg-[#38BDF8]"></span>
            <span className="text-[#94A3B8]">Order 3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-[#38BDF8] shadow-sm shadow-[#38BDF8]"></span>
            <span className="text-[#F1F5F9] font-bold">Order 4 (Main)</span>
          </div>
        </div>
      </div>

      {/* Interventions */}
      <div className="space-y-1.5 pt-2 border-t border-[#233041]">
        <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Intervention Health</div>
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] shadow-sm shadow-[#2DD4BF]"></span>
            <span className="text-[#94A3B8]">Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
            <span className="text-[#94A3B8]">Proposed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]"></span>
            <span className="text-[#94A3B8]">Silt / Repair</span>
          </div>
        </div>
      </div>
    </div>
  );
}
