import { create } from 'zustand';
import type { UploadResponse, TabType } from '../types/api';

interface DatasetState {
  dataset: UploadResponse | null;
  datasetId: string | null;
  activeTab: TabType;
  isUploading: boolean;
  uploadError: string | null;
  
  setDataset: (dataset: UploadResponse | null) => void;
  setActiveTab: (tab: TabType) => void;
  setUploading: (uploading: boolean) => void;
  setUploadError: (error: string | null) => void;
  resetDataset: () => void;
}

export const useDatasetStore = create<DatasetState>((set) => ({
  dataset: null,
  datasetId: null,
  activeTab: 'overview',
  isUploading: false,
  uploadError: null,

  setDataset: (dataset) => set({ 
    dataset, 
    datasetId: dataset ? dataset.datasetId : null,
    uploadError: null 
  }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setUploading: (isUploading) => set({ isUploading }),
  setUploadError: (uploadError) => set({ uploadError }),
  resetDataset: () => set({ dataset: null, datasetId: null, activeTab: 'overview', uploadError: null }),
}));
