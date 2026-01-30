import { ChartWidgetWithData } from '@/types/widget/ChartWidgetWithData.type';

export interface DashboardProps<TData> {
  charts: ChartWidgetWithData<TData>[];
  configUrl: string;
  onRefresh: () => void;
  onCancel: () => void;
}
