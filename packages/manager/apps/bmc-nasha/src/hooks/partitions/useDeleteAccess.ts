import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';

type DeleteAccessParams = {
  serviceName: string;
  partitionName: string;
  ip: string;
};

type DeleteAccessResponse = {
  taskId?: number;
  id?: number;
};

/**
 * Hook to delete an access
 * Returns a task that needs to be tracked
 */
export function useDeleteAccess() {
  const { t } = useTranslation(['partition']);
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation<DeleteAccessResponse, Error, DeleteAccessParams>({
    mutationFn: async ({ serviceName, partitionName, ip }) => {
      const { data } = await httpV6.delete<DeleteAccessResponse>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/access/${encodeURIComponent(ip)}`,
      );
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate accesses list to refresh data
      queryClient.invalidateQueries({
        queryKey: ['nasha-partition-accesses', variables.serviceName, variables.partitionName],
      });

      addNotification({
        id: `delete-access-${variables.ip}`,
        color: 'success',
        message: t('partition:accesses.delete.success', {
          ip: variables.ip,
        }),
      });

      return data;
    },
    onError: (error, variables) => {
      addNotification({
        id: `delete-access-error-${variables.ip}`,
        color: 'critical',
        message: t('partition:accesses.delete.error', {
          ip: variables.ip,
          error: error.message,
        }),
      });
    },
  });
}

