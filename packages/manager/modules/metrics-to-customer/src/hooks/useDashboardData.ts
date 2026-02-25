import { useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useDashboardContext } from '@/contexts';
import { useDashboardConfig, useMultipleChartData } from '@/data/hooks/dashboards';
import { ChartQueryResult } from '@/types/ChartQueryResult.type';
import { Dashboard } from '@/types/observability.type';
import { ChartWidgetWithData } from '@/types/widget/ChartWidgetWithData.type';
import { buildQueryWithResourceUrn } from '@/utils/metrics.utils';

/**
 * Hook that combines dashboard configuration with chart data to create
 * a complete dashboard widgets array with data, loading states, and layout properties.
 * @param resourceName
 * @param productType
 * @param resourceURN
 * @param metricToken
 * @param fetchData - If false, only retrieves dashboard config without fetching chart data
 * @returns Object containing:
 *   - charts: Array of chart with data and layout properties
 *   - configLoading: Boolean indicating if dashboard config is still loading
 */
export const useDashboardData = <TData>(
  resourceName: string,
  productType: string,
  resourceURN: string,
  metricToken: string,
  fetchData = true,
) => {
  const queryClient = useQueryClient();
  const { state: dashboardState } = useDashboardContext();
  const { startDateTime, endDateTime, selectedTimeOption, refreshInterval } = dashboardState;

  const { data: dashboardTemplate, isLoading: configLoading } = useDashboardConfig(
    resourceName,
    productType,
  );

  const dashboard: Dashboard | undefined = dashboardTemplate
    ? {
        ...dashboardTemplate,
        currentState: dashboardTemplate.currentState.map((chartWidget) => ({
          ...chartWidget,
          query: buildQueryWithResourceUrn(chartWidget.query, resourceURN),
        })),
      }
    : undefined;

  const chartQueries = useMultipleChartData<TData>({
    dashboard,
    startDateTime,
    endDateTime,
    selectedTimeOption,
    refreshInterval,
    metricToken,
    fetchData,
  });

  const charts = useMemo<ChartWidgetWithData<TData>[]>(() => {
    if (!dashboard?.currentState) return [];

    return dashboard.currentState.map((chartWidget, index) => {
      const { data, isLoading } = chartQueries[index] as ChartQueryResult<TData>;
      return {
        ...chartWidget,
        colspan: chartWidget.colspan ?? 1,
        rowspan: chartWidget.rowspan ?? 1,
        data: data ?? [],
        isLoading,
      };
    });
  }, [dashboard, chartQueries]);

  const refetchAll = () => {
    chartQueries.forEach((query) => {
      if (query && 'refetch' in query && typeof query.refetch === 'function') {
        void query.refetch();
      }
    });
  };

  const cancelAll = () => {
    void queryClient.cancelQueries({
      queryKey: ['chartData'],
      exact: false,
    });
  };

  return { charts, configLoading, refetchAll, cancelAll };
};
