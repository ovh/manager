import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { catalogApi } from '@/api/catalog';
import { order } from '@/models/catalog';
import { useUser } from '../useUser';
import { useQueryImmediateRefetch } from './useImmediateRefetch';

export function useGetCatalog(
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const user = useUser();
  const product = 'cloud';
  const subsidiary = user?.ovhSubsidiary ?? 'FR';
  const queryKey = ['order/catalog/public/cloud', subsidiary, product];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => catalogApi.getCatalog(subsidiary, product),
    ...options,
  }) as UseQueryResult<order.publicOrder.Catalog, Error>;
}
