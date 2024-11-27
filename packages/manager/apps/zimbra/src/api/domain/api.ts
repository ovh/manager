import { fetchIcebergV2, v2, v6 } from '@ovh-ux/manager-core-api';
import { DiagnosticResponse, DomainBodyParamsType, DomainType } from './type';
import { getApiPath } from '../utils/apiPath';
import { domainDiagnosticMock } from '../_mock_';

// GET

export const getZimbraPlatformDomains = ({
  platformId,
  organizationId,
  pageParam,
}: {
  platformId: string;
  organizationId?: string;
  pageParam?: unknown;
}) =>
  fetchIcebergV2<DomainType[]>({
    route: `${getApiPath(platformId)}domain${
      organizationId ? `?organizationId=${organizationId}` : ''
    }`,
    pageSize: 25,
    cursor: pageParam as string,
  });

export const getDomainsZoneList = async () => {
  const { data } = await v6.get('/domain/zone');
  return data;
};

export const getZimbraPlatformDomainDetail = async (
  platformId: string,
  domainId: string,
) => {
  const { data } = await v2.get<DomainType>(
    `${getApiPath(platformId)}domain/${domainId}`,
  );
  return data;
};

export const getZimbraPlatformDomainDiagnostic = async (
  platformId: string,
  domainId: string,
  mock = true,
) => {
  if (mock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(domainDiagnosticMock);
      }, 1000);
    });
  }
  const { data } = await v2.get<DiagnosticResponse>(
    `${getApiPath(platformId)}domain/${domainId}/diagnostic`,
  );
  return data;
};

// POST

export const postZimbraDomain = async (
  platformId: string,
  params: DomainBodyParamsType,
) => {
  const { data } = await v2.post(`${getApiPath(platformId)}domain`, {
    targetSpec: params,
  });
  return data;
};

// PUT

export const putZimbraDomain = async (
  platformId: string,
  domainId: string,
  params: DomainBodyParamsType,
) => {
  const { data } = await v2.put(`${getApiPath(platformId)}domain/${domainId}`, {
    targetSpec: params,
  });
  return data;
};

// DELETE

export const deleteZimbraPlatformDomain = async (
  platformId: string,
  domainId: string,
) => {
  const { data } = await v2.delete(
    `${getApiPath(platformId)}domain/${domainId}`,
  );
  return data;
};
