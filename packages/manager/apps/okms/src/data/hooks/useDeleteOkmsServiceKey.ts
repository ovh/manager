import { ApiError } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteOkmsServiceKeyResource,
  deleteOkmsServiceKeyResourceQueryKey,
  getOkmsServiceKeyResourceListQueryKey,
  getOkmsServiceKeyResourceQueryKey,
} from '../api/okmsServiceKey';

export type DeleteOkmsServiceKeyParams = {
  okmsId: string;
  keyId: string;
  onSuccess: () => void;
  onError: () => void;
};

export const useDeleteOkmsServiceKey = ({
  okmsId,
  keyId,
  onSuccess,
  onError,
}: DeleteOkmsServiceKeyParams) => {
  const queryClient = useQueryClient();
  const { addError, addSuccess, clearNotifications } = useNotifications();

  const { t } = useTranslation('key-management-service/serviceKeys');

  const { mutate: deleteKmsServiceKey, isPending } = useMutation({
    mutationKey: deleteOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
    mutationFn: async () => {
      return deleteOkmsServiceKeyResource({ okmsId, keyId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
      });
      await queryClient.invalidateQueries({
        queryKey: getOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
      });
      clearNotifications();
      addSuccess(t('key_management_service_service-keys_delete_success'), true);
      onSuccess();
    },
    onError: (result: ApiError) => {
      clearNotifications();
      addError(
        t('key_management_service_service-keys_delete_error', {
          error: result.message,
        }),
        true,
      );
      onError?.();
    },
  });

  return {
    deleteKmsServiceKey,
    isPending,
  };
};
