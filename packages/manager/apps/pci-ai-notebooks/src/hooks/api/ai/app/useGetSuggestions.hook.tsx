import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import { useQueryImmediateRefetch } from '../../useImmediateRefetch';
import { getSuggestions } from '@/data/api/ai/app/suggestions.api';
import { AppSuggestions } from '@/types/orderFunnel';

export function useGetSuggestions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'app', 'suggestions'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getSuggestions(/* { projectId } */),
    ...options,
  }) as UseQueryResult<AppSuggestions[], Error>;
}
