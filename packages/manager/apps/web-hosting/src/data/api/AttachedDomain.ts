import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';
import { WebsiteType } from '@/data/type';

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
  const response = await fetchIcebergV2<WebsiteType>({
    route: '/webhosting/attachedDomain',
    pageSize,
    cursor: pageParam,
  });
  return response;
};

export const getAllWebHostingAttachedDomain = async () => {
  const allDataArray: WebsiteType[] = [];

  const fetchPages = async (cursor: string | null): Promise<void> => {
    const response = await getWebHostingAttachedDomain({
      pageParam: cursor,
      pageSize: 500,
    });

    allDataArray.push(...response.data);

    if (response.cursorNext) {
      await fetchPages(response.cursorNext);
    }
  };

  await fetchPages(null);
  return { data: allDataArray };
};
