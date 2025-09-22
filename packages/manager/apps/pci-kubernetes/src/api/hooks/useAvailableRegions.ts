import { useQuery } from '@tanstack/react-query';

import { useMe } from '@ovh-ux/manager-react-components';

import { getAvailableRegions } from '@/api/data/available-regions';

export const useAvailableRegions = (projectId: string) => {
  const { me } = useMe();
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['project', projectId, 'availableRegions'],
    queryFn: () =>
      getAvailableRegions(projectId, me.ovhSubsidiary, 'kubernetes').then((data) =>
        data.products
          .find((product) => product.name === 'kubernetes')
          .regions.filter((region) => region.type === 'region'),
      ),
    throwOnError: true,
    enabled: !!me,
  });
};
