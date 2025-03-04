import { useQuery } from '@tanstack/react-query';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainId,
} from '@/data/api/web-ongoing-operations';
import { TArgument, TOngoingOperations, TTracking } from '@/types';
import { getOperationTrackingStatus } from '@/data/api/tracking';

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

export const useDomainArgument = (id: number, argumentType: string) => {
  return useQuery<TArgument>({
    queryKey: ['argument'],
    queryFn: () => getmeTaskDomainArgument(id, argumentType),
  });
};
