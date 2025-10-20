import { queryOptions } from '@tanstack/react-query';

import { fetchChartData } from '../../../__mocks__/metrics/metric.adapter';
import { RequestPayload } from '../../../types/RequestPayload.type';
import { MetricData } from '../../../types/observability.type';
import { getChartDataQueryKey } from './getChartDataQueryKey';

export const getChartDataOptions = <TData>(payload: RequestPayload, refreshInterval: number) => {
  return queryOptions({
    queryKey: getChartDataQueryKey(payload),
    queryFn: (): Promise<MetricData<TData>> => fetchChartData<TData>(payload),
    refetchInterval: refreshInterval > 0 ? refreshInterval * 1000 : false,
  });
};

export default getChartDataOptions;
