'use client';

import React from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Award,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { getWatershedDataset, demoOutcomeAssessments } from '@/data/demoWatershedData';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  watershedId?: string;
}

export default function ExecutiveReportModal({ isOpen, onClose, watershedId = 'bhavani' }: ExecutiveReportModalProps) {
  if (!isOpen) return null;

  const dataset = getWatershedDataset(watershedId);
  const watershedStats = dataset.stats;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#131A24] border border-[#2DD4BF]/40 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-[#2DD4BF]/10 flex flex-col">
        {/* Modal Toolbar Header */}
        <div className="p-4 border-b border-[#233041] flex items-center justify-between sticky top-0 bg-[#131A24]/95 backdrop-blur z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">
                Executive Catchment Impact Dossier
              </h3>
              <p className="text-[11px] font-mono text-[#94A3B8]">
                Official Evaluation Briefing • SIH26015 Compliant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E2C3D] hover:bg-[#2A3B4E] border border-[#233041] text-xs font-mono text-[#F1F5F9] transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#2DD4BF]" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] rounded-lg hover:bg-[#1E2C3D] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 md:p-8 space-y-6 text-[#F1F5F9] bg-[#0B0F15]/60">
          {/* Document Header Banner */}
          <div className="border border-[#233041] rounded-xl p-6 bg-gradient-to-r from-[#131A24] to-[#182230] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2DD4BF]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#2DD4BF] text-[10px] font-mono font-bold tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" /> OFFICIAL JURY PRESENTATION BRIEF
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9]">
                  Watershed360: Geospatial Impact & Verification Engine
                </h1>
                <p className="text-xs text-[#94A3B8] mt-1 font-mono">
                  Micro-Catchment ID: <span className="text-[#2DD4BF] font-semibold">{watershedStats.code}</span> ({watershedStats.name}) • {watershedStats.district}
                </p>
              </div>

              <div className="text-right flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-[#233041] pt-3 md:pt-0">
                <div className="text-xs font-mono text-[#94A3B8]">Composite Health Index</div>
                <div className="text-3xl font-bold font-mono text-[#2DD4BF]">92<span className="text-sm font-normal text-[#94A3B8]">/100</span></div>
                <div className="text-[10px] font-mono text-[#10B981] font-semibold">GRADE A (EXCELLENT RECOVERY)</div>
              </div>
            </div>
          </div>

          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3.5 rounded-lg bg-[#131A24] border border-[#233041]">
              <div className="text-[10px] text-[#94A3B8] uppercase">Catchment Area</div>
              <div className="text-lg font-bold text-[#F1F5F9]">{watershedStats.catchmentHa} Ha</div>
              <div className="text-[10px] text-[#2DD4BF]">EPSG:4326 Surveyed</div>
            </div>
            <div className="p-3.5 rounded-lg bg-[#131A24] border border-[#233041]">
              <div className="text-[10px] text-[#94A3B8] uppercase">Biomass Accretion</div>
              <div className="text-lg font-bold text-[#10B981]">{watershedStats.meanNdviDelta} ΔNDVI</div>
              <div className="text-[10px] text-[#10B981]">+54.8% vs Baseline</div>
            </div>
            <div className="p-3.5 rounded-lg bg-[#131A24] border border-[#233041]">
              <div className="text-[10px] text-[#94A3B8] uppercase">Surface Water Spread</div>
              <div className="text-lg font-bold text-[#38BDF8]">{watershedStats.waterSpreadHa} Ha</div>
              <div className="text-[10px] text-[#38BDF8]">+{watershedStats.waterSpreadDeltaPercent}% Retention</div>
            </div>
            <div className="p-3.5 rounded-lg bg-[#131A24] border border-[#233041]">
              <div className="text-[10px] text-[#94A3B8] uppercase">Soil Loss Abatement</div>
              <div className="text-lg font-bold text-[#F59E0B]">-{watershedStats.soilErosionAbatementPct}%</div>
              <div className="text-[10px] text-[#94A3B8]">RUSLE Quantified</div>
            </div>
          </div>

          {/* Executive Summary Narrative */}
          <div className="bg-[#131A24] border border-[#233041] rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#2DD4BF] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 1. Scientific Verification Summary
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Watershed360 combines multi-temporal Sentinel-2 Level-2A BOA reflectance (10m VNIR bands), Copernicus 30m Global DEM topographic modeling, and geotagged ground-truth EXIF mobile telemetry to provide an end-to-end evidence framework for watershed treatment validation under PMKSY-WDC guidelines.
            </p>
          </div>

          {/* Quantified Outcomes Table */}
          <div className="bg-[#131A24] border border-[#233041] rounded-xl overflow-hidden">
            <div className="p-3.5 bg-[#182230] border-b border-[#233041] flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#F1F5F9]">2. Quantified Indicator Scorecard</span>
              <span className="text-[10px] font-mono text-[#2DD4BF]">5 OF 5 VALIDATED</span>
            </div>
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[10px] text-[#94A3B8] bg-[#0B0F15]/40 border-b border-[#233041]">
                <tr>
                  <th className="p-3">METRIC / INDICATOR</th>
                  <th className="p-3">BASELINE (2021)</th>
                  <th className="p-3">CURRENT (2026)</th>
                  <th className="p-3">NET IMPACT</th>
                  <th className="p-3">CONFIDENCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#233041]">
                {demoOutcomeAssessments.map((oa) => (
                  <tr key={oa.id} className="hover:bg-[#1E2C3D]/50">
                    <td className="p-3 font-medium text-[#F1F5F9] font-sans">
                      {oa.metricName}
                      <div className="text-[10px] font-mono text-[#94A3B8]">{oa.category}</div>
                    </td>
                    <td className="p-3 text-[#94A3B8]">{oa.baselineValue}</td>
                    <td className="p-3 text-[#2DD4BF] font-semibold">{oa.currentValue}</td>
                    <td className="p-3 text-[#10B981] font-bold">{oa.netDelta}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-[#2DD4BF]/10 text-[#2DD4BF] text-[10px] font-bold border border-[#2DD4BF]/30">
                        {oa.confidencePercent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actionable Recommendations for Jury */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#131A24] border border-[#233041] rounded-xl p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-[#F59E0B] flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" /> Critical Field Triage Item
              </div>
              <p className="text-xs text-[#94A3B8]">
                Check Dam <span className="text-[#F1F5F9] font-semibold">CD-04 (Mandave South)</span> exhibits 54% siltation volume. Automated recommendation dispatched for mechanical desilting and upstream gabion stabilization.
              </p>
            </div>

            <div className="bg-[#131A24] border border-[#233041] rounded-xl p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-[#2DD4BF] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Proposed High-Yield Site
              </div>
              <p className="text-xs text-[#94A3B8]">
                Strahler 4th-order confluence at Outfall <span className="text-[#F1F5F9] font-semibold">CD-05</span> geo-validated. Estimated +9.0 TCM storage yield potential with 94% hydraulic convergence score.
              </p>
            </div>
          </div>

          {/* Digital Signature & Certification Stamp */}
          <div className="pt-4 border-t border-[#233041] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#94A3B8] gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse"></span>
              <span>AUDIT HASH (DEMO): a9f8e4b7c12d...938e</span>
            </div>
            <div>
              COMPLIANT: MoRD / WDC-PMKSY 2.0 / ISRO BHUVAN SPEC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
