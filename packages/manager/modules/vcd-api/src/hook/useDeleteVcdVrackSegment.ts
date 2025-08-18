import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteVrackSegment } from '../api/vcd-vrack-segment';
import { getVrackSegmentListQueryKey } from '../utils';

export const useDeleteVcdVrackSegment = ({
  id,
  vdcId,
  vrackSegmentId,
  onSuccess,
  ...options
}: {
  id: string;
  vdcId: string;
  vrackSegmentId: string;
} & Partial<UseMutationOptions<unknown, ApiError, void, unknown>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteVrackSegment({ id, vdcId, vrackSegmentId }),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: getVrackSegmentListQueryKey(id, vdcId),
      });
      onSuccess?.(...params);
    },
    ...options,
  });
};
