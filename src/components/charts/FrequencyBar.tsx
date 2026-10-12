import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { ArrowUpDown, Layers } from 'lucide-react';

interface FrequencyItemLike {
  category: string;
  count: number;
  percentage?: number;
  rank?: number;
  cumulative_percentage?: number;
}

interface FrequencyBarProps {
  data: FrequencyItemLike[];
  columnName: string;
  insightSummary?: string;
}

/**
 * Calculates continuous, evenly spaced numerical intervals and an appropriate
 * domain maximum with headroom for the horizontal bar chart's X-axis.
 */
function calculateLinearTicks(maxValue: number, desiredTicks = 5): { ticks: number[]; domainMax: number } {
  if (maxValue <= 0) {
    return { ticks: [0, 1, 2, 3, 4, 5], domainMax: 5 };
  }

  const roughStep = Math.max(1, maxValue / desiredTicks);
  const power = Math.max(1, Math.pow(10, Math.floor(Math.log10(roughStep))));
  const fraction = roughStep / power;

  let niceFraction = 1;
  if (fraction <= 1) niceFraction = 1;
  else if (fraction <= 2) niceFraction = 2;
  else if (fraction <= 5) niceFraction = 5;
  else niceFraction = 10;

  const step = Math.max(1, Math.round(niceFraction * power));
  const ticks: number[] = [0];
  let current = step;
  while (current < maxValue) {
    ticks.push(current);
    current += step;
  }
  ticks.push(current);

  // If the last tick is too close to maxValue (under 15% headroom), add one more tick
  // so bars don't touch the right axis and count labels have breathing room.
  if (current - maxValue < step * 0.15) {
    current += step;
    ticks.push(current);
  }

  return { ticks, domainMax: ticks[ticks.length - 1] };
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item: FrequencyItemLike = payload[0].payload;
    const isOther = item.category === 'Other';
    return (
      <div className="bg-[#181A20] border border-[#F2DC5D]/40 p-3 rounded-lg shadow-xl text-xs font-sans min-w-[180px]">
        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-[#7D8CA3]/20">
          <p className="font-semibold text-white font-mono truncate max-w-[150px]" title={item.category}>
            {item.category}
          </p>
          {isOther && (
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300">
              Aggregated
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1 text-slate-300">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: isOther ? '#7D8CA3' : '#F2DC5D' }}
              />
              <span>Occurrences:</span>
            </span>
            <strong className="text-[#F2DC5D] font-mono">{item.count.toLocaleString()}</strong>
          </div>
          {item.percentage !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>Share:</span>
              </span>
              <strong className="text-sky-300 font-mono">{item.percentage.toFixed(1)}%</strong>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const FrequencyBar: React.FC<FrequencyBarProps> = ({ data, columnName, insightSummary }) => {
  const [includeOther, setIncludeOther] = useState(true);
  const [sortMode, setSortMode] = useState<'pinned_bottom' | 'pure_descending'>('pinned_bottom');

  const hasOtherBucket = useMemo(() => {
    return Boolean(data && data.some((item) => item.category === 'Other'));
  }, [data]);

  // Order categories and guarantee data index matches display sequence
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Sanitize category names (handle empty or blank strings)
    const sanitized = data.map((item) => ({
      ...item,
      category: !item.category || item.category.trim() === '' ? '(Blank)' : item.category,
    }));

    const regularItems = sanitized.filter((item) => item.category !== 'Other');
    // Ensure named categories are strictly sorted descending by count
    regularItems.sort((a, b) => b.count - a.count);

    const otherItem = sanitized.find((item) => item.category === 'Other');

    if (!otherItem || !includeOther) {
      return regularItems;
    }

    if (sortMode === 'pure_descending') {
      // Pure numerical descending sort across all classes including 'Other'
      return [...sanitized].sort((a, b) => b.count - a.count);
    }

    // Default: Top categories descending from highest down to lowest, with 'Other' pinned at the bottom
    return [...regularItems, otherItem];
  }, [data, includeOther, sortMode]);

  // Compute maximum count and standard linear increments
  const maxCount = useMemo(() => {
    if (processedData.length === 0) return 0;
    return Math.max(...processedData.map((d) => d.count));
  }, [processedData]);

  const { ticks, domainMax } = useMemo(() => {
    return calculateLinearTicks(maxCount);
  }, [maxCount]);

  // Dynamic chart height ensuring ~36px slot per horizontal bar
  const chartHeight = useMemo(() => {
    return Math.max(300, processedData.length * 36);
  }, [processedData.length]);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#7D8CA3] bg-[#181A20] rounded-xl border border-[#7D8CA3]/20">
        No frequency distribution data available for {columnName}.
      </div>
    );
  }

  return (
    <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-1 border-b border-[#7D8CA3]/10">
        <div>
          <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
            <span>Category Frequency Distribution &bull;</span>
            <span className="text-[#F2DC5D] font-mono">{columnName}</span>
          </h3>
          <p className="text-xs text-[#7D8CA3] mt-0.5">
            Rank-ordered category frequencies with continuous linear scale
          </p>
        </div>

        {/* Interactive Controls & Legend */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          {/* Legend Badges */}
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono mr-2 text-[#7D8CA3]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#F2DC5D]" />
              <span>Top Classes</span>
            </span>
            {hasOtherBucket && includeOther && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#7D8CA3]" />
                <span>Other Bucket</span>
              </span>
            )}
          </div>

          {/* Other Bucket Toggle */}
          {hasOtherBucket && (
            <button
              type="button"
              onClick={() => setIncludeOther(!includeOther)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                includeOther
                  ? 'bg-[#121212] text-[#F8FAFC] border-[#7D8CA3]/40 hover:border-[#F2DC5D]/60'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
              }`}
              title="Toggle aggregated 'Other' category bucket"
            >
              <Layers className="w-3.5 h-3.5 text-[#7D8CA3]" />
              <span>{includeOther ? "Other: Included" : "Other: Hidden"}</span>
            </button>
          )}

          {/* Sort Order Mode Toggle (when Other is included) */}
          {hasOtherBucket && includeOther && (
            <button
              type="button"
              onClick={() =>
                setSortMode(sortMode === 'pinned_bottom' ? 'pure_descending' : 'pinned_bottom')
              }
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[#121212] text-slate-300 border border-[#7D8CA3]/30 hover:border-[#F2DC5D]/60 transition-colors cursor-pointer"
              title="Toggle placement of 'Other' bucket: pinned at bottom vs strictly sorted by count"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#F2DC5D]" />
              <span>{sortMode === 'pinned_bottom' ? 'Other at Bottom' : 'Pure Descending'}</span>
            </button>
          )}
        </div>
      </div>

      {insightSummary && (
        <p className="text-xs text-slate-300 font-sans italic bg-[#121212]/80 border border-[#7D8CA3]/15 px-3 py-1.5 rounded-md">
          💡 {insightSummary}
        </p>
      )}

      {/* Horizontal Bar Chart */}
      <div className="w-full" style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={processedData}
            margin={{ top: 10, right: 45, left: 15, bottom: 10 }}
          >
            {/* Evenly spaced vertical gridlines matching linear X-axis tick intervals */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#7D8CA3"
              strokeOpacity={0.15}
              horizontal={false}
              vertical={true}
            />
            {/* Continuous linear X-Axis scale */}
            <XAxis
              type="number"
              domain={[0, domainMax]}
              ticks={ticks}
              stroke="#7D8CA3"
              tick={{ fill: '#7D8CA3', fontSize: 10 }}
              tickLine={false}
              allowDecimals={false}
              tickFormatter={(v: number) => Math.round(v).toLocaleString()}
            />
            {/* Category labels on Y-Axis sharing exact same index order */}
            <YAxis
              type="category"
              dataKey="category"
              interval={0}
              stroke="#7D8CA3"
              tick={{ fill: '#F8FAFC', fontSize: 11 }}
              tickLine={false}
              width={110}
              tickFormatter={(val: string) => (val && val.length > 15 ? `${val.slice(0, 14)}…` : val)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(242, 220, 93, 0.08)' }}
            />
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
              animationDuration={500}
            >
              <LabelList
                dataKey="count"
                position="right"
                fill="#7D8CA3"
                fontSize={10}
                formatter={(v: number) => (v != null ? Number(v).toLocaleString() : '')}
              />
              {processedData.map((entry, index) => (
                <Cell
                  key={`bar-cell-${entry.category}-${index}`}
                  fill={entry.category === 'Other' ? '#7D8CA3' : '#F2DC5D'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

