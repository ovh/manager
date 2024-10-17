import { useQuery } from '@tanstack/react-query';
import { getFlavor } from '@/api/data/flavors';
import { TAddon } from '@/pages/create/store';

export const useGetFlavor = (
  projectId: string,
  regionName: string,
  addon: TAddon,
) =>
  useQuery({
    queryKey: [
      'project',
      projectId,
      'region',
      regionName,
      'size',
      addon?.code,
      'flavor',
    ],
    queryFn: () => getFlavor(projectId, regionName, addon),
    enabled: !!projectId && !!regionName && !!addon,
    throwOnError: true,
  });
