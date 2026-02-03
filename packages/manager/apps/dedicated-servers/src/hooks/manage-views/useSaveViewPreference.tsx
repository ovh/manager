import { useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  getManagerPreferencesQueryKey,
  postManagerPreferences,
} from '@/data/api/manager-preferences';
import { ViewContext } from '@/components/manageView/viewContext';
import { STANDARD_VIEW_ID } from '@/components/manageView/manageView.constants';
import { ViewType } from '@/components/manageView/types';

export type SaveViewsPreferenceMutationParams = {
  view: ViewType;
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
  const { views, columnVisibility, columnsConfig } = useContext(ViewContext);
  const { clearNotifications } = useNotifications();

  return useMutation({
    mutationFn: ({ view }: SaveViewsPreferenceMutationParams) => {
      const currentDefault = views.find((_view) => _view.default);
      if (view.default && currentDefault) currentDefault.default = false;

      const updatedView = {
        ...view,
        columnVisibility,
        columnOrder: columnsConfig.map((column) => column.id),
      };

      const updatedViews = [
        ...views.filter(
          (_view) =>
            _view.id !== updatedView.id &&
            _view.id !== currentDefault?.id &&
            _view.id !== STANDARD_VIEW_ID,
        ),
        ...(![STANDARD_VIEW_ID, updatedView.id].includes(currentDefault?.id)
          ? [currentDefault]
          : []),
        updatedView,
      ];

      return postManagerPreferences({
        key,
        value: JSON.stringify(updatedViews),
      });
    },
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
