import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  getManagerPreferences,
  getManagerPreferencesQueryKey,
} from '@/data/api/manager-preferences';
import { ViewType } from '@/components/manageView/types';

export type UseGetViewsPreferencesParams = {
  key?: string;
  enabled?: boolean;
};

export const useGetViewsPreferences = ({
  key,
  enabled = true,
}: UseGetViewsPreferencesParams) => {
  const { data: preferences, isLoading, isError, error } = useQuery<
    ViewType[],
    ApiError
  >({
    queryKey: getManagerPreferencesQueryKey(key),
    queryFn: () => getManagerPreferences(key),
    enabled,
    retry: false,
  });

  return {
    preferences,
    isLoading,
    isError,
    error,
  };
};
