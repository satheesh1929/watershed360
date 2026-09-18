'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Layers, 
  CheckCircle2, 
  Camera, 
  ShieldCheck, 
  Calendar, 
  Filter, 
  Share2, 
  Mountain,
  Droplets,
  TrendingUp,
  Sparkles,
  Info
} from 'lucide-react';
import { getWatershedDataset } from '@/data/demoWatershedData';
import DataBadge from '@/components/common/DataBadge';

interface AssessmentReportGeneratorProps {
  watershedId?: string;
  onClose?: () => void;
}

export default function AssessmentReportGenerator({
  watershedId = 'pimpalgaon',
  onClose
}: AssessmentReportGeneratorProps) {
  const dataset = getWatershedDataset(watershedId);

  // Configuration Selectors
  const [includeExecutiveSummary, setIncludeExecutiveSummary] = useState(true);
  const [includeMethodology, setIncludeMethodology] = useState(true);
  const [includeGeocodedPhotos, setIncludeGeocodedPhotos] = useState(true);
  const [includeSatelliteChange, setIncludeSatelliteChange] = useState(true);
  const [includeGroundwaterTelemetry, setIncludeGroundwaterTelemetry] = useState(true);
  const [includeRusleModel, setIncludeRusleModel] = useState(true);
  const [includeAuditTrail, setIncludeAuditTrail] = useState(true);
  const [reportTitle, setReportTitle] = useState(`Comprehensive Geospatial Impact Assessment Dossier: ${dataset.stats.code}`);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 200);
  };

  const handleExportJson = () => {
    const reportData = {
      title: reportTitle,
      dateGenerated: new Date().toISOString(),
      catchment: dataset.stats,
      interventions: dataset.interventions,
      wells: dataset.wells,
      evidencePhotos: dataset.evidence,
      priorityZones: dataset.priorityZones,
      provenance: 'WDC-PMKSY 2.0 / Sentinel-2 L2A / Copernicus DEM 30m / GSDA In-Situ Telemetry'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `watershed-report-${dataset.stats.code}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-[1400px] mx-auto pb-14 font-mono text-xs">
      {/* Report Generator Controls Header (Hidden in Print) */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF]">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
                Comprehensive Watershed Assessment Report Generator
              </h2>
              <DataBadge status="VERIFIED" compact />
            </div>
            <p className="text-xs text-[#94A3B8]">
              Assemble official PMKSY-WDC 2.0 technical evaluation dossiers integrating multi-spectral change, geo-coded field evidence, and groundwater lift metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-xl bg-[#182230] hover:bg-[#233041] border border-[#233041] text-xs font-bold text-[#2DD4BF] transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#2DD4BF]/20 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Modular Section Inclusion Checkboxes */}
        <div className="p-4 bg-[#0B0F15] rounded-xl border border-[#233041] space-y-2">
          <span className="text-[10px] text-[#94A3B8] uppercase font-bold">Select Report Dossier Chapters:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { label: 'Executive Summary', state: includeExecutiveSummary, set: setIncludeExecutiveSummary },
              { label: 'Methodology & Data', state: includeMethodology, set: setIncludeMethodology },
              { label: 'Geocoded Photos', state: includeGeocodedPhotos, set: setIncludeGeocodedPhotos },
              { label: 'Satellite Bi-Temporal', state: includeSatelliteChange, set: setIncludeSatelliteChange },
              { label: 'Well Telemetry', state: includeGroundwaterTelemetry, set: setIncludeGroundwaterTelemetry },
              { label: 'RUSLE Soil Loss', state: includeRusleModel, set: setIncludeRusleModel }
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => item.set(!item.state)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  item.state ? 'bg-[#2DD4BF]/15 border-[#2DD4BF] text-[#2DD4BF] font-bold' : 'bg-[#131A24] border-[#233041] text-[#64748B]'
                }`}
              >
                {item.state ? '✓ ' : '✕ '} {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Printable Report Canvas Document */}
      <div className="bg-[#0B0F15] text-[#F1F5F9] border border-[#233041] rounded-2xl p-8 sm:p-12 space-y-8 shadow-2xl print:border-none print:p-0 print:text-black print:bg-white">
        {/* Document Official Header */}
        <div className="border-b-2 border-[#2DD4BF] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#2DD4BF] font-bold uppercase tracking-widest">
              GOVERNMENT OF INDIA • PMKSY-WDC 2.0 EVALUATION CELL
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#F1F5F9] font-sans mt-1 print:text-black">
              {reportTitle}
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1 print:text-gray-600">
              Target Catchment: {dataset.stats.name} ({dataset.stats.code}) • Ahilyanagar District, Maharashtra
            </p>
          </div>
          <div className="text-right text-xs text-[#94A3B8] print:text-gray-600">
            <div>DATE: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div>STATUS: <span className="text-[#10B981] font-bold">OFFICIALLY COMPILED</span></div>
            <div>PROJECTION: EPSG:4326 (WGS 84)</div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        {includeExecutiveSummary && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#2DD4BF] uppercase tracking-wider font-sans border-b border-[#233041] pb-1">
              1. Executive Summary & Key Achievements
            </h3>
            <p className="text-xs text-[#F1F5F9] leading-relaxed print:text-black">
              Under the Pradhan Mantri Krishi Sinchayee Yojana (WDC-PMKSY 2.0), Micro-Catchment 4E2B5c-09 (1,840.0 Ha) in Ahilyanagar District, Maharashtra, underwent comprehensive ridge-to-valley soil-water conservation between FY 2021-22 and FY 2025-26. Implementation of 14 civil structures (masonry check dams, nala bunds, percolation tanks, and continuous contour trenches) resulted in an estimated +36.4 TCM live surface water storage, sustained +4.8m to +8.4m agricultural dug-well recovery, and reduced annual soil loss from 32.6 to 11.8 tons/Ha/year.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center font-mono">
              <div className="p-3 rounded-xl bg-[#131A24] border border-[#233041] print:bg-gray-100 print:text-black">
                <span className="text-[10px] text-[#94A3B8]">Mean NDVI Delta:</span>
                <div className="text-lg font-bold text-[#10B981] mt-0.5">{dataset.stats.meanNdviDelta}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#131A24] border border-[#233041] print:bg-gray-100 print:text-black">
                <span className="text-[10px] text-[#94A3B8]">Water Spread:</span>
                <div className="text-lg font-bold text-[#38BDF8] mt-0.5">{dataset.stats.waterSpreadHa} Ha (+172%)</div>
              </div>
              <div className="p-3 rounded-xl bg-[#131A24] border border-[#233041] print:bg-gray-100 print:text-black">
                <span className="text-[10px] text-[#94A3B8]">Soil Loss Abatement:</span>
                <div className="text-lg font-bold text-[#F59E0B] mt-0.5">-52.8%</div>
              </div>
              <div className="p-3 rounded-xl bg-[#131A24] border border-[#233041] print:bg-gray-100 print:text-black">
                <span className="text-[10px] text-[#94A3B8]">Beneficiary Farmers:</span>
                <div className="text-lg font-bold text-[#2DD4BF] mt-0.5">{dataset.stats.beneficiaryFarmers}</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Methodology & Data Sources */}
        {includeMethodology && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#2DD4BF] uppercase tracking-wider font-sans border-b border-[#233041] pb-1">
              2. Scientific Methodology & Data Sources
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed print:text-gray-700">
              The assessment integrates Sentinel-2 Level-2A Bottom-Of-Atmosphere (BOA) multi-spectral imagery (10m VNIR bands), Copernicus GLO-30 Digital Elevation Model for slope accumulation, and Maharashtra Ground Water Survey & Development Agency (GSDA) benchmark dug-well soundings. Mathematical indices include NDVI = (B8 - B4) / (B8 + B4), NDWI = (B3 - B8) / (B3 + B8), and RUSLE = R × K × LS × C × P.
            </p>
          </div>
        )}

        {/* 3. Civil Intervention Asset Register */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#2DD4BF] uppercase tracking-wider font-sans border-b border-[#233041] pb-1">
            3. Registered Watershed Interventions Ledger
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#131A24] text-[#94A3B8] border-b border-[#233041] print:bg-gray-200 print:text-black">
                <tr>
                  <th className="p-2.5">Asset Code</th>
                  <th className="p-2.5">Structure Type</th>
                  <th className="p-2.5">Coordinates</th>
                  <th className="p-2.5">Capacity</th>
                  <th className="p-2.5">Siltation</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#233041] print:divide-gray-300">
                {dataset.interventions.slice(0, 6).map((item) => (
                  <tr key={item.id}>
                    <td className="p-2.5 font-bold text-[#F1F5F9] print:text-black">{item.code}</td>
                    <td className="p-2.5 text-[#94A3B8] print:text-gray-700">{item.type}</td>
                    <td className="p-2.5 text-[#94A3B8] print:text-gray-700">{item.latitude.toFixed(3)}°N, {item.longitude.toFixed(3)}°E</td>
                    <td className="p-2.5 text-[#38BDF8] font-bold">{item.capacityTcm} TCM</td>
                    <td className={`p-2.5 font-bold ${item.siltationPercent > 40 ? 'text-[#F43F5E]' : 'text-[#10B981]'}`}>
                      {item.siltationPercent}%
                    </td>
                    <td className="p-2.5 text-[#10B981] font-bold">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Geocoded Visual Evidence Appendix */}
        {includeGeocodedPhotos && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#2DD4BF] uppercase tracking-wider font-sans border-b border-[#233041] pb-1">
              4. Geo-Coded Field Evidence Appendix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dataset.evidence.slice(0, 2).map((ev) => (
                <div key={ev.id} className="p-3 bg-[#131A24] rounded-xl border border-[#233041] space-y-2 print:bg-gray-100">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <img src={ev.photoUrl} alt={ev.caption} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-bold text-xs text-[#F1F5F9] print:text-black">{ev.caption}</div>
                  <div className="text-[10px] text-[#94A3B8] print:text-gray-600">
                    GNSS: {ev.exif.latitude.toFixed(4)}°N, {ev.exif.longitude.toFixed(4)}°E • Facing {ev.exif.compassDirection} ({ev.exif.bearingDeg}°)
                  </div>
                  <p className="text-[11px] text-[#64748B] italic print:text-gray-700">{ev.aiObservation.conditionSummary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official Sign-Off Footer */}
        <div className="pt-8 border-t-2 border-[#233041] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#94A3B8] print:text-black">
          <div>
            <div className="font-bold text-[#F1F5F9] print:text-black">Er. P. Deshmukh</div>
            <div>Sub-Divisional Watershed Development Officer</div>
            <div>Ahilyanagar Sub-Division, Maharashtra</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-[#F1F5F9] print:text-black">Dr. K. Ramanathan</div>
            <div>Senior Remote Sensing & Geospatial Analyst</div>
            <div>Watershed360 Technical Cell</div>
          </div>
        </div>
      </div>
    </div>
  );
}
