import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovhcloud/manager-components';
import { getCloudCatalog, getCloudCatalogUrl } from '@/api/data/cloud-catalog';

export const getCloudCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: [getCloudCatalogUrl(ovhSubsidiary)],
  queryFn: () => getCloudCatalog(ovhSubsidiary),
});

export const useCloudCatalog = () => {
  const { me } = useMe();
  return useQuery({
    ...getCloudCatalogQuery(me?.ovhSubsidiary),
    enabled: !!me,
  });
};
