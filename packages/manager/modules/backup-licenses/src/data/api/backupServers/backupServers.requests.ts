import { v2 } from '@ovh-ux/manager-core-api';

import {
  mockBackupServers,
  simulateBackupServerUpdate,
} from '@/mocks/backupServers/backupServers.mock';
import { USE_API_MOCKS } from '@/mocks/mocks.config';
import { BackupServerResource } from '@/types/BackupServer.type';
import { getBackupServerRoute, getBackupServersRoute } from '@/utils/apiRoutes/apiRoutes';

export type GetBackupServersParams = {
  backupServicesId: string;
  vspcTenantId: string;
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
 * Édition d'un serveur VBR (BKP-1218). Nom et IP sont appliqués immédiatement ; un changement
 * de `licenseType` est différé au 1er du mois suivant côté backend — le front envoie la cible
 * dans le même corps, il n'y a rien de spécifique à faire ici pour ce décalage.
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
