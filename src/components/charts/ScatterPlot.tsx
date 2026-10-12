import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ScatterPoint } from '../../types/api';

interface ScatterPlotProps {
  data: ScatterPoint[];
  colX: string;
  colY: string;
}

const CustomScatterTooltip = ({ active, payload, colX, colY }: any) => {
  if (active && payload && payload.length) {
    const point: ScatterPoint = payload[0].payload;
    return (
      <div className="bg-[#181A20] border border-[#F2DC5D]/40 p-3 rounded-lg shadow-xl text-xs font-sans">
        <p className="font-semibold text-[#F2DC5D] mb-1 font-mono">Data Point</p>
        <div className="space-y-1 text-slate-300 font-mono">
          <div>{colX}: <strong className="text-white">{point.x?.toLocaleString() ?? 'N/A'}</strong></div>
          <div>{colY}: <strong className="text-white">{point.y?.toLocaleString() ?? 'N/A'}</strong></div>
        </div>
      </div>
    );
  }
  return null;
};

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, colX, colY }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-xs text-[#7D8CA3] bg-[#181A20] rounded-xl border border-[#7D8CA3]/20">
        No scatter plot points available for {colX} vs {colY}.
      </div>
    );
  }

  // Filter out any invalid null points defensively
  const validPoints = data.filter((p) => p.x !== null && p.y !== null);

  return (
    <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white font-sans">
            Bivariate Scatter Plot &bull; <span className="text-[#F2DC5D] font-mono">{colX}</span> vs{' '}
            <span className="text-[#F2DC5D] font-mono">{colY}</span>
          </h3>
          <p className="text-xs text-[#7D8CA3]">Downsampled point coordinates (max 1,000 points)</p>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#121212] text-[#7D8CA3] border border-[#7D8CA3]/20">
          {validPoints.length.toLocaleString()} points
        </span>
      </div>

      <div className="w-full h-80">
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
            <Tooltip content={<CustomScatterTooltip colX={colX} colY={colY} />} />
            <Scatter
              name="Points"
              data={validPoints}
              fill="#F2DC5D"
              opacity={0.8}
              stroke="#121212"
              strokeWidth={0.5}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
