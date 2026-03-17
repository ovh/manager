import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  getManagerPreferencesQueryKey,
  postManagerPreferences,
} from '@/data/api/manager-preferences';
import { ViewContext } from '@/components/manageView/viewContext';
import {
  PREFERENCES_KEY,
  STANDARD_VIEW_ID,
} from '@/components/manageView/manageView.constants';
import { ViewType } from '@/components/manageView/types';

export type DeleteViewPreferenceMutationParams = {
  view: ViewType;
};

export type UseDeleteViewPreferenceParams = {
  onError?: (apiError: ApiError) => void;
  onSuccess?: (variables: DeleteViewPreferenceMutationParams) => void;
  onSettled?: () => void;
};

export const useDeleteViewPreference = ({
  onError,
  onSuccess,
  onSettled,
}: UseDeleteViewPreferenceParams) => {
  const queryClient = useQueryClient();
  const { views, setCurrentView } = useContext(ViewContext);
  const { clearNotifications } = useNotifications();

  return useMutation({
    mutationFn: ({ view }: DeleteViewPreferenceMutationParams) => {
      const updatedViews = [
        ...views.filter(
          (_view) => _view.id !== view.id && _view.id !== STANDARD_VIEW_ID,
        ),
      ];

      return postManagerPreferences({
        key: PREFERENCES_KEY,
        value: JSON.stringify(updatedViews),
      });
    },
    onSuccess: async (_, variables) => {
      clearNotifications();
      setCurrentView(null);
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
