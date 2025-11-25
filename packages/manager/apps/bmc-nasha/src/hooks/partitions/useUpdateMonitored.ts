import { useMutation, useQueryClient } from '@tanstack/react-query';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';

type UpdateMonitoredParams = {
  serviceName: string;
  monitored: boolean;
};

export function useUpdateMonitored() {
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();

  return useMutation({
    mutationFn: async ({ serviceName, monitored }: UpdateMonitoredParams) => {
      return httpV6.put(`${APP_FEATURES.listingEndpoint}/${serviceName}`, {
        monitored,
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh data
      void queryClient.invalidateQueries({
        queryKey: ['nasha-detail', variables.serviceName],
      });
      void queryClient.invalidateQueries({
        queryKey: ['nasha-partitions', variables.serviceName],
      });
      addSuccess(
        `Usage notification ${variables.monitored ? 'enabled' : 'disabled'} successfully`,
        true,
      );
    },
    onError: (error: Error) => {
      addError(error.message || 'Failed to update notification status', true);
    },
  });
}
