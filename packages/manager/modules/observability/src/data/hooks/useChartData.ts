import { useQuery, useQueries, queryOptions } from '@tanstack/react-query';
import { ObsChartData } from '../../types';
import { fetchChartData } from '../api/dashboard';

// helper to generate the query key
export const getChartDataQueryKey = (
  chartId: string,
  selectedTimeOption: string,
) => ['chartData', chartId, 'timeOption', selectedTimeOption] as const;

// typed query options using queryOptions()
export const getChartDataOptions = (
  chartId: string,
  selectedTimeOption: string,
  refreshInterval: number,
) =>
  queryOptions({
    queryKey: getChartDataQueryKey(chartId, selectedTimeOption),
    queryFn: (): Promise<ObsChartData> =>
      fetchChartData(chartId, selectedTimeOption),
    refetchInterval: refreshInterval > 0 ? refreshInterval * 1000 : false,
    enabled: !!chartId,
  });

// hook for a single chart
export const useChartData = (
  chartId?: string,
  selectedTimeOption?: string,
  refreshInterval?: number,
) => {
  return useQuery(
    getChartDataOptions(
      chartId ?? '',
      selectedTimeOption ?? '',
      refreshInterval ?? -1,
    ),
  );
};

// hook for multiple charts
export const useMultipleChartData = (
  charts: { id: string }[],
  selectedTimeOption: string,
  refreshInterval: number,
) => {
  return useQueries({
    queries: charts.map((chart) =>
      getChartDataOptions(chart.id, selectedTimeOption, refreshInterval),
    ),
  });
};
