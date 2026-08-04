import { useQuery, useQueryClient } from '@tanstack/react-query';

import { tenantsQueries } from '@/data/queries/tenants.queries';

/**
 * URN IAM du tenant VSPC courant (cascade service → tenant, cf. `useGeneralInformation`).
 *
 * Sert à gater une action qui porte sur le tenant lui-même plutôt que sur un serveur VBR précis
 * — le cas de l'ajout d'un serveur (BKP-1217) : il n'existe pas encore de ressource serveur (donc
 * pas de `server.iam.urn`) au moment du check, contrairement à l'édition/suppression d'un serveur
 * déjà enregistré (cf. `BackupServerActionsCell`, `EditRecapPanel`).
 */
export function useVspcTenantUrn(): string | undefined {
  const queryClient = useQueryClient();
  const tenants = tenantsQueries.withClient(queryClient);

  const { data: serviceIds } = useQuery({ ...tenants.serviceIds(), retry: false });
  const backupServicesId = serviceIds?.backupServicesId;

  const { data: vspcTenants } = useQuery({
    ...tenantsQueries.vspcTenants(backupServicesId ?? ''),
    enabled: !!backupServicesId,
  });

  return vspcTenants?.[0]?.iam?.urn;
}
