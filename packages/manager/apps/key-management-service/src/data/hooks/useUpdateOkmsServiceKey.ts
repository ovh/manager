import { ApiError } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovhcloud/manager-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OkmsServiceKeyPutPayload } from '@/types/okmsServiceKey.type';
import {
  getOkmsServiceKeyResourceQueryKey,
  updateOkmsServiceKeyResource,
  updateOkmsServiceKeyResourceQueryKey,
} from '../api/okmsServiceKey';

export type UpdateOkmsServiceKeyParams = {
  okmsId: string;
  keyId: string;
  onSuccess: () => void;
  onError: () => void;
};

export const useUpdateOkmsServiceKey = ({
  okmsId,
  keyId,
  onSuccess,
  onError,
}: UpdateOkmsServiceKeyParams) => {
  const queryClient = useQueryClient();
  const { addError, addSuccess } = useNotifications();

  const { t } = useTranslation('key-management-service/serviceKeys');

  const { mutate: updateKmsServiceKey, isPending } = useMutation({
    mutationKey: updateOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
    mutationFn: async (data: OkmsServiceKeyPutPayload) => {
      return updateOkmsServiceKeyResource({ okmsId, keyId, data });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
      });
      addSuccess(
        t('key_management_service_service-keys_update_name_success'),
        true,
      );
      onSuccess();
    },
    onError: (result: ApiError) => {
      addError(
        t('key_management_service_service-keys_update_name_error', {
          error: result.message,
        }),
        true,
      );
      onError?.();
    },
  });

  return {
    updateKmsServiceKey,
    isPending,
  };
};
