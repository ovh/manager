import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';

type CreateSnapshotParams = {
  serviceName: string;
  partitionName: string;
  name: string;
};

type CreateSnapshotResponse = {
  taskId?: number;
  id?: number;
};

/**
 * Hook to create a custom snapshot
 * Returns a task that needs to be tracked
 */
export function useCreateSnapshot() {
  const { t } = useTranslation(['partition']);
  const { addSuccess, addError } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation<CreateSnapshotResponse, Error, CreateSnapshotParams>({
    mutationFn: async ({ serviceName, partitionName, name }) => {
      const { data } = await httpV6.post<CreateSnapshotResponse>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/customSnapshot`,
        { name },
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
        t('partition:snapshots.create.success', {
          name: variables.name,
        }),
        true,
      );

      return data;
    },
    onError: (error, variables) => {
      addError(
        t('partition:snapshots.create.error', {
          name: variables.name,
          error: error.message,
        }),
        true,
      );
    },
  });
}
