import { useQuery } from '@tanstack/react-query';

import { APP_FEATURES } from '@/App.constants';
import { fetchListing } from '@/data/api/Client.api';

const QUERY_KEY = ['nasha', 'has-services'] as const;

/**
 * Hook to check if there are any NASHA services.
 * This is used for conditional redirection: if services exist, redirect to listing; otherwise, redirect to onboarding.
 * Equivalent to the AngularJS redirectTo logic in nasha.routing.js
 */
export function useHasNashaServices() {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      // Disable cache to match AngularJS behavior: execute(null, true)
      const result = await fetchListing<unknown>(APP_FEATURES.listingEndpoint, {
        page: 1,
        pageSize: 1,
        disableCache: true, // Equivalent to execute(null, true) in AngularJS
      });
      return result.data.length > 0;
    },
    retry: false,
    staleTime: 0, // Don't cache this query result
    gcTime: 0, // Don't keep in cache
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  return {
    hasServices: data ?? false,
    isLoading,
    isError,
  };
}
