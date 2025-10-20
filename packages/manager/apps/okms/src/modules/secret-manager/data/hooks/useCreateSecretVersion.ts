import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSecretVersion,
  CreateSecretVersionParams,
  CreateSecretVersionResponse,
  secretVersionsQueryKeys,
} from '../api/secretVersions';
import { secretQueryKeys } from '../api/secrets';

export const useCreateSecretVersion = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateSecretVersionResponse,
    ApiError,
    CreateSecretVersionParams
  >({
    mutationFn: createSecretVersion,
    onSuccess: (_, variables) => {
      // Invalidate secrets
      queryClient.invalidateQueries({
        queryKey: secretQueryKeys.list(variables.okmsId),
        exact: true,
      });
      // Invalidate secret details
      queryClient.invalidateQueries({
        queryKey: secretQueryKeys.detail(variables.okmsId, variables.path),
      });
      // Invalidate secret versions
      queryClient.invalidateQueries({
        queryKey: secretVersionsQueryKeys.list(
          variables.okmsId,
          variables.path,
        ),
      });
    },
  });
};
