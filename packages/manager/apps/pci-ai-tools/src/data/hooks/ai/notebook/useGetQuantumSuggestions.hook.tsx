import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import { NotebookSuggestions } from '@/types/orderFunnel';
import { getQuantumSuggestions } from '@/data/api/ai/notebook/quantumSuggestions.api';

export function useGetQuantumSuggestions(
  projectId: string,
  quantumType: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'quantum',
    'suggestion',
    'notebook-quantum',
    quantumType,
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getQuantumSuggestions({ projectId }, quantumType),
    ...options,
  }) as UseQueryResult<NotebookSuggestions, Error>;
}
