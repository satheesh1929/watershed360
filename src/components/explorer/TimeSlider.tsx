'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface TimeSliderProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export default function TimeSlider({ selectedYear, onYearChange }: TimeSliderProps) {
  const years = [2021, 2023, 2025, 2026];
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        const currentIndex = years.indexOf(selectedYear);
        const nextIndex = (currentIndex + 1) % years.length;
        onYearChange(years[nextIndex]);
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, selectedYear, onYearChange]);

  const getLabel = (yr: number) => {
    switch (yr) {
      case 2021: return '2021 (Baseline)';
      case 2023: return '2023 (Treatment)';
      case 2025: return '2025 (Regeneration)';
      case 2026: return '2026 (Current State)';
      default: return yr.toString();
    }
  };

  return (
    <div className="bg-[#131A24]/95 backdrop-blur-xl border border-[#233041] rounded-2xl p-4 shadow-2xl select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2DD4BF]" />
          <span className="text-xs font-bold text-[#F1F5F9] font-sans">
            Multi-Temporal Scrubber & Simulation Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              isPlaying 
                ? 'bg-[#F59E0B] text-[#0B0F15] shadow-lg shadow-[#F59E0B]/20 animate-pulse' 
                : 'bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 text-[#2DD4BF] hover:bg-[#2DD4BF]/25'
            }`}
            title={isPlaying ? 'Pause Simulation' : 'Auto-Play Temporal Transformation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY SIM'}</span>
          </button>
          
          <span className="text-xs font-mono text-[#2DD4BF] font-bold bg-[#0B0F15] px-2.5 py-1 rounded-lg border border-[#233041]">
            {getLabel(selectedYear)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {years.map((yr) => {
          const isSelected = selectedYear === yr;
          return (
            <button
              key={yr}
              onClick={() => {
                setIsPlaying(false);
                onYearChange(yr);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-mono transition-all text-center border relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-extrabold border-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/25 scale-[1.02]'
                  : 'bg-[#0B0F15] text-[#94A3B8] border-[#233041] hover:text-[#F1F5F9] hover:border-[#94A3B8]'
              }`}
            >
              <div className="font-bold text-xs">{yr}</div>
              <div className={`text-[9px] truncate ${isSelected ? 'text-[#0B0F15]/90 font-bold' : 'text-[#64748B]'}`}>
                {yr === 2021 ? 'Baseline' : yr === 2023 ? 'Civil Works' : yr === 2025 ? 'Green-up' : 'Outcome'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
