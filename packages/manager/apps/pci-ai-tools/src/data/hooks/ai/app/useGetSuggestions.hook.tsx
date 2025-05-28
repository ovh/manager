import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getSuggestions } from '@/data/api/ai/app/suggestions.api';
import { AppSuggestions } from '@/types/orderFunnel';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetSuggestions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'suggestion', 'app'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getSuggestions({ projectId }),
    ...options,
  }) as UseQueryResult<AppSuggestions, Error>;
}
