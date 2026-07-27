import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getBackupServers } from '@/data/api/backupServers/backupServers.requests';

import { queryKeys } from './queryKeys';
import { tenantsQueries } from './tenants.queries';

// ─── Standalone functions (all need QueryClient for dependency resolution) ───

const list = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.backupServers.all(),
    queryFn: async () => {
      const tenants = tenantsQueries.withClient(queryClient);
      const backupServicesId = await tenants.backupServicesId();
      const vspcTenantId = await tenants.vspcTenantId();
      return getBackupServers({ backupServicesId, vspcTenantId });
    },
  });

// ─── Factory ───

const withClient = (queryClient: QueryClient) => ({
  list: list(queryClient),
});

export const backupServersQueries = { withClient };
