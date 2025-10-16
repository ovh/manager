import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import { NotebookSuggestions } from '@/types/orderFunnel';
import { getQuantumSuggestions } from '@/data/api/ai/notebook/quantumSuggestions.api';

export function useGetQuantumSuggestions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'suggestion', 'notebook'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getQuantumSuggestions({ projectId }),
    ...options,
  }) as UseQueryResult<NotebookSuggestions, Error>;
}
