import { useQuery } from '@tanstack/react-query';
import { getIpCatalog } from '@/api/data/catalog/formatted/ip';

export const useFailoverCatalog = (ovhSubsidiary: string) =>
  useQuery({
    queryKey: ['ip-failover-catalog', ovhSubsidiary],
    queryFn: () => getIpCatalog(ovhSubsidiary),
    select: (data) => data.plans[0],
  });
