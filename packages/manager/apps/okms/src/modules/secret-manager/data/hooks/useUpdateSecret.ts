import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UpdateSecretResponse,
  updateSecret,
  UpdateSecretParams,
  secretQueryKeys,
} from '../api/secrets';

export const useUpdateSecret = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateSecretResponse, ApiError, UpdateSecretParams>({
    mutationFn: (params) => updateSecret(params),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: secretQueryKeys.detail(params.okmsId, params.path),
      });
    },
  });
};
