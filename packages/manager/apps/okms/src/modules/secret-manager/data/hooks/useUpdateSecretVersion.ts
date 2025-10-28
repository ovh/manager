import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorResponse } from '@/types/api.type';
import {
  secretVersionsQueryKeys,
  updateSecretVersion,
  UpdateSecretVersionParams,
  UpdateSecretVersionResponse,
} from '../api/secretVersions';

export const useUpdateSecretVersion = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateSecretVersionResponse,
    ErrorResponse,
    UpdateSecretVersionParams
  >({
    mutationFn: updateSecretVersion,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: secretVersionsQueryKeys.list(
          variables.okmsId,
          variables.path,
        ),
      });
    },
  });
};
