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

export type SaveViewsPreferenceMutationParams = {
  views: ViewType[];
};

export type UseSaveViewsPreferenceParams = {
  key: string;
  onError?: (apiError: ApiError) => void;
  onSuccess?: (variables: SaveViewsPreferenceMutationParams) => void;
  onSettled?: () => void;
};

export const useSaveViewsPreference = ({
  key,
  onError,
  onSuccess,
  onSettled,
}: UseSaveViewsPreferenceParams) => {
  const queryClient = useQueryClient();
  const { clearNotifications } = useNotifications();

  return useMutation({
    mutationFn: ({ views }: SaveViewsPreferenceMutationParams) =>
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
