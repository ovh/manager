import { SecretVersion, SecretVersionWithData } from '@secret-manager/types/secret.type';
import { PathParams } from 'msw';

export const getVersionMockWithData = (version: SecretVersion): SecretVersionWithData => ({
  ...version,
  data: version.state === 'ACTIVE' ? { a: 'json' } : undefined,
});

export const getVersionListMockWithData = (versionListMock: SecretVersion[]) =>
  versionListMock.map((version) => getVersionMockWithData(version));

export const findVersionMockById = (
  versionMockList: SecretVersion[],
  request: Request,
  params: PathParams,
) => {
  const url = new URL(request.url);
  const includeData = url.searchParams.get('includeData');
  const mockList = includeData ? getVersionListMockWithData(versionMockList) : versionMockList;
  return mockList.find(({ id }) => id.toString() === params.versionId);
};
