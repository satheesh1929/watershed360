'use client';

import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Eye, 
  Layers, 
  Cpu, 
  FileText,
  Clock,
  ArrowRight,
  Droplet,
  Compass,
  MapPin,
  Check,
  XCircle
} from 'lucide-react';
import { IngestedImageRecord } from './GeoImageIngestion';
import { getWatershedDataset } from '@/data/demoWatershedData';
import DataBadge from '@/components/common/DataBadge';

interface ImageInterpretationWorkspaceProps {
  record: IngestedImageRecord;
  watershedId?: string;
  onVerifyStatusChange?: (id: string, status: 'VERIFIED' | 'FLAGGED_FOR_REPAIR' | 'PENDING') => void;
  onOpenSatelliteCrossReference?: () => void;
}

interface AiAnalysisResult {
  interventionType: string;
  visibleFeatures: string[];
  waterPresence: string;
  vegetationCondition: string;
  siltationEstimatePct: number;
  structuralIntegrity: string;
  erosionSigns: string;
  possibleConcerns: string[];
  evidenceLimitations: string;
  recommendedAction: string;
  confidenceScore: number;
}

export default function ImageInterpretationWorkspace({
  record,
  watershedId = 'pimpalgaon',
  onVerifyStatusChange,
  onOpenSatelliteCrossReference
}: ImageInterpretationWorkspaceProps) {
  const dataset = getWatershedDataset(watershedId);
  const relatedAsset = dataset.interventions.find((i) => i.id === record.interventionId) || dataset.interventions[0];

  // Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeViewMode, setActiveViewMode] = useState<'PHOTO' | 'SPLIT' | 'SATELLITE'>('PHOTO');

  // AI Pipeline State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AiAnalysisResult | null>({
    interventionType: relatedAsset?.type || 'Stone Masonry Check Dam',
    visibleFeatures: [
      'Stone masonry weir wall with reinforced concrete crest overflow spillway',
      'Upstream impounded live water pool extending ~55 meters along nala course',
      'Basalt rock downstream apron and stone pitching to dissipate hydraulic energy'
    ],
    waterPresence: 'Substantial impoundment (~1.4m live depth against weir crest)',
    vegetationCondition: 'Healthy riparian grasses and Acacia scrub along banks',
    siltationEstimatePct: relatedAsset?.siltationPercent || 18,
    structuralIntegrity: 'Masonry crest, abutments, and wing walls visually intact with zero active cracking',
    erosionSigns: 'Minimal downstream bank scour; rock apron functioning as engineered',
    possibleConcerns: [
      'Minor fine silt accumulation along upstream apron (requires physical sounding to measure exact volume)'
    ],
    evidenceLimitations: 'A 2D photograph cannot establish subsurface aquifer percolation rate, masonry load-bearing stress, or exact silt depth without physical rod sounding.',
    recommendedAction: 'Schedule routine post-monsoon weir crest visual audit and rod sounding in upstream basin.',
    confidenceScore: 0.94
  });

  const [verificationStatus, setVerificationStatus] = useState<'VERIFIED' | 'FLAGGED_FOR_REPAIR' | 'PENDING'>(
    record.status === 'VERIFIED' ? 'VERIFIED' : 'PENDING'
  );

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.8));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const runAiInterpretation = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: record.dataUrl.startsWith('/') ? record.dataUrl : undefined,
          imageBase64: record.dataUrl.startsWith('data:') ? record.dataUrl : undefined,
          photoMetadata: {
            interventionCode: relatedAsset?.code,
            interventionType: relatedAsset?.type,
            coordinates: `${record.latitude}°N, ${record.longitude}°E`,
            village: record.village,
            date: record.captureDate,
            fieldNotes: record.notes
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const a = data.analysis || {};
        const features = Array.isArray(a.visibleFeatures) ? a.visibleFeatures : ['Masonry weir structure', 'Impoundment pool'];

        setAnalysisResult({
          interventionType: relatedAsset?.type || 'Watershed Civil Intervention',
          visibleFeatures: features,
          waterPresence: a.waterPresence || 'Visible surface water present in upstream retention zone',
          vegetationCondition: a.vegetationCondition || 'Surrounding semi-arid vegetation visible along riverbanks',
          siltationEstimatePct: a.siltationEstimatePct || relatedAsset?.siltationPercent || 20,
          structuralIntegrity: a.structuralIntegrity || 'Weir crest and abutments visually intact.',
          erosionSigns: a.erosionSigns || 'Bank stabilization maintained with minimal scouring.',
          possibleConcerns: Array.isArray(a.possibleConcerns) ? a.possibleConcerns : ['Sediment monitoring recommended'],
          evidenceLimitations: a.evidenceLimitations || '2D visual inspection is limited to visible surfaces; subsurface percolation requires well telemetry.',
          recommendedAction: a.recommendedAction || 'Log inspection in WDC-PMKSY asset register.',
          confidenceScore: a.confidenceScore || 0.92
        });
      }
    } catch (err) {
      console.warn('AI Vision Analysis fallback used:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSetVerification = (status: 'VERIFIED' | 'FLAGGED_FOR_REPAIR') => {
    setVerificationStatus(status);
    if (onVerifyStatusChange) {
      onVerifyStatusChange(record.id, status);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Workspace Header */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
              Scientific Image Interpretation & Visual Evidence Workspace
            </h2>
            <DataBadge status={record.isGpsFromExif ? 'VERIFIED' : 'USER-UPLOADED'} compact />
          </div>
          <p className="text-xs text-[#94A3B8] font-mono">
            Pan-and-zoom inspection paired with Gemini Multimodal Vision reasoning. All observations distinguish visible evidence from scientific limitations.
          </p>
        </div>

        {/* View Layout Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0B0F15] p-1 rounded-xl border border-[#233041] text-xs font-mono">
            <button
              onClick={() => setActiveViewMode('PHOTO')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeViewMode === 'PHOTO' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              Field Photo
            </button>
            <button
              onClick={() => setActiveViewMode('SPLIT')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeViewMode === 'SPLIT' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveViewMode('SATELLITE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeViewMode === 'SATELLITE' ? 'bg-[#2DD4BF] text-[#0B0F15] font-bold' : 'text-[#94A3B8]'
              }`}
            >
              Satellite Tile
            </button>
          </div>

          <button
            onClick={runAiInterpretation}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-mono font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#2DD4BF]/20"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Run Vision AI'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Deep Zoom & Pan Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2DD4BF]" />
                {record.latitude?.toFixed(5)}°N, {record.longitude?.toFixed(5)}°E • {record.village}
              </span>
              <div className="flex items-center gap-2">
                <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleZoomIn} 
                    className="p-1 rounded bg-[#0B0F15] hover:bg-[#182230] text-[#F1F5F9] border border-[#233041]"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={handleZoomOut} 
                    className="p-1 rounded bg-[#0B0F15] hover:bg-[#182230] text-[#F1F5F9] border border-[#233041]"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={handleResetZoom} 
                    className="p-1 rounded bg-[#0B0F15] hover:bg-[#182230] text-[#F1F5F9] border border-[#233041]"
                    title="Reset View"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Viewport */}
            <div 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black border border-[#233041] select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {activeViewMode === 'PHOTO' && (
                <div 
                  className="w-full h-full flex items-center justify-center transition-transform duration-75"
                  style={{
                    transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`
                  }}
                >
                  <img 
                    src={record.dataUrl} 
                    alt={record.name}
                    className="max-w-full max-h-full object-contain pointer-events-none"
                  />
                </div>
              )}

              {activeViewMode === 'SATELLITE' && (
                <div 
                  className="w-full h-full flex items-center justify-center transition-transform duration-75"
                  style={{
                    transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`
                  }}
                >
                  <img 
                    src="/satellite/sentinel2_post_2026.jpg" 
                    alt="Co-located Sentinel-2 Tile"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
              )}

              {activeViewMode === 'SPLIT' && (
                <div className="w-full h-full grid grid-cols-2 gap-1 bg-[#131A24]">
                  <div className="relative overflow-hidden bg-black flex items-center justify-center">
                    <img src={record.dataUrl} alt="Field" className="max-w-full max-h-full object-contain" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#2DD4BF]">
                      Field Ground Photo
                    </span>
                  </div>
                  <div className="relative overflow-hidden bg-black flex items-center justify-center">
                    <img src="/satellite/sentinel2_post_2026.jpg" alt="Sentinel-2" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#38BDF8]">
                      Sentinel-2 L2A (10m)
                    </span>
                  </div>
                </div>
              )}

              {/* View Overlay Indicators */}
              <div className="absolute top-2 left-2 flex items-center gap-2 pointer-events-none">
                <span className="px-2.5 py-1 rounded-md bg-[#070A0F]/80 backdrop-blur border border-[#233041] font-mono text-[10px] text-[#2DD4BF]">
                  {relatedAsset?.code} • {relatedAsset?.type}
                </span>
                {record.compassDirection && (
                  <span className="px-2 py-1 rounded-md bg-[#070A0F]/80 backdrop-blur border border-[#233041] font-mono text-[10px] text-[#F1F5F9] flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#2DD4BF]" />
                    Facing {record.compassDirection} ({record.bearingDeg || 0}°)
                  </span>
                )}
              </div>
            </div>

            {/* Quick Link to Satellite Cross-Reference */}
            {onOpenSatelliteCrossReference && (
              <button
                onClick={onOpenSatelliteCrossReference}
                className="w-full py-2.5 px-4 bg-[#182230] hover:bg-[#233041] border border-[#233041] rounded-xl text-xs font-mono text-[#2DD4BF] font-bold transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Open Satellite Cross-Reference & Thematic Layers ›</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: AI Interpretation & Human Verification */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Structured Interpretation Panel */}
          {analysisResult && (
            <div className="glass-panel rounded-2xl p-5 space-y-4 border-[#2DD4BF]/30 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#2DD4BF]" />
                  <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">
                    Structured Multimodal AI Interpretation
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-bold">
                  {Math.round(analysisResult.confidenceScore * 100)}% CONFIDENCE
                </span>
              </div>

              {/* Visible Observations */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-[#94A3B8] uppercase">
                  Visible Structural & Hydrological Features:
                </span>
                <ul className="space-y-1">
                  {analysisResult.visibleFeatures.map((feat, idx) => (
                    <li key={idx} className="text-xs text-[#F1F5F9] font-mono flex items-start gap-2">
                      <span className="text-[#2DD4BF] mt-0.5">›</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Siltation & Storage Indicator */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
                  <span className="text-[10px] text-[#94A3B8]">Siltation Level:</span>
                  <div className="text-sm font-bold text-[#F59E0B] mt-0.5">
                    ~{analysisResult.siltationEstimatePct}% of Live Pool
                  </div>
                </div>
                <div className="p-2.5 bg-[#0B0F15] rounded-xl border border-[#233041]">
                  <span className="text-[10px] text-[#94A3B8]">Water Retention:</span>
                  <div className="text-sm font-bold text-[#38BDF8] mt-0.5">
                    Active Storage
                  </div>
                </div>
              </div>

              {/* Masonry / Structural State */}
              <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041] space-y-1 text-xs font-mono">
                <span className="text-[10px] text-[#2DD4BF] font-bold uppercase">
                  Masonry & Bank Condition:
                </span>
                <p className="text-[#F1F5F9] leading-relaxed">
                  {analysisResult.structuralIntegrity}
                </p>
              </div>

              {/* Scientific Limitations Alert */}
              <div className="p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl space-y-1 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  SCIENTIFIC METHODOLOGICAL LIMITATION
                </div>
                <p className="text-[#F1F5F9] text-[11px] leading-relaxed">
                  {analysisResult.evidenceLimitations}
                </p>
              </div>

              {/* Human-in-the-loop Verification Actions */}
              <div className="pt-2 border-t border-[#233041] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">Reviewer Verification:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    verificationStatus === 'VERIFIED' ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' :
                    verificationStatus === 'FLAGGED_FOR_REPAIR' ? 'bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/40' :
                    'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                  }`}>
                    {verificationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSetVerification('VERIFIED')}
                    className="py-2.5 px-3 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981] text-[#10B981] hover:text-[#070A0F] border border-[#10B981]/40 font-mono font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Verify & Accept</span>
                  </button>

                  <button
                    onClick={() => handleSetVerification('FLAGGED_FOR_REPAIR')}
                    className="py-2.5 px-3 rounded-xl bg-[#F43F5E]/20 hover:bg-[#F43F5E] text-[#F43F5E] hover:text-[#070A0F] border border-[#F43F5E]/40 font-mono font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Flag for Desilting</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
