import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovh-ux/manager-react-components';
import { getCatalog } from '@ovh-ux/manager-pci-common';

export const getCloudCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: ['public-cloud-catalog', ovhSubsidiary],
  queryFn: () => getCatalog(ovhSubsidiary, 'cloud'),
});

export const useCloudCatalog = () => {
  const { me } = useMe();
  return useQuery({
    ...getCloudCatalogQuery(me?.ovhSubsidiary),
    enabled: !!me,
  });
};
