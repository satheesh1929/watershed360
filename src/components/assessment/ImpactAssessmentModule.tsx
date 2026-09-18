'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Droplets, 
  Leaf, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  Eye, 
  Filter, 
  Search,
  ExternalLink,
  ArrowRight,
  Info,
  Building2,
  TableProperties
} from 'lucide-react';
import { getWatershedDataset } from '@/data/demoWatershedData';
import DataBadge from '@/components/common/DataBadge';

interface ImpactAssessmentModuleProps {
  watershedId?: string;
  onSelectIntervention?: (id: string) => void;
  onOpenEvidencePhoto?: (photoUrl: string) => void;
}

export default function ImpactAssessmentModule({
  watershedId = 'pimpalgaon',
  onSelectIntervention,
  onOpenEvidencePhoto
}: ImpactAssessmentModuleProps) {
  const dataset = getWatershedDataset(watershedId);
  const [activeTab, setActiveTab] = useState<'INTERVENTIONS' | 'CONTROL_SITES' | 'GROUNDWATER'>('INTERVENTIONS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<string>(dataset.interventions[0]?.id || 'pk-cd-01');

  // Control vs Intervention Sites Comparative Scientific Dataset
  const controlSiteComparisons = [
    {
      parameter: 'Vegetation Canopy Flush (Mean ΔNDVI)',
      interventionZone: '+0.22 (Aug 2026)',
      controlZone: '+0.08 (Aug 2026)',
      deltaAttributable: '+0.14 Net Intervention Effect',
      attributionStatus: 'SUPPORTED BY SPATIAL EVIDENCE',
      evidenceBasis: 'Sentinel-2 BOA surface reflectance shows localized greening concentrated in impoundment command zone.',
      statusColor: 'text-[#10B981]'
    },
    {
      parameter: 'Surface Water Spread & Retention Duration',
      interventionZone: '38.6 Ha (Retained through March)',
      controlZone: '4.2 Ha (Dries out by December)',
      deltaAttributable: '+34.4 Ha Sustained Retention',
      attributionStatus: 'SUPPORTED BY SPATIAL EVIDENCE',
      evidenceBasis: 'NDWI time-series confirms perennial impoundment upstream of masonry weirs CD-01 and CD-02.',
      statusColor: 'text-[#10B981]'
    },
    {
      parameter: 'Dug-Well Static Water Level Lift',
      interventionZone: '+7.3m to +8.4m Recovery BGL',
      controlZone: '+2.1m Baseline Seasonal Flush',
      deltaAttributable: '+5.2m Net Induced Recharge',
      attributionStatus: 'SUPPORTED BY SPATIAL EVIDENCE',
      evidenceBasis: 'PWD observation well soundings within 500m radius of percolation tank PT-01 exhibit sustained heads.',
      statusColor: 'text-[#10B981]'
    },
    {
      parameter: 'Annual Sheet & Rill Soil Loss Rate',
      interventionZone: '11.8 tons/Ha/yr (Treated CCT & Plugs)',
      controlZone: '32.6 tons/Ha/yr (Untreated Ridge Escarpment)',
      deltaAttributable: '-63.8% Erosion Abatement',
      attributionStatus: 'SUPPORTED BY MODEL & FIELD EVIDENCE',
      evidenceBasis: 'RUSLE equation verified by sediment gauge monitoring along primary stream order 3.',
      statusColor: 'text-[#10B981]'
    },
    {
      parameter: 'Deep Borewell Piezometric Pressure',
      interventionZone: '+1.4m Regional Head',
      controlZone: '+1.1m Regional Head',
      deltaAttributable: '+0.3m (Indeterminate)',
      attributionStatus: 'ATTRIBUTION NOT ESTABLISHED / DATA PENDING',
      evidenceBasis: 'Regional deep basalt aquifer flow dynamics cannot be definitively tied to shallow structures without isotope tracer analysis.',
      statusColor: 'text-[#F59E0B]'
    }
  ];

  const selectedAsset = dataset.interventions.find((i) => i.id === selectedAssetId) || dataset.interventions[0];

  return (
    <div className="space-y-6 animate-fadeIn max-w-[1500px] mx-auto pb-14">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
              Watershed Intervention Impact Evaluation & Attribution Engine
            </h2>
            <DataBadge status="VERIFIED" compact />
          </div>
          <p className="text-xs text-[#94A3B8] font-mono">
            Scientific evaluation isolating intervention impact from natural seasonal flushes using paired control/reference sites and physical observation well telemetry.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1.5 bg-[#0B0F15] p-1 rounded-xl border border-[#233041] text-xs font-mono">
          <button
            onClick={() => setActiveTab('INTERVENTIONS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'INTERVENTIONS' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
            }`}
          >
            Asset Scorecard
          </button>
          <button
            onClick={() => setActiveTab('CONTROL_SITES')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'CONTROL_SITES' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
            }`}
          >
            Treated vs Control Sites
          </button>
          <button
            onClick={() => setActiveTab('GROUNDWATER')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'GROUNDWATER' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
            }`}
          >
            Groundwater Wells
          </button>
        </div>
      </div>

      {/* Tab 1: Asset-by-Asset Impact Scorecard */}
      {activeTab === 'INTERVENTIONS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
          {/* Left Column: Asset Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="glass-panel rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] pb-2 border-b border-[#233041]">
                <span className="font-bold uppercase">Civil Assets ({dataset.interventions.length})</span>
                <span className="text-[#2DD4BF]">{dataset.stats.code}</span>
              </div>

              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {dataset.interventions.map((asset) => {
                  const isSelected = asset.id === selectedAssetId;
                  return (
                    <button
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected 
                          ? 'bg-[#182230] border-[#2DD4BF] text-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/10' 
                          : 'bg-[#0B0F15] border-[#233041] text-[#94A3B8] hover:border-[#2DD4BF]/40 hover:text-[#F1F5F9]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#F1F5F9]">{asset.code}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          asset.status === 'VERIFIED_ACTIVE' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                        }`}>
                          {asset.status}
                        </span>
                      </div>
                      <div className="text-[11px] truncate text-[#94A3B8]">{asset.name}</div>
                      <div className="text-[10px] text-[#64748B] mt-1 flex items-center justify-between">
                        <span>Cap: {asset.capacityTcm} TCM</span>
                        <span>Silt: {asset.siltationPercent}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Impact Evaluation Card for Selected Asset */}
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-panel rounded-2xl p-6 space-y-5 border-[#2DD4BF]/30">
              {/* Asset Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#233041]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-bold text-[#F1F5F9] font-sans">{selectedAsset.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#2DD4BF]/20 text-[#2DD4BF] text-[10px] font-bold">
                      {selectedAsset.code}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    {selectedAsset.type} • Stream Order {selectedAsset.streamOrder} • Built in {selectedAsset.constructionYear}
                  </p>
                </div>
                <DataBadge status="VERIFIED" source="WDC-PMKSY 2.0 Asset MIS" compact />
              </div>

              {/* 4 Quantitative Indicator Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041]">
                  <span className="text-[10px] text-[#94A3B8]">Live Pool Storage:</span>
                  <div className="text-base font-bold text-[#38BDF8] mt-0.5">{selectedAsset.capacityTcm} TCM</div>
                  <span className="text-[9px] text-[#10B981]">Surface Harvesting</span>
                </div>
                <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041]">
                  <span className="text-[10px] text-[#94A3B8]">Siltation Audit:</span>
                  <div className={`text-base font-bold mt-0.5 ${selectedAsset.siltationPercent > 40 ? 'text-[#F43F5E]' : 'text-[#10B981]'}`}>
                    {selectedAsset.siltationPercent}%
                  </div>
                  <span className="text-[9px] text-[#94A3B8]">Upstream Basin</span>
                </div>
                <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041]">
                  <span className="text-[10px] text-[#94A3B8]">Catchment Command:</span>
                  <div className="text-base font-bold text-[#F1F5F9] mt-0.5">{selectedAsset.catchmentAreaHa} Ha</div>
                  <span className="text-[9px] text-[#2DD4BF]">Drainage Zone</span>
                </div>
                <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041]">
                  <span className="text-[10px] text-[#94A3B8]">Groundwater Lift:</span>
                  <div className="text-base font-bold text-[#10B981] mt-0.5">+7.8m</div>
                  <span className="text-[9px] text-[#10B981]">Nearby Dug-Wells</span>
                </div>
              </div>

              {/* Pre vs Post Condition Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#0B0F15] rounded-xl border border-[#F43F5E]/30 space-y-1.5">
                  <span className="text-[10px] text-[#F43F5E] font-bold uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F43F5E]" />
                    Pre-Intervention Baseline State (2021):
                  </span>
                  <p className="text-[#94A3B8] text-xs leading-relaxed">
                    Ephemeral seasonal nala drying up within 2 weeks of monsoon withdrawal. Severe gully downcutting and rapid sheet runoff resulting in topsoil degradation. Open farm wells dry by January.
                  </p>
                </div>

                <div className="p-4 bg-[#0B0F15] rounded-xl border border-[#10B981]/30 space-y-1.5">
                  <span className="text-[10px] text-[#10B981] font-bold uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    Post-Intervention Outcome State (2026):
                  </span>
                  <p className="text-[#F1F5F9] text-xs leading-relaxed">
                    Perennial impoundment holding 1.4m live depth through March. Downstream hydraulic jump dissipated by rock apron. Radial aquifer percolation sustained 6 open dug-wells through rabi harvest.
                  </p>
                </div>
              </div>

              {/* Scientific Attribution State */}
              <div className="p-3.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#10B981] font-bold uppercase">
                    Causal Attribution Assessment:
                  </span>
                  <span className="text-[10px] font-bold text-[#10B981]">
                    ATTRIBUTION SUPPORTED BY SPATIAL EVIDENCE
                  </span>
                </div>
                <p className="text-[11px] text-[#F1F5F9] leading-relaxed">
                  Sentinel-2 multi-spectral NDVI shows localized greening concentrated specifically within the 400m command corridor of {selectedAsset.code}. Dug-well soundings in Khadakwadi corroborate localized head retention not observed in adjacent untreated micro-catchment ridges.
                </p>
              </div>

              {/* Photographic Ground Truth Preview */}
              {selectedAsset.photoUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Linked Visual Ground Truth:</span>
                    <span className="text-[#2DD4BF] font-semibold">Verified Field Geotag</span>
                  </div>
                  <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-black border border-[#233041]">
                    <img src={selectedAsset.photoUrl} alt="Asset" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/80 text-[10px] text-[#2DD4BF]">
                      {selectedAsset.code} • {selectedAsset.name}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Treated vs Control Sites Table */}
      {activeTab === 'CONTROL_SITES' && (
        <div className="glass-panel rounded-2xl p-6 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
            <div>
              <h3 className="text-sm font-bold text-[#F1F5F9] font-sans flex items-center gap-2">
                <TableProperties className="w-4 h-4 text-[#2DD4BF]" />
                Intervention vs Control / Reference Sites Comparative Evaluation
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                Evaluated under identical IMD rainfall events (580mm) to isolate structural impact from seasonal weather anomalies.
              </p>
            </div>
            <DataBadge status="VERIFIED" compact />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0B0F15] text-[#94A3B8] border-b border-[#233041]">
                <tr>
                  <th className="p-3">Biophysical Parameter</th>
                  <th className="p-3">Treated Zone (Micro-Catchment 4E2B5c-09)</th>
                  <th className="p-3">Untreated Control Zone (Adjacent Ridge)</th>
                  <th className="p-3">Net Attributable Effect</th>
                  <th className="p-3">Scientific Attribution Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#233041]">
                {controlSiteComparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#182230]/40 transition-colors">
                    <td className="p-3 font-semibold text-[#F1F5F9]">{row.parameter}</td>
                    <td className="p-3 text-[#10B981] font-bold">{row.interventionZone}</td>
                    <td className="p-3 text-[#94A3B8]">{row.controlZone}</td>
                    <td className="p-3 text-[#2DD4BF] font-bold">{row.deltaAttributable}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.statusColor} bg-black/40 border border-white/10`}>
                        {row.attributionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Dug-Well Telemetry Table */}
      {activeTab === 'GROUNDWATER' && (
        <div className="glass-panel rounded-2xl p-6 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
            <div>
              <h3 className="text-sm font-bold text-[#F1F5F9] font-sans flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#38BDF8]" />
                In-Situ Open Dug-Well Ground-Truth Telemetry
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                Physical tape & acoustic sounding measurements recorded by Ground Water Survey & Development Agency (GSDA).
              </p>
            </div>
            <DataBadge status="VERIFIED" source="GSDA Well Registry" compact />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataset.wells.map((well) => (
              <div key={well.id} className="p-4 bg-[#0B0F15] rounded-xl border border-[#233041] space-y-2">
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span className="font-bold text-[#2DD4BF]">{well.code}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                    {well.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#F1F5F9]">{well.farmerName}</div>
                <div className="text-[11px] text-[#94A3B8]">{well.village} ({well.latitude.toFixed(3)}°N, {well.longitude.toFixed(3)}°E)</div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#233041] text-[11px]">
                  <div>
                    <span className="text-[#94A3B8]">2021 Baseline:</span>
                    <div className="text-[#F43F5E] font-bold">{well.baselineWaterTableM}m BGL</div>
                  </div>
                  <div>
                    <span className="text-[#94A3B8]">2026 Current:</span>
                    <div className="text-[#10B981] font-bold">{well.currentWaterTableM}m BGL</div>
                  </div>
                </div>

                <div className="p-2 rounded bg-[#182230] text-center text-[#2DD4BF] font-bold">
                  Net Groundwater Lift: +{well.netRecoveryM}m Lift
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
