import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { VrackTask } from '@ovh-ux/manager-network-common';

import { postAttachIpv4ToVrack } from '@/data/api/post/vrackIp';

import { getVrackTaskListKey } from '../../tasks/useGetVrackTasks';

export const useAttachIpv4ToVrack = ({
  serviceName,
  onSuccess,
  onError,
}: {
  serviceName: string;
  onSuccess: (taksId: number, ip: string) => void;
  onError: (error: ApiError, ip: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<VrackTask>, ApiError, { ip: string; region: string }>({
    mutationFn: ({ ip, region }) => postAttachIpv4ToVrack({ serviceName, ip, region }),
    onSuccess: (response, { ip }) => {
      void queryClient.invalidateQueries({ queryKey: getVrackTaskListKey(serviceName) });
      onSuccess(response.data.id, ip);
    },
    onError: (error: ApiError, { ip }) => onError(error, ip),
  });
};
