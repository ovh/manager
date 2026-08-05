import { useQuery } from '@tanstack/react-query';
import {
  getNetworkCatalog,
  getNetworkCatalogUrl,
  TNetworkCatalog,
} from '@/api/data/catalog/network';

export const useNetworkCatalog = <TSelected = TNetworkCatalog>(
  projectId: string,
  select?: (catalog: TNetworkCatalog) => TSelected,
) =>
  useQuery({
    queryKey: [getNetworkCatalogUrl(projectId)],
    queryFn: () => getNetworkCatalog(projectId),
    select,
  });
