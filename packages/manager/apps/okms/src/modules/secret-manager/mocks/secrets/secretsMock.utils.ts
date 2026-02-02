import { Secret, SecretWithData } from '@secret-manager/types/secret.type';
import { PathParams } from 'msw';

import { getVersionMockWithData } from '../versions/versionsMock.utils';

export const getSecretMockWithData = (secret: Secret): SecretWithData => {
  return {
    ...secret,
    version: secret?.version ? getVersionMockWithData(secret.version) : undefined,
  };
};

export const getSecretListMockWithData = (secretListMock: Secret[]) =>
  secretListMock.map((secretMock) => getSecretMockWithData(secretMock));

export const findSecretMockByPath = (
  secretListMock: Secret[],
  request: Request,
  params: PathParams,
) => {
  const url = new URL(request.url);
  const includeData = url.searchParams.get('includeData');
  const mockList = includeData ? getSecretListMockWithData(secretListMock) : secretListMock;
  return mockList.find(({ path }) => path === params.secretPath);
};
