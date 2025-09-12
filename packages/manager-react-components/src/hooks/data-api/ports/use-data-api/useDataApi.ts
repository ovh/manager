import { useV6 } from '../../adapters/v6/useV6';
import { useV2 } from '../../adapters/v2/useV2';
import { useIceberg } from '../../adapters/iceberg/useIceberg';
import { UseDataApiOptions, UseDataApiResult } from './useDataApi.types';

export const useDataApi = <TData = Record<string, unknown>>({
  route = '',
  version = 'v6',
  iceberg,
  pageSize,
  cacheKey,
  fetchDataFn,
  refetchInterval,
  defaultSorting,
  fetchAll,
  columns = [],
  disableCache,
  enabled,
}: UseDataApiOptions<TData>): UseDataApiResult<TData> => {
  if (iceberg) {
    return useIceberg<TData>({
      version,
      route,
      pageSize,
      cacheKey,
      enabled,
      defaultSorting,
      fetchAll,
      columns,
      disableCache,
    });
  }
  if (version === 'v2') {
    return useV2<TData>({
      route,
      pageSize,
      enabled,
      cacheKey,
      fetchAll,
    });
  }
  return useV6<TData>({
    route,
    cacheKey,
    fetchDataFn,
    refetchInterval,
    enabled,
    pageSize,
    columns,
    defaultSorting,
  });
};
