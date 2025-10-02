import { Handler } from '@ovh-ux/manager-core-test-utils';
import { versionListMock, createVersionResponseMock } from './versions.mock';
import { buildMswResponseMock } from '@/utils/tests/msw';
import { findVersionMockById } from './versionsMock.utils';

// LIST VERSION
export type GetVersionsMockParams = {
  isVersionsKO?: boolean;
  nbVersions?: number;
};

export const getVersionsErrorMessage = 'get-versions-error-message';

export const getVersionsMock = ({
  isVersionsKO,
  nbVersions = versionListMock.length,
}: GetVersionsMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret/:secretPath/version',
    response: buildMswResponseMock({
      data: versionListMock.slice(0, nbVersions),
      errorMessage: getVersionsErrorMessage,
      isError: isVersionsKO,
    }),
    status: isVersionsKO ? 500 : 200,
    api: 'v2',
  },
];

// GET VERSION
export type GetVersionMockParams = {
  isVersionKO?: boolean;
};

export const getVersionErrorMessage = 'get-version-error-message';

export const getVersionMock = ({
  isVersionKO,
}: GetVersionMockParams): Handler[] => [
  {
    url: '/okms/resource/:okmsId/secret/:secretPath/version/:versionId',
    response: buildMswResponseMock({
      data: (request, params) =>
        findVersionMockById(versionListMock, request, params),
      errorMessage: getVersionErrorMessage,
      isError: isVersionKO,
    }),
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
    response: buildMswResponseMock({
      data: createVersionResponseMock,
      errorMessage: createVersionErrorMessage,
      isError: isCreateVersionKO,
    }),
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
    response: buildMswResponseMock({
      data: {},
      errorMessage: updateVersionErrorMessage,
      isError: isVersionUpdateKO,
    }),
    status: isVersionUpdateKO ? 500 : 200,
    api: 'v2',
  },
];
