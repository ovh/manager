import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDataApi, SearchProps } from '@ovh-ux/muk';
import { FilterComparator } from '@ovh-ux/manager-core-api';
import {
  FILTER_KEY_TO_API_PARAM,
  MAIN_STATE_ALL_VALUES,
  CURSOR_EXPIRED_ERROR_STATUS,
} from '@/domain/constants/dataApiRouteParams.constants';
import {
  UseDomainDataApiWithRouteParamsOptions,
  UseDomainDataApiWithRouteParamsResult,
  FilterWithLabel,
} from '@/domain/types/dataApiRouteParams.types';

function buildRouteWithParams(
  baseRoute: string,
  searchParams: URLSearchParams,
): string {
  const [basePath, existingQuery] = baseRoute.split('?');
  const params = new URLSearchParams(existingQuery || '');

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
    const isInternalParam = key.startsWith('not_') || key === 'search';

    if (!isInternalParam && !params.has(key)) {
      params.set(key, value);
    }
  });

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

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

  // Cursor expiration recovery state
  const [cursorExpired, setCursorExpired] = useState(false);
  const [collectedBeforeExpiry, setCollectedBeforeExpiry] = useState(0);
  const hasTriggeredRecovery = useRef(false);

  const routeWithParams = useMemo(
    () => buildRouteWithParams(baseRoute, searchParams),
    [baseRoute, searchParams],
  );

  const primaryResult = useDataApi<TData>({
    ...restOptions,
    cacheKey: [routeWithParams],
    route: routeWithParams,
  });

  // Secondary hook for cursor expiration recovery
  // Uses a different cache key and only enabled when cursor expires
  const recoveryResult = useDataApi<TData>({
    ...restOptions,
    cacheKey: [
      routeWithParams,
      'cursor-recovery',
      cursorExpired ? 'active' : 'inactive',
    ],
    route: routeWithParams,
    enabled: cursorExpired,
  });

  // Detect cursor expiration (500 error) and trigger recovery
  // Check on the active result (primary or recovery depending on current mode)
  const activeResult = cursorExpired ? recoveryResult : primaryResult;

  const isCursorExpiredError =
    activeResult.isError &&
    activeResult.error &&
    (activeResult.error as any)?.status === CURSOR_EXPIRED_ERROR_STATUS;

  const hasDataAlreadyLoaded =
    activeResult.flattenData && activeResult.flattenData.length > 0;

  const shouldStartRecovery =
    isCursorExpiredError &&
    hasDataAlreadyLoaded &&
    !hasTriggeredRecovery.current;

  // Trigger recovery
  useEffect(() => {
    if (shouldStartRecovery) {
      hasTriggeredRecovery.current = true;
      const currentData = cursorExpired ? recoveryResult : primaryResult;
      setCollectedBeforeExpiry(currentData.flattenData!.length);

      // If we're already in recovery mode, reset to restart with fresh recovery
      if (cursorExpired) {
        setCursorExpired(false);
      } else {
        setCursorExpired(true);
      }
    }
  }, [shouldStartRecovery, cursorExpired]);

  // Reset recovery flag when data changes (new search, filters, etc.) or when switching modes
  useEffect(() => {
    const activeIsError = cursorExpired
      ? recoveryResult.isError
      : primaryResult.isError;
    if (!activeIsError) {
      hasTriggeredRecovery.current = false;
    }
  }, [
    routeWithParams,
    primaryResult.isError,
    recoveryResult.isError,
    cursorExpired,
  ]);

  // Auto-fetch pages during recovery until we reach the target count
  useEffect(() => {
    const shouldFetchMore =
      cursorExpired &&
      !recoveryResult.isFetching &&
      recoveryResult.hasNextPage &&
      (recoveryResult.flattenData?.length ?? 0) < collectedBeforeExpiry;

    if (shouldFetchMore) {
      void recoveryResult.fetchNextPage();
    }
  }, [
    cursorExpired,
    collectedBeforeExpiry,
    recoveryResult.isFetching,
    recoveryResult.hasNextPage,
  ]);

  useEffect(() => {
    const recoveryDataLength = recoveryResult.flattenData?.length ?? 0;
    const isRecoveryComplete =
      cursorExpired &&
      recoveryResult.flattenData &&
      recoveryDataLength >= collectedBeforeExpiry &&
      collectedBeforeExpiry > 0 &&
      !recoveryResult.isFetching &&
      !recoveryResult.isLoading;

    if (!isRecoveryComplete) {
      return;
    }

    // Fetch the extra page
    if (
      recoveryDataLength === collectedBeforeExpiry &&
      recoveryResult.hasNextPage
    ) {
      void recoveryResult.fetchNextPage();
    } else if (recoveryDataLength > collectedBeforeExpiry) {
      // Recovery complete
      setCollectedBeforeExpiry(0);
    }
  }, [
    cursorExpired,
    recoveryResult.isFetching,
    recoveryResult.isLoading,
    collectedBeforeExpiry,
    recoveryResult.hasNextPage,
  ]);

  // Use recovery data when in recovery mode, otherwise use primary data
  const activeData =
    cursorExpired && recoveryResult.flattenData
      ? recoveryResult.flattenData
      : primaryResult.flattenData;

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

  const getColumnLabel = useCallback(
    (columnId: string): string => {
      const col = columns?.find((c: any) => c.id === columnId);
      return typeof col?.header === 'string' ? col.header : '';
    },
    [columns],
  );

  // translate value to human-readable label
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

  const urlFilters: FilterWithLabel[] = useMemo(() => {
    const filters: FilterWithLabel[] = [];

    Object.entries(FILTER_KEY_TO_API_PARAM).forEach(([columnKey, apiParam]) => {
      const positiveValue = searchParams.get(apiParam);
      const negativeValue = searchParams.get(`not_${apiParam}`);

      if (positiveValue) {
        const values = positiveValue.split(',');
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

      if (negativeValue) {
        const values = negativeValue.split(',');
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

  // Return Combined Result
  return {
    // Spread primary result properties
    ...primaryResult,

    // Override with active data source
    flattenData: activeData,

    // Use recovery pagination when in recovery mode
    fetchNextPage: cursorExpired
      ? recoveryResult.fetchNextPage
      : primaryResult.fetchNextPage,
    hasNextPage: cursorExpired
      ? recoveryResult.hasNextPage
      : primaryResult.hasNextPage,
    isFetching: cursorExpired
      ? recoveryResult.isFetching
      : primaryResult.isFetching,

    // Mask errors during recovery OR when about to start recovery to prevent ErrorBoundary
    isError:
      cursorExpired || shouldStartRecovery ? false : primaryResult.isError,
    error:
      cursorExpired || shouldStartRecovery ? undefined : primaryResult.error,

    // URL params management
    searchParams,
    setSearchParams,

    // Search functionality
    searchProps,

    // Filter functionality
    filtersProps,
  };
}
