import { ObsWidget } from '../../types';
import { getDashboardService } from '../services/ServiceFactory';

export const fetchDashboardConfig = (): Promise<ObsWidget[]> => {
  return getDashboardService().fetchDashboardConfig();
};

export const fetchChartData = (chartId: string): Promise<any[]> => {
  return getDashboardService().fetchChartData(chartId);
};
