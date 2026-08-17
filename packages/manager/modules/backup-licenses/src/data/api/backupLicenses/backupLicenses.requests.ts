import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';

import { postJSON } from '@/data/api/Client.api';
import { BackupLicenseResource, CreateBackupLicenseParams } from '@/types/BackupLicense.type';
import { BackupServerResource } from '@/types/BackupServer.type';
import { getBackupLicensesRoute } from '@/utils/apiRoutes/apiRoutes';

export type GetBackupLicensesParams = {
  backupServicesId: string;
  vspcTenantId: string;
};

export const getBackupLicenses = async ({
  backupServicesId,
  vspcTenantId,
}: GetBackupLicensesParams): Promise<BackupLicenseResource[]> => {
  const { data } = await fetchIcebergV2<BackupLicenseResource>({
    route: getBackupLicensesRoute(backupServicesId, vspcTenantId),
  });
  return data;
};

/** Ajout d'un serveur VBR supplémentaire (BKP-1217) : le vault existe déjà, on ne crée que la licence/serveur. */
export const createBackupLicense = ({
  backupServicesId,
  vspcTenantId,
  body,
}: CreateBackupLicenseParams): Promise<BackupServerResource> =>
  postJSON<BackupServerResource>(
    'v2',
    getBackupLicensesRoute(backupServicesId, vspcTenantId),
    body,
  );
