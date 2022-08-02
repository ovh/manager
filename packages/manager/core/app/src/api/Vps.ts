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
  sortBy,
  sortReverse,
}: {
  currentPage: number;
  pageSize: number;
  sortBy?: string;
  sortReverse?: boolean;
}): Promise<VpsList> {
  return fetchPaginated({
    route: '/vps',
    page: currentPage,
    pageSize,
    sortBy,
    sortReverse,
  });
}

export default Vps;
