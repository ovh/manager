import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovhcloud/manager-components';
import { getCatalog } from '@/api/data/catalog';

export const getCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: ['catalog'],
  queryFn: () => getCatalog(ovhSubsidiary),
});

export const useCatalog = () => {
  const { me } = useMe();
  return useQuery({
    ...getCatalogQuery(me?.ovhSubsidiary),
    enabled: !!me,
  });
};
