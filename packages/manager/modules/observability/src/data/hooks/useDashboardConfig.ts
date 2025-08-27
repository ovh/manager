import { useQuery, queryOptions } from '@tanstack/react-query';
import { ObsWidget, ObsChartType } from '../../types';
import { useChartData } from './useChartData';
import { fetchDashboardConfig } from '../api/dashboard';

// helper to generate query key
const getDashboardConfigQueryKey = () => ['dashboardConfig'] as const;

// typed query options using queryOptions()
const getDashboardConfigOptions = () =>
  queryOptions({
    queryKey: getDashboardConfigQueryKey(),
    queryFn: async (): Promise<ObsWidget[]> => {
      try {
        const result = await fetchDashboardConfig();
        return result.map((widget: ObsWidget) => ({
          ...widget,
          type: widget.chart.type as ObsChartType,
          data: [],
        }));
      } catch (error) {
        console.error('Failed to fetch dashboard config:', error);
        throw new Error(
          `Failed to load dashboard configuration: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );
      }
    },
  });

// hook to fetch dashboard config
export const useDashboardConfig = () => {
  return useQuery(getDashboardConfigOptions());
};

export const useChartWithData = (chartId?: string) => {
  // full dashboard configuration
  const {
    data: config = [],
    isLoading: configLoading,
    error: configError,
    isError: isConfigError,
  } = useDashboardConfig();

  // find config for this chart
  const chartConfig: ObsWidget | undefined = config.find(
    (c) => c.id === chartId,
  );

  // fetch chart data
  const {
    data: chartData,
    isLoading: dataLoading,
    error: dataError,
    isError: isDataError,
  } = useChartData(chartId);

  const isLoading = configLoading || dataLoading;

  const error = configError || dataError;
  const isError = isConfigError || isDataError;

  return {
    config: chartConfig,
    data: chartData,
    isLoading,
    error,
    isError,
    configError,
    dataError,
    isConfigError,
    isDataError,
  };
};
