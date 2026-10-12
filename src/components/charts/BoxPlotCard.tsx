import React from 'react';
import type { BoxplotResponse } from '../../types/api';
import { BoxSelect, AlertCircle } from 'lucide-react';

interface BoxPlotCardProps {
  data: BoxplotResponse | null;
  columnName: string;
  lowerWhisker?: number | null;
  upperWhisker?: number | null;
  outliersCount?: number;
  outliersPct?: number;
}

export const BoxPlotCard: React.FC<BoxPlotCardProps> = ({
  data,
  columnName,
  lowerWhisker,
  upperWhisker,
  outliersCount,
  outliersPct,
}) => {
  if (!data || data.min === null || data.max === null) {
    return (
      <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 flex items-center gap-3 text-xs text-[#7D8CA3]">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Box plot metrics are not available for this column (all missing or invalid numeric data).</span>
      </div>
    );
  }

  const { min = 0, q1 = 0, median = 0, q3 = 0, max = 0, outliers = [] } = data;
  const safeMin = min ?? 0;
  const safeQ1 = q1 ?? 0;
  const safeMedian = median ?? 0;
  const safeQ3 = q3 ?? 0;
  const safeMax = max ?? 0;

  const actualOutliersCount = outliersCount ?? outliers.length;

  // Calculate percentage positions for visual boxplot bar
  const range = (safeMax - safeMin) || 1;
  const q1Pos = Math.max(0, Math.min(100, ((safeQ1 - safeMin) / range) * 100));
  const q3Pos = Math.max(0, Math.min(100, ((safeQ3 - safeMin) / range) * 100));

  return (
    <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#F2DC5D]/10 text-[#F2DC5D]">
            <BoxSelect className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-sans">
              Five-Number Summary & Outliers &bull; <span className="text-[#F2DC5D] font-mono">{columnName}</span>
            </h3>
            <p className="text-xs text-[#7D8CA3]">Box plot summary percentiles and extreme outlier points</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lowerWhisker !== undefined && lowerWhisker !== null && upperWhisker !== undefined && upperWhisker !== null && (
            <span
              className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#121212] text-slate-300 border border-[#7D8CA3]/30"
              title="1.5x IQR Outlier Boundary Thresholds"
            >
              Cutoff: [{lowerWhisker.toLocaleString()} &rarr; {upperWhisker.toLocaleString()}]
            </span>
          )}
          <span
            className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
              actualOutliersCount > 0
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 font-semibold'
                : 'bg-[#121212] text-emerald-400 border-emerald-500/30'
            }`}
          >
            Outliers: {actualOutliersCount} {outliersPct !== undefined ? `(${outliersPct.toFixed(1)}%)` : ''}
          </span>
        </div>
      </div>

      {/* Visual Box-Whisker Diagram */}
      <div className="pt-4 pb-2 px-4 bg-[#121212] rounded-xl border border-[#7D8CA3]/10 relative">
        <div className="relative h-12 flex items-center">
          {/* Whisker Line (Min to Max) */}
          <div className="absolute left-0 right-0 h-0.5 bg-[#7D8CA3]/50" />

          {/* Min & Max Caps */}
          <div className="absolute left-0 h-4 w-0.5 bg-[#7D8CA3]" />
          <div className="absolute right-0 h-4 w-0.5 bg-[#7D8CA3]" />

          {/* Interquartile Box (Q1 to Q3) */}
          <div
            className="absolute h-8 rounded bg-[#F2DC5D]/20 border-2 border-[#F2DC5D] flex items-center justify-center shadow-md shadow-[#F2DC5D]/10"
            style={{
              left: `${q1Pos}%`,
              width: `${Math.max(2, q3Pos - q1Pos)}%`,
            }}
          >
            {/* Median Marker Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#F2DC5D] shadow"
              style={{ left: `${((safeMedian - safeQ1) / (safeQ3 - safeQ1 || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Labels under the diagram */}
        <div className="flex justify-between text-[10px] font-mono text-[#7D8CA3] pt-2 border-t border-[#7D8CA3]/10">
          <span>Min: {safeMin.toLocaleString()}</span>
          <span>Q1: {safeQ1.toLocaleString()}</span>
          <span className="text-[#F2DC5D] font-bold">Med: {safeMedian.toLocaleString()}</span>
          <span>Q3: {safeQ3.toLocaleString()}</span>
          <span>Max: {safeMax.toLocaleString()}</span>
        </div>
      </div>

      {/* 5 Metric Badge Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#121212] p-3 rounded-lg border border-[#7D8CA3]/15 text-center">
          <span className="block text-[10px] font-semibold text-[#7D8CA3] uppercase">Min</span>
          <span className="text-sm font-bold font-mono text-white">{safeMin.toLocaleString()}</span>
        </div>

        <div className="bg-[#121212] p-3 rounded-lg border border-[#7D8CA3]/15 text-center">
          <span className="block text-[10px] font-semibold text-[#7D8CA3] uppercase">Q1 (25%)</span>
          <span className="text-sm font-bold font-mono text-white">{safeQ1.toLocaleString()}</span>
        </div>

        <div className="bg-[#121212] p-3 rounded-lg border border-[#F2DC5D]/30 text-center bg-[#F2DC5D]/5">
          <span className="block text-[10px] font-semibold text-[#F2DC5D] uppercase">Median (50%)</span>
          <span className="text-sm font-bold font-mono text-[#F2DC5D]">{safeMedian.toLocaleString()}</span>
        </div>

        <div className="bg-[#121212] p-3 rounded-lg border border-[#7D8CA3]/15 text-center">
          <span className="block text-[10px] font-semibold text-[#7D8CA3] uppercase">Q3 (75%)</span>
          <span className="text-sm font-bold font-mono text-white">{safeQ3.toLocaleString()}</span>
        </div>

        <div className="bg-[#121212] p-3 rounded-lg border border-[#7D8CA3]/15 text-center">
          <span className="block text-[10px] font-semibold text-[#7D8CA3] uppercase">Max</span>
          <span className="text-sm font-bold font-mono text-white">{safeMax.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
