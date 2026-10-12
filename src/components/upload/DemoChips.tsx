import React from 'react';
import { DEMO_DATASETS, createDemoFile, type DemoDataset } from '../../utils/demoDatasets';
import { Ship, Home, Users, Sparkles } from 'lucide-react';

interface DemoChipsProps {
  onSelectDemo: (file: File) => void;
  disabled?: boolean;
}

export const DemoChips: React.FC<DemoChipsProps> = ({ onSelectDemo, disabled }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'titanic':
        return <Ship className="w-3.5 h-3.5 text-[#F2DC5D]" />;
      case 'housing':
        return <Home className="w-3.5 h-3.5 text-[#F2DC5D]" />;
      case 'churn':
        return <Users className="w-3.5 h-3.5 text-[#F2DC5D]" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#F2DC5D]" />;
    }
  };

  const handleChipClick = (demo: DemoDataset) => {
    if (disabled) return;
    const demoFile = createDemoFile(demo);
    onSelectDemo(demoFile);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-[#7D8CA3]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7D8CA3]">
          Or test instantly with a demo dataset
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {DEMO_DATASETS.map((demo) => (
          <button
            key={demo.id}
            type="button"
            disabled={disabled}
            onClick={() => handleChipClick(demo)}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#181A20] border border-[#7D8CA3]/30 hover:border-[#F2DC5D] hover:bg-[#1E222B] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow-[#F2DC5D]/10"
            title={demo.description}
          >
            <div className="p-1 rounded bg-[#121212] group-hover:bg-[#F2DC5D]/10 transition-colors">
              {getIcon(demo.id)}
            </div>
            <div className="text-left">
              <span className="block text-xs font-semibold text-slate-200 group-hover:text-[#F2DC5D] transition-colors">
                {demo.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
