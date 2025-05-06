import { useQuery } from '@tanstack/react-query';
import {
  getAllDomainAttachedToAllDom,
  getallDomList,
  getAllDomProperty,
  getallDomService,
} from '@/alldoms/data/api/web-domains';

export const useGetAllDomServiceList = () => {
  return useQuery<string[]>({
    queryKey: ['allDom', 'services'],
    queryFn: () => getallDomList(),
  });
};

export const useGetAllDomProperty = (serviceName: string) => {
  return useQuery({
    queryKey: ['alldom', serviceName, 'property'],
    queryFn: () => getAllDomProperty(serviceName),
  });
};

export const useGetAllDomService = (serviceName: string) => {
  return useQuery({
    queryKey: ['allDom', 'services', serviceName],
    queryFn: () => getallDomService(serviceName),
  });
};

export const useGetAllDomainAttachedToAllDom = (serviceName: string) => {
  return useQuery<string[]>({
    queryKey: ['allDom', 'services', serviceName, 'attachedDomains'],
    queryFn: () => getAllDomainAttachedToAllDom(serviceName),
  });
};
