import { v2 } from '@ovh-ux/manager-core-api';

import { USE_API_MOCKS } from '@/mocks/mocks.config';
import { mockBackupLicenses } from '@/mocks/backupLicenses/backupLicenses.mock';
import { BackupLicenseResource } from '@/types/BackupLicense.type';
import { getBackupLicensesRoute } from '@/utils/apiRoutes/apiRoutes';

/**
 * Route déduite par analogie avec `/vault`, non vérifiée pour ce produit (§3.2/§14 de la
 * spec BKP-1225). `USE_API_MOCKS` permet de développer sans.
 */
export const getBackupLicenses = async (
  backupServicesId: string,
): Promise<BackupLicenseResource[]> => {
  if (USE_API_MOCKS) return mockBackupLicenses;

  const { data } = await v2.get<BackupLicenseResource[]>(getBackupLicensesRoute(backupServicesId));
  return data;
};
