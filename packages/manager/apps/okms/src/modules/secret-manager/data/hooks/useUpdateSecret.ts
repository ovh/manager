import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  UpdateSecretParams,
  UpdateSecretResponse,
  secretQueryKeys,
  updateSecret,
} from '../api/secrets';

export const useUpdateSecret = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateSecretResponse, ApiError, UpdateSecretParams>({
    mutationFn: (params) => updateSecret(params),
    onSuccess: async (_, params) => {
      await queryClient.invalidateQueries({
        queryKey: secretQueryKeys.detail(params.okmsId, params.path),
      });
    },
  });
};
