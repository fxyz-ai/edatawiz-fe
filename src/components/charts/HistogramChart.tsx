import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HistogramBin } from '../../types/api';

interface HistogramChartProps {
  data: HistogramBin[];
  columnName: string;
  onBinsChange?: (bins: number) => void;
  currentBins?: number;
  insightSummary?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const bin: HistogramBin = payload[0].payload;
    return (
      <div className="bg-[#181A20] border border-[#F2DC5D]/40 p-3 rounded-lg shadow-xl text-xs font-sans">
        <p className="font-semibold text-white mb-1 font-mono">{bin.range}</p>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F2DC5D]" />
          <span>Frequency Count: <strong className="text-[#F2DC5D] font-mono">{bin.count}</strong></span>
        </div>
      </div>
    );
  }
  return null;
};

export const HistogramChart: React.FC<HistogramChartProps> = ({
  data,
  columnName,
  onBinsChange,
  currentBins = 15,
  insightSummary,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#7D8CA3] bg-[#181A20] rounded-xl border border-[#7D8CA3]/20">
        No histogram distribution data available for {columnName}.
      </div>
    );
  }

  return (
    <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white font-sans">
            Distribution Histogram &bull; <span className="text-[#F2DC5D] font-mono">{columnName}</span>
          </h3>
          <p className="text-xs text-[#7D8CA3]">Binned frequency distribution of numerical values</p>
          {insightSummary && (
            <p className="mt-1.5 text-xs text-slate-300 font-sans italic bg-[#121212]/80 border border-[#7D8CA3]/15 px-2.5 py-1 rounded-md">
              💡 {insightSummary}
            </p>
          )}
        </div>

        {onBinsChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7D8CA3] font-mono">Bins:</span>
            {[10, 15, 25, 40].map((b) => (
              <button
                key={b}
                onClick={() => onBinsChange(b)}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                  currentBins === b
                    ? 'bg-[#F2DC5D] text-black font-bold'
                    : 'bg-[#121212] text-[#7D8CA3] hover:text-white border border-[#7D8CA3]/20'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#7D8CA3" strokeOpacity={0.15} vertical={false} />
            <XAxis
              dataKey="range"
              stroke="#7D8CA3"
              tick={{ fill: '#7D8CA3', fontSize: 10 }}
              interval="preserveStartEnd"
              tickLine={false}
            />
            <YAxis
              stroke="#7D8CA3"
              tick={{ fill: '#7D8CA3', fontSize: 10 }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(242, 220, 93, 0.08)' }} />
            <Bar
              dataKey="count"
              fill="#F2DC5D"
              radius={[4, 4, 0, 0]}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
