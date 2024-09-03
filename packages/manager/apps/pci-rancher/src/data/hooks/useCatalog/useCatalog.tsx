import { useMe } from '@ovhcloud/manager-components';
import { useQuery } from '@tanstack/react-query';
import { getCatalogQuery } from '@/data/api/services';

export const useCatalog = () => {
  const { me } = useMe();
  return useQuery({
    ...getCatalogQuery(me?.ovhSubsidiary),
    enabled: !!me,
  });
};
