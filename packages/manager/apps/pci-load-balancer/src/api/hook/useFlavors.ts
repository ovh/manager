import { useQuery } from '@tanstack/react-query';
import { getFlavors } from '@/api/data/flavors';
import { TProductAddonDetail } from '@/types/product.type';
import { queryKeyBuilder } from '@/utils/query';

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
    queryFn: () => getFlavors(projectId, region),
    enabled: !!projectId && !!region && !!addon,
    select: (flavors) =>
      flavors.find(({ name }) => name === addon.technicalName),
  });
