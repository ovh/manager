import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  CreateSecretVersionParams,
  CreateSecretVersionResponse,
  createSecretVersion,
  secretVersionsQueryKeys,
} from '../api/secretVersions';
import { secretQueryKeys } from '../api/secrets';

export const useCreateSecretVersion = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateSecretVersionResponse, ApiError, CreateSecretVersionParams>({
    mutationFn: createSecretVersion,
    onSuccess: async (_, variables) => {
      // Invalidate secrets
      await queryClient.invalidateQueries({
        queryKey: secretQueryKeys.list(variables.okmsId),
      });
      // Invalidate secret details
      await queryClient.invalidateQueries({
        queryKey: secretQueryKeys.detail(variables.okmsId, variables.path),
      });
      // Invalidate secret versions
      await queryClient.invalidateQueries({
        queryKey: secretVersionsQueryKeys.list(variables.okmsId, variables.path),
      });
    },
  });
};
