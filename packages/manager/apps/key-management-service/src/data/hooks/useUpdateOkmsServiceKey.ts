import { ApiError } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OkmsServiceKeyPutPayload } from '@/types/okmsServiceKey.type';
import {
  getOkmsServiceKeyResourceListQueryKey,
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
  const { addError, clearNotifications } = useNotifications();

  const { t } = useTranslation('key-management-service/serviceKeys');

  const { mutate: updateKmsServiceKey, isPending } = useMutation({
    mutationKey: updateOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
    mutationFn: async (data: OkmsServiceKeyPutPayload) => {
      return updateOkmsServiceKeyResource({ okmsId, keyId, data });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
      });
      await queryClient.invalidateQueries({
        queryKey: getOkmsServiceKeyResourceQueryKey({ okmsId, keyId }),
      });
      onSuccess();
    },
    onError: (result: ApiError) => {
      clearNotifications();
      addError(
        t('key_management_service_service-keys_update_error', {
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
