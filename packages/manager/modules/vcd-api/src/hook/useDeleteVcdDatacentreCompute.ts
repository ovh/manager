import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { getVdcComputeQueryKey } from '../utils';
import { GetDatacentreComputeParams } from '../types';
import { deleteVcdDatacentreCompute } from '../api';

export const useDeleteVcdDatacentreCompute = ({
  id,
  vdcId,
  computeId,
  onSuccess,
  ...options
}: GetDatacentreComputeParams &
  Partial<UseMutationOptions<unknown, ApiError, void, unknown>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteVcdDatacentreCompute({ id, vdcId, computeId }),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: getVdcComputeQueryKey(vdcId),
      });
      onSuccess?.(...params);
    },
    ...options,
  });
};
