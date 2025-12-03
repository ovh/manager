import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';

type DeleteSnapshotParams = {
  serviceName: string;
  partitionName: string;
  customSnapshotName: string;
};

type DeleteSnapshotResponse = {
  taskId?: number;
  id?: number;
};

/**
 * Hook to delete a custom snapshot
 * Returns a task that needs to be tracked
 */
export function useDeleteSnapshot() {
  const { t } = useTranslation(['partition']);
  const { addSuccess, addError } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation<DeleteSnapshotResponse, Error, DeleteSnapshotParams>({
    mutationFn: async ({ serviceName, partitionName, customSnapshotName }) => {
      const { data } = await httpV6.delete<DeleteSnapshotResponse>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/customSnapshot/${encodeURIComponent(customSnapshotName)}`,
      );
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate snapshots list to refresh data
      void queryClient.invalidateQueries({
        queryKey: [
          'nasha-partition-custom-snapshots',
          variables.serviceName,
          variables.partitionName,
        ],
      });

      addSuccess(
        t('partition:snapshots.delete.success', {
          name: variables.customSnapshotName,
        }),
        true,
      );

      return data;
    },
    onError: (error, variables) => {
      addError(
        t('partition:snapshots.delete.error', {
          name: variables.customSnapshotName,
          error: error.message,
        }),
        true,
      );
    },
  });
}
