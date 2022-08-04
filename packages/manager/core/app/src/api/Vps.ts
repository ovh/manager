import { fetchPaginated } from '.';

export type Vps = {
  name: string;
  zone: string;
  offerType: string;
  state: string;
  vcore: number;
};

type VpsList = {
  totalCount: number;
  data: Vps[];
};

export async function listVps({
  currentPage,
  pageSize,
  search,
  sortBy,
  sortReverse,
}: {
  currentPage: number;
  pageSize: number;
  search?: {
    key: string;
    value: string;
  };
  sortBy?: string;
  sortReverse?: boolean;
}): Promise<VpsList> {
  return fetchPaginated({
    route: '/vps',
    page: currentPage,
    pageSize,
    search,
    sortBy,
    sortReverse,
  });
}

export default Vps;
