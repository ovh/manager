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

      // Optimistically update the OKMS domain cache
      queryClient.setQueryData(okmsQueryKeys.detail(okms.id), {
        data: {
          ...previousData.data,
          iam: {
            ...previousData.data.iam,
            displayName,
          },
        },
      });

      queryClient.invalidateQueries({
        queryKey: okmsQueryKeys.listDatagrid,
      });

      // Wait for the renaming to be effective in the backend before refetching the data
      setTimeout(async () => {
        queryClient.invalidateQueries({
          queryKey: okmsQueryKeys.detail(okms.id),
        });
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
