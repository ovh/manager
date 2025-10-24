import { useQuery } from '@tanstack/react-query';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { APP_FEATURES } from '@/App.constants';
import type { NashaService } from '@/types/Nasha.type';

export function useNashaServicesCheck() {
  return useQuery({
    queryKey: ['nasha-services-check'],
    queryFn: async () => {
      const result = await fetchIcebergV6<NashaService>({
        route: APP_FEATURES.listingEndpoint,
        page: 1,
        pageSize: 1,
      });
      return {
        hasServices: result.data.length > 0,
        totalCount: result.totalCount,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useNashaServices(params: {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDesc?: boolean;
}) {
  return useQuery({
    queryKey: ['nasha-services', params],
    queryFn: () => fetchIcebergV6<NashaService>({
      route: APP_FEATURES.listingEndpoint,
      ...params,
      sortReverse: params.sortDesc,
    }),
    staleTime: 2 * 60 * 1000,
  });
}
