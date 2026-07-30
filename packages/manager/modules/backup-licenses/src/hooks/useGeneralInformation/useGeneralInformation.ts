import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useServiceDetailsQueryOption } from '@ovh-ux/manager-module-common-api';

import { backupLicenseQueries } from '@/data/queries/backupLicense.queries';
import { tenantsQueries } from '@/data/queries/tenants.queries';

/**
 * Compose la chaîne ①②③④ de la spec BKP-1226 (§3) : `backupServicesId`/`vspcTenantId` sont
 * déjà résolus et en cache par `ServiceLayoutPage` (leur échec y est géré par l'`ErrorBanner`
 * globale) — seul l'échec de ③ (licence → resourceName) ou ④ (détails du service) est traité ici.
 */
export const useGeneralInformation = () => {
  const queryClient = useQueryClient();
  const tenants = tenantsQueries.withClient(queryClient);

  const { data: serviceIds } = useQuery(tenants.serviceIds());
  const backupServicesId = serviceIds?.backupServicesId;

  const { data: vspcTenantList } = useQuery({
    ...tenantsQueries.vspcTenants(backupServicesId ?? ''),
    enabled: !!backupServicesId,
  });
  const vspcTenant = vspcTenantList?.[0];

  const {
    data: resourceName,
    isPending: isResourceNamePending,
    isError: isResourceNameError,
    refetch: refetchResourceName,
  } = useQuery(backupLicenseQueries.withClient(queryClient).resourceName());

  const {
    data: serviceDetailsResponse,
    isPending: isServiceDetailsPending,
    isError: isServiceDetailsError,
    refetch: refetchServiceDetails,
  } = useQuery(useServiceDetailsQueryOption({ resourceName: resourceName ?? '' }));
  const serviceDetails = serviceDetailsResponse?.data;

  return {
    isLoading: isResourceNamePending || isServiceDetailsPending,
    isError: isResourceNameError || isServiceDetailsError,
    refetch: () => {
      void refetchResourceName();
      void refetchServiceDetails();
    },
    reference: backupServicesId,
    resourceName,
    serviceName: serviceDetails?.resource.displayName,
    accessUrl: vspcTenant?.currentState.accessUrl,
    isProvisioning: vspcTenant?.resourceStatus === 'CREATING',
    creationDate: serviceDetails?.billing.lifecycle.current.creationDate,
    nextBillingDate: serviceDetails?.billing.nextBillingDate,
    contacts: serviceDetails?.customer.contacts,
  };
};
