import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { deleteVault } from '@/data/api/vaults/vault.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { servicesQueries } from '@/data/queries/services.queries';

export const useDeleteVault = ({
  onSuccess,
  ...options
}: Omit<UseMutationOptions<string, ApiError, string>, 'mutationFn'> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vaultId: string) => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      return deleteVault(backupServicesId!, vaultId);
    },
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.vaults.all });
      onSuccess?.(...params);
    },
    ...options,
  });
};
