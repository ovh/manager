import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { selectBackupLicensesVspcTenants } from '@/data/selectors/tenants.selectors';
import { hasBackupLicensesAddon } from '@/utils/hasBackupLicensesAddon/hasBackupLicensesAddon';

import { queryKeys } from './queryKeys';

/**
 * Cascade de résolution des identifiants (cf. §4 et §6 de la spec BKP-1216) :
 * `backupServicesId` puis `vspcTenantId` ne sont pas dans l'URL, ils sont résolus
 * par API et mis en cache.
 *
 * `/backupServices/tenant` et `.../vspc` servent aussi Backup Agent, et le tenant racine ne porte
 * aucune ligne produit : le périmètre ne se décide qu'au niveau VSPC (`vspcType`/`enabledAddons`).
 * Les deux identifiants sont donc résolus ensemble — prendre le premier de chaque liste
 * indépendamment retiendrait un service ou un tenant d'en face.
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
    select: selectBackupLicensesVspcTenants,
  });

// ─── Queries needing QueryClient ───

type ServiceScope = { backupServicesId: string; vspcTenantId: string };

const withClient = (queryClient: QueryClient) => {
  const serviceScope = async (): Promise<ServiceScope> => {
    const services = await queryClient.ensureQueryData(backupServicesTenants());
    if (!services.length) throw new Error('No Backup Licenses service found');

    const vspcTenantsByService = await Promise.all(
      services.map((service) => queryClient.ensureQueryData(vspcTenants(service.id))),
    );

    const scope = services
      .map((service, index) => ({
        backupServicesId: service.id,
        vspcTenantId: vspcTenantsByService[index]?.find(hasBackupLicensesAddon)?.id,
      }))
      .find(({ vspcTenantId }) => vspcTenantId);

    if (!scope?.vspcTenantId) throw new Error('No Backup Licenses VSPC tenant found');
    return { backupServicesId: scope.backupServicesId, vspcTenantId: scope.vspcTenantId };
  };

  return {
    backupServicesId: async () => (await serviceScope()).backupServicesId,
    vspcTenantId: async () => (await serviceScope()).vspcTenantId,
    /** Query exposée à la page de service, pour afficher une erreur si la cascade échoue. */
    serviceIds: () =>
      queryOptions({
        queryKey: queryKeys.serviceIds(),
        queryFn: serviceScope,
      }),
  };
};

// ─── Factory ───

export const tenantsQueries = { backupServicesTenants, vspcTenants, withClient };
