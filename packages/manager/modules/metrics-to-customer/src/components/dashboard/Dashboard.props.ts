import { ChartWidgetWithData } from '../widget/ChartWidgetWithData.type';

export interface DashboardProps<TData> {
  charts: ChartWidgetWithData<TData>[];
}
