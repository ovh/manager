import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServiceDetailsQueryOption } from '@ovh-ux/manager-module-common-api';
import { getServiceConsumption } from '@/data/api/service-consumption';

export function useVeeamBackupConsumptionQueryOptions(resourceName: string) {
  const queryClient = useQueryClient();
  const serviceDetailsQueryOption = useServiceDetailsQueryOption({
    resourceName,
  });

  return queryOptions({
    queryKey: ['services', 'consumption', resourceName],
    queryFn: async ({ signal }) => {
      const service = await queryClient.fetchQuery(serviceDetailsQueryOption);

      return getServiceConsumption(service?.data?.serviceId, signal);
    },
    retry: false,
    enabled: !!resourceName,
  });
}

export default function useVeeamBackupConsumption(resourceName: string) {
  const options = useVeeamBackupConsumptionQueryOptions(resourceName);

  const { data: consumptions, isError, isLoading, isPending } = useQuery(
    options,
  );

  return {
    data: consumptions?.data,
    isError,
    isPending,
    isLoading,
  };
}
