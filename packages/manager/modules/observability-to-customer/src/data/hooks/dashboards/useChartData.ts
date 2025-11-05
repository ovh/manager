import { useQuery } from '@tanstack/react-query';

import { getChartDataOptions } from '@/data/hooks/dashboards/getChartDataOptions';
import { RequestPayload } from '@/types/RequestPayload.type';

export const useChartData = <TData>(payload: RequestPayload, refreshInterval?: number) => {
  return useQuery(getChartDataOptions<TData>(payload, refreshInterval ?? -1));
};
