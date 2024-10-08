import { Handler } from '../../../../../../../playwright-helpers';
import { licenseHycu } from './licenseHycu.data';

export type GetLicenseHycuMocksParams = {
  isBackupKo?: boolean;
  nbLicenseHycu?: number;
};

export const getLicenseHycuMocks = ({
  isBackupKo,
  nbLicenseHycu = Number.POSITIVE_INFINITY,
}: GetLicenseHycuMocksParams): Handler[] => {
  return [
    {
      url: 'license/hycu',
      response: isBackupKo
        ? {
            message: 'Backup error',
          }
        : licenseHycu.slice(0, nbLicenseHycu),
      status: isBackupKo ? 500 : 200,
      api: 'v6',
    },
  ];
};
