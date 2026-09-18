'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  RefreshCw, 
  ShieldCheck, 
  CornerDownLeft, 
  HelpCircle,
  Layers,
  Droplet,
  AlertTriangle,
  FileText,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

import { getWatershedDataset } from '@/data/demoWatershedData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface WatershedCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
  onSelectFeature?: (id: string) => void;
  watershedId?: string;
}

const starterPrompts = [
  {
    icon: AlertTriangle,
    title: 'Vulnerable Priority Zones',
    prompt: 'Which sub-catchment priority zones require immediate intervention, and what civil structures are recommended?'
  },
  {
    icon: Droplet,
    title: 'Groundwater Table Recovery',
    prompt: 'Summarize the groundwater table recovery observed across the benchmark open dug-wells between 2021 and 2026.'
  },
  {
    icon: Layers,
    title: 'Check Dam CD-01 Verification',
    prompt: 'What is the condition and siltation status of Check Dam CD-01, and what remediation action is logged in the asset ledger?'
  },
  {
    icon: ShieldCheck,
    title: 'TAWDEVA & PWD-WRO Integration',
    prompt: 'Explain how WATERSHED360 integrates with Tamil Nadu TAWDEVA and PWD Water Resources Department.'
  },
  {
    icon: FileText,
    title: 'Collector Executive Brief',
    prompt: 'Draft an executive briefing note for the District Collector summarizing the key outcomes under WDC-PMKSY 2.0.'
  }
];

export default function WatershedCopilot({ isOpen, onClose, onNavigateTab, onSelectFeature, watershedId = 'bhavani' }: WatershedCopilotProps) {
  const dataset = getWatershedDataset(watershedId);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `👋 **Welcome to the WATERSHED360 AI Copilot.**

I am your geospatial intelligence advisor, grounded directly on the real dataset of **${dataset.stats.name}** (*${dataset.stats.district} • ${dataset.stats.catchmentHa.toLocaleString()} Ha • ${dataset.stats.code}*).

I can assist you with:
* **Asset Health & Siltation**: Inspecting ${dataset.interventions.length} georeferenced structures (${dataset.interventions[0]?.code || 'CD-01'} to ${dataset.interventions[dataset.interventions.length - 1]?.code || 'FP-02'})
* **Groundwater Recovery**: Telemetry from ${dataset.wells.length} benchmark Tamil Nadu PWD dug-wells (${dataset.stats.rechargeRateMeters} mean lift)
* **Multi-Temporal Analysis**: 2021 vs 2026 NDVI canopy accretion (${dataset.stats.meanNdviDelta} delta)
* **Priority Zone Triage**: MCDA slope, soil loss, and intervention work packages
* **Executive Reporting**: Drafting WDC-PMKSY 2.0 sanction briefs

How can I assist your evaluation today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    setMessages([
      {
        id: `welcome-${watershedId}`,
        role: 'assistant',
        text: `👋 **Welcome to the WATERSHED360 AI Copilot.**

I am your geospatial intelligence advisor, grounded directly on the real dataset of **${dataset.stats.name}** (*${dataset.stats.district} • ${dataset.stats.catchmentHa.toLocaleString()} Ha • ${dataset.stats.code}*).

I can assist you with:
* **Asset Health & Siltation**: Inspecting ${dataset.interventions.length} georeferenced structures (${dataset.interventions[0]?.code || 'CD-01'} to ${dataset.interventions[dataset.interventions.length - 1]?.code || 'FP-02'})
* **Groundwater Recovery**: Telemetry from ${dataset.wells.length} benchmark Tamil Nadu PWD dug-wells (${dataset.stats.rechargeRateMeters} mean lift)
* **Multi-Temporal Analysis**: 2021 vs 2026 NDVI canopy accretion (${dataset.stats.meanNdviDelta} delta)
* **Priority Zone Triage**: MCDA slope, soil loss, and intervention work packages
* **Executive Reporting**: Drafting WDC-PMKSY 2.0 sanction briefs

How can I assist your evaluation today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [watershedId]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          history: messages.slice(-6).map(m => ({ role: m.role, text: m.text })),
          watershedId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.answer || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: `⚠️ **Unable to complete AI Copilot request.**\n\n*Details*: ${err?.message || 'Network error'}. Please ensure the server has \`GEMINI_API_KEY\` set in \`.env.local\`.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div 
        className={`bg-[#0B0F15] border-l border-[#2DD4BF]/40 h-full flex flex-col shadow-2xl shadow-[#2DD4BF]/10 transition-all duration-300 relative ${
          isExpanded ? 'w-full md:w-[75vw] lg:w-[60vw]' : 'w-full md:w-[480px] lg:w-[520px]'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#233041] bg-[#131A24]/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 text-[#2DD4BF] relative">
              <Sparkles className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">
                  WATERSHED360 AI Copilot
                </h3>
                <span className="text-[9px] font-mono font-bold bg-[#2DD4BF]/20 text-[#2DD4BF] px-1.5 py-0.5 rounded border border-[#2DD4BF]/40">
                  GEMINI GROUNDED
                </span>
              </div>
              <p className="text-[10px] text-[#94A3B8] font-mono">
                Micro-Catchment 4E2B5c-09 Ground-Truth Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-[#94A3B8] hover:text-[#F1F5F9] rounded-lg hover:bg-[#182230] transition-colors"
              title={isExpanded ? 'Collapse width' : 'Expand width'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#94A3B8] hover:text-[#F1F5F9] rounded-lg hover:bg-[#182230] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Data Grounding Banner */}
        <div className="bg-[#101E2E]/60 border-b border-[#233041] px-4 py-2 flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
          <span className="flex items-center gap-1.5 text-[#38BDF8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Grounded on 12 Assets • 6 Wells • 1,842.5 Ha Catchment</span>
          </span>
          <span className="text-[#10B981] font-bold">ZERO HALLUCINATION POLICY</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF] shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div 
                className={`max-w-[85%] rounded-2xl p-4 space-y-2 leading-relaxed shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-semibold rounded-tr-none'
                    : 'bg-[#131A24] border border-[#233041] text-[#F1F5F9] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {msg.text}
                </div>
                {msg.role === 'assistant' && onSelectFeature && (
                  (() => {
                    const match = msg.text.match(/\b(CD-0[1-6]|PT-01|FP-0[1-2]|CCT-01|PZ-0[1-4]|Zone [A-D])\b/i);
                    if (!match) return null;
                    const matchedName = match[1];
                    let targetId = matchedName.toLowerCase();
                    if (/cd-01/i.test(matchedName)) targetId = 'int-01';
                    else if (/cd-02/i.test(matchedName)) targetId = 'int-02';
                    else if (/cd-03/i.test(matchedName)) targetId = 'int-03';
                    else if (/cd-04/i.test(matchedName)) targetId = 'int-04';
                    else if (/pt-01/i.test(matchedName)) targetId = 'int-05';
                    else if (/fp-01/i.test(matchedName)) targetId = 'int-06';
                    else if (/cct-01/i.test(matchedName)) targetId = 'int-07';
                    else if (/cd-05/i.test(matchedName)) targetId = 'int-08';
                    else if (/zone a/i.test(matchedName) || /pz-01/i.test(matchedName)) targetId = 'pz-01';
                    else if (/zone b/i.test(matchedName) || /pz-02/i.test(matchedName)) targetId = 'pz-02';
                    else if (/zone c/i.test(matchedName) || /pz-03/i.test(matchedName)) targetId = 'pz-03';
                    else if (/zone d/i.test(matchedName) || /pz-04/i.test(matchedName)) targetId = 'pz-04';

                    return (
                      <div className="pt-2 border-t border-[#233041] flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[#94A3B8]">Associated Feature: <strong className="text-[#2DD4BF]">{matchedName}</strong></span>
                        <button
                          onClick={() => {
                            onSelectFeature(targetId);
                            if (onNavigateTab) onNavigateTab('gis');
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-[#0B0F15] hover:bg-[#2DD4BF] hover:text-[#0B0F15] border border-[#233041] rounded-lg text-[10px] font-bold text-[#2DD4BF] transition-all"
                        >
                          Locate in GIS →
                        </button>
                      </div>
                    );
                  })()
                )}
                <div className={`text-[9px] flex justify-end ${msg.role === 'user' ? 'text-[#0B0F15]/70' : 'text-[#94A3B8]'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-xs text-[#2DD4BF] font-mono animate-pulse">
              <div className="w-7 h-7 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 flex items-center justify-center text-[#2DD4BF] shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-[#131A24] rounded-2xl border border-[#233041] flex items-center gap-2">
                <span>Gemini analyzing watershed telemetry...</span>
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

        {/* Suggested Starter Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-[#233041] bg-[#0B0F15]">
            <div className="text-[10px] font-mono text-[#94A3B8] uppercase font-bold mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>Suggested Grounded Prompts:</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {starterPrompts.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="p-2 rounded-xl bg-[#131A24] hover:bg-[#182230] border border-[#233041] hover:border-[#2DD4BF]/50 text-left text-xs font-mono text-[#F1F5F9] transition-all flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Icon className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2DD4BF] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-[#233041] bg-[#131A24] shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about wells, NDVI, interventions, siltation..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-[#0B0F15] border border-[#233041] rounded-xl text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#2DD4BF] transition-colors placeholder-[#64748B]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#2DD4BF]/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
