import { useQuery } from '@tanstack/react-query';
import { getFlavor } from '@/api/data/flavors';
import { Addon } from '@/types/addon.type';

export const useGetFlavor = (
  projectId: string,
  regionName: string,
  addon: Addon,
) =>
  useQuery({
    queryKey: [
      'project',
      projectId,
      'region',
      regionName,
      'size',
      addon?.size,
      'flavor',
    ],
    queryFn: () => getFlavor(projectId, regionName, addon),
    enabled: !!projectId && !!regionName && !!addon,
  });
