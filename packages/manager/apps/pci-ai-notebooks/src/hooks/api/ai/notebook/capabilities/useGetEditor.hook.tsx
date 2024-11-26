import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getEditor } from '@/data/api/ai/notebook/capabilities/editor.api';

export function useGetEditor(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'notebook', 'capabilities', 'editor'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getEditor({ projectId }),
    ...options,
  }) as UseQueryResult<ai.notebook.Editor[], Error>;
}
