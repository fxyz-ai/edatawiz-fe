export interface HealthResponse {
  status: string;
  uptime: boolean;
}

export type ColumnType = 'numeric' | 'categorical' | 'datetime' | 'unsupported';

export interface ColumnInfo {
  name: string;
  type: ColumnType | string;
  missingCount: number;
  missingPercentage: number;
}

export interface UploadResponse {
  datasetId: string;
  filename: string;
  rowCount: number;
  columnCount: number;
  columns: ColumnInfo[];
}

export interface ColumnSummary {
  name: string;
  type: ColumnType | string;
  nullCount: number;
  uniqueCount: number;
  min?: number | null;
  max?: number | null;
}

export type HealthFlag = 'PRIMARY_KEY' | 'HIGH_CARDINALITY' | 'CONSTANT' | 'HIGH_MISSING' | 'NORMAL';

export interface ColumnHealth {
  name: string;
  data_type: string;
  null_count: number;
  missing_pct: number;
  unique_values: number;
  range_min?: number | null;
  range_max?: number | null;
  flags: (HealthFlag | string)[];
}

export interface OverviewSummary {
  total_rows: number;
  total_cols: number;
  numeric_cols_count: number;
  categorical_cols_count: number;
  missing_cells: number;
  missing_cells_pct: number;
  duplicate_rows: number;
  duplicate_rows_pct: number;
  memory_bytes?: number;
  memory_usage: string;
  health_score: number;
}

export interface OverviewResponse {
  summary: OverviewSummary;
  columns: ColumnHealth[];
  // Backwards-compatibility
  totalRows?: number;
  totalColumns?: number;
  totalMissingCells?: number;
  duplicateRows?: number;
  healthScore?: number;
  columnSummaries?: ColumnSummary[];
}

export interface UnivariateSummaryResponse {
  column: string;
  type: ColumnType | string;
  mean?: number | null;
  median?: number | null;
  std?: number | null;
  min?: number | null;
  max?: number | null;
  q1?: number | null;
  q3?: number | null;
  iqr?: number | null;
  totalUniqueCount?: number | null;
  topCategory?: string | null;
  topCategoryCount?: number | null;
  nullCount: number;
}

export interface NumericStats {
  mean?: number | null;
  median?: number | null;
  std_dev?: number | null;
  min?: number | null;
  max?: number | null;
  iqr?: number | null;
  q1?: number | null;
  q3?: number | null;
  skewness?: number | null;
  skewness_label: 'Symmetric' | 'Right-Skewed' | 'Left-Skewed' | string;
  kurtosis?: number | null;
  zero_count: number;
  negative_count: number;
  outliers_count: number;
  outliers_pct: number;
  lower_whisker?: number | null;
  upper_whisker?: number | null;
}

export interface CategoryDistributionItem {
  category: string;
  count: number;
  percentage: number;
  rank: number;
  cumulative_percentage: number;
}

export interface CategoricalStats {
  mode?: string | null;
  mode_frequency: number;
  mode_percentage: number;
  unique_count: number;
  total_count: number;
  null_count: number;
  missing_pct: number;
  cardinality_status: 'Low' | 'Medium' | 'High' | string;
  top_categories: CategoryDistributionItem[];
}

export interface UnivariateChartData {
  type: 'histogram' | 'bar';
  bins?: HistogramBin[];
  categories?: CategoryDistributionItem[];
}

export interface UnivariateProfileResponse {
  column_name: string;
  data_type: 'numeric' | 'categorical';
  total_records: number;
  null_count: number;
  insight_summary: string;
  numeric_stats?: NumericStats | null;
  categorical_stats?: CategoricalStats | null;
  chart_data: UnivariateChartData;
}

export interface HistogramBin {
  range: string;
  binStart: number;
  binEnd: number;
  count: number;
}

export interface BoxplotResponse {
  column: string;
  min?: number | null;
  q1?: number | null;
  median?: number | null;
  q3?: number | null;
  max?: number | null;
  outliers: number[];
}

export interface FrequencyItem {
  category: string;
  count: number;
}

export interface CorrelationResponse {
  colX: string;
  colY: string;
  correlation?: number | null;
  covariance?: number | null;
  sampleSize: number;
}

export interface ScatterPoint {
  x?: number | null;
  y?: number | null;
}

export interface GroupedBarItem {
  category: string;
  average?: number | null;
  count: number;
}

export interface GroupedScatterGroup {
  group: string;
  points: ScatterPoint[];
}

export interface GroupedComparisonItem {
  category: string;
  metric1?: number | null;
  metric2?: number | null;
  count: number;
  metric1Name: string;
  metric2Name: string;
}

export type TabType = 'overview' | 'univariate' | 'bivariate' | 'multivariate';
