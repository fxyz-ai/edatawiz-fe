import React from 'react';
import { useDatasetStore } from '../../store/useDatasetStore';
import type { TabType } from '../../types/api';
import {
  Lock,
  Sparkles,
  GitCompare,
  Network,
  ArrowRight,
  LayoutDashboard,
  BarChart,
  Layers,
  Cpu,
  Clock,
  Compass,
} from 'lucide-react';

interface ComingSoonSectionProps {
  feature: 'bivariate' | 'multivariate' | TabType;
}

interface FeatureDetail {
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  plannedFeatures: {
    title: string;
    description: string;
    status: 'In Design' | 'Engine Ready' | 'Coming Soon';
  }[];
}

const FEATURE_CONFIGS: Record<'bivariate' | 'multivariate', FeatureDetail> = {
  bivariate: {
    title: 'Bivariate Analysis',
    tagline: 'Pairwise Correlations, Trendlines & Cross-Feature Interactions',
    description:
      'We are polishing the bivariate engine to provide ultra-fast pairwise Pearson and Spearman correlation matrices, cross-feature scatter plots with regression trendlines, and categorical grouped distributions powered by Polars.',
    icon: GitCompare,
    plannedFeatures: [
      {
        title: 'Pairwise Correlation Matrix',
        description: 'Interactive heatmaps with Pearson & Spearman correlation coefficients and statistical significance tests.',
        status: 'Engine Ready',
      },
      {
        title: 'Dynamic Scatter & Regressions',
        description: 'Sub-sampled high-density scatter plots with linear trendlines, residual analysis, and outlier highlights.',
        status: 'In Design',
      },
      {
        title: 'Grouped Categorical Splits',
        description: 'Group-by comparisons measuring numeric variances across discrete categorical classes.',
        status: 'Coming Soon',
      },
    ],
  },
  multivariate: {
    title: 'Multivariate Analysis',
    tagline: 'Multi-Dimensional Clustering, Group Aggregations & Projections',
    description:
      'The multivariate profiling suite will deliver multi-metric comparative breakdowns, high-dimensional grouping, and interaction patterns across 3+ features simultaneously without client-side lag.',
    icon: Network,
    plannedFeatures: [
      {
        title: 'Multi-Metric Comparison',
        description: 'Aggregate multiple continuous metrics simultaneously across categorical grouping dimensions.',
        status: 'Engine Ready',
      },
      {
        title: 'Grouped Scatter Clustering',
        description: '3-way visual exploration combining X-axis, Y-axis, and hue/category grouping markers.',
        status: 'In Design',
      },
      {
        title: 'Dimensionality Reduction',
        description: 'PCA projections and variance ratio analysis for high-dimensional feature spaces.',
        status: 'Coming Soon',
      },
    ],
  },
};

export const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({ feature }) => {
  const { setActiveTab } = useDatasetStore();

  const isMulti = feature === 'multivariate';
  const config = isMulti ? FEATURE_CONFIGS.multivariate : FEATURE_CONFIGS.bivariate;
  const MainIcon = config.icon;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 animate-fade-up">
      {/* Hero Announcement Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#181A20] border border-[#7D8CA3]/25 p-8 sm:p-10 shadow-2xl">
        {/* Ambient Glowing Gradient Accents */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#F2DC5D]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#F2DC5D]/10 text-[#F2DC5D] border border-[#F2DC5D]/30 shadow-sm">
              <Lock className="w-3.5 h-3.5" />
              Feature In Active Development
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#121212] text-[#7D8CA3] border border-[#7D8CA3]/30">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Scheduled for Next Release
            </span>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#121212] border border-[#7D8CA3]/30 text-[#F2DC5D] shadow-inner">
                <MainIcon className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                  {config.title}
                </h1>
                <p className="text-xs sm:text-sm font-mono text-[#F2DC5D]">
                  {config.tagline}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-3xl pt-2">
              {config.description}
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#F2DC5D] text-black hover:bg-[#F2DC5D]/90 transition-all shadow-md shadow-[#F2DC5D]/20 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Explore Overview Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('univariate')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-[#121212] text-white hover:bg-[#1E222B] border border-[#7D8CA3]/30 transition-all cursor-pointer"
            >
              <BarChart className="w-4 h-4 text-sky-400" />
              <span>Explore Univariate Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Planned Feature Modules Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F2DC5D]" />
            <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider">
              Modules in Progress for {config.title}
            </h3>
          </div>
          <span className="text-xs font-mono text-[#7D8CA3]">3 Core Components</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.plannedFeatures.map((item, index) => (
            <div
              key={index}
              className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 space-y-3 relative group hover:border-[#F2DC5D]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-[#121212] border border-[#7D8CA3]/30 flex items-center justify-center text-[11px] font-mono font-bold text-[#F2DC5D]">
                  0{index + 1}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    item.status === 'Engine Ready'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : item.status === 'In Design'
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white font-sans group-hover:text-[#F2DC5D] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-[#7D8CA3] mt-1 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production Readiness Architecture Info Box */}
      <div className="bg-[#121212] border border-[#7D8CA3]/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#7D8CA3] font-sans">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-[#F2DC5D] shrink-0" />
          <span>
            <strong className="text-white font-mono">Current Live Deployment:</strong> Overview (Dataset Health & Schema) and Univariate Analysis (Distributions, Metrics & Frequencies) are fully active and production-ready.
          </span>
        </div>

        <span className="font-mono text-[11px] text-[#F2DC5D] shrink-0">
          EDataWiz v1.0 Production
        </span>
      </div>
    </div>
  );
};
