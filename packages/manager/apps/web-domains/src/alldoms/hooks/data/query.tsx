import { useQuery } from '@tanstack/react-query';

import { getAllDomResource, getServiceInformation } from '@/alldoms/data/api/web-domains';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';

export const useGetServiceInformation = (serviceName: string, serviceRoute: ServiceRoutes) => {
  return useQuery({
    queryKey: ['allDom', 'services', serviceName, serviceRoute],
    queryFn: () => getServiceInformation(serviceName, serviceRoute),
  });
};

export const useGetAllDomResource = (serviceName: string) => {
  return useQuery({
    queryKey: ['allDom', 'domains', 'services', serviceName],
    queryFn: () => getAllDomResource(serviceName),
  });
};
