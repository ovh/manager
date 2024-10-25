import { ApiError } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OkmsServiceKeyPostPayload } from '@/types/okmsServiceKey.type';
import {
  createOkmsServiceKeyResource,
  getOkmsServiceKeyResourceListQueryKey,
} from '../api/okmsServiceKey';

export type CreateOkmsServiceKeyParams = {
  okmsId: string;
  onSuccess: () => void;
  onError: () => void;
};

export const useCreateOkmsServiceKey = ({
  okmsId,
  onSuccess,
  onError,
}: CreateOkmsServiceKeyParams) => {
  const queryClient = useQueryClient();
  const { addError, addSuccess, clearNotifications } = useNotifications();

  const { t } = useTranslation('key-management-service/serviceKeys');

  const { mutate: createKmsServiceKey, isPending } = useMutation({
    mutationFn: (data: OkmsServiceKeyPostPayload) => {
      return createOkmsServiceKeyResource({ okmsId, data });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
      });
      clearNotifications();
      addSuccess(t('key_management_service_service-keys_create_success'), true);
      onSuccess?.();
    },
    onError: (result: ApiError) => {
      clearNotifications();
      addError(
        t('key_management_service_service-keys_create_error', {
          error: result.message,
        }),
        true,
      );
      onError?.();
    },
  });

  return {
    createKmsServiceKey,
    isPending,
  };
};
