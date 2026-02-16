import { getDomainsListByNicBilling } from '@/domain-reseller/data/api/domains';
import { useQuery } from '@tanstack/react-query';

export const useGetDomainsList = (resellerNicAdmin: string) => {
  return useQuery({
    queryKey: ['domains', resellerNicAdmin],
    queryFn: () => getDomainsListByNicBilling(resellerNicAdmin),
    enabled: !!resellerNicAdmin,
  });
};
