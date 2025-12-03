import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ErrorResponse } from '@/common/types/api.type';

import {
  UpdateSecretVersionParams,
  UpdateSecretVersionResponse,
  secretVersionsQueryKeys,
  updateSecretVersion,
} from '../api/secretVersions';

export const useUpdateSecretVersion = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateSecretVersionResponse, ErrorResponse, UpdateSecretVersionParams>({
    mutationFn: updateSecretVersion,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: secretVersionsQueryKeys.list(variables.okmsId, variables.path),
      });
    },
  });
};
