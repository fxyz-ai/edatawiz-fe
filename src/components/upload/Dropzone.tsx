import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  error: string | null;
}

const MAX_SIZE_MB = 15;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, isUploading, error }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setClientError(null);

    // Strict Client Validation: .csv extension check
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setClientError('Invalid file format. Only .csv files are supported.');
      return;
    }

    // Strict Client Validation: <= 15 MB check
    if (file.size > MAX_SIZE_BYTES) {
      setClientError(`File size exceeds maximum limit of ${MAX_SIZE_MB} MB (${(file.size / (1024 * 1024)).toFixed(1)} MB selected).`);
      return;
    }

    if (file.size === 0) {
      setClientError('The selected CSV file is empty.');
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const displayError = clientError || error;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-300 cursor-pointer group backdrop-blur-sm ${
          isUploading
            ? 'bg-[#181A20]/80 border-[#F2DC5D] cursor-wait'
            : isDragOver
            ? 'bg-[#1E222B] border-[#F2DC5D] shadow-2xl scale-[1.01] glow-accent'
            : displayError
            ? 'bg-[#181A20] border-rose-500/50 hover:border-rose-400'
            : 'bg-[#181A20]/90 border-[#7D8CA3]/30 hover:border-[#F2DC5D] hover:bg-[#1E222B]/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />

        {/* Upload State Rendering */}
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#F2DC5D]/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#F2DC5D] animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Inspecting & Parsing CSV...</h3>
              <p className="text-xs text-[#7D8CA3] mt-1 font-mono">
                Profiling schemas, missing data, & correlation metrics
              </p>
            </div>
            {/* Progress Bar Animation */}
            <div className="w-48 bg-[#121212] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#F2DC5D] h-full rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                isDragOver
                  ? 'bg-[#F2DC5D] text-black'
                  : 'bg-[#121212] text-[#F2DC5D] border border-[#7D8CA3]/20 group-hover:border-[#F2DC5D]/50'
              }`}
            >
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <p className="text-base font-semibold text-slate-100 group-hover:text-[#F2DC5D] transition-colors">
                <span className="text-[#F2DC5D] underline underline-offset-4 decoration-[#F2DC5D]/40">
                  Click to upload
                </span>{' '}
                or drag & drop your CSV file
              </p>
              <p className="text-xs text-[#7D8CA3] mt-1 font-sans">
                Supports standard .CSV files up to <span className="font-mono font-medium text-slate-300">15 MB</span>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-[#121212] text-[#7D8CA3] border border-[#7D8CA3]/20">
                <FileText className="w-3 h-3 text-[#F2DC5D]" /> Strict CSV Validation
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-[#121212] text-[#7D8CA3] border border-[#7D8CA3]/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Auto Type Inference
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message Alert */}
      {displayError && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fade-up">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span className="font-medium">{displayError}</span>
        </div>
      )}
    </div>
  );
};
