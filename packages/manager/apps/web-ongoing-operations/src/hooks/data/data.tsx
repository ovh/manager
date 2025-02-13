import { useQuery } from '@tanstack/react-query';
import {
  getmeTaskDnsList,
  getmeTaskDomainId,
  getmeTaskDomainList,
} from '@/data/api/web-ongoing-operations';
import { TOngoingOperations, TTracking } from '@/types';
import { getOperationTrackingStatus } from '@/data/api/tracking';

export const useDomainList = () => {
  return useQuery<TOngoingOperations[]>({
    queryKey: ['domainList'],
    queryFn: () => getmeTaskDomainList(),
  });
};

export const useDnsList = () => {
  return useQuery<TOngoingOperations[]>({
    queryKey: ['dnsList'],
    queryFn: () => getmeTaskDnsList(),
  });
};

export const useTracking = (id: number) => {
  return useQuery<TTracking>({
    queryKey: ['tracking'],
    queryFn: () => getOperationTrackingStatus(id),
  });
};

export const useDomain = (id: number) => {
  return useQuery<TOngoingOperations>({
    queryKey: ['domain'],
    queryFn: () => getmeTaskDomainId(id),
  });
};
