import { catalogApi } from '@/data/api/catalog/catalog.api';
import { useUser } from '@/hooks/useUser';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';

export function useGetCatalog(
  options?: OptionsFor<typeof catalogApi.getCatalog>,
) {
  const user = useUser();
  const product = 'databases';
  const subsidiary = user?.ovhSubsidiary ?? 'FR';
  const queryKey = ['order/catalog/public/cloud', subsidiary, product];
  return useQueryImmediateRefetch({
    queryKey,
    enabled: !!user?.ovhSubsidiary,
    queryFn: () => catalogApi.getCatalog(subsidiary, product),
    ...options,
  });
}
