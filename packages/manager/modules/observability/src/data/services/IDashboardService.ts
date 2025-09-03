import { ObsWidget } from '../../types';

export interface IDashboardService {
  fetchDashboardConfig(): Promise<ObsWidget[]>;
  fetchChartData(chartId: string): Promise<any[]>;
}
