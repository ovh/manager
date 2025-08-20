import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import {
  versionsMock,
  versionsMockwithData,
  createVersionResponseMock,
} from './versions.mock';

// LIST VERSION
export type GetVersionsMockParams = {
  isVersionsKO?: boolean;
  nbVersions?: number;
};

export const getVersionsMock = ({
  isVersionsKO,
  nbVersions = versionsMock.length,
}: GetVersionsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret/:secretPath/version',
    response: isVersionsKO
      ? {
          status: 500,
          data: {
            message: 'versions error',
          },
        }
      : versionsMock.slice(0, nbVersions),
    status: isVersionsKO ? 500 : 200,
    api: 'v2',
  },
];

const findVersionById = (request: Request, params: PathParams) => {
  const url = new URL(request.url);
  const includeData = url.searchParams.get('includeData');
  const mock = includeData ? versionsMockwithData : versionsMock;
  return mock.find(({ id }) => id.toString() === params.versionId);
};

// GET VERSION
export type GetVersionMockParams = {
  isVersionKO?: boolean;
};

export const getVersionMock = ({
  isVersionKO,
}: GetVersionMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret/:secretPath/version/:versionId',
    response: isVersionKO
      ? {
          status: 500,
          data: {
            message: 'version error',
          },
        }
      : (request: Request, params: PathParams) =>
          findVersionById(request, params),
    status: isVersionKO ? 500 : 200,
    api: 'v2',
  },
];

// CREATE VERSION
export const createVersionErrorMessage = 'create-secret-version-error-message';

export type CreateVersionMockParams = {
  isCreateVersionKO?: boolean;
};

export const createVersionMock = ({
  isCreateVersionKO,
}: CreateVersionMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret/:secretPath/version',
    response: isCreateVersionKO
      ? {
          message: createVersionErrorMessage,
        }
      : createVersionResponseMock,
    status: isCreateVersionKO ? 500 : 200,
    api: 'v2',
    method: 'post',
  },
];
