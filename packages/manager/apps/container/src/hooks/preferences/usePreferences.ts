import { DefinedInitialDataOptions, useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchPreferences } from '@/api/preferences';

export const usePreferences = (preference: string, options: Partial<DefinedInitialDataOptions<any>> = {}): UseQueryResult<any> => useQuery({
  ...options,
  queryKey: ['preferences', preference],
  queryFn: () => fetchPreferences(preference),
  refetchOnWindowFocus: false,
});
