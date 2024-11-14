import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getFramework } from '@/data/api/ai/notebook/capabilities/framework.api';

export function useGetFramework(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'notebook', 'capabilities', 'framework'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getFramework({ projectId }),
    ...options,
  }) as UseQueryResult<ai.notebook.Editor[], Error>;
}
