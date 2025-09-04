import { ObsChartData, ObsChartType, ObsWidget } from '../../types';
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

  async fetchChartData(
    chartId: string,
    selectedTimeOption: string,
  ): Promise<ObsChartData> {
    console.log(chartId);
    const now = Math.floor(Date.now() / 1000);

    // Determine the window in seconds based on selectedTimeOption
    let windowSec: number;
    let step: number;
    switch (selectedTimeOption) {
      case '1h': {
        windowSec = 60 * 60; // 1 hour
        step = 60; // 1-minute step
        break;
      }
      case '12h': {
        windowSec = 12 * 60 * 60; // 12 hours
        step = 5 * 60; // 5-minute step
        break;
      }
      case '1d':
      case 'custom': {
        windowSec = 24 * 60 * 60; // 1 day
        step = 10 * 60; // 10-minute step
        break;
      }
      default: {
        windowSec = this.defaults.windowSec;
        step = this.defaults.stepSec;
        break;
      }
    }

    const start = now - windowSec;
    const end = now;

    const result: PrometheusResult = await fetchPrometheusData({
      query: 'demo_api_http_requests_in_progress',
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
