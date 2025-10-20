import { useQuery } from '@tanstack/react-query';

import { RequestPayload } from '../../../types/RequestPayload.type';
import { getChartDataOptions } from './getChartDataOptions';

export const useChartData = <TData>(payload: RequestPayload, refreshInterval?: number) => {
  return useQuery(getChartDataOptions<TData>(payload, refreshInterval ?? -1));
};
