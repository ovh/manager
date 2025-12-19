import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDataApi } from '@ovh-ux/muk';
import { UseDataApiOptions, UseDataApiResult } from '@ovh-ux/muk';
import { SearchProps } from '@ovh-ux/muk';
import { FilterComparator } from '@ovh-ux/manager-core-api';

type UseDomainDataApiWithRouteParamsOptions<TData> = Omit<
  UseDataApiOptions<TData>,
  'route'
> & {
  baseRoute: string;
  columns?: unknown[];
};

type FilterWithLabel = {
  key: string;
  value: string | string[];
  comparator: FilterComparator;
  label: string;
};

export type UseDomainDataApiWithRouteParamsResult<TData> = UseDataApiResult<
  TData
> & {
  searchProps: SearchProps;
  filtersProps: {
    filters: FilterWithLabel[];
    add: (filter: FilterWithLabel) => void;
    remove: (filter: FilterWithLabel) => void;
  };
};

const FILTER_KEY_TO_API_PARAM: Record<string, string> = {
  'contactOwner.id': 'contactOwner',
  'contactAdmin.id': 'contactAdministrator',
  'contactTech.id': 'contactTechnical',
  'contactBilling.id': 'contactBilling',
  state: 'mainState',
  suspensionState: 'additionalStates',
};

export function useDomainDataApiWithRouteParams<
  TData = Record<string, unknown>
>(
  options: UseDomainDataApiWithRouteParamsOptions<TData>,
): UseDomainDataApiWithRouteParamsResult<TData> {
  const [searchParams, setSearchParams] = useSearchParams();
  const { baseRoute, columns = [], ...restOptions } = options;

  const [searchInput, setSearchInput] = useState<string>(
    searchParams.get('search') || '',
  );

  const routeWithParams = useMemo(() => {
    const params = new URLSearchParams();

    const searchValue = searchParams.get('search');
    if (searchValue) {
      params.set('searchValue', searchValue);
    }

    Object.entries(FILTER_KEY_TO_API_PARAM).forEach(([, apiParam]) => {
      const value = searchParams.get(`filter_${apiParam}`);
      if (value) {
        params.set(apiParam, value);
      }
    });

    searchParams.forEach((value, key) => {
      if (!key.startsWith('filter_') && key !== 'search' && !params.has(key)) {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    return queryString ? `${baseRoute}?${queryString}` : baseRoute;
  }, [baseRoute, searchParams]);

  const baseCacheKey = restOptions.cacheKey ?? [];
  const normalizedCacheKey = Array.isArray(baseCacheKey)
    ? baseCacheKey
    : [baseCacheKey];

  const hookResult = useDataApi<TData>({
    ...restOptions,
    cacheKey: [...normalizedCacheKey, routeWithParams],
    route: routeWithParams,
  });

  const getColumnLabel = (columnId: string): string => {
    const col = columns?.find((c: any) => c.id === columnId);
    return typeof col?.header === 'string' ? col.header : '';
  };

  const updateUrlParams = (
    updater: (params: URLSearchParams) => void,
  ): void => {
    const next = new URLSearchParams(searchParams);
    updater(next);
    setSearchParams(next, { replace: true });
  };

  const searchProps: SearchProps = {
    onSearch: (value?: string) => {
      updateUrlParams((params) => {
        if (value && value.length > 0) {
          params.set('search', value);
        } else {
          params.delete('search');
        }
      });
      setSearchInput(value ?? '');
    },
    searchInput,
    setSearchInput,
  };

  const urlFilters: FilterWithLabel[] = useMemo(() => {
    return Object.entries(FILTER_KEY_TO_API_PARAM)
      .map(([columnKey, apiParam]) => {
        const value = searchParams.get(`filter_${apiParam}`);
        if (!value) return null;

        return {
          key: columnKey,
          value: value.includes(',') ? value.split(',') : value,
          comparator: FilterComparator.IsEqual,
          label: getColumnLabel(columnKey),
        };
      })
      .filter((f): f is FilterWithLabel => f !== null);
  }, [searchParams, columns]);

  const filtersProps = {
    filters: urlFilters,
    add: (filter: FilterWithLabel) => {
      const apiParam = FILTER_KEY_TO_API_PARAM[filter.key] ?? filter.key;
      updateUrlParams((params) => {
        const value = Array.isArray(filter.value)
          ? filter.value.join(',')
          : String(filter.value);
        if (value) {
          params.set(`filter_${apiParam}`, value);
        }
      });
    },
    remove: (filter: FilterWithLabel) => {
      const apiParam = FILTER_KEY_TO_API_PARAM[filter.key] ?? filter.key;
      updateUrlParams((params) => {
        params.delete(`filter_${apiParam}`);
      });
    },
  };

  return {
    ...hookResult,
    searchProps,
    filtersProps,
  };
}
