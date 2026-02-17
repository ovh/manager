import { useQuery } from '@tanstack/react-query';

import { subnetQueryKey } from '@/adapters/network/queryKeys';
import { getSubnets } from '@/data/api/network.api';
import { TSubnet } from '@/domain/entities/network.entity';
import { useProjectId } from '@/hooks/useProjectId';
import { SelectOption } from '@/types/select-option';

export const useSubnets = <TData>({
  region,
  networkId,
  options,
}: {
  region: string | undefined;
  networkId: string | undefined;
  options?: SelectOption<TSubnet[], TData>;
}) => {
  const projectId = useProjectId();

  return useQuery<TSubnet[], Error, TData>({
    queryKey: subnetQueryKey(projectId, region ?? '', networkId ?? ''),
    queryFn: () => getSubnets({ projectId, region: region ?? '', networkId: networkId ?? '' }),
    select: options?.select,
    enabled: !!region && !!networkId,
  });
};
