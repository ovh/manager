import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { TApiCustomError } from '@ovh-ux/manager-core-api';

import {
  EditBackupServerParams,
  editBackupServer,
} from '@/data/api/backupServers/backupServers.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { tenantsQueries } from '@/data/queries/tenants.queries';

export type EditBackupServerPayload = Omit<
  EditBackupServerParams,
  'backupServicesId' | 'vspcTenantId'
>;

/**
 * Édition d'un serveur VBR (BKP-1218), sur le modèle de `useDeleteBackupServer`.
 *
 * Les identifiants de service et de tenant VSPC ne sont pas dans l'URL : ils sont résolus par
 * la cascade de queries au moment de la mutation (cf. §4 de la spec BKP-1218).
 *
 * L'invalidation de la liste est faite ici, avant le `onSuccess` de l'appelant : c'est le seul
 * point d'accroche nécessaire pour que la ligne reflète les nouvelles valeurs (nom/IP,
 * appliqués immédiatement) et, si la licence change, la transition portée par `LicenseTypeCell`.
 */
export const useEditBackupServer = ({
  onSuccess,
  ...options
}: Omit<UseMutationOptions<void, TApiCustomError, EditBackupServerPayload>, 'mutationFn'> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EditBackupServerPayload) => {
      const tenants = tenantsQueries.withClient(queryClient);
      const backupServicesId = await tenants.backupServicesId();
      const vspcTenantId = await tenants.vspcTenantId();
      return editBackupServer({ backupServicesId, vspcTenantId, ...payload });
    },
    onSuccess: async (...params) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.backupServers.all() });
      onSuccess?.(...params);
    },
    ...options,
  });
};
