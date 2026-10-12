import React from 'react';

export const BackgroundGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#121212] overflow-hidden flex flex-col justify-between">
      {/* Subtle Checkered/Grid Overlay with #7D8CA3 at low opacity */}
      <div 
        className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-60"
        style={{
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)',
        }}
      />

      {/* Decorative Glow Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#F2DC5D]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-[#7D8CA3]/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};
