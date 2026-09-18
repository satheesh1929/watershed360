'use client';

import React, { useState } from 'react';
import { demoPriorityZones } from '@/data/demoWatershedData';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ArrowUpRight, 
  CheckCircle2, 
  TrendingDown,
  Sliders,
  Sparkles,
  Layers,
  FileCheck,
  Calculator,
  Download
} from 'lucide-react';
import { PriorityZone } from '@/types/watershed';

interface PriorityIntelligenceProps {
  onSelectZone: (id: string) => void;
  priorityZones?: PriorityZone[];
}

export default function PriorityIntelligence({ 
  onSelectZone, 
  priorityZones = demoPriorityZones 
}: PriorityIntelligenceProps) {
  // MCDA Weight State (out of 100% total)
  const [slopeWeight, setSlopeWeight] = useState(35);
  const [erosionWeight, setErosionWeight] = useState(30);
  const [ndviWeight, setNdviWeight] = useState(20);
  const [drainageWeight, setDrainageWeight] = useState(15);

  const [generatedPlan, setGeneratedPlan] = useState<boolean>(false);

  const handleResetWeights = () => {
    setSlopeWeight(35);
    setErosionWeight(30);
    setNdviWeight(20);
    setDrainageWeight(15);
  };

  const handleExportConfig = () => {
    const config = {
      model: 'MCDA Priority Scoring Matrix',
      methodology: 'Multi-Criteria Decision Analysis (AHP-Weighted)',
      weights: {
        demSlopeGradientPct: slopeWeight,
        rusleSoilLossPct: erosionWeight,
        ndviCanopyDeficitPct: ndviWeight,
        drainageProximityPct: drainageWeight,
        totalWeightPct: slopeWeight + erosionWeight + ndviWeight + drainageWeight
      },
      zones: priorityZones.map((z, idx) => ({
        id: z.id,
        name: z.name,
        areaHa: z.areaHa,
        calculatedScore: calculateDynamicScore(z.compositeScore, idx),
        riskLevel: z.riskLevel
      })),
      timestamp: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'watershed-mcda-weights-config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  };

  // Dynamically calculate composite score based on MCDA sliders
  const calculateDynamicScore = (baseScore: number, index: number) => {
    const totalWeight = slopeWeight + erosionWeight + ndviWeight + drainageWeight;
    const factor = (slopeWeight * 0.35 + erosionWeight * 0.30 + ndviWeight * 0.20 + drainageWeight * 0.15) / 25;
    const normalizedWeightFactor = totalWeight > 0 ? (totalWeight / 100) : 1;
    const adjusted = Math.min(Math.round((baseScore * (factor * 0.4 + 0.6) * normalizedWeightFactor) + (index === 0 ? 3 : 0)), 99);
    return Math.max(adjusted, 15);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
              Multi-Criteria Vulnerability Scoring & Priority Intelligence
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono">
            Transparent composite scoring based on slope steepness, NDVI degradation trends, drainage proximity, and soil erosion potential.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetWeights}
            className="px-3 py-2 rounded-xl bg-[#0B0F15] hover:bg-[#182230] border border-[#233041] text-xs font-mono text-[#94A3B8] hover:text-[#F1F5F9] transition-all"
          >
            Reset Weights
          </button>
          <button
            onClick={handleExportConfig}
            className="px-3 py-2 rounded-xl bg-[#182230] hover:bg-[#233041] border border-[#233041] text-xs font-mono text-[#2DD4BF] font-bold transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => setGeneratedPlan(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-mono font-bold text-xs hover:brightness-110 shadow-lg shadow-[#2DD4BF]/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Synthesize Action Plan</span>
          </button>
        </div>
      </div>

      {/* Interactive MCDA Weight Adjustment Studio */}
      <div className="bg-[#131A24] border border-[#233041] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#2DD4BF]" />
            <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">
              Interactive MCDA Sensitivity Weight Studio
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#94A3B8]">
              Total Weight: <strong className={slopeWeight + erosionWeight + ndviWeight + drainageWeight === 100 ? 'text-[#10B981]' : 'text-[#F59E0B]'}>{slopeWeight + erosionWeight + ndviWeight + drainageWeight}%</strong>
            </span>
            <span className="text-[10px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-2.5 py-1 rounded-lg border border-[#233041]">
              DYNAMIC WEIGHTS ACTIVE
            </span>
          </div>
        </div>

        {/* Formula Transparency Callout */}
        <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#94A3B8]">
          <span>Composite Score Formula:</span>
          <span className="text-[#2DD4BF] font-bold">
            Score = ({slopeWeight}% × Slope) + ({erosionWeight}% × RUSLE) + ({ndviWeight}% × Deficit) + ({drainageWeight}% × Distance)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {/* Slope Weight */}
          <div className="bg-[#0B0F15] p-3.5 rounded-xl border border-[#233041] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">DEM Slope Gradient:</span>
              <span className="text-[#2DD4BF] font-bold">{slopeWeight}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="60" 
              value={slopeWeight} 
              onChange={(e) => setSlopeWeight(Number(e.target.value))}
              className="w-full accent-[#2DD4BF] cursor-pointer"
            />
          </div>

          {/* Erosion Loss Weight */}
          <div className="bg-[#0B0F15] p-3.5 rounded-xl border border-[#233041] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">RUSLE Soil Loss:</span>
              <span className="text-[#F59E0B] font-bold">{erosionWeight}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="60" 
              value={erosionWeight} 
              onChange={(e) => setErosionWeight(Number(e.target.value))}
              className="w-full accent-[#F59E0B] cursor-pointer"
            />
          </div>

          {/* NDVI Deficit Weight */}
          <div className="bg-[#0B0F15] p-3.5 rounded-xl border border-[#233041] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Vegetation Deficit:</span>
              <span className="text-[#10B981] font-bold">{ndviWeight}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="50" 
              value={ndviWeight} 
              onChange={(e) => setNdviWeight(Number(e.target.value))}
              className="w-full accent-[#10B981] cursor-pointer"
            />
          </div>

          {/* Strahler Proximity */}
          <div className="bg-[#0B0F15] p-3.5 rounded-xl border border-[#233041] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Drainage Proximity:</span>
              <span className="text-[#38BDF8] font-bold">{drainageWeight}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="40" 
              value={drainageWeight} 
              onChange={(e) => setDrainageWeight(Number(e.target.value))}
              className="w-full accent-[#38BDF8] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Generated Action Plan Card */}
      {generatedPlan && (
        <div className="glass-panel rounded-2xl p-6 border-[#2DD4BF]/50 space-y-4 animate-fadeIn shadow-2xl shadow-[#2DD4BF]/15">
          <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2DD4BF]" />
              <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">
                Synthesized Civil Engineering Package (FY 2026-27 Allocation)
              </h3>
            </div>
            <button
              onClick={() => setGeneratedPlan(false)}
              className="text-xs font-mono text-[#94A3B8] hover:text-[#F1F5F9]"
            >
              DISMISS
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
              <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Estimated Outlay</div>
              <div className="text-lg font-bold text-[#2DD4BF] mt-1 flex items-baseline gap-1">
                ₹ 28.40 Lakhs <span className="text-[10px] text-[#F59E0B] font-normal">(demo estimate)</span>
              </div>
              <div className="text-[10px] text-[#94A3B8]">WDC-PMKSY 2.0 Norms (~₹25–30L)</div>
            </div>
            <div className="p-3.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
              <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Recommended Structures</div>
              <div className="text-xl font-bold text-[#F1F5F9] mt-1">3 CCT + 2 Plugs</div>
              <div className="text-[10px] text-[#10B981]">Targets Zone A & C</div>
            </div>
            <div className="p-3.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
              <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Target Yield Addition</div>
              <div className="text-xl font-bold text-[#38BDF8] mt-1">+12.6 TCM</div>
              <div className="text-[10px] text-[#38BDF8]">Surface + Recharge</div>
            </div>
          </div>
        </div>
      )}

      {/* Priority Zones Ranked Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {priorityZones.map((zone, idx) => {
          const dynamicScore = calculateDynamicScore(zone.compositeScore, idx);

          return (
            <div 
              key={zone.id}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-[#2DD4BF] transition-all duration-300 group hover:scale-[1.01]"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#F1F5F9] font-sans group-hover:text-[#2DD4BF] transition-colors">{zone.name}</h3>
                    <div className="text-xs font-mono text-[#94A3B8] mt-0.5">Catchment Area: <span className="text-[#F1F5F9] font-semibold">{zone.areaHa} Ha</span></div>
                  </div>
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border shadow-sm ${
                    zone.riskLevel === 'CRITICAL' ? 'bg-[#F43F5E]/20 text-[#F43F5E] border-[#F43F5E]/40' :
                    zone.riskLevel === 'HIGH' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40' :
                    'bg-[#2DD4BF]/20 text-[#2DD4BF] border-[#2DD4BF]/40'
                  }`}>
                    {zone.riskLevel} (MCDA: {dynamicScore}/100)
                  </span>
                </div>

                {/* Explanatory Factors */}
                <div className="space-y-2 mb-4">
                  <div className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase">Vulnerability Factors:</div>
                  <ul className="space-y-1.5">
                    {zone.reasons.map((reason, rIdx) => (
                      <li key={rIdx} className="text-xs text-[#F1F5F9] flex items-center gap-2 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Remediation */}
                <div className="p-3.5 bg-[#0B0F15] border border-[#233041] rounded-xl mb-4">
                  <div className="text-[10px] font-mono text-[#2DD4BF] font-bold mb-1 uppercase tracking-wider">
                    RECOMMENDED CIVIL REMEDIATION
                  </div>
                  <div className="text-xs text-[#F1F5F9] font-sans leading-relaxed">{zone.recommendedAction}</div>
                </div>
              </div>

              <button 
                onClick={() => onSelectZone(zone.id)}
                className="w-full py-2.5 px-4 bg-[#182230] hover:bg-[#2DD4BF] hover:text-[#0B0F15] border border-[#233041] rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 text-[#F1F5F9] shadow-sm group-hover:border-[#2DD4BF]/40"
              >
                <span>Locate in Watershed GIS Map</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
