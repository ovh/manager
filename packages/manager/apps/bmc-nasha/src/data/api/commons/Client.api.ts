import { fetchIcebergV6, fetchIcebergV2 } from '@ovh-ux/manager-core-api';
import type { Filter } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';

import type { ListingApiResponse } from '@/types/ClientApi.type';
import type { OnboardingConfigType } from '@/types/Onboarding.type';

/**
 * Get a paginated listing page using the configured API strategy
 */
export async function getListingPage<T>(params: {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDesc?: boolean;
  filters?: Filter[];
  cursor?: string;
}): Promise<ListingApiResponse<T>> {
  const { listingApi, listingEndpoint } = APP_FEATURES;
  
  switch (listingApi) {
    case 'v6Iceberg':
      const v6Result = await fetchIcebergV6<T>({
        route: listingEndpoint,
        page: params.page,
        filters: params.filters,
        sortBy: params.sortBy,
        sortReverse: params.sortDesc,
      });
      return {
        data: v6Result.data,
        totalCount: v6Result.totalCount,
        hasNextPage: false, // V6 doesn't provide hasNextPage
        cursor: undefined, // V6 doesn't provide cursor
      };
    case 'v2':
      const v2Result = await fetchIcebergV2<T>({
        route: listingEndpoint,
        cursor: params.cursor,
        filters: params.filters,
        sortBy: params.sortBy,
        sortOrder: params.sortDesc ? 'DESC' : 'ASC',
      });
      return {
        data: v2Result.data,
        totalCount: v2Result.data.length, // V2 doesn't provide totalCount
        hasNextPage: !!v2Result.cursorNext,
        cursor: v2Result.cursorNext,
      };
    case 'v6':
    default:
      // Fallback to standard v6 API
      const defaultResult = await fetchIcebergV6<T>({
        route: listingEndpoint,
        page: params.page,
        filters: params.filters,
        sortBy: params.sortBy,
        sortReverse: params.sortDesc,
      });
      return {
        data: defaultResult.data,
        totalCount: defaultResult.totalCount,
        hasNextPage: false, // V6 doesn't provide hasNextPage
        cursor: undefined, // V6 doesn't provide cursor
      };
  }
}

/**
 * Get onboarding configuration with mock fallback
 */
export async function getOnboardingConfig(): Promise<OnboardingConfigType> {
  // In development, check for mock mode
  if (process.env.NODE_ENV === 'development' && process.env.API_DATA_MODE === 'mock') {
    return {
      productName: 'bmc-nasha',
      productCategory: 'Public Cloud',
      brand: 'OVHcloud',
      tiles: [
        { id: 1, key: 'guide1', linkKey: 'discover' },
        { id: 2, key: 'guide2', linkKey: 'tutorial' },
        { id: 3, key: 'guide3', linkKey: 'faq' },
      ],
      links: {
        discover: 'https://docs.ovh.com',
        tutorial: 'https://docs.ovh.com',
        faq: 'https://docs.ovh.com',
      },
    };
  }

  // Real API call would go here
  throw new Error('Onboarding API not implemented yet');
}
