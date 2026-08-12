import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getVaultBucketCredentials, getVaults } from '@/data/api/vaults/vaults.requests';
import { selectBackupLicensesVaults } from '@/data/selectors/vaults.selectors';

import { queryKeys } from './queryKeys';
import { tenantsQueries } from './tenants.queries';

/**
 * Le périmètre est un `select`, pas un filtre dans la `queryFn` : le cache garde la réponse de l'API
 * telle quelle, et chaque lecture reçoit la projection. Déclaré ici plutôt qu'à chaque `useQuery`,
 * un nouveau consommateur ne peut pas l'oublier.
 *
 * Attention : `select` n'est appliqué qu'à la lecture par `useQuery`. `ensureQueryData` et
 * `fetchQuery` renvoient la donnée brute du cache — un accès par ces voies doit filtrer lui-même.
 */
const list = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.vaults.all(),
    queryFn: async () => getVaults(await tenantsQueries.withClient(queryClient).backupServicesId()),
    select: selectBackupLicensesVaults,
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
