import { useQuery } from '@tanstack/react-query';

import { ObservabilityServiceParams } from '@/types/ClientApi.type';

import getMetricTokenOptions from '@/data/hooks/metrics/getMetricTokenOptions';

export const useMetricToken = (  
  params: ObservabilityServiceParams,
) => {
  return useQuery(getMetricTokenOptions(params));
};
