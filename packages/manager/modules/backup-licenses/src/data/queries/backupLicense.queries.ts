import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';

import { queryKeys } from './queryKeys';
import { tenantsQueries } from './tenants.queries';

/**
 * La cascade backupServicesId → vspcTenantId → licence n'a qu'un élément par client,
 * même principe que backupServersQueries.list() (cf. §3 de la spec BKP-1226).
 */
const list = (queryClient: QueryClient) =>
  queryOptions({
    queryKey: queryKeys.backupLicense.all(),
    queryFn: async () => {
      const tenants = tenantsQueries.withClient(queryClient);
      const backupServicesId = await tenants.backupServicesId();
      const vspcTenantId = await tenants.vspcTenantId();
      return getBackupLicenses({ backupServicesId, vspcTenantId });
    },
  });

// ─── Factory ───

const withClient = (queryClient: QueryClient) => {
  const license = async () => {
    const licenses = await queryClient.ensureQueryData(list(queryClient));
    const found = licenses[0];
    if (!found) throw new Error('No Backup License resource found');
    return found;
  };

  return {
    /**
     * `id` sert de champ de jointure vers /services : la réponse réelle n'a pas de
     * `currentState.resourceName` distinct (cf. mémoire backup-licenses-resourcename-contract-bug).
     */
    resourceName: () =>
      queryOptions({
        queryKey: queryKeys.backupLicense.resourceName(),
        queryFn: async () => (await license()).id,
      }),
    /** `backupLicensesId` : scope requis par les routes `backupServer` (cf. BKP-1216). */
    id: async () => (await license()).id,
  };
};

export const backupLicenseQueries = { withClient };
