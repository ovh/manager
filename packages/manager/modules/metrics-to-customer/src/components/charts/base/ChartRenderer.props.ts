import { DashboardState } from '@/contexts';

import { ChartProps, ChartType } from '@/types/charts/base/Chart.type';

export interface ChartRendererProps<TData> extends ChartProps<TData> {
  type: ChartType;
  state: DashboardState;
}
