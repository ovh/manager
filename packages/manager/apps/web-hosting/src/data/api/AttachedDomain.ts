import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';

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
