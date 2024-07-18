import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getSuggestions } from '@/data/api/database/availability.api';

export function useGetSuggestions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/availability/suggestions'];
  return useQuery({
    queryKey,
    queryFn: () => getSuggestions(projectId),
    ...options,
  }) as UseQueryResult<database.Suggestion[], Error>;
}
