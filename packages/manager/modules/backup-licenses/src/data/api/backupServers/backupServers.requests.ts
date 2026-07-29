import { v2 } from '@ovh-ux/manager-core-api';

import {
  mockBackupServers,
  simulateBackupServerDeletion,
  simulateBackupServerUpdate,
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

export type EditBackupServerParams = GetBackupServersParams & {
  backupServerId: string;
  displayName: string;
  licenseType: string;
  externalIps: string[];
  privateIps: string[];
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

/**
 * Édition d'un serveur VBR (BKP-1218). Nom et IP sont appliqués immédiatement ; un changement
 * de `licenseType` est différé au 1er du mois suivant côté backend (§1 de la spec) — le front
 * envoie la cible dans le même corps, il n'y a rien de spécifique à faire ici pour ce décalage.
 */
export const editBackupServer = async ({
  backupServicesId,
  vspcTenantId,
  backupServerId,
  ...payload
}: EditBackupServerParams): Promise<void> => {
  if (USE_API_MOCKS) {
    simulateBackupServerUpdate(backupServerId, payload);
    return;
  }

  await v2.put(getBackupServerRoute(backupServicesId, vspcTenantId, backupServerId), payload);
};
