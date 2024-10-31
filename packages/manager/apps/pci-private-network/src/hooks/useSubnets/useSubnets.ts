import { useMemo } from 'react';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { TSubnet } from '@/types/network.type';
import { useSubnets as useSubnetsQuery } from '@/data/hooks/networks/useNetworks';

type GetSubnets = {
  isLoading: boolean;
  subnets: TSubnet[];
};

export default function useSubnets(
  projectId: string,
  networkId: string,
  region: string,
  filters: Filter[] = [],
): GetSubnets {
  const { data, isPending: isLoading } = useSubnetsQuery(
    projectId,
    networkId,
    region,
  );

  return useMemo(
    () => ({
      isLoading,
      subnets: applyFilters(data || [], filters),
    }),
    [data, filters],
  );
}
