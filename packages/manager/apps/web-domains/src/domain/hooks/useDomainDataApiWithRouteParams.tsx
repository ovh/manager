import { useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useDataApi,
  UseDataApiOptions,
  UseDataApiResult,
  SearchProps,
} from '@ovh-ux/muk';
import { FilterComparator } from '@ovh-ux/manager-core-api';
import { DomainStateEnum } from '@/domain/enum/domainState.enum';

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
  data?: TData[];
  searchParams: URLSearchParams;
  setSearchParams: (
    params: URLSearchParams,
    options?: { replace?: boolean },
  ) => void;
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
  suspensionState: 'suspensionState',
};

const MAIN_STATE_ALL_VALUES = Object.values(DomainStateEnum);

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

    Object.entries(FILTER_KEY_TO_API_PARAM).forEach(([columnKey, apiParam]) => {
      const value = searchParams.get(apiParam);
      if (value) {
        value.split(',').forEach((v) => params.append(apiParam, v));
      }
    });

    Object.entries(FILTER_KEY_TO_API_PARAM).forEach(([columnKey, apiParam]) => {
      const notValue = searchParams.get(`not_${apiParam}`);
      if (notValue) {
        const excludedValues = notValue.split(',');
        if (columnKey === 'state') {
          MAIN_STATE_ALL_VALUES.filter(
            (v) => !excludedValues.includes(v),
          ).forEach((v) => params.append('mainState', v));
        }
      }
    });

    searchParams.forEach((value, key) => {
      if (!key.startsWith('not_') && key !== 'search' && !params.has(key)) {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    return queryString ? `${baseRoute}?${queryString}` : baseRoute;
  }, [baseRoute, searchParams]);

  const cacheKey = [routeWithParams];

  const hookResult = useDataApi<TData>({
    ...restOptions,
    cacheKey,
    route: routeWithParams,
  });

  const getColumnLabel = useCallback(
    (columnId: string): string => {
      const col = columns?.find((c: any) => c.id === columnId);
      return typeof col?.header === 'string' ? col.header : '';
    },
    [columns],
  );

  const getFilterValueLabel = useCallback(
    (columnId: string, value: string): string => {
      const col = columns?.find((c: any) => c.id === columnId);
      const option = col?.filterOptions?.find(
        (opt: any) => opt.value === value,
      );
      return option?.label ?? value;
    },
    [columns],
  );

  const updateUrlParams = useCallback(
    (updater: (params: URLSearchParams) => void): void => {
      const next = new URLSearchParams(searchParams);
      updater(next);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const onSearch = useCallback(
    (value?: string) => {
      updateUrlParams((params) => {
        if (value && value.length > 0) {
          params.set('search', value);
        } else {
          params.delete('search');
        }
      });
      setSearchInput(value ?? '');
    },
    [updateUrlParams],
  );

  const searchProps: SearchProps = useMemo(
    () => ({
      onSearch,
      searchInput,
      setSearchInput,
    }),
    [onSearch, searchInput],
  );

  const urlFilters: FilterWithLabel[] = useMemo(() => {
    const filters: FilterWithLabel[] = [];

    Object.entries(FILTER_KEY_TO_API_PARAM).forEach(([columnKey, apiParam]) => {
      const value = searchParams.get(apiParam);
      const notValue = searchParams.get(`not_${apiParam}`);

      if (value) {
        const values = value.split(',');
        const translatedValues = values.map((v) =>
          getFilterValueLabel(columnKey, v),
        );
        filters.push({
          key: columnKey,
          value:
            translatedValues.length === 1
              ? translatedValues[0]
              : translatedValues,
          comparator: FilterComparator.IsEqual,
          label: getColumnLabel(columnKey),
        });
      }

      if (notValue) {
        const values = notValue.split(',');
        const translatedValues = values.map((v) =>
          getFilterValueLabel(columnKey, v),
        );
        filters.push({
          key: columnKey,
          value:
            translatedValues.length === 1
              ? translatedValues[0]
              : translatedValues,
          comparator: FilterComparator.IsDifferent,
          label: getColumnLabel(columnKey),
        });
      }
    });

    return filters;
  }, [searchParams, getColumnLabel, getFilterValueLabel]);

  const addFilter = useCallback(
    (filter: FilterWithLabel) => {
      const apiParam = FILTER_KEY_TO_API_PARAM[filter.key] ?? filter.key;
      const value = Array.isArray(filter.value)
        ? filter.value.join(',')
        : String(filter.value);

      updateUrlParams((params) => {
        if (value) {
          if (filter.comparator === FilterComparator.IsDifferent) {
            params.set(`not_${apiParam}`, value);
            params.delete(apiParam);
          } else {
            params.set(apiParam, value);
            params.delete(`not_${apiParam}`);
          }
        }
      });
    },
    [updateUrlParams],
  );

  const removeFilter = useCallback(
    (filter: FilterWithLabel) => {
      const apiParam = FILTER_KEY_TO_API_PARAM[filter.key] ?? filter.key;
      updateUrlParams((params) => {
        params.delete(apiParam);
        params.delete(`not_${apiParam}`);
      });
    },
    [updateUrlParams],
  );

  const filtersProps = useMemo(
    () => ({
      filters: urlFilters,
      add: addFilter,
      remove: removeFilter,
    }),
    [urlFilters, addFilter, removeFilter],
  );

  return {
    ...hookResult,
    searchParams,
    setSearchParams,
    searchProps,
    filtersProps,
  };
}
