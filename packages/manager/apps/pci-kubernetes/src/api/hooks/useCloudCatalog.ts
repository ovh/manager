import { useQuery } from '@tanstack/react-query';

import { useMe } from '@ovh-ux/manager-react-components';

import { getCloudCatalog } from '@/api/data/cloudCatalog';
import { TCloudCatalog } from '@/domain/entities/cloudCatalog';
import { TSelectOptions } from '@/types/query';

import { cloudCatalogQueryKey } from '../../adapters/tanstack/cloudCatalog/cloudCatalog.queryKey';

export const useCloudCatalog = <TData>({ select }: TSelectOptions<TCloudCatalog, TData>) => {
  const { me } = useMe();

  const ovhSubsidiary = me?.ovhSubsidiary ?? '';

  return useQuery({
    queryKey: cloudCatalogQueryKey(ovhSubsidiary),
    queryFn: () => getCloudCatalog(ovhSubsidiary),
    select,
  });
};
