import { useQuery, useQueries, queryOptions } from '@tanstack/react-query';
import { ObsChartData } from '../../types';
import { fetchChartData } from '../api/dashboard';

// helper to generate the query key
export const getChartDataQueryKey = (chartId: string) =>
  ['chartData', chartId] as const;

// typed query options using queryOptions()
export const getChartDataOptions = (chartId: string) =>
  queryOptions({
    queryKey: getChartDataQueryKey(chartId),
    queryFn: (): Promise<ObsChartData> => fetchChartData(chartId),
    refetchInterval: false,
    enabled: !!chartId,
  });

// hook for a single chart
export const useChartData = (chartId?: string) => {
  return useQuery(getChartDataOptions(chartId ?? ''));
};

// hook for multiple charts
export const useMultipleChartData = (charts: { id: string }[]) => {
  return useQueries({
    queries: charts.map((chart) => getChartDataOptions(chart.id)),
  });
};
