import React from 'react';
import type { UploadResponse } from '../types/api';
import { useDatasetStore } from '../store/useDatasetStore';
import {
  Monitor,
  Smartphone,
  BarChart3,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Table,
  CheckCircle2,
} from 'lucide-react';

interface MobileAdvisoryPageProps {
  dataset: UploadResponse;
  onProceedAnyway: () => void;
}

export const MobileAdvisoryPage: React.FC<MobileAdvisoryPageProps> = ({
  dataset,
  onProceedAnyway,
}) => {
  const resetDataset = useDatasetStore((state) => state.resetDataset);

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#F2DC5D]/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-sky-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Simple Header */}
      <header className="w-full bg-[#121212]/90 backdrop-blur-md border-b border-[#7D8CA3]/20 px-4 sm:px-6 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <img
            src="/edw-logo.png"
            alt="EDataWiz"
            className="w-8 h-8 rounded-lg shadow-md shadow-[#F2DC5D]/20 object-contain"
          />
          <span className="text-lg font-extrabold tracking-tight text-white font-sans">
            EData<span className="text-[#F2DC5D]">Wiz</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Analysis Ready</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="max-w-xl w-full bg-[#181A20] border border-[#7D8CA3]/25 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden animate-fade-up">
          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F2DC5D] via-sky-400 to-[#F2DC5D]" />

          {/* Badge & Icon Area */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#121212] border border-[#F2DC5D]/30 flex items-center justify-center text-[#F2DC5D] shadow-lg shadow-[#F2DC5D]/10">
                <Monitor className="w-8 h-8" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#181A20] border border-[#7D8CA3]/30 flex items-center justify-center text-[#7D8CA3]">
                <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#F2DC5D]/10 text-[#F2DC5D] border border-[#F2DC5D]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Desktop View Highly Recommended</span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-sans tracking-tight">
                Looks Best on a Bigger Screen
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-md mx-auto">
                Your dataset is fully processed! However, EDataWiz provides dense statistical tables, multi-bin distribution histograms, and box plots designed for desktop displays.
              </p>
            </div>
          </div>

          {/* Processed Dataset Summary Card */}
          <div className="bg-[#121212] border border-[#7D8CA3]/20 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-[#7D8CA3] pb-2 border-b border-[#7D8CA3]/15">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Upload Successful
              </span>
              <span>Dataset ID: {dataset.datasetId.slice(0, 8)}…</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileSpreadsheet className="w-4 h-4 text-[#F2DC5D] shrink-0" />
                <span className="text-sm font-bold text-white font-mono truncate" title={dataset.filename}>
                  {dataset.filename}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-[#181A20] text-slate-300 border border-[#7D8CA3]/20">
                  {dataset.rowCount.toLocaleString()} rows
                </span>
                <span className="px-2 py-0.5 rounded bg-[#181A20] text-slate-300 border border-[#7D8CA3]/20">
                  {dataset.columnCount} cols
                </span>
              </div>
            </div>
          </div>

          {/* Why Desktop Preview Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
            <div className="p-3 rounded-lg bg-[#121212]/60 border border-[#7D8CA3]/15 space-y-1">
              <div className="flex items-center gap-1.5 text-[#F2DC5D] text-xs font-bold font-mono">
                <Table className="w-3.5 h-3.5" />
                <span>Wide Tables</span>
              </div>
              <p className="text-[11px] text-[#7D8CA3] leading-snug">
                Full schema inspection with missing percentages & health tiers.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#121212]/60 border border-[#7D8CA3]/15 space-y-1">
              <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold font-mono">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Dense Charts</span>
              </div>
              <p className="text-[11px] text-[#7D8CA3] leading-snug">
                Interactive histograms, whisker box plots & frequency charts.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#121212]/60 border border-[#7D8CA3]/15 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-mono">
                <Layers className="w-3.5 h-3.5" />
                <span>Side-by-Side</span>
              </div>
              <p className="text-[11px] text-[#7D8CA3] leading-snug">
                Persistent sidebar navigation and multi-metric comparison.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={onProceedAnyway}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-bold bg-[#F2DC5D] text-black hover:bg-[#F2DC5D]/90 transition-all shadow-md shadow-[#F2DC5D]/20 cursor-pointer"
            >
              <span>Continue on Mobile Anyway</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={resetDataset}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono font-medium text-[#7D8CA3] hover:text-white bg-[#121212] hover:bg-[#1E222B] border border-[#7D8CA3]/20 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Upload a Different File</span>
            </button>
          </div>

          {/* Tip Note Footer */}
          <p className="text-center text-[11px] text-[#7D8CA3] font-sans">
            💡 <strong className="text-slate-300">Tip:</strong> Rotating your phone to landscape or opening this URL on your laptop will automatically activate the full desktop view.
          </p>
        </div>
      </main>
    </div>
  );
};
