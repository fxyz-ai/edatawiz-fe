import { apiClient } from './client';
import type {
  HealthResponse,
  UploadResponse,
  OverviewResponse,
  UnivariateSummaryResponse,
  UnivariateProfileResponse,
  HistogramBin,
  BoxplotResponse,
  FrequencyItem,
  CorrelationResponse,
  ScatterPoint,
  GroupedBarItem,
  GroupedScatterGroup,
  GroupedComparisonItem,
} from '../types/api';

export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>('/health');
  return response.data;
};

export const uploadDataset = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<UploadResponse>('/api/datasets/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getOverview = async (datasetId: string): Promise<OverviewResponse> => {
  const response = await apiClient.get<OverviewResponse>(`/api/datasets/${datasetId}/overview`);
  return response.data;
};

export const getUnivariateSummary = async (datasetId: string, column: string): Promise<UnivariateSummaryResponse> => {
  const response = await apiClient.get<UnivariateSummaryResponse>(`/api/datasets/${datasetId}/univariate/summary`, {
    params: { column },
  });
  return response.data;
};

export const getUnivariateProfile = async (
  datasetId: string,
  column: string,
  binCount: number = 15
): Promise<UnivariateProfileResponse> => {
  const response = await apiClient.get<UnivariateProfileResponse>(`/api/datasets/${datasetId}/univariate`, {
    params: { column, bin_count: binCount },
  });
  return response.data;
};

export const getUnivariateHistogram = async (
  datasetId: string,
  column: string,
  bins: number = 15
): Promise<HistogramBin[]> => {
  const response = await apiClient.get<HistogramBin[]>(`/api/datasets/${datasetId}/univariate/histogram`, {
    params: { column, bins },
  });
  return response.data;
};

export const getUnivariateBoxplot = async (
  datasetId: string,
  column: string
): Promise<BoxplotResponse> => {
  const response = await apiClient.get<BoxplotResponse>(`/api/datasets/${datasetId}/univariate/boxplot`, {
    params: { column },
  });
  return response.data;
};

export const getUnivariateFrequency = async (
  datasetId: string,
  column: string
): Promise<FrequencyItem[]> => {
  const response = await apiClient.get<FrequencyItem[]>(`/api/datasets/${datasetId}/univariate/frequency`, {
    params: { column },
  });
  return response.data;
};

export const getBivariateCorrelation = async (
  datasetId: string,
  colX: string,
  colY: string
): Promise<CorrelationResponse> => {
  const response = await apiClient.get<CorrelationResponse>(`/api/datasets/${datasetId}/bivariate/correlation`, {
    params: { colX, colY },
  });
  return response.data;
};

export const getBivariateScatter = async (
  datasetId: string,
  colX: string,
  colY: string
): Promise<ScatterPoint[]> => {
  const response = await apiClient.get<ScatterPoint[]>(`/api/datasets/${datasetId}/bivariate/scatter`, {
    params: { colX, colY },
  });
  return response.data;
};

export const getBivariateGroupedBar = async (
  datasetId: string,
  colX: string,
  colY: string
): Promise<GroupedBarItem[]> => {
  const response = await apiClient.get<GroupedBarItem[]>(`/api/datasets/${datasetId}/bivariate/grouped-bar`, {
    params: { colX, colY },
  });
  return response.data;
};

export const getMultivariateGroupedScatter = async (
  datasetId: string,
  colX: string,
  colY: string,
  groupBy: string
): Promise<GroupedScatterGroup[]> => {
  const response = await apiClient.get<GroupedScatterGroup[]>(
    `/api/datasets/${datasetId}/multivariate/grouped-scatter`,
    { params: { colX, colY, groupBy } }
  );
  return response.data;
};

export const getMultivariateGroupedComparison = async (
  datasetId: string,
  groupCol: string,
  metricCol: string,
  secondMetricCol: string
): Promise<GroupedComparisonItem[]> => {
  const response = await apiClient.get<GroupedComparisonItem[]>(
    `/api/datasets/${datasetId}/multivariate/grouped-comparison`,
    { params: { groupCol, metricCol, secondMetricCol } }
  );
  return response.data;
};
