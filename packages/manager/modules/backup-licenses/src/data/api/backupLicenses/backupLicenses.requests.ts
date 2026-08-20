import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';

import { BackupLicenseResource } from '@/types/BackupLicense.type';
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
