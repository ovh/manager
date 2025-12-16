import { useQuery } from '@tanstack/react-query';
import { getNashaList, getNasha, getServiceInfos, getPartitionAllocatedSize } from '@/api/nasha/nasha';
import { Nasha, NashaServiceInfo } from '@/types/nasha.type';

export const useNashaList = () => {
  return useQuery<Nasha[], Error>({
    queryKey: ['nasha', 'list'],
    queryFn: getNashaList,
  });
};

export const useNasha = (serviceName: string) => {
  return useQuery<Nasha, Error>({
    queryKey: ['nasha', 'details', serviceName],
    queryFn: () => getNasha(serviceName),
    enabled: !!serviceName,
  });
};

export const useServiceInfo = (serviceName: string) => {
  return useQuery<NashaServiceInfo, Error>({
    queryKey: ['nasha', 'serviceInfo', serviceName],
    queryFn: () => getServiceInfos(serviceName),
    enabled: !!serviceName,
  });
};

export const usePartitionAllocatedSize = (serviceName: string) => {
  return useQuery<number, Error>({
    queryKey: ['nasha', 'partitionAllocatedSize', serviceName],
    queryFn: () => getPartitionAllocatedSize(serviceName),
    enabled: !!serviceName,
  });
};
