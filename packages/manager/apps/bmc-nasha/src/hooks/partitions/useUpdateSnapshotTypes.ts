import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';

type SnapshotType = {
  enabled: boolean;
  label: string;
  value: string;
};

type UpdateSnapshotTypesParams = {
  serviceName: string;
  partitionName: string;
  currentTypes: SnapshotType[];
  newTypes: SnapshotType[];
};

type TaskResult = {
  taskIds: string[];
  serviceName: string;
  partitionName: string;
};

// Compare types to determine which actions are needed
function computeActions(
  currentTypes: SnapshotType[],
  newTypes: SnapshotType[],
): { toEnable: string[]; toDisable: string[] } {
  const toEnable: string[] = [];
  const toDisable: string[] = [];

  newTypes.forEach((newType) => {
    const currentType = currentTypes.find((ct) => ct.value === newType.value);
    if (currentType && !currentType.enabled && newType.enabled) {
      toEnable.push(newType.value);
    }
    if (currentType && currentType.enabled && !newType.enabled) {
      toDisable.push(newType.value);
    }
  });

  return { toEnable, toDisable };
}

// Query key factory
export const snapshotTypesKeys = {
  all: (serviceName: string, partitionName: string) =>
    ['snapshot-types', serviceName, partitionName] as const,
};

// Hook to update snapshot types
export function useUpdateSnapshotTypes() {
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation(['partition']);

  return useMutation({
    mutationFn: async ({
      serviceName,
      partitionName,
      currentTypes,
      newTypes,
    }: UpdateSnapshotTypesParams): Promise<TaskResult> => {
      const { toEnable, toDisable } = computeActions(currentTypes, newTypes);
      const taskIds: string[] = [];
      const baseUrl = `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/snapshot`;

      // Enable types (POST requests)
      const enablePromises = toEnable.map((type) =>
        httpV6
          .post<{ taskId: string }>(`${baseUrl}`, { snapshotType: type })
          .then(({ data }) => taskIds.push(data.taskId)),
      );

      // Disable types (DELETE requests)
      const disablePromises = toDisable.map((type) =>
        httpV6
          .delete<{ taskId: string }>(`${baseUrl}/${type}`)
          .then(({ data }) => taskIds.push(data.taskId)),
      );

      // Execute all requests in parallel
      await Promise.all([...enablePromises, ...disablePromises]);

      return { taskIds, serviceName, partitionName };
    },
    onSuccess: (data) => {
      // Invalidate queries
      void queryClient.invalidateQueries({
        queryKey: snapshotTypesKeys.all(data.serviceName, data.partitionName),
      });
      void queryClient.invalidateQueries({
        queryKey: ['nasha-partition-snapshots', data.serviceName, data.partitionName],
      });

      addSuccess(
        t('partition:snapshots.types_updated_success', 'Snapshot types updated successfully'),
        true,
      );
    },
    onError: (error: Error) => {
      addError(
        error.message ||
          t('partition:snapshots.types_updated_error', 'Failed to update snapshot types'),
        true,
      );
    },
  });
}
