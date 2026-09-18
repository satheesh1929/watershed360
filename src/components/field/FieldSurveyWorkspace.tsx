'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  UploadCloud, 
  ShieldCheck, 
  Compass, 
  Calendar, 
  Wifi, 
  WifiOff, 
  Save, 
  Send, 
  History, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { getWatershedDataset } from '@/data/demoWatershedData';
import DataBadge from '@/components/common/DataBadge';

interface FieldSurveyWorkspaceProps {
  watershedId?: string;
  onSurveySubmitted?: (record: any) => void;
}

export interface AuditLogEntry {
  timestamp: string;
  action: string;
  actor: string;
  stage: 'CAPTURED' | 'UPLOADED' | 'METADATA_CHECKED' | 'AI_INTERPRETED' | 'HUMAN_VERIFIED' | 'ACCEPTED';
  notes: string;
}

export default function FieldSurveyWorkspace({
  watershedId = 'pimpalgaon',
  onSurveySubmitted
}: FieldSurveyWorkspaceProps) {
  const dataset = getWatershedDataset(watershedId);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState(dataset.interventions[0]?.id || 'pk-cd-01');
  const [surveyLat, setSurveyLat] = useState(dataset.interventions[0]?.latitude.toFixed(5) || '19.18520');
  const [surveyLng, setSurveyLng] = useState(dataset.interventions[0]?.longitude.toFixed(5) || '74.69540');
  const [surveyDate, setSurveyDate] = useState(new Date().toISOString().split('T')[0]);
  const [surveyTime, setSurveyTime] = useState('10:30');
  const [observerName, setObserverName] = useState('Er. S. Patil (Field Assistant)');
  const [isGpsAcquiring, setIsGpsAcquiring] = useState(false);

  // Checklist State
  const [waterPresence, setWaterPresence] = useState<'DRY' | 'TRICKLE' | 'HALF_CAPACITY' | 'FULL_POOL' | 'SPILLING'>('FULL_POOL');
  const [vegetationStatus, setVegetationStatus] = useState<'HEALTHY_CANOPY' | 'MODERATE' | 'SPARSE' | 'ENCROACHING'>('HEALTHY_CANOPY');
  const [siltationPercent, setSiltationPercent] = useState<number>(18);
  const [structuralDefects, setStructuralDefects] = useState<string[]>([]);
  const [fieldNotes, setFieldNotes] = useState('Routine inspection post-monsoon. Weir wall intact with clean overflow.');
  const [photoPreview, setPhotoPreview] = useState<string | null>('/evidence/cd01.jpg');

  // Offline Draft & Synchronization State
  const [isOnline, setIsOnline] = useState(true);
  const [hasDraftSaved, setHasDraftSaved] = useState(false);

  // Verification Pipeline Stage
  const [currentStage, setCurrentStage] = useState<
    'CAPTURED' | 'UPLOADED' | 'METADATA_CHECKED' | 'AI_INTERPRETED' | 'HUMAN_VERIFIED' | 'ACCEPTED'
  >('HUMAN_VERIFIED');

  // Audit History Log
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([
    {
      timestamp: '2026-08-16 09:45 IST',
      action: 'Field photo captured with GNSS handheld',
      actor: 'Er. S. Patil (Field Assistant)',
      stage: 'CAPTURED',
      notes: 'Trimble TDC600 logged 19.18520°N, 74.69540°E (Accuracy: 1.6m)'
    },
    {
      timestamp: '2026-08-16 10:15 IST',
      action: 'Geotagged image uploaded to Watershed360 sync buffer',
      actor: 'System Ingestion Queue',
      stage: 'UPLOADED',
      notes: 'EXIF APP1 segment verified and cryptographic checksum stamped'
    },
    {
      timestamp: '2026-08-16 10:16 IST',
      action: 'Spatial bounds matched to Micro-Catchment 4E2B5c-09',
      actor: 'Geospatial Validator',
      stage: 'METADATA_CHECKED',
      notes: 'Intersection confirmed with Stream Order 3 nala corridor'
    },
    {
      timestamp: '2026-08-16 10:18 IST',
      action: 'Gemini Multimodal Vision inspection generated',
      actor: 'Gemini 2.5 Flash Vision Agent',
      stage: 'AI_INTERPRETED',
      notes: 'Visible features identified: intact stone weir, rock apron, ~18% silt'
    },
    {
      timestamp: '2026-08-16 14:30 IST',
      action: 'Technical Officer audit and status approval',
      actor: 'Er. P. Deshmukh (Sub-Divisional Watershed Officer)',
      stage: 'HUMAN_VERIFIED',
      notes: 'Visual observations verified. Approved for inclusion in official WDC-PMKSY dossier.'
    }
  ]);

  const handleAcquireGps = () => {
    setIsGpsAcquiring(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSurveyLat(position.coords.latitude.toFixed(5));
          setSurveyLng(position.coords.longitude.toFixed(5));
          setIsGpsAcquiring(false);
        },
        () => {
          // Fallback to active asset coordinates
          const asset = dataset.interventions.find((i) => i.id === selectedAssetId);
          if (asset) {
            setSurveyLat(asset.latitude.toFixed(5));
            setSurveyLng(asset.longitude.toFixed(5));
          }
          setIsGpsAcquiring(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsGpsAcquiring(false);
    }
  };

  const handleToggleDefect = (defect: string) => {
    setStructuralDefects((prev) => 
      prev.includes(defect) ? prev.filter((d) => d !== defect) : [...prev, defect]
    );
  };

  const handleSaveDraft = () => {
    setHasDraftSaved(true);
    setTimeout(() => setHasDraftSaved(false), 3000);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: AuditLogEntry = {
      timestamp: new Date().toLocaleString(),
      action: 'Field record submitted & accepted into spatial analysis ledger',
      actor: observerName,
      stage: 'ACCEPTED',
      notes: `Asset ${selectedAssetId} surveyed. Siltation: ${siltationPercent}%, Water: ${waterPresence}.`
    };

    setAuditLog((prev) => [newEntry, ...prev]);
    setCurrentStage('ACCEPTED');

    if (onSurveySubmitted) {
      onSurveySubmitted({
        selectedAssetId,
        surveyLat,
        surveyLng,
        waterPresence,
        vegetationStatus,
        siltationPercent,
        structuralDefects,
        fieldNotes
      });
    }
  };

  const pipelineStages = [
    { key: 'CAPTURED', label: '1. Captured' },
    { key: 'UPLOADED', label: '2. Uploaded' },
    { key: 'METADATA_CHECKED', label: '3. Meta Checked' },
    { key: 'AI_INTERPRETED', label: '4. AI Interpreted' },
    { key: 'HUMAN_VERIFIED', label: '5. Human Verified' },
    { key: 'ACCEPTED', label: '6. Accepted' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-[1500px] mx-auto pb-14 font-mono text-xs">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <Camera className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
              Field Data Collection & Human-in-the-Loop Validation Workspace
            </h2>
            <DataBadge status="USER-UPLOADED" compact />
          </div>
          <p className="text-xs text-[#94A3B8]">
            Mobile-optimized ground audit form implementing the 6-stage validation workflow: Captured → Uploaded → Metadata Checked → AI Assisted → Human Verified → Accepted.
          </p>
        </div>

        {/* Connectivity & Offline Sync Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              isOnline ? 'bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]' : 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'ONLINE (SYNCED)' : 'OFFLINE DRAFT BUFFER'}</span>
          </button>
        </div>
      </div>

      {/* 6-Stage Validation Pipeline Tracker */}
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#94A3B8] mb-2">
          <span>FIELD EVIDENCE VERIFICATION PROGRESS:</span>
          <span className="text-[#2DD4BF]">ACTIVE STAGE: {currentStage}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {pipelineStages.map((st, idx) => {
            const isPassed = pipelineStages.findIndex((s) => s.key === currentStage) >= idx;
            return (
              <div
                key={st.key}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isPassed 
                    ? 'bg-[#2DD4BF]/15 border-[#2DD4BF] text-[#2DD4BF] font-bold shadow-sm' 
                    : 'bg-[#0B0F15] border-[#233041] text-[#64748B]'
                }`}
              >
                <div className="text-[10px]">{st.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Field Survey Form */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={handleFinalSubmit} className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
              <h3 className="text-sm font-bold text-[#F1F5F9] font-sans flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
                Standard PMKSY-WDC 2.0 Inspection Checklist
              </h3>
              <span className="text-[10px] text-[#94A3B8]">FORM ID: WDC-MH-AN-09</span>
            </div>

            {/* Asset Selection */}
            <div>
              <label className="block text-[#94A3B8] mb-1">Target Intervention Asset</label>
              <select
                value={selectedAssetId}
                onChange={(e) => {
                  setSelectedAssetId(e.target.value);
                  const a = dataset.interventions.find((item) => item.id === e.target.value);
                  if (a) {
                    setSurveyLat(a.latitude.toFixed(5));
                    setSurveyLng(a.longitude.toFixed(5));
                  }
                }}
                className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
              >
                {dataset.interventions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} — {item.name} ({item.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Geolocation Input with Live GNSS Trigger */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#94A3B8] mb-1">Latitude (°N)</label>
                <input
                  type="text"
                  value={surveyLat}
                  onChange={(e) => setSurveyLat(e.target.value)}
                  className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>
              <div>
                <label className="block text-[#94A3B8] mb-1">Longitude (°E)</label>
                <input
                  type="text"
                  value={surveyLng}
                  onChange={(e) => setSurveyLng(e.target.value)}
                  className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAcquireGps}
              className="w-full py-2 bg-[#182230] hover:bg-[#233041] border border-[#233041] rounded-xl text-xs text-[#38BDF8] font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <MapPin className={`w-3.5 h-3.5 ${isGpsAcquiring ? 'animate-bounce' : ''}`} />
              <span>{isGpsAcquiring ? 'Acquiring GNSS Satellites...' : 'Acquire Current Device GPS Fix'}</span>
            </button>

            {/* Checklist Items: Water Presence & Vegetation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#233041]">
              <div>
                <label className="block text-[#94A3B8] mb-1">Visible Surface Water Presence</label>
                <select
                  value={waterPresence}
                  onChange={(e: any) => setWaterPresence(e.target.value)}
                  className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
                >
                  <option value="FULL_POOL">Full Pool (~1.4m Weir Head)</option>
                  <option value="HALF_CAPACITY">Half Capacity Retention</option>
                  <option value="TRICKLE">Trickle / Shallow Pool</option>
                  <option value="DRY">Dry Basin (Post-Season)</option>
                  <option value="SPILLING">Active Overflow Spilling</option>
                </select>
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Vegetation Riparian Condition</label>
                <select
                  value={vegetationStatus}
                  onChange={(e: any) => setVegetationStatus(e.target.value)}
                  className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
                >
                  <option value="HEALTHY_CANOPY">Healthy Canopy / Vetiver Bunds</option>
                  <option value="MODERATE">Moderate Shrub Cover</option>
                  <option value="SPARSE">Sparse / Arid Banks</option>
                  <option value="ENCROACHING">Weed / Shrub Encroachment</option>
                </select>
              </div>
            </div>

            {/* Siltation Severity Slider */}
            <div className="space-y-1.5 pt-2 border-t border-[#233041]">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Upstream Siltation Level:</span>
                <span className={siltationPercent > 40 ? 'text-[#F43F5E] font-bold' : 'text-[#10B981] font-bold'}>
                  {siltationPercent}% of Active Basin
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={siltationPercent}
                onChange={(e) => setSiltationPercent(Number(e.target.value))}
                className="w-full accent-[#2DD4BF] cursor-pointer"
              />
              <div className="text-[10px] text-[#64748B]">
                &gt; 40% triggers mechanical desilting priority notification
              </div>
            </div>

            {/* Structural Defects Checklist */}
            <div className="space-y-2 pt-2 border-t border-[#233041]">
              <span className="text-[#94A3B8] block">Visible Structural Defects (Check all that apply):</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Hairline Masonry Cracking',
                  'Downstream Apron Scour',
                  'Wing Wall Under-Seepage',
                  'Weir Crest Debris Clogging'
                ].map((defect) => (
                  <button
                    key={defect}
                    type="button"
                    onClick={() => handleToggleDefect(defect)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      structuralDefects.includes(defect)
                        ? 'bg-[#F43F5E]/20 border-[#F43F5E] text-[#F43F5E] font-bold'
                        : 'bg-[#0B0F15] border-[#233041] text-[#94A3B8]'
                    }`}
                  >
                    {structuralDefects.includes(defect) ? '✓ ' : '+ '}
                    {defect}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="block text-[#94A3B8]">Auditor / Engineer Remarks</label>
              <textarea
                rows={2}
                value={fieldNotes}
                onChange={(e) => setFieldNotes(e.target.value)}
                className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="py-2.5 px-3 rounded-xl bg-[#0B0F15] hover:bg-[#182230] border border-[#233041] text-[#94A3B8] hover:text-[#F1F5F9] font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{hasDraftSaved ? 'Draft Saved Locally' : 'Save Offline Draft'}</span>
              </button>

              <button
                type="submit"
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-bold shadow-md shadow-[#2DD4BF]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit & Accept Record</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Audit Trail Log & Photo Preview */}
        <div className="lg:col-span-5 space-y-4">
          {/* Photo Preview */}
          <div className="glass-panel rounded-2xl p-4 space-y-2 border-[#233041]">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span>Attached Survey Evidence Photo</span>
              <span className="text-[#2DD4BF]">GNSS Stamped</span>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#233041]">
              <img src={photoPreview || '/evidence/cd01.jpg'} alt="Field" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/80 font-mono text-[10px] text-[#2DD4BF]">
                {surveyLat}°N, {surveyLng}°E • {surveyDate}
              </div>
            </div>
          </div>

          {/* Verification Audit Trail History */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#233041]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#2DD4BF]" />
                <h4 className="text-sm font-bold text-[#F1F5F9] font-sans">
                  Immutable Verification Audit Trail
                </h4>
              </div>
              <span className="text-[10px] text-[#94A3B8]">{auditLog.length} EVENTS</span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {auditLog.map((log, idx) => (
                <div key={idx} className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041] space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#2DD4BF] font-bold">{log.stage}</span>
                    <span className="text-[#64748B]">{log.timestamp}</span>
                  </div>
                  <div className="font-semibold text-[#F1F5F9] text-xs">{log.action}</div>
                  <div className="text-[10px] text-[#94A3B8]">Actor: {log.actor}</div>
                  <p className="text-[10px] text-[#64748B] italic">{log.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
