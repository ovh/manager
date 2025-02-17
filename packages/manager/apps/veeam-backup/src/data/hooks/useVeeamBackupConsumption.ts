import { useServiceDetails } from '@ovh-ux/manager-react-components';
import { useQuery } from '@tanstack/react-query';
import { getServiceConsumption } from '@/data/api/service-consumption';

export default function useVeeamBackupConsumption(resourceName: string) {
  const {
    data: service,
    isLoading: isLoadingService,
    isPending: isPendingService,
    isError: isErrorService,
  } = useServiceDetails({
    resourceName,
  });

  const { data: consumptions, isError, isLoading, isPending } = useQuery({
    queryKey: [
      'services',
      'consumption',
      { serviceId: service?.data?.serviceId },
    ],
    queryFn: ({ signal }) =>
      getServiceConsumption(service?.data?.serviceId, signal),
    retry: false,
    enabled: !!service && !!resourceName,
  });

  return {
    data: consumptions?.data,
    isError: isError || isErrorService,
    isPending: isPending || isPendingService,
    isLoading: isLoading || isLoadingService,
  };
}
