import { ChartConfig } from './Chart.type';

export interface ChartProps<TData> {
  id: string;
  title: string;
  data: TData[];
  chartConfig: ChartConfig;
  isLoading: boolean;
  isFullscreen?: boolean;
}
