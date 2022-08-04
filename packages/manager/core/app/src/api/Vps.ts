import { Filter } from '@/api/filters';
import { fetchIceberg } from '@/api/iceberg';

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

export type ListVpsParams = {
  currentPage: number;
  pageSize: number;
  filters?: Filter[];
  sortBy?: string;
  sortReverse?: boolean;
};

export async function listVps({
  currentPage,
  pageSize,
  filters,
  sortBy,
  sortReverse,
}: ListVpsParams): Promise<VpsList> {
  return fetchIceberg({
    route: '/vps',
    page: currentPage,
    pageSize,
    filters,
    sortBy,
    sortReverse,
  });
}

export default Vps;
