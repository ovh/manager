import {
  DefinedInitialDataOptions,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { createPreferences, fetchPreferences } from '@/data/api/preferences';

export const usePreferences = (
  preference: string,
  options: Partial<DefinedInitialDataOptions<unknown>> = {},
): UseQueryResult<unknown> =>
  useQuery({
    ...options,
    queryKey: ['preferences', preference],
    queryFn: () => fetchPreferences(preference),
    refetchOnWindowFocus: false,
  });

export const useCreatePreference = (
  key: string,
  invalidateQueries = true,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: unknown) => createPreferences(key, value),
    onSuccess: () => {
      if (invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: ['preferences', key] });
      }
    },
  });
};
