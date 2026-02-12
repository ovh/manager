import { useQuery } from '@tanstack/react-query';

import { shareDetailsQueryKey } from '@/adapters/shares/queryKeys';
import { getShare } from '@/data/api/shares.api';
import { getForceReloadUseQueryOptions } from '@/data/hooks/utils';
import { TShare } from '@/domain/entities/share.entity';
import { useProjectId } from '@/hooks/useProjectId';
import { SelectOption } from '@/types/select-option';

export const useShare = <TData>(
  region: string | undefined,
  shareId: string | undefined,
  options?: SelectOption<TShare, TData>,
) => {
  const projectId = useProjectId();

  return useQuery<TShare, Error, TData>({
    queryKey: shareDetailsQueryKey(projectId ?? '', region ?? '', shareId ?? ''),
    queryFn: () => getShare(projectId, region as string, shareId as string),
    enabled: !!projectId && !!region && !!shareId,
    select: options?.select,
    ...getForceReloadUseQueryOptions(),
    retry: 1,
  });
};
