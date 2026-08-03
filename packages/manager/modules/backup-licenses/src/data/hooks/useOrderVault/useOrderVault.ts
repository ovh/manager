import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { TApiCustomError } from '@ovh-ux/manager-core-api';

import { orderVault } from '@/data/api/vaults/vaults.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { VaultOrder } from '@/types/Vault.type';

export const useOrderVault = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError?: (error: TApiCustomError) => void;
}): UseMutationResult<void, TApiCustomError, VaultOrder> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: VaultOrder) => orderVault(order),
    onError,
    onSuccess: async () => {
      // Awaited, so the confirmation the caller raises lands on a list that already holds the new
      // row in its "Creating" state rather than on the one the customer saw before ordering.
      await queryClient.invalidateQueries({ queryKey: queryKeys.vaults.all() });
      onSuccess();
    },
  });
};
