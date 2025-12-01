import { getMePreferencesQueryKey, getMePreferences, addMePreferences } from "@/data/api/preferences";
import { ApiError } from "@ovh-ux/manager-core-api";
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";

export const useMePreferences = (preferenceKey: string): UseQueryResult<boolean, ApiError> => useQuery({
    queryKey: getMePreferencesQueryKey(preferenceKey),
    queryFn: () => getMePreferences(preferenceKey),
  });


export const useAddMePreferences = (preferenceKey: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (value: boolean) => addMePreferences(preferenceKey, value),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: getMePreferencesQueryKey(preferenceKey) });
    },
  });
};
