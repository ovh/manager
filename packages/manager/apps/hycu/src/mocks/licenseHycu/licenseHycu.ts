import { Handler } from '../../../../../../../playwright-helpers';
import { licensesHycu } from './licenseHycu.data';

export type GetLicenseHycuMocksParams = {
  isGetLicenseHycuKo?: boolean;
  nbLicenseHycu?: number;
};

export const getLicenseHycuMocks = ({
  isGetLicenseHycuKo,
  nbLicenseHycu = Number.POSITIVE_INFINITY,
}: GetLicenseHycuMocksParams): Handler[] => {
  return [
    {
      url: 'license/hycu',
      response: isGetLicenseHycuKo
        ? {
            message: 'Backup error',
          }
        : licensesHycu.slice(0, nbLicenseHycu),
      status: isGetLicenseHycuKo ? 500 : 200,
      api: 'v6',
    },
  ];
};
