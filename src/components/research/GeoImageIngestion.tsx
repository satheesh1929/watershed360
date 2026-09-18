'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  MapPin, 
  Compass, 
  Calendar, 
  Camera, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  FileImage,
  Navigation
} from 'lucide-react';
import { extractExifFromBlob, ExifExtractionResult } from '@/lib/exif';
import DataBadge from '@/components/common/DataBadge';
import { getWatershedDataset } from '@/data/demoWatershedData';

export interface IngestedImageRecord {
  id: string;
  name: string;
  dataUrl: string;
  captureDate: string;
  latitude: number | null;
  longitude: number | null;
  altitudeMeters?: number;
  bearingDeg?: number;
  compassDirection?: string;
  cameraMake?: string;
  cameraModel?: string;
  isGpsFromExif: boolean;
  village: string;
  interventionId: string;
  observerName: string;
  notes: string;
  status: 'LOCATION_REQUIRED' | 'PENDING_REVIEW' | 'VERIFIED';
}

interface GeoImageIngestionProps {
  watershedId?: string;
  onImageIngested: (record: IngestedImageRecord) => void;
  onSelectInterventionMap?: (interventionId: string) => void;
}

export default function GeoImageIngestion({
  watershedId = 'pimpalgaon',
  onImageIngested,
  onSelectInterventionMap
}: GeoImageIngestionProps) {
  const dataset = getWatershedDataset(watershedId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragOver, setDragOver] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifExtractionResult | null>(null);

  // Form Fields
  const [manualLat, setManualLat] = useState<string>(dataset.interventions[0]?.latitude.toFixed(5) || '19.18520');
  const [manualLng, setManualLng] = useState<string>(dataset.interventions[0]?.longitude.toFixed(5) || '74.69540');
  const [captureDate, setCaptureDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [village, setVillage] = useState<string>(dataset.stats.taluka.split('/')[0]?.trim() || 'Pimpalgaon');
  const [selectedIntervention, setSelectedIntervention] = useState<string>(dataset.interventions[0]?.id || 'pk-cd-01');
  const [observerName, setObserverName] = useState<string>('Er. P. Deshmukh (Junior Engineer)');
  const [fieldNotes, setFieldNotes] = useState<string>('Routine post-monsoon weir structural & siltation audit.');
  const [isManualGpsOverride, setIsManualGpsOverride] = useState(false);

  const handleProcessFile = async (file: File) => {
    setCurrentFile(file);
    setIsExtracting(true);

    // Read Data URL for preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);

      // Extract EXIF
      const exif = await extractExifFromBlob(file);
      setExifData(exif);
      setIsExtracting(false);

      if (exif.hasGps && exif.latitude && exif.longitude) {
        setManualLat(exif.latitude.toFixed(5));
        setManualLng(exif.longitude.toFixed(5));
        setIsManualGpsOverride(false);
      } else {
        setIsManualGpsOverride(true);
      }

      if (exif.dateTime) {
        const cleanDate = exif.dateTime.split(' ')[0]?.replace(/:/g, '-') || new Date().toISOString().split('T')[0];
        setCaptureDate(cleanDate);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleMapCoordinatePick = (lat: number, lng: number) => {
    setManualLat(lat.toFixed(5));
    setManualLng(lng.toFixed(5));
    setIsManualGpsOverride(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;

    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    const hasValidCoords = !isNaN(lat) && !isNaN(lng);

    const newRecord: IngestedImageRecord = {
      id: `usr-img-${Date.now()}`,
      name: currentFile?.name || 'Field Photograph',
      dataUrl: imagePreview,
      captureDate,
      latitude: hasValidCoords ? lat : null,
      longitude: hasValidCoords ? lng : null,
      altitudeMeters: exifData?.altitudeMeters,
      bearingDeg: exifData?.bearingDeg,
      compassDirection: exifData?.compassDirection,
      cameraMake: exifData?.cameraMake,
      cameraModel: exifData?.cameraModel,
      isGpsFromExif: Boolean(exifData?.hasGps && !isManualGpsOverride),
      village,
      interventionId: selectedIntervention,
      observerName,
      notes: fieldNotes,
      status: hasValidCoords ? 'PENDING_REVIEW' : 'LOCATION_REQUIRED'
    };

    onImageIngested(newRecord);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Module Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <Camera className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
              Geo-Coded Field Image Ingestion & Metadata Pipeline
            </h2>
            <DataBadge status="USER-UPLOADED" compact />
          </div>
          <p className="text-xs text-[#94A3B8] font-mono">
            Directly extracts hardware EXIF GNSS geotags, timestamps, and compass orientation from raw field photographs. Supports map-assisted coordinate placement if GPS was disabled.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#0B0F15] border border-[#233041] text-xs font-mono text-[#2DD4BF] font-bold">
            {dataset.stats.code} • {dataset.stats.name}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Drag & Drop Ingestion Zone + Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragOver 
                ? 'border-[#2DD4BF] bg-[#2DD4BF]/10 scale-[1.01]' 
                : 'border-[#233041] hover:border-[#2DD4BF]/50 bg-[#131A24]/60'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleProcessFile(e.target.files[0]);
                }
              }}
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#182230] border border-[#233041] flex items-center justify-center text-[#2DD4BF] shadow-lg group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#F1F5F9] font-sans">
                  Drop field photograph here or click to browse
                </p>
                <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                  Supports JPEG, JPG, PNG (EXIF APP1 GNSS tags preserved)
                </p>
              </div>
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#0B0F15] text-[#2DD4BF] border border-[#233041]">
                AUTOMATIC EXIF GPS PARSER READY
              </span>
            </div>
          </div>

          {/* Image & EXIF Status Preview Card */}
          {imagePreview && (
            <div className="glass-panel rounded-2xl p-4 space-y-4 border-[#2DD4BF]/30 animate-fadeIn">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#233041]">
                <img 
                  src={imagePreview} 
                  alt="Field preview" 
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2">
                  {exifData?.hasGps ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10B981]/90 text-[#070A0F] font-mono text-[10px] font-bold backdrop-blur">
                      <CheckCircle2 className="w-3 h-3" />
                      EXIF GNSS VERIFIED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F59E0B]/90 text-[#070A0F] font-mono text-[10px] font-bold backdrop-blur">
                      <AlertTriangle className="w-3 h-3" />
                      GPS MISSING — LOCATION REQUIRED
                    </span>
                  )}
                </div>
              </div>

              {/* Hardware EXIF Telemetry Grid */}
              <div className="p-3 bg-[#0B0F15] rounded-xl border border-[#233041] space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#94A3B8] pb-1 border-b border-[#233041]">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-3 h-3 text-[#2DD4BF]" />
                    Hardware Telemetry Report
                  </span>
                  <span className="text-[10px] text-[#2DD4BF]">
                    {exifData?.rawExifFound ? 'EXIF APP1 DETECTED' : 'NO APP1 HEADER'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#94A3B8]">Camera / Device:</span>
                    <div className="text-[#F1F5F9] font-medium truncate">
                      {exifData?.cameraModel ? `${exifData.cameraMake || ''} ${exifData.cameraModel}` : 'Not embedded in stream'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#94A3B8]">Altitude MSL:</span>
                    <div className="text-[#F1F5F9] font-medium">
                      {exifData?.altitudeMeters ? `${exifData.altitudeMeters} m MSL` : 'Unavailable'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#94A3B8]">Compass Orientation:</span>
                    <div className="text-[#F1F5F9] font-medium">
                      {exifData?.bearingDeg !== undefined ? `${exifData.bearingDeg}° (${exifData.compassDirection})` : 'Unavailable'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#94A3B8]">GPS Extraction Status:</span>
                    <div className={exifData?.hasGps ? 'text-[#10B981] font-bold' : 'text-[#F59E0B] font-bold'}>
                      {exifData?.statusMessage || 'Awaiting file...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Spatial Association & Field Form */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
              <h3 className="text-sm font-bold text-[#F1F5F9] font-sans flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2DD4BF]" />
                Spatial Association & Field Attributes
              </h3>
              <span className="text-[10px] font-mono text-[#94A3B8]">
                STEP 1 OF 3: INGESTION
              </span>
            </div>

            {/* Geodetic Coordinates */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="block text-[#94A3B8] mb-1">
                  Latitude (°N) {exifData?.hasGps && !isManualGpsOverride && <span className="text-[#10B981]">[EXIF]</span>}
                </label>
                <input 
                  type="text"
                  value={manualLat}
                  onChange={(e) => {
                    setManualLat(e.target.value);
                    setIsManualGpsOverride(true);
                  }}
                  placeholder="e.g. 19.18520"
                  className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#94A3B8] mb-1">
                  Longitude (°E) {exifData?.hasGps && !isManualGpsOverride && <span className="text-[#10B981]">[EXIF]</span>}
                </label>
                <input 
                  type="text"
                  value={manualLng}
                  onChange={(e) => {
                    setManualLng(e.target.value);
                    setIsManualGpsOverride(true);
                  }}
                  placeholder="e.g. 74.69540"
                  className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
                  required
                />
              </div>
            </div>

            {/* Coordinate Source Feedback */}
            <div className="p-2.5 rounded-xl bg-[#0B0F15] border border-[#233041] text-[11px] font-mono flex items-center justify-between">
              <span className="text-[#94A3B8]">Coordinate Provenance:</span>
              <span className={exifData?.hasGps && !isManualGpsOverride ? 'text-[#10B981] font-bold' : 'text-[#38BDF8] font-bold'}>
                {exifData?.hasGps && !isManualGpsOverride ? 'EXTRACTED DIRECTLY FROM EXIF' : 'MANUALLY ASSIGNED / MAP ASSISTED'}
              </span>
            </div>

            {/* Civil Intervention Association */}
            <div className="font-mono text-xs">
              <label className="block text-[#94A3B8] mb-1">Associated Civil Intervention Asset</label>
              <select
                value={selectedIntervention}
                onChange={(e) => setSelectedIntervention(e.target.value)}
                className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
              >
                {dataset.interventions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.code} — {item.name} ({item.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Village & Date */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="block text-[#94A3B8] mb-1">Revenue Village / Habitation</label>
                <input 
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Village name"
                  className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>
              <div>
                <label className="block text-[#94A3B8] mb-1">Survey Date</label>
                <input 
                  type="date"
                  value={captureDate}
                  onChange={(e) => setCaptureDate(e.target.value)}
                  className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
                />
              </div>
            </div>

            {/* Field Observer Name */}
            <div className="font-mono text-xs">
              <label className="block text-[#94A3B8] mb-1">Field Observer / Inspecting Engineer</label>
              <input 
                type="text"
                value={observerName}
                onChange={(e) => setObserverName(e.target.value)}
                placeholder="Inspecting Engineer"
                className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>

            {/* Field Notes */}
            <div className="font-mono text-xs">
              <label className="block text-[#94A3B8] mb-1">Field Observations & Inspection Notes</label>
              <textarea 
                rows={3}
                value={fieldNotes}
                onChange={(e) => setFieldNotes(e.target.value)}
                placeholder="Describe visible condition, water level, downstream scouring, or siltation..."
                className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl px-3 py-2 text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
              />
            </div>

            {/* Ingest Action Button */}
            <button
              type="submit"
              disabled={!imagePreview}
              className={`w-full py-3 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                imagePreview 
                  ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] hover:brightness-110 active:scale-95 shadow-[#2DD4BF]/20 cursor-pointer' 
                  : 'bg-[#182230] text-[#64748B] cursor-not-allowed border border-[#233041]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Ingest Photo into Interpretation Workspace ›</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
