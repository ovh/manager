import { LicenseStatus } from '@/types/hycu.details.interface';
import { Handler } from '../../../../../../../playwright-helpers';
import { licensesHycu } from './licenseHycu.data';

export type GetLicenseHycuMocksParams = {
  isGetLicenseHycuKo?: boolean;
  nbLicenseHycu?: number;
  licenseStatus?: LicenseStatus;
};

export const getLicenseHycuMocks = ({
  isGetLicenseHycuKo,
  nbLicenseHycu = Number.POSITIVE_INFINITY,
  licenseStatus = LicenseStatus.TO_ACTIVATE,
}: GetLicenseHycuMocksParams): Handler[] => {
  return [
    {
      url: 'license/hycu',
      response: isGetLicenseHycuKo
        ? {
            message: 'Backup error',
          }
        : licensesHycu
            .slice(0, nbLicenseHycu)
            .map((license) => ({ ...license, licenseStatus })),
      status: isGetLicenseHycuKo ? 500 : 200,
      api: 'v6',
    },
    {
      url: 'license/hycu/:serviceName',
      response: isGetLicenseHycuKo
        ? {
            message: 'Backup error',
          }
        : {
            ...licensesHycu[0],
            licenseStatus,
            controllerId:
              licenseStatus !== LicenseStatus.TO_ACTIVATE ? 'test-id' : '',
          },
      status: isGetLicenseHycuKo ? 500 : 200,
      api: 'v6',
    },
  ];
};
