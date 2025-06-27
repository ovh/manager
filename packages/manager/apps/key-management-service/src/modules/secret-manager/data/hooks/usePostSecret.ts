import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import {
  CreateSecretResponse,
  postSecret,
  postSecretMutationKey,
  PostSecretProps,
} from '../api/secrets';

export const usePostSecret = (
  options: Partial<
    UseMutationOptions<CreateSecretResponse, Error, PostSecretProps>
  > = {},
) => {
  const { onSuccess, ...restOptions } = options;

  return useMutation<CreateSecretResponse, ApiError, PostSecretProps>({
    mutationKey: postSecretMutationKey(),
    mutationFn: (params) => postSecret(params),
    onSuccess: (data, variables, context) => {
      onSuccess?.(data, variables, context);
    },
    ...(restOptions ?? {}),
  });
};
