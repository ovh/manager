import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { deleteIpReverse, getIpReverseQueryKey } from '@/data/api';

export type UseDeleteIpReverseParams = {
  ipGroup: string;
  ip: string;
  onError?: (apiError: ApiError) => void;
};

export const useDeleteIpReverse = ({
  ip,
  ipGroup,
  onError,
}: UseDeleteIpReverseParams) => {
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();

  return useMutation({
    mutationFn: () => deleteIpReverse({ ipGroup, ip }),
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
