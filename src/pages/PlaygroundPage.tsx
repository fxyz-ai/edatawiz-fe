import React, { useState } from 'react';
import { useDatasetStore } from '../store/useDatasetStore';
import { TopBar } from '../components/layout/TopBar';
import { Sidebar } from '../components/layout/Sidebar';
import { OverviewSection } from '../components/playground/OverviewSection';
import { UnivariateSection } from '../components/playground/UnivariateSection';
import { BivariateSection } from '../components/playground/BivariateSection';
import { MultivariateSection } from '../components/playground/MultivariateSection';
import { ComingSoonSection } from '../components/common/ComingSoonSection';

// Feature deployment locks - keep all original components intact for future release
const FEATURE_LOCKS: Record<string, boolean> = {
  bivariate: true,
  multivariate: true,
};

export const PlaygroundPage: React.FC = () => {
  const { dataset, activeTab } = useDatasetStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!dataset) return null;

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 flex flex-col font-sans">
      {/* Top Global Bar */}
      <TopBar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex relative">
        {/* Collapsible / Sticky Sidebar */}
        <Sidebar />

        {/* Main Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && <OverviewSection datasetId={dataset.datasetId} />}
          {activeTab === 'univariate' && <UnivariateSection dataset={dataset} />}
          {activeTab === 'bivariate' && (
            FEATURE_LOCKS.bivariate ? (
              <ComingSoonSection feature="bivariate" />
            ) : (
              <BivariateSection dataset={dataset} />
            )
          )}
          {activeTab === 'multivariate' && (
            FEATURE_LOCKS.multivariate ? (
              <ComingSoonSection feature="multivariate" />
            ) : (
              <MultivariateSection dataset={dataset} />
            )
          )}
        </main>
      </div>
    </div>
  );
};

