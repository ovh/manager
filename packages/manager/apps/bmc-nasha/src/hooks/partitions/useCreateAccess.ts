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
  const { addSuccess, addError } = useNotifications();
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
      void queryClient.invalidateQueries({
        queryKey: ['nasha-partition-accesses', variables.serviceName, variables.partitionName],
      });

      addSuccess(
        t('partition:accesses.create.success', {
          ip: variables.ip,
        }),
        true,
      );

      return data;
    },
    onError: (error, variables) => {
      addError(
        t('partition:accesses.create.error', {
          ip: variables.ip,
          error: error.message,
        }),
        true,
      );
    },
  });
}
