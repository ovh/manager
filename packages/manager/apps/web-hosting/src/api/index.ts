import { fetchIcebergV2, v6 } from '@ovh-ux/manager-core-api';

export const getWebHostingAttachedDomainQueryKey = (shouldFetchAll?: boolean) =>
  ['get', 'webhosting', 'attachedDomain', shouldFetchAll ? 'all' : ''].filter(
    Boolean,
  );
export const getWebHostingAttachedDomain = async ({
  pageParam,
  pageSize = 15,
}: {
  pageParam?: string;
  pageSize?: number;
}) => {
  const response = await fetchIcebergV2({
    route: '/webhosting/attachedDomain',
    pageSize,
    cursor: pageParam,
  });
  return response;
};

export const getWebHostingAttachedDomainDigStatusQueryKey = (
  serviceName: string,
  domain: string,
) => ['get', 'webhosting', serviceName, 'attachedDomain', domain, 'digStatus'];

export const getWebHostingAttachedDomainDigStatus = async (
  serviceName: string,
  domain: string,
) => {
  const { data } = await v6.get(
    `/hosting/web/${serviceName}/attachedDomain/${domain}/digStatus`,
  );
  return data;
};
