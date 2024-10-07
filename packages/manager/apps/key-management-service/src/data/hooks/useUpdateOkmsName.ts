import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  getOkmsResourceQueryKey,
  getOkmsServicesResourceListQueryKey,
} from '../api/okms';
import {
  updateOkmsNameQueryKey,
  getOkmsServiceIdQueryKey,
  getOkmsServiceId,
  updateOkmsName,
} from '../api/okmsService';
import { getKMSServiceInfosQueryKey } from './useKMSServiceInfos';

export type UpdateOkmsParams = {
  okmsId: string;
  onSuccess: () => void;
  onError?: (result: ApiError) => void;
};
export type UpdateOkmsNameMutationParams = {
  /** Okms service id */
  okms: string;
  /** Okms service new display name */
  displayName: string;
};

/**
 * Get the function to mutate a okms Services
 */
export const useUpdateOkmsName = ({
  okmsId,
  onSuccess,
  onError,
}: UpdateOkmsParams) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { addError, addSuccess, clearNotifications } = useNotifications();

  const {
    mutate: updateKmsName,
    isPending,
    error: updateNameError,
  } = useMutation({
    mutationKey: updateOkmsNameQueryKey(),
    mutationFn: async ({ okms, displayName }: UpdateOkmsNameMutationParams) => {
      const { data: servicesId } = await queryClient.fetchQuery<
        ApiResponse<number[]>
      >({
        queryKey: getOkmsServiceIdQueryKey(okms),
        queryFn: () => getOkmsServiceId(okms),
      });
      return updateOkmsName({ serviceId: servicesId[0], displayName });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getOkmsServicesResourceListQueryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getKMSServiceInfosQueryKey(okmsId),
      });
      await queryClient.invalidateQueries({
        queryKey: getOkmsResourceQueryKey(okmsId),
      });
      clearNotifications();
      addSuccess(
        t('key_management_service_service-keys_update_name_success'),
        true,
      );
      onSuccess?.();
    },
    onError: (result: ApiError) => {
      clearNotifications();
      addError(
        t('key_management_service_service-keys_update_error', {
          error: result.message,
        }),
        true,
      );
      onError?.(result);
    },
  });

  return {
    updateKmsName,
    isPending,
    error: updateNameError,
  };
};
