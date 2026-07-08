import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { getVdcStorageQueryKey } from '../utils';
import { GetDatacentreStorageParams } from '../types';
import { deleteVcdDatacentreStorage } from '../api';

export const useDeleteVcdDatacentreStorage = ({
  id,
  vdcId,
  storageId,
  onSuccess,
  ...options
}: GetDatacentreStorageParams &
  Partial<UseMutationOptions<unknown, ApiError, void, unknown>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteVcdDatacentreStorage({ id, vdcId, storageId }),
    onSuccess: (...params) => {
      queryClient.invalidateQueries({
        queryKey: getVdcStorageQueryKey(vdcId),
      });
      onSuccess?.(...params);
    },
    ...options,
  });
};
