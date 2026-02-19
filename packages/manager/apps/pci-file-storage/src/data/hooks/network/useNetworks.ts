import { useQuery } from '@tanstack/react-query';

import { networksQueryKey } from '@/adapters/network/queryKeys';
import { getNetworks } from '@/data/api/network.api';
import { TNetwork } from '@/domain/entities/network.entity';
import { useProjectId } from '@/hooks/useProjectId';
import { SelectOption } from '@/types/select-option';

export const useNetworks = <TData>(
  region: string | undefined,
  options?: SelectOption<TNetwork[], TData>,
) => {
  const projectId = useProjectId();

  return useQuery<TNetwork[], Error, TData>({
    queryKey: networksQueryKey(projectId, region ?? ''),
    queryFn: () => getNetworks({ projectId, region: region! }),
    enabled: !!region,
    select: options?.select,
    retry: 1,
  });
};
