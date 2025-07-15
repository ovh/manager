import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import {
  CreateSecretResponse,
  createSecret,
  PostSecretParams,
} from '../api/secrets';

export const useCreateSecret = (
  options: Partial<
    UseMutationOptions<CreateSecretResponse, ApiError, PostSecretParams>
  > = {},
) => {
  return useMutation<CreateSecretResponse, ApiError, PostSecretParams>({
    mutationFn: (params) => createSecret(params),
    ...(options ?? {}),
  });
};
