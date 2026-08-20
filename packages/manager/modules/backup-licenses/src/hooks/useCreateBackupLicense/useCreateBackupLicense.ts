import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBackupServer } from '@/data/api/backupServers/backupServers.requests';
import { backupLicenseQueries } from '@/data/queries/backupLicense.queries';
import { queryKeys } from '@/data/queries/queryKeys';
import { tenantsQueries } from '@/data/queries/tenants.queries';
import { CreateBackupLicenseBody } from '@/types/BackupLicense.type';

/**
 * Ajout d'un serveur VBR supplémentaire (BKP-1217), sur le modèle de `useEditBackupServer` : les
 * identifiants de service et de tenant VSPC ne sont pas dans l'URL, ils sont résolus par la
 * cascade de queries au moment de la mutation.
 */
export function useCreateBackupLicense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateBackupLicenseBody) => {
      const tenants = tenantsQueries.withClient(queryClient);
      const backupServicesId = await tenants.backupServicesId();
      const vspcTenantId = await tenants.vspcTenantId();
      const backupLicensesId = await backupLicenseQueries.withClient(queryClient).id();
      return createBackupServer({ backupServicesId, vspcTenantId, backupLicensesId, ...body });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.backupServers.all() });
    },
  });
}
