import React from 'react';

export const LoadingSkeleton: React.FC<{ type?: 'card' | 'chart' | 'table' | 'full' }> = ({
  type = 'card',
}) => {
  if (type === 'chart') {
    return (
      <div className="w-full h-72 bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-6 animate-pulse flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 bg-[#7D8CA3]/20 rounded"></div>
          <div className="h-4 w-20 bg-[#7D8CA3]/20 rounded"></div>
        </div>
        <div className="flex items-end gap-3 h-48 pt-6">
          {[40, 65, 30, 85, 50, 95, 70, 45, 60, 35, 80, 55].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-[#7D8CA3]/15 rounded-t"
              style={{ height: `${h}%` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-4 animate-pulse space-y-3">
        <div className="h-8 bg-[#7D8CA3]/20 rounded w-1/3"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-[#7D8CA3]/10 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#181A20] border border-[#7D8CA3]/20 rounded-xl p-5 animate-pulse space-y-3">
      <div className="h-4 w-24 bg-[#7D8CA3]/20 rounded"></div>
      <div className="h-8 w-32 bg-[#7D8CA3]/20 rounded"></div>
      <div className="h-3 w-48 bg-[#7D8CA3]/10 rounded"></div>
    </div>
  );
};
