import { queryOptions } from '@tanstack/react-query';

import { fetchChartData } from '@/__mocks__/metrics-for-manager/metrics-for-manager.adapter';
import { getChartDataQueryKey } from '@/data/hooks/dashboards/getChartDataQueryKey';
import { RequestPayload } from '@/types/RequestPayload.type';
import { MetricData } from '@/types/observability.type';

export const getChartDataOptions = <TData>(
  payload: RequestPayload,
  refreshInterval: number,
  metricToken: string,
  enabled = true,
) => {
  return queryOptions({
    queryKey: getChartDataQueryKey(payload, metricToken),
    queryFn: (): Promise<MetricData<TData>> => fetchChartData<TData>(payload, metricToken),
    refetchInterval: refreshInterval > 0 ? refreshInterval * 1000 : false,
    enabled,
  });
};

export default getChartDataOptions;
