import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { updateVrackSegment } from '../api/vcd-vrack-segment';
import { VCDVrackSegmentSpec } from '../types';
import { getVrackSegmentListQueryKey, getVrackSegmentQueryKey } from '../utils';

export const useUpdateVcdVrackSegment = ({
  id,
  vdcId,
  vrackSegmentId,
  onSuccess,
  ...options
}: {
  id: string;
  vdcId: string;
  vrackSegmentId: string;
} & Partial<
  UseMutationOptions<unknown, ApiError, VCDVrackSegmentSpec, unknown>
>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VCDVrackSegmentSpec) =>
      updateVrackSegment({ id, vdcId, vrackSegmentId, payload }),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: getVrackSegmentListQueryKey(id, vdcId),
      });
      queryClient.invalidateQueries({
        queryKey: getVrackSegmentQueryKey({ id, vdcId, vrackSegmentId }),
      });
      onSuccess?.(...params);
    },
    ...options,
  });
};
