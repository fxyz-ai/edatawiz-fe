import React from 'react';
import { useDatasetStore } from '../../store/useDatasetStore';
import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '../../api';
import { FileSpreadsheet, Layers, RefreshCw, Activity, Menu } from 'lucide-react';

interface TopBarProps {
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { dataset, resetDataset } = useDatasetStore();

  // Server health status polling
  const { data: healthData, isError: isHealthError } = useQuery({
    queryKey: ['serverHealth'],
    queryFn: checkHealth,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const isServerOnline = !isHealthError && healthData?.status === 'ok';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#121212]/90 backdrop-blur-md border-b border-[#7D8CA3]/20 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Left: Brand & Mobile Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg bg-[#181A20] text-[#7D8CA3] hover:text-[#F2DC5D]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <img
            src="/edw-logo.png"
            alt="EDataWiz"
            className="w-8 h-8 rounded-lg shadow-md shadow-[#F2DC5D]/20 object-contain"
          />
          <span className="text-lg font-extrabold tracking-tight text-white font-sans hidden sm:inline">
            EData<span className="text-[#F2DC5D]">Wiz</span>
          </span>
        </div>

        {/* Uploaded Filename & Info Pills */}
        {dataset && (
          <div className="flex items-center gap-2 pl-3 border-l border-[#7D8CA3]/20">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#181A20] border border-[#7D8CA3]/30 text-xs text-slate-200 max-w-[200px] sm:max-w-[280px] truncate">
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#F2DC5D] shrink-0" />
              <span className="truncate font-medium">{dataset.filename}</span>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#181A20] border border-[#7D8CA3]/20 text-xs font-mono text-[#7D8CA3]">
                <Layers className="w-3 h-3 text-[#F2DC5D]" />
                {dataset.rowCount.toLocaleString()} rows
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#181A20] border border-[#7D8CA3]/20 text-xs font-mono text-[#7D8CA3]">
                {dataset.columnCount} cols
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right: Health Indicator & Reset Button */}
      <div className="flex items-center gap-3">
        {/* Server Health Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${
            isServerOnline
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
          title={isServerOnline ? 'FastAPI Polars Backend is Online' : 'Backend connection issue'}
        >
          <span className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
          <Activity className="w-3 h-3" />
          <span className="hidden sm:inline">{isServerOnline ? 'API Online' : 'Offline'}</span>
        </div>

        {/* Reset / New Dataset Button */}
        <button
          type="button"
          onClick={resetDataset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181A20] border border-[#7D8CA3]/30 hover:border-[#F2DC5D] hover:bg-[#1E222B] text-xs font-semibold text-slate-200 hover:text-[#F2DC5D] transition-all duration-200 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Dataset</span>
        </button>
      </div>
    </header>
  );
};
