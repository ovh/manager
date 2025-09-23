import { getSuggestions } from '@/data/api/database/availability.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '../../useImmediateRefetch';

export function useGetSuggestions(
  projectId: string,
  options?: OptionsFor<typeof getSuggestions>,
) {
  const queryKey = [projectId, 'database/availability/suggestions'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getSuggestions(projectId),
    ...options,
  });
}
