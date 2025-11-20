import { useMutation, useQuery } from '@tanstack/react-query';

import {
  activateDiscoveryProject,
  getCartServiceOption,
  getProjectService,
  getServiceId,
  getServiceOptions,
  simulateActivateDiscoveryProject,
} from '@/data/api/services';

const getProjectServiceQueryKey = (projectId: string) => ['/project', projectId, 'serviceInfos'];

export const useServiceIds = (projectId?: string) => {
  return useQuery({
    queryKey: ['/services', projectId],
    queryFn: () => getServiceId(projectId as string),
    enabled: !!projectId,
  });
};

export const useProjectService = (projectId: string) => {
  return useQuery({
    queryKey: getProjectServiceQueryKey(projectId),
    queryFn: () => getProjectService(projectId),
  });
};

export const useServiceOptions = (serviceId?: number) =>
  useQuery({
    queryKey: ['/services', serviceId, 'options'],
    queryFn: () => getServiceOptions(serviceId as number),
    enabled: !!serviceId,
  });

export const useCartServiceOption = (projectId?: string) =>
  useQuery({
    queryKey: ['/order/cartServiceOption/cloud', projectId],
    queryFn: () => getCartServiceOption(projectId as string),
    enabled: !!projectId,
  });

/**
 * Simulates project activation to determine if a payment is required
 * @returns {UseMutationResult<ProjectActivationResponse, ApiError, number>}
 */
export const useSimulateProjectActivation = () =>
  useMutation({
    mutationFn: (serviceId: number) => simulateActivateDiscoveryProject(serviceId),
  });

/**
 * Activates a discovery project
 * @returns {UseMutationResult<ProjectActivationResponse, ApiError, number>}
 */
export const useActivateProject = () =>
  useMutation({
    mutationFn: (serviceId: number) => activateDiscoveryProject(serviceId),
  });
