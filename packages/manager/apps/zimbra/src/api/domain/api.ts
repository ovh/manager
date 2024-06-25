import { v2, v6 } from '@ovh-ux/manager-core-api';
import { DomainBodyParamsType, DomainType } from './type';

// GET

export const getZimbraPlatformDomains = async (
  platformId: string,
  organizationId?: string,
) => {
  const { data } = await v2.get<DomainType[]>(
    `/zimbra/platform/${platformId}/domain${
      organizationId ? `?organizationId=${organizationId}` : ''
    }`,
  );
  return data;
};

export const getDomainsZoneList = async () => {
  const { data } = await v6.get('/domain/zone');
  return data;
};

// POST

export const postZimbraDomain = async (
  platformId: string,
  params: DomainBodyParamsType,
) => {
  const { data } = await v2.post(
    `/zimbra/platform/${platformId}/domain`,
    params,
  );
  return data;
};

// DELETE

export const deleteZimbraPlatformDomain = async (
  platformId: string,
  domainId: string,
) => {
  const { data } = await v2.delete(
    `/zimbra/platform/${platformId}/domain/${domainId}`,
  );
  return data;
};
