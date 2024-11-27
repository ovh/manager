import { fetchIcebergV2, v2, v6 } from '@ovh-ux/manager-core-api';
import {
  DiagnosticResponse,
  DomainBodyParamsType,
  DomainType,
  ZoneWithIAM,
} from './type';
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

export const getDomainZoneByName = async (name: string) => {
  const { data } = await v6.get<ZoneWithIAM>(`/domain/zone/${name}`);
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

// POST

export const postZimbraPlatformDomainsDiagnostic = async (
  platformId: string,
  domainIds: string[],
  mock = true,
) => {
  if (mock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const [domainId] = domainIds;
        resolve([{ ...domainDiagnosticMock, domainId }]);
      }, 1000);
    });
  }
  const { data } = await v2.post<DiagnosticResponse[]>(
    `${getApiPath(platformId)}domain/diagnostic`,
    domainIds,
  );
  return data;
};

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
