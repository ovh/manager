import { useV6 } from './ports/v6/useV6';
import { useV2 } from './ports/v2/useV2';
import { useIceberg } from './ports/iceberg/useIceberg';
import { UseDataApiOptions, UseDataApiResult } from './useDataApi.types';

export const useDataApi = <TData extends object = {}, TColumn = unknown>({
  route = '',
  version = 'v6',
  iceberg,
  pageSize,
  queryKey,
  queryFn,
  refetchInterval,
  defaultSorting,
  fetchAll,
  columns = [],
  disableCache,
  enabled,
}: UseDataApiOptions<TData, TColumn>): UseDataApiResult<TData> => {
  if (iceberg) {
    return useIceberg<TData, TColumn>({
      version,
      route,
      pageSize,
      queryKey,
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
      queryKey,
      fetchAll,
    });
  }
  return useV6<TData, TColumn>({
    route,
    queryKey,
    queryFn,
    refetchInterval,
    enabled,
    pageSize,
    columns,
    defaultSorting,
  });
};
