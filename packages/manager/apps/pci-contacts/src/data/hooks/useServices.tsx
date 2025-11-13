import { useQuery } from '@tanstack/react-query';

import {
  getCartServiceOption,
  getProjectService,
  getServiceId,
  getServiceOptions,
} from '@/data/api/services';

const getServiceIdsQueryKey = (projectId: string) => [`/services?resourceName=${projectId}`];

export const useServiceIds = (projectId?: string) => {
  return useQuery({
    queryKey: getServiceIdsQueryKey(projectId),
    queryFn: () => getServiceId(projectId),
    enabled: !!projectId,
  });
};

const getProjectServiceQueryKey = (projectId: string) => [`/project/${projectId}/serviceInfos`];

export const useProjectService = (projectId: string) => {
  return useQuery({
    queryKey: getProjectServiceQueryKey(projectId),
    queryFn: () => getProjectService(projectId),
  });
};

const getServiceOptionsQueryKey = (serviceId: number) => [`/services/${serviceId}/options`];

export const useServiceOptions = (serviceId?: number) =>
  useQuery({
    queryKey: getServiceOptionsQueryKey(serviceId),
    queryFn: () => getServiceOptions(serviceId),
    enabled: !!serviceId,
  });

export const getCartServiceOptionQueryKey = (projectId: string) => [
  `/order/cartServiceOption/cloud/${projectId}`,
];

export const useCartServiceOption = (projectId?: string) =>
  useQuery({
    queryKey: getCartServiceOptionQueryKey(projectId),
    queryFn: () => getCartServiceOption(projectId),
    enabled: !!projectId,
  });
