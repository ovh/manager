/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNotifications } from '@ovh-ux/manager-react-components';

import { createNashaPartition, deleteNashaPartition } from '../commons/Client.api';
import { nashaQueryKeys } from './useNashaServices';

// Hook for creating NAS-HA partition
export const useCreateNashaPartition = () => {
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();

  return useMutation({
    mutationFn: ({
      serviceName,
      partitionData,
    }: {
      serviceName: string;
      partitionData: {
        partitionName: string;
        size: number;
        protocol: 'NFS' | 'CIFS';
        description?: string;
      };
    }) => createNashaPartition(serviceName, partitionData),
    onSuccess: (response, { serviceName }) => {
      if (response.status === 'success') {
        addSuccess('Partition created successfully');
        // Invalidate service details to refresh partitions list
        queryClient.invalidateQueries({ queryKey: nashaQueryKeys.service(serviceName) });
      } else {
        addError(response.message || 'Failed to create partition');
      }
    },
    onError: (error: any) => {
      addError(error.message || 'Failed to create partition');
    },
  });
};

// Hook for deleting NAS-HA partition
export const useDeleteNashaPartition = () => {
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();

  return useMutation({
    mutationFn: ({ serviceName, partitionName }: { serviceName: string; partitionName: string }) =>
      deleteNashaPartition(serviceName, partitionName),
    onSuccess: (response, { serviceName }) => {
      if (response.status === 'success') {
        addSuccess('Partition deleted successfully');
        // Invalidate service details to refresh partitions list
        queryClient.invalidateQueries({ queryKey: nashaQueryKeys.service(serviceName) });
      } else {
        addError(response.message || 'Failed to delete partition');
      }
    },
    onError: (error: any) => {
      addError(error.message || 'Failed to delete partition');
    },
  });
};
