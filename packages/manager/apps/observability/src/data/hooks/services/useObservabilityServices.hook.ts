import { useQuery } from '@tanstack/react-query';

import { getObservabilityServices } from '@/data/api/observability.api';

export const getObservabilityServicesQueryKey = () => ['observabilityServices'];

export const useObservabilityServices = () => {
  return useQuery({
    queryKey: getObservabilityServicesQueryKey(),
    queryFn: ({ signal }) => getObservabilityServices(signal),
  });
};
