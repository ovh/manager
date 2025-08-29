import { v6 } from '@ovh-ux/manager-core-api';
import { LocalSeoType, LocalSeoAccount } from '../type';
import { ITEMS_PER_PAGE } from '@/constants';

interface PageParam {
  pageNumber: number;
  totalPage?: number;
}

export const getHostingLocalSeo = async (
  serviceName: string,
  pageParam: PageParam,
): Promise<{
  data: LocalSeoType[];
  pageParam: PageParam;
}> => {
  const taskHeaders = {
    'X-Pagination-Mode': 'CachedObjectList-Pages',
    'X-Pagination-Size': ITEMS_PER_PAGE,
    'X-Pagination-Number': pageParam?.pageNumber,
  };
  const { data, headers } = await v6.get<LocalSeoType[]>(
    `/hosting/web/${serviceName}/localSeo/location`,
    { headers: taskHeaders },
  );
  const totalPage = Number(headers['x-pagination-total']);
  return { data, pageParam: { totalPage, ...pageParam } };
};

export const getHostingLocalSeoAccount = async (
  serviceName: string,
  id: string,
): Promise<LocalSeoAccount> => {
  const { data } = await v6.get<LocalSeoAccount>(
    `/hosting/web/${serviceName}/localSeo/account/${id}`,
  );
  return data;
};

export const hostingLocalSeoLogin = async (
  serviceName: string,
  accountId: string,
): Promise<string> => {
  const { data } = await v6.post(
    `/hosting/web/${serviceName}/localSeo/account/${accountId}/login`,
  );
  return data;
};

export const hostingDeleteLocation = async (
  serviceName: string,
  locationId: string,
): Promise<string> => {
  const { data } = await v6.post<string>(
    `/hosting/web/${serviceName}/localSeo/location/${locationId}/terminate`,
  );
  return data;
};
