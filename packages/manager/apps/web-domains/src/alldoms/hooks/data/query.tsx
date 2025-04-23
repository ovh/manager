import { useQuery } from '@tanstack/react-query';
import {
  getAllDomResource,
  getAllDomService,
  getDomainBillingInformation,
} from '@/alldoms/data/api/web-domains';
import { DomainBillingInformation } from '@/alldoms/types';

export const useGetAllDomService = (serviceName: string) => {
  return useQuery({
    queryKey: ['allDom', 'services', serviceName],
    queryFn: () => getAllDomService(serviceName),
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
