import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { deleteVault } from '@/data/api/vaults/vault.requests';
import { useGetBackupServicesId } from '@/data/hooks/backup/useBackupServicesId';

import { BACKUP_VAULTS_LIST_QUERY_KEY } from './getVault';

type UseDeleteVaultParams = Partial<UseMutationOptions<string, ApiError, string>>;

export const useDeleteVault = (options: UseDeleteVaultParams = {}) => {
  const queryClient = useQueryClient();
  const getBackupServiceId = useGetBackupServicesId();

  return useMutation({
    mutationFn: async (vaultId: string) => {
      const backupServicesId = await getBackupServiceId();
      return deleteVault(backupServicesId!, vaultId);
    },
    ...options,
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({
        queryKey: BACKUP_VAULTS_LIST_QUERY_KEY,
      });
      options.onSuccess?.(...params);
    },
  });
};
