import { useQuery } from '@tanstack/react-query';

import { useMe } from '@ovh-ux/manager-react-components';

import { productAvailabilityQueryKey } from '@/adapters/tanstack/productAvailability/productAvailability.queryKey';
import { TRegions } from '@/domain/entities/regions';
import { useParam } from '@/hooks/useParam';
import { TSelectOptions } from '@/types/query';

import { getAvailabilityRegions } from '../data/available-regions';

export const useAvailabilityRegions = <TData>({ select }: TSelectOptions<TRegions, TData>) => {
  const { me } = useMe();
  const projectId = useParam('projectId');

  return useQuery({
    queryKey: productAvailabilityQueryKey(projectId, {
      addonFamily: 'mks',
      ovhSubsidiary: me?.ovhSubsidiary ?? '',
    }),
    queryFn: () =>
      getAvailabilityRegions(projectId, {
        addonFamily: 'mks',
        ovhSubsidiary: me?.ovhSubsidiary ?? '',
      }),
    enabled: !!me,
    select,
  });
};
