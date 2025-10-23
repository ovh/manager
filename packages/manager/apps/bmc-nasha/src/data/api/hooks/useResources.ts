import { useQuery } from '@tanstack/react-query';
import type { Filter } from '@ovh-ux/manager-core-api';

import { getListingPage } from '@/data/api/commons/Client.api';
import { APP_FEATURES } from '@/App.constants';

import type { ListingApiResponse } from '@/types/ClientApi.type';

interface UseResourcesParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDesc?: boolean;
  filters?: Filter[];
  cursor?: string;
}

/**
 * Hook facade that selects the right listing strategy based on APP_FEATURES.listingApi
 */
export function useResources<T>(params: UseResourcesParams = {}) {
  const {
    page = 1,
    pageSize = 50,
    sortBy,
    sortDesc = false,
    filters,
    cursor,
  } = params;

  return useQuery<ListingApiResponse<T>>({
    queryKey: ['resources', APP_FEATURES.listingApi, page, pageSize, sortBy, sortDesc, filters, cursor],
    queryFn: () => getListingPage<T>({
      page,
      pageSize,
      sortBy,
      sortDesc,
      filters,
      cursor,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
