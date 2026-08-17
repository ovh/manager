import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';

import { queryKeys } from './queryKeys';
import { tenantsQueries } from './tenants.queries';

/**
 * `resourceName` est le champ de jointure vers /services (cf. §3 de la spec BKP-1226) :
 * la cascade backupServicesId → vspcTenantId → licence n'a qu'un élément par client,
 * même principe que backupServersQueries.list().
 */
const resourceName = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.backupLicense.resourceName(),
    queryFn: async () => {
      const tenants = tenantsQueries.withClient(queryClient);
      const backupServicesId = await tenants.backupServicesId();
      const vspcTenantId = await tenants.vspcTenantId();
      const licenses = await getBackupLicenses({ backupServicesId, vspcTenantId });
      const name = licenses[0]?.currentState.resourceName;
      if (!name) throw new Error('No Backup License resource found');
      return name;
    },
  });

// ─── Factory ───

const withClient = (queryClient: QueryClient) => ({
  resourceName: resourceName(queryClient),
});

export const backupLicenseQueries = { withClient };
