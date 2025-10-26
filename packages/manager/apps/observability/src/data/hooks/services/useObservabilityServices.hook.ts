import { useQuery } from '@tanstack/react-query';

import { getObservabilityServices } from '@/data/api/observability.api';
import { ObservabilityService } from '@/types/observability.type';

export const getObservabilityServicesQueryKey = () => ['observabilityServices'];

export const useObservabilityServices = () => {
  return useQuery<ObservabilityService[]>({
    queryKey: getObservabilityServicesQueryKey(),
    queryFn: ({ signal }) => getObservabilityServices(signal),
  });
};
