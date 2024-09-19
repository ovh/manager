import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovh-ux/manager-react-components';
import { getCatalog } from '../data/catalog';

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
