import { ChartWidget } from './ChartWidget.type';

export type ChartWidgetWithData<TData> = ChartWidget & {
  data: TData[];
  isLoading: boolean;
};
