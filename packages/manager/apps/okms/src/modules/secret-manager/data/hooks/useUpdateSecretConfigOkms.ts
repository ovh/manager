import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  SecretConfigParams,
  secretConfigOkmsQueryKey,
  SecretConfigResponse,
  updateSecretConfigOkms,
} from '../api/secretConfigOkms';

export const useUpdateSecretConfigOkms = () => {
  const queryClient = useQueryClient();
  return useMutation<SecretConfigResponse, ApiError, SecretConfigParams>({
    mutationFn: (params) => updateSecretConfigOkms(params),
    onSuccess: async (_, params) => {
      await queryClient.invalidateQueries({
        queryKey: secretConfigOkmsQueryKey(params.okmsId),
      });
    },
  });
};
