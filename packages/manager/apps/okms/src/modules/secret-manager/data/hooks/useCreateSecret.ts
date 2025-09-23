import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import {
  CreateSecretResponse,
  createSecret,
  CreateSecretParams,
} from '../api/secrets';

export const useCreateSecret = (
  options: Partial<
    UseMutationOptions<CreateSecretResponse, ApiError, CreateSecretParams>
  > = {},
) => {
  return useMutation<CreateSecretResponse, ApiError, CreateSecretParams>({
    mutationFn: (params) => createSecret(params),
    ...(options ?? {}),
  });
};
