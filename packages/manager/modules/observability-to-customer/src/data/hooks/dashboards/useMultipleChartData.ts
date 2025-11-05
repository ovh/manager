import { useQueries } from '@tanstack/react-query';

import { getChartDataOptions } from '@/data/hooks/dashboards/getChartDataOptions';
import type { ChartQueryResult } from '@/types/ChartQueryResult.type';
import { RequestPayload } from '@/types/RequestPayload.type';
import { TimeRangeOption } from '@/types/TimeRangeOption.type';
import { Dashboard } from '@/types/observability.type';
import { getWindowSecAndStep } from '@/utils/dateTimeUtils';

type UseMultipleChartDataParams = {
  dashboard?: Dashboard;
  startDateTime?: number;
  endDateTime?: number;
  selectedTimeOption: TimeRangeOption;
  refreshInterval: number;
};

export const useMultipleChartData = <TData>({
  dashboard,
  startDateTime,
  endDateTime,
  selectedTimeOption,
  refreshInterval,
}: UseMultipleChartDataParams): ChartQueryResult<TData>[] => {
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
        };
      })
    : [];

  return useQueries({ queries });
};
