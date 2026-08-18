import { useEffect } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { vaultsQueries } from '@/data/queries/vaults.queries';
import { selectBackupLicensesVaults } from '@/data/selectors/vaults.selectors';
import { PendingVaultRow, VaultRow } from '@/types/Vault.type';

export const useVaultsList = () => {
  const queryClient = useQueryClient();

  const { data, isPending, isError, refetch } = useQuery({
    ...vaultsQueries.withClient(queryClient).list(),
    select: selectBackupLicensesVaults,
  });
  const vaults = data ?? [];

  const { data: pendingOrders = [] } = useQuery(vaultsQueries.pending());

  // Le vault commandé a fini par apparaître dans la vraie liste : la ligne posée à la main par
  // `useOrderVault` n'a plus lieu d'être, sous peine de doublon.
  useEffect(() => {
    const settledNames = new Set(vaults.map((vault) => vault.currentState.name));
    const stillPending = pendingOrders.filter((order) => !settledNames.has(order.currentState.name));

    if (stillPending.length !== pendingOrders.length) {
      queryClient.setQueryData<PendingVaultRow[]>(vaultsQueries.pending().queryKey, stillPending);
    }
  }, [vaults, pendingOrders, queryClient]);

  const rows: VaultRow[] = [...vaults, ...pendingOrders];

  return { vaults: rows, isPending, isError, refetch };
};
