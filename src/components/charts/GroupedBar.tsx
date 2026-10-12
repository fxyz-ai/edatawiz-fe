import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { GroupedBarItem, GroupedComparisonItem } from '../../types/api';

interface GroupedBarProps {
  data: GroupedBarItem[] | GroupedComparisonItem[];
  colX: string;
  colY: string;
  secondMetricCol?: string;
}

const CustomGroupedTooltip = ({ active, payload, colX, colY, secondMetricCol }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-[#181A20] border border-[#F2DC5D]/40 p-3 rounded-lg shadow-xl text-xs font-sans">
        <p className="font-semibold text-white mb-1.5 font-mono">{colX}: {item.category}</p>
        <div className="space-y-1 text-slate-300 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2DC5D]" />
            <span>Avg {colY}: <strong className="text-[#F2DC5D]">{item.average ?? item.metric1 ?? 'N/A'}</strong></span>
          </div>
          {secondMetricCol && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7D8CA3]" />
              <span>Avg {secondMetricCol}: <strong className="text-[#7D8CA3]">{item.metric2 ?? 'N/A'}</strong></span>
            </div>
          )}
          <div className="text-[10px] text-[#7D8CA3] pt-1 border-t border-[#7D8CA3]/20">
            Sample Count: {item.count}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const GroupedBar: React.FC<GroupedBarProps> = ({
  data,
  colX,
  colY,
  secondMetricCol,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-xs text-[#7D8CA3] bg-[#181A20] rounded-xl border border-[#7D8CA3]/20">
        No grouped bar chart data available.
      </div>
    );
  }

  const isMultiMetric = !!secondMetricCol;

  return (
    <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white font-sans">
          Grouped Average Metric &bull; <span className="text-[#F2DC5D] font-mono">{colY}</span> by{' '}
          <span className="text-[#F2DC5D] font-mono">{colX}</span>
          {secondMetricCol && <span> vs <span className="text-[#7D8CA3] font-mono">{secondMetricCol}</span></span>}
        </h3>
        <p className="text-xs text-[#7D8CA3]">Aggregated mean values per category group (top 15 categories)</p>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#7D8CA3" strokeOpacity={0.15} vertical={false} />
            <XAxis
              dataKey="category"
              stroke="#7D8CA3"
              tick={{ fill: '#7D8CA3', fontSize: 10 }}
              tickLine={false}
              interval={0}
            />
            <YAxis stroke="#7D8CA3" tick={{ fill: '#7D8CA3', fontSize: 10 }} tickLine={false} />
            <Tooltip
              content={<CustomGroupedTooltip colX={colX} colY={colY} secondMetricCol={secondMetricCol} />}
              cursor={{ fill: 'rgba(242, 220, 93, 0.08)' }}
            />
            {isMultiMetric && <Legend wrapperStyle={{ fontSize: '11px', color: '#7D8CA3' }} />}
            <Bar
              dataKey={isMultiMetric ? 'metric1' : 'average'}
              name={colY}
              fill="#F2DC5D"
              radius={[4, 4, 0, 0]}
              animationDuration={600}
            />
            {isMultiMetric && (
              <Bar
                dataKey="metric2"
                name={secondMetricCol}
                fill="#7D8CA3"
                radius={[4, 4, 0, 0]}
                animationDuration={600}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
