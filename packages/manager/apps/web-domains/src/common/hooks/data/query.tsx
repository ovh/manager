import { useQuery } from '@tanstack/react-query';
import { ServiceRoutes } from '@/common/enum/common.enum';
import { getServiceInformation } from '@/common/data/api/common.api';

export const useGetServiceInformation = (
  key: string,
  serviceName: string,
  serviceRoute: ServiceRoutes,
) => {
  const { data, isLoading } = useQuery({
    queryKey: [key, 'service', serviceName],
    queryFn: () => getServiceInformation(serviceName, serviceRoute),
  });

  return {
    serviceInfo: data,
    isServiceInfoLoading: isLoading,
  };
};
