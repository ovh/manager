import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { deleteVault } from '@/data/api/vaults/vault.requests';

import { useBackupServicesId } from '../backup/useBackupServicesId';
import { BACKUP_VAULTS_LIST_QUERY_KEY } from './getVault';

type UseDeleteVaultParams = Partial<UseMutationOptions<string, ApiError, string>>;

export const useDeleteVault = (options: UseDeleteVaultParams = {}) => {
  const queryClient = useQueryClient();
  const { backupServicesId } = useBackupServicesId();

  return useMutation({
    mutationFn: (vaultId: string) => deleteVault(backupServicesId, vaultId),
    ...options,
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({
        queryKey: BACKUP_VAULTS_LIST_QUERY_KEY,
      });
      options.onSuccess?.(...params);
    },
  });
};
