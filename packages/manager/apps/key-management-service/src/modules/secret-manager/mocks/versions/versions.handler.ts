import { Handler } from '@ovh-ux/manager-core-test-utils';
import { versionsMock } from './versions.mock';

// LIST VERSION
export type GetVersionsMockParams = {
  isVersionKO?: boolean;
  nbVersions?: number;
};

export const getVersionsMock = ({
  isVersionKO,
  nbVersions = versionsMock.length,
}: GetVersionsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret/:secretPath/version',
    response: isVersionKO
      ? {
          status: 500,
          data: {
            message: 'version error',
          },
        }
      : versionsMock.slice(0, nbVersions),
    status: isVersionKO ? 500 : 200,
    api: 'v2',
  },
];
