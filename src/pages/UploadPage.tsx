import React from 'react';
import { BackgroundGrid } from '../components/upload/BackgroundGrid';
import { Dropzone } from '../components/upload/Dropzone';
import { DemoChips } from '../components/upload/DemoChips';
import { useDatasetStore } from '../store/useDatasetStore';
import { uploadDataset } from '../api';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const { setDataset, isUploading, setUploading, uploadError, setUploadError } = useDatasetStore();

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      setUploadError(null);
      const datasetResponse = await uploadDataset(file);
      setDataset(datasetResponse);
    } catch (err: any) {
      console.error('Upload Error:', err);
      const message = err.response?.data?.detail || err.message || 'Failed to upload and process dataset.';
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <BackgroundGrid>
      {/* Top Header Branding */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/edw-logo.png"
            alt="EDataWiz Logo"
            className="w-9 h-9 rounded-xl shadow-lg shadow-[#F2DC5D]/20 object-contain"
          />
          <span className="text-xl font-extrabold tracking-tight text-white font-sans">
            EData<span className="text-[#F2DC5D]">Wiz</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#7D8CA3]">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181A20] border border-[#7D8CA3]/20">
            <Zap className="w-3.5 h-3.5 text-[#F2DC5D]" /> Fast Polars Engine
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181A20] border border-[#7D8CA3]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% In-Memory Stat Analysis
          </span>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-4xl mx-auto text-center">
        {/* Entrance Animation Title & Tagline */}
        <div className="space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2DC5D]/10 border border-[#F2DC5D]/30 text-[#F2DC5D] text-xs font-mono font-medium animate-fade-up">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen EDA Engine
          </div>

          <div className="flex justify-center animate-fade-up">
            <img
              src="/edw-logo.png"
              alt="EDataWiz"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl shadow-2xl shadow-[#F2DC5D]/25 border border-[#F2DC5D]/30 object-contain p-1.5 bg-[#181A20]/80 backdrop-blur-sm"
            />
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight animate-fade-up animate-fade-up-delay-1">
            EData<span className="text-[#F2DC5D] drop-shadow-[0_0_20px_rgba(242,220,93,0.3)]">Wiz</span>
          </h1>

          <p className="text-lg sm:text-2xl font-semibold text-slate-300 tracking-tight animate-fade-up animate-fade-up-delay-1">
            Instant Exploratory Data Analysis Playground
          </p>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#7D8CA3] leading-relaxed animate-fade-up animate-fade-up-delay-2">
            Drop your CSV. Instant statistical insights, distributions, and multi-variable correlations in seconds. Zero configuration.
          </p>
        </div>

        {/* Minimalist Upload Card */}
        <div className="w-full animate-fade-up animate-fade-up-delay-2">
          <Dropzone
            onFileSelect={handleFileUpload}
            isUploading={isUploading}
            error={uploadError}
          />

          <DemoChips
            onSelectDemo={handleFileUpload}
            disabled={isUploading}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs font-mono text-[#7D8CA3]/60">
        EDataWiz &copy; {new Date().getFullYear()} &bull; Built with React, TypeScript & Polars
      </footer>
    </BackgroundGrid>
  );
};
