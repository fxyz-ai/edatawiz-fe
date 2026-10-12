import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getMultivariateGroupedScatter,
  getMultivariateGroupedComparison,
} from '../../api';
import type { UploadResponse } from '../../types/api';
import { GroupedScatterPlot } from '../charts/GroupedScatterPlot';
import { GroupedBar } from '../charts/GroupedBar';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { Network, ChevronDown, Layers, BarChart2 } from 'lucide-react';

interface MultivariateSectionProps {
  dataset: UploadResponse;
}

export const MultivariateSection: React.FC<MultivariateSectionProps> = ({ dataset }) => {
  const numericCols = dataset.columns.filter((c) => c.type.toLowerCase() === 'numeric');
  const catCols = dataset.columns.filter((c) => c.type.toLowerCase() !== 'numeric');

  // Mode Selection: 'grouped-scatter' | 'multi-metric'
  const [analysisMode, setAnalysisMode] = useState<'grouped-scatter' | 'multi-metric'>('grouped-scatter');

  // State for Grouped Scatter (Numeric X, Numeric Y, GroupBy Cat)
  const [colX, setColX] = useState<string>(numericCols[0]?.name || dataset.columns[0]?.name || '');
  const [colY, setColY] = useState<string>(numericCols[1]?.name || numericCols[0]?.name || dataset.columns[0]?.name || '');
  const [groupBy, setGroupBy] = useState<string>(catCols[0]?.name || dataset.columns[0]?.name || '');

  // State for Multi-Metric (GroupCol Cat, Metric 1 Num, Metric 2 Num)
  const [groupCol, setGroupCol] = useState<string>(catCols[0]?.name || dataset.columns[0]?.name || '');
  const [metric1, setMetric1] = useState<string>(numericCols[0]?.name || dataset.columns[0]?.name || '');
  const [metric2, setMetric2] = useState<string>(numericCols[1]?.name || numericCols[0]?.name || dataset.columns[0]?.name || '');

  useEffect(() => {
    if (numericCols.length >= 2) {
      if (!colX) setColX(numericCols[0].name);
      if (!colY) setColY(numericCols[1].name);
      if (!metric1) setMetric1(numericCols[0].name);
      if (!metric2) setMetric2(numericCols[1].name);
    }
    if (catCols.length > 0) {
      if (!groupBy) setGroupBy(catCols[0].name);
      if (!groupCol) setGroupCol(catCols[0].name);
    }
  }, [dataset, numericCols, catCols, colX, colY, groupBy, groupCol, metric1, metric2]);

  // React Queries
  const { data: groupedScatterData, isLoading: isScatterLoading } = useQuery({
    queryKey: ['multivariateGroupedScatter', dataset.datasetId, colX, colY, groupBy],
    queryFn: () => getMultivariateGroupedScatter(dataset.datasetId, colX, colY, groupBy),
    enabled: analysisMode === 'grouped-scatter' && !!colX && !!colY && !!groupBy,
    staleTime: 5 * 60 * 1000,
  });

  const { data: groupedComparisonData, isLoading: isComparisonLoading } = useQuery({
    queryKey: ['multivariateGroupedComparison', dataset.datasetId, groupCol, metric1, metric2],
    queryFn: () => getMultivariateGroupedComparison(dataset.datasetId, groupCol, metric1, metric2),
    enabled: analysisMode === 'multi-metric' && !!groupCol && !!metric1 && !!metric2,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Mode Switcher Header */}
      <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#121212] border border-[#7D8CA3]/20 text-[#F2DC5D]">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-[#7D8CA3] uppercase tracking-wider">
              Multivariate Exploration Mode
            </span>
            <p className="text-xs text-slate-300 font-sans">Analyze 3+ variables simultaneously via category grouping</p>
          </div>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center p-1 rounded-lg bg-[#121212] border border-[#7D8CA3]/20">
          <button
            onClick={() => setAnalysisMode('grouped-scatter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              analysisMode === 'grouped-scatter'
                ? 'bg-[#F2DC5D] text-black shadow-md'
                : 'text-[#7D8CA3] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Grouped Scatter
          </button>
          <button
            onClick={() => setAnalysisMode('multi-metric')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              analysisMode === 'multi-metric'
                ? 'bg-[#F2DC5D] text-black shadow-md'
                : 'text-[#7D8CA3] hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" /> Multi-Metric Comparison
          </button>
        </div>
      </div>

      {/* Selectors for Mode 1: Grouped Scatter */}
      {analysisMode === 'grouped-scatter' && (
        <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-mono text-[#7D8CA3] mb-1">Numeric X Axis</label>
            <div className="relative">
              <select
                value={colX}
                onChange={(e) => setColX(e.target.value)}
                className="w-full appearance-none bg-[#121212] border border-[#7D8CA3]/40 rounded-lg px-3 py-2 pr-8 text-xs font-mono font-medium text-white focus:outline-none focus:border-[#F2DC5D] cursor-pointer"
              >
                {numericCols.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#181A20]">
                    🔢 {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#7D8CA3] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#7D8CA3] mb-1">Numeric Y Axis</label>
            <div className="relative">
              <select
                value={colY}
                onChange={(e) => setColY(e.target.value)}
                className="w-full appearance-none bg-[#121212] border border-[#7D8CA3]/40 rounded-lg px-3 py-2 pr-8 text-xs font-mono font-medium text-white focus:outline-none focus:border-[#F2DC5D] cursor-pointer"
              >
                {numericCols.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#181A20]">
                    🔢 {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#7D8CA3] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#7D8CA3] mb-1">Grouping Category</label>
            <div className="relative">
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full appearance-none bg-[#121212] border border-[#7D8CA3]/40 rounded-lg px-3 py-2 pr-8 text-xs font-mono font-medium text-white focus:outline-none focus:border-[#F2DC5D] cursor-pointer"
              >
                {dataset.columns.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#181A20]">
                    {c.type === 'numeric' ? '🔢 ' : '🔤 '} {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#7D8CA3] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* Selectors for Mode 2: Multi-Metric Comparison */}
      {analysisMode === 'multi-metric' && (
        <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-mono text-[#7D8CA3] mb-1">Grouping Categorical Column</label>
            <div className="relative">
              <select
                value={groupCol}
                onChange={(e) => setGroupCol(e.target.value)}
                className="w-full appearance-none bg-[#121212] border border-[#7D8CA3]/40 rounded-lg px-3 py-2 pr-8 text-xs font-mono font-medium text-white focus:outline-none focus:border-[#F2DC5D] cursor-pointer"
              >
                {dataset.columns.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#181A20]">
                    {c.type === 'numeric' ? '🔢 ' : '🔤 '} {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#7D8CA3] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#7D8CA3] mb-1">First Metric Column (Yellow)</label>
            <div className="relative">
              <select
                value={metric1}
                onChange={(e) => setMetric1(e.target.value)}
                className="w-full appearance-none bg-[#121212] border border-[#7D8CA3]/40 rounded-lg px-3 py-2 pr-8 text-xs font-mono font-medium text-white focus:outline-none focus:border-[#F2DC5D] cursor-pointer"
              >
                {numericCols.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#181A20]">
                    🔢 {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#7D8CA3] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#7D8CA3] mb-1">Second Metric Column (Slate)</label>
            <div className="relative">
              <select
                value={metric2}
                onChange={(e) => setMetric2(e.target.value)}
                className="w-full appearance-none bg-[#121212] border border-[#7D8CA3]/40 rounded-lg px-3 py-2 pr-8 text-xs font-mono font-medium text-white focus:outline-none focus:border-[#F2DC5D] cursor-pointer"
              >
                {numericCols.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#181A20]">
                    🔢 {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#7D8CA3] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* Render Mode 1 Visualization */}
      {analysisMode === 'grouped-scatter' && (
        isScatterLoading ? (
          <LoadingSkeleton type="chart" />
        ) : (
          <GroupedScatterPlot
            data={groupedScatterData || []}
            colX={colX}
            colY={colY}
            groupBy={groupBy}
          />
        )
      )}

      {/* Render Mode 2 Visualization */}
      {analysisMode === 'multi-metric' && (
        isComparisonLoading ? (
          <LoadingSkeleton type="chart" />
        ) : (
          <GroupedBar
            data={groupedComparisonData || []}
            colX={groupCol}
            colY={metric1}
            secondMetricCol={metric2}
          />
        )
      )}
    </div>
  );
};
