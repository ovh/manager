import { useQuery } from '@tanstack/react-query';
import {
  getAllDomResource,
  getServiceInformation,
  getDomainBillingInformation,
} from '@/alldoms/data/api/web-domains';
import { DomainBillingInformation } from '@/alldoms/types';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';

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

export const useGetDomainBillingInformation = (domainName: string) => {
  return useQuery<DomainBillingInformation>({
    queryKey: ['billing', 'domain', domainName],
    queryFn: () => getDomainBillingInformation(domainName),
    enabled: !!domainName,
  });
};
