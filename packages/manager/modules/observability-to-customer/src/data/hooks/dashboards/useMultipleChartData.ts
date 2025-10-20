import { UseQueryResult, useQueries } from '@tanstack/react-query';

import { RequestPayload } from '../../../types/RequestPayload.type';
import { TimeRangeOption } from '../../../types/TimeRangeOption.type';
import { Dashboard, MetricData } from '../../../types/observability.type';
import { getWindowSecAndStep } from '../../../utils/dateTimeUtils';
import { getChartDataOptions } from './getChartDataOptions';

export type ChartQueryResult<TData> = UseQueryResult<MetricData<TData>, unknown>;

export const useMultipleChartData = <TData>(
  dashboard: Dashboard | undefined,
  startDateTime: number | undefined,
  endDateTime: number | undefined,
  selectedTimeOption: TimeRangeOption,
  refreshInterval: number,
): ChartQueryResult<TData>[] => {
  const hasCharts = !!dashboard?.currentState?.length;

  const now = Math.floor(Date.now() / 1000);
  const end = endDateTime ?? now;
  const { step, windowSec } = getWindowSecAndStep(selectedTimeOption);
  const start = startDateTime ?? end - windowSec;

  const queries = hasCharts
    ? dashboard.currentState.map((chart) => {
        const payload: RequestPayload = {
          query: chart.query,
          start,
          end,
          step,
          type: 'query_range',
        };
        const query = getChartDataOptions<TData>(payload, refreshInterval);

        return {
          ...query,
          enabled: true,
        };
      })
    : [];

  return useQueries({ queries });
};
