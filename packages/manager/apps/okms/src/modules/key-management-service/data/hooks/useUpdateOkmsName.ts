import { OKMS } from '@key-management-service/types/okms.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import { okmsQueryKeys } from '../api/okms';
import {
  getOkmsServiceId,
  getOkmsServiceIdQueryKey,
  updateOkmsName,
  updateOkmsNameQueryKey,
} from '../api/okmsService';

export type UpdateOkmsParams = {
  okms: OKMS;
  onSuccess: () => void;
  onError?: (result: ApiError) => void;
};
export type UpdateOkmsNameMutationParams = {
  /** Okms service new display name */
  displayName: string;
};

/**
 * Get the function to mutate a okms Services
 */
export const useUpdateOkmsName = ({ okms, onSuccess, onError }: UpdateOkmsParams) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation([NAMESPACES.ACTIONS, NAMESPACES.ERROR]);
  const { addSuccess, clearNotifications } = useNotifications();

  const {
    mutate,
    isPending,
    error: updateNameError,
  } = useMutation({
    mutationKey: updateOkmsNameQueryKey(),
    mutationFn: async ({ displayName }: UpdateOkmsNameMutationParams) => {
      const servicesId = await queryClient.fetchQuery<number[]>({
        queryKey: getOkmsServiceIdQueryKey(okms.id),
        queryFn: () => getOkmsServiceId(okms.id),
      });
      if (!servicesId?.[0]) {
        throw new Error('Service ID not found');
      }
      return updateOkmsName({ serviceId: servicesId[0], displayName });
    },
    onSuccess: (_, { displayName }) => {
      const previousData = queryClient.getQueryData<{ data: OKMS }>(okmsQueryKeys.detail(okms.id));

      // To handle the delay in which the new name is propagated to the OKMS databases, we need to:
      // 1. Optimistically update the OKMS domain cache so that the user sees the new name on the OKMS dashboard immediately.
      if (previousData?.data) {
        queryClient.setQueryData<OKMS>(okmsQueryKeys.detail(okms.id), {
          ...previousData.data,
          iam: {
            ...previousData.data.iam,
            displayName,
          },
        });
      }

      // 2. Invalidate the OKMS list query so that the list is refetched when the user returns to it.
      queryClient
        .invalidateQueries({
          queryKey: okmsQueryKeys.listDatagrid,
        })
        .catch((error) => console.error(error));

      // 3. Invalidate the OKMS list and detail queries after a delay to synchronize the front-end cache with the back-end.
      setTimeout(() => {
        queryClient
          .invalidateQueries({
            queryKey: okmsQueryKeys.detail(okms.id),
          })
          .catch((error) => console.error(error));

        // Invalidate the list query again to handle the case where the user returns to the list before the data is propagated in the back-end.
        void queryClient
          .invalidateQueries({
            queryKey: okmsQueryKeys.listDatagrid,
          })
          .catch((error) => console.error(error));
      }, 3000);

      clearNotifications();
      addSuccess(t('modify_name_success', { ns: NAMESPACES.ACTIONS }), true);
      onSuccess?.();
    },
    onError: (result: ApiError) => {
      onError?.(result);
    },
  });

  return {
    updateOkmsName: mutate,
    isPending,
    error: updateNameError,
  };
};
