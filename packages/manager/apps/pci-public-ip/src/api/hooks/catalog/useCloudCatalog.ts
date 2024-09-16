import { useQuery } from '@tanstack/react-query';
import { getCloudCatalog } from '@/api/data/catalog/public/cloud';
import { useMe } from '@/api/hooks/useMe';

export const getCloudCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: ['public-cloud-catalog', ovhSubsidiary],
  queryFn: () => getCloudCatalog(ovhSubsidiary),
});

export const useCloudCatalog = () => {
  const { me } = useMe();
  return useQuery({
    ...getCloudCatalogQuery(me?.ovhSubsidiary),
    enabled: !!me?.ovhSubsidiary,
  });
};
