'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Droplet, 
  Layers, 
  ExternalLink,
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';

import { getWatershedDataset } from '@/data/demoWatershedData';

interface CopilotModuleProps {
  onSelectFeature?: (id: string) => void;
  onNavigateTab?: (tab: string) => void;
  watershedId?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  relatedFeatureId?: string;
  timestamp: string;
}

const exampleQuestions = [
  {
    title: 'Erosion Risk',
    query: 'Which watershed areas have the highest erosion risk based on the available data?'
  },
  {
    title: 'Interventions Overview',
    query: 'Show the interventions in this watershed and their current status.'
  },
  {
    title: 'Satellite Change',
    query: 'What changed between the 2021 and 2026 Sentinel-2 satellite images?'
  },
  {
    title: 'Field Photo Triage',
    query: 'Which field photos need verification or maintenance action?'
  },
  {
    title: 'Vegetation Trend',
    query: 'Explain the vegetation trend in simple language.'
  }
];

export default function CopilotModule({ onSelectFeature, onNavigateTab, watershedId = 'bhavani' }: CopilotModuleProps) {
  const dataset = getWatershedDataset(watershedId);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'assistant',
      text: `**Direct Answer:** Welcome to the WATERSHED360 AI Copilot. I am your data-grounded geospatial assistant for **${dataset.stats.name}** (${dataset.stats.code}, ${dataset.stats.district}).

**Evidence Used:** 
* ${dataset.interventions.length} Civil Structures geolocated in TAWDEVA / AED Sanctioned Register
* Multi-temporal Sentinel-2 BOA Surface Reflectance (2021–2026)
* ${dataset.wells.length} Open Dug-Well Ground-Truth Soundings (Tamil Nadu PWD WRO)
* Copernicus 30m Global DEM & Strahler Stream Orders (1–4)

**Limitations:** 
* I only have verified records for ${dataset.stats.name} (${dataset.stats.code}). I will not extrapolate or invent numbers for unmonitored regions.

**Suggested Next Action:** Select any prompt below or ask a specific question about catchment interventions, vegetation, or water spread.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: `initial-${watershedId}`,
        role: 'assistant',
        text: `**Direct Answer:** Welcome to the WATERSHED360 AI Copilot. I am your data-grounded geospatial assistant for **${dataset.stats.name}** (${dataset.stats.code}, ${dataset.stats.district}).

**Evidence Used:** 
* ${dataset.interventions.length} Civil Structures geolocated in TAWDEVA / AED Sanctioned Register
* Multi-temporal Sentinel-2 BOA Surface Reflectance (2021–2026)
* ${dataset.wells.length} Open Dug-Well Ground-Truth Soundings (Tamil Nadu PWD WRO)
* Copernicus 30m Global DEM & Strahler Stream Orders (1–4)

**Limitations:** 
* I only have verified records for ${dataset.stats.name} (${dataset.stats.code}). I will not extrapolate or invent numbers for unmonitored regions.

**Suggested Next Action:** Select any prompt below or ask a specific question about catchment interventions, vegetation, or water spread.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [watershedId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (queryText?: string) => {
    const question = queryText || inputValue;
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history: messages.slice(-6).map(m => ({ role: m.role, text: m.text })),
          watershedId
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      
      // Detect if an intervention or zone ID was mentioned
      let featureMatch: string | undefined = undefined;
      const match = data.answer?.match(/\b(int-\d+|CD-\d+|PT-\d+|FP-\d+|PZ-\d+|pz-\d+)\b/i);
      if (match) {
        const found = match[1].toLowerCase();
        if (found.includes('cd-01')) featureMatch = 'int-01';
        else if (found.includes('cd-04')) featureMatch = 'int-04';
        else if (found.includes('pt-01')) featureMatch = 'int-05';
        else if (found.includes('fp-01')) featureMatch = 'int-06';
        else if (found.includes('pz-01')) featureMatch = 'pz-01';
        else featureMatch = found;
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.answer || 'The available data is not sufficient to answer this question.',
        relatedFeatureId: featureMatch,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: `**Direct Answer:** The request could not be processed.\n\n**Limitations:** ${err?.message || 'Network communication error'}. Please verify that GEMINI_API_KEY is configured on the server.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-4 animate-fadeIn pb-10">
      {/* Header & Context Bar */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
              Grounded Watershed AI Copilot
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] font-mono">
            Conversational geospatial assistant answering queries strictly grounded in connected catchment records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-[#0B0F15] border border-[#233041] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
            <span className="text-[#94A3B8]">Context:</span>
            <span className="text-[#2DD4BF] font-bold">4E2B5c-09 (12 Assets • 6 Wells)</span>
          </div>

          <button
            onClick={handleResetChat}
            className="p-2 rounded-xl bg-[#182230] hover:bg-[#1E2C3D] border border-[#233041] text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="glass-panel rounded-2xl border border-[#233041] flex flex-col h-[calc(100vh-230px)] min-h-[480px] sm:h-[620px] overflow-hidden bg-[#0B0F15]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3 sm:space-y-4 font-mono text-xs">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex gap-2.5 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF] shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}

              <div 
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 space-y-2 leading-relaxed shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-semibold rounded-tr-none'
                    : 'bg-[#131A24] border border-[#233041] text-[#F1F5F9] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Jump to Map Feature Button if Feature ID was Mentioned */}
                {msg.relatedFeatureId && onSelectFeature && (
                  <div className="pt-2 border-t border-[#233041] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <span className="text-[11px] text-[#94A3B8]">Associated Feature: <strong className="text-[#2DD4BF]">{msg.relatedFeatureId.toUpperCase()}</strong></span>
                    <button
                      onClick={() => {
                        onSelectFeature(msg.relatedFeatureId!);
                        if (onNavigateTab) onNavigateTab('gis');
                      }}
                      className="px-2.5 py-1 bg-[#0B0F15] hover:bg-[#2DD4BF] hover:text-[#0B0F15] border border-[#233041] rounded-lg text-[10px] font-bold text-[#2DD4BF] transition-all flex items-center gap-1 self-start sm:self-auto"
                    >
                      <span>Locate on GIS Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className={`text-[9px] flex justify-end ${msg.role === 'user' ? 'text-[#0B0F15]/70' : 'text-[#94A3B8]'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 sm:gap-3 justify-start items-center text-xs text-[#2DD4BF] font-mono animate-pulse">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF] shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              </div>
              <div className="p-3 bg-[#131A24] rounded-2xl border border-[#233041] flex items-center gap-2">
                <span className="text-[11px]">Reasoning over catchment records...</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Example Questions Section - Touch-Scrollable Chips */}
        <div className="px-3 sm:px-6 py-2 sm:py-3 border-t border-[#233041] bg-[#0E1520] space-y-1.5">
          <div className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Suggested Inquiries (Zero Invention):</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q.query)}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#131A24] hover:bg-[#182230] border border-[#233041] hover:border-[#2DD4BF]/50 text-[11px] sm:text-xs font-mono text-[#F1F5F9] transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <span className="text-[#2DD4BF]">↳</span>
                <span>{q.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-2.5 sm:p-4 border-t border-[#233041] bg-[#131A24]">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <input
              type="text"
              placeholder="Ask about verified interventions, satellite change, well recoveries..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-[#0B0F15] border border-[#233041] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-mono text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF]/40 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#2DD4BF]/20 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
