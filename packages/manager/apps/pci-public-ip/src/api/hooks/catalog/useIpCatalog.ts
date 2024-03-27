import { useQuery } from '@tanstack/react-query';
import { getIpCatalog, getIpCatalogUrl } from '@/api/data/catalog/formatted/ip';
import { useMe } from '@/api/hooks/useMe';

export const getIpCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: [getIpCatalogUrl(ovhSubsidiary)],
  queryFn: () => getIpCatalog(ovhSubsidiary),
});

export const useIpCatalog = () => {
  const { me } = useMe();
  return useQuery({
    ...getIpCatalogQuery(me?.ovhSubsidiary),
    enabled: !!me?.ovhSubsidiary,
  });
};
