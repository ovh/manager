import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getVaultDetails, getVaults } from '@/data/api/vaults/vault.requests';

import { queryKeys } from './queryKeys';
import { servicesQueries } from './services.queries';

// ─── Standalone functions (all need QueryClient for dependency resolution) ───

const list = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.vaults.all,
    queryFn: async () => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      return getVaults(backupServicesId!);
    },
  });

const detail = (queryClient: QueryClient) => (vaultId: string) =>
  queryOptions({
    queryKey: queryKeys.vaults.detail(vaultId),
    queryFn: async () => {
      const backupServicesId = await servicesQueries.withClient(queryClient).backupServicesId();
      return getVaultDetails(backupServicesId!, vaultId);
    },
    enabled: !!vaultId,
  });

// ─── Factory ───

const withClient = (queryClient: QueryClient) => ({
  list: list(queryClient),
  detail: detail(queryClient),
});

export const vaultsQueries = { withClient };
