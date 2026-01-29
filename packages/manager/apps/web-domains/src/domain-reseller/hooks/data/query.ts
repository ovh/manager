import { getDomainsListByNicBilling } from '@/domain-reseller/data/api/domains';
import { useQuery } from '@tanstack/react-query';

export const useGetDomainsList = (nicBilling: string | undefined) => {
  return useQuery({
    queryKey: ['domains', nicBilling],
    queryFn: () => getDomainsListByNicBilling(nicBilling),
    enabled: !!nicBilling,
  });
};
