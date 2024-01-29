import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { catalogApi } from '@/data/catalogapi';
import { order } from '@/models/catalog';

export function useGetCatalog(options: QueryObserverOptions = {}) {
  // TODO: get user subsidiary
  const product = 'cloud';
  const subsidiary = 'FR';
  const queryKey = ['order/catalog/public/cloud', subsidiary, product];
  return useQuery({
    queryKey,
    queryFn: () => catalogApi.getCatalog(subsidiary, product),
    ...options,
  }) as UseQueryResult<order.publicOrder.Catalog, Error>;
}
