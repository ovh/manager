import { ObsChartData, ObsWidget } from '../../types';
import { IDashboardService } from './IDashboardService';
import { fetchPrometheusData, PrometheusResult } from '../api/prometheusClient';

export class DashboardServiceApi implements IDashboardService {
  private readonly defaults = { windowSec: 60 * 60, stepSec: 60 };

  private readonly serviceName = 'DashboardServiceApi';

  async fetchDashboardConfig(): Promise<ObsWidget[]> {
    throw new Error(
      `${this.serviceName}: DashboardConfig API not implemented yet`,
    );
  }

  async fetchChartData(chartId: string): Promise<ObsChartData> {
    const now = Math.floor(Date.now() / 1000);
    const start = now - this.defaults.windowSec;
    const end = now;
    const step = this.defaults.stepSec;

    const result: PrometheusResult = await fetchPrometheusData({
      query: chartId,
      start,
      end,
      step,
    });

    const data: ObsChartData = result.data.result.flatMap((series) =>
      series.values.map(([timestamp, value]) => ({
        timestamp: Number(timestamp) * 1000, // ms
        value: Number(value),
      })),
    );

    return data;
  }
}
