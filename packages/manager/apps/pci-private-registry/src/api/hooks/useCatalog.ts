import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovhcloud/manager-components';
import { getCatalog } from '@/api/data/catalog';

export const useGetCatalog = () => {
  const { me } = useMe();
  return useQuery({
    queryKey: ['catalog'],
    queryFn: () => getCatalog(me.ovhSubsidiary),
    enabled: !!me,
  });
};
