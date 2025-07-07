import { useQuery } from '@tanstack/react-query';
import { getDomainResource } from '@/domain/data/api/domain-resources';
import { TDomainResource } from '@/domain/types/domainResource';

export const useGetDomainResource = (serviceName: string) => {
  const { data, isLoading, error } = useQuery<TDomainResource>({
    queryKey: ['domain', 'resource', serviceName],
    queryFn: () => getDomainResource(serviceName),
  });
  return {
    domainResource: data,
    isFetchingDomainResource: isLoading,
    domainResourceError: error,
  };
};
