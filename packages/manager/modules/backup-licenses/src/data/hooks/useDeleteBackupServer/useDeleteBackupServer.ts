import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { TApiCustomError } from '@ovh-ux/manager-core-api';

import { deleteBackupServer } from '@/data/api/backupServers/backupServers.requests';
import { backupLicenseQueries } from '@/data/queries/backupLicense.queries';
import { queryKeys } from '@/data/queries/queryKeys';
import { tenantsQueries } from '@/data/queries/tenants.queries';

/**
 * Suppression d'un serveur VBR (BKP-1219).
 *
 * Les identifiants de service et de tenant VSPC ne sont pas dans l'URL : ils sont résolus par
 * la cascade de queries au moment de la mutation (cf. §4 de la spec BKP-1219).
 *
 * L'invalidation de la liste est faite ici, avant le `onSuccess` de l'appelant : c'est le seul
 * point d'accroche nécessaire pour que le polling des opérations asynchrones (BKP-1220) prenne
 * le relais et fasse disparaître la ligne à la fin de la tâche.
 */
export const useDeleteBackupServer = ({
  onSuccess,
  ...options
}: Omit<UseMutationOptions<void, TApiCustomError, string>, 'mutationFn'> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (backupServerId: string) => {
      const tenants = tenantsQueries.withClient(queryClient);
      const backupServicesId = await tenants.backupServicesId();
      const vspcTenantId = await tenants.vspcTenantId();
      const backupLicensesId = await backupLicenseQueries.withClient(queryClient).id();
      return deleteBackupServer({
        backupServicesId,
        vspcTenantId,
        backupLicensesId,
        backupServerId,
      });
    },
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.backupServers.all() });
      onSuccess?.(...params);
    },
    ...options,
  });
};
