import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovh-ux/manager-react-components';
import { getCatalog, getCatalogUrl } from '@/api/data/catalog';

export const getCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: [getCatalogUrl(ovhSubsidiary)],
  queryFn: () => getCatalog(ovhSubsidiary),
});

export const useCatalog = () => {
  const { me } = useMe();
  return useQuery({
    ...getCatalogQuery(me?.ovhSubsidiary),
    enabled: !!me,
  });
};
