import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { deleteVault } from '@/data/api/vaults/vault.requests';

import { BACKUP_VAULTS_LIST_QUERY_KEY } from './getVault';

type UseDeleteVaultParams = Partial<UseMutationOptions<ApiResponse<string>, ApiError, string>>;

export const useDeleteVault = (options: UseDeleteVaultParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vaultId: string) => deleteVault(vaultId),
    ...options,
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: BACKUP_VAULTS_LIST_QUERY_KEY,
      });
      options.onSuccess?.(data, variables, context);
    },
  });
};
