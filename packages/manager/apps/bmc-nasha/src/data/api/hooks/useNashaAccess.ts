/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNotifications } from '@ovh-ux/manager-react-components';

import {
  createNashaAccess,
  deleteNashaAccess,
  getNashaPartitionAccess,
} from '../commons/Client.api';
import { nashaQueryKeys } from './useNashaServices';

// Hook for creating NAS-HA access
export const useCreateNashaAccess = () => {
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();

  return useMutation({
    mutationFn: ({
      serviceName,
      partitionName,
      accessData,
    }: {
      serviceName: string;
      partitionName: string;
      accessData: {
        ip: string;
        type: 'readwrite' | 'readonly';
        description?: string;
      };
    }) => createNashaAccess(serviceName, partitionName, accessData),
    onSuccess: (response, { serviceName }) => {
      if (response.status === 'success') {
        addSuccess('Access created successfully');
        // Invalidate service details to refresh access list
        queryClient.invalidateQueries({ queryKey: nashaQueryKeys.service(serviceName) });
      } else {
        addError(response.message || 'Failed to create access');
      }
    },
    onError: (error: any) => {
      addError(error.message || 'Failed to create access');
    },
  });
};

// Hook for deleting NAS-HA access
export const useDeleteNashaAccess = () => {
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();

  return useMutation({
    mutationFn: ({
      serviceName,
      partitionName,
      ip,
    }: {
      serviceName: string;
      partitionName: string;
      ip: string;
    }) => deleteNashaAccess(serviceName, partitionName, ip),
    onSuccess: (response, { serviceName }) => {
      if (response.status === 'success') {
        addSuccess('Access deleted successfully');
        // Invalidate service details to refresh access list
        queryClient.invalidateQueries({ queryKey: nashaQueryKeys.service(serviceName) });
      } else {
        addError(response.message || 'Failed to delete access');
      }
    },
    onError: (error: any) => {
      addError(error.message || 'Failed to delete access');
    },
  });
};
