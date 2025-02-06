import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import { useQueryImmediateRefetch } from '../../useImmediateRefetch';
import { JobSuggestions } from '@/types/orderFunnel';
import { getSuggestions } from '@/data/api/ai/job/suggestions.api';

export function useGetSuggestions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'job', 'suggestions'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getSuggestions(/* { projectId } */),
    ...options,
  }) as UseQueryResult<JobSuggestions[], Error>;
}
