import { ApiError, v2 } from '@ovh-ux/manager-core-api';

import { BackupServerResource } from '@/types/BackupServer.type';
import { getBackupServerRoute, getBackupServersRoute } from '@/utils/apiRoutes/apiRoutes';

const NOT_FOUND_STATUS = 404;

export type GetBackupServersParams = {
  backupServicesId: string;
  vspcTenantId: string;
  backupLicensesId: string;
};

export type EditBackupServerParams = GetBackupServersParams & {
  backupServerId: string;
  displayName: string;
  licenseType: string;
  externalIps: string[];
  privateIps: string[];
};

export type CreateBackupServerParams = GetBackupServersParams & {
  displayName: string;
  licenseType: string;
  externalIps: string[];
  privateIps: string[];
};

export type DeleteBackupServerParams = GetBackupServersParams & {
  backupServerId: string;
};

export const getBackupServers = async ({
  backupServicesId,
  vspcTenantId,
  backupLicensesId,
}: GetBackupServersParams): Promise<BackupServerResource[]> => {
  try {
    const { data } = await v2.get<BackupServerResource[]>(
      getBackupServersRoute(backupServicesId, vspcTenantId, backupLicensesId),
    );
    return data;
  } catch (error) {
    if ((error as ApiError)?.response?.status === NOT_FOUND_STATUS) {
      return [];
    }
    throw error;
  }
};

/**
 * Ajout d'un serveur VBR supplémentaire sur un vault déjà provisionné (BKP-1217) : un simple
 * POST sur la ressource `backupServer`, plus de panier Agora pour ce flux.
 */
export const createBackupServer = async ({
  backupServicesId,
  vspcTenantId,
  backupLicensesId,
  ...payload
}: CreateBackupServerParams): Promise<void> => {
  await v2.post(
    getBackupServersRoute(backupServicesId, vspcTenantId, backupLicensesId),
    payload,
  );
};

/**
 * Édition d'un serveur VBR (BKP-1218). Nom et IP sont appliqués immédiatement ; un changement
 * de `licenseType` est différé au 1er du mois suivant côté backend — le front envoie la cible
 * dans le même corps, il n'y a rien de spécifique à faire ici pour ce décalage.
 */
export const editBackupServer = async ({
  backupServicesId,
  vspcTenantId,
  backupLicensesId,
  backupServerId,
  ...payload
}: EditBackupServerParams): Promise<void> => {
  await v2.put(
    getBackupServerRoute(backupServicesId, vspcTenantId, backupLicensesId, backupServerId),
    payload,
  );
};

/**
 * Suppression d'un serveur VBR (BKP-1219). Révoque la licence VSPC associée côté backend.
 * L'opération est asynchrone : la ressource porte une tâche jusqu'à sa fin, c'est le polling
 * de la liste qui reflète ensuite la disparition de la ligne.
 */
export const deleteBackupServer = async ({
  backupServicesId,
  vspcTenantId,
  backupLicensesId,
  backupServerId,
}: DeleteBackupServerParams): Promise<void> => {
  await v2.delete(
    getBackupServerRoute(backupServicesId, vspcTenantId, backupLicensesId, backupServerId),
  );
};
