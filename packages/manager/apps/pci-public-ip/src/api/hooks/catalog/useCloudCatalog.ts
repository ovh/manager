import { useQuery } from '@tanstack/react-query';
import {
  getCloudCatalog,
  getCloudCatalogUrl,
} from '@/api/data/catalog/public/cloud';
import { useMe } from '@/api/hooks/useMe';

export const getCloudCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: [getCloudCatalogUrl(ovhSubsidiary)],
  queryFn: () => getCloudCatalog(ovhSubsidiary),
});

export const useCloudCatalog = () => {
  const { me } = useMe();
  return useQuery({
    ...getCloudCatalogQuery(me?.ovhSubsidiary),
    enabled: !!me?.ovhSubsidiary,
  });
};
