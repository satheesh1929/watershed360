'use client';

import React, { useState } from 'react';
import { 
  FileCheck2, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  BarChart2, 
  RefreshCw,
  Info,
  Sliders,
  Table
} from 'lucide-react';
import DataBadge from '@/components/common/DataBadge';

interface ValidationSample {
  id: string;
  feature: string;
  groundTruth: 'PRESENT' | 'ABSENT';
  modelPrediction: 'PRESENT' | 'ABSENT';
  confidence: number;
  latitude: number;
  longitude: number;
}

export default function ResearchValidationWorkbench() {
  // Ground truth sample benchmark points
  const [samples, setSamples] = useState<ValidationSample[]>([
    { id: 'VAL-01', feature: 'Water Body (NDWI > 0.12)', groundTruth: 'PRESENT', modelPrediction: 'PRESENT', confidence: 0.96, latitude: 19.1852, longitude: 74.6954 },
    { id: 'VAL-02', feature: 'Water Body (NDWI > 0.12)', groundTruth: 'PRESENT', modelPrediction: 'PRESENT', confidence: 0.94, latitude: 19.1654, longitude: 74.7251 },
    { id: 'VAL-03', feature: 'Water Body (NDWI > 0.12)', groundTruth: 'ABSENT', modelPrediction: 'ABSENT', confidence: 0.98, latitude: 19.2305, longitude: 74.6402 },
    { id: 'VAL-04', feature: 'Water Body (NDWI > 0.12)', groundTruth: 'PRESENT', modelPrediction: 'PRESENT', confidence: 0.91, latitude: 19.1802, longitude: 74.7081 },
    { id: 'VAL-05', feature: 'Water Body (NDWI > 0.12)', groundTruth: 'ABSENT', modelPrediction: 'ABSENT', confidence: 0.89, latitude: 19.2150, longitude: 74.6652 },
    { id: 'VAL-06', feature: 'Water Body (NDWI > 0.12)', groundTruth: 'PRESENT', modelPrediction: 'ABSENT', confidence: 0.72, latitude: 19.1720, longitude: 74.6820 }, // False Negative (turbid pond)
    { id: 'VAL-07', feature: 'Water Body (NDWI > 0.12)', groundTruth: 'ABSENT', modelPrediction: 'PRESENT', confidence: 0.68, latitude: 19.1452, longitude: 74.7450 }, // False Positive (wet black soil shadow)
    { id: 'VAL-08', feature: 'Water Body (NDWI > 0.12)', groundTruth: 'ABSENT', modelPrediction: 'ABSENT', confidence: 0.95, latitude: 19.2201, longitude: 74.6550 },
    { id: 'VAL-09', feature: 'Water Body (NDWI > 0.12)', groundTruth: 'PRESENT', modelPrediction: 'PRESENT', confidence: 0.93, latitude: 19.1830, longitude: 74.6980 },
    { id: 'VAL-10', feature: 'Water Body (NDWI > 0.12)', groundTruth: 'PRESENT', modelPrediction: 'PRESENT', confidence: 0.95, latitude: 19.1680, longitude: 74.7220 }
  ]);

  const [datasetName, setDatasetName] = useState('Ground-Truth Validation Set (Ahilyanagar Field Campaign)');

  // Compute Confusion Matrix
  const tp = samples.filter((s) => s.groundTruth === 'PRESENT' && s.modelPrediction === 'PRESENT').length;
  const fp = samples.filter((s) => s.groundTruth === 'ABSENT' && s.modelPrediction === 'PRESENT').length;
  const fn = samples.filter((s) => s.groundTruth === 'PRESENT' && s.modelPrediction === 'ABSENT').length;
  const tn = samples.filter((s) => s.groundTruth === 'ABSENT' && s.modelPrediction === 'ABSENT').length;

  const total = tp + fp + fn + tn;
  const accuracy = total > 0 ? ((tp + tn) / total) : 0;
  const precision = (tp + fp) > 0 ? (tp / (tp + fp)) : 0;
  const recall = (tp + fn) > 0 ? (tp / (tp + fn)) : 0;
  const f1 = (precision + recall) > 0 ? ((2 * precision * recall) / (precision + recall)) : 0;
  const iou = (tp + fp + fn) > 0 ? (tp / (tp + fp + fn)) : 0;

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Sample ID,Feature,Ground Truth,Model Prediction,Confidence,Latitude,Longitude\n" +
      samples.map(s => `${s.id},${s.feature},${s.groundTruth},${s.modelPrediction},${s.confidence},${s.latitude},${s.longitude}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'validation-ground-truth-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-[1500px] mx-auto pb-14 font-mono text-xs">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F1F5F9] font-sans">
              Research Validation Workbench & Scientific Accuracy Assessment
            </h2>
            <DataBadge status="VERIFIED" compact />
          </div>
          <p className="text-xs text-[#94A3B8]">
            Evaluates the mathematical reliability of satellite raster classifications and AI structural observations against ground-truth GNSS reference data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#06B6D4] text-[#0B0F15] font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#2DD4BF]/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Accuracy Report CSV</span>
          </button>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="glass-panel rounded-2xl p-4 text-center space-y-1">
          <span className="text-[10px] text-[#94A3B8] uppercase font-bold">Overall Accuracy:</span>
          <div className="text-2xl font-bold text-[#10B981]">{(accuracy * 100).toFixed(1)}%</div>
          <span className="text-[10px] text-[#94A3B8]">(TP + TN) / Total</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 text-center space-y-1">
          <span className="text-[10px] text-[#94A3B8] uppercase font-bold">Precision:</span>
          <div className="text-2xl font-bold text-[#38BDF8]">{(precision * 100).toFixed(1)}%</div>
          <span className="text-[10px] text-[#94A3B8]">TP / (TP + FP)</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 text-center space-y-1">
          <span className="text-[10px] text-[#94A3B8] uppercase font-bold">Recall / Sensitivity:</span>
          <div className="text-2xl font-bold text-[#A855F7]">{(recall * 100).toFixed(1)}%</div>
          <span className="text-[10px] text-[#94A3B8]">TP / (TP + FN)</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 text-center space-y-1">
          <span className="text-[10px] text-[#94A3B8] uppercase font-bold">F1-Score:</span>
          <div className="text-2xl font-bold text-[#2DD4BF]">{(f1 * 100).toFixed(1)}%</div>
          <span className="text-[10px] text-[#94A3B8]">Harmonic Mean</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 text-center space-y-1">
          <span className="text-[10px] text-[#94A3B8] uppercase font-bold">Intersection over Union (IoU):</span>
          <div className="text-2xl font-bold text-[#F59E0B]">{(iou * 100).toFixed(1)}%</div>
          <span className="text-[10px] text-[#94A3B8]">Jaccard Index</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Confusion Matrix 2x2 Grid */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-6 space-y-4 border-[#2DD4BF]/30">
            <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
              <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">
                Confusion Matrix (2 × 2)
              </h3>
              <span className="text-[10px] text-[#2DD4BF] font-bold">N = {total} SAMPLES</span>
            </div>

            <div className="space-y-3 text-center">
              <div className="grid grid-cols-2 gap-3">
                {/* True Positive */}
                <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 space-y-1">
                  <div className="text-[10px] text-[#10B981] font-bold uppercase">True Positive (TP)</div>
                  <div className="text-3xl font-bold text-[#10B981]">{tp}</div>
                  <div className="text-[10px] text-[#94A3B8]">Ground Truth: Present • Model: Present</div>
                </div>

                {/* False Positive */}
                <div className="p-4 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/40 space-y-1">
                  <div className="text-[10px] text-[#F43F5E] font-bold uppercase">False Positive (FP)</div>
                  <div className="text-3xl font-bold text-[#F43F5E]">{fp}</div>
                  <div className="text-[10px] text-[#94A3B8]">Ground Truth: Absent • Model: Present</div>
                </div>

                {/* False Negative */}
                <div className="p-4 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/40 space-y-1">
                  <div className="text-[10px] text-[#F59E0B] font-bold uppercase">False Negative (FN)</div>
                  <div className="text-3xl font-bold text-[#F59E0B]">{fn}</div>
                  <div className="text-[10px] text-[#94A3B8]">Ground Truth: Present • Model: Absent</div>
                </div>

                {/* True Negative */}
                <div className="p-4 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/40 space-y-1">
                  <div className="text-[10px] text-[#38BDF8] font-bold uppercase">True Negative (TN)</div>
                  <div className="text-3xl font-bold text-[#38BDF8]">{tn}</div>
                  <div className="text-[10px] text-[#94A3B8]">Ground Truth: Absent • Model: Absent</div>
                </div>
              </div>

              <p className="text-[10px] text-[#94A3B8] text-left pt-2">
                Evaluates surface water classification threshold (NDWI &gt; 0.12) against GNSS in-situ physical surveys in Micro-Catchment 4E2B5c-09.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Ground-Truth Sample Ledger */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#233041]">
              <div>
                <h3 className="text-sm font-bold text-[#F1F5F9] font-sans">
                  Ground-Truth Validation Sample Points
                </h3>
                <p className="text-[10px] text-[#94A3B8] truncate">{datasetName}</p>
              </div>
              <span className="text-[10px] text-[#10B981] font-bold">10 BENCHMARKS</span>
            </div>

            <div className="overflow-x-auto max-h-[360px]">
              <table className="w-full text-left">
                <thead className="bg-[#0B0F15] text-[#94A3B8] border-b border-[#233041]">
                  <tr>
                    <th className="p-2.5">Sample</th>
                    <th className="p-2.5">Coordinates</th>
                    <th className="p-2.5">Ground Truth</th>
                    <th className="p-2.5">Model Pred</th>
                    <th className="p-2.5">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#233041]">
                  {samples.map((s) => {
                    const isMatch = s.groundTruth === s.modelPrediction;
                    return (
                      <tr key={s.id} className="hover:bg-[#182230]/40 transition-colors">
                        <td className="p-2.5 font-bold text-[#F1F5F9]">{s.id}</td>
                        <td className="p-2.5 text-[#94A3B8]">{s.latitude.toFixed(3)}°N, {s.longitude.toFixed(3)}°E</td>
                        <td className="p-2.5">{s.groundTruth}</td>
                        <td className="p-2.5">{s.modelPrediction}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            isMatch ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F43F5E]/20 text-[#F43F5E]'
                          }`}>
                            {isMatch ? 'CORRECT' : 'DISCREPANCY'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
