'use client';

import React, { useState } from 'react';
import { demoDataProviders } from '@/data/demoWatershedData';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  Server,
  Layers,
  FileCheck,
  Code,
  Activity,
  X
} from 'lucide-react';

export default function DataSourcesModule() {
  const [testingPing, setTestingPing] = useState(false);
  const [pingLatencies, setPingLatencies] = useState<Record<string, number>>({
    'dp-01': 118,
    'dp-02': 64,
    'dp-03': 142,
    'dp-04': 88,
    'dp-05': 92
  });
  const [inspectedSchema, setInspectedSchema] = useState<any | null>(null);

  const handleTestPings = () => {
    setTestingPing(true);
    setTimeout(() => {
      setPingLatencies({
        'dp-01': Math.floor(Math.random() * 40) + 95,
        'dp-02': Math.floor(Math.random() * 20) + 55,
        'dp-03': Math.floor(Math.random() * 50) + 120,
        'dp-04': Math.floor(Math.random() * 30) + 75,
        'dp-05': Math.floor(Math.random() * 30) + 80
      });
      setTestingPing(false);
    }, 1200);
  };

  const getStatusBadge = (status: string, id: string) => {
    const latency = pingLatencies[id] || 100;
    if (status === 'PENDING_CREDENTIALS' || status === 'PENDING CREDENTIALS') {
      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5" />
            PENDING CREDENTIALS
          </span>
          <span className="text-[10px] font-mono text-[#2DD4BF] font-semibold">
            PRIMARY TARGET
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          DEV STAND-IN
        </span>
        <span className="text-[10px] font-mono text-[#94A3B8]">
          ~{latency}ms sim
        </span>
      </div>
    );
  };

  const inspectProviderSchema = (provider: any) => {
    setInspectedSchema({
      providerName: provider.name,
      adapter: provider.adapter,
      endpoint: provider.endpoint,
      payloadSample: {
        type: 'FeatureCollection',
        crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
        stac_version: '1.0.0',
        id: 'S2A_MSIL2A_20260828T0542_T43QDB',
        bbox: [74.58, 19.31, 74.67, 19.39],
        properties: {
          datetime: '2026-08-28T05:42:15Z',
          'eo:cloud_cover': 4.2,
          'sat:orbit_state': 'descending',
          processing_level: 'Level-2A (BOA Reflectance)'
        },
        assets: {
          B04: { href: `${provider.endpoint}/B04.tif`, type: 'image/tiff; application=geotiff' },
          B08: { href: `${provider.endpoint}/B08.tif`, type: 'image/tiff; application=geotiff' }
        }
      }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Transparency Notice */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF]">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
                SRISHTI-DRISHTI Ingestion Pipeline & Scientific Provenance
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono leading-relaxed">
              WATERSHED360 ingests and cross-references SRISHTI-DRISHTI as its primary system of record, utilizing calibrated open development stand-ins during evaluation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleTestPings}
              disabled={testingPing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#182230] hover:bg-[#1E2C3D] border border-[#233041] text-xs font-mono text-[#F1F5F9] font-bold transition-all shadow-sm"
              title="Simulated latency check for demo fixture endpoints"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2DD4BF] ${testingPing ? 'animate-spin' : ''}`} />
              {testingPing ? 'Checking Simulated Latency...' : 'Simulated latency check (demo)'}
            </button>
          </div>
        </div>
      </div>

      {/* Non-negotiable Honesty Guarantee Banner */}
      <div className="glass-panel-glow rounded-2xl p-5 flex items-start gap-4">
        <div className="p-2 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 text-[#2DD4BF] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-[#94A3B8] font-mono leading-relaxed space-y-1">
          <span className="font-bold text-[#2DD4BF] block text-sm font-sans">Primary Input vs. Development Stand-In Policy</span>
          <p>
            <strong className="text-[#F1F5F9]">SRISHTI-DRISHTI is the primary system of record.</strong> In accordance with SIH26015 guidelines, WATERSHED360 sits on top as an analytical layer. The national portal adapter is marked <span className="text-[#38BDF8] font-bold">PENDING CREDENTIALS</span>, and open raster layers (Copernicus Sentinel-2, 30m DEM) are explicitly documented as calibrated simulation stand-ins for Micro-Catchment 4E2B5c-09 (Ahmednagar, MH). No simulated numbers are falsely presented as unauthenticated live government APIs.
          </p>
        </div>
      </div>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoDataProviders.map((provider) => (
          <div 
            key={provider.id}
            className={`glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-[#2DD4BF]/50 transition-all duration-300 group hover:scale-[1.01] ${
              provider.status === 'PENDING_CREDENTIALS' ? 'border-[#38BDF8]/40 ring-1 ring-[#38BDF8]/20 bg-gradient-to-br from-[#131A24] via-[#101E2E] to-[#131A24]' : ''
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#F1F5F9] font-sans group-hover:text-[#2DD4BF] transition-colors">{provider.name}</h3>
                    {provider.status === 'PENDING_CREDENTIALS' && (
                      <span className="text-[9px] font-mono font-bold bg-[#38BDF8]/20 text-[#38BDF8] px-2 py-0.5 rounded border border-[#38BDF8]/40">
                        PRIMARY TARGET
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-[#94A3B8]">{provider.type}</span>
                    <span className="text-[#233041]">•</span>
                    <span className="text-xs font-mono text-[#2DD4BF] font-semibold">{provider.cadence}</span>
                  </div>
                </div>
                {getStatusBadge(provider.status, provider.id)}
              </div>

              <p className="text-xs text-[#94A3B8] mb-4 leading-relaxed font-mono">
                {provider.description}
              </p>

              <div className="bg-[#0B0F15] rounded-xl border border-[#233041] p-3.5 space-y-2 mb-4 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Data Resolution:</span>
                  <span className="text-[#F1F5F9] font-semibold">{provider.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Adapter Class:</span>
                  <span className="text-[#2DD4BF] font-bold">{provider.adapter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Last Sync Attempt:</span>
                  <span className="text-[#F1F5F9]">{provider.lastSync}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">License Authority:</span>
                  <span className="text-[#94A3B8]">{provider.license}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#233041] flex items-center justify-between text-xs font-mono">
              <span className="text-[#94A3B8] truncate max-w-[220px]">
                {provider.endpoint}
              </span>
              <button 
                className="flex items-center gap-1.5 text-[#2DD4BF] hover:underline font-bold"
                onClick={() => inspectProviderSchema(provider)}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Inspect STAC Schema</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Production Architecture Blueprint */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-base font-bold text-[#F1F5F9] mb-4 flex items-center gap-2 font-sans">
          <Server className="w-4 h-4 text-[#2DD4BF]" />
          Production Microservices Architecture Blueprint
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 bg-[#0B0F15] border border-[#233041] rounded-xl space-y-1">
            <span className="text-[#2DD4BF] font-bold block mb-1">1. FastAPI Raster Engine</span>
            <p className="text-[#94A3B8] leading-relaxed">
              TiTiler + rasterio on-the-fly NDVI/NDWI computation from Sentinel-2 COGs (Cloud Optimized GeoTIFFs) on AWS Earth Search.
            </p>
          </div>
          <div className="p-4 bg-[#0B0F15] border border-[#233041] rounded-xl space-y-1">
            <span className="text-[#38BDF8] font-bold block mb-1">2. PostGIS Vector DB</span>
            <p className="text-[#94A3B8] leading-relaxed">
              ST_Intersects & ST_DWithin spatial queries for automatic catchment attribution and Strahler stream order generation.
            </p>
          </div>
          <div className="p-4 bg-[#0B0F15] border border-[#233041] rounded-xl space-y-1">
            <span className="text-[#F59E0B] font-bold block mb-1">3. AI Vision Worker (Demo Model)</span>
            <p className="text-[#94A3B8] leading-relaxed">
              PyTorch async worker queue with ONNX runtime for field photograph structural health and siltation demonstration inference.
            </p>
          </div>
        </div>
      </div>

      {/* STAC JSON Schema Inspection Modal */}
      {inspectedSchema && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131A24] border border-[#2DD4BF]/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#2DD4BF]" />
                <h3 className="text-sm font-bold text-[#F1F5F9] font-mono">
                  {inspectedSchema.providerName} • STAC Metadata Payload
                </h3>
              </div>
              <button
                onClick={() => setInspectedSchema(null)}
                className="p-1 text-[#94A3B8] hover:text-[#F1F5F9] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="bg-[#0B0F15] border border-[#233041] rounded-xl p-4 text-[11px] font-mono text-[#2DD4BF] overflow-x-auto max-h-80">
              {JSON.stringify(inspectedSchema.payloadSample, null, 2)}
            </pre>

            <div className="flex justify-end">
              <button
                onClick={() => setInspectedSchema(null)}
                className="px-4 py-2 rounded-xl bg-[#182230] hover:bg-[#1E2C3D] text-xs font-mono text-[#F1F5F9] font-bold"
              >
                Close Schema
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
