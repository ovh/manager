import { useMutation, useQuery } from '@tanstack/react-query';
import {
  activateDiscoveryProject,
  getCartServiceOption,
  getProjectService,
  getServiceId,
  getServiceOptions,
  simulateActivateDiscoveryProject,
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

const getProjectServiceQueryKey = (projectId: string) => [
  `/project/${projectId}/serviceInfos`,
];

export const useProjectService = (projectId: string) => {
  return useQuery({
    queryKey: getProjectServiceQueryKey(projectId),
    queryFn: () => getProjectService(projectId),
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

/**
 * Simulates project activation to determine if a payment is required
 * @returns {UseMutationResult<ProjectActivationResponse, ApiError, number>}
 */
export const useSimulateProjectActivation = () =>
  useMutation({
    mutationFn: (serviceId: number) =>
      simulateActivateDiscoveryProject(serviceId),
  });

/**
 * Activates a discovery project
 * @returns {UseMutationResult<ProjectActivationResponse, ApiError, number>}
 */
export const useActivateProject = () =>
  useMutation({
    mutationFn: (serviceId: number) => activateDiscoveryProject(serviceId),
  });
