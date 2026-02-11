import { ChartWidgetWithData } from '@/types/widget/ChartWidgetWithData.type';

export interface DashboardProps<TData> {
  charts: ChartWidgetWithData<TData>[];
  onRefresh: () => void;
  onCancel: () => void;
}
