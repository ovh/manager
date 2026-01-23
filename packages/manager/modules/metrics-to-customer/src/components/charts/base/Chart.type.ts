import { BarsChartConfig } from '../bars';
import { TimeSeriesChartConfig } from '../timeseries/TimeSeriesChart.type';

export const CHART_TYPE = {
  TimeSeries: 'TimeSeries',
  Bars: 'Bars',
} as const;

export type ChartType = (typeof CHART_TYPE)[keyof typeof CHART_TYPE];
export const CHART_TYPES = Object.values(CHART_TYPE) as ChartType[];

export type ChartConfig = TimeSeriesChartConfig | BarsChartConfig;

export type ChartConfigBase<T extends ChartType> = {
  type: T;
};

export type ChartData<TData> = TData[];

export interface ChartProps<TData> {
  id: string;
  title: string;
  data: TData[];
  chartConfig: ChartConfig;
  isLoading: boolean;
  isFullscreen?: boolean;
  locale?: string;
}
