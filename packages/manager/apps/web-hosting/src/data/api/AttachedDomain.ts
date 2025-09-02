import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';

import { WebsiteType } from '../types/product/website';

export const getWebHostingAttachedDomainQueryKey = (
  searchParams: string,
  shouldFetchAll?: boolean,
) =>
  ['get', 'webhosting', 'attachedDomain', searchParams, shouldFetchAll ? 'all' : ''].filter(
    Boolean,
  );
export const getWebHostingAttachedDomain = async ({
  pageParam,
  searchParams,
  pageSize = 15,
}: {
  pageParam?: string;
  searchParams?: string;
  pageSize?: number;
}) => {
  const response = await fetchIcebergV2<WebsiteType>({
    route: `/webhosting/attachedDomain${searchParams}`,
    pageSize,
    cursor: pageParam,
  });
  return response;
};

export const getAllWebHostingAttachedDomain = async (searchParams?: string) => {
  const allDataArray: WebsiteType[] = [];

  const fetchPages = async (cursor: string | null): Promise<void> => {
    const response = await getWebHostingAttachedDomain({
      pageParam: cursor,
      pageSize: 500,
      searchParams,
    });

    allDataArray.push(...response.data);

    if (response.cursorNext) {
      await fetchPages(response.cursorNext);
    }
  };

  await fetchPages(null);
  return { data: allDataArray };
};
