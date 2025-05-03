import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { updateNetworkVrackSegment } from '../api/vcd-vrack-network';
import { VrackSegmentNetworkSpec } from '../types';
import {
  getVcdVrackNetworkQueryKey,
  updateVdcNetworkVrackSegmentMutationKey,
} from '../utils';

export const useUpdateVcdVrackNetworkVrackSegment = ({
  id,
  vcdId,
  vrackSegmentId,
  onSuccess,
  ...options
}: {
  id: string;
  vcdId: string;
  vrackSegmentId: string;
} & Partial<
  UseMutationOptions<unknown, ApiError, VrackSegmentNetworkSpec, unknown>
>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: updateVdcNetworkVrackSegmentMutationKey({
      id,
      vcdId,
      vrackSegmentId,
    }),
    mutationFn: (payload: VrackSegmentNetworkSpec) =>
      updateNetworkVrackSegment({
        id,
        vcdId,
        vrackSegmentId,
        payload,
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
