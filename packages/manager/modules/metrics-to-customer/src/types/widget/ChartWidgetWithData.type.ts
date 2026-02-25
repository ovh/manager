import { ChartWidget } from '@/types/widget/ChartWidget.type';

export type ChartWidgetWithData<TData> = ChartWidget & {
  data: TData[];
  isLoading: boolean;
};
