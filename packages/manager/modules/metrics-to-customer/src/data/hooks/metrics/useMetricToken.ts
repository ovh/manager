import { useQuery } from '@tanstack/react-query';

import getMetricTokenOptions from './getMetricTokenOptions';
import { ObservabilityServiceParams } from '@/types/ClientApi.type';

export const useMetricToken = (  
  params: ObservabilityServiceParams,
) => {
  return useQuery(getMetricTokenOptions(params));
};
