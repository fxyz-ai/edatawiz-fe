import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { GroupedScatterGroup } from '../../types/api';

interface GroupedScatterPlotProps {
  data: GroupedScatterGroup[];
  colX: string;
  colY: string;
  groupBy: string;
}

const GROUP_COLORS = ['#F2DC5D', '#38BDF8', '#34D399', '#F472B6', '#C084FC', '#FB923C'];

const CustomGroupedScatterTooltip = ({ active, payload, colX, colY }: any) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload;
    const groupName = payload[0].name;
    return (
      <div className="bg-[#181A20] border border-[#F2DC5D]/40 p-3 rounded-lg shadow-xl text-xs font-sans">
        <p className="font-semibold text-white mb-1 font-mono">Group: {groupName}</p>
        <div className="space-y-1 text-slate-300 font-mono">
          <div>{colX}: <strong className="text-white">{point.x?.toLocaleString() ?? 'N/A'}</strong></div>
          <div>{colY}: <strong className="text-white">{point.y?.toLocaleString() ?? 'N/A'}</strong></div>
        </div>
      </div>
    );
  }
  return null;
};

export const GroupedScatterPlot: React.FC<GroupedScatterPlotProps> = ({
  data,
  colX,
  colY,
  groupBy,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-xs text-[#7D8CA3] bg-[#181A20] rounded-xl border border-[#7D8CA3]/20">
        No grouped scatter plot data available.
      </div>
    );
  }

  return (
    <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white font-sans">
          Multivariate Scatter Plot &bull; <span className="text-[#F2DC5D] font-mono">{colX}</span> vs{' '}
          <span className="text-[#F2DC5D] font-mono">{colY}</span> by{' '}
          <span className="text-[#F2DC5D] font-mono">{groupBy}</span>
        </h3>
        <p className="text-xs text-[#7D8CA3]">Grouped color scatter points (top 5 groups)</p>
      </div>

      <div className="w-full h-84">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#7D8CA3" strokeOpacity={0.2} />
            <XAxis
              type="number"
              dataKey="x"
              name={colX}
              stroke="#7D8CA3"
              tick={{ fill: '#7D8CA3', fontSize: 10 }}
              tickLine={false}
              label={{ value: colX, position: 'insideBottom', offset: -10, fill: '#7D8CA3', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={colY}
              stroke="#7D8CA3"
              tick={{ fill: '#7D8CA3', fontSize: 10 }}
              tickLine={false}
              label={{ value: colY, angle: -90, position: 'insideLeft', fill: '#7D8CA3', fontSize: 11 }}
            />
            <Tooltip content={<CustomGroupedScatterTooltip colX={colX} colY={colY} />} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#7D8CA3' }} />
            {data.map((groupItem, idx) => (
              <Scatter
                key={groupItem.group}
                name={groupItem.group}
                data={groupItem.points}
                fill={GROUP_COLORS[idx % GROUP_COLORS.length]}
                opacity={0.85}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
