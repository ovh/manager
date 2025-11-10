import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';

type DeletePartitionParams = {
  serviceName: string;
  partitionName: string;
};

type DeletePartitionResponse = {
  taskId?: number;
  id?: number;
};

/**
 * Hook to delete a partition
 * Returns a task that needs to be tracked
 */
export function useDeletePartition() {
  const { t } = useTranslation(['partitions']);
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation<DeletePartitionResponse, Error, DeletePartitionParams>({
    mutationFn: async ({ serviceName, partitionName }) => {
      const { data } = await httpV6.delete<DeletePartitionResponse>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}`,
      );
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate partitions list to refresh data
      queryClient.invalidateQueries({
        queryKey: ['nasha-partitions', variables.serviceName],
      });

      addNotification({
        id: `delete-partition-${variables.partitionName}`,
        color: 'success',
        message: t('partitions:delete.success', {
          partitionName: variables.partitionName,
        }),
      });

      return data;
    },
    onError: (error, variables) => {
      addNotification({
        id: `delete-partition-error-${variables.partitionName}`,
        color: 'critical',
        message: t('partitions:delete.error', {
          partitionName: variables.partitionName,
          error: error.message,
        }),
      });
    },
  });
}

