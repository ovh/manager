import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SecretVersion } from '@secret-manager/types/secret.type';
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
      // Update secret version list
      queryClient.setQueryData<SecretVersion[]>(
        secretVersionsQueryKeys.list(variables.okmsId, variables.path),
        (oldVersions) => {
          return oldVersions.map((version) => {
            if (version.id === variables.version) {
              return {
                ...version,
                state: variables.state,
              };
            }
            return version;
          });
        },
      );
    },
  });
};
