import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getBivariateCorrelation,
  getBivariateScatter,
  getBivariateGroupedBar,
} from '../../api';
import type { UploadResponse } from '../../types/api';
import { ScatterPlot } from '../charts/ScatterPlot';
import { GroupedBar } from '../charts/GroupedBar';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { StatsCard } from '../common/StatsCard';
import { GitCompare, ChevronDown, Activity, AlertCircle } from 'lucide-react';

interface BivariateSectionProps {
  dataset: UploadResponse;
}

export const BivariateSection: React.FC<BivariateSectionProps> = ({ dataset }) => {
  // Default selection: ColX = first numeric (or first column), ColY = second numeric
  const [colX, setColX] = useState<string>(dataset.columns[0]?.name || '');
  const [colY, setColY] = useState<string>(dataset.columns[1]?.name || dataset.columns[0]?.name || '');

  useEffect(() => {
    if (dataset.columns.length >= 2 && (!colX || !colY)) {
      setColX(dataset.columns[0].name);
      setColY(dataset.columns[1].name);
    }
  }, [dataset, colX, colY]);

  const colXInfo = dataset.columns.find((c) => c.name === colX);
  const colYInfo = dataset.columns.find((c) => c.name === colY);

  const isXNumeric = colXInfo?.type.toLowerCase() === 'numeric';
  const isYNumeric = colYInfo?.type.toLowerCase() === 'numeric';

  const bothNumeric = isXNumeric && isYNumeric;
  const oneCatOneNum = (isXNumeric && !isYNumeric) || (!isXNumeric && isYNumeric);

  // Grouping / metric assignment for One Categorical & One Numeric
  const catCol = !isXNumeric ? colX : colY;
  const numCol = isXNumeric ? colX : colY;

  // React Queries
  const { data: correlationData, isLoading: isCorrLoading } = useQuery({
    queryKey: ['bivariateCorrelation', dataset.datasetId, colX, colY],
    queryFn: () => getBivariateCorrelation(dataset.datasetId, colX, colY),
    enabled: bothNumeric && !!colX && !!colY,
    staleTime: 5 * 60 * 1000,
  });

  const { data: scatterData, isLoading: isScatterLoading } = useQuery({
    queryKey: ['bivariateScatter', dataset.datasetId, colX, colY],
    queryFn: () => getBivariateScatter(dataset.datasetId, colX, colY),
    enabled: bothNumeric && !!colX && !!colY,
    staleTime: 5 * 60 * 1000,
  });

  const { data: groupedBarData, isLoading: isGroupedLoading } = useQuery({
    queryKey: ['bivariateGroupedBar', dataset.datasetId, catCol, numCol],
    queryFn: () => getBivariateGroupedBar(dataset.datasetId, catCol, numCol),
    enabled: oneCatOneNum && !!catCol && !!numCol,
    staleTime: 5 * 60 * 1000,
  });

  const getCorrBadgeColor = (val?: number | null) => {
    if (val === undefined || val === null) return 'slate';
    const abs = Math.abs(val);
    if (abs >= 0.7) return 'accent';
    if (abs >= 0.4) return 'green';
    return 'slate';
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* 2 Dropdowns Selector Bar */}
      <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#121212] border border-[#7D8CA3]/20 text-[#F2DC5D]">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-[#7D8CA3] uppercase tracking-wider">
              Bivariate Variable Selection
            </span>
            <p className="text-xs text-slate-300">Compare relationship between Variable X and Variable Y</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Col X Selector */}
          <div className="relative w-full sm:w-56">
            <span className="block text-[10px] font-mono text-[#7D8CA3] mb-1">Column X (Horizontal)</span>
            <div className="relative">
              <select
                value={colX}
                onChange={(e) => setColX(e.target.value)}
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

          {/* Col Y Selector */}
          <div className="relative w-full sm:w-56">
            <span className="block text-[10px] font-mono text-[#7D8CA3] mb-1">Column Y (Vertical)</span>
            <div className="relative">
              <select
                value={colY}
                onChange={(e) => setColY(e.target.value)}
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
      </div>

      {/* Case 1: Both Numerical -> Pearson Correlation & Scatter Plot */}
      {bothNumeric && (
        <>
          {/* Correlation Metric Cards */}
          {isCorrLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <LoadingSkeleton type="card" />
              <LoadingSkeleton type="card" />
              <LoadingSkeleton type="card" />
            </div>
          ) : correlationData ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard
                title="Pearson Correlation (r)"
                value={correlationData.correlation?.toFixed(3) ?? 'N/A'}
                subtitle="Linear dependency (-1.0 to +1.0)"
                icon={Activity}
                badgeText={
                  correlationData.correlation === null
                    ? 'Undefined'
                    : Math.abs(correlationData.correlation || 0) >= 0.7
                    ? 'Strong Correlation'
                    : Math.abs(correlationData.correlation || 0) >= 0.4
                    ? 'Moderate'
                    : 'Weak Correlation'
                }
                badgeColor={getCorrBadgeColor(correlationData.correlation)}
              />

              <StatsCard
                title="Covariance"
                value={correlationData.covariance?.toFixed(3) ?? 'N/A'}
                subtitle="Directional joint variability"
                icon={Activity}
                badgeText="Sample Cov"
              />

              <StatsCard
                title="Paired Sample Size"
                value={correlationData.sampleSize}
                subtitle="Non-null pairs analyzed"
                badgeText="Polars Cleaned"
                badgeColor="green"
              />
            </div>
          ) : null}

          {/* Scatter Plot */}
          {isScatterLoading ? (
            <LoadingSkeleton type="chart" />
          ) : (
            <ScatterPlot data={scatterData || []} colX={colX} colY={colY} />
          )}
        </>
      )}

      {/* Case 2: One Categorical & One Numeric -> Grouped Bar Chart */}
      {oneCatOneNum && (
        <>
          {isGroupedLoading ? (
            <LoadingSkeleton type="chart" />
          ) : (
            <GroupedBar data={groupedBarData || []} colX={catCol} colY={numCol} />
          )}
        </>
      )}

      {/* Case 3: Both Categorical (Edge Fallback) */}
      {!bothNumeric && !oneCatOneNum && (
        <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-[#F2DC5D] mx-auto" />
          <h4 className="text-sm font-bold text-white">Both Selected Columns are Categorical</h4>
          <p className="text-xs text-[#7D8CA3] max-w-md mx-auto">
            Please select at least one numeric variable (either Column X or Column Y) to view correlation scatter plots or grouped metric bar charts.
          </p>
        </div>
      )}
    </div>
  );
};
