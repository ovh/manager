import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { getIpReverseQueryKey, updateIpReverse } from '@/data/api';

export type UseUpdateIpReverseParams = {
  ipGroup: string;
  ip: string;
  onError?: (apiError: ApiError) => void;
};

export const useUpdateIpReverse = ({
  ip,
  ipGroup,
  onError,
}: UseUpdateIpReverseParams) => {
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();

  return useMutation({
    mutationFn: ({ reverse }: { reverse: string }) =>
      updateIpReverse({ ipGroup, ip, reverse }),
    onSuccess: async () => {
      clearNotifications();
      await queryClient.invalidateQueries({
        queryKey: getIpReverseQueryKey({ ip: ipGroup }),
      });
    },
    onError: (error: ApiError) => {
      clearNotifications();
      onError?.(error);
      return error;
    },
  });
};
