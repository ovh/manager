import {
  getDomainsListByExcludedNicBilling,
  getDomainsListByNicBilling,
  updateDomainNicbilling,
} from '@/domain-reseller/data/api/domains';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetDomainsListByNicBilling = (
  nicBilling: string | undefined,
) => {
  return useQuery({
    queryKey: ['domains', nicBilling],
    queryFn: () => getDomainsListByNicBilling(nicBilling),
    enabled: !!nicBilling,
  });
};

export const useGetDomainsListByExcludedNicBilling = (
  nicBilling: string | undefined,
) => {
  return useQuery({
    queryKey: ['domains', nicBilling],
    queryFn: () => getDomainsListByExcludedNicBilling(nicBilling),
    enabled: !!nicBilling,
  });
};

export const useUpdateDomainNicbilling = () => {
  return useMutation({
    mutationFn: ({
      serviceName,
      nicBilling,
    }: {
      serviceName: string;
      nicBilling: string;
    }) => updateDomainNicbilling(serviceName, nicBilling),
  });
};
