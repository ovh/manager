import { LicenseStatus } from '@/types/hycu.details.interface';
import { Handler } from '../../../../../../../playwright-helpers';
import { licensesHycuService } from './serviceLicenseHycu.data';

export type GetServiceLicenseHycuMocksParams = {
  isGetServiceLicenseHycuKo?: boolean;
  licenseStatus?: LicenseStatus;
};

export const getServiceLicenseHycuMocks = ({
  isGetServiceLicenseHycuKo,
}: GetServiceLicenseHycuMocksParams): Handler[] => {
  return [
    {
      url: 'services/:id',
      response: isGetServiceLicenseHycuKo
        ? {
            message: 'Backup error',
          }
        : licensesHycuService,
      status: isGetServiceLicenseHycuKo ? 500 : 200,
      api: 'v6',
    },
  ];
};
