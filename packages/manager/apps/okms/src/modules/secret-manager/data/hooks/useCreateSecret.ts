import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { CreateSecretParams, CreateSecretResponse, createSecret } from '../api/secrets';

export const useCreateSecret = (
  options: Partial<UseMutationOptions<CreateSecretResponse, ApiError, CreateSecretParams>> = {},
) => {
  return useMutation<CreateSecretResponse, ApiError, CreateSecretParams>({
    mutationFn: (params) => createSecret(params),
    ...(options ?? {}),
  });
};
