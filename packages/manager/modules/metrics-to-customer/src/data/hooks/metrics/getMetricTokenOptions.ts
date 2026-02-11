import { queryOptions } from '@tanstack/react-query';

import { getMetricToken } from '@/data/api/metrics';
import { getMetricTokenQueryKey  } from '@/data/hooks/metrics/getMetricTokenQueryKey';
import { ObservabilityServiceParams } from '@/types/ClientApi.type';
export const getMetricTokenOptions = (params: ObservabilityServiceParams) => {
  return queryOptions({
    queryKey: getMetricTokenQueryKey(),
    queryFn: (): Promise<string> => getMetricToken(params),    
  });
};

export default getMetricTokenOptions;
