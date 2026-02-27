import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { deleteVrackIpv4 } from '@/data/api/delete/vrackIp';

import { getVrackTaskListKey } from '../../tasks/useGetVrackTasks';

export const useDeleteVrackIpv4 = ({
  serviceName,
  ip,
  onSuccess,
  onError,
}: {
  serviceName: string;
  ip: string;
  onSuccess: (taksId: number) => void;
  onError: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteVrackIpv4(serviceName, ip),
    onSuccess: (vrackTask) => {
      void queryClient.invalidateQueries({ queryKey: getVrackTaskListKey(serviceName) });
      onSuccess(vrackTask.id);
    },
    onError,
  });
};
