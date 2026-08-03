import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBackupLicense } from '@/data/api/backupLicenses/backupLicenses.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { tenantsQueries } from '@/data/queries/tenants.queries';
import { CreateBackupLicenseBody } from '@/types/BackupLicense.type';

/**
 * Ajout d'un serveur VBR supplémentaire sur un vault déjà provisionné (BKP-1217) :
 * résout la cascade backupServicesId → vspcTenantId (déjà en cache la plupart du
 * temps, la liste des serveurs l'ayant chargée) puis crée la licence/serveur.
 */
export function useCreateBackupLicense() {
  const queryClient = useQueryClient();
  const tenants = tenantsQueries.withClient(queryClient);

  return useMutation({
    mutationFn: async (body: CreateBackupLicenseBody) => {
      const backupServicesId = await tenants.backupServicesId();
      const vspcTenantId = await tenants.vspcTenantId();
      return createBackupLicense({ backupServicesId, vspcTenantId, body });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.backupServers.all() });
    },
  });
}
