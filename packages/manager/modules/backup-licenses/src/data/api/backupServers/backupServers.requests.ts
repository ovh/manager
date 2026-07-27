import { v2 } from '@ovh-ux/manager-core-api';

import { mockBackupServers } from '@/mocks/backupServers/backupServers.mock';
import { USE_API_MOCKS } from '@/mocks/mocks.config';
import { BackupServerResource } from '@/types/BackupServer.type';
import { getBackupServersRoute } from '@/utils/apiRoutes/apiRoutes';

export type GetBackupServersParams = {
  backupServicesId: string;
  vspcTenantId: string;
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
