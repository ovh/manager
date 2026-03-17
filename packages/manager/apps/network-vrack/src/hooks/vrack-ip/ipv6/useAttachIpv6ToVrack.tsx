import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { VrackTask } from '@ovh-ux/manager-network-common';

import { postAttachIpv6ToVrack } from '@/data/api/post/vrackIp';

import { getVrackTaskListKey } from '../../tasks/useGetVrackTasks';

export const useAttachIpv6ToVrack = ({
  serviceName,
  onSuccess,
  onError,
}: {
  serviceName: string;
  onSuccess: (taksId: number, ip: string) => void;
  onError: (error: ApiError, ip: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<VrackTask>, ApiError, string>({
    mutationFn: (ip: string) => postAttachIpv6ToVrack({ serviceName, ip }),
    onSuccess: (response, ip: string) => {
      void queryClient.invalidateQueries({ queryKey: getVrackTaskListKey(serviceName) });
      onSuccess(response.data.id, ip);
    },
    onError,
  });
};
