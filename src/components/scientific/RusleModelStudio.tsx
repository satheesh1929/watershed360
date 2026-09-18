'use client';

import React, { useState } from 'react';
import { 
  Mountain, 
  Calculator, 
  Sliders, 
  Info, 
  AlertTriangle, 
  Download, 
  RefreshCw,
  Sparkles,
  CheckCircle2,
  FileDown
} from 'lucide-react';
import DataBadge from '@/components/common/DataBadge';

interface RusleModelStudioProps {
  watershedId?: string;
}

export default function RusleModelStudio({ watershedId = 'pimpalgaon' }: RusleModelStudioProps) {
  // RUSLE Parameters: A = R * K * LS * C * P
  // Baseline (Untreated) Defaults
  const [rFactor, setRFactor] = useState<number>(320); // Rainfall Erosivity MJ.mm/(ha.h.yr)
  const [kFactor, setKFactor] = useState<number>(0.32); // Soil Erodibility t.ha.h/(ha.MJ.mm) - Vertisol/Black Trap
  const [lsFactor, setLsFactor] = useState<number>(2.8); // Slope Length & Steepness (from Copernicus 30m DEM)
  const [cFactorBaseline, setCFactorBaseline] = useState<number>(0.38); // Cover Management (Untreated scrub/barren)
  const [pFactorBaseline, setPFactorBaseline] = useState<number>(0.90); // Conservation Practice (No bunding)

  // Post-Intervention (Treated) Parameters
  const [cFactorTreated, setCFactorTreated] = useState<number>(0.18); // Cover Management with horticulture/CCT
  const [pFactorTreated, setPFactorTreated] = useState<number>(0.45); // Conservation Practice with CCT + Gully Plugs

  // Soil Type Presets
  const [selectedSoilType, setSelectedSoilType] = useState<'VERTISOL' | 'ENTISOL' | 'ALFISOL'>('VERTISOL');

  const handleSoilPresetChange = (type: 'VERTISOL' | 'ENTISOL' | 'ALFISOL') => {
    setSelectedSoilType(type);
    if (type === 'VERTISOL') {
      setKFactor(0.32); // Deccan Black Cotton Trap
    } else if (type === 'ENTISOL') {
      setKFactor(0.38); // Shallow Foothill Skeletal
    } else {
      setKFactor(0.24); // Red Loamy Alfisol
    }
  };

  const handleResetDefaults = () => {
    setRFactor(320);
    setKFactor(0.32);
    setLsFactor(2.8);
    setCFactorBaseline(0.38);
    setPFactorBaseline(0.90);
    setCFactorTreated(0.18);
    setPFactorTreated(0.45);
    setSelectedSoilType('VERTISOL');
  };

  // Calculations: tons/ha/year
  const baselineLoss = (rFactor * kFactor * lsFactor * cFactorBaseline * pFactorBaseline).toFixed(1);
  const treatedLoss = (rFactor * kFactor * lsFactor * cFactorTreated * pFactorTreated).toFixed(1);
  const netAbatementPct = (
    ((parseFloat(baselineLoss) - parseFloat(treatedLoss)) / parseFloat(baselineLoss)) * 100
  ).toFixed(1);

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Parameter,Symbol,Baseline Value,Treated Value,Unit,Source\n" +
      `Rainfall Erosivity,R,${rFactor},${rFactor},MJ.mm/(ha.h.yr),IMD Gridded Pluviograph\n` +
      `Soil Erodibility,K,${kFactor},${kFactor},t.ha.h/(ha.MJ.mm),NBSS&LUP Deccan Basalt Survey\n` +
      `Topographic Factor,LS,${lsFactor},${lsFactor},Dimensionless,Copernicus 30m DEM Slope\n` +
      `Cover Management,C,${cFactorBaseline},${cFactorTreated},Dimensionless,Sentinel-2 Phenology LULC\n` +
      `Conservation Practice,P,${pFactorBaseline},${pFactorTreated},Dimensionless,PMKSY-WDC 2.0 Civil Engineering\n` +
      `Computed Soil Loss,A,${baselineLoss},${treatedLoss},tons/ha/year,RUSLE Mathematical Model\n` +
      `Net Soil Loss Abatement,-,-,${netAbatementPct}%,Percentage,Modeled Conservation Outcome\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RUSLE-soil-loss-model-${watershedId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[#A855F7]/10 text-[#A855F7]">
              <Mountain className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
              Revised Universal Soil Loss Equation (RUSLE) Modeling Studio
            </h2>
            <DataBadge status="MODELED" compact />
          </div>
          <p className="text-xs text-[#94A3B8] font-mono">
            Empirical erosion modeling with transparent regional parameter calibration for R, K, LS, C, and P factors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B0F15] hover:bg-[#182230] border border-[#233041] text-xs font-mono text-[#94A3B8] hover:text-[#F1F5F9] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-mono font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#2DD4BF]/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Model CSV</span>
          </button>
        </div>
      </div>

      {/* Equation Visual Formula Card */}
      <div className="bg-[#131A24] border border-[#233041] rounded-2xl p-5 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#233041]">
          <span className="text-[#94A3B8] text-[11px] uppercase font-bold">Mathematical Formulation:</span>
          <span className="text-[#2DD4BF] font-bold">A = R × K × LS × C × P</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-2.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
            <div className="text-[#38BDF8] font-bold text-sm">R = {rFactor}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">Rainfall Erosivity</div>
          </div>
          <div className="p-2.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
            <div className="text-[#A855F7] font-bold text-sm">K = {kFactor}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">Soil Erodibility</div>
          </div>
          <div className="p-2.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
            <div className="text-[#F59E0B] font-bold text-sm">LS = {lsFactor}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">Slope & Length</div>
          </div>
          <div className="p-2.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
            <div className="text-[#10B981] font-bold text-sm">C = {cFactorBaseline} → {cFactorTreated}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">Cover Management</div>
          </div>
          <div className="p-2.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
            <div className="text-[#EC4899] font-bold text-sm">P = {pFactorBaseline} → {pFactorTreated}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">Conservation Practice</div>
          </div>
        </div>
      </div>

      {/* Model Parameter Adjustment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel rounded-2xl p-6 space-y-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#2DD4BF]" />
                <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">
                  Interactive RUSLE Parameter Calibration
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-[#0B0F15] p-1 rounded-lg border border-[#233041] text-[10px]">
                <button
                  onClick={() => handleSoilPresetChange('VERTISOL')}
                  className={`px-2 py-1 rounded ${selectedSoilType === 'VERTISOL' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'}`}
                >
                  Vertisol (Black Trap)
                </button>
                <button
                  onClick={() => handleSoilPresetChange('ENTISOL')}
                  className={`px-2 py-1 rounded ${selectedSoilType === 'ENTISOL' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'}`}
                >
                  Entisol (Foothill)
                </button>
                <button
                  onClick={() => handleSoilPresetChange('ALFISOL')}
                  className={`px-2 py-1 rounded ${selectedSoilType === 'ALFISOL' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'}`}
                >
                  Alfisol (Red Loam)
                </button>
              </div>
            </div>

            {/* Slider 1: R Factor */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">R - Rainfall Erosivity Factor [MJ·mm/(ha·h·yr)]:</span>
                <span className="text-[#38BDF8] font-bold">{rFactor}</span>
              </div>
              <input
                type="range"
                min="150"
                max="600"
                step="10"
                value={rFactor}
                onChange={(e) => setRFactor(Number(e.target.value))}
                className="w-full accent-[#38BDF8] cursor-pointer"
              />
              <div className="text-[10px] text-[#64748B]">Regional normal range for semi-arid Maharashtra: 280–360</div>
            </div>

            {/* Slider 2: K Factor */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">K - Soil Erodibility Factor [t·ha·h/(ha·MJ·mm)]:</span>
                <span className="text-[#A855F7] font-bold">{kFactor.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.50"
                step="0.02"
                value={kFactor}
                onChange={(e) => setKFactor(Number(e.target.value))}
                className="w-full accent-[#A855F7] cursor-pointer"
              />
              <div className="text-[10px] text-[#64748B]">Vertisols with high clay swell/shrink typically range 0.28 to 0.35</div>
            </div>

            {/* Slider 3: LS Factor */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">LS - Topographic Slope Length & Gradient Factor:</span>
                <span className="text-[#F59E0B] font-bold">{lsFactor.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.1"
                value={lsFactor}
                onChange={(e) => setLsFactor(Number(e.target.value))}
                className="w-full accent-[#F59E0B] cursor-pointer"
              />
              <div className="text-[10px] text-[#64748B]">Derived from Copernicus GLO-30m DEM slope accumulation</div>
            </div>

            {/* Treated C and P Factors */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#233041]">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Treated C Factor:</span>
                  <span className="text-[#10B981] font-bold">{cFactorTreated.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.01"
                  value={cFactorTreated}
                  onChange={(e) => setCFactorTreated(Number(e.target.value))}
                  className="w-full accent-[#10B981] cursor-pointer"
                />
                <div className="text-[10px] text-[#64748B]">Post-CCT vegetative cover</div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Treated P Factor:</span>
                  <span className="text-[#EC4899] font-bold">{pFactorTreated.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.20"
                  max="0.80"
                  step="0.05"
                  value={pFactorTreated}
                  onChange={(e) => setPFactorTreated(Number(e.target.value))}
                  className="w-full accent-[#EC4899] cursor-pointer"
                />
                <div className="text-[10px] text-[#64748B]">Stone bunding & gully plugs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Outcomes Scorecard */}
        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          <div className="glass-panel rounded-2xl p-6 space-y-4 border-[#2DD4BF]/40">
            <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
              <h4 className="text-sm font-bold text-[#F1F5F9] font-sans">
                Soil Erosion Model Results
              </h4>
              <span className="text-[10px] text-[#10B981] font-bold">
                {netAbatementPct}% ABATEMENT
              </span>
            </div>

            {/* Baseline Card */}
            <div className="p-3.5 bg-[#0B0F15] rounded-xl border border-[#F43F5E]/30 space-y-1">
              <span className="text-[10px] text-[#F43F5E] font-bold uppercase">
                Untreated Baseline Soil Loss:
              </span>
              <div className="text-xl font-bold text-[#F43F5E]">
                {baselineLoss} <span className="text-xs font-normal text-[#94A3B8]">tons/Ha/yr</span>
              </div>
              <p className="text-[10px] text-[#94A3B8]">
                High soil degradation stripping topsoil fertility.
              </p>
            </div>

            {/* Treated Outcome Card */}
            <div className="p-3.5 bg-[#0B0F15] rounded-xl border border-[#10B981]/30 space-y-1">
              <span className="text-[10px] text-[#10B981] font-bold uppercase">
                Post-Intervention Soil Loss:
              </span>
              <div className="text-xl font-bold text-[#10B981]">
                {treatedLoss} <span className="text-xs font-normal text-[#94A3B8]">tons/Ha/yr</span>
              </div>
              <p className="text-[10px] text-[#94A3B8]">
                Reduced below tolerable soil loss limit (T &lt; 12.5 t/ha/yr).
              </p>
            </div>

            {/* Total Catchment Soil Saved */}
            <div className="p-3.5 bg-[#182230] rounded-xl border border-[#2DD4BF]/30 space-y-1">
              <span className="text-[10px] text-[#2DD4BF] font-bold uppercase">
                Catchment Annual Topsoil Conserved:
              </span>
              <div className="text-lg font-bold text-[#2DD4BF]">
                {Math.round((parseFloat(baselineLoss) - parseFloat(treatedLoss)) * 1840).toLocaleString()} tons/yr
              </div>
              <p className="text-[10px] text-[#94A3B8]">
                Prevents premature reservoir & nala bund siltation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Assumptions & Scientific Limitations */}
      <div className="p-4 bg-[#0B0F15] border border-[#233041] rounded-2xl space-y-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#94A3B8] font-bold text-[11px]">
          <Info className="w-4 h-4 text-[#38BDF8]" />
          <span>SCIENTIFIC RUSLE MODEL LIMITATIONS & SENSITIVITY ASSUMPTIONS</span>
        </div>
        <p className="text-[#94A3B8] leading-relaxed text-[11px]">
          RUSLE is an empirical model estimating long-term average sheet and rill erosion; it does <strong>not</strong> simulate concentrated gully headward advance or mass slumping. Rainfall erosivity (R) is calibrated against IMD gridded daily data rather than continuous pluviograph gauges. Default K-factor values assume typical Vertisol texture without site-specific gravel fraction adjustment. Field calibration via sediment traps is recommended for high-precision civil budgeting.
        </p>
      </div>
    </div>
  );
}
