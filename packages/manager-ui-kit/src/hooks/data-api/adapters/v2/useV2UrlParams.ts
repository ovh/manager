import { useCallback, useEffect } from 'react';

import { FilterComparator, FilterTypeCategories } from '@ovh-ux/manager-core-api';
import type { Filter } from '@ovh-ux/manager-core-api';

import type { DatagridColumn } from '@/components/datagrid/Datagrid.props';
import type { FilterWithLabel } from '@/components/filters/Filter.props';
import { filterEquals } from '@/hooks/data-api/utils/DataApi.utils';

import type { UseV2Params } from './useV2.types';

type UseV2UrlParamsOptions<TData> = {
  urlParams?: UseV2Params<TData>['urlParams'];
  columns: DatagridColumn<TData>[];
  filters: FilterWithLabel[];
  addFilter: (filter: FilterWithLabel) => void;
  removeFilter: (filter: Filter) => void;
  setSearchInput: (search: string) => void;
  searchInput: string;
};

export const useV2UrlParams = <TData = Record<string, unknown>>({
  urlParams,
  columns,
  filters,
  addFilter,
  removeFilter,
  setSearchInput,
  searchInput,
}: UseV2UrlParamsOptions<TData>) => {
  const getParamValues = useCallback((value: string | string[] | undefined): string[] => {
    if (value == null) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  }, []);

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

  return {
    addFilterAndParamsInUrl,
    removeFilterByCoreFilter,
    onSearch,
  };
};
