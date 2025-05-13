import {
  DefinedInitialDataOptions,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { createPreferences, fetchPreferences } from '@/api/preferences';

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
  value: unknown,
  invalidateQueries = true,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createPreferences(key, value),
    onSuccess: () => {
      if (invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: ['preferences', key] });
      }
    },
  });
};
