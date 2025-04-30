import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllDomainAttachedToAllDom,
  getallDomList,
  getAllDomProperty,
  getallDomService,
  getDomainDetail,
  getDomainDetailInformation,
  updateAllDomService,
  updateDomainServiceInfo,
} from '@/alldoms/data/api/web-domains';
import {
  TAllDomDomains,
  TDomainDetail,
  UpdateAllDomServiceProps,
} from '@/alldoms/types';

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

export const useUpdateAllDomService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceName, renew }: UpdateAllDomServiceProps) =>
      updateAllDomService(serviceName, renew),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alldom'] });
    },
  });
};

export const useUpdateDomainServiceInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (domainName: string) => updateDomainServiceInfo(domainName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alldom'] });
    },
  });
};

export const useGetDomainDetail = (domainName: string) => {
  return useQuery<TDomainDetail>({
    queryKey: ['domain', 'name', domainName],
    queryFn: () => getDomainDetail(domainName),
  });
};

export const useGetDomainDetailInfo = ({ serviceName }) => {
  return useQuery<TAllDomDomains>({
    queryKey: ['domain', 'information', serviceName],
    queryFn: () => getDomainDetailInformation(serviceName),
  });
};
