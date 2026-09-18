'use client';

import React from 'react';
import { Intervention } from '@/types/watershed';
import { demoEvidence } from '@/data/demoWatershedData';
import { 
  X, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Camera, 
  Cpu, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';

interface FeatureInspectorProps {
  feature: Intervention;
  onClose: () => void;
  onVerify: (status: 'VERIFIED_ACTIVE' | 'MAINTENANCE_REQUIRED') => void;
}

export default function FeatureInspector({
  feature,
  onClose,
  onVerify
}: FeatureInspectorProps) {
  const matchingEvidence = demoEvidence.find((e) => e.relatedInterventionId === feature.id);

  return (
    <div className="fixed inset-x-0 bottom-0 max-h-[85vh] md:max-h-full rounded-t-3xl md:rounded-none md:relative md:inset-auto md:w-96 bg-[#131A24]/95 backdrop-blur-xl border-t md:border-t-0 md:border-l border-[#233041] flex flex-col justify-between p-4 sm:p-5 overflow-y-auto z-50 md:z-30 select-none shadow-2xl animate-fadeIn">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-2 border-b border-[#233041]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#2DD4BF] bg-[#0B0F15] px-2.5 py-0.5 rounded-lg border border-[#233041]">
                {feature.code}
              </span>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                Strahler Order {feature.streamOrder}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#F1F5F9] font-sans mt-1.5 leading-snug">
              {feature.name}
            </h3>
            <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
              Type: {feature.type}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] rounded-lg hover:bg-[#1E2C3D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Health Status & Siltation Gauge Pill */}
        <div className="bg-[#0B0F15] p-3.5 rounded-xl border border-[#233041] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Structural Health State</div>
            <div className={`text-xs font-mono font-bold mt-0.5 ${
              feature.status === 'VERIFIED_ACTIVE' ? 'text-[#2DD4BF]' :
              feature.status === 'MAINTENANCE_REQUIRED' ? 'text-[#F43F5E]' : 'text-[#F59E0B]'
            }`}>
              {feature.status.replace('_', ' ')}
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <div className="text-right">
              <div className="text-[10px] text-[#94A3B8]">Siltation</div>
              <div className={`text-sm font-bold ${feature.siltationPercent > 40 ? 'text-[#F43F5E]' : 'text-[#2DD4BF]'}`}>
                {feature.siltationPercent}%
              </div>
            </div>
            {/* Mini visual indicator bar */}
            <div className="w-2 h-8 rounded-full bg-[#182230] overflow-hidden flex flex-col justify-end">
              <div 
                className={`w-full ${feature.siltationPercent > 40 ? 'bg-[#F43F5E]' : 'bg-[#2DD4BF]'}`} 
                style={{ height: `${feature.siltationPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Technical Engineering Specifications */}
        <div className="space-y-2 bg-[#0B0F15] p-3.5 rounded-xl border border-[#233041] text-xs font-mono">
          <div className="text-[10px] text-[#94A3B8] uppercase font-bold border-b border-[#233041] pb-1.5 flex items-center justify-between">
            <span>Hydraulic Parameters</span>
            <span className="text-[#2DD4BF]">GEOREFERENCED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Coordinates:</span>
            <span className="text-[#F1F5F9] font-medium">{feature.latitude.toFixed(4)}°N, {feature.longitude.toFixed(4)}°E</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Storage Live Volume:</span>
            <span className="text-[#38BDF8] font-bold">{feature.capacityTcm} TCM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Catchment Intercepted:</span>
            <span className="text-[#F1F5F9] font-medium">{feature.catchmentAreaHa} Ha</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Construction Year:</span>
            <span className="text-[#F1F5F9] font-medium">{feature.constructionYear}</span>
          </div>
        </div>

        {/* Field Photo & AI Telemetry Observation */}
        {matchingEvidence ? (
          <div className="space-y-2.5 border-t border-[#233041] pt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#F1F5F9] flex items-center gap-1.5 font-sans">
                <Camera className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Geotagged Photo Evidence
              </span>
              <span className="text-[10px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded border border-[#2DD4BF]/30">
                ±{matchingEvidence.exif.accuracyMeters}m GNSS
              </span>
            </div>

            <div className="h-44 rounded-xl bg-[#0B0F15] border border-[#233041] overflow-hidden relative group">
              <img 
                src={matchingEvidence.photoUrl} 
                alt={matchingEvidence.caption} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-2 left-2 bg-[#0B0F15]/90 px-2 py-0.5 rounded text-[10px] font-mono text-[#2DD4BF] border border-[#233041]">
                AI Bounding Box: Active (Demo)
              </div>
              <div className="absolute bottom-2 left-2 bg-[#0B0F15]/90 px-2 py-0.5 rounded text-[10px] font-mono text-[#F1F5F9] border border-[#233041]">
                {matchingEvidence.exif.timestamp.split('T')[0]} • {matchingEvidence.exif.deviceModel}
              </div>
            </div>

            {/* AI Diagnosis */}
            <div className="p-3 bg-[#182230] rounded-xl border border-[#233041] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#F1F5F9]">
                <span className="flex items-center gap-1.5 font-sans">
                  <Cpu className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  AI Structural Inference (Demo)
                </span>
                <span className="text-[#2DD4BF] font-mono text-[11px] font-bold">
                  {Math.round(matchingEvidence.aiObservation.confidence * 100)}% Conf
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono leading-relaxed">
                {matchingEvidence.aiObservation.conditionSummary}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-[#0B0F15] border border-[#233041] text-center text-xs font-mono text-[#94A3B8]">
            <Camera className="w-4 h-4 mx-auto mb-1 text-[#64748B]" />
            Satellite remote sensing verified. Mobile ground-truth survey pending.
          </div>
        )}
      </div>

      {/* Human In The Loop Action Panel */}
      <div className="pt-4 border-t border-[#233041] space-y-2">
        <div className="text-[10px] font-mono text-[#94A3B8] text-center uppercase font-bold">
          Field Verification Decision (Audit Log)
        </div>
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <button
            onClick={() => onVerify('VERIFIED_ACTIVE')}
            className="py-2.5 px-3 bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 text-[#2DD4BF] rounded-xl font-bold hover:bg-[#2DD4BF]/25 transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm shadow-[#2DD4BF]/10"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Active
          </button>
          <button
            onClick={() => onVerify('MAINTENANCE_REQUIRED')}
            className="py-2.5 px-3 bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[#F43F5E] rounded-xl font-bold hover:bg-[#F43F5E]/25 transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm shadow-[#F43F5E]/10"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Flag Siltation
          </button>
        </div>
      </div>
    </div>
  );
}
