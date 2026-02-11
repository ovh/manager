import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { deleteVrackIpv6Subrange } from '@/data/api/delete/routedSubrange';

import { getVrackTaskListKey } from '../../tasks/useGetVrackTasks';

export const useDeleteVrackIpv6Subrange = ({
  serviceName,
  ip,
  subrange,
  onSuccess,
  onError,
}: {
  serviceName: string;
  ip: string;
  subrange: string;
  onSuccess: (taskId: number) => void;
  onError: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteVrackIpv6Subrange(serviceName, ip, subrange),
    onSuccess: ({ id }) => {
      void queryClient.invalidateQueries({ queryKey: getVrackTaskListKey(serviceName) });
      onSuccess(id);
    },
    onError,
  });
};
