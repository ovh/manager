import { useQuery } from '@tanstack/react-query';
import {
  getAllDomResource,
} from '@/alldoms/data/api/web-domains';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';
import { getServiceInformation } from '@/common/data/api/common.api';

export const useGetServiceInformation = (
  serviceName: string,
  serviceRoute: ServiceRoutes,
) => {
  return useQuery({
    queryKey: ['allDom', 'services', serviceName],
    queryFn: () => getServiceInformation(serviceName, serviceRoute),
  });
};

export const useGetAllDomResource = (serviceName: string) => {
  return useQuery({
    queryKey: ['allDom', 'domains', 'services', serviceName],
    queryFn: () => getAllDomResource(serviceName),
  });
};
