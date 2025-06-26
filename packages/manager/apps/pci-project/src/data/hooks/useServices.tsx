import { useQuery } from '@tanstack/react-query';
import {
  getCartServiceOption,
  getServiceId,
  getServiceOptions,
} from '@/data/api/services';

const getServiceIdsQueryKey = (projectId: string) => [
  `/services?resourceName=${projectId}`,
];

export const useServiceIds = (projectId?: string) => {
  return useQuery({
    queryKey: getServiceIdsQueryKey(projectId as string),
    queryFn: () => getServiceId(projectId as string),
    enabled: !!projectId,
  });
};

const getServiceOptionsQueryKey = (serviceId: number) => [
  `/services/${serviceId}/options`,
];

export const useServiceOptions = (serviceId?: number) =>
  useQuery({
    queryKey: getServiceOptionsQueryKey(serviceId as number),
    queryFn: () => getServiceOptions(serviceId as number),
    enabled: !!serviceId,
  });

export const getCartServiceOptionQueryKey = (projectId: string) => [
  `/order/cartServiceOption/cloud/${projectId}`,
];

export const useCartServiceOption = (projectId?: string) =>
  useQuery({
    queryKey: getCartServiceOptionQueryKey(projectId as string),
    queryFn: () => getCartServiceOption(projectId as string),
    enabled: !!projectId,
  });
