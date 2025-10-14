import { useQuery } from '@tanstack/react-query';

import { getRegionFlavors } from '@/api/data/flavors';

export const useRegionFlavors = (projectId: string, region?: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions', region, 'flavors'],
    queryFn: () => getRegionFlavors(projectId, region),
    enabled: !!region,
    throwOnError: true,
  });
