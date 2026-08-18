import { useContext } from 'react';

import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

import { TApiCustomError } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { orderVault } from '@/data/api/vaults/vaults.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { tenantsQueries } from '@/data/queries/tenants.queries';
import { vaultsQueries } from '@/data/queries/vaults.queries';
import { PendingVaultRow, VaultOrder } from '@/types/Vault.type';

export const useOrderVault = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError?: (error: TApiCustomError) => void;
}): UseMutationResult<void, TApiCustomError, VaultOrder> => {
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: VaultOrder) => {
      const serviceName = await tenantsQueries.withClient(queryClient).backupServicesId();

      return orderVault(order, { ovhSubsidiary, serviceName });
    },
    onError,
    /**
     * Le panier commandé n'a rien de créé côté API à cet instant (§3) : la seule trace du vault
     * tant qu'il n'apparaît pas dans `getVaults` est cette ligne posée à la main dans le cache.
     * `useVaultsList` la retire dès que le vault réel porte le même nom.
     */
    onSuccess: async (_data, order) => {
      const pendingRow: PendingVaultRow = {
        id: `pending-${order.name}`,
        resourceStatus: 'PENDING',
        currentState: { name: order.name, region: order.region },
      };
      queryClient.setQueryData<PendingVaultRow[]>(vaultsQueries.pending().queryKey, (previous = []) => [
        ...previous,
        pendingRow,
      ]);
      await queryClient.invalidateQueries({ queryKey: queryKeys.vaults.all(), exact: true });
      onSuccess();
    },
  });
};
