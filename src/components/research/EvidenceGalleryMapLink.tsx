'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Compass, 
  Calendar, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight,
  Layers,
  Sparkles,
  Eye
} from 'lucide-react';
import { IngestedImageRecord } from './GeoImageIngestion';
import { getWatershedDataset } from '@/data/demoWatershedData';
import DataBadge from '@/components/common/DataBadge';

interface EvidenceGalleryMapLinkProps {
  customRecords: IngestedImageRecord[];
  watershedId?: string;
  onSelectRecordForInspection: (record: IngestedImageRecord) => void;
  onLocateOnMap?: (lat: number, lng: number, assetId?: string) => void;
}

export default function EvidenceGalleryMapLink({
  customRecords,
  watershedId = 'pimpalgaon',
  onSelectRecordForInspection,
  onLocateOnMap
}: EvidenceGalleryMapLinkProps) {
  const dataset = getWatershedDataset(watershedId);

  // Filters
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterSiltation, setFilterSiltation] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Combine default dataset evidence + user ingested records
  const defaultMappedRecords: IngestedImageRecord[] = dataset.evidence.map((ev) => {
    const asset = dataset.interventions.find((i) => i.id === ev.relatedInterventionId);
    return {
      id: ev.id,
      name: ev.caption,
      dataUrl: ev.photoUrl,
      captureDate: ev.exif.timestamp.split('T')[0],
      latitude: ev.exif.latitude,
      longitude: ev.exif.longitude,
      altitudeMeters: ev.exif.altitudeMeters,
      bearingDeg: ev.exif.bearingDeg,
      compassDirection: ev.exif.compassDirection,
      cameraMake: 'Trimble',
      cameraModel: ev.exif.deviceModel,
      isGpsFromExif: true,
      village: dataset.stats.taluka.split('/')[0]?.trim() || 'Pimpalgaon',
      interventionId: ev.relatedInterventionId,
      observerName: 'PMKSY Technical Field Officer',
      notes: ev.aiObservation.conditionSummary,
      status: 'VERIFIED'
    };
  });

  const allRecords = [...customRecords, ...defaultMappedRecords];

  const filteredRecords = allRecords.filter((rec) => {
    const asset = dataset.interventions.find((i) => i.id === rec.interventionId);
    if (filterType !== 'ALL' && asset?.type !== filterType) return false;
    if (filterStatus !== 'ALL' && rec.status !== filterStatus) return false;
    if (filterSiltation === 'HIGH' && (asset?.siltationPercent || 0) < 40) return false;
    if (filterSiltation === 'LOW' && (asset?.siltationPercent || 0) >= 40) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = rec.name.toLowerCase().includes(q);
      const matchNotes = rec.notes.toLowerCase().includes(q);
      const matchVillage = rec.village.toLowerCase().includes(q);
      const matchAsset = asset?.code.toLowerCase().includes(q) || asset?.name.toLowerCase().includes(q);
      if (!matchName && !matchNotes && !matchVillage && !matchAsset) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Filter Controls */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF]">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
                Geo-Coded Evidence Spatial Ledger & Timeline Gallery
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/40 text-[#2DD4BF] text-xs font-mono font-bold">
                {filteredRecords.length} GEOTAGGED RECORDS
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono">
              Bidirectional link between field photographic evidence and the watershed GIS layer. Clicking any record locates the structure on the map.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search asset, village, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0F15] border border-[#233041] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF]"
            />
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#233041] text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#94A3B8]">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By:</span>
          </div>

          {/* Asset Type Selector */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#0B0F15] border border-[#233041] rounded-lg px-2.5 py-1 text-xs text-[#F1F5F9] focus:outline-none"
          >
            <option value="ALL">All Asset Types</option>
            <option value="Stone Masonry Check Dam">Check Dam</option>
            <option value="Reinforced Concrete Weir">Concrete Weir</option>
            <option value="Lined Farm Pond">Farm Pond</option>
            <option value="Continuous Contour Trench (CCT)">Contour Trenches</option>
            <option value="Earthen Percolation Tank">Percolation Tank</option>
          </select>

          {/* Verification Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0B0F15] border border-[#233041] rounded-lg px-2.5 py-1 text-xs text-[#F1F5F9] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified Active</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="LOCATION_REQUIRED">Location Required</option>
          </select>

          {/* Siltation Level */}
          <select
            value={filterSiltation}
            onChange={(e) => setFilterSiltation(e.target.value)}
            className="bg-[#0B0F15] border border-[#233041] rounded-lg px-2.5 py-1 text-xs text-[#F1F5F9] focus:outline-none"
          >
            <option value="ALL">All Silt Levels</option>
            <option value="LOW">Low Silt (&lt; 40%)</option>
            <option value="HIGH">Critical Silt (&ge; 40%)</option>
          </select>

          {(filterType !== 'ALL' || filterStatus !== 'ALL' || filterSiltation !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setFilterType('ALL');
                setFilterStatus('ALL');
                setFilterSiltation('ALL');
                setSearchQuery('');
              }}
              className="text-[#2DD4BF] hover:underline text-[11px] font-bold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((item) => {
          const asset = dataset.interventions.find((i) => i.id === item.interventionId);

          return (
            <div
              key={item.id}
              className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#2DD4BF]/60 transition-all duration-200 group hover:scale-[1.01]"
            >
              <div>
                {/* Photo Header Container */}
                <div className="relative aspect-video bg-black overflow-hidden border-b border-[#233041]">
                  <img
                    src={item.dataUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges on Image */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold backdrop-blur ${
                      item.status === 'VERIFIED' ? 'bg-[#10B981]/90 text-[#070A0F]' :
                      item.status === 'PENDING_REVIEW' ? 'bg-[#F59E0B]/90 text-[#070A0F]' :
                      'bg-[#F43F5E]/90 text-white'
                    }`}>
                      {item.status}
                    </span>
                    {item.isGpsFromExif && (
                      <span className="px-2 py-0.5 rounded bg-black/80 text-[#2DD4BF] font-mono text-[10px]">
                        EXIF GPS
                      </span>
                    )}
                  </div>

                  {item.compassDirection && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-[#F1F5F9] flex items-center gap-1">
                      <Compass className="w-3 h-3 text-[#2DD4BF]" />
                      {item.compassDirection} ({item.bearingDeg}°)
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] mb-1">
                      <span>{item.captureDate}</span>
                      <span className="text-[#2DD4BF] font-semibold">{asset?.code || 'ASSET-REF'}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#F1F5F9] font-sans group-hover:text-[#2DD4BF] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  {/* Geotag & Village Strip */}
                  <div className="p-2.5 bg-[#0B0F15] rounded-xl border border-[#233041] space-y-1 text-xs font-mono">
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span>Location:</span>
                      <span className="text-[#F1F5F9]">
                        {item.latitude ? `${item.latitude.toFixed(4)}°N, ${item.longitude?.toFixed(4)}°E` : 'Pending Placement'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#94A3B8]">
                      <span>Village:</span>
                      <span className="text-[#F1F5F9]">{item.village}</span>
                    </div>
                    {asset && (
                      <div className="flex items-center justify-between text-[#94A3B8]">
                        <span>Siltation:</span>
                        <span className={asset.siltationPercent > 40 ? 'text-[#F43F5E] font-bold' : 'text-[#10B981] font-bold'}>
                          {asset.siltationPercent}% Live Storage
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Observations Snippet */}
                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed font-mono">
                    {item.notes}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectRecordForInspection(item)}
                  className="py-2 px-3 rounded-xl bg-[#182230] hover:bg-[#2DD4BF] hover:text-[#0B0F15] border border-[#233041] font-mono font-bold text-xs text-[#F1F5F9] transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                {onLocateOnMap && item.latitude && item.longitude && (
                  <button
                    onClick={() => onLocateOnMap(item.latitude!, item.longitude!, item.interventionId)}
                    className="py-2 px-3 rounded-xl bg-[#0B0F15] hover:bg-[#182230] text-[#2DD4BF] border border-[#233041] font-mono font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Map</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
