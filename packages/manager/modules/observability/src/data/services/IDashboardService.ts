import { ObsWidget } from '../../types';

export interface IDashboardService {
  fetchDashboardConfig(): Promise<ObsWidget[]>;
  fetchChartData(
    chartId: string,
    query: string,
    selectedTimeOption: string,
  ): Promise<any[]>;
}
