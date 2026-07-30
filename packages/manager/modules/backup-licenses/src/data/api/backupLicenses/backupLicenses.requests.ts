import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';

import { mockBackupLicenses } from '@/mocks/backupLicenses/backupLicenses.mock';
import { USE_API_MOCKS } from '@/mocks/mocks.config';
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
  if (USE_API_MOCKS) return mockBackupLicenses;

  const { data } = await fetchIcebergV2<BackupLicenseResource>({
    route: getBackupLicensesRoute(backupServicesId, vspcTenantId),
  });
  return data;
};
