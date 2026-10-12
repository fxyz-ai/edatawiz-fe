import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getUnivariateProfile,
  getUnivariateBoxplot,
} from '../../api';
import type { UploadResponse } from '../../types/api';
import { HistogramChart } from '../charts/HistogramChart';
import { BoxPlotCard } from '../charts/BoxPlotCard';
import { FrequencyBar } from '../charts/FrequencyBar';
import { TopCategoriesTable } from '../charts/TopCategoriesTable';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { StatsCard } from '../common/StatsCard';
import {
  Hash,
  Type,
  Filter,
  ChevronDown,
  Sparkles,
  Percent,
  AlertTriangle,
  Layers,
  Activity,
  Gauge,
  HelpCircle,
} from 'lucide-react';

interface UnivariateSectionProps {
  dataset: UploadResponse;
}

export const UnivariateSection: React.FC<UnivariateSectionProps> = ({ dataset }) => {
  // Default to first column in dataset schema
  const [selectedColumn, setSelectedColumn] = useState<string>(
    dataset.columns.length > 0 ? dataset.columns[0].name : ''
  );
  const [bins, setBins] = useState<number>(15);

  useEffect(() => {
    if (dataset.columns.length > 0 && !selectedColumn) {
      setSelectedColumn(dataset.columns[0].name);
    }
  }, [dataset, selectedColumn]);

  const activeColInfo = dataset.columns.find((c) => c.name === selectedColumn);

  // Fetch complete univariate profiling data for the selected column
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: ['univariateProfile', dataset.datasetId, selectedColumn, bins],
    queryFn: () => getUnivariateProfile(dataset.datasetId, selectedColumn, bins),
    enabled: !!selectedColumn,
    staleTime: 5 * 60 * 1000,
  });

  // Determine whether column is numeric (from API or column metadata fallback)
  const isNumeric = profile
    ? profile.data_type === 'numeric'
    : activeColInfo?.type.toLowerCase() === 'numeric';

  // Fetch boxplot outlier points for numeric columns
  const { data: boxplotData, isLoading: isBoxplotLoading } = useQuery({
    queryKey: ['univariateBoxplot', dataset.datasetId, selectedColumn],
    queryFn: () => getUnivariateBoxplot(dataset.datasetId, selectedColumn),
    enabled: !!selectedColumn && isNumeric,
    staleTime: 5 * 60 * 1000,
  });

  const getSkewnessBadgeColor = (label: string): 'green' | 'accent' | 'red' => {
    switch (label) {
      case 'Symmetric':
        return 'green';
      case 'Right-Skewed':
      case 'Left-Skewed':
        return 'accent';
      default:
        return 'slate' as any;
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Column Selector Bar */}
      <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#121212] border border-[#7D8CA3]/20 text-[#F2DC5D]">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <label htmlFor="col-select" className="block text-xs font-semibold text-[#7D8CA3] uppercase tracking-wider">
              Select Feature for Univariate Profiling
            </label>
            <p className="text-xs text-slate-300 font-sans">
              Currently inspecting &bull;{' '}
              <span className={`font-mono font-semibold ${isNumeric ? 'text-[#F2DC5D]' : 'text-sky-400'}`}>
                {isNumeric ? 'Numerical Distribution' : 'Categorical Frequency'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active View Badge */}
          <span
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
              isNumeric
                ? 'bg-[#F2DC5D]/10 text-[#F2DC5D] border-[#F2DC5D]/30'
                : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
            }`}
          >
            {isNumeric ? <Hash className="w-3.5 h-3.5" /> : <Type className="w-3.5 h-3.5" />}
            {isNumeric ? 'Numeric View' : 'Categorical View'}
          </span>

          <div className="relative min-w-[280px]">
            <select
              id="col-select"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="w-full appearance-none bg-[#121212] border border-[#7D8CA3]/40 rounded-lg px-3.5 py-2.5 pr-10 text-xs font-mono font-medium text-white focus:outline-none focus:border-[#F2DC5D] transition-colors cursor-pointer"
            >
              {dataset.columns.map((col) => {
                const colIsNum = col.type.toLowerCase() === 'numeric';
                return (
                  <option key={col.name} value={col.name} className="bg-[#181A20] text-white">
                    {colIsNum ? '# [Numeric] ' : 'T [Categorical] '}
                    {col.name}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-4 h-4 text-[#7D8CA3] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {isProfileLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} type="card" />
            ))}
          </div>
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="card" />
        </div>
      ) : isProfileError || !profile ? (
        <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          Failed to load univariate statistics for {selectedColumn}.{' '}
          {profileError ? (profileError as Error).message : ''}
        </div>
      ) : isNumeric && profile.numeric_stats ? (
        /* ================= NUMERIC VIEW ================= */
        <>
          {/* Top 6 Primary Numeric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatsCard
              title="Mean"
              value={profile.numeric_stats.mean?.toFixed(2) ?? 'N/A'}
              subtitle="Arithmetic average"
              icon={Hash}
            />
            <StatsCard
              title="Median"
              value={profile.numeric_stats.median?.toFixed(2) ?? 'N/A'}
              subtitle="50th percentile (Q2)"
              icon={Hash}
            />
            <StatsCard
              title="Std Dev"
              value={profile.numeric_stats.std_dev?.toFixed(2) ?? 'N/A'}
              subtitle="Sample dispersion"
              icon={Hash}
            />
            <StatsCard
              title="Min"
              value={profile.numeric_stats.min?.toFixed(2) ?? 'N/A'}
              subtitle="Lowest value"
              icon={Hash}
            />
            <StatsCard
              title="Max"
              value={profile.numeric_stats.max?.toFixed(2) ?? 'N/A'}
              subtitle="Highest value"
              icon={Hash}
            />
            <StatsCard
              title="IQR"
              value={profile.numeric_stats.iqr?.toFixed(2) ?? 'N/A'}
              subtitle="Spread (Q3 - Q1)"
              icon={Hash}
            />
          </div>

          {/* Secondary Distribution Indicators (Skewness & Kurtosis & Zero/Negative counts) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Skewness Micro Card */}
            <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#7D8CA3] uppercase tracking-wider block font-sans">
                  Distribution Skewness
                </span>
                <span className="text-base font-bold font-mono text-white mt-0.5 block">
                  {profile.numeric_stats.skewness_label}{' '}
                  <span className="text-xs text-[#7D8CA3]">
                    ({profile.numeric_stats.skewness?.toFixed(2) ?? '0.00'})
                  </span>
                </span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border ${
                  profile.numeric_stats.skewness_label === 'Symmetric'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                }`}
              >
                {Math.abs(profile.numeric_stats.skewness ?? 0) < 0.5 ? 'Balanced' : 'Asymmetric'}
              </span>
            </div>

            {/* Kurtosis Micro Card */}
            <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#7D8CA3] uppercase tracking-wider block font-sans">
                  Sample Kurtosis
                </span>
                <span className="text-base font-bold font-mono text-white mt-0.5 block">
                  {profile.numeric_stats.kurtosis?.toFixed(2) ?? '0.00'}{' '}
                  <span className="text-xs text-[#7D8CA3]">
                    ({(profile.numeric_stats.kurtosis ?? 0) > 0 ? 'Leptokurtic' : 'Platykurtic'})
                  </span>
                </span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-[#121212] text-[#7D8CA3] border border-[#7D8CA3]/30">
                Peakiness
              </span>
            </div>

            {/* Zero & Negative Counts Micro Card */}
            <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#7D8CA3] uppercase tracking-wider block font-sans">
                  Zero & Negative Counts
                </span>
                <span className="text-base font-bold font-mono text-white mt-0.5 block">
                  Zeros: <span className="text-[#F2DC5D]">{profile.numeric_stats.zero_count}</span> &bull; Negatives:{' '}
                  <span className={profile.numeric_stats.negative_count > 0 ? 'text-rose-400' : 'text-slate-300'}>
                    {profile.numeric_stats.negative_count}
                  </span>
                </span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-[#121212] text-[#7D8CA3] border border-[#7D8CA3]/30">
                Sign Distribution
              </span>
            </div>
          </div>

          {/* Histogram Chart with Natural Language Insight & Bin Selector */}
          <HistogramChart
            data={profile.chart_data.bins || []}
            columnName={selectedColumn}
            currentBins={bins}
            onBinsChange={setBins}
            insightSummary={profile.insight_summary}
          />

          {/* Box Plot Card with Whisker Cutoff Thresholds */}
          {isBoxplotLoading ? (
            <LoadingSkeleton type="card" />
          ) : (
            <BoxPlotCard
              data={
                boxplotData || {
                  column: selectedColumn,
                  min: profile.numeric_stats.min,
                  q1: profile.numeric_stats.q1,
                  median: profile.numeric_stats.median,
                  q3: profile.numeric_stats.q3,
                  max: profile.numeric_stats.max,
                  outliers: [],
                }
              }
              columnName={selectedColumn}
              lowerWhisker={profile.numeric_stats.lower_whisker}
              upperWhisker={profile.numeric_stats.upper_whisker}
              outliersCount={profile.numeric_stats.outliers_count}
              outliersPct={profile.numeric_stats.outliers_pct}
            />
          )}
        </>
      ) : profile.categorical_stats ? (
        /* ================= CATEGORICAL VIEW ================= */
        <>
          {/* 6 Categorical KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatsCard
              title="Mode (Top Value)"
              value={profile.categorical_stats.mode ?? 'N/A'}
              subtitle="Most frequent category"
              icon={Sparkles}
              badgeText="Top Class"
              badgeColor="accent"
            />

            <StatsCard
              title="Mode Frequency"
              value={`${profile.categorical_stats.mode_percentage.toFixed(1)}%`}
              subtitle={`${profile.categorical_stats.mode_frequency.toLocaleString()} occurrences`}
              icon={Percent}
              badgeText="Dominance"
              badgeColor="accent"
            />

            <StatsCard
              title="Unique Categories"
              value={profile.categorical_stats.unique_count}
              subtitle="Distinct classes"
              icon={Type}
              badgeText="Count"
              badgeColor="slate"
            />

            <StatsCard
              title="Null Count"
              value={profile.null_count}
              subtitle="Missing / blank values"
              icon={AlertTriangle}
              badgeText={profile.null_count === 0 ? 'Clean' : 'Missing'}
              badgeColor={profile.null_count === 0 ? 'green' : 'red'}
            />

            <StatsCard
              title="Missing %"
              value={`${profile.categorical_stats.missing_pct.toFixed(1)}%`}
              subtitle="Blank entries ratio"
              icon={Activity}
              badgeText={profile.categorical_stats.missing_pct === 0 ? '0% Empty' : 'Unfilled'}
              badgeColor={profile.categorical_stats.missing_pct === 0 ? 'green' : 'red'}
            />

            <StatsCard
              title="Cardinality"
              value={profile.categorical_stats.cardinality_status}
              subtitle="Diversity tier"
              icon={Gauge}
              badgeText={`${profile.categorical_stats.cardinality_status} Tier`}
              badgeColor={
                profile.categorical_stats.cardinality_status === 'Low'
                  ? 'green'
                  : profile.categorical_stats.cardinality_status === 'Medium'
                  ? 'accent'
                  : 'red'
              }
            />
          </div>

          {/* Interactive Frequency Bar Chart with Insight Summary */}
          <FrequencyBar
            data={profile.chart_data.categories || profile.categorical_stats.top_categories}
            columnName={selectedColumn}
            insightSummary={profile.insight_summary}
          />

          {/* Top Categories Breakdown Table */}
          <TopCategoriesTable
            categories={profile.categorical_stats.top_categories}
            columnName={selectedColumn}
          />
        </>
      ) : null}
    </div>
  );
};
