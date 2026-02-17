import { useQuery } from '@tanstack/react-query';

import { networkDetailsQueryKey } from '@/adapters/network/queryKeys';
import { getNetwork } from '@/data/api/network.api';
import { TNetwork } from '@/domain/entities/network.entity';
import { useProjectId } from '@/hooks/useProjectId';
import { SelectOption } from '@/types/select-option';

export const useNetwork = <TData>(
  region: string | undefined,
  networkId: string | undefined,
  options?: SelectOption<TNetwork, TData>,
) => {
  const projectId = useProjectId();

  return useQuery<TNetwork, Error, TData>({
    queryKey: networkDetailsQueryKey(projectId, region ?? '', networkId ?? ''),
    queryFn: () => getNetwork({ projectId, region: region!, networkId: networkId! }),
    enabled: !!region && !!networkId,
    select: options?.select,
  });
};
