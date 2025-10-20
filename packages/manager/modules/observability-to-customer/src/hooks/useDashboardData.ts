import { useMemo } from 'react';

import { ChartWidgetWithData } from '../components/widget/ChartWidgetWithData.type';
import { useDashboardContext } from '../contexts';
import { useDashboardConfig, useMultipleChartData } from '../data/hooks';
import { ChartQueryResult } from '../data/hooks/dashboards/useMultipleChartData';

/**
 * Hook that combines dashboard configuration with chart data to create
 * a complete dashboard widgets array with data, loading states, and layout properties.
 * @param serviceName
 * @param productType
 * @returns Object containing:
 *   - charts: Array of chart with data and layout properties
 *   - configLoading: Boolean indicating if dashboard config is still loading
 */
export const useDashboardData = <TData>(serviceName: string, productType: string) => {
  const { state: dashboardState } = useDashboardContext();
  const { startDateTime, endDateTime, selectedTimeOption, refreshInterval } = dashboardState;

  const { data: dashboard, isLoading: configLoading } = useDashboardConfig(
    serviceName,
    productType,
  );

  const chartQueries = useMultipleChartData<TData>(
    dashboard,
    startDateTime,
    endDateTime,
    selectedTimeOption,
    refreshInterval,
  );

  const charts = useMemo<ChartWidgetWithData<TData>[]>(() => {
    if (!dashboard?.currentState) return [];

    return dashboard.currentState.map((chartWidget, index) => {
      const { data, isLoading } = chartQueries[index] as ChartQueryResult<TData>;
      return {
        ...chartWidget,
        colspan: chartWidget.colspan ?? 1,
        rowspan: chartWidget.rowspan ?? 1,
        data: data ?? [],
        isLoading: isLoading,
      };
    });
  }, [dashboard, chartQueries]);

  return { charts, configLoading };
};
