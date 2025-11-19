import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  SecretConfigParams,
  SecretConfigResponse,
  secretConfigOkmsQueryKey,
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
