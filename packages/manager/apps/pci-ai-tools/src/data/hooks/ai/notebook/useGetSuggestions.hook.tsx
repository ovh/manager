import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getSuggestions } from '@/data/api/ai/notebook/suggestions.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import { Suggestions } from '@/types/orderFunnel';

export function useGetSuggestions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'suggestion', 'notebook'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getSuggestions(/* { projectId } */),
    ...options,
  }) as UseQueryResult<Suggestions[], Error>;
}
