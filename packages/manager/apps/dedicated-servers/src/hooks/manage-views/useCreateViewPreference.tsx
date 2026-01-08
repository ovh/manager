import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  getManagerPreferencesQueryKey,
  postManagerPreferences,
} from '@/data/api/manager-preferences';

export type ViewType = {
  name: string;
  id: string;
  default?: boolean;
};

export type CreateViewsPreferenceMutationParams = {
  views: ViewType[];
};

export type UseCreateViewsPreferenceParams = {
  key: string;
  onError?: (apiError: ApiError) => void;
  onSuccess?: (variables: CreateViewsPreferenceMutationParams) => void;
  onSettled?: () => void;
};

export const useCreateViewsPreference = ({
  key,
  onError,
  onSuccess,
  onSettled,
}: UseCreateViewsPreferenceParams) => {
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();

  return useMutation({
    mutationFn: ({ views }: CreateViewsPreferenceMutationParams) =>
      postManagerPreferences({
        key,
        value: JSON.stringify(views),
      }),
    onSuccess: async (_, variables) => {
      clearNotifications();
      await queryClient.invalidateQueries({
        queryKey: getManagerPreferencesQueryKey(),
      });
      onSuccess?.(variables);
    },
    onError: (error: ApiError) => {
      clearNotifications();
      onError?.(error);
    },
    onSettled,
  });
};
