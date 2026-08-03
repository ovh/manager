import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getVaultBucketAccess, getVaults } from '@/data/api/vaults/vaults.requests';

import { queryKeys } from './queryKeys';
import { tenantsQueries } from './tenants.queries';

const list = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.vaults.all(),
    queryFn: async () => getVaults(await tenantsQueries.withClient(queryClient).backupServicesId()),
  });

const bucketAccess =
  (queryClient: QueryClient) =>
  (vaultId: string, bucketId: string, { enabled = true }: { enabled?: boolean } = {}) =>
    queryOptions({
      queryKey: queryKeys.vaults.bucketAccess(vaultId, bucketId),
      queryFn: async () =>
        getVaultBucketAccess(
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
  bucketAccess: bucketAccess(queryClient),
});

export const vaultsQueries = { withClient };
