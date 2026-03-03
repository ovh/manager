import { useQuery } from '@tanstack/react-query';

import { aclsQueryKey } from '@/adapters/acl/queryKeys';
import { getAcls } from '@/data/api/acl.api';
import { getForceReloadUseQueryOptions } from '@/data/hooks/utils';
import { TAcl } from '@/domain/entities/acl.entity';
import { useProjectId } from '@/hooks/useProjectId';
import { SelectOption } from '@/types/select-option';

export const useAcls = <TData>(
  region: string | undefined,
  shareId: string | undefined,
  options?: SelectOption<TAcl[], TData>,
) => {
  const projectId = useProjectId();

  return useQuery<TAcl[], Error, TData>({
    queryKey: aclsQueryKey(projectId ?? '', region ?? '', shareId ?? ''),
    queryFn: () => getAcls(projectId, region ?? '', shareId ?? ''),
    enabled: !!projectId && !!region && !!shareId,
    select: options?.select,
    ...getForceReloadUseQueryOptions(),
    retry: 1,
  });
};
