import { useQuery } from '@tanstack/react-query';
import { getFlavor } from '@/api/data/flavors';
import { TProductAddonDetail } from '@/types/product.type';
import { queryKeyBuilder } from '@/utils/utils';

export const useGetFlavor = (
  projectId: string,
  region: string,
  addon?: TProductAddonDetail,
) =>
  useQuery({
    queryKey: queryKeyBuilder(projectId, region, [
      'size',
      addon?.size,
      'flavor',
    ]),
    queryFn: () => getFlavor(projectId, region),
    enabled: !!projectId && !!region && !!addon,
    select: (flavors) =>
      flavors.find(({ name }) => name === addon.technicalName),
  });
