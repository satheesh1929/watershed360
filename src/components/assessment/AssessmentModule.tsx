'use client';

import React, { useState } from 'react';
import { demoOutcomeAssessments } from '@/data/demoWatershedData';
import { 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  Calculator, 
  Sparkles,
  Droplet,
  Mountain,
  BookOpen
} from 'lucide-react';

export default function AssessmentModule() {
  const [extraCheckDams, setExtraCheckDams] = useState(2);
  const [extraCctHa, setExtraCctHa] = useState(15);
  const [extraFarmPonds, setExtraFarmPonds] = useState(1);

  // Projected impact calculations
  const projectedExtraStorageTcm = (extraCheckDams * 4.5 + extraFarmPonds * 0.8).toFixed(1);
  const projectedWaterTableRise = (extraCheckDams * 0.8 + extraCctHa * 0.08).toFixed(1);
  const projectedSoilSavedTons = (extraCctHa * 18.2 + extraCheckDams * 42.0).toFixed(0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
              Scientific Outcome Assessment & Predictive Impact Modeling
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono">
            Demonstration scientific indicators evaluated against 2021 pre-intervention baseline with peer-reviewed mathematical methodologies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#0B0F15] border border-[#233041] text-xs font-mono text-[#2DD4BF] font-bold">
            5 OF 5 DEMONSTRATION BENCHMARKS
          </span>
        </div>
      </div>

      {/* Interactive What-If Scenario Modeling Simulator */}
      <div className="bg-[#131A24] border border-[#233041] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#2DD4BF]" />
            <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">
              Predictive &quot;What-If&quot; Intervention Impact Simulator
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-2.5 py-1 rounded-lg border border-[#233041]">
            SIMULATION ENGINE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="space-y-3 font-mono text-xs">
            <div className="bg-[#0B0F15] p-3.5 rounded-xl border border-[#233041] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Additional Check Dams:</span>
                <span className="text-[#2DD4BF] font-bold">+{extraCheckDams}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="6" 
                value={extraCheckDams} 
                onChange={(e) => setExtraCheckDams(Number(e.target.value))}
                className="w-full accent-[#2DD4BF] cursor-pointer"
              />
            </div>

            <div className="bg-[#0B0F15] p-3.5 rounded-xl border border-[#233041] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Contour Trenching (CCT):</span>
                <span className="text-[#10B981] font-bold">+{extraCctHa} Ha</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="40" 
                value={extraCctHa} 
                onChange={(e) => setExtraCctHa(Number(e.target.value))}
                className="w-full accent-[#10B981] cursor-pointer"
              />
            </div>

            <div className="bg-[#0B0F15] p-3.5 rounded-xl border border-[#233041] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Lined Farm Ponds:</span>
                <span className="text-[#38BDF8] font-bold">+{extraFarmPonds}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5" 
                value={extraFarmPonds} 
                onChange={(e) => setExtraFarmPonds(Number(e.target.value))}
                className="w-full accent-[#38BDF8] cursor-pointer"
              />
            </div>
          </div>

          {/* Real-time Projected Yield Outputs */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#182230] to-[#0B0F15] border border-[#233041] flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-[#94A3B8] uppercase font-bold flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-[#38BDF8]" /> Additional Live Storage
                </div>
                <div className="text-2xl font-bold text-[#38BDF8] mt-2">+{projectedExtraStorageTcm} TCM</div>
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-2 pt-2 border-t border-[#233041]">
                Expands catchment retention duration by ~1.8 months
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[#182230] to-[#0B0F15] border border-[#233041] flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-[#94A3B8] uppercase font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" /> Groundwater Table Rise
                </div>
                <div className="text-2xl font-bold text-[#10B981] mt-2">+{projectedWaterTableRise}m</div>
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-2 pt-2 border-t border-[#233041]">
                Benefiting surrounding open wells within 800m radius
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-[#182230] to-[#0B0F15] border border-[#233041] flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-[#94A3B8] uppercase font-bold flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5 text-[#F59E0B]" /> Catchment Soil Retained
                </div>
                <div className="text-2xl font-bold text-[#F59E0B] mt-2">+{projectedSoilSavedTons} t/yr</div>
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-2 pt-2 border-t border-[#233041]">
                Reduces downstream reservoir siltation by ~14%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Formulas Box */}
      <div className="bg-[#131A24] border border-[#233041] rounded-2xl p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#2DD4BF] uppercase">
          <BookOpen className="w-4 h-4" /> Validated Scientific Formulations
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041]">
            <div className="text-[#94A3B8] text-[10px] font-bold uppercase">1. Normalized Difference Vegetation</div>
            <div className="text-[#10B981] font-bold mt-1 text-sm">NDVI = (B8 - B4) / (B8 + B4)</div>
            <div className="text-[#94A3B8] text-[10px] mt-1">Calibrated Sentinel-2 BOA Surface Reflectance</div>
          </div>
          <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041]">
            <div className="text-[#94A3B8] text-[10px] font-bold uppercase">2. Revised Universal Soil Loss</div>
            <div className="text-[#F59E0B] font-bold mt-1 text-sm">A = R × K × LS × C × P</div>
            <div className="text-[#94A3B8] text-[10px] mt-1">Copernicus 30m Slope + Sentinel C-Factor</div>
          </div>
          <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041]">
            <div className="text-[#94A3B8] text-[10px] font-bold uppercase">3. McFeeters Water Index</div>
            <div className="text-[#38BDF8] font-bold mt-1 text-sm">NDWI = (B3 - B8) / (B3 + B8)</div>
            <div className="text-[#94A3B8] text-[10px] mt-1">Surface water body extraction thresholding</div>
          </div>
        </div>
      </div>

      {/* Empirical Scorecard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoOutcomeAssessments.map((item) => (
          <div 
            key={item.id}
            className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-[#2DD4BF]/50 transition-all duration-300 group hover:scale-[1.01]"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono font-bold text-[#2DD4BF] uppercase">{item.category}</span>
                <span className="text-[11px] font-mono text-[#F1F5F9] bg-[#0B0F15] px-2.5 py-0.5 rounded-lg border border-[#233041] font-bold">
                  Conf: {item.confidencePercent}%
                </span>
              </div>

              <h3 className="text-base font-bold text-[#F1F5F9] mb-3 font-sans group-hover:text-[#2DD4BF] transition-colors">{item.metricName}</h3>

              <div className="bg-[#0B0F15] p-3.5 rounded-xl border border-[#233041] space-y-2 mb-4 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Baseline (2021):</span>
                  <span className="text-[#F1F5F9] font-medium">{item.baselineValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Current (2026):</span>
                  <span className="text-[#2DD4BF] font-bold">{item.currentValue}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-[#233041]">
                  <span className="text-[#94A3B8]">Net Impact:</span>
                  <span className="text-[#10B981] font-extrabold">{item.netDelta}</span>
                </div>
              </div>

              <p className="text-xs text-[#94A3B8] mb-3 leading-relaxed font-mono">
                {item.methodology}
              </p>
            </div>

            <div className="pt-3 border-t border-[#233041] text-[11px] font-mono text-[#94A3B8] flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
              <span>Limitation: {item.limitations}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
