import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { getIpDetailsQueryKey, upsertIpDescription } from '@/data/api';
import { ipFormatter } from '@/utils';

export type UseUpsertIpDescriptionParams = {
  ip: string;
  description: string;
  onError?: (apiError: ApiError) => void;
  onSuccess?: (result: ApiResponse<void>) => void;
};

export const useUpsertIpDescription = ({
  ip,
  description,
  onError,
  onSuccess,
}: UseUpsertIpDescriptionParams) => {
  const { ipGroup } = ipFormatter(ip);
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();

  return useMutation({
    mutationFn: () => upsertIpDescription({ ip: ipGroup, description }),
    onSuccess: async (data) => {
      clearNotifications();
      await queryClient.invalidateQueries({
        queryKey: getIpDetailsQueryKey({ ip: ipGroup }),
      });
      onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      clearNotifications();
      onError?.(error);
    },
  });
};
