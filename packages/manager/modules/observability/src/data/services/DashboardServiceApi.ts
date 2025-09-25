import { ObsChartData, ObsWidget } from '../../types';
import { IDashboardService } from './IDashboardService';
import { fetchPrometheusData, PrometheusResult } from '../api/prometheusClient';
import dashboardConfig from '../mocks/config/dashboardConfig2.json';

export class DashboardServiceApi implements IDashboardService {
  private readonly defaults = { windowSec: 60 * 60, stepSec: 60 };

  private readonly serviceName = 'DashboardServiceApi';

  async fetchDashboardConfig(): Promise<ObsWidget[]> {
    return dashboardConfig as ObsWidget[];

    throw new Error(
      `${this.serviceName}: DashboardConfig API not implemented yet`,
    );
  }

  async fetchChartData(
    chartId: string,
    query: string,
    selectedTimeOption: string,
  ): Promise<ObsChartData> {
    const now = Math.floor(Date.now() / 1000);

    // Determine the window in seconds based on selectedTimeOption
    let windowSec: number;
    let step: number;
    switch (selectedTimeOption) {
      case '1h': {
        windowSec = 60 * 60; // 1 hour
        step = 14; // 1-minute step
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
      query,
      start,
      end,
      step,
    });

    console.log(chartId);

    const data: ObsChartData = result.data.result[0].values.map(
      ([timestamp, value]) => {
        return {
          timestamp: Number(timestamp) * 1000, // ms
          value: Number(value),
        };
      },
    );

    return data;
  }
}
