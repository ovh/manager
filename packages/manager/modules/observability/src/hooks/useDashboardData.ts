import { useMemo } from 'react';
import { useDashboardConfig, useMultipleChartData } from '../data/hooks';
import { ObsChartWithData } from '../types';

/**
 * Hook that combines dashboard configuration with chart data to create
 * a complete dashboard widgets array with data, loading states, and layout properties.
 *
 * @returns Object containing:
 *   - widgets: Array of chart widgets with data and layout properties
 *   - configLoading: Boolean indicating if dashboard config is still loading
 */
export const useDashboardData = () => {
  const { data: config, isLoading: configLoading } = useDashboardConfig();
  const chartQueries = useMultipleChartData(config || []);

  const widgets = useMemo<ObsChartWithData[]>(() => {
    if (!config) return [];
    return config.map((chartConfig, index) => ({
      ...chartConfig,
      colspan: chartConfig.colspan ?? 1,
      rowspan: chartConfig.rowspan ?? 1,
      data: chartQueries[index]?.data ?? [],
      isLoading: chartQueries[index]?.isLoading ?? true,
    }));
  }, [config, chartQueries]);

  return { widgets, configLoading };
};
