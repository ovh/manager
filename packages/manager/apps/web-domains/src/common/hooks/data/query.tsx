import { useQuery } from '@tanstack/react-query';
import { ServiceRoutes } from '@/common/enum/common.enum';
import {
  getServiceInformation,
  getServiceInformationOnlyByRoutes,
} from '@/common/data/api/common.api';

export const useGetServiceInformation = (
  key: string,
  serviceName: string,
  serviceRoute: ServiceRoutes,
) => {
  const { data, isFetching } = useQuery({
    queryKey: [key, 'service', serviceName],
    queryFn: () => getServiceInformation(serviceName, serviceRoute),
  });

  return {
    serviceInfo: data,
    isServiceInfoLoading: isFetching,
  };
};

export const useGetServiceInformationByRoutes = (
  serviceRoutes: ServiceRoutes,
) => {
  const { data, isFetching } = useQuery({
    queryKey: ['service', serviceRoutes],
    queryFn: () => getServiceInformationOnlyByRoutes(serviceRoutes),
  });

  return {
    serviceInfo: data,
    isServiceInfoLoading: isFetching,
  };
};
