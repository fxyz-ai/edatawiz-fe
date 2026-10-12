import React from 'react';
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

interface HealthScoreBadgeProps {
  score: number;
}

export const HealthScoreBadge: React.FC<HealthScoreBadgeProps> = ({ score }) => {
  const roundedScore = Math.round(score * 10) / 10;
  
  // Progress Ring Math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getHealthStatus = () => {
    if (score >= 90) return { label: 'Excellent Data Quality', color: 'text-[#F2DC5D]', Icon: ShieldCheck };
    if (score >= 75) return { label: 'Good Quality', color: 'text-emerald-400', Icon: Activity };
    if (score >= 50) return { label: 'Moderate Quality', color: 'text-amber-400', Icon: AlertTriangle };
    return { label: 'Needs Attention', color: 'text-rose-400', Icon: AlertTriangle };
  };

  const status = getHealthStatus();

  return (
    <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 hover:border-[#F2DC5D]/40 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold tracking-wider text-[#7D8CA3] uppercase font-sans">
          Dataset Health Score
        </span>
        <status.Icon className={`w-4 h-4 ${status.color}`} />
      </div>

      <div className="flex items-center gap-5 mt-2">
        {/* SVG Progress Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-[#121212]"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-[#F2DC5D] transition-all duration-1000 ease-out"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-mono text-white tracking-tight">
              {roundedScore}%
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className={`text-sm font-semibold ${status.color} flex items-center gap-1.5`}>
            {status.label}
          </div>
          <p className="text-xs text-[#7D8CA3] leading-relaxed">
            Calculated based on missing cell penalties, duplicate row counts, and column variance.
          </p>
          <div className="mt-2 w-full bg-[#121212] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#F2DC5D] h-full rounded-full transition-all duration-700"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
