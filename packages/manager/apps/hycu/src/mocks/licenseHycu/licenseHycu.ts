import { PathParams } from 'msw';
import { LicenseStatus } from '@/types/hycu.details.interface';
import { Handler } from '../../../../../../../playwright-helpers';
import { licensesHycu } from './licenseHycu.data';

export type GetLicenseHycuMocksParams = {
  isGetLicenseHycuKo?: boolean;
  isPostLicenseHycuKo?: boolean;
  nbLicenseHycu?: number;
  licenseStatus?: LicenseStatus;
};

export const getLicenseHycuMocks = ({
  isGetLicenseHycuKo,
  isPostLicenseHycuKo,
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
      response: (_: unknown, params: PathParams) => {
        return isGetLicenseHycuKo
          ? {
              message: 'Backup error',
            }
          : {
              ...licensesHycu.find(
                (licenseHycu) => licenseHycu.serviceName === params.serviceName,
              ),
              licenseStatus,
              controllerId:
                licenseStatus !== LicenseStatus.TO_ACTIVATE ? 'test-id' : '',
            };
      },
      status: isGetLicenseHycuKo ? 500 : 200,
      api: 'v6',
    },
    {
      url: 'license/hycu/:serviceName/activate',
      response: null,
      method: 'post',
      status: isPostLicenseHycuKo ? 500 : 200,
      api: 'v6',
    },
    {
      url: 'license/hycu/:serviceName/refresh',
      response: null,
      method: 'post',
      status: isPostLicenseHycuKo ? 500 : 200,
      api: 'v6',
    },
    {
      url: 'license/hycu/:serviceName/license',
      response: { content: 'my license content' },
      method: 'get',
      status: isPostLicenseHycuKo ? 500 : 200,
      api: 'v6',
    },
  ];
};
