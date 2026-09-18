'use client';

import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Download, 
  Smartphone, 
  Server, 
  Code, 
  ExternalLink, 
  Copy, 
  Check, 
  Globe, 
  Layers, 
  QrCode, 
  Sparkles,
  ShieldCheck,
  FileCode,
  Laptop
} from 'lucide-react';
import { demoInterventions, watershedStats, demoPriorityZones } from '@/data/demoWatershedData';

interface SoftwareAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchLeafletMode?: () => void;
}

export default function SoftwareAccessModal({ isOpen, onClose, onLaunchLeafletMode }: SoftwareAccessModalProps) {
  const [activeTab, setActiveTab] = useState<'qgis' | 'mobile' | 'python' | 'export' | 'leaflet'>('leaflet');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadGeoJson = () => {
    const geojson = {
      type: 'FeatureCollection',
      name: 'Watershed360_4E2B5c09_Interventions',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: demoInterventions.map(i => ({
        type: 'Feature',
        properties: {
          id: i.id,
          code: i.code,
          name: i.name,
          type: i.type,
          streamOrder: i.streamOrder,
          status: i.status,
          capacityTcm: i.capacityTcm,
          catchmentHa: i.catchmentAreaHa,
          year: i.constructionYear,
          siltationPct: i.siltationPercent
        },
        geometry: {
          type: 'Point',
          coordinates: [i.longitude, i.latitude]
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watershed-4E2B5c09-interventions.geojson`;
    a.click();
  };

  const handleDownloadKml = () => {
    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Watershed360 - Micro-Catchment 4E2B5c-09</name>
    <description>Mula-Pravara Micro-Watershed (1,842.5 Ha) - WDC-PMKSY 2.0 Sanctioned Interventions</description>
    <Folder>
      <name>Sanctioned Interventions</name>
      ${demoInterventions.map(i => `
      <Placemark>
        <name>${i.code}: ${i.name}</name>
        <description>Type: ${i.type}&#10;Status: ${i.status}&#10;Capacity: ${i.capacityTcm} TCM&#10;Catchment: ${i.catchmentAreaHa} Ha</description>
        <Point>
          <coordinates>${i.longitude},${i.latitude},0</coordinates>
        </Point>
      </Placemark>`).join('')}
    </Folder>
  </Document>
</kml>`;

    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watershed-4E2B5c09-bundle.kml`;
    a.click();
  };

  const pythonSnippet = `# Watershed360 Python Data Science SDK
import watershed360 as ws
from watershed360.raster import SentinelEngine

# Authenticate & Ingest Catchment 4E2B5c-09
client = ws.Client(api_key="ws_live_auth_98f4b7a12")
catchment = client.get_catchment("4E2B5c-09")

# Pull calibrated Sentinel-2 Level-2A surface reflectance
ndvi_series = catchment.compute_ndvi_phenology(
    baseline_year=2021, 
    outcome_year=2026,
    cloud_mask_threshold=0.10
)

print(f"Mean NDVI Delta: +{catchment.stats.mean_ndvi_delta}")
print(f"Active Water Spread: {catchment.stats.water_spread_ha} Ha")

# Export to GeoPandas dataframe for custom spatial modeling
gdf = catchment.to_geopandas()
gdf.to_file("watershed_4E2B5c09.gpkg", layer="interventions", driver="GPKG")`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#131A24] border border-[#2DD4BF]/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-fadeIn">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#233041] flex items-center justify-between bg-[#131A24]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 text-[#2DD4BF]">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F1F5F9] font-sans">
                Software Access & Deployment Gateways
              </h2>
              <p className="text-xs font-mono text-[#94A3B8]">
                Enterprise GIS Bridges, Python SDK, Mobile Field Surveyor PWA & Layer Exports
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-[#F1F5F9] rounded-lg hover:bg-[#182230] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#233041] bg-[#0B0F15] px-4 pt-2 gap-1 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('leaflet')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === 'leaflet'
                ? 'bg-[#131A24] border-[#233041] text-[#2DD4BF] font-bold border-b-transparent'
                : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Globe className="w-4 h-4 text-[#38BDF8]" />
            <span>Interactive Web GIS</span>
          </button>

          <button
            onClick={() => setActiveTab('qgis')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === 'qgis'
                ? 'bg-[#131A24] border-[#233041] text-[#2DD4BF] font-bold border-b-transparent'
                : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Server className="w-4 h-4 text-[#2DD4BF]" />
            <span>QGIS / ArcGIS Bridge</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === 'mobile'
                ? 'bg-[#131A24] border-[#233041] text-[#2DD4BF] font-bold border-b-transparent'
                : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#F59E0B]" />
            <span>Mobile Surveyor App</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === 'python'
                ? 'bg-[#131A24] border-[#233041] text-[#2DD4BF] font-bold border-b-transparent'
                : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Code className="w-4 h-4 text-[#10B981]" />
            <span>Python SDK</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 border-t border-x ${
              activeTab === 'export'
                ? 'bg-[#131A24] border-[#233041] text-[#2DD4BF] font-bold border-b-transparent'
                : 'border-transparent text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Download className="w-4 h-4 text-[#F43F5E]" />
            <span>GIS Layer Exporter</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* 1. Leaflet Real-world Satellite GIS Mode */}
          {activeTab === 'leaflet' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-[#0B0F15] rounded-xl border border-[#233041] flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#F1F5F9] font-sans flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#38BDF8]" />
                    Real-World Satellite Photogrammetry View
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1 font-mono">
                    Seamlessly toggle into interactive Leaflet GIS view with live OpenStreetMap/ESRI world imagery tiles.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onLaunchLeafletMode) onLaunchLeafletMode();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white font-bold hover:brightness-110 shadow-lg shadow-[#38BDF8]/20 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Launch Explorer GIS
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
                  <span className="text-[#38BDF8] font-bold block mb-1">ESRI Satellite Layer</span>
                  <p className="text-[#94A3B8] text-[11px]">High-resolution true-color satellite surface tiles for Maharashtra basin.</p>
                </div>
                <div className="p-3.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
                  <span className="text-[#2DD4BF] font-bold block mb-1">Vector Overlay Mesh</span>
                  <p className="text-[#94A3B8] text-[11px]">Catchment boundary, 8 geocoded check dams, and Strahler drainage orders.</p>
                </div>
                <div className="p-3.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
                  <span className="text-[#10B981] font-bold block mb-1">Instant Interactive Popups</span>
                  <p className="text-[#94A3B8] text-[11px]">Click any check dam or pond to inspect capacity TCM and siltation status.</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. QGIS / ArcGIS Bridge */}
          {activeTab === 'qgis' && (
            <div className="space-y-4 font-mono text-xs">
              <p className="text-[#94A3B8] leading-relaxed">
                Connect your desktop GIS suite (<span className="text-[#F1F5F9] font-bold">QGIS 3.x, ArcGIS Pro, Google Earth Pro</span>) directly to Watershed360 via open OGC WMS/WFS/GeoJSON live sync services:
              </p>

              <div className="space-y-3">
                <div className="bg-[#0B0F15] p-3.5 rounded-xl border border-[#233041] space-y-1.5">
                  <div className="flex items-center justify-between text-[#2DD4BF] font-bold">
                    <span>1. WFS Vector Stream Endpoint (GeoJSON Features)</span>
                    <button
                      onClick={() => handleCopy('https://api.watershed360.gov.in/v1/ogc/wfs?catchment=4E2B5c-09&layer=interventions', 'wfs')}
                      className="text-[11px] text-[#94A3B8] hover:text-[#F1F5F9] flex items-center gap-1"
                    >
                      {copiedKey === 'wfs' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === 'wfs' ? 'Copied' : 'Copy URL'}
                    </button>
                  </div>
                  <code className="text-[11px] text-[#94A3B8] block overflow-x-auto">
                    https://api.watershed360.gov.in/v1/ogc/wfs?catchment=4E2B5c-09&amp;layer=interventions
                  </code>
                </div>

                <div className="bg-[#0B0F15] p-3.5 rounded-xl border border-[#233041] space-y-1.5">
                  <div className="flex items-center justify-between text-[#38BDF8] font-bold">
                    <span>2. WMS Raster Tile Endpoint (Sentinel-2 NDVI Color-Ramp)</span>
                    <button
                      onClick={() => handleCopy('https://api.watershed360.gov.in/v1/ogc/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=s2_ndvi_2026', 'wms')}
                      className="text-[11px] text-[#94A3B8] hover:text-[#F1F5F9] flex items-center gap-1"
                    >
                      {copiedKey === 'wms' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === 'wms' ? 'Copied' : 'Copy URL'}
                    </button>
                  </div>
                  <code className="text-[11px] text-[#94A3B8] block overflow-x-auto">
                    https://api.watershed360.gov.in/v1/ogc/wms?SERVICE=WMS&amp;VERSION=1.3.0&amp;REQUEST=GetMap&amp;LAYERS=s2_ndvi_2026
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* 3. Mobile Field Surveyor PWA */}
          {activeTab === 'mobile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-3 bg-[#0B0F15] p-4 rounded-xl border border-[#233041]">
                <h3 className="text-sm font-bold text-[#F59E0B] font-sans flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> Mobile Field PWA App
                </h3>
                <p className="text-[#94A3B8] text-xs leading-relaxed">
                  Field surveyors can install the lightweight progressive web app on Android/iOS with offline SQLite storage, automatic EXIF compass logging, and Trimble GNSS precision lock.
                </p>
                <div className="p-3 bg-[#131A24] rounded-lg border border-[#233041] space-y-1">
                  <div className="text-[10px] text-[#94A3B8] uppercase">PWA Access Link:</div>
                  <div className="text-[#2DD4BF] text-xs font-bold truncate">https://watershed360.gov.in/mobile/survey</div>
                </div>
              </div>

              {/* Simulated QR Code Card */}
              <div className="bg-[#0B0F15] p-4 rounded-xl border border-[#233041] flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
                  {/* Visual QR Code Representation */}
                  <div className="w-full h-full border-4 border-black p-1 grid grid-cols-4 gap-1 bg-white">
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                  </div>
                </div>
                <div className="text-[11px] text-[#F1F5F9] font-bold">Scan to Launch Mobile Camera PWA</div>
                <div className="text-[10px] text-[#94A3B8]">Includes offline GPS lock & AI vision model cache</div>
              </div>
            </div>
          )}

          {/* 4. Python SDK */}
          {activeTab === 'python' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Install via PyPI:</span>
                <button
                  onClick={() => handleCopy('pip install watershed360-sdk geopandas rasterio', 'pypi')}
                  className="text-[11px] text-[#2DD4BF] hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'pypi' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'pypi' ? 'Copied pip command' : 'Copy command'}
                </button>
              </div>
              <div className="p-2.5 bg-[#0B0F15] rounded-xl border border-[#233041] text-[#2DD4BF] font-bold">
                $ pip install watershed360-sdk geopandas rasterio
              </div>

              <div className="relative">
                <pre className="p-4 bg-[#0B0F15] rounded-xl border border-[#233041] text-[#F1F5F9] overflow-x-auto text-[11px] leading-relaxed max-h-60">
                  {pythonSnippet}
                </pre>
                <button
                  onClick={() => handleCopy(pythonSnippet, 'pycode')}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#182230] border border-[#233041] text-[10px] text-[#94A3B8] hover:text-[#F1F5F9] flex items-center gap-1"
                >
                  {copiedKey === 'pycode' ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'pycode' ? 'Copied' : 'Copy Python Code'}
                </button>
              </div>
            </div>
          )}

          {/* 5. GIS Layer Exporter */}
          {activeTab === 'export' && (
            <div className="space-y-4 font-mono text-xs">
              <p className="text-[#94A3B8]">
                Export calibrated spatial packages for Micro-Catchment 4E2B5c-09 in standard geodata containers:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={handleDownloadGeoJson}
                  className="p-4 bg-[#0B0F15] hover:bg-[#182230] border border-[#233041] hover:border-[#2DD4BF] rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#2DD4BF]/15 text-[#2DD4BF]">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-[#F1F5F9] font-sans">GeoJSON Layer Package (.geojson)</div>
                      <div className="text-[10px] text-[#94A3B8]">Includes 8 geocoded structures & attributes</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-[#2DD4BF] group-hover:translate-y-0.5 transition-transform" />
                </div>

                <div 
                  onClick={handleDownloadKml}
                  className="p-4 bg-[#0B0F15] hover:bg-[#182230] border border-[#233041] hover:border-[#38BDF8] rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8]">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-[#F1F5F9] font-sans">Google Earth KML Bundle (.kml)</div>
                      <div className="text-[10px] text-[#94A3B8]">3D boundary and drainage paths</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-[#38BDF8] group-hover:translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
