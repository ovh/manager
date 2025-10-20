/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useNotifications } from '@ovh-ux/manager-react-components';

import type { NashaOrder } from '@/types/Nasha.type';

import {
  createNashaService,
  deleteNashaService,
  getNashaDatacenters,
  getNashaServiceDetails,
  getNashaServices,
  updateNashaServiceName,
} from '../commons/Client.api';

// Query keys for React Query
export const nashaQueryKeys = {
  all: ['nasha'] as const,
  services: () => [...nashaQueryKeys.all, 'services'] as const,
  service: (serviceName: string) => [...nashaQueryKeys.all, 'service', serviceName] as const,
  datacenters: () => [...nashaQueryKeys.all, 'datacenters'] as const,
} as const;

// Hook for fetching NAS-HA services list
export const useNashaServices = (params?: {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDesc?: boolean;
}) => {
  return useQuery({
    queryKey: [...nashaQueryKeys.services(), params],
    queryFn: () => getNashaServices(params),
    select: (response) => ({
      data: response.data || [],
      totalCount: response.totalCount || 0,
      status: response.status,
      error: response.message,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching single service details
export const useNashaServiceDetails = (serviceName: string) => {
  return useQuery({
    queryKey: nashaQueryKeys.service(serviceName),
    queryFn: () => getNashaServiceDetails(serviceName),
    select: (response) => ({
      service: response.data,
      status: response.status,
      error: response.message,
    }),
    enabled: !!serviceName,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for fetching available datacenters
export const useNashaDatacenters = () => {
  return useQuery({
    queryKey: nashaQueryKeys.datacenters(),
    queryFn: getNashaDatacenters,
    select: (response) => ({
      datacenters: response.data || [],
      status: response.status,
      error: response.message,
    }),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook for creating new NAS-HA service
export const useCreateNashaService = () => {
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();

  return useMutation({
    mutationFn: (orderData: NashaOrder) => createNashaService(orderData),
    onSuccess: (response) => {
      if (response.status === 'success') {
        addSuccess('NAS-HA service created successfully');
        // Invalidate services list to refresh
        queryClient.invalidateQueries({ queryKey: nashaQueryKeys.services() });
      } else {
        addError(response.message || 'Failed to create NAS-HA service');
      }
    },
    onError: (err) => {
      addError(`Error creating NAS-HA service: ${err.message}`);
    },
  });
};

// Hook for deleting NAS-HA service
export const useDeleteNashaService = () => {
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();

  return useMutation({
    mutationFn: (serviceName: string) => deleteNashaService(serviceName),
    onSuccess: (response, serviceName) => {
      if (response.status === 'success') {
        addSuccess('NAS-HA service deleted successfully');
        // Remove from cache and invalidate lists
        queryClient.removeQueries({ queryKey: nashaQueryKeys.service(serviceName) });
        queryClient.invalidateQueries({ queryKey: nashaQueryKeys.services() });
      } else {
        addError(response.message || 'Failed to delete NAS-HA service');
      }
    },
    onError: (err, serviceName) => {
      addError(`Error deleting NAS-HA service ${serviceName}: ${err.message}`);
    },
  });
};

// Hook for updating service name
export const useUpdateNashaServiceName = () => {
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();

  return useMutation({
    mutationFn: ({ serviceName, customName }: { serviceName: string; customName: string }) =>
      updateNashaServiceName(serviceName, customName),
    onSuccess: (response, { serviceName }) => {
      if (response.status === 'success') {
        addSuccess('Service name updated successfully');
        // Invalidate service details and services list
        queryClient.invalidateQueries({ queryKey: nashaQueryKeys.service(serviceName) });
        queryClient.invalidateQueries({ queryKey: nashaQueryKeys.services() });
      } else {
        addError(response.message || 'Failed to update service name');
      }
    },
    onError: (error: any) => {
      addError(error.message || 'Failed to update service name');
    },
  });
};
