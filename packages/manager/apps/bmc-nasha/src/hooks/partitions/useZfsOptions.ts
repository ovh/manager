import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';
import {
  ZFS_OPTIONS_TEMPLATES,
  type ZfsOptions,
  exportZfsOptions,
  prepareZfsOptions,
} from '@/utils/Zfs.utils';

type ZfsOptionsApiResponse = {
  atime?: 'on' | 'off';
  recordsize?: string;
  sync?: string;
};

type ZfsOptionsApiRequest = {
  atime?: 'on' | 'off';
  recordsize?: string;
  sync?: string;
  templateName?: string;
};

type UpdateZfsOptionsParams = {
  serviceName: string;
  partitionName: string;
  options: ZfsOptions;
};

// Query key factory
export const zfsOptionsKeys = {
  all: (serviceName: string, partitionName: string) =>
    ['zfs-options', serviceName, partitionName] as const,
  detail: (serviceName: string, partitionName: string) =>
    [...zfsOptionsKeys.all(serviceName, partitionName), 'detail'] as const,
};

// Hook to get ZFS options
export function useZfsOptions(serviceName: string, partitionName: string) {
  return useQuery({
    queryKey: zfsOptionsKeys.detail(serviceName, partitionName),
    queryFn: async () => {
      try {
        const { data } = await httpV6.get<ZfsOptionsApiResponse>(
          `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/options`,
        );
        return prepareZfsOptions(data);
      } catch (error: unknown) {
        // If 404, return default options
        if ((error as { status?: number })?.status === 404) {
          return prepareZfsOptions();
        }
        throw error;
      }
    },
    staleTime: 300_000, // 5 minutes
  });
}

// Hook to update ZFS options
export function useUpdateZfsOptions() {
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation(['partition']);

  return useMutation({
    mutationFn: async ({ serviceName, partitionName, options }: UpdateZfsOptionsParams) => {
      const payload = exportZfsOptions(options, ZFS_OPTIONS_TEMPLATES.CUSTOM);
      const { data } = await httpV6.post<{ taskId: string }>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/options`,
        payload,
      );
      return { taskId: data.taskId, serviceName, partitionName };
    },
    onSuccess: (data) => {
      // Invalidate queries
      void queryClient.invalidateQueries({
        queryKey: zfsOptionsKeys.all(data.serviceName, data.partitionName),
      });
      void queryClient.invalidateQueries({
        queryKey: ['nasha-partitions', data.serviceName],
      });
      void queryClient.invalidateQueries({
        queryKey: ['nasha-partition', data.serviceName, data.partitionName],
      });
    },
    onError: (error: Error) => {
      addError(
        error.message || t('partition:zfs_options.error', 'Failed to update ZFS options'),
        true,
      );
    },
  });
}
