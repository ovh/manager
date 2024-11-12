import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import { useQueryImmediateRefetch } from '../../useImmediateRefetch';
import { getSuggestions } from '@/data/api/ai/notebook/suggestions.api';
import { Suggestions } from '@/types/orderFunnel';

export function useGetSuggestions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'notebook', 'suggestions'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getSuggestions({ projectId }),
    ...options,
  }) as UseQueryResult<Suggestions[], Error>;
}
