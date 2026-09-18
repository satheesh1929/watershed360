'use client';

import React from 'react';
import { 
  ShieldCheck, 
  UploadCloud, 
  Cpu, 
  Activity, 
  Clock, 
  AlertCircle
} from 'lucide-react';

export type DataTrustStatus = 
  | 'VERIFIED'
  | 'USER-UPLOADED'
  | 'MODELED'
  | 'SIMULATED'
  | 'PENDING'
  | 'UNAVAILABLE';

interface DataBadgeProps {
  status: DataTrustStatus;
  source?: string;
  date?: string;
  resolution?: string;
  confidence?: number;
  className?: string;
  compact?: boolean;
}

const statusConfig: Record<DataTrustStatus, {
  label: string;
  icon: any;
  bg: string;
  border: string;
  text: string;
  desc: string;
}> = {
  VERIFIED: {
    label: 'VERIFIED DATA',
    icon: ShieldCheck,
    bg: 'bg-[#10B981]/15',
    border: 'border-[#10B981]/40',
    text: 'text-[#10B981]',
    desc: 'Ground-truthed / official administrative record'
  },
  'USER-UPLOADED': {
    label: 'FIELD SURVEY UPLOAD',
    icon: UploadCloud,
    bg: 'bg-[#38BDF8]/15',
    border: 'border-[#38BDF8]/40',
    text: 'text-[#38BDF8]',
    desc: 'Field engineer survey photograph with extracted coordinates'
  },
  MODELED: {
    label: 'SCIENTIFICALLY MODELED',
    icon: Cpu,
    bg: 'bg-[#A855F7]/15',
    border: 'border-[#A855F7]/40',
    text: 'text-[#A855F7]',
    desc: 'Derived via mathematical equation (RUSLE / MCDA / NDWI threshold)'
  },
  SIMULATED: {
    label: 'DEMO FIXTURE',
    icon: Activity,
    bg: 'bg-[#F59E0B]/15',
    border: 'border-[#F59E0B]/40',
    text: 'text-[#F59E0B]',
    desc: 'Calibrated research demonstration sample fixture'
  },
  PENDING: {
    label: 'ADAPTER PENDING',
    icon: Clock,
    bg: 'bg-[#64748B]/20',
    border: 'border-[#64748B]/40',
    text: 'text-[#94A3B8]',
    desc: 'National MIS / SRISHTI-DRISHTI adapter awaiting API credential sync'
  },
  UNAVAILABLE: {
    label: 'DATA UNAVAILABLE',
    icon: AlertCircle,
    bg: 'bg-[#F43F5E]/15',
    border: 'border-[#F43F5E]/40',
    text: 'text-[#F43F5E]',
    desc: 'In-situ telemetry not deployed in this micro-catchment'
  }
};

export default function DataBadge({ 
  status, 
  source, 
  date, 
  resolution, 
  confidence,
  className = '',
  compact = false
}: DataBadgeProps) {
  const config = statusConfig[status] || statusConfig.SIMULATED;
  const Icon = config.icon;

  if (compact) {
    return (
      <span 
        title={`${config.desc}${source ? ` • Source: ${source}` : ''}${date ? ` • Date: ${date}` : ''}`}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold border transition-all ${config.bg} ${config.border} ${config.text} ${className}`}
      >
        <Icon className="w-3 h-3 shrink-0" />
        <span>{config.label}</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs border ${config.bg} ${config.border} ${config.text} ${className}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="font-bold">{config.label}</span>
      {source && (
        <span className="text-[10px] opacity-75 font-normal">
          ({source})
        </span>
      )}
      {confidence !== undefined && (
        <span className="text-[10px] px-1 py-0.2 rounded bg-black/30 border border-white/10 font-bold ml-0.5">
          {Math.round(confidence * 100)}% Conf
        </span>
      )}
    </div>
  );
}
