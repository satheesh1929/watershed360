'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Eye, 
  Satellite, 
  Layers, 
  ArrowLeftRight, 
  Sparkles, 
  CheckCircle2, 
  UploadCloud,
  FileCheck,
  Compass
} from 'lucide-react';
import GeoImageIngestion, { IngestedImageRecord } from './GeoImageIngestion';
import ImageInterpretationWorkspace from './ImageInterpretationWorkspace';
import SatelliteCrossReference from './SatelliteCrossReference';
import EvidenceGalleryMapLink from './EvidenceGalleryMapLink';
import { getWatershedDataset } from '@/data/demoWatershedData';

interface ResearchImageAnalysisModuleProps {
  watershedId?: string;
  onLocateOnMap?: (lat: number, lng: number, assetId?: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export default function ResearchImageAnalysisModule({
  watershedId = 'pimpalgaon',
  onLocateOnMap,
  onNavigateTab
}: ResearchImageAnalysisModuleProps) {
  const dataset = getWatershedDataset(watershedId);

  // Sub-tab / Stage State
  const [activeStage, setActiveStage] = useState<'INGESTION' | 'WORKSPACE' | 'CROSS_REF' | 'GALLERY'>('WORKSPACE');
  const [customRecords, setCustomRecords] = useState<IngestedImageRecord[]>([]);

  // Default active record for inspection
  const [selectedRecord, setSelectedRecord] = useState<IngestedImageRecord>({
    id: dataset.evidence[0]?.id || 'pk-ev-01',
    name: dataset.evidence[0]?.caption || 'Pimpalgaon Check Dam Field Inspection',
    dataUrl: dataset.evidence[0]?.photoUrl || '/evidence/cd01.jpg',
    captureDate: dataset.evidence[0]?.exif.timestamp.split('T')[0] || '2026-08-16',
    latitude: dataset.evidence[0]?.exif.latitude || 19.1852,
    longitude: dataset.evidence[0]?.exif.longitude || 74.6954,
    altitudeMeters: dataset.evidence[0]?.exif.altitudeMeters || 585,
    bearingDeg: dataset.evidence[0]?.exif.bearingDeg || 135,
    compassDirection: dataset.evidence[0]?.exif.compassDirection || 'SE',
    cameraMake: 'Trimble',
    cameraModel: dataset.evidence[0]?.exif.deviceModel || 'TDC600 GNSS Handheld',
    isGpsFromExif: true,
    village: dataset.stats.taluka.split('/')[0]?.trim() || 'Pimpalgaon-Khadak',
    interventionId: dataset.evidence[0]?.relatedInterventionId || 'pk-cd-01',
    observerName: 'Er. B. Deshmukh (Watershed Officer)',
    notes: dataset.evidence[0]?.aiObservation.conditionSummary || 'Masonry weir crest intact with 1.4m live surface water retention.',
    status: 'VERIFIED'
  });

  const handleImageIngested = (record: IngestedImageRecord) => {
    setCustomRecords((prev) => [record, ...prev]);
    setSelectedRecord(record);
    setActiveStage('WORKSPACE');
  };

  const handleRecordSelect = (record: IngestedImageRecord) => {
    setSelectedRecord(record);
    setActiveStage('WORKSPACE');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-[1500px] mx-auto pb-14">
      {/* Flagship Workflow Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131A24] border border-[#233041] rounded-2xl p-2 sm:px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {/* Stage 1: Ingestion */}
          <button
            onClick={() => setActiveStage('INGESTION')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
              activeStage === 'INGESTION'
                ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] shadow-lg shadow-[#2DD4BF]/20'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#182230]'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>1. Geo-Photo Ingestion</span>
          </button>

          {/* Stage 2: Multimodal Vision Workspace */}
          <button
            onClick={() => setActiveStage('WORKSPACE')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
              activeStage === 'WORKSPACE'
                ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] shadow-lg shadow-[#2DD4BF]/20'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#182230]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2. Vision & Pan-Zoom Workspace</span>
          </button>

          {/* Stage 3: Satellite Cross-Reference */}
          <button
            onClick={() => setActiveStage('CROSS_REF')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
              activeStage === 'CROSS_REF'
                ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] shadow-lg shadow-[#2DD4BF]/20'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#182230]'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>3. Satellite Cross-Reference</span>
          </button>

          {/* Stage 4: Evidence Gallery & Timeline */}
          <button
            onClick={() => setActiveStage('GALLERY')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
              activeStage === 'GALLERY'
                ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] shadow-lg shadow-[#2DD4BF]/20'
                : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#182230]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4. Evidence Ledger & Map Links</span>
          </button>
        </div>

        {/* Catchment Context Tag */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-mono text-[#94A3B8]">
          <span className="hidden sm:inline">TARGET AREA:</span>
          <span className="text-[#2DD4BF] font-bold px-2.5 py-1 rounded-lg bg-[#0B0F15] border border-[#233041]">
            {dataset.stats.code}
          </span>
        </div>
      </div>

      {/* Active Stage Render */}
      {activeStage === 'INGESTION' && (
        <GeoImageIngestion
          watershedId={watershedId}
          onImageIngested={handleImageIngested}
        />
      )}

      {activeStage === 'WORKSPACE' && (
        <ImageInterpretationWorkspace
          record={selectedRecord}
          watershedId={watershedId}
          onOpenSatelliteCrossReference={() => setActiveStage('CROSS_REF')}
        />
      )}

      {activeStage === 'CROSS_REF' && (
        <SatelliteCrossReference
          record={selectedRecord}
          watershedId={watershedId}
          onOpenSwipeComparison={() => {
            if (onNavigateTab) onNavigateTab('analysis');
          }}
        />
      )}

      {activeStage === 'GALLERY' && (
        <EvidenceGalleryMapLink
          customRecords={customRecords}
          watershedId={watershedId}
          onSelectRecordForInspection={handleRecordSelect}
          onLocateOnMap={onLocateOnMap}
        />
      )}
    </div>
  );
}
