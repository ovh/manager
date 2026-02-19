import {
  getDomainsListByExcludedNicBilling,
  getDomainsListByNicBilling,
  updateDomainNicbilling,
} from '@/domain-reseller/data/api/domains';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type DomainSettledResult = {
  result: PromiseSettledResult<void>;
  domain: string;
};

export const useGetDomainsListByResellerNicAdmin = (
  resellerNicAdmin: string,
) => {
  return useQuery({
    queryKey: ['domainsByNicBilling', resellerNicAdmin],
    queryFn: () => getDomainsListByNicBilling(resellerNicAdmin),
    enabled: !!resellerNicAdmin,
  });
};

export const useGetDomainsListByExcludedResellerNicAdmin = (
  nicBilling: string,
) => {
  return useQuery({
    queryKey: ['domainsExcludedNicBilling', nicBilling],
    queryFn: () => getDomainsListByExcludedNicBilling(nicBilling),
    enabled: !!nicBilling,
  });
};

/** Runs billing contact change for multiple domains in parallel and returns results correlated with domain names */
export const useUpdateDomainsNicbilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      serviceNames,
      nicBilling,
    }: {
      serviceNames: string[];
      nicBilling: string;
    }): Promise<DomainSettledResult[]> => {
      const results = await Promise.allSettled(
        serviceNames.map((serviceName) =>
          updateDomainNicbilling(serviceName, nicBilling),
        ),
      );
      return results.map((result, i) => ({ result, domain: serviceNames[i] }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['domainsByNicBilling'] });
      queryClient.invalidateQueries({
        queryKey: ['domainsExcludedNicBilling'],
      });
    },
  });
};
