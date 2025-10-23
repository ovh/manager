import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { okmsQueryKeys } from '../api/okms';
import {
  updateOkmsNameQueryKey,
  getOkmsServiceIdQueryKey,
  getOkmsServiceId,
  updateOkmsName,
} from '../api/okmsService';
import { OKMS } from '@/types/okms.type';

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
export const useUpdateOkmsName = ({
  okms,
  onSuccess,
  onError,
}: UpdateOkmsParams) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation([NAMESPACES.ACTIONS, NAMESPACES.ERROR]);
  const { addSuccess, clearNotifications } = useNotifications();

  const { mutate, isPending, error: updateNameError } = useMutation({
    mutationKey: updateOkmsNameQueryKey(),
    mutationFn: async ({ displayName }: UpdateOkmsNameMutationParams) => {
      const { data: servicesId } = await queryClient.fetchQuery<
        ApiResponse<number[]>
      >({
        queryKey: getOkmsServiceIdQueryKey(okms.id),
        queryFn: () => getOkmsServiceId(okms.id),
      });
      return updateOkmsName({ serviceId: servicesId[0], displayName });
    },
    onSuccess: (_, { displayName }) => {
      const previousData = queryClient.getQueryData<{ data: OKMS }>(
        okmsQueryKeys.detail(okms.id),
      );

      // To handle the delay in which the new name is propagated to the OKMS databases, we need to:
      // 1. Optimistically update the OKMS domain cache so that the user sees the new name on the OKMS dashboard immediately.
      queryClient.setQueryData(okmsQueryKeys.detail(okms.id), {
        data: {
          ...previousData.data,
          iam: {
            ...previousData.data.iam,
            displayName,
          },
        },
      });

      // 2. Invalidate the OKMS list query so that the list is refetched when the user returns to it.
      queryClient.invalidateQueries({
        queryKey: okmsQueryKeys.listDatagrid,
      });

      // 3. Invalidate the OKMS list and detail queries after a delay to synchronize the front-end cache with the back-end.
      setTimeout(async () => {
        queryClient.invalidateQueries({
          queryKey: okmsQueryKeys.detail(okms.id),
        });
        // Invalidate the list query again to handle the case where the user returns to the list before the data is propagated in the back-end.
        queryClient.invalidateQueries({
          queryKey: okmsQueryKeys.listDatagrid,
        });
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
