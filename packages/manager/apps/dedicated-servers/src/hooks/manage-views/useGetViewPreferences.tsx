import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  getManagerPreferences,
  getManagerPreferencesQueryKey,
  GetManagerPreferencesResponse,
} from '@/data/api/manager-preferences';

export type UseGetViewsPreferencesParams = {
  key?: string;
  enabled?: boolean;
};

export const useGetViewsPreferences = ({
  key,
  enabled = true,
}: UseGetViewsPreferencesParams) => {
  const { data, isLoading, isError, error } = useQuery<
    ApiResponse<GetManagerPreferencesResponse>,
    ApiError
  >({
    queryKey: getManagerPreferencesQueryKey(key),
    queryFn: () => getManagerPreferences(key),
    enabled,
    retry: false,
  });

  return {
    preferences: data?.data,
    isLoading,
    isError,
    error,
  };
};
