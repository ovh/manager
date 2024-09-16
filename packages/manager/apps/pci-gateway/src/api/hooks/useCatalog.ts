import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovh-ux/manager-react-components';
import { getCatalog } from '@ovh-ux/manager-pci-common';

export const getCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: ['public-cloud-catalog', ovhSubsidiary],
  queryFn: () => getCatalog(ovhSubsidiary, 'cloud'),
});

export const useCatalog = () => {
  const { me } = useMe();
  return useQuery({
    ...getCatalogQuery(me?.ovhSubsidiary),
    enabled: !!me,
  });
};
