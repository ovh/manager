import { useQuery } from '@tanstack/react-query';

import { sharesQueryKey } from '@/adapters/shares/queryKeys';
import { getShares } from '@/data/api/shares.api';
import { TShare } from '@/domain/entities/share.entity';
import { useProjectId } from '@/hooks/useProjectId';
import { SelectOption } from '@/types/select-option';

import { getForceReloadUseQueryOptions } from '../utils';

export const useShares = <TData>(options?: SelectOption<TShare[], TData>) => {
  const projectId = useProjectId();

  return useQuery<TShare[], Error, TData>({
    queryKey: sharesQueryKey(projectId),
    queryFn: () => getShares(projectId),
    enabled: !!projectId,
    select: options?.select,
    ...getForceReloadUseQueryOptions(),
    throwOnError: true,
  });
};
