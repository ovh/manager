import { useQuery } from '@tanstack/react-query';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainId,
  getmeTaskDomainArgumentNames,
  getDomainServiceInfo,
} from '@/data/api/web-ongoing-operations';
import {
  TArgument,
  TOngoingOperations,
  TServiceInfo,
  TTracking,
} from '@/types';
import { getOperationTrackingStatus } from '@/data/api/tracking';

export const useTracking = (id: number) => {
  return useQuery<TTracking>({
    queryKey: ['tracking', id],
    queryFn: () => getOperationTrackingStatus(id),
  });
};

export const useDomain = (id: number) => {
  return useQuery<TOngoingOperations>({
    queryKey: ['domain', id],
    queryFn: () => getmeTaskDomainId(id),
  });
};

export const useDomainArgument = (id: number, argumentType: string) => {
  return useQuery<TArgument>({
    queryKey: ['argument', id, argumentType],
    queryFn: () => getmeTaskDomainArgument(id, argumentType),
  });
};

export const useNicList = (id: number) => {
  return useQuery<string[]>({
    queryKey: [id],
    queryFn: () => getmeTaskDomainArgumentNames(id),
  });
};

export const useGetDomainInformation = (serviceName: string) => {
  return useQuery<TServiceInfo>({
    queryKey: [serviceName],
    queryFn: () => getDomainServiceInfo(serviceName),
    retry: 0,
  });
};
