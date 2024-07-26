import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { catalogApi } from '@/data/api/catalog/catalog.api';
import { order } from '@/types/catalog';
import { useUser } from '@/hooks/useUser';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

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
