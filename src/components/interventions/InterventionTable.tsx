'use client';

import React, { useState } from 'react';
import { demoInterventions } from '@/data/demoWatershedData';
import { 
  Layers, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Download,
  MapPin
} from 'lucide-react';

import { Intervention } from '@/types/watershed';

interface InterventionTableProps {
  onSelectFeature: (id: string) => void;
  interventions?: Intervention[];
}

export default function InterventionTable({ 
  onSelectFeature, 
  interventions = demoInterventions 
}: InterventionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = interventions.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCsv = () => {
    const headers = 'Code,Name,Type,StreamOrder,Latitude,Longitude,Status,SiltationPercent,CapacityTcm\n';
    const rows = filtered.map(i => `"${i.code}","${i.name}","${i.type}",${i.streamOrder},${i.latitude},${i.longitude},"${i.status}",${i.siltationPercent},${i.capacityTcm}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watershed-4E2B5c-09-assets.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
              SRISHTI-DRISHTI Sanctioned Civil Interventions & Asset Ledger
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono">
            Cross-referenced registry of sanctioned water harvesting structures, check dams, and contour trenches mapped against hydrological stream orders.
          </p>
        </div>

        {/* Filter & Export Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search code, name, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-[#0B0F15] border border-[#233041] rounded-xl text-xs font-mono text-[#F1F5F9] focus:border-[#2DD4BF] focus:outline-none transition-colors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#0B0F15] border border-[#233041] rounded-xl text-xs font-mono text-[#F1F5F9] outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses ({demoInterventions.length})</option>
            <option value="VERIFIED_ACTIVE">Verified Active</option>
            <option value="MAINTENANCE_REQUIRED">Maintenance Required</option>
            <option value="PROPOSED">Proposed</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#182230] hover:bg-[#1E2C3D] border border-[#233041] rounded-xl text-xs font-mono text-[#F1F5F9] transition-all"
            title="Download CSV Asset Table"
          >
            <Download className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Asset Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-[#233041]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B0F15]/80 text-[#94A3B8] border-b border-[#233041]">
              <tr>
                <th className="p-4">CODE</th>
                <th className="p-4">NAME & TYPE</th>
                <th className="p-4">STREAM HIERARCHY</th>
                <th className="p-4">GNSS FIX</th>
                <th className="p-4">HEALTH STATE</th>
                <th className="p-4">SILT VOLUME</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233041] text-[#F1F5F9]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#182230]/60 transition-colors">
                  <td className="p-4 font-bold text-[#2DD4BF]">{item.code}</td>
                  <td className="p-4">
                    <div className="font-sans font-bold text-[#F1F5F9] text-xs">{item.name}</div>
                    <div className="text-[11px] text-[#94A3B8]">{item.type} • Installed {item.constructionYear}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-[#0B0F15] border border-[#233041] text-[10px] font-bold text-[#38BDF8]">
                      Strahler Order {item.streamOrder}
                    </span>
                  </td>
                  <td className="p-4 text-[#94A3B8]">{item.latitude.toFixed(4)}°N, {item.longitude.toFixed(4)}°E</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                      item.status === 'VERIFIED_ACTIVE' ? 'bg-[#2DD4BF]/15 text-[#2DD4BF] border-[#2DD4BF]/30' :
                      item.status === 'MAINTENANCE_REQUIRED' ? 'bg-[#F43F5E]/15 text-[#F43F5E] border-[#F43F5E]/30' :
                      'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${item.siltationPercent > 40 ? 'text-[#F43F5E]' : 'text-[#94A3B8]'}`}>
                        {item.siltationPercent}%
                      </span>
                      <div className="w-12 h-1.5 rounded-full bg-[#182230] overflow-hidden">
                        <div 
                          className={`h-full ${item.siltationPercent > 40 ? 'bg-[#F43F5E]' : 'bg-[#2DD4BF]'}`}
                          style={{ width: `${item.siltationPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onSelectFeature(item.id)}
                      className="px-3 py-1.5 bg-[#0B0F15] hover:bg-[#2DD4BF] hover:text-[#0B0F15] border border-[#233041] rounded-xl text-[11px] text-[#2DD4BF] font-bold transition-all inline-flex items-center gap-1 shadow-sm active:scale-95"
                    >
                      <span>Locate in GIS</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
