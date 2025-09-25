import { ObsWidget } from '../../types';
import { IDashboardService } from './IDashboardService';
import dashboardConfig from '../mocks/config/dashboardConfig.json';

// Simulate delay between 3s and 6s
const disableDelay = true;
const configDelayInSeconds = 0.5;
const configDelay = () =>
  disableDelay
    ? 0
    : configDelayInSeconds * 1000 + Math.random() * configDelayInSeconds * 1000;

// Simulate delay between 1500ms and 7000ms
const dataDelay = () => (disableDelay ? 0 : 1500 + Math.random() * 5500);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Dynamic import of all chart datasets
const datasets = import.meta.glob('../mocks/datasets/chart-*.json', {
  eager: true,
});

// Transform the imported datasets to match the expected format
const getMockChartData = (
  chartId: string,
  query: string,
  selectedTimeOption: string,
) => {
  console.log(query);
  console.log(selectedTimeOption);
  const key = `../mocks/datasets/${chartId}.json`;
  return datasets[key] ? (datasets[key] as any).default || datasets[key] : [];
};

export class DashboardServiceMock implements IDashboardService {
  // eslint-disable-next-line class-methods-use-this
  async fetchDashboardConfig(): Promise<ObsWidget[]> {
    await delay(configDelay());
    return dashboardConfig as ObsWidget[];
  }

  // eslint-disable-next-line class-methods-use-this
  async fetchChartData(
    chartId: string,
    query: string,
    selectedTimeOption: string,
  ): Promise<any[]> {
    await delay(dataDelay());
    return getMockChartData(chartId, query, selectedTimeOption);
  }
}
