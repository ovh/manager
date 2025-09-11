import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import { versionListMock, createVersionResponseMock } from './versions.mock';
import { createHandlerResponseMock } from '@/utils/tests/testUtils';
import { findVersionMockById } from './versionsMock.utils';

// LIST VERSION
export type GetVersionsMockParams = {
  isVersionsKO?: boolean;
  nbVersions?: number;
};

export const getVersionsMock = ({
  isVersionsKO,
  nbVersions = versionListMock.length,
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
      : versionListMock.slice(0, nbVersions),
    status: isVersionsKO ? 500 : 200,
    api: 'v2',
  },
];

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
          findVersionMockById(versionListMock, request, params),
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

// UPDATE VERSION
export type UpdateVersionMockParams = {
  isVersionUpdateKO?: boolean;
};

export const updateVersionErrorMessage = 'update-secret-version-error-message';

export const updateVersionMock = ({
  isVersionUpdateKO,
}: UpdateVersionMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret/:secretPath/version/:versionId',
    method: 'put',
    response: createHandlerResponseMock({
      data: {},
      errorMessage: updateVersionErrorMessage,
      isError: isVersionUpdateKO,
    }),
    status: isVersionUpdateKO ? 500 : 200,
    api: 'v2',
  },
];
