import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getSuggestions } from '@/data/api/database/availability.api';
import { useQueryImmediateRefetch } from '../../useImmediateRefetch';

export function useGetSuggestions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/availability/suggestions'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getSuggestions(projectId),
    ...options,
  }) as UseQueryResult<database.availability.Suggestion[], Error>;
}
