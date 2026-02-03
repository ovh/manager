import { useCallback, useEffect } from 'react';

import { FilterComparator, FilterTypeCategories, fetchV2 } from '@ovh-ux/manager-core-api';
import type { FetchV2Result, Filter } from '@ovh-ux/manager-core-api';

import type { DatagridColumn } from '@/components/datagrid/Datagrid.props';
import type { FilterWithLabel } from '@/components/filters/Filter.props';
import { DEFAULT_DATA_API_RESPONSE } from '@/hooks/data-api/ports/useDataApi.constants';
import { UseDataApiResult } from '@/hooks/data-api/ports/useDataApi.types';
import { filterEquals } from '@/hooks/data-api/utils/DataApi.utils';

import { UseInifiniteQueryResult, useInfiniteQuery } from '../../infra/tanstack';
import { useDataRetrievalOperations } from '../../useDataRetrievalOperations';
import type { UseV2Data, UseV2Params } from './useV2.types';

export const useV2 = <TData = Record<string, unknown>>({
  route = '',
  pageSize = 10,
  fetchAll = false,
  cacheKey,
  enabled,
  urlParams,
  columns = [] as DatagridColumn<TData>[],
}: UseV2Params<TData>): UseDataApiResult<TData> => {
  const defaultSorting = undefined;
  const retrievalOps = useDataRetrievalOperations<TData>({ defaultSorting, columns });

  const { filters, addFilter, removeFilter, setSearchInput, searchInput } = retrievalOps;

  const getParamValues = useCallback((value: string | string[] | undefined): string[] => {
    if (value == null) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  }, []);

  const { data, hasNextPage, fetchNextPage, ...rest }: UseInifiniteQueryResult<UseV2Data<TData>> =
    useInfiniteQuery<FetchV2Result<TData>, Error, UseV2Data<TData>, string[], string>({
      initialPageParam: '',
      cacheKey: [...cacheKey, fetchAll ? 'all' : String(pageSize)],
      enabled: enabled ?? true,
      fetchDataFn: ({ pageParam: cursor }): Promise<FetchV2Result<TData>> =>
        fetchV2<TData>({
          route,
          pageSize,
          ...(!!cursor && typeof cursor === 'string' && { cursor }),
        }),
      getNextPageParam: (lastPage: FetchV2Result<TData>): string | null => {
        if (lastPage.nextCursor) {
          return lastPage.nextCursor;
        }
        return null;
      },
      transformFn: (pages): UseV2Data<TData> => {
        const { totalCount } = pages[0] as FetchV2Result;
        return {
          flattenData: pages.flatMap((page) => page.data),
          totalCount,
        };
      },
    });

  useEffect(() => {
    if (fetchAll && hasNextPage && enabled) {
      void fetchNextPage();
    }
  }, [data, fetchAll, hasNextPage, fetchNextPage, enabled]);

  useEffect(() => {
    if (Object.keys(urlParams?.params ?? {}).length > 0) {
      const keysUrlParams = Object.keys(urlParams?.params ?? {});
      keysUrlParams.forEach((key) => {
        if (key === urlParams?.searchParams) {
          const rawValue = urlParams?.params[key];
          const searchValue = Array.isArray(rawValue) ? rawValue[0] : rawValue;
          if (searchInput !== searchValue) {
            setSearchInput(searchValue ?? '');
          }
          return;
        }
      });
    }
  }, []);

  useEffect(() => {
    const params = urlParams?.params;
    if (!params || Object.keys(params).length === 0) {
      return;
    }

    const existingFilters = new Set(
      filters.map((filter) => `${filter.key}::${String(filter.value)}`),
    );
    const keysUrlParams = Object.keys(params).filter((key) => key !== urlParams?.searchParams);

    for (const key of keysUrlParams) {
      const column = columns.find((currentColumn) => currentColumn.id === key);
      const values = getParamValues(params[key]).filter((value) => value !== '');
      for (const value of values) {
        const signature = `${key}::${value}`;
        if (!existingFilters.has(signature)) {
          existingFilters.add(signature);
          addFilter({
            key: key,
            value,
            comparator: FilterComparator.IsEqual,
            type: FilterTypeCategories.String,
            label: column?.label ?? key,
          });
        }
      }
    }
  }, [urlParams, filters, addFilter, columns, getParamValues]);

  const addParamsInUrl = useCallback(
    (filter: FilterWithLabel) => {
      if (!urlParams?.params) {
        return;
      }
      if (filter.key in urlParams.params) {
        const value = filter.value;
        if (value == null) {
          return;
        }

        const nextValues = Array.isArray(value) ? value : [value];
        const cleanedValues = nextValues.filter((item) => item !== '');
        if (cleanedValues.length === 0) {
          return;
        }

        const existingValues = getParamValues(urlParams.params[filter.key]).filter(
          (item) => item !== '',
        );
        const mergedValues = Array.from(new Set([...existingValues, ...cleanedValues]));
        urlParams.setParams({ [filter.key]: mergedValues });
      }
    },
    [urlParams, getParamValues],
  );

  const addFilterAndParamsInUrl = useCallback(
    (filter: FilterWithLabel) => {
      addParamsInUrl(filter);
      addFilter(filter);
    },
    [addFilter, addParamsInUrl],
  );

  const removeUrlParams = useCallback(
    (filter: Filter) => {
      if (!urlParams?.params) {
        return;
      }

      if (!(filter.key in urlParams.params)) {
        return;
      }

      const existingValues = getParamValues(urlParams.params[filter.key]).filter(
        (item) => item !== '',
      );
      if (existingValues.length === 0) {
        urlParams.deleteParams(filter.key);
        return;
      }

      const valuesToRemove = Array.isArray(filter.value) ? filter.value : [filter.value];
      const remainingValues = existingValues.filter((item) => !valuesToRemove.includes(item));

      if (remainingValues.length === 0) {
        urlParams.deleteParams(filter.key);
        return;
      }

      urlParams.setParams({ [filter.key]: remainingValues });
    },
    [urlParams, getParamValues],
  );

  const removeFilterByCoreFilter = useCallback(
    (filter: Filter) => {
      if (!urlParams?.params) {
        return;
      }
      if (filter.key in urlParams.params) {
        const matchingFilter = filters.find((existingFilter) =>
          filterEquals(existingFilter, filter),
        );
        removeUrlParams(filter);
        if (matchingFilter) {
          removeFilter(matchingFilter);
        }
      }
    },
    [urlParams, filters, removeFilter, removeUrlParams],
  );

  const onSearch = useCallback(
    (search: string | undefined) => {
      if (urlParams?.searchParams) {
        urlParams.setParams({ [urlParams.searchParams]: search ?? '' });
      }
    },
    [urlParams],
  );

  if (!enabled) {
    return DEFAULT_DATA_API_RESPONSE;
  }

  return {
    ...(data && { ...data }),
    hasNextPage,
    fetchNextPage,
    search: {
      onSearch: onSearch,
      searchInput,
      setSearchInput: setSearchInput,
      searchParams: urlParams?.searchParams ?? '',
    },
    filters: {
      filters,
      add: addFilterAndParamsInUrl,
      remove: removeFilterByCoreFilter,
    },
    ...rest,
  };
};
