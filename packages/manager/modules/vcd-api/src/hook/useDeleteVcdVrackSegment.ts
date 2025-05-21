import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteVrackSegment } from '../api/vcd-vrack-network';
import { getVcdVrackNetworkQueryKey } from '../utils';

export const useDeleteVcdVrackSegment = ({
  id,
  vcdId,
  vrackSegmentId,
  onSuccess,
  ...options
}: {
  id: string;
  vcdId: string;
  vrackSegmentId: string;
} & Partial<UseMutationOptions<unknown, ApiError, void, unknown>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      deleteVrackSegment({
        id,
        vcdId,
        vrackSegmentId,
      }),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: getVcdVrackNetworkQueryKey(id, vcdId),
      });
      onSuccess?.(...params);
    },
    ...options,
  });
};
