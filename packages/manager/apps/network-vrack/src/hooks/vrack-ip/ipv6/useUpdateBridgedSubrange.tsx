import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { BridgedSubrangeUpdate, putBridgedSubrange } from '@/data/api/put/bridgedSubrange';

import { getVrackTaskListKey } from '../../tasks/useGetVrackTasks';

export const useUpdateBridgedSubrange = ({
  serviceName,
  ipv6,
  bridgedSubrange,
  onSuccess,
  onError,
}: {
  serviceName: string;
  ipv6: string;
  bridgedSubrange: string;
  onSuccess: (taskId: number) => void;
  onError: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bridgedSubrangeDetail: BridgedSubrangeUpdate) =>
      putBridgedSubrange(serviceName, ipv6, bridgedSubrange, bridgedSubrangeDetail),
    onSuccess: async ({ id }) => {
      await queryClient.invalidateQueries({
        queryKey: getVrackTaskListKey(serviceName),
      });
      onSuccess(id);
    },
    onError,
  });
};
