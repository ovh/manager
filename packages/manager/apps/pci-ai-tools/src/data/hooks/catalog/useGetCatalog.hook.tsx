import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { catalogApi } from '@/data/api/catalog/catalog.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import catalog from '@/types/Catalog';
import { useUser } from '@/hooks/useUser';

export function useGetCatalog(
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const user = useUser();
  const product = 'cloud';
  const subsidiary = user?.ovhSubsidiary ?? 'FR';
  const queryKey = ['order/catalog/public/cloud', subsidiary, product];
  return useQueryImmediateRefetch({
    queryKey,
    enabled: !!user?.ovhSubsidiary,
    queryFn: () => catalogApi.getCatalog(subsidiary, product),
    ...options,
  }) as UseQueryResult<catalog.Catalog, Error>;
}
