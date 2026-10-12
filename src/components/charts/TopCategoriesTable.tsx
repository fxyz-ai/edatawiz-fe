import React from 'react';
import type { CategoryDistributionItem } from '../../types/api';
import { Layers } from 'lucide-react';

interface TopCategoriesTableProps {
  categories: CategoryDistributionItem[];
  columnName: string;
}

export const TopCategoriesTable: React.FC<TopCategoriesTableProps> = ({ categories, columnName }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 text-center text-xs text-[#7D8CA3]">
        No category distribution data available for {columnName}.
      </div>
    );
  }

  return (
    <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-sans">
              Top Categories Breakdown &bull; <span className="text-sky-400 font-mono">{columnName}</span>
            </h3>
            <p className="text-xs text-[#7D8CA3]">
              Rank-ordered frequencies, percentage share, and cumulative distribution
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-[#7D8CA3]">
          {categories.length} classes displayed
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#7D8CA3]/15">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-[#121212] text-[#7D8CA3] uppercase font-mono tracking-wider text-[11px] border-b border-[#7D8CA3]/20">
            <tr>
              <th className="py-2.5 px-3 font-semibold w-16 text-center">Rank</th>
              <th className="py-2.5 px-4 font-semibold">Category Value</th>
              <th className="py-2.5 px-4 font-semibold">Row Count</th>
              <th className="py-2.5 px-4 font-semibold">Share %</th>
              <th className="py-2.5 px-4 font-semibold">Cumulative %</th>
              <th className="py-2.5 px-4 font-semibold min-w-[140px]">Distribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#7D8CA3]/10 bg-[#181A20] text-slate-200">
            {categories.map((item) => {
              const isOther = item.category === 'Other';
              return (
                <tr key={`${item.rank}-${item.category}`} className="hover:bg-[#1E222B]/80 transition-colors">
                  <td className="py-2.5 px-3 text-center font-mono">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.rank === 1
                          ? 'bg-[#F2DC5D]/15 text-[#F2DC5D] border border-[#F2DC5D]/30'
                          : item.rank === 2
                          ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                          : item.rank === 3
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          : 'bg-[#121212] text-[#7D8CA3]'
                      }`}
                    >
                      #{item.rank}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 font-mono font-semibold text-white">
                    <span className={isOther ? 'text-[#7D8CA3] italic' : ''}>
                      {item.category}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 font-mono text-slate-300">
                    {item.count.toLocaleString()}
                  </td>

                  <td className="py-2.5 px-4 font-mono font-medium text-sky-400">
                    {item.percentage.toFixed(1)}%
                  </td>

                  <td className="py-2.5 px-4 font-mono text-[#7D8CA3]">
                    {item.cumulative_percentage.toFixed(1)}%
                  </td>

                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#121212] rounded-full h-2 overflow-hidden border border-[#7D8CA3]/10">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOther
                              ? 'bg-slate-500'
                              : item.rank === 1
                              ? 'bg-[#F2DC5D]'
                              : item.rank <= 3
                              ? 'bg-sky-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(1, item.percentage))}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
