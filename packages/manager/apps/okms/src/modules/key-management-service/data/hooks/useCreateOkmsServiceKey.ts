import { OkmsServiceKeyPostPayload } from '@key-management-service/types/okmsServiceKey.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import {
  createOkmsServiceKeyResource,
  getOkmsServiceKeyResourceListQueryKey,
} from '../api/okmsServiceKey';

export type CreateOkmsServiceKeyParams = {
  okmsId: string;
};

export const useCreateOkmsServiceKey = ({ okmsId }: CreateOkmsServiceKeyParams) => {
  const queryClient = useQueryClient();
  const { addError, addSuccess, clearNotifications } = useNotifications();

  const { t } = useTranslation('key-management-service/serviceKeys');

  const { mutateAsync: createKmsServiceKey, isPending } = useMutation({
    mutationFn: (data: OkmsServiceKeyPostPayload) => createOkmsServiceKeyResource({ okmsId, data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getOkmsServiceKeyResourceListQueryKey(okmsId),
      });
      clearNotifications();
      addSuccess(t('key_management_service_service-keys_create_success'), true);
    },
    onError: (result: ApiError) => {
      clearNotifications();
      addError(
        t('key_management_service_service-keys_create_error', {
          error: result.message,
        }),
        true,
      );
    },
  });

  return {
    createKmsServiceKey,
    isPending,
  };
};
