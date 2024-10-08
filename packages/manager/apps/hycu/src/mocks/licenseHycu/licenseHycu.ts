import { Handler } from '../../../../../../../playwright-helpers';
import backupList from './licenseHycu-data.json';

export type GetLicenseHycuMocksParams = {
  isBackupKo?: boolean;
  nbBackup?: number;
};

export const getLicenseHycuMocks = ({
  isBackupKo,
  nbBackup = Number.POSITIVE_INFINITY,
}: GetLicenseHycuMocksParams): Handler[] => {
  return [
    {
      url: 'license/hycu',
      response: isBackupKo
        ? {
            message: 'Backup error',
          }
        : backupList.slice(0, nbBackup),
      status: isBackupKo ? 500 : 200,
      api: 'v6',
    },
  ];
};
