import React, { useState } from 'react';
import { useDatasetStore } from '../../store/useDatasetStore';
import type { TabType } from '../../types/api';
import {
  LayoutDashboard,
  BarChart,
  GitCompare,
  Network,
  ChevronLeft,
  ChevronRight,
  Lock,
} from 'lucide-react';

const NAV_ITEMS: {
  id: TabType;
  label: string;
  desc: string;
  icon: React.ElementType;
  isLocked?: boolean;
}[] = [
  {
    id: 'overview',
    label: 'Overview',
    desc: 'Dataset Health & Schema',
    icon: LayoutDashboard,
  },
  {
    id: 'univariate',
    label: 'Univariate Analysis',
    desc: 'Distributions & Box Plots',
    icon: BarChart,
  },
  {
    id: 'bivariate',
    label: 'Bivariate Analysis',
    desc: 'Correlations & Scatters',
    icon: GitCompare,
    isLocked: true,
  },
  {
    id: 'multivariate',
    label: 'Multivariate Analysis',
    desc: 'Multi-dimensional Grouping',
    icon: Network,
    isLocked: true,
  },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useDatasetStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-[57px] h-[calc(100vh-57px)] bg-[#121212] border-r border-[#7D8CA3]/20 transition-all duration-300 z-20 flex flex-col justify-between shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-3 space-y-2">
        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-[#181A20] text-[#F2DC5D] border border-[#F2DC5D]/30 shadow-md shadow-[#F2DC5D]/5'
                    : 'text-[#7D8CA3] hover:text-slate-100 hover:bg-[#181A20]/60'
                }`}
                title={isCollapsed ? `${item.label}${item.isLocked ? ' (Coming Soon)' : ''}` : undefined}
              >
                <div
                  className={`relative p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#F2DC5D]/10 text-[#F2DC5D]'
                      : 'bg-[#181A20] text-[#7D8CA3] group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.isLocked && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#181A20] border border-[#7D8CA3]/40 flex items-center justify-center text-[8px] text-[#F2DC5D]">
                      <Lock className="w-2 h-2" />
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="block text-xs font-bold tracking-tight truncate">
                        {item.label}
                      </span>
                      {item.isLocked && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25 shrink-0">
                          Soon
                        </span>
                      )}
                    </div>
                    <span className="block text-[10px] text-[#7D8CA3] truncate font-sans">
                      {item.desc}
                    </span>
                  </div>
                )}

                {isActive && !isCollapsed && (
                  <div className="w-1.5 h-6 rounded-full bg-[#F2DC5D]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-[#7D8CA3]/15">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-[#181A20] border border-[#7D8CA3]/20 text-[#7D8CA3] hover:text-[#F2DC5D] hover:border-[#F2DC5D]/40 transition-all text-xs font-semibold cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!isCollapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};
