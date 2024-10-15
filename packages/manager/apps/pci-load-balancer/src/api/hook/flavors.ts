import { useQuery } from '@tanstack/react-query';
import { TPlan } from '@/pages/create/store';
import { getFlavor } from '@/api/data/flavors';

export const useGetFlavor = (
  projectId: string,
  regionName: string,
  size: TPlan,
) =>
  useQuery({
    queryKey: [
      'project',
      projectId,
      'region',
      regionName,
      'size',
      size?.code,
      'flavor',
    ],
    queryFn: () => getFlavor(projectId, regionName, size),
    enabled: !!projectId && !!regionName && !!size,
    throwOnError: true,
  });
