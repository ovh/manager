import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';

import { queryKeys } from './queryKeys';

/**
 * Cascade de résolution des identifiants (cf. §4 et §6 de la spec BKP-1216) :
 * `backupServicesId` puis `vspcTenantId` ne sont pas dans l'URL, ils sont résolus
 * par API et mis en cache. Le client n'ayant en pratique qu'un service Backup
 * Licenses, on prend le premier élément de chaque liste.
 */

// ─── Base queries (no QueryClient needed) ───

const backupServicesTenants = () =>
  queryOptions({
    queryKey: queryKeys.backupServices.tenants(),
    queryFn: getBackupServicesTenants,
  });

const vspcTenants = (backupServicesId: string) =>
  queryOptions({
    queryKey: queryKeys.vspc.tenants(backupServicesId),
    queryFn: () => getVspcTenants(backupServicesId),
  });

// ─── Queries needing QueryClient ───

const withClient = (queryClient: QueryClient) => {
  const backupServicesId = async (): Promise<string> => {
    const tenants = await queryClient.ensureQueryData(backupServicesTenants());
    const id = tenants[0]?.id;
    if (!id) throw new Error('No Backup Licenses service found');
    return id;
  };

  const vspcTenantId = async (): Promise<string> => {
    const tenants = await queryClient.ensureQueryData(vspcTenants(await backupServicesId()));
    const id = tenants[0]?.id;
    if (!id) throw new Error('No VSPC tenant found');
    return id;
  };

  return {
    backupServicesId,
    vspcTenantId,
    /** Query exposée à la page de service, pour afficher une erreur si la cascade échoue. */
    serviceIds: () =>
      queryOptions({
        queryKey: queryKeys.serviceIds(),
        queryFn: async () => ({
          backupServicesId: await backupServicesId(),
          vspcTenantId: await vspcTenantId(),
        }),
      }),
  };
};

// ─── Factory ───

export const tenantsQueries = { backupServicesTenants, vspcTenants, withClient };
