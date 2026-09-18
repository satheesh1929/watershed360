'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Radio,
  CheckCircle2,
  Maximize2
} from 'lucide-react';

interface LoadingSplashProps {
  onComplete: () => void;
}

const TOTAL_LOADING_SECONDS = 10;

const telemetrySteps = [
  { second: 1, code: 'KERNEL-WGS84', text: 'Initializing Geospatial Kernel & EPSG:4326 (WGS 84) Coordinate Grid' },
  { second: 2, code: 'POLY-4E2B5C', text: 'Delineating Micro-Catchment 4E2B5c-09 Ahilyanagar Ridge Boundary' },
  { second: 3, code: 'S2-L2A-BOA', text: 'Acquiring Sentinel-2 Level-2A BOA Multispectral Reflectance Bands (10m)' },
  { second: 4, code: 'NDVI-NDWI-CAL', text: 'Calculating Surface Greening (NDVI) & Surface Moisture (NDWI) Indices' },
  { second: 5, code: 'DEM-COP30M', text: 'Calibrating Copernicus 30m Digital Elevation Model (DEM) & Strahler Streams' },
  { second: 6, code: 'SRISHTI-ASSET', text: 'Ingesting SRISHTI-DRISHTI Geocoded Civil Asset Registry (14 Structures)' },
  { second: 7, code: 'GSDA-WELLS', text: 'Synchronizing GSDA Dug-Well Ground Water Telemetry (+4.8m Mean Lift)' },
  { second: 8, code: 'RUSLE-MCDA', text: 'Computing RUSLE Soil Erosion Factor Matrices (A = R · K · LS · C · P)' },
  { second: 9, code: 'VISION-AI', text: 'Aligning Gemini Multimodal Vision Engine for Civil Structure Inspection' },
  { second: 10, code: 'READY-LAUNCH', text: 'Geospatial Intelligence Calibrated. Unveiling Watershed360 Platform...' }
];

export default function LoadingSplash({ onComplete }: LoadingSplashProps) {
  const [progress, setProgress] = useState<number>(0);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoDuration, setVideoDuration] = useState<number>(14);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const revealTriggeredRef = useRef<boolean>(false);

  // Lock scroll to top during loading screen so the underlying page cannot scroll
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Prevent background scrolling while splash is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
  }, []);

  // Exact 10-Second Loading Progression (10,000ms)
  useEffect(() => {
    const startTime = Date.now();
    const durationMs = TOTAL_LOADING_SECONDS * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      const secs = Math.min(TOTAL_LOADING_SECONDS, +(elapsed / 1000).toFixed(1));

      setProgress(calculatedProgress);
      setSecondsElapsed(secs);

      // Map progress to the 10 calibration steps
      const stepIdx = Math.min(
        telemetrySteps.length - 1,
        Math.floor((calculatedProgress / 100) * telemetrySteps.length)
      );
      setCurrentStepIndex(stepIdx);

      // Once 10 seconds have elapsed:
      if (elapsed >= durationMs) {
        clearInterval(interval);
        if (!revealTriggeredRef.current) {
          triggerCircularReveal();
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Handler to trigger the black circle reveal animation
  const triggerCircularReveal = () => {
    if (revealTriggeredRef.current) return;
    revealTriggeredRef.current = true;
    
    // Pause video if playing
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (_) {}
    }

    // Strictly anchor viewport to the very top (Header in view) before reveal
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }

    setIsRevealing(true);

    // After circle fully expands (1.25 seconds), notify parent
    setTimeout(() => {
      onComplete();
      // Double check scroll anchor at top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (mainEl) {
        mainEl.scrollTop = 0;
      }
    }, 1250);
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleToggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setVideoDuration(videoRef.current.duration);
      }
    }
  };

  const handleVideoEnded = () => {
    triggerCircularReveal();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* 
        EXPANDING BLACK CIRCLE REVEAL APERTURE
        Anchored at the exact geometric center of the viewport (50% X, 50% Y)
        The circular aperture expands radially outward starting right from the center,
        unveiling the Watershed360 platform smoothly with a high-tech glowing cyan rim!
      */}
      <div 
        className={`fixed inset-0 z-[150] pointer-events-none overflow-hidden ${
          isRevealing ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className="rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-[width,height] pointer-events-none"
          style={{
            width: isRevealing ? '360vmax' : '0px',
            height: isRevealing ? '360vmax' : '0px',
            boxShadow: '0 0 0 9999px #070A0F, 0 0 60px #2DD4BF, 0 0 100px rgba(45,212,191,0.6), inset 0 0 50px rgba(6,182,212,0.4)',
            border: isRevealing ? '3px solid #2DD4BF' : '0px solid transparent',
            transition: 'width 1.25s cubic-bezier(0.25, 1, 0.35, 1), height 1.25s cubic-bezier(0.25, 1, 0.35, 1)',
          }}
        >
          {/* Cybernetic radar shockwave ring */}
          <div className="absolute inset-[-6px] rounded-full border border-[#06B6D4]/70 pointer-events-none" />
        </div>
      </div>

      {/* 
        MAIN 100% MOBILE-RESPONSIVE CINEMATIC LOADING BRIEFING INTERFACE
        When isRevealing is true, it is immediately hidden so the underlying dashboard
        is directly revealed through the expanding circle hole without ghosting or delay.
      */}
      <div 
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-between text-[#F1F5F9] select-none p-2.5 sm:p-4 md:p-6 h-[100dvh] max-h-[100dvh] overflow-y-auto sm:overflow-hidden ${
          isRevealing ? 'opacity-0 pointer-events-none' : 'opacity-100 bg-[#070A0F]'
        }`}
      >
        {/* Ambient Animated Geospatial Atmospheric Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] bg-gradient-to-tr from-[#2DD4BF]/12 via-[#06B6D4]/8 to-transparent rounded-full blur-3xl animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.05]" 
            style={{ 
              backgroundImage: `radial-gradient(circle, #2DD4BF 1px, transparent 1px)`, 
              backgroundSize: '24px 24px' 
            }} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070A0F]/70 via-transparent to-[#070A0F]" />
        </div>

        {/* 1. TOP BRANDING & MISSION HEADER (Preserved Logo & Name, 100% Mobile Clean) */}
        <header className="relative z-10 w-full max-w-5xl flex items-center justify-between pt-0.5 sm:pt-1 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-[#2DD4BF]/60 shadow-[0_0_15px_rgba(45,212,191,0.35)] bg-[#0B0F15] shrink-0">
              <Image 
                src="/watershed360_logo.jpg" 
                alt="Watershed360 Official Logo" 
                fill 
                className="object-cover" 
                priority
              />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <span className="text-base sm:text-xl font-black tracking-wider bg-gradient-to-r from-[#F1F5F9] via-[#E2E8F0] to-[#2DD4BF] bg-clip-text text-transparent">
                  WATERSHED<span className="text-[#2DD4BF]">360</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/50 text-[#2DD4BF] font-bold shadow-sm">
                  SIH26015
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#182230] border border-[#233041] text-[#94A3B8]">
                  WDC-PMKSY 2.0
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#94A3B8] font-mono tracking-tight hidden xs:block">
                Advanced Geospatial Intelligence & Geo-Coded Image Interpretation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#131A24]/90 border border-[#233041] text-[#2DD4BF]">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#2DD4BF]" />
              <span className="text-[11px] font-semibold">TELEMETRY ACTIVE</span>
            </div>
            <button
              onClick={triggerCircularReveal}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#182230] hover:bg-[#2DD4BF] hover:text-[#0B0F15] border border-[#2DD4BF]/40 text-[#2DD4BF] font-bold transition-all text-[11px] sm:text-xs active:scale-95 shadow-sm"
              title="Skip Video and Open Website Immediately"
            >
              <span>Skip Intro →</span>
            </button>
          </div>
        </header>

        {/* 2. CINEMATIC VIDEO THEATRE (MATCHED TO THE VIDEO, MOBILE OPTIMIZED HEIGHT) */}
        <main className="relative z-10 w-full max-w-5xl flex-1 flex flex-col items-center justify-center my-1.5 sm:my-3 min-h-0">
          <div className="relative w-full aspect-video max-h-[38vh] xs:max-h-[44vh] sm:max-h-[52vh] md:max-h-[56vh] rounded-xl sm:rounded-2xl overflow-hidden border border-[#2DD4BF]/40 sm:border-2 sm:border-[#2DD4BF]/50 shadow-[0_0_35px_rgba(45,212,191,0.25)] bg-[#0B0F15] group">
            
            {/* Ambient Behind-Glow Reflection */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2DD4BF]/25 via-[#06B6D4]/15 to-[#10B981]/25 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Video Element with Autoplay & Inline attributes */}
            <video
              ref={videoRef}
              src="/demo-video.mp4"
              className="w-full h-full object-cover relative z-10"
              autoPlay
              playsInline
              muted={isMuted}
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={handleVideoEnded}
            />

            {/* Corner Cyber Brackets */}
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-l-2 border-[#2DD4BF] z-20 pointer-events-none" />
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-r-2 border-[#2DD4BF] z-20 pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-l-2 border-[#2DD4BF] z-20 pointer-events-none" />
            <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-r-2 border-[#2DD4BF] z-20 pointer-events-none" />

            {/* Top Video HUD Information Banner */}
            <div className="absolute top-2.5 left-3 right-3 sm:top-3.5 sm:left-4 sm:right-4 z-20 flex items-center justify-between text-[10px] sm:text-[11px] font-mono pointer-events-none">
              <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg bg-[#070A0F]/85 backdrop-blur-md border border-[#233041] text-[#2DD4BF] shadow-lg truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping shrink-0" />
                <span className="font-bold tracking-wide truncate">WATERSHED FIELD BRIEFING</span>
              </div>
              <div className="hidden xs:flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-[#070A0F]/85 backdrop-blur-md border border-[#233041] text-[#94A3B8]">
                <span>4E2B5c-09 (1,840 Ha)</span>
              </div>
            </div>

            {/* Center Terrain Targeting Reticle */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-30 group-hover:opacity-70 transition-opacity">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 border border-[#2DD4BF]/40 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]/60" />
                <div className="absolute w-6 sm:w-8 h-[1px] bg-[#2DD4BF]/60" />
                <div className="absolute h-6 sm:h-8 w-[1px] bg-[#2DD4BF]/60" />
              </div>
            </div>

            {/* Bottom Floating Video Controls Bar (Touch Friendly) */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-2 sm:p-3.5 bg-gradient-to-t from-[#070A0F] via-[#070A0F]/90 to-transparent flex items-center justify-between gap-1.5 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handleTogglePlay}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#182230]/90 hover:bg-[#2DD4BF] hover:text-[#0B0F15] text-[#F1F5F9] border border-[#233041] transition-all shadow-md active:scale-95"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />}
                </button>

                {/* Highly Visible Mobile Unmute Audio Toggle */}
                <button
                  onClick={handleToggleMute}
                  className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#182230]/90 hover:bg-[#2DD4BF] hover:text-[#0B0F15] text-[#F1F5F9] border border-[#233041] transition-all shadow-md active:scale-95"
                  title={isMuted ? 'Click to Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#F59E0B]" /> : <Volume2 className="w-3.5 h-3.5 text-[#10B981]" />}
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold">
                    {isMuted ? 'UNMUTE' : 'MUTED'}
                  </span>
                </button>

                <span className="text-[10px] sm:text-[11px] font-mono text-[#94A3B8] bg-[#070A0F]/80 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-[#233041]">
                  {formatTime(currentTime)} / {formatTime(videoDuration || 14)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handleToggleFullscreen}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#182230]/90 hover:bg-[#233041] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#233041] transition-all hidden xs:flex"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <button
                  onClick={triggerCircularReveal}
                  className="flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#2DD4BF] via-[#06B6D4] to-[#10B981] text-[#0B0F15] font-mono font-extrabold text-[10px] sm:text-xs hover:brightness-110 shadow-lg shadow-[#2DD4BF]/30 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <span>ENTER</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* 3. EXACT 10-SECOND LOADING CALIBRATION HUD & TELEMETRY BAR */}
        <footer className="relative z-10 w-full max-w-5xl space-y-1.5 sm:space-y-2.5 pb-0.5 shrink-0">
          <div className="bg-[#0B0F15]/95 border border-[#233041] p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-xl space-y-1.5 sm:space-y-2.5">
            
            {/* Countdown / Percentage Row */}
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
                <span className="text-[#94A3B8] font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                  CALIBRATION
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#182230] border border-[#233041] text-[#2DD4BF] text-[9px] sm:text-[10px] font-bold">
                  {secondsElapsed.toFixed(1)}s / {TOTAL_LOADING_SECONDS}s
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs text-[#94A3B8]">STEP {currentStepIndex + 1}/10</span>
                <span className="text-sm sm:text-base font-extrabold font-mono text-[#2DD4BF]">
                  {progress}%
                </span>
              </div>
            </div>

            {/* High-Precision 10-Second Glowing Progress Track */}
            <div className="relative h-1.5 sm:h-2 w-full bg-[#131A24] rounded-full overflow-hidden border border-[#233041]/80 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#06B6D4] via-[#2DD4BF] to-[#10B981] rounded-full transition-all duration-75 ease-linear relative"
                style={{ width: `${progress}%` }}
              >
                {/* Glowing Leading Particle */}
                <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white blur-xs rounded-full shadow-[0_0_10px_#ffffff]" />
              </div>
            </div>

            {/* Active Telemetry Status Terminal */}
            <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-mono text-[#94A3B8]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="px-1 py-0.5 rounded bg-[#2DD4BF]/10 text-[#2DD4BF] font-bold text-[9px] border border-[#2DD4BF]/30 shrink-0">
                  {telemetrySteps[currentStepIndex]?.code}
                </span>
                <span className="text-[#F1F5F9] truncate text-[10px] sm:text-[11px]">
                  {telemetrySteps[currentStepIndex]?.text}
                </span>
              </div>

              <div className="shrink-0 text-right text-[9px] sm:text-[10px] text-[#64748B] hidden xs:block">
                {progress === 100 ? (
                  <span className="text-[#10B981] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> READY
                  </span>
                ) : (
                  <span>T+10s TRANSITION</span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Footnote Data Line */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-[#64748B] px-1">
            <span className="truncate">TARGET: 4E2B5c-09 (Ahilyanagar, MH)</span>
            <span className="hidden sm:inline">EPSG:4326 • SENTINEL-2 L2A</span>
            <span className="shrink-0">PMKSY-WDC 2.0</span>
          </div>
        </footer>
      </div>
    </>
  );
}
