import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import {
  CreateSecretResponse,
  createSecret,
  PostSecretProps,
} from '../api/secrets';

export const useCreateSecret = (
  options: Partial<
    UseMutationOptions<CreateSecretResponse, Error, PostSecretProps>
  > = {},
) => {
  return useMutation<CreateSecretResponse, ApiError, PostSecretProps>({
    mutationFn: (params) => createSecret(params),
    ...(options ?? {}),
  });
};
