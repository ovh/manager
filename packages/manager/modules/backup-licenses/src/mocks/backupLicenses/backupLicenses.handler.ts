import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockBackupLicenses } from '@/mocks/backupLicenses/backupLicenses.mock';
import { BackupLicenseResource } from '@/types/BackupLicense.type';

export type TBackupLicenseMockParams = {
  backupLicenses?: BackupLicenseResource[];
  isBackupLicensesError?: boolean;
};

/** Dernier maillon de la cascade service → tenant VSPC → licence, celle qui porte le `resourceName`. */
export const getBackupLicenseMocks = ({
  backupLicenses,
  isBackupLicensesError,
}: TBackupLicenseMockParams): Handler[] => [
  {
    url: '/backupServices/tenant/:backupServicesId/vspc/:vspcTenantId/backupLicenses',
    response: () =>
      isBackupLicensesError
        ? { message: 'Internal server error' }
        : (backupLicenses ?? mockBackupLicenses),
    api: 'v2',
    method: 'get',
    status: isBackupLicensesError ? 500 : 200,
    delay: 0,
  },
];
