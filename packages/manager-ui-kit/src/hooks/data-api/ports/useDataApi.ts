import { UseDataApiOptions, UseDataApiResult } from '@/hooks/data-api/ports/useDataApi.types';

import { useIceberg } from '../adapters/iceberg/useIceberg';
import { useV2 } from '../adapters/v2/useV2';
import { useV6 } from '../adapters/v6/useV6';

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
  urlParams,
}: UseDataApiOptions<TData>): UseDataApiResult<TData> => {
  const isIceberg = !!iceberg;
  const isV2 = !isIceberg && version === 'v2';
  const isV6 = !isIceberg && !isV2; // default

  const icebergResult = useIceberg<TData>({
    version,
    route,
    pageSize,
    cacheKey,
    enabled: Boolean(enabled && isIceberg),
    defaultSorting: defaultSorting ?? [],
    fetchAll,
    columns,
    disableCache,
  });

  const v2Result = useV2<TData>({
    route,
    pageSize,
    enabled: Boolean(enabled && isV2),
    cacheKey,
    fetchAll,
    urlParams,
    columns,
  });

  const v6Result = useV6<TData>({
    route,
    cacheKey,
    fetchDataFn,
    refetchInterval,
    enabled: Boolean(enabled && isV6),
    pageSize,
    columns,
    defaultSorting,
  });

  return isIceberg ? icebergResult : isV2 ? v2Result : v6Result;
};
