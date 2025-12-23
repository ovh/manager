import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useServiceDetailsQueryOption } from '@ovh-ux/manager-module-common-api';

import { getServiceConsumption } from '@/data/api/services/consumption';

export const useServiceConsumption = (resourceName: string) => {
  const queryClient = useQueryClient();
  const serviceQueryOptions = useServiceDetailsQueryOption({ resourceName });

  return useQuery({
    queryKey: ['services', 'consumption', resourceName],
    queryFn: async () => {
      const res = await queryClient.fetchQuery(serviceQueryOptions);
      const serviceId = res.data.serviceId;
      return getServiceConsumption(serviceId);
    },
  });
};
