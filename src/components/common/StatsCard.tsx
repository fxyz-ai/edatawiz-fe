import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  badgeText?: string;
  badgeColor?: 'accent' | 'slate' | 'red' | 'green';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = 'accent',
}) => {
  const getBadgeStyle = () => {
    switch (badgeColor) {
      case 'accent':
        return 'bg-[#F2DC5D]/10 text-[#F2DC5D] border-[#F2DC5D]/30';
      case 'green':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'red':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'slate':
      default:
        return 'bg-[#7D8CA3]/10 text-[#7D8CA3] border-[#7D8CA3]/30';
    }
  };

  return (
    <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 hover:border-[#F2DC5D]/40 transition-all duration-200 group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider text-[#7D8CA3] uppercase font-sans">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-[#121212] text-[#7D8CA3] group-hover:text-[#F2DC5D] transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold font-mono tracking-tight text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {badgeText && (
          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium font-mono ${getBadgeStyle()}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-[#7D8CA3]/80 font-sans leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
