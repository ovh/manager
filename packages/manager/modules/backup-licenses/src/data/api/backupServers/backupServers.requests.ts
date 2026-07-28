import { v2 } from '@ovh-ux/manager-core-api';

import {
  mockBackupServers,
  simulateBackupServerDeletion,
} from '@/mocks/backupServers/backupServers.mock';
import { USE_API_MOCKS } from '@/mocks/mocks.config';
import { BackupServerResource } from '@/types/BackupServer.type';
import { getBackupServerRoute, getBackupServersRoute } from '@/utils/apiRoutes/apiRoutes';

export type GetBackupServersParams = {
  backupServicesId: string;
  vspcTenantId: string;
};

export type DeleteBackupServerParams = GetBackupServersParams & {
  backupServerId: string;
};

/**
 * Liste des serveurs VBR d'un tenant VSPC.
 * Appel simple et non paginé : la liste est courte et le support Iceberg de cette
 * route n'est pas documenté (cf. §11 de la spec BKP-1216).
 */
export const getBackupServers = async ({
  backupServicesId,
  vspcTenantId,
}: GetBackupServersParams): Promise<BackupServerResource[]> => {
  if (USE_API_MOCKS) return mockBackupServers;

  const { data } = await v2.get<BackupServerResource[]>(
    getBackupServersRoute(backupServicesId, vspcTenantId),
  );
  return data;
};

/**
 * Suppression d'un serveur VBR (BKP-1219). Révoque la licence VSPC associée côté backend.
 * L'opération est asynchrone : la ressource porte une tâche jusqu'à sa fin, c'est le polling
 * de la liste qui reflète ensuite la disparition de la ligne.
 */
export const deleteBackupServer = async ({
  backupServicesId,
  vspcTenantId,
  backupServerId,
}: DeleteBackupServerParams): Promise<void> => {
  if (USE_API_MOCKS) {
    simulateBackupServerDeletion(backupServerId);
    return;
  }

  await v2.delete(getBackupServerRoute(backupServicesId, vspcTenantId, backupServerId));
};
