import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDataApi } from '@ovh-ux/muk';
import { UseDataApiOptions, UseDataApiResult } from '@ovh-ux/muk';

type UseDomainDataApiWithRouteParamsOptions<TData> = Omit<
  UseDataApiOptions<TData>,
  'route'
> & {
  baseRoute: string;
};

export function useDomainDataApiWithRouteParams<
  TData = Record<string, unknown>
>(
  options: UseDomainDataApiWithRouteParamsOptions<TData>,
): UseDataApiResult<TData> {
  const [searchParams, setSearchParams] = useSearchParams();
  const { baseRoute, ...restOptions } = options;

  // Build route with query params from URL
  const routeWithParams = useMemo(() => {
    const params = new URLSearchParams();

    // Handle search value
    const searchValue = searchParams.get('search');
    if (searchValue) {
      params.set('searchValue', searchValue);
    }

    // Handle array filters - map from datagrid filter names to API param names
    const filterMapping: Record<string, string> = {
      contactOwner: 'contactOwner',
      contactAdministrator: 'contactAdministrator',
      contactTechnical: 'contactTechnical',
      contactBilling: 'contactBilling',
      mainState: 'mainState',
      additionalStates: 'additionalStates',
    };

    Object.entries(filterMapping).forEach(([filterKey, apiParamName]) => {
      const value = searchParams.get(`filter_${filterKey}`);
      if (value) {
        params.set(apiParamName, value);
      }
    });

    // Preserve other query params (sorting, pagination, etc.)
    searchParams.forEach((value, key) => {
      if (!key.startsWith('filter_') && key !== 'search' && !params.has(key)) {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    return queryString ? `${baseRoute}?${queryString}` : baseRoute;
  }, [baseRoute, searchParams]);

  // Normalize cacheKey and include routeWithParams so query refetches on param change
  const baseCacheKey = restOptions.cacheKey ?? [];
  const normalizedCacheKey = Array.isArray(baseCacheKey)
    ? baseCacheKey
    : [baseCacheKey];

  // Call the original hook with the enhanced route and extended cacheKey
  const result = useDataApi<TData>({
    ...restOptions,
    cacheKey: [...normalizedCacheKey, routeWithParams],
    route: routeWithParams,
  });

  // Sync search input to URL
  useEffect(() => {
    if (result.search?.searchInput !== undefined) {
      const newParams = new URLSearchParams(searchParams);
      if (result.search.searchInput) {
        newParams.set('search', result.search.searchInput);
      } else {
        newParams.delete('search');
      }

      const currentParams = searchParams.toString();
      const newParamsString = newParams.toString();
      if (currentParams !== newParamsString) {
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [result.search?.searchInput]);

  // Sync filters to URL (filters are applied via route params, not x-pagination-filter header)
  useEffect(() => {
    if (result.filters?.filters) {
      const newParams = new URLSearchParams(searchParams);

      // Remove old filter params
      Array.from(newParams.keys()).forEach((key) => {
        if (key.startsWith('filter_')) {
          newParams.delete(key);
        }
      });

      // Map of datagrid filter keys to their expected API query param names
      const filterToApiMapping: Record<string, string> = {
        'contactOwner.id': 'contactOwner',
        'contactAdministrator.id': 'contactAdministrator',
        'contactTechnical.id': 'contactTechnical',
        'contactBilling.id': 'contactBilling',
        state: 'mainState',
        suspensionState: 'additionalStates',
      };

      // Add current filters, but skip iam.tags (managed by the hook to generate iamTags param)
      result.filters.filters.forEach((filter) => {
        if (filter.value !== undefined && filter.value !== null) {
          const apiParamName = filterToApiMapping[filter.key] || filter.key;
          if (apiParamName === 'iam.tags' || filter.key.startsWith('iam.')) {
            return;
          }

          // Handle array values (for multi-select filters)
          if (Array.isArray(filter.value)) {
            if (filter.value.length > 0) {
              newParams.set(`filter_${apiParamName}`, filter.value.join(','));
            }
          } else {
            newParams.set(`filter_${apiParamName}`, String(filter.value));
          }
        }
      });

      const currentParams = searchParams.toString();
      const newParamsString = newParams.toString();
      if (currentParams !== newParamsString) {
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [result.filters?.filters]);

  return result;
}
