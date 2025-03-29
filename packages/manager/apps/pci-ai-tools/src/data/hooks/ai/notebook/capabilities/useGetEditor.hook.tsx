import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getEditor } from '@/data/api/ai/notebook/capabilities/editor.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import ai from '@/types/AI';

export function useGetEditor(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'notebook', 'capabilities', 'editor'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getEditor({ projectId }),
    ...options,
  }) as UseQueryResult<ai.capabilities.notebook.Editor[], Error>;
}
