import { useQuery } from '@tanstack/react-query';

import { getSubnetsAdapter } from '@/adapters/apiV6/network/getSubnets.adapter';
import { subnetQueryKey } from '@/adapters/network/queryKeys';
import { getSubnetsUseCase } from '@/application/useCases/getSubnets/getSubnets.useCase';
import { TSubnet } from '@/domain/entities/network.entity';
import { useProjectId } from '@/hooks/useProjectId';
import { SelectOption } from '@/types/select-option';

export const useSubnets = <TData>(
  region: string | undefined,
  networkId: string | undefined,
  options?: SelectOption<TSubnet[], TData>,
) => {
  const projectId = useProjectId();
  const getSubnets = getSubnetsUseCase(getSubnetsAdapter);

  return useQuery<TSubnet[], Error, TData>({
    queryKey: subnetQueryKey(projectId, region ?? '', networkId ?? ''),
    queryFn: () => getSubnets({ projectId, region: region ?? '', networkId: networkId ?? '' }),
    enabled: !!region && !!networkId,
    select: options?.select,
  });
};
