import { DashboardState } from '../../../contexts';
import { ChartProps } from './Chart.props';
import { ChartType } from './Chart.type';

export interface ChartRendererProps<TData> extends ChartProps<TData> {
  type: ChartType;
  state: DashboardState;
}
