import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getVaultBucketCredentials, getVaults } from '@/data/api/vaults/vaults.requests';

import { queryKeys } from './queryKeys';
import { tenantsQueries } from './tenants.queries';

const list = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.vaults.all(),
    queryFn: async () => getVaults(await tenantsQueries.withClient(queryClient).backupServicesId()),
  });

const bucketCredentials =
  (queryClient: QueryClient) =>
  (vaultId: string, bucketId: string, { enabled = true }: { enabled?: boolean } = {}) =>
    queryOptions({
      queryKey: queryKeys.vaults.bucketCredentials(vaultId, bucketId),
      queryFn: async () =>
        getVaultBucketCredentials(
          await tenantsQueries.withClient(queryClient).backupServicesId(),
          vaultId,
          bucketId,
        ),
      enabled: enabled && !!vaultId && !!bucketId,
      // Secrets : lus à l'ouverture de la modale, jamais resservis depuis le cache.
      staleTime: 0,
      gcTime: 0,
    });

const withClient = (queryClient: QueryClient) => ({
  list: list(queryClient),
  bucketCredentials: bucketCredentials(queryClient),
});

export const vaultsQueries = { withClient };
