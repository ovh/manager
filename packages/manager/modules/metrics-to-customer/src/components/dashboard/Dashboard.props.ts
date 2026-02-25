import { ChartWidgetWithData } from '@/types/widget/ChartWidgetWithData.type';

export interface DashboardProps<TData> {
  charts: ChartWidgetWithData<TData>[];
  disabled?: boolean;
  onRefresh: () => void;
  onCancel: () => void;
}
