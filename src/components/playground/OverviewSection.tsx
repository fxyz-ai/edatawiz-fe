import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOverview } from '../../api';
import { StatsCard } from '../common/StatsCard';
import { HealthScoreBadge } from '../common/HealthScoreBadge';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import type { ColumnHealth, OverviewSummary } from '../../types/api';
import {
  Table,
  Hash,
  Database,
  AlertTriangle,
  Copy,
  Binary,
  Calendar,
  Type,
  HelpCircle,
  HardDrive,
  Key,
  AlertCircle,
  CheckCircle2,
  Search,
} from 'lucide-react';

interface OverviewSectionProps {
  datasetId: string;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ datasetId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlagFilter, setSelectedFlagFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');

  const { data: overview, isLoading, isError, error } = useQuery({
    queryKey: ['overview', datasetId],
    queryFn: () => getOverview(datasetId),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Normalize response data: support both new structure and legacy fallback
  const summary: OverviewSummary = useMemo(() => {
    if (!overview) {
      return {
        total_rows: 0,
        total_cols: 0,
        numeric_cols_count: 0,
        categorical_cols_count: 0,
        missing_cells: 0,
        missing_cells_pct: 0,
        duplicate_rows: 0,
        duplicate_rows_pct: 0,
        memory_usage: '0 B',
        health_score: 100,
      };
    }

    if (overview.summary) {
      return overview.summary;
    }

    // Fallback to legacy fields if needed
    const totalR = overview.totalRows || 0;
    const totalC = overview.totalColumns || 0;
    const totalMissing = overview.totalMissingCells || 0;
    const totalCells = totalR * totalC;

    return {
      total_rows: totalR,
      total_cols: totalC,
      numeric_cols_count: overview.columnSummaries?.filter((c) => c.type === 'numeric').length || 0,
      categorical_cols_count: overview.columnSummaries?.filter((c) => c.type !== 'numeric').length || 0,
      missing_cells: totalMissing,
      missing_cells_pct: totalCells > 0 ? (totalMissing / totalCells) * 100 : 0,
      duplicate_rows: overview.duplicateRows || 0,
      duplicate_rows_pct: totalR > 0 ? ((overview.duplicateRows || 0) / totalR) * 100 : 0,
      memory_usage: 'N/A',
      health_score: overview.healthScore ?? 100,
    };
  }, [overview]);

  const rawColumns: ColumnHealth[] = useMemo(() => {
    if (!overview) return [];
    if (overview.columns && overview.columns.length > 0) {
      return overview.columns;
    }
    // Fallback mapping from legacy columnSummaries
    return (overview.columnSummaries || []).map((col) => ({
      name: col.name,
      data_type: col.type.charAt(0).toUpperCase() + col.type.slice(1),
      null_count: col.nullCount,
      missing_pct: summary.total_rows > 0 ? (col.nullCount / summary.total_rows) * 100 : 0,
      unique_values: col.uniqueCount,
      range_min: col.min,
      range_max: col.max,
      flags: ['NORMAL'],
    }));
  }, [overview, summary.total_rows]);

  // Filter columns by search term, flag, and data type
  const filteredColumns = useMemo(() => {
    return rawColumns.filter((col) => {
      const matchesSearch = col.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchesType =
        selectedTypeFilter === 'ALL' ||
        col.data_type.toLowerCase() === selectedTypeFilter.toLowerCase();
      const matchesFlag =
        selectedFlagFilter === 'ALL' ||
        col.flags.some((f) => f.toUpperCase() === selectedFlagFilter.toUpperCase());

      return matchesSearch && matchesType && matchesFlag;
    });
  }, [rawColumns, searchTerm, selectedFlagFilter, selectedTypeFilter]);

  // Aggregate flag counts for summary pill badges
  const flagCounts = useMemo(() => {
    const counts: Record<string, number> = {
      PRIMARY_KEY: 0,
      HIGH_CARDINALITY: 0,
      CONSTANT: 0,
      HIGH_MISSING: 0,
      NORMAL: 0,
    };
    rawColumns.forEach((c) => {
      c.flags.forEach((f) => {
        const upper = f.toUpperCase();
        if (counts[upper] !== undefined) {
          counts[upper] += 1;
        }
      });
    });
    return counts;
  }, [rawColumns]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-up">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
          <LoadingSkeleton type="card" />
        </div>
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  if (isError || !overview) {
    return (
      <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
        Failed to load dataset overview metrics. {error ? (error as Error).message : ''}
      </div>
    );
  }

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'numeric':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#F2DC5D]/10 text-[#F2DC5D] border border-[#F2DC5D]/30">
            <Hash className="w-3 h-3" /> Numeric
          </span>
        );
      case 'categorical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Type className="w-3 h-3" /> Categorical
          </span>
        );
      case 'datetime':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Calendar className="w-3 h-3" /> Datetime
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-500/10 text-slate-400 border border-slate-500/30">
            <HelpCircle className="w-3 h-3" /> {type}
          </span>
        );
    }
  };

  const getFlagBadge = (flag: string) => {
    switch (flag.toUpperCase()) {
      case 'PRIMARY_KEY':
        return (
          <span
            key={flag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-sm shadow-amber-400/10"
            title="Primary Key: 100% unique ID column"
          >
            <Key className="w-3 h-3 text-amber-400" />
            PRIMARY_KEY
          </span>
        );
      case 'HIGH_CARDINALITY':
        return (
          <span
            key={flag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
            title="High Cardinality: Distinct values equal total records"
          >
            <Hash className="w-3 h-3 text-indigo-400" />
            HIGH_CARDINALITY
          </span>
        );
      case 'CONSTANT':
        return (
          <span
            key={flag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-orange-500/15 text-orange-300 border border-orange-500/30"
            title="Constant Feature: Zero variance (contains only 1 value)"
          >
            <AlertCircle className="w-3 h-3 text-orange-400" />
            CONSTANT
          </span>
        );
      case 'HIGH_MISSING':
        return (
          <span
            key={flag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse"
            title="High Missing: >= 50% cells missing or blank"
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            HIGH_MISSING
          </span>
        );
      case 'NORMAL':
      default:
        return (
          <span
            key={flag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            title="Normal: Healthy variance and completeness"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            NORMAL
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Overview Metric Cards Grid (5 Production Health Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Rows"
          value={summary.total_rows}
          subtitle="Complete record count parsed"
          icon={Database}
          badgeText="Polars Scan"
          badgeColor="accent"
        />

        <StatsCard
          title="Total Columns"
          value={summary.total_cols}
          subtitle={`${summary.numeric_cols_count} Numeric • ${summary.categorical_cols_count} Categorical`}
          icon={Table}
          badgeText={`${summary.total_cols} Features`}
          badgeColor="slate"
        />

        <StatsCard
          title="In-Memory RAM"
          value={summary.memory_usage}
          subtitle="Dataset RAM footprint in Polars"
          icon={HardDrive}
          badgeText="Memory Footprint"
          badgeColor="accent"
        />

        <StatsCard
          title="Missing Cells"
          value={summary.missing_cells}
          subtitle="Null & whitespace-only cells"
          icon={AlertTriangle}
          badgeText={summary.missing_cells === 0 ? '0% Missing' : `${summary.missing_cells_pct.toFixed(1)}%`}
          badgeColor={summary.missing_cells === 0 ? 'green' : 'red'}
        />

        <StatsCard
          title="Duplicate Rows"
          value={summary.duplicate_rows}
          subtitle={`${summary.duplicate_rows_pct.toFixed(1)}% Identical record rows`}
          icon={Copy}
          badgeText={summary.duplicate_rows === 0 ? 'Clean' : 'Duplicates'}
          badgeColor={summary.duplicate_rows === 0 ? 'green' : 'red'}
        />
      </div>

      {/* Dataset Health Score Badge Card */}
      <HealthScoreBadge score={summary.health_score} />

      {/* Full Data Schema Table & Health Breakdown */}
      <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#7D8CA3]/10">
          <div>
            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <Binary className="w-4 h-4 text-[#F2DC5D]" /> Dataset Schema & Feature Breakdown
            </h3>
            <p className="text-xs text-[#7D8CA3] mt-0.5">
              Comprehensive schema inspection with variance warnings, cardinality detection, and missing counts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {flagCounts.PRIMARY_KEY > 0 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                {flagCounts.PRIMARY_KEY} PK
              </span>
            )}
            {flagCounts.CONSTANT > 0 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-orange-400/10 text-orange-300 border border-orange-400/20">
                {flagCounts.CONSTANT} Constant
              </span>
            )}
            {flagCounts.HIGH_MISSING > 0 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-400/10 text-rose-300 border border-rose-400/20">
                {flagCounts.HIGH_MISSING} High Missing
              </span>
            )}
            <span className="text-xs font-mono text-[#7D8CA3] pl-1">
              {filteredColumns.length} of {rawColumns.length} columns
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 pb-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#7D8CA3]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter columns by name..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#121212] border border-[#7D8CA3]/20 rounded-lg text-xs font-mono text-white placeholder-[#7D8CA3]/60 focus:outline-none focus:border-[#F2DC5D]/50 transition-colors"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#7D8CA3] uppercase tracking-wider font-mono mr-1">Flag:</span>
            {['ALL', 'PRIMARY_KEY', 'CONSTANT', 'HIGH_MISSING', 'NORMAL'].map((flag) => {
              const active = selectedFlagFilter === flag;
              return (
                <button
                  key={flag}
                  onClick={() => setSelectedFlagFilter(flag)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-colors ${
                    active
                      ? 'bg-[#F2DC5D] text-black font-bold'
                      : 'bg-[#121212] text-[#7D8CA3] hover:text-white border border-[#7D8CA3]/20'
                  }`}
                >
                  {flag}
                </button>
              );
            })}

            <div className="h-4 w-px bg-[#7D8CA3]/20 mx-1 hidden sm:block" />

            {['ALL', 'Numeric', 'Categorical'].map((type) => {
              const active = selectedTypeFilter === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedTypeFilter(type)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-colors ${
                    active
                      ? 'bg-[#7D8CA3] text-white font-semibold'
                      : 'bg-[#121212] text-[#7D8CA3] hover:text-white border border-[#7D8CA3]/20'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schema Table */}
        <div className="overflow-x-auto rounded-lg border border-[#7D8CA3]/15">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#121212] text-[#7D8CA3] uppercase font-mono tracking-wider text-[11px] border-b border-[#7D8CA3]/20">
              <tr>
                <th className="py-3 px-4 font-semibold">Column Name</th>
                <th className="py-3 px-4 font-semibold">Data Type</th>
                <th className="py-3 px-4 font-semibold">Health Flags</th>
                <th className="py-3 px-4 font-semibold">Null Count</th>
                <th className="py-3 px-4 font-semibold">Missing %</th>
                <th className="py-3 px-4 font-semibold">Unique Values</th>
                <th className="py-3 px-4 font-semibold">Range / Limits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7D8CA3]/10 bg-[#181A20] text-slate-200">
              {filteredColumns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#7D8CA3] font-mono">
                    No columns match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredColumns.map((col: ColumnHealth) => {
                  return (
                    <tr key={col.name} className="hover:bg-[#1E222B]/80 transition-colors">
                      <td className="py-3 px-4 font-semibold font-mono text-white">
                        {col.name}
                      </td>

                      <td className="py-3 px-4">
                        {getTypeBadge(col.data_type)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {col.flags && col.flags.length > 0 ? (
                            col.flags.map((flag) => getFlagBadge(flag))
                          ) : (
                            getFlagBadge('NORMAL')
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className={col.null_count > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                          {col.null_count.toLocaleString()}
                        </span>
                      </td>

                      <td className="py-3 px-4 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[#7D8CA3] w-10">
                            {col.missing_pct.toFixed(1)}%
                          </span>
                          <div className="flex-1 bg-[#121212] rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                col.missing_pct >= 50
                                  ? 'bg-rose-500'
                                  : col.missing_pct > 0
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, col.missing_pct))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-300">
                        {col.unique_values.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-mono text-[#7D8CA3]">
                        {col.data_type.toLowerCase() === 'numeric' &&
                        col.range_min !== null &&
                        col.range_min !== undefined &&
                        col.range_max !== null &&
                        col.range_max !== undefined ? (
                          <span>
                            [{col.range_min.toLocaleString()} &rarr; {col.range_max.toLocaleString()}]
                          </span>
                        ) : (
                          <span className="text-[#7D8CA3]/40">&mdash;</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
