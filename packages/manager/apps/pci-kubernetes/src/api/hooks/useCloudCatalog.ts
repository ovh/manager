import { useContext } from 'react';

import { useQuery } from '@tanstack/react-query';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { getCloudCatalog } from '@/api/data/cloudCatalog';
import { TCloudCatalog } from '@/domain/entities/cloudCatalog';
import { TSelectOptions } from '@/types/query';

import { cloudCatalogQueryKey } from '../../adapters/tanstack/cloudCatalog/cloudCatalog.queryKey';

export const useCloudCatalog = <TData>({ select }: TSelectOptions<TCloudCatalog, TData>) => {
  const { environment } = useContext(ShellContext);

  const ovhSubsidiary = environment.getUser()?.ovhSubsidiary ?? '';

  return useQuery({
    queryKey: cloudCatalogQueryKey(ovhSubsidiary),
    queryFn: () => getCloudCatalog(ovhSubsidiary),
    select,
    enabled: !!ovhSubsidiary,
  });
};
