import { DashboardState } from '@/contexts';

import { ChartProps, ChartType } from './Chart.type';

export interface ChartRendererProps<TData> extends ChartProps<TData> {
  type: ChartType;
  state: DashboardState;
}
