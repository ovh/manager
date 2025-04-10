import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { JobSuggestions } from '@/types/orderFunnel';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import { getSuggestions } from '@/data/api/ai/job/suggestions.api';

export function useGetSuggestions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'suggestion', 'job'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getSuggestions({ projectId }),
    ...options,
  }) as UseQueryResult<JobSuggestions, Error>;
}
