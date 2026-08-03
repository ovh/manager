import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';

import { postJSON } from '@/data/api/Client.api';
import { mockBackupLicenses, mockCreateBackupLicense } from '@/mocks/backupLicenses/backupLicenses.mock';
import { USE_API_MOCKS } from '@/mocks/mocks.config';
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
  if (USE_API_MOCKS) return mockBackupLicenses;

  const { data } = await fetchIcebergV2<BackupLicenseResource>({
    route: getBackupLicensesRoute(backupServicesId, vspcTenantId),
  });
  return data;
};

/** Ajout d'un serveur VBR supplémentaire (BKP-1217) : le vault existe déjà, on ne crée que la licence/serveur. */
export const createBackupLicense = async ({
  backupServicesId,
  vspcTenantId,
  body,
}: CreateBackupLicenseParams): Promise<BackupServerResource> => {
  if (USE_API_MOCKS) return mockCreateBackupLicense(body);

  return postJSON<BackupServerResource>(
    'v2',
    getBackupLicensesRoute(backupServicesId, vspcTenantId),
    body,
  );
};
