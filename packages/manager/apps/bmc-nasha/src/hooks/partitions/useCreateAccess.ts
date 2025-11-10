import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';

type CreateAccessParams = {
  serviceName: string;
  partitionName: string;
  ip: string;
  type: string;
  aclDescription?: string;
};

type CreateAccessResponse = {
  taskId?: number;
  id?: number;
};

/**
 * Hook to create an access
 * Returns a task that needs to be tracked
 */
export function useCreateAccess() {
  const { t } = useTranslation(['partition']);
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation<CreateAccessResponse, Error, CreateAccessParams>({
    mutationFn: async ({ serviceName, partitionName, ip, type, aclDescription }) => {
      const { data } = await httpV6.post<CreateAccessResponse>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/access`,
        {
          ip,
          type,
          aclDescription: aclDescription || undefined,
        },
      );
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate accesses list to refresh data
      queryClient.invalidateQueries({
        queryKey: ['nasha-partition-accesses', variables.serviceName, variables.partitionName],
      });

      addNotification({
        id: `create-access-${variables.ip}`,
        color: 'success',
        message: t('partition:accesses.create.success', {
          ip: variables.ip,
        }),
      });

      return data;
    },
    onError: (error, variables) => {
      addNotification({
        id: `create-access-error-${variables.ip}`,
        color: 'critical',
        message: t('partition:accesses.create.error', {
          ip: variables.ip,
          error: error.message,
        }),
      });
    },
  });
}

