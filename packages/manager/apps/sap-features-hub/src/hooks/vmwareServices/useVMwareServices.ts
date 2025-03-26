import { useQuery } from '@tanstack/react-query';
import {
  getVMwareServices,
  getVMwareStoragePolicy,
} from '@/data/api/vmwareServices';

export const useVMwareServices = () =>
  useQuery({
    queryKey: ['vmwareServices'],
    queryFn: getVMwareServices,
    select: (res) => res.data,
  });

export const useVMwareStoragePolicy = (serviceName: string) =>
  useQuery({
    queryKey: ['vmwareServices', serviceName, 'storagePolicy'],
    queryFn: () => getVMwareStoragePolicy(serviceName),
    select: (res) => res.data,
  });
